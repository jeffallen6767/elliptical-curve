// elliptical curve in JavaScript
// see: https://en.wikipedia.org/wiki/Elliptic_curve

var 
  CHAR_NO_SPACE = "",
  CHAR_ONE_SPACE = " ",
  CHAR_NEW_LINE = "\n";

function elliptical_curve(input) {
  var
    a = input.a || 0,
    b = input.b || b,
    elliptical_curve = {
      "meta": {
        "a": a,
        "b": b
      }
    };
  
  return elliptical_curve;
}

function findFactors(num, skip) {
  var results = [],
    isEven = num % 2 === 0,
    inc = isEven ? 1 : 2,
    start = isEven ? 2 : 3,
    root = Math.sqrt(num),
    x;
  
  if (skip.indexOf(1) === -1) {
    results.push(1);
  }
  
  for (x=start; x<root; x+=inc) {
    if (num % x !== 0 || skip.indexOf(x) !== -1) continue;
    results.push(x);
    y = num / x;
    if (y !== x) results.push(y);
  }
  
  if (skip.indexOf(num) === -1) {
    results.push(num);
  }
  
  return results;
}

function addInverses(factors, skip) {
  var results = [];
  factors.forEach(function(factor) {
    var inverse = -1 * factor;
    if (skip.indexOf(inverse) === -1) {
      results.push(inverse);
    }
    results.push(factor);
  });
  return results;
}

/*
(mx+b)^2
mx^2 + 2*b*m*x + b^2
*/
function solveForThird(curve, points) {
  var
    ca = curve.meta.a,
    cb = curve.meta.b,
    one = points[0],
    two = points[1],
    oneX = one.x,
    oneY = one.y,
    twoX = two.x,
    twoY = two.y,
    // curve = y^2=x^3 + ax + b
    oneOnCurve = Math.pow(oneY, 2) == Math.pow(oneX, 3) + ca * oneX + cb,
    twoOnCurve = Math.pow(twoY, 2) == Math.pow(twoX, 3) + ca * twoX + cb,
    bothOnCurve = oneOnCurve && twoOnCurve,
    differentXs = oneX !== twoX,
    solveable = bothOnCurve && differentXs,
    m,b,left,right,poly,existing,
    factors,numFactors,x,y,z,
    result;

  if (!solveable) {
    if (!oneOnCurve) {
      throw new Error([
        "solveForThird(curve, points), ERROR: Unsolveable because 1st point (",
        oneX,
        ",",
        oneY,
        ") not on curve(a:",
        ca,
        ",b:",
        cb,
        ")"
      ].join(CHAR_NO_SPACE));
    }
    if (!twoOnCurve) {
      throw new Error([
        "solveForThird(curve, points), ERROR: Unsolveable because 2nd point (",
        twoX,
        ",",
        twoY,
        ") not on curve(a:",
        ca,
        ",b:",
        cb,
        ")"
      ].join(CHAR_NO_SPACE));
    }
    // must be identical x's
    throw new Error([
      "solveForThird(curve, points), ERROR: Unsolveable because 1st point (",
      oneX,
      ",",
      oneY,
      ") and 2nd point (",
      twoX,
      ",",
      twoY,
      ") have same x value..."
    ].join(CHAR_NO_SPACE));
  }
  
  // slope, y=mx+b
  m = (twoY - oneY)/(twoX - oneX);
  b = oneY - m * oneX;
  
  // substitute for y in y^2=x^3 + ax + b
  // (mx+b)^2=x^3 + ax + b
  //left = Math.pow(m * oneX + b, 2),
  //right = Math.pow(oneX, 3) + 5 * oneX + b;
  
  // (mx+b)^2
  left = {
    "third": 0,
    "second": Math.pow(m, 2), // mx^2
    "first": 2*b*m, // 2(bmx)
    "last": Math.pow(b, 2) // b^2
  };
  
  // x^3 + ax + b
  right = {
    "third": 1, // x^3
    "second": 0,
    "first": ca, // ax
    "last": cb // b
  };
  
  // subtract left side from right to form cubic poly: x^3 - mx^2 + x + 0 = 0
  poly = {
    "third": right.third - left.third,
    "second": right.second - left.second,
    "first": right.first - left.first,
    "last": right.last - left.last
  };
  
  // find the remaining factors, skip the existing ones:
  existing = [oneX, twoX];
  // add the inverses, as well
  factors = addInverses(
    findFactors(
      poly.last, 
      existing
    ),
    existing
  );
  
  // count them
  numFactors = factors.length;
  
  // find the 3rd point on the curve:
  for(y=0;y<numFactors;y++) {
    x = factors[y];
    // i.e. 2x^3 + 7x^2 - 5x + 9
    z = (
      poly.third * Math.pow(x, 3) +
      poly.second * Math.pow(x, 2) +
      poly.first * x +
      poly.last
    ) === 0;
    if (z) {
      // found a good one, calc result (y=mx+b) and flip it over the x-axis:
      result = {x:x,y:-1*(2*x+1)};
      break;
    }
  }
  
  //console.log("m", m);
  //console.log("b", b);
  //console.log("left", left);
  //console.log("right", right);
  //console.log("poly", poly);
  //console.log("factors", factors);
  //console.log("result", result);

  return result;
}

module.exports = {
  "elliptical_curve": elliptical_curve,
  "solveForThird": solveForThird
};
