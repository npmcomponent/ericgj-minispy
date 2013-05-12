var Enum;
try {
  Enum = require('enumerable');            // component require
} catch(e) {
  Enum = require('enumerable-component');  // npm require fallback
}
var noop = function(){}

var callId = 0;

module.exports = Spy;

function Spy(fn){
  if (!(this instanceof Spy)) return new Spy(fn);
  this._calls = [];
  this.callIds = [];
  this.fn = fn || noop;
  return this;
}

Spy.prototype.watch = function(){
  var ret, payload = {};
  payload.arguments = [].slice.call(arguments,0);
  try {
    payload.returnValue = ret = this.fn.apply(this.fn,arguments);
  } catch (e) {
    payload.exception = e;
    throw e;
  } finally {
    this.callIds.push(callId++);
    this._calls.push(payload);
  }
  return ret;
}

Spy.prototype.stub = function(meth,block){
  var obj = this.fn;
  this.fn = this.fn[meth];
  this[meth] = this.watch;
  try {
    stub(obj,meth,this,block);
  } finally {
    delete this[meth];
  }
  return this;
}


Spy.prototype.calls = function(){
  return Enum(this._calls);
}

Spy.prototype.callCount = function(){
  return this._calls.length;
}

Spy.prototype.called = function(n){
  n = n || 1
  return this._calls.length >= n;
}

Spy.prototype.notCalled = function(n){
  return !this.called(n);
}

Spy.prototype.calledExactly = function(n){
  return this._calls.length == n;
}

Spy.prototype.calledOnce = function(){
  return this.calledExactly(1);
}

Spy.prototype.firstCall = function(){
  return this._calls[0];
}

Spy.prototype.lastCall = function(){
  return this._calls[this._calls.length-1];
}

Spy.prototype.getCall = function(i){
  return this._calls[i];
}

Spy.prototype.calledWithExactly = function(){
  var args = [].slice.call(arguments,0);
  return this.calls().any(function(act){
    return deepEqual(act.arguments, args);
  });
}

Spy.prototype.alwaysCalledWithExactly = function(){
  var args = [].slice.call(arguments,0);
  return this.calls().all(function(act){
    return deepEqual(act.arguments, args);
  });
}

Spy.prototype.calledWith = function(){
  var args = [].slice.call(arguments,0);
  if (!this.called()) return false;
  return this.calls().any(function(act){
    if (act.arguments.length == 0) return (args.length == 0);
    for (var i=0;i<args.length;++i){
      if (!deepEqual(act.arguments[i],args[i])) return false;
    }
    return true;
  });
}

Spy.prototype.alwaysCalledWith = function(){
  var args = [].slice.call(arguments,0);
  if (!this.called()) return false;
  return this.calls().all(function(act){
    if (act.arguments.length == 0) return (args.length == 0);
    for (var i=0;i<args.length;++i){
      if (!deepEqual(act.arguments[i],args[i])) return false;
    }
    return true;
  });
}

Spy.prototype.neverCalledWith = function(){
  return !this.calledWith.apply(this,arguments);
}

Spy.prototype.threw = function(err){
  if (!err) {
    return this.calls().any('exception');
  } else if (typeof err == 'string') {
    return this.calls().any('exception == "' + err + '"');
  } else {
    return this.calls().any(function(c){
      return deepEqual(c.exception, err);
    });
  }
}

Spy.prototype.alwaysThrew = function(err){
  if (!err) {
    return this.calls().all('exception');
  } else if (typeof err == 'string') {
    return this.calls().all('exception == "' + err + '"');
  } else {
    return this.calls().all(function(c){
      return deepEqual(c.exception, err);
    });
  }
}

Spy.prototype.calledBefore = function(other){
  if (!this.called()) return false;
  if (!other.called()) return true;
  return this.callIds[0] < 
         other.callIds[other.callIds.length - 1];
}

Spy.prototype.calledAfter = function(other){
  if (!this.called() || !other.called()) return false;
  return this.callIds[this.callIds.length - 1] > 
         other.callIds[other.callIds.length - 1];
}



// private

// utilities borrowed from sinon.js for deepEqual

var div = typeof document != "undefined" && document.createElement('div');

function isDOMNode(obj) {
  var success = false;

  try {
      obj.appendChild(div);
      success = div.parentNode == obj;
  } catch (e) {
      return false;
  } finally {
      try {
          obj.removeChild(div);
      } catch (e) {
          // Remove failed, not much we can do about that
      }
  }

  return success;
}

function isElement(obj) {
  return div && obj && obj.nodeType === 1 && isDOMNode(obj);
}    
    
function deepEqual(a, b) {
  if (typeof a != "object" || typeof b != "object") {
      return a === b;
  }

  if (isElement(a) || isElement(b)) {
      return a === b;
  }

  if (a === b) {
      return true;
  }

  if ((a === null && b !== null) || (a !== null && b === null)) {
      return false;
  }

  var aString = Object.prototype.toString.call(a);
  if (aString != Object.prototype.toString.call(b)) {
      return false;
  }

  if (aString == "[object Array]") {
      if (a.length !== b.length) {
          return false;
      }

      for (var i = 0, l = a.length; i < l; i += 1) {
          if (!deepEqual(a[i], b[i])) {
              return false;
          }
      }

      return true;
  }

  var prop, aLength = 0, bLength = 0;

  for (prop in a) {
      aLength += 1;

      if (!deepEqual(a[prop], b[prop])) {
          return false;
      }
  }

  for (prop in b) {
      bLength += 1;
  }

  return aLength == bLength;
}


// temporarily inlined until ministub released to npm

var stub = function(obj, name, val_or_fn, fn){
  try {
    var newName = "__ministub__" + name;
    obj[newName] = obj[name];
    obj[name] = function(){
      if (typeof val_or_fn == 'function') {
        return val_or_fn.apply(this, arguments);
      } else {
        return val_or_fn;
      }
    };

    return fn(obj);

  } finally {
    obj[name] = obj[newName];
    delete obj[newName];
  }
}
