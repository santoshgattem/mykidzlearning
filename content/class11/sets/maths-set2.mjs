// Class 11 Maths, Set 2 (Medium): JEE Main style, one or two steps. Numbers are computed where possible.
import { M, F, P } from "../helpers.mjs";

export const subjectId = "math";
export const setNo = 2;

const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
const C = (n, r) => fact(n) / (fact(r) * fact(n - r));
const Pm = (n, r) => fact(n) / fact(n - r);
const s = String;

export const chapters = [
  {
    id: "m1",
    mcq: [
      M("union", 2, "If A = {1, 2, 3, 4, 5} and B = {4, 5, 6, 7}, then n(A ∪ B) is", s(7), ["9", "5", "6"]),
      M("power-set", 2, "The number of subsets of a set with 4 elements is", s(2 ** 4), ["8", "4", "32"]),
      M("roster", 2, "The set {x : x² − 5x + 6 = 0} has how many subsets?", s(2 ** 2), ["2", "8", "3"]),
      M("inclusion-exclusion", 2, "If n(A) = 20, n(B) = 15 and n(A ∩ B) = 8, then n(A ∪ B) is", s(20 + 15 - 8), ["35", "43", "23"]),
      M("difference", 2, "If A = {1, 2, 3, 4} and B = {3, 4, 5}, then A − B is", "{1, 2}", ["{5}", "{3, 4}", "{1, 2, 5}"]),
      M("de-morgan", 3, "(A ∪ B)′ is equal to", "A′ ∩ B′", ["A′ ∪ B′", "A ∩ B", "A′ − B′"]),
    ],
    fib: [
      F("subsets", 2, "A set with 3 elements has ____ proper subsets.", ["7", "seven"]),
      F("survey", 3, "In a class of 60, 35 like tea, 28 like coffee and 10 like both. The number who like neither is ____.", [s(60 - (35 + 28 - 10))]),
      F("cartesian", 2, "If n(A) = 3 and n(B) = 4, then n(A × B) = ____.", ["12"]),
      F("power-set", 3, "The number of non-empty subsets of a set with 5 elements is ____.", ["31"]),
    ],
    para: [
      P("de-morgan", "In two lines, state De Morgan’s laws for two sets A and B.", ["complement", "union", "intersection", "A′", "B′", "de morgan", "(A ∪ B)′", "(A ∩ B)′"]),
      P("subset", "In two lines, explain the difference between ‘element of a set’ and ‘subset of a set’ with an example.", ["element", "subset", "∈", "⊂", "belongs", "contained", "every element", "example"]),
    ],
  },
  {
    id: "m2",
    mcq: [
      M("cartesian", 2, "If A = {1, 2, 3} and B = {a, b}, then the number of elements in A × B is", s(6), ["5", "8", "9"]),
      M("domain", 2, "The domain of f(x) = √(x + 3) is", "[−3, ∞)", ["(−3, ∞)", "(−∞, −3]", "[3, ∞)"]),
      M("functions", 2, "If f(x) = x² + 1, then f(−2) is", s(5), ["−3", "3", "4"]),
      M("range", 2, "The range of f(x) = x², x ∈ R, is", "[0, ∞)", ["R", "(0, ∞)", "(−∞, 0]"]),
      M("counting-functions", 3, "The number of functions from a 3-element set to a 2-element set is", s(2 ** 3), ["6", "9", "5"]),
      M("relations", 2, "R = {(1,1), (2,2)} on {1, 2, 3} is not reflexive because", "(3, 3) is missing", ["(1, 2) is missing", "it is not symmetric", "it has repeated pairs"]),
    ],
    fib: [
      F("functions", 2, "If f(x) = 3x − 4, then f(5) = ____.", ["11"]),
      F("relations", 3, "The number of relations from a 2-element set to a 3-element set is ____.", [s(2 ** 6)]),
      F("domain", 2, "The real number excluded from the domain of f(x) = 1/(x − 3) is ____.", ["3"]),
      F("relations", 3, "The number of reflexive relations on a 3-element set is ____.", [s(2 ** 6)]),
    ],
    para: [
      P("functions", "In two lines, state when a relation from A to B is called a function.", ["every element", "domain", "exactly one", "unique", "image", "relation", "function"]),
      P("functions", "In two lines, explain what one-one and onto mean for a function.", ["one-one", "onto", "distinct", "different", "range", "codomain", "every element", "image"]),
    ],
  },
  {
    id: "m3",
    mcq: [
      M("compound-angles", 2, "sin 75° equals", "(√6 + √2)/4", ["(√6 − √2)/4", "(√3 + 1)/4", "√3/2"]),
      M("double-angle", 2, "If sin θ = 3/5, then cos 2θ equals", "7/25", ["−7/25", "24/25", "16/25"]),
      M("compound-angles", 2, "If tan A = 1/2 and tan B = 1/3, then tan(A + B) equals", s(1), ["5/6", "1/6", "1/5"]),
      M("equations", 2, "The general solution of sin θ = 0 is", "θ = nπ", ["θ = nπ/2", "θ = 2nπ", "θ = (2n + 1)π"]),
      M("radians", 2, "225° in radians is", "5π/4", ["3π/4", "7π/6", "4π/3"]),
      M("identities", 3, "The value of sin 15° cos 15° is", "1/4", ["1/2", "√3/4", "1/8"]),
    ],
    fib: [
      F("values", 3, "The value of cos 36° − cos 72° is ____.", ["1/2", "0.5", ".5"]),
      F("equations", 3, "The number of solutions of sin x = 1/2 in [0, 2π] is ____.", ["2", "two"]),
      F("periodicity", 2, "The period of sin 3x is 2π/____.", ["3", "three"]),
      F("identities", 2, "1 + tan²θ = sec²θ. If tan θ = 3/4 (θ acute), then sec θ = ____.", ["5/4", "1.25"]),
    ],
    para: [
      P("equations", "In two lines, explain how to find the general solution of cos θ = cos α.", ["2nπ", "±α", "general solution", "θ = 2nπ ± α", "cos", "even", "period"]),
      P("graphs", "In two lines, explain why sin x and cos x are periodic with period 2π.", ["period", "2π", "repeat", "unit circle", "full rotation", "same value", "angle"]),
    ],
  },
  {
    id: "m4",
    mcq: [
      M("complex", 2, "(1 + i)² equals", "2i", ["−2i", "2", "1 + 2i"]),
      M("modulus", 2, "The modulus of 8 − 15i is", s(17), ["23", "√23", "289"]),
      M("powers-of-i", 2, "i²⁷ equals", "−i", ["i", "1", "−1"]),
      M("conjugate", 2, "The conjugate of 2 − 3i is", "2 + 3i", ["−2 + 3i", "−2 − 3i", "3 + 2i"]),
      M("quadratic", 2, "For 2x² − 7x + 3 = 0, the sum of the roots is", "7/2", ["−7/2", "3/2", "−3/2"]),
      M("discriminant", 2, "The discriminant of x² − 6x + 9 is", s(0), ["36", "−36", "9"]),
    ],
    fib: [
      F("powers-of-i", 2, "i¹⁰⁰ = ____.", ["1"]),
      F("modulus", 3, "The modulus of (1 + i)/(1 − i) is ____.", ["1"]),
      F("quadratic", 2, "The roots of x² + 4 = 0 are ±____.", ["2i"]),
      F("discriminant", 3, "The positive value of k for which x² + kx + 9 = 0 has equal roots is ____.", ["6"]),
    ],
    para: [
      P("complex", "In two lines, explain what the conjugate of a complex number is and one property of z · z̄.", ["conjugate", "a − ib", "|z|²", "real", "modulus", "product", "sign"]),
      P("quadratic", "In two lines, explain how the discriminant tells us the nature of the roots of a quadratic equation.", ["discriminant", "b² − 4ac", "real", "distinct", "equal", "complex", "roots", "positive", "negative", "zero"]),
    ],
  },
  {
    id: "m5",
    mcq: [
      M("linear", 2, "The solution of 3x − 5 < 7 is", "x < 4", ["x > 4", "x < 2", "x > 2"]),
      M("modulus", 2, "|x − 2| ≤ 3 gives", "[−1, 5]", ["[−5, 1]", "(−1, 5)", "[1, 5]"]),
      M("quadratic-ineq", 2, "The solution of x² − 7x + 10 < 0 is", "(2, 5)", ["(−∞, 2) ∪ (5, ∞)", "[2, 5]", "(−5, −2)"]),
      M("linear", 2, "2x + 3 ≥ 5 gives", "x ≥ 1", ["x ≤ 1", "x ≥ 4", "x ≤ 4"]),
      M("integer-solutions", 2, "The number of integers x with |x| < 3 is", s(5), ["3", "6", "7"]),
      M("system", 3, "The solution set of x > 1 and x < 5 is", "(1, 5)", ["(−∞, 1) ∪ (5, ∞)", "[1, 5]", "∅"]),
    ],
    fib: [
      F("integer-solutions", 2, "The number of positive integers satisfying 2x + 3 < 15 is ____.", ["5"]),
      F("linear", 2, "The solution of x/2 − 3 > 1 is x > ____.", ["8"]),
      F("modulus", 3, "|2x − 1| ≥ 3 gives x ≤ −1 or x ≥ ____.", ["2"]),
      F("linear", 2, "If −x > 4, then x < ____.", ["-4", "−4"]),
    ],
    para: [
      P("rules", "In two lines, state what happens to an inequality sign when both sides are multiplied by a negative number.", ["reverse", "reversed", "flip", "negative", "sign", "changes", "opposite"]),
      P("graphing", "In two lines, explain how a linear inequality in two variables is shown on the graph.", ["half plane", "line", "shade", "region", "test point", "origin", "dotted", "solid"]),
    ],
  },
  {
    id: "m6",
    mcq: [
      M("arrangements", 2, "The number of arrangements of the letters of LEVEL is", s(fact(5) / (fact(2) * fact(2))), ["120", "60", "20"]),
      M("combinations", 2, "The number of ways to select 3 books from 8 is", s(C(8, 3)), ["24", "336", "512"]),
      M("permutations", 2, "The number of 4-digit numbers using digits 1 to 5 without repetition is", s(Pm(5, 4)), ["625", "24", "60"]),
      M("diagonals", 2, "The number of diagonals of a hexagon is", s(9), ["6", "12", "15"]),
      M("together", 3, "5 people sit in a row with two particular persons always together. The number of arrangements is", s(2 * fact(4)), ["120", "24", "72"]),
      M("handshakes", 2, "In a party of 10, everyone shakes hands once with everyone else. The number of handshakes is", s(C(10, 2)), ["90", "100", "20"]),
    ],
    fib: [
      F("arrangements", 2, "The number of distinct arrangements of the letters of APPLE is ____.", [s(fact(5) / fact(2))]),
      F("combinations", 2, "If C(n, 2) = 28, then n = ____.", ["8"]),
      F("permutations", 2, "If P(n, 2) = 42, then n = ____.", ["7"]),
      F("committees", 3, "A committee of 3 is chosen from 5 men and 4 women with at least one woman. The number of ways is ____.", [s(C(9, 3) - C(5, 3))]),
    ],
    para: [
      P("principle", "In two lines, state the fundamental principle of counting (multiplication rule).", ["multiplication", "m × n", "m·n", "events", "ways", "one after another", "product", "first", "second"]),
      P("p-vs-c", "In two lines, explain how a permutation differs from a combination, using the idea of order.", ["order", "matters", "arrangement", "selection", "permutation", "combination", "n!", "r!"]),
    ],
  },
  {
    id: "m7",
    mcq: [
      M("coefficient", 2, "The coefficient of x² in (1 + x)⁶ is", s(C(6, 2)), ["6", "20", "30"]),
      M("terms", 2, "The number of terms in the expansion of (a + b)¹⁰ is", s(11), ["10", "9", "12"]),
      M("middle-term", 2, "The middle term in the expansion of (x + y)⁸ is", "70x⁴y⁴", ["56x⁴y⁴", "70x⁵y³", "28x⁴y⁴"]),
      M("sum-of-coefficients", 2, "The sum of the coefficients in the expansion of (2x − 1)⁵ is", s(1), ["32", "0", "243"]),
      M("sum-of-coefficients", 2, "The sum of all binomial coefficients of (1 + x)ⁿ is", "2ⁿ", ["n²", "2n", "n!"]),
      M("coefficient", 3, "The coefficient of x³ in (1 + 2x)⁵ is", s(C(5, 3) * 8), ["40", "10", "160"]),
    ],
    fib: [
      F("sum", 2, "C(10, 0) + C(10, 1) + … + C(10, 10) = ____.", ["1024"]),
      F("coefficient", 2, "C(10, 3) = ____.", ["120"]),
      F("general-term", 3, "In (1 + x)⁷, the coefficient of x⁴ is ____.", [s(C(7, 4))]),
      F("coefficient", 3, "The coefficient of x² in (3 + x)⁴ is ____.", [s(C(4, 2) * 9)]),
    ],
    para: [
      P("general-term", "In two lines, write the general term of the expansion of (a + b)ⁿ.", ["T(r+1)", "nCr", "C(n, r)", "a^(n−r)", "b^r", "general term", "r + 1"]),
      P("symmetry", "In two lines, explain why C(n, r) = C(n, n − r).", ["choose", "leave", "selecting", "same", "symmetry", "n − r", "r things", "unselected"]),
    ],
  },
  {
    id: "m8",
    mcq: [
      M("ap", 2, "The 10th term of the AP 3, 7, 11, … is", s(3 + 9 * 4), ["43", "36", "40"]),
      M("sum", 2, "The sum of the first 20 natural numbers is", s(210), ["200", "420", "190"]),
      M("gp", 2, "The 8th term of the GP 2, 6, 18, … is", s(2 * 3 ** 7), ["1458", "13122", "2187"]),
      M("infinite-gp", 2, "The sum of the infinite series 1 + 1/2 + 1/4 + … is", s(2), ["1", "3/2", "∞"]),
      M("means", 2, "The arithmetic mean and the geometric mean of 4 and 16 are", "10 and 8", ["8 and 10", "10 and 10", "9 and 8"]),
      M("squares", 3, "The sum of 1² + 2² + … + 10² is", s(385), ["55", "3025", "450"]),
    ],
    fib: [
      F("ap-sum", 3, "The sum of the first 10 terms of the AP 5, 9, 13, … is ____.", [s(5 * (10 + 36))]),
      F("ap", 2, "The common difference of the AP 12, 9, 6, … is ____.", ["-3", "−3"]),
      F("gp", 2, "The common ratio of the GP 5, 10, 20, … is ____.", ["2"]),
      F("ap", 3, "The number of terms in the AP 7, 13, 19, …, 301 is ____.", ["50"]),
    ],
    para: [
      P("am-gm", "In two lines, state the relation between the AM and GM of two positive numbers.", ["AM ≥ GM", "arithmetic", "geometric", "greater", "equal", "positive", "a = b"]),
      P("ap-gp", "In two lines, explain the difference between an AP and a GP.", ["difference", "ratio", "add", "multiply", "common", "constant", "progression"]),
    ],
  },
  {
    id: "m9",
    mcq: [
      M("slope", 2, "The slope of the line through (1, 2) and (3, 8) is", s(3), ["2", "1/3", "−3"]),
      M("distance", 2, "The distance between (0, 0) and (3, 4) is", s(5), ["7", "√7", "12"]),
      M("equation", 2, "The line with slope 2 through (1, 1) has equation", "y = 2x − 1", ["y = 2x + 1", "y = x + 2", "y = −2x + 3"]),
      M("angle", 3, "The angle between the lines with slopes 1 and 0 is", "45°", ["30°", "60°", "90°"]),
      M("distance-from-line", 3, "The distance of (2, 3) from the line 3x + 4y − 5 = 0 is", "13/5", ["5/13", "1", "13"]),
      M("intercept", 2, "The line x/3 + y/4 = 1 makes an x-intercept of", s(3), ["4", "1/3", "12"]),
    ],
    fib: [
      F("slope", 2, "The slope of a line parallel to the x-axis is ____.", ["0", "zero"]),
      F("distance", 2, "The distance of the point (3, 4) from the origin is ____.", ["5"]),
      F("midpoint", 2, "The midpoint of (2, 6) and (8, 10) has x-coordinate ____.", ["5"]),
      F("parallel", 3, "If the lines 2x + 3y = 5 and kx + 6y = 7 are parallel, then k = ____.", ["4"]),
    ],
    para: [
      P("slope", "In two lines, state the condition for two lines to be perpendicular in terms of their slopes.", ["m1 m2", "−1", "product", "perpendicular", "slopes", "negative reciprocal"]),
      P("forms", "In two lines, name two standard forms of the equation of a straight line.", ["slope-intercept", "point-slope", "two-point", "intercept", "normal form", "y = mx + c", "general form"]),
    ],
  },
  {
    id: "m10",
    mcq: [
      M("circle", 2, "The centre and radius of x² + y² − 6x + 8y = 0 are", "(3, −4) and 5", ["(−3, 4) and 5", "(3, −4) and 25", "(3, 4) and 5"]),
      M("parabola", 2, "The focus of the parabola y² = 16x is", "(4, 0)", ["(8, 0)", "(0, 4)", "(16, 0)"]),
      M("ellipse", 2, "The eccentricity of x²/25 + y²/16 = 1 is", "3/5", ["4/5", "5/3", "9/25"]),
      M("hyperbola", 3, "The foci of x²/9 − y²/16 = 1 are", "(±5, 0)", ["(±7, 0)", "(0, ±5)", "(±4, 0)"]),
      M("circle", 2, "The equation of the circle with centre origin and radius 5 is", "x² + y² = 25", ["x² + y² = 5", "x² − y² = 25", "x + y = 5"]),
      M("parabola", 3, "The length of the latus rectum of y² = 12x is", s(12), ["6", "3", "24"]),
    ],
    fib: [
      F("circle", 2, "The radius of the circle x² + y² = 49 is ____.", ["7"]),
      F("parabola", 2, "The directrix of y² = 4x is x = ____.", ["-1", "−1"]),
      F("ellipse", 3, "For x²/25 + y²/16 = 1, the length of the major axis is ____.", ["10"]),
      F("hyperbola", 3, "For x²/9 − y²/16 = 1, the length of the transverse axis is ____.", ["6"]),
    ],
    para: [
      P("conics", "In two lines, explain how the eccentricity decides whether a conic is a circle, ellipse, parabola or hyperbola.", ["eccentricity", "e = 0", "e < 1", "e = 1", "e > 1", "ellipse", "parabola", "hyperbola", "circle"]),
      P("parabola", "In two lines, define a parabola as a locus of points.", ["equidistant", "focus", "directrix", "locus", "fixed point", "fixed line", "distance"]),
    ],
  },
  {
    id: "m11",
    mcq: [
      M("distance", 2, "The distance between (1, 2, 3) and (3, 5, 9) is", s(7), ["11", "49", "5"]),
      M("midpoint", 2, "The midpoint of (−2, 4, 6) and (6, 10, 12) is", "(2, 7, 9)", ["(4, 14, 18)", "(2, 7, 6)", "(4, 3, 3)"]),
      M("octants", 2, "The point (−1, 2, −3) lies in the octant numbered", "VI", ["IV", "V", "VII"]),
      M("distance-axis", 3, "The distance of (3, 4, 5) from the x-axis is", "√41", ["5", "√50", "√34"]),
      M("section", 3, "The point dividing (1, 2, 3) and (6, 7, 8) internally in the ratio 2 : 3 is", "(3, 4, 5)", ["(4, 5, 6)", "(2, 3, 4)", "(3, 5, 7)"]),
      M("planes", 2, "The z-coordinate of every point on the xy-plane is", s(0), ["1", "x", "y"]),
    ],
    fib: [
      F("distance", 2, "The distance of (3, 4, 12) from the origin is ____.", ["13"]),
      F("planes", 2, "The number of coordinate planes in three-dimensional space is ____.", ["3", "three"]),
      F("coordinates", 2, "The foot of the perpendicular from (3, 4, 5) to the xy-plane has z-coordinate ____.", ["0"]),
      F("midpoint", 3, "The midpoint of (0, 0, 0) and (6, 8, 10) has y-coordinate ____.", ["4"]),
    ],
    para: [
      P("section", "In two lines, state the section formula for a point dividing the join of two points internally in the ratio m : n.", ["m : n", "(mx2 + nx1)/(m + n)", "ratio", "internally", "coordinates", "section formula", "m + n"]),
      P("coordinates", "In two lines, explain how the three coordinate planes divide space into eight octants.", ["xy", "yz", "zx", "planes", "octants", "signs", "positive", "negative", "eight"]),
    ],
  },
];
