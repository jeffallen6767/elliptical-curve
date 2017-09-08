// test elliptical curve
var
  tester = require("testing"),
  ec = require("./index"),
  CHAR_ONE_SPACE = " ",
  CHAR_NEW_LINE = "\n",
  testData = {
    "point addition": {
      "title": "solve for a third point using point addition",
      "tests": function(test) {
        var curve = ec.elliptical_curve({
            "a": 5,
            "b": 7
          }),
          points = [
            {x:2,y:5},
            {x:3,y:7}
          ],
          expected = {x:-1,y:1},
          result;
        test.startTime();
        result = ec.solveForThird(curve, points);
        test.endTime();
        test.assert.identical(
          JSON.stringify(result), 
          JSON.stringify(expected)
        );
        test.done();
      }
    },
    "group law": {
      "title": "solve for a third point using group law",
      "tests": function(test) {
        var curve = ec.elliptical_curve({
            "a": 5,
            "b": 7
          }),
          points = [
            {x:2,y:5},
            {x:3,y:7}
          ],
          expected = {x:-1,y:1},
          result;
        test.startTime();
        result = ec.solveForGroup(curve, points);
        test.endTime();
        test.assert.identical(
          JSON.stringify(result), 
          JSON.stringify(expected)
        );
        test.done();
      }
    }
  },
  testKeys = Object.keys(testData),
  tests = {};

// make tests
testKeys.forEach(function(testKey) {
  var
    testType = testData[testKey];
    
  tests[testType.title] = testType.tests;
});

// run tests
tester.run(tests);
