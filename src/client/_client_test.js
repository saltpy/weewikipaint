/*global mocha, chai, describe, it */

(function() {
    "use strict";

    var assert = chai.assert;

    describe("Nothing", function() {
        it("should run", function() {
            assert.equal("foo", "foo");
        });
    });
}());
