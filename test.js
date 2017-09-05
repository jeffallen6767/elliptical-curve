// test elliptical curve
var
  tester = require("testing"),
  ec = require("./index"),
  CHAR_ONE_SPACE = " ",
  CHAR_NEW_LINE = "\n",
  testData = {
    
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
