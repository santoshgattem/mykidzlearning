// Class 11 Maths, Set 3 (Complex): JEE Main hard / Advanced style, several steps. Numbers are computed where possible.
import { M, F, P } from "../helpers.mjs";

export const subjectId = "math";
export const setNo = 3;

const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
const C = (n, r) => fact(n) / (fact(r) * fact(n - r));
const s = String;

// 3-digit numbers with distinct digits divisible by 5, and 5-digit numbers from 1..5 divisible by 4
let by5 = 0;
for (let n = 100; n < 1000; n++) { const d = [...s(n)]; if (new Set(d).size === 3 && n % 5 === 0) by5++; }
let by4 = 0;
const perm = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perm([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));
for (const p of perm([1, 2, 3, 4, 5])) if ((p[3] * 10 + p[4]) % 4 === 0) by4++;

// exactly one of three sets: 65, 55, 45, pairs 30, 25, 20, all three 10
const exactlyOne = (65 + 55 + 45) - 2 * (30 + 25 + 20) + 3 * 10;

export const chapters = [
  {
    id: "m1",
    mcq: [
      M("venn", 3, "In a group of 100, 65 like A, 55 like B, 45 like C, 30 like A and B, 25 like B and C, 20 like A and C, and 10 like all three. The number who like exactly one of them is", s(exactlyOne), ["55", "35", "65"]),
      M("power-set", 3, "If A = {1, 2}, then n(P(P(A))) is", s(2 ** 4), ["8", "4", "256"]),
      M("counting-subsets", 3, "The number of subsets of {1, 2, 3, 4, 5, 6} that contain 1 and 2 but not 3 is", s(2 ** 3), ["4", "16", "12"]),
      M("counting-subsets", 3, "The number of 3-element subsets of {1, 2, …, 10} is", s(C(10, 3)), ["720", "1000", "60"]),
      M("symmetric-difference", 4, "If n(A) = 25, n(B) = 18 and n(A ∩ B) = 10, then n(A Δ B) is", s(25 + 18 - 20), ["33", "43", "13"]),
      M("subset", 3, "If A ⊂ B, then A ∩ B′ equals", "∅", ["A", "B", "A′"]),
    ],
    fib: [
      F("venn", 4, "Among 100 people, 70 speak Hindi and 60 speak English. The least possible number who speak both is ____.", [s(70 + 60 - 100)]),
      F("inclusion-exclusion", 4, "If n(A) = n(B) = n(C) = 10, each pair intersects in 4 elements and all three in 2, then n(A ∪ B ∪ C) = ____.", [s(30 - 12 + 2)]),
      F("counting-subsets", 4, "The number of subsets of {1, 2, 3, 4, 5} that contain at least one odd number is ____.", [s(32 - 4)]),
      F("counting-subsets", 4, "The number of subsets with an even number of elements of a 5-element set is ____.", [s(2 ** 4)]),
    ],
    para: [
      P("inclusion-exclusion", "In two lines, write the formula for n(A ∪ B ∪ C) and say why the triple intersection is added back.", ["n(A)", "n(B)", "n(C)", "pairs", "subtract", "add", "triple", "counted", "inclusion", "exclusion"]),
      P("venn", "In two lines, explain how a Venn diagram helps solve problems on three overlapping sets.", ["regions", "overlap", "intersection", "fill", "start", "all three", "circles", "only"]),
    ],
  },
  {
    id: "m2",
    mcq: [
      M("composition", 3, "If f(x) = 1/(1 − x), then f(f(x)) equals", "(x − 1)/x", ["x/(x − 1)", "1 − x", "x"]),
      M("counting-functions", 4, "The number of one-one functions from a 3-element set to a 5-element set is", s(5 * 4 * 3), ["125", "243", "15"]),
      M("counting-functions", 4, "The number of onto functions from a 4-element set to a 2-element set is", s(2 ** 4 - 2), ["16", "8", "12"]),
      M("domain", 3, "The domain of f(x) = √(x² − 5x + 6) is", "(−∞, 2] ∪ [3, ∞)", ["[2, 3]", "(2, 3)", "R"]),
      M("range", 4, "The range of f(x) = x²/(1 + x²) is", "[0, 1)", ["[0, 1]", "(0, 1)", "[0, ∞)"]),
      M("relations", 4, "The number of symmetric relations on a 3-element set is", s(2 ** 6), ["512", "8", "27"]),
    ],
    fib: [
      F("functional-equation", 4, "If f(x + y) = f(x) + f(y) for all natural numbers and f(1) = 3, then f(5) = ____.", ["15"]),
      F("composition", 3, "If f(x) = 2x + 1 and g(x) = x², then (g ∘ f)(2) = ____.", ["25"]),
      F("counting-functions", 3, "The number of bijections from a 4-element set to itself is ____.", [s(24)]),
      F("composition", 4, "If f(x) = x/(x − 1), then f(f(5)) = ____.", ["5"]),
    ],
    para: [
      P("inverse", "In two lines, explain when a function has an inverse and how its graph is related to the graph of the function.", ["one-one", "onto", "bijective", "inverse", "reflection", "y = x", "swap", "symmetric"]),
      P("composition", "In two lines, explain why f ∘ g is generally not equal to g ∘ f, with a small example.", ["order", "not commutative", "first", "apply", "example", "f(g(x))", "g(f(x))", "different"]),
    ],
  },
  {
    id: "m3",
    mcq: [
      M("product-identities", 4, "cos 20° cos 40° cos 80° equals", "1/8", ["1/4", "√3/8", "1/16"]),
      M("product-identities", 4, "sin 10° sin 30° sin 50° sin 70° equals", "1/16", ["1/8", "1/32", "√3/16"]),
      M("extrema", 3, "The maximum value of 3 sin x + 4 cos x is", s(5), ["7", "√7", "12"]),
      M("equations", 3, "The general solution of tan θ = −√3 is", "θ = nπ − π/3", ["θ = nπ + π/3", "θ = 2nπ − π/3", "θ = nπ ± π/3"]),
      M("equations", 3, "The number of solutions of sin x = cos x in [0, 2π] is", s(2), ["1", "4", "3"]),
      M("extrema", 4, "The minimum value of 2 sin²θ + 3 cos²θ is", s(2), ["3", "5", "1"]),
    ],
    fib: [
      F("values", 3, "tan 15° = 2 − √____.", ["3"]),
      F("values", 4, "cos 36° cos 72° = ____.", ["1/4", "0.25", ".25"]),
      F("equations", 4, "The number of solutions of sin²x = 1/4 in [0, 2π] is ____.", ["4", "four"]),
      F("identities", 3, "sin(60° + 30°) · sin(60° − 30°) = ____.", ["1/2", "0.5", ".5"]),
    ],
    para: [
      P("extrema", "In two lines, explain how to find the maximum value of a sin x + b cos x.", ["√(a² + b²)", "R sin", "amplitude", "maximum", "a² + b²", "form", "single", "sin(x + α)"]),
      P("identities", "In two lines, show how sin(A + B) is used to prove sin 2A = 2 sin A cos A.", ["B = A", "sin(A + A)", "sin A cos A", "2", "double angle", "substitute", "put"]),
    ],
  },
  {
    id: "m4",
    mcq: [
      M("powers", 3, "(1 + i)⁸ equals", s(16), ["−16", "8", "16i"]),
      M("cube-roots", 4, "If ω is a complex cube root of unity, then ω¹⁰⁰ + ω²⁰⁰ equals", "−1", ["1", "0", "2"]),
      M("polar", 4, "If z = 1 + i√3, then z⁶ equals", s(64), ["−64", "64i", "32"]),
      M("roots", 3, "If α and β are the roots of x² − 5x + 6 = 0, then α² + β² is", s(25 - 12), ["37", "11", "25"]),
      M("roots", 4, "The equation whose roots are the squares of the roots of x² − 5x + 6 = 0 is", "x² − 13x + 36 = 0", ["x² − 25x + 36 = 0", "x² − 13x + 6 = 0", "x² + 13x + 36 = 0"]),
      M("extrema", 3, "The minimum value of x² − 4x + 7 is", s(3), ["7", "4", "−3"]),
    ],
    fib: [
      F("powers", 4, "((1 + i)/(1 − i))¹⁰ = ____.", ["-1", "−1"]),
      F("argument", 3, "The principal argument of −1 + i is ____.", ["3π/4", "135°", "135"]),
      F("roots", 4, "One root of x² + px + 12 = 0 is 4. If x² + px + q = 0 has equal roots, then q = ____.", ["49/4", "12.25"]),
      F("cube-roots", 3, "1 + ω + ω² = ____.", ["0"]),
    ],
    para: [
      P("polar", "In two lines, explain how De Moivre’s theorem helps to find powers of a complex number.", ["modulus", "argument", "r^n", "nθ", "cos", "sin", "de moivre", "polar", "power"]),
      P("roots", "In two lines, explain why complex roots of a quadratic with real coefficients occur in conjugate pairs.", ["conjugate", "real coefficients", "discriminant", "negative", "√", "±i", "pair", "formula"]),
    ],
  },
  {
    id: "m5",
    mcq: [
      M("rational", 3, "The solution of (x − 1)/(x + 2) ≥ 0 is", "(−∞, −2) ∪ [1, ∞)", ["(−2, 1]", "[−2, 1]", "(−∞, −2] ∪ [1, ∞)"]),
      M("modulus", 4, "The solution of |x − 1| + |x − 3| < 4 is", "(0, 4)", ["(1, 3)", "(−1, 5)", "[0, 4]"]),
      M("integer-solutions", 3, "The number of integer solutions of x² − 4x − 5 ≤ 0 is", s(7), ["5", "6", "8"]),
      M("system", 3, "The number of integers satisfying both 2x + 1 > 5 and x − 3 < 2 is", s(2), ["1", "3", "0"]),
      M("am-gm", 4, "For x > 0, the minimum value of x + 1/x is", s(2), ["1", "0", "∞"]),
      M("modulus", 3, "The solution set of |x| > 2 and |x| < 5 is", "(−5, −2) ∪ (2, 5)", ["(2, 5)", "(−5, 5)", "(−2, 2)"]),
    ],
    fib: [
      F("modulus", 3, "The number of integers satisfying |2x − 3| < 7 is ____.", ["6"]),
      F("quadratic-ineq", 3, "x² − x − 12 > 0 holds for x < −3 or x > ____.", ["4"]),
      F("rational", 4, "1/x < 1/2 holds for x < 0 or x > ____.", ["2"]),
      F("modulus", 3, "The maximum value of 5 − |x − 2| is ____.", ["5"]),
    ],
    para: [
      P("rational", "In two lines, explain why we cannot multiply both sides of (x − 1)/(x + 2) ≥ 0 by (x + 2) without care.", ["sign", "negative", "positive", "reverse", "cases", "critical points", "wavy", "x + 2"]),
      P("modulus", "In two lines, explain how to solve |f(x)| < a (a > 0).", ["−a < f(x) < a", "between", "two inequalities", "intersection", "both", "distance", "a"]),
    ],
  },
  {
    id: "m6",
    mcq: [
      M("arrangements", 3, "The number of arrangements of the letters of STATISTICS is", s(fact(10) / (fact(3) * fact(3) * fact(2))), ["3628800", "151200", "25200"]),
      M("alternate", 4, "5 men and 4 women are seated alternately in a row. The number of ways is", s(fact(5) * fact(4)), ["120", "362880", "1440"]),
      M("circular", 3, "The number of ways 6 people can sit around a circular table is", s(fact(5)), ["720", "60", "24"]),
      M("distribution", 4, "The number of ways to distribute 10 identical sweets among 3 children (a child may get none) is", s(C(12, 2)), ["120", "36", "165"]),
      M("grid", 4, "The number of rectangles on an 8 × 8 chessboard is", s(C(9, 2) ** 2), ["204", "64", "1296 − 1"]),
      M("digits", 4, "The number of 3-digit numbers with distinct digits divisible by 5 is", s(by5), ["144", "180", "72"]),
    ],
    fib: [
      F("arrangements", 3, "The number of arrangements of the letters of BANANA is ____.", [s(fact(6) / (fact(3) * fact(2)))]),
      F("digits", 4, "The number of 5-digit numbers formed with 1, 2, 3, 4, 5 (no repetition) that are divisible by 4 is ____.", [s(by4)]),
      F("geometry", 3, "The number of triangles formed by 8 points, no three collinear, is ____.", [s(C(8, 3))]),
      F("geometry", 4, "Out of 10 points, 4 are collinear. The number of triangles formed is ____.", [s(C(10, 3) - C(4, 3))]),
    ],
    para: [
      P("circular", "In two lines, explain why the number of circular arrangements of n distinct people is (n − 1)!.", ["rotation", "fix", "one person", "(n − 1)!", "same arrangement", "relative", "positions", "circular"]),
      P("repetition", "In two lines, explain how repeated letters change the count of arrangements.", ["divide", "factorial", "repeated", "identical", "n!", "p!", "same", "arrangements"]),
    ],
  },
  {
    id: "m7",
    mcq: [
      M("independent-term", 4, "The term independent of x in (x + 1/x)⁸ is", s(C(8, 4)), ["56", "28", "1"]),
      M("remainder", 4, "The remainder when 7¹⁰⁰ is divided by 5 is", s(1), ["2", "4", "0"]),
      M("even-terms", 3, "C(n, 0) + C(n, 2) + C(n, 4) + … equals", "2ⁿ⁻¹", ["2ⁿ", "2ⁿ⁺¹", "n²"]),
      M("greatest-coefficient", 3, "The greatest binomial coefficient in (1 + x)¹⁰ is", s(C(10, 5)), ["120", "210", "126"]),
      M("multinomial", 4, "The number of terms in the expansion of (x + y + z)⁴ is", s(15), ["12", "10", "81"]),
      M("coefficient", 4, "The coefficient of x² in (1 + x)⁴(1 − x)⁴ is", "−4", ["4", "0", "−6"]),
    ],
    fib: [
      F("pascal", 3, "C(10, 2) + C(10, 3) = C(11, ____).", ["3"]),
      F("equality", 3, "If C(n, 3) = C(n, 5), then n = ____.", ["8"]),
      F("terms", 4, "The number of terms in the expansion of (a + b)⁹ + (a − b)⁹ is ____.", ["5"]),
      F("coefficient", 3, "The coefficient of x⁷ in (1 + x)¹⁰ is ____.", [s(C(10, 7))]),
    ],
    para: [
      P("remainder", "In two lines, explain how the binomial theorem is used to find the remainder when 7¹⁰⁰ is divided by 5.", ["(5 + 2)", "multiple of 5", "remainder", "binomial", "expand", "last term", "divisible"]),
      P("identity", "In two lines, explain why C(n, 0) + C(n, 1) + … + C(n, n) = 2ⁿ.", ["put x = 1", "(1 + x)ⁿ", "sum of coefficients", "subsets", "2ⁿ", "each element", "binomial"]),
    ],
  },
  {
    id: "m8",
    mcq: [
      M("series", 3, "The sum 1·2 + 2·3 + 3·4 + … + 10·11 is", s((10 * 11 * 12) / 3), ["385", "330", "550"]),
      M("telescoping", 4, "1/(1·2) + 1/(2·3) + … + 1/(99·100) equals", "99/100", ["1", "100/101", "98/99"]),
      M("ap", 3, "If the sum of n terms of an AP is 3n² + 2n, its 5th term is", s((3 * 25 + 10) - (3 * 16 + 8)), ["85", "17", "32"]),
      M("gp", 3, "The sum 3 + 6 + 12 + … + 3072 is", s(3 * (2 ** 11 - 1)), ["3069", "6144", "3071"]),
      M("means", 4, "For 4 and 9, if AM = 6.5 and GM = 6, then the harmonic mean is", "72/13", ["13/72", "36/13", "6"]),
      M("series", 3, "The sum 1³ + 2³ + … + 10³ is", s(3025), ["385", "55", "2025"]),
    ],
    fib: [
      F("ap-sum", 3, "2 + 4 + 6 + … + 100 = ____.", ["2550"]),
      F("ap-sum", 4, "The sum of all two-digit numbers divisible by 7 is ____.", [s(13 * (14 + 98) / 2)]),
      F("infinite-gp", 3, "The sum of the infinite GP 6 + 2 + 2/3 + … is ____.", ["9"]),
      F("ap", 4, "Three numbers in AP have sum 15 and product 105. The largest is ____.", ["7"]),
    ],
    para: [
      P("am-gm-hm", "In two lines, state how AM, GM and HM of two positive numbers are related.", ["AM ≥ GM ≥ HM", "GM²", "AM · HM", "equal", "positive", "relation", "a = b"]),
      P("telescoping", "In two lines, explain how partial fractions help to sum 1/(n(n + 1)).", ["1/n − 1/(n + 1)", "cancel", "telescop", "partial fractions", "first", "last", "terms"]),
    ],
  },
  {
    id: "m9",
    mcq: [
      M("parallel-lines", 3, "The distance between the parallel lines 3x + 4y = 5 and 3x + 4y = 15 is", s(2), ["10", "5", "1"]),
      M("area", 3, "The area of the triangle with vertices (0, 0), (6, 0) and (0, 8) is", s(24), ["48", "14", "12"]),
      M("intersection", 3, "The lines x + y = 3 and 2x − y = 0 meet at", "(1, 2)", ["(2, 1)", "(3, 0)", "(1, 3)"]),
      M("centroid", 3, "The centroid of the triangle with vertices (1, 2), (3, 4), (5, 9) is", "(3, 5)", ["(9, 15)", "(3, 4)", "(2, 5)"]),
      M("perpendicular", 3, "The slope of a line perpendicular to 3x − 2y + 5 = 0 is", "−2/3", ["3/2", "2/3", "−3/2"]),
      M("reflection", 4, "The image of the point (3, 4) in the line y = x is", "(4, 3)", ["(−3, −4)", "(3, −4)", "(−4, 3)"]),
    ],
    fib: [
      F("equation", 3, "The line through (2, 3) parallel to the x-axis is y = ____.", ["3"]),
      F("intercepts", 4, "The line x/2 + y/3 = 1 and the axes form a triangle of area ____.", ["3"]),
      F("distance", 4, "The distance of the origin from the line 5x + 12y = 26 is ____.", ["2"]),
      F("equation", 3, "The line through (1, 2) with slope 3 meets the y-axis at y = ____.", ["-1", "−1"]),
    ],
    para: [
      P("distance", "In two lines, state the formula for the distance of a point (x₁, y₁) from the line ax + by + c = 0.", ["|ax₁ + by₁ + c|", "√(a² + b²)", "perpendicular", "distance", "formula", "modulus"]),
      P("family", "In two lines, explain how a line through the intersection of two given lines is written using a parameter.", ["L₁ + λL₂", "family", "intersection", "parameter", "λ", "pass through", "point"]),
    ],
  },
  {
    id: "m10",
    mcq: [
      M("ellipse", 3, "The length of the latus rectum of x²/25 + y²/16 = 1 is", "32/5", ["16/5", "8/5", "5"]),
      M("hyperbola", 3, "The eccentricity of x²/9 − y²/16 = 1 is", "5/3", ["3/5", "4/3", "25/9"]),
      M("parabola", 3, "The focus of the parabola x² = −16y is", "(0, −4)", ["(−4, 0)", "(0, 4)", "(0, −16)"]),
      M("ellipse", 4, "The distance between the foci of 9x² + 25y² = 225 is", s(8), ["4", "6", "10"]),
      M("circle", 4, "The circle through (0, 0), (4, 0) and (0, 3) has radius", "5/2", ["5", "3", "2"]),
      M("tangent", 4, "The length of the tangent from (5, 0) to x² + y² = 9 is", s(4), ["16", "5", "3"]),
    ],
    fib: [
      F("circle", 3, "The radius of x² + y² − 4x + 6y − 12 = 0 is ____.", ["5"]),
      F("ellipse", 4, "An ellipse has foci (±3, 0) and eccentricity 3/5. The length of its semi-minor axis is ____.", ["4"]),
      F("hyperbola", 4, "The asymptotes of x²/16 − y²/9 = 1 have slopes ±____.", ["3/4", "0.75"]),
      F("parabola", 3, "If y² = 4ax passes through (1, 2), then a = ____.", ["1"]),
    ],
    para: [
      P("ellipse", "In two lines, state the relation among a, b and e for an ellipse x²/a² + y²/b² = 1 (a > b).", ["b² = a²(1 − e²)", "e", "c² = a² − b²", "focus", "ae", "relation", "eccentricity"]),
      P("tangent", "In two lines, explain how to find the length of the tangent from an external point to a circle.", ["√(S₁)", "x₁² + y₁²", "power of the point", "radius", "pythagoras", "distance", "centre", "tangent"]),
    ],
  },
  {
    id: "m11",
    mcq: [
      M("centroid", 3, "The centroid of the triangle with vertices (1, 2, 3), (3, 2, 1) and (5, 8, 6) is", "(3, 4, 10/3)", ["(3, 4, 3)", "(9, 12, 10)", "(2, 4, 10/3)"]),
      M("distance", 3, "The distance from the origin of the point dividing (1, 2, 3) and (6, 7, 8) internally in the ratio 2 : 3 is", "5√2", ["5", "√50 + 1", "10"]),
      M("collinear", 4, "Which three points are collinear?", "(1, 2, 3), (2, 3, 4), (3, 4, 5)", ["(1, 2, 3), (2, 3, 5), (3, 4, 5)", "(0, 0, 0), (1, 1, 0), (2, 3, 0)", "(1, 0, 0), (0, 1, 0), (0, 0, 1)"]),
      M("axes", 3, "The distance of the point (a, b, c) from the y-axis is", "√(a² + c²)", ["√(a² + b²)", "√(b² + c²)", "|b|"]),
      M("equidistant", 3, "The point on the x-axis equidistant from (0, 0, 0) and (4, 0, 0) is", "(2, 0, 0)", ["(4, 0, 0)", "(0, 2, 0)", "(1, 0, 0)"]),
      M("section", 4, "The yz-plane divides the join of (−2, 4, 7) and (3, −5, 8) in the ratio", "2 : 3 internally", ["3 : 2 internally", "2 : 3 externally", "1 : 1"]),
    ],
    fib: [
      F("planes", 3, "The distance of (1, 2, 3) from the yz-plane is ____.", ["1"]),
      F("axes", 4, "The distance of (1, 2, 3) from the z-axis is √____.", ["5"]),
      F("triangle", 3, "The vertices (0, 0, 0), (3, 0, 0) and (0, 4, 0) form a right triangle whose hypotenuse has length ____.", ["5"]),
      F("equidistant", 4, "The point (x, 0, 0) is equidistant from (3, 2, 2) and (1, 0, 0). Then x = ____.", ["4"]),
    ],
    para: [
      P("collinear", "In two lines, explain how to check whether three points in space are collinear using distances.", ["AB", "BC", "AC", "sum", "distance", "equal", "AB + BC = AC", "collinear"]),
      P("distance", "In two lines, explain how the distance formula in space is an extension of the distance formula in a plane.", ["√", "z", "extra", "three", "squares", "difference", "pythagoras", "(z₂ − z₁)²"]),
    ],
  },
];
