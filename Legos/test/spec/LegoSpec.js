describe("Calculate Angle", function() {

  it("should return the correct angle", function() {
    expect( calculateAngle(1, 1) ).toEqual(45);
    expect( Math.round(calculateAngle(400, 300)) ).toEqual(37);
  });

});
