import { mcq, num, MATH as M } from "./helpers.mjs";

const comb = (n, r) => { let x = 1; for (let i = 1; i <= r; i++) x = (x * (n - r + i)) / i; return Math.round(x); };

export const maths = [
  // ---- 20 multiple-choice
  mcq(M.sets, "The number of proper subsets of a set with 4 elements is", "15", ["16", "14", "8"]),
  mcq(M.rel, "The domain of the function f(x) = √(x² − 4) is", "(−∞, −2] ∪ [2, ∞)", ["(−2, 2)", "[−2, 2]", "(−∞, −2) ∪ (2, ∞)"]),
  mcq(M.trig, "The value of sin 75° is", "(√6 + √2)/4", ["(√6 − √2)/4", "(√3 + 1)/2", "(√3 − 1)/2"]),
  mcq(M.trig, "The number of solutions of sin x = 1/2 in the interval [0, 2π] is", "2", ["1", "3", "4"]),
  mcq(M.trig, "The value of tan 15° + cot 15° is", "4", ["2", "2√3", "8"]),
  mcq(M.cplx, "The value of (1 + i)⁸ is", "16", ["−16", "256", "8"]),
  mcq(M.cplx, "The principal argument of the complex number −1 + i√3 is", "2π/3", ["π/3", "−π/3", "−2π/3"]),
  mcq(M.lim, "The value of lim (x → 0) (1 − cos x)/x² is", "1/2", ["0", "1", "2"]),
  mcq(M.ineq, "The solution set of |x − 2| < 3 is", "(−1, 5)", ["(−5, 1)", "(−1, −5)", "(−∞, −1) ∪ (5, ∞)"]),
  mcq(M.pnc, "The number of distinct arrangements of the letters of the word LEVEL is", "30", ["60", "120", "15"]),
  mcq(M.pnc, "The number of diagonals of a regular hexagon is", "9", ["6", "12", "15"]),
  mcq(M.pnc, "A committee of 3 is chosen from 5 men and 4 women so that it contains at least one woman. The number of ways is", String(comb(9, 3) - comb(5, 3)), ["84", "64", "10"]),
  mcq(M.bin, "The coefficient of x² in the expansion of (1 + x)⁶ is", String(comb(6, 2)), ["6", "20", "30"]),
  mcq(M.lim, "The derivative of x² sin x with respect to x is", "2x sin x + x² cos x", ["2x cos x", "x² cos x − 2x sin x", "2x sin x − x² cos x"]),
  mcq(M.seq, "The 10th term of the arithmetic progression 3, 7, 11, … is", String(3 + 9 * 4), ["43", "40", "35"]),
  mcq(M.prob, "Two fair dice are thrown. The probability that the sum of the numbers is 8 is", "5/36", ["1/6", "1/9", "7/36"]),
  mcq(M.line, "The slope of the line 3x − 4y + 5 = 0 is", "3/4", ["−3/4", "4/3", "−4/3"]),
  mcq(M.line, "The perpendicular distance of the origin from the line 3x + 4y − 10 = 0 is", "2", ["10/7", "5/2", "1"]),
  mcq(M.conic, "The eccentricity of the ellipse x²/25 + y²/16 = 1 is", "3/5", ["4/5", "9/25", "5/3"]),
  mcq(M.conic, "The focus of the parabola y² = 8x is", "(2, 0)", ["(4, 0)", "(0, 2)", "(8, 0)"]),

  // ---- 10 numerical
  num(M.rel, "If A has 3 elements and B has 2 elements, find the number of relations from A to B.", 2 ** (3 * 2)),
  num(M.stat, "Find the mean of the first 10 natural numbers.", 5.5, 0.001),
  num(M.cplx, "Find the modulus of the complex number (3 + 4i)(5 − 12i).", Math.hypot(3, 4) * Math.hypot(5, 12), 0.001),
  num(M.d3, "Find the distance between the points (1, 2, 3) and (4, 6, 15).", Math.sqrt(3 ** 2 + 4 ** 2 + 12 ** 2), 0.001),
  num(M.pnc, "How many even four-digit numbers can be formed using the digits 1, 2, 3, 4, 5 if no digit is repeated?", 2 * 4 * 3 * 2),
  num(M.bin, "Find the term independent of x in the expansion of (x + 1/x)⁶.", comb(6, 3)),
  num(M.seq, "Find the sum of the first 20 terms of the arithmetic progression 5, 8, 11, …", (20 / 2) * (2 * 5 + 19 * 3)),
  num(M.line, "Find the area of the triangle with vertices (0, 0), (4, 0) and (0, 6).", 0.5 * 4 * 6),
  num(M.conic, "Find the radius of the circle x² + y² − 6x + 8y − 11 = 0.", Math.sqrt(3 ** 2 + 4 ** 2 + 11), 0.001),
  num(M.lim, "Evaluate lim (x → 0) (sin 6x)/(2x).", 3, 0.001),
];
