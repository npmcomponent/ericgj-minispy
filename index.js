var stub = require('ministub')
  , Enum = require('enumerable)
  , noop = function(){}

var callId = 0;

module.exports = Spy;

function Spy(fn){
  if (!(this instanceof Spy)) return new Spy(fn);
  this._calls = [];
  this.callIds = [];
  this.fn = fn;
  return this;
}

Spy.prototype.watch = function(){
  var ret, payload = {};
  payload.arguments = [].slice.call(arguments,0);
  this.callIds.push(callId++);
  try {
    payload.returnValue = ret = this.fn.apply(this.fn,arguments);
  } catch (e) {
    payload.exception = e;
    throw e;
  } finally {
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
  return Enumerable(this._calls);
}

Spy.prototype.callCount = function(){
  return this._calls.length;
}

Spy.prototype.called = function(n){
  n = n || 1
  return this._calls.length >= n;
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
  this.calls().any(function(act){
    return deepEqual(act.arguments, args);
  }
}

Spy.prototype.calledWith = function(){
  var args = [].slice.call(arguments,0);
  this.calls().any(function(act){
    for (var i=0;i<act.arguments.length;++i){
      if (!deepEqual(act[i],args[i]) return false;
    }
    return true;
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
