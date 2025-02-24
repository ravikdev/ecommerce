// test/math.test.js
import { strict as assert } from "assert";
import { add } from "../math.js";

describe("Math Functions", () => {
  it("should add two numbers correctly", () => {
    assert.equal(add(2, 3), 5);
  });
});
