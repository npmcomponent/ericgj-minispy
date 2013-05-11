
/* mocha spy.js --ui exports */

var Spy = require('../index.js');
var assert = require('assert');

function spyCalledTests(method) {
    return {
        beforeEach: function () {
            this.spy = Spy();
        },

        "returns false if spy was not called": function () {
            assert.notEqual( this.spy[method](1, 2, 3), true);
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

            assert.notEqual(this.spy[method](1, 2, 3), true);
        },

        "returns true for partial match": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(2);
            this.spy.watch();

            assert(this.spy[method](1, 3));
        },

        "matchs all arguments individually, not as array": function () {
            this.spy.watch([1, 2, 3]);

            assert.notEqual( this.spy[method](1, 2, 3), true);
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
            assert.notEqual(this.spy[method](1, 2, 3), true);
        },

        "returns true if spy was called with args": function () {
            this.spy.watch(1, 2, 3);

            assert(this.spy[method](1, 2, 3));
        },

        "returns false if called with args only once": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(1, 2, 3);
            this.spy.watch(3, 2, 3);

            assert.notEqual( this.spy[method](1, 2, 3), true);
        },

        "returns false if not called with args": function () {
            this.spy.watch(1, 3, 3);
            this.spy.watch(2);
            this.spy.watch();

            assert.notEqual( this.spy[method](1, 2, 3), true);
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

            assert.notEqual(this.spy[method](1, 2, 3), true);
        }
    };
}

function spyNeverCalledTests(method) {  /* todo */ }




module.exports = {
    
    "calledWith": spyCalledTests("calledWith"),
    "alwaysCalledWith": spyAlwaysCalledTests("alwaysCalledWith"),
    
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
    
}

