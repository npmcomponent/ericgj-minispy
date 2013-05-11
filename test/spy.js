
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



module.exports = {
    
    "calledWith": spyCalledTests("calledWith"),
    "alwaysCalledWith": spyAlwaysCalledTests("alwaysCalledWith")
    
}

