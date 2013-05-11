var Spy = require('../index.js');
var assert = require('assert');

// mocha.setup('exports');

    function spyCalledTests(method) {
        return {
            beforeEach: function () {
                this.spy = Spy();
            },

            "returns false if spy was not called": function () {
                assert.notEqual(true, this.spy[method](1, 2, 3));
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

                assert.notEqual(true,this.spy[method](1, 2, 3), JSON.stringify(this.spy));
            },

            "returns true for partial match": function () {
                this.spy.watch(1, 3, 3);
                this.spy.watch(2);
                this.spy.watch();

                assert(this.spy[method](1, 3));
            },

            "matchs all arguments individually, not as array": function () {
                this.spy.watch([1, 2, 3]);

                assert.notEqual(true, this.spy[method](1, 2, 3));
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

module.exports = {
    
    "calledWith": spyCalledTests("calledWith")
    
}
