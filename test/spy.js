
/* mocha spy.js --ui exports */

var Spy = require('../index.js');
var assert = require('assert');

function spyCalledTests(method) {
    return {
        beforeEach: function () {
            this.spy = Spy();
        },

        "returns false if spy was not called": function () {
            assert.equal( this.spy[method](1, 2, 3), false);
        },

        "returns true if spy was called with args": function () {
            this.spy.watch(1, 2, 3);

            assert(this.spy[method](1, 2, 3));
        },

        "returns true if called with args at least once": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(1, 2, 3);
            this.spy.watch(3, 2, 3);

            assert(this.spy[method](1, 2, 3));
        },

        "returns false if not called with args": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(2);
            this.spy.watch();

            assert.equal(this.spy[method](1, 2, 3), false);
        },

        "returns true for partial match": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(2);
            this.spy.watch();

            assert(this.spy[method](1, 3));
        },

        "matchs all arguments individually, not as array": function () {
            this.spy.watch([1, 2, 3]);

            assert.equal( this.spy[method](1, 2, 3), false);
        }
        
    /* not implemented
        "uses matcher": function () {
            this.spy.watch("abc");

            assert(this.spy[method](sinon.match.typeOf("string")));
        },

        "uses matcher in object": function () {
            this.spy({ some: "abc" });

            assert(this.spy[method]({ some: sinon.match.typeOf("string") }));
        }
    */
    
    };
}

function spyAlwaysCalledTests(method) {
    return {
        beforeEach: function () {
            this.spy = Spy();
        },

        "returns false if spy was not called": function () {
            assert.equal(this.spy[method](1, 2, 3), false);
        },

        "returns true if spy was called with args": function () {
            this.spy.watch(1, 2, 3);

            assert(this.spy[method](1, 2, 3));
        },

        "returns false if called with args only once": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(1, 2, 3);
            this.spy.watch(3, 2, 3);

            assert.equal( this.spy[method](1, 2, 3), false);
        },

        "returns false if not called with args": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(2);
            this.spy.watch();

            assert.equal( this.spy[method](1, 2, 3), false);
        },

        "returns true for partial match": function () {
            this.spy.watch(1, 3, 3);

            assert(this.spy[method](1, 3));
        },

        "returns true for partial match on many calls": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(1, 3);
            this.spy.watch(1, 3, 4, 5);
            this.spy.watch(1, 3, 1);

            assert(this.spy[method](1, 3));
        },

        "matchs all arguments individually, not as array": function () {
            this.spy.watch([1, 2, 3]);

            assert.equal(this.spy[method](1, 2, 3), false);
        }
    };
}

function spyNeverCalledTests(method) { 
    return {
        beforeEach: function () {
            this.spy = Spy();
        },

        "returns true if spy was not called": function () {
            assert(this.spy[method](1, 2, 3));
        },

        "returns false if spy was called with args": function () {
            this.spy.watch(1, 2, 3);

            assert.equal(this.spy[method](1, 2, 3), false);
        },

        "returns false if called with args at least once": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(1, 2, 3);
            this.spy.watch(3, 2, 3);

            assert.equal(this.spy[method](1, 2, 3), false);
        },

        "returns true if not called with args": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(2);
            this.spy.watch();

            assert(this.spy[method](1, 2, 3));
        },

        "returns false for partial match": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(2);
            this.spy.watch();

            assert.equal(this.spy[method](1, 3), false);
        },

        "matchs all arguments individually, not as array": function () {
            this.spy.watch([1, 2, 3]);

            assert(this.spy[method](1, 2, 3));
        }
    };
}



module.exports = {
    
  /* Note sinon.js internal tests omitted here */
        
    "call": {
        "calls underlying function": function () {
            var called = false;

            var spy = Spy(function () {
                called = true;
            });

            spy.watch();

            assert(called);
        },

        "passs arguments to function": function () {
            var actualArgs;

            var func = function (a, b, c, d) {
                actualArgs = [a, b, c, d];
            };

            var args = [1, {}, [], ""];
            var spy = Spy(func);
            spy.watch(args[0], args[1], args[2], args[3]);

            assert.deepEqual(actualArgs, args);
        },

      /* not tested
        "maintains this binding": function () {
            var actualThis;

            var func = function () {
                actualThis = this;
            };

            var object = {};
            var spy = Spy(func);
            spy.watch.call(object);

            assert.deepEqual(actualThis, object);
        },
      */
      
        "returns function's return value": function () {
            var object = {};

            var func = function () {
                return object;
            };

            var spy = Spy(func);
            var actualReturn = spy.watch();

            assert.deepEqual(actualReturn, object);
        },

        "throws if function throws": function () {
            var err = new Error();
            var spy = Spy(function () {
                throw err;
            });

            try {
                spy.watch();
                fail("Expected spy to throw exception");
            } catch (e) {
                assert.deepEqual(e, err);
            }
        }

      /* Not tested
        "retains function length 0": function () {
            var spy = sinon.spy.create(function () {});

            assert.equals(spy.length, 0);
        },

        "retains function length 1": function () {
            var spy = sinon.spy.create(function (a) {});

            assert.equals(spy.length, 1);
        },

        "retains function length 2": function () {
            var spy = sinon.spy.create(function (a, b) {});

            assert.equals(spy.length, 2);
        },

        "retains function length 3": function () {
            var spy = sinon.spy.create(function (a, b, c) {});

            assert.equals(spy.length, 3);
        },

        "retains function length 4": function () {
            var spy = sinon.spy.create(function (a, b, c, d) {});

            assert.equals(spy.length, 4);
        },

        "retains function length 12": function () {
            var spy = sinon.spy.create(function (a, b, c, d, e, f, g, h, i, j,k,l) {});

            assert.equals(spy.length, 12);
        }
      */
      
    },    
    
    "called": {
        forEach: function () {
            this.spy = Spy();
        },

        "is false prior to calling the spy": function () {
            assert.equal(this.spy.called(), false);
        },

        "is true after calling the spy once": function () {
            this.spy.watch();

            assert(this.spy.called());
        },

        "is true after calling the spy twice": function () {
            this.spy.watch();
            this.spy.watch();

            assert(this.spy.called());
        }
    },
    
    "notCalled": {
        forEach: function () {
            this.spy = Spy();
        },

        "is true prior to calling the spy": function () {
            assert.equal(this.spy.notCalled(), true);
        },

        "is false after calling the spy once": function () {
            this.spy.watch();

            assert.equal(this.spy.notCalled(), false);
        }
    },

    "calledOnce": {
        beforeEach: function () {
            this.spy = Spy();
        },

        "is false prior to calling the spy": function () {
            assert.equal(this.spy.calledOnce(), false);
        },

        "is true after calling the spy once": function () {
            this.spy.watch();

            assert(this.spy.calledOnce());
        },

        "is false after calling the spy twice": function () {
            this.spy.watch();
            this.spy.watch();

            assert.equal(this.spy.calledOnce(), false);
        }
    },
    
  /* calledTwice, calledThrice omitted */
    
    "callCount": {
        beforeEach: function () {
            this.spy = Spy();
        },

        "reports 0 calls": function () {
            assert.equal(this.spy.callCount(), 0);
        },

        "records one call": function () {
            this.spy.watch();

            assert.equal(this.spy.callCount(), 1);
        },

        "records two calls": function () {
            this.spy.watch();
            this.spy.watch();

            assert.equal(this.spy.callCount(), 2);
        },

        "increases call count for each call": function () {
            this.spy.watch();
            this.spy.watch();
            assert.equal(this.spy.callCount(), 2);

            this.spy.watch();
            assert.equal(this.spy.callCount(), 3);
        }
    },
    
  /* calledOn, alwaysCalledOn, calledWithNew, alwaysCalledWithNew, thisValue omitted */
    
    "calledWith": spyCalledTests("calledWith"),
    
  /* calledWithMatch, calledWithMatchSpecial omitted */
    
    "alwaysCalledWith": spyAlwaysCalledTests("alwaysCalledWith"),

  /* alwaysCalledWithMatch, alwaysCalledWithMatchSpecial omitted */
    
    "neverCalledWith": spyNeverCalledTests("neverCalledWith"),

  /* neverCalledWithMatch, neverCalledWithMatchSpecial omitted */
    
  /* args omitted */
  
    "calledWithExactly": {
        beforeEach: function () {
            this.spy = Spy();
        },

        "returns false for partial match": function () {
            this.spy.watch(1, 2, 3);

            assert.equal(this.spy.calledWithExactly(1, 2), false);
        },

        "returns false for missing arguments": function () {
            this.spy.watch(1, 2, 3);

            assert.equal(this.spy.calledWithExactly(1, 2, 3, 4), false);
        },

        "returns true for exact match": function () {
            this.spy.watch(1, 2, 3);

            assert(this.spy.calledWithExactly(1, 2, 3));
        },

        "matchs by strict comparison": function () {
            this.spy.watch({}, []);

            assert.equal(this.spy.calledWithExactly({}, [], null), false);
        },

        "returns true for one exact match": function () {
            var object = {};
            var array = [];
            this.spy.watch({}, []);
            this.spy.watch(object, []);
            this.spy.watch(object, array);

            assert(this.spy.calledWithExactly(object, array));
        }
    },
        
    "alwaysCalledWithExactly": {
        beforeEach: function () {
            this.spy = Spy();
        },

        "returns false for partial match": function () {
            this.spy.watch(1, 2, 3);

            assert.equal(this.spy.alwaysCalledWithExactly(1, 2), false);
        },

        "returns false for missing arguments": function () {
            this.spy.watch(1, 2, 3);

            assert.equal(this.spy.alwaysCalledWithExactly(1, 2, 3, 4), false);
        },

        "returns true for exact match": function () {
            this.spy.watch(1, 2, 3);

            assert(this.spy.alwaysCalledWithExactly(1, 2, 3));
        },

        "returns false for excess arguments": function () {
            this.spy.watch({}, []);

            assert.equal(this.spy.alwaysCalledWithExactly({}, [], null), false);
        },

        "returns false for one exact match": function () {
            var object = {};
            var array = [];
            this.spy.watch({}, []);
            this.spy.watch(object, []);
            this.spy.watch(object, array);

            assert(this.spy.alwaysCalledWithExactly(object, array));
        },

        "returns true for only exact matches": function () {
            var object = {};
            var array = [];

            this.spy.watch(object, array);
            this.spy.watch(object, array);
            this.spy.watch(object, array);

            assert(this.spy.alwaysCalledWithExactly(object, array));
        },

        "returns false for no exact matches": function () {
            var object = {};
            var array = [];

            this.spy.watch(object, array, null);
            this.spy.watch(object, array, undefined);
            this.spy.watch(object, array, "");

            assert.equal(this.spy.alwaysCalledWithExactly(object, array), false);
        }
        
    },
    
    "threw": {
        beforeEach: function () {
            this.spy = Spy();

            this.spyWithTypeError = Spy(function () {
              throw new TypeError();
            });
            
            this.spyWithStringError = Spy(function() {
              throw "error";
            });
        },

        "returns exception thrown by function": function () {
            var err = new Error();

            var spy = Spy(function () {
                throw err;
            });

            try {
                spy.watch();
            } catch (e) {}

            assert(spy.threw(err));
        },

        "returns false if spy did not throw": function () {
            this.spy.watch();

            assert.equal(this.spy.threw(), false);
        },

        "returns true if spy threw": function () {
            try {
                this.spyWithTypeError.watch();
            } catch (e) {}

            assert(this.spyWithTypeError.threw());
        },

        "returns true if string type matches": function () {
            try {
                this.spyWithTypeError.watch();
            } catch (e) {}

            assert(this.spyWithTypeError.threw("TypeError"));
        },

        "returns false if string did not match": function () {
            try {
                this.spyWithTypeError.watch();
            } catch (e) {}

            assert.equal(this.spyWithTypeError.threw("Error"), false);
        },

        "returns false if spy did not throw specified error": function () {
            this.spy.watch();

            assert.equal(this.spy.threw("Error"), false);
        },
        
        "returns true if string matches": function () {
          try {
            this.spyWithStringError.watch();
          } catch (e) {}
          
          assert(this.spyWithStringError.threw("error"));
        },
        
        "returns false if strings do not match": function() {
          try {
            this.spyWithStringError.watch();
          } catch (e) {}
          
          assert.equal(this.spyWithStringError.threw("not the error"), false);
        }
    },

    "alwaysThrew": {
        beforeEach: function () {
            this.spy = Spy();

            this.spyWithTypeError = Spy(function () {
                throw new TypeError();
            });
        },

        "returns true when spy threw": function () {
            var err = new Error();

            var spy = Spy(function () {
                throw err;
            });

            try {
                spy.watch();
            } catch (e) {}

            assert(spy.alwaysThrew(err));
        },

        "returns false if spy did not throw": function () {
            this.spy.watch();

            assert.equal(this.spy.alwaysThrew(), false);
        },

        "returns true if spy threw": function () {
            try {
                this.spyWithTypeError.watch();
            } catch (e) {}

            assert(this.spyWithTypeError.alwaysThrew());
        },

        "returns true if string type matches": function () {
            try {
                this.spyWithTypeError.watch();
            } catch (e) {}

            assert(this.spyWithTypeError.alwaysThrew("TypeError"));
        },

        "returns false if string did not match": function () {
            try {
                this.spyWithTypeError.watch();
            } catch (e) {}

            assert.equal(this.spyWithTypeError.alwaysThrew("Error"), false);
        },

        "returns false if spy did not throw specified error": function () {
            this.spy.watch();

            assert.equal(this.spy.alwaysThrew("Error"), false);
        },

        "returns false if some calls did not throw": function () {
            var spy = Spy(function () {
                if (spy.callCount() === 0) {
                    throw new Error();
                }
            });

            try {
                this.spy.watch();
            } catch (e) {}

            this.spy.watch();

            assert.equal(this.spy.alwaysThrew(), false);
        },

        "returns true if all calls threw": function () {
            try {
                this.spyWithTypeError.watch();
            } catch (e1) {}

            try {
                this.spyWithTypeError.watch();
            } catch (e2) {}

            assert(this.spyWithTypeError.alwaysThrew());
        },

        "returns true if all calls threw same type": function () {
            try {
                this.spyWithTypeError.watch();
            } catch (e1) {}

            try {
                this.spyWithTypeError.watch();
            } catch (e2) {}

            assert(this.spyWithTypeError.alwaysThrew("TypeError"));
        }
    },
      
    "returned": {
        "returns true when no argument": function () {
            var spy = Spy();
            spy.watch();

            assert(spy.returned());
        },

        "returns true for undefined when no explicit return": function () {
            var spy = Spy();
            spy.watch();

            assert(spy.returned(undefined));
        },

        "returns true when returned value once": function () {
            var values = [{}, 2, "hey", function () {}];
            var spy = Spy(function () {
                return values[spy.callCount()];
            });

            spy.watch();
            spy.watch();
            spy.watch();
            spy.watch();

            assert(spy.returned(values[3]));
        },

        "returns false when value is never returned": function () {
            var values = [{}, 2, "hey", function () {}];
            var spy = Spy(function () {
                return values[spy.callCount];
            });

            spy.watch();
            spy.watch();
            spy.watch();
            spy.watch();

            assert.equal(spy.returned({ id: 42 }), false);
        },

        "returns true when value is returned several times": function () {
            var object = { id: 42 };
            var spy = Spy(function () {
                return object;
            });

            spy.watch();
            spy.watch();
            spy.watch();

            assert(spy.returned(object));
        },

        "compares values deeply": function () {
            var object = { deep: { id: 42 } };
            var spy = Spy(function () {
                return object;
            });

            spy.watch();

            assert(spy.returned({ deep: { id: 42 } }));
        }

      /* not implemented
        "compares values strictly using match.same": function () {
            var object = { id: 42 };
            var spy = Spy(function () {
                return object;
            });

            spy.watch();

            assert.isFalse(spy.returned(sinon.match.same({ id: 42 })));
            assert(spy.returned(sinon.match.same(object)));
        }
      */
    },
    
  /* returnValues omitted */
    
    "calledBefore": {
        beforeEach: function () {
            this.spy1 = Spy();
            this.spy2 = Spy();
        },

      /* not needed
        "is function": function () {
            assert.equal(typeof this.spy1.calledBefore, "function");
        },
      */

        "returns true if first call to A was before first to B": function () {
            this.spy1.watch();
            this.spy2.watch();

            assert(this.spy1.calledBefore(this.spy2));
        },

      /* N/A
        "compares call order of calls directly": function () {
            this.spy1.watch();
            this.spy2.watch();

            assert(this.spy1.getCall(0).calledBefore(this.spy2.getCall(0)));
        },
      */

        "returns false if not called": function () {
            this.spy2.watch();

            assert.equal(this.spy1.calledBefore(this.spy2), false);
        },

        "returns true if other not called": function () {
            this.spy1.watch();

            assert(this.spy1.calledBefore(this.spy2));
        },

        "returns false if other called first": function () {
            this.spy2.watch();
            this.spy1.watch();
            this.spy2.watch();

            assert(this.spy1.calledBefore(this.spy2));
        }
    },
    
    "calledAfter": {
        beforeEach: function () {
            this.spy1 = Spy();
            this.spy2 = Spy();
        },

      /* not needed
        "is function": function () {
            assert.isFunction(this.spy1.calledAfter);
        },
      */

        "returns true if first call to A was after first to B": function () {
            this.spy2.watch();
            this.spy1.watch();

            assert(this.spy1.calledAfter(this.spy2));
        },

      /* N/A
        "compares calls directly": function () {
            this.spy2.watch();
            this.spy1.watch();

            assert(this.spy1.getCall(0).calledAfter(this.spy2.getCall(0)));
        },
      */

        "returns false if not called": function () {
            this.spy2.watch();

            assert.equal(this.spy1.calledAfter(this.spy2), false);
        },

        "returns false if other not called": function () {
            this.spy1.watch();

            assert.equal(this.spy1.calledAfter(this.spy2), false);
        },

        "returns false if other called last": function () {
            this.spy2.watch();
            this.spy1.watch();
            this.spy2.watch();

            assert.equal(this.spy1.calledAfter(this.spy2), false);
        }
    },
    
    "firstCall": {
        "is undefined by default": function () {
            var spy = Spy();

            assert.equal(spy.firstCall(), undefined);
        },

        "is equal to getCall(0) result after first call": function () {
            var spy = Spy();

            spy.watch();

            var call0 = spy.getCall(0);
            assert.deepEqual(spy.firstCall(), call0);
        }

    },
    
  /* secondCall, thirdCall omitted */
  
    "lastCall": {
        "is undefined by default": function () {
            var spy = Spy();

            assert.equal(spy.lastCall(), undefined);
        },

        "is same as firstCall after first call": function () {
            var spy = Spy();

            spy.watch();

            assert.deepEqual(spy.lastCall(), spy.firstCall());
        },

      /* not needed
      
        "is same as secondCall after second call": function () {
            var spy = sinon.spy();

            spy();
            spy();

            assert.same(spy.lastCall.callId, spy.secondCall.callId);
            assert.same(spy.lastCall.spy, spy.secondCall.spy);
        },

        "is same as thirdCall after third call": function () {
            var spy = sinon.spy();

            spy();
            spy();
            spy();

            assert.same(spy.lastCall.callId, spy.thirdCall.callId);
            assert.same(spy.lastCall.spy, spy.thirdCall.spy);
        },

      */
      
        "is equal to getCall(3) result after fourth call": function () {
            var spy = Spy();

            spy.watch();
            spy.watch();
            spy.watch();
            spy.watch();

            var call3 = spy.getCall(3);
            assert.deepEqual(spy.lastCall(), call3);
        },

        "is equal to getCall(4) result after fifth call": function () {
            var spy = Spy();

            spy.watch();
            spy.watch();
            spy.watch();
            spy.watch();
            spy.watch();

            var call4 = spy.getCall(4);
            assert.deepEqual(spy.lastCall(), call4);
        }
    },
    
  /* callArgWith, callArgOnWith omitted */
  
  /* yield, yieldOn, yieldTo omitted */
  
  
  
  
  
  /* tests below this point are added to sinon.js tests */
  
    "calls chaining": function () {
      var f = function(x) { return x * x; }
      var spy = Spy(f);
      
      for (var i=0; i<5; ++i){
        spy.watch(i);
      }
      
      var actual = spy.calls().select('arguments[0] % 2 == 0').map('returnValue');
      assert.equal(JSON.stringify(actual), JSON.stringify([0,4,16]));
    },
    
    "wrap": {
      "it should call the spy within the block": function(){
        var obj = {
          foo: function(){ return "foo" }
        }
        
        var spy = Spy.wrap(obj, 'foo', function(){
          obj.foo();
        });
        
        assert(spy.called());
      },
      
      "it should not call the spy outside the block": function(){
        var obj = {
          foo: function(){ return "foo" }
        }
        
        var spy = Spy.wrap(obj, 'foo', function(){
          obj.foo();
        });
        
        assert(spy.calledOnce());              
        
        obj.foo();
        
        assert(spy.calledOnce());      
      },
      
      "it should pass through to wrapped method": function(){
        var obj = {
          foo: function(){ return "foo" }
        }
        
        var actualReturn;
        var spy = Spy.wrap(obj, 'foo', function(){
          actualReturn = obj.foo();
        });
        
        assert.equal(actualReturn, "foo");
        assert.equal(spy.firstCall().returnValue, "foo");
      }
    },
    
    "stub": {
      "it should call the spy within the block": function(){
        var obj = {
          foo: function(){ return "foo" }
        }
        
        var spy = Spy.stub(obj, 'foo', function(){
          obj.foo();
        });
        
        assert(spy.called());
      },
      
      "it should not call the spy outside the block": function(){
        var obj = {
          foo: function(){ return "foo" }
        }
        
        var spy = Spy.stub(obj, 'foo', function(){
          obj.foo();
        });
        
        assert(spy.calledOnce());              
        
        obj.foo();
        
        assert(spy.calledOnce());      
      },
      
      "it should not pass through to stubbed method": function(){
        var obj = {
          foo: function(){ return "foo" }
        }
        
        var spy = Spy.stub(obj, 'foo', function(){
          obj.foo();
        });
        
        assert.equal(spy.firstCall().returnValue, undefined);
      }      
    }
    
}

