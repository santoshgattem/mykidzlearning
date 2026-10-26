// Class 11 Mathematics, NCERT (rationalised) chapter order. See physics.mjs for the format.

const m = (l, q, o, a) => ({ l, q, o, a });
const f = (l, q, a) => ({ l, q, a });

export const chapters = [
  { id: "m1", legacy: "m1" }, // Sets

  {
    id: "m2", title: "Relations and Functions",
    mcq: [
      m(1, "If set A has 2 elements and set B has 3 elements, the number of elements in A × B is", ["5", "6", "8", "9"], 1),
      m(1, "A relation from A to B is a", ["Subset of A × B", "Subset of A", "Subset of B", "Element of A × B"], 0),
      m(1, "The domain of f(x) = 1/x is", ["All real numbers", "All real numbers except 0", "x > 0", "x ≥ 0"], 1),
      m(2, "If f(x) = 2x + 3, then f(2) =", ["5", "7", "9", "10"], 1),
      m(2, "The range of f(x) = x² for real x is", ["All real numbers", "[0, ∞)", "(−∞, 0]", "(0, ∞) only"], 1),
      m(3, "The number of relations from a set with 2 elements to a set with 3 elements is", ["6", "8", "32", "64"], 3),
      m(3, "If f(x) = x² and g(x) = x + 1, then (f∘g)(2) =", ["5", "6", "9", "10"], 2),
      m(4, "The function f: R → R defined by f(x) = x³ is", ["Neither one-one nor onto", "One-one but not onto", "Onto but not one-one", "Both one-one and onto"], 3),
      m(4, "The domain of f(x) = √(x − 2) / (x − 5) is", ["x ≥ 2", "x ≥ 2 and x ≠ 5", "x > 2", "x ≠ 5"], 1),
    ],
    fib: [
      f(1, "The set of all first elements of the ordered pairs in a relation is called its ____.", ["domain"]),
      f(1, "A function that is both one-one and onto is called a ____ function.", ["bijective", "bijection"]),
      f(3, "If n(A) = 3 and n(B) = 2, the number of functions from A to B is ____.", ["8", "eight"]),
    ],
    para: { q: "In two lines, explain the difference between a relation and a function.", k: ["relation", "function", "every element", "unique", "exactly one", "domain", "image", "ordered pair", "input"] },
    practice: [
      "Find the domain and range of f(x) = √(4 − x²)",
      "Check whether f(x) = 2x + 1 from R to R is one-one and onto",
      "If f(x) = x² + 1 and g(x) = 2x − 3, find f∘g and g∘f",
    ],
  },

  { id: "m3", legacy: "m2" }, // Trigonometric Functions

  {
    id: "m4", legacy: "m3", title: "Complex Numbers and Quadratic Equations",
    extra: {
      mcq: [
        m(2, "The roots of x² − 5x + 6 = 0 are", ["2 and 3", "1 and 6", "−2 and −3", "−1 and −6"], 0),
        m(3, "The discriminant of x² + x + 1 = 0 is", ["3", "1", "−3", "0"], 2),
      ],
    },
  },

  {
    id: "m5", title: "Linear Inequalities",
    mcq: [
      m(1, "If a > b, then a + c is", ["Greater than b + c", "Less than b + c", "Equal to b + c", "Not comparable with b + c"], 0),
      m(1, "The solution of x + 3 > 5 is", ["x > 2", "x < 2", "x > 8", "x < 8"], 0),
      m(1, "The symbol ≥ means", ["Less than", "Greater than", "Greater than or equal to", "Less than or equal to"], 2),
      m(2, "Multiplying both sides of an inequality by a negative number", ["Keeps the sign", "Reverses the sign", "Turns it into an equation", "Always makes it false"], 1),
      m(2, "The solution of 2x − 1 ≤ 5 is", ["x ≤ 3", "x ≥ 3", "x ≤ 2", "x ≥ 2"], 0),
      m(3, "The solution of −3x > 12 is", ["x > −4", "x < −4", "x > 4", "x < 4"], 1),
      m(3, "The solution of |x| < 3 is", ["x > 3", "−3 < x < 3", "x < −3 or x > 3", "x = 3"], 1),
      m(4, "The solution of |x − 2| ≥ 3 is", ["−1 < x < 5", "x ≤ −1 or x ≥ 5", "x ≥ 5 only", "x ≤ −1 only"], 1),
      m(4, "The solution region of x + y ≥ 1, x ≥ 0, y ≥ 0 lies", ["In the first quadrant, on or above the line x + y = 1", "In the second quadrant", "Below the line x + y = 1", "In all four quadrants"], 0),
    ],
    fib: [
      f(1, "If a < b and c > 0, then ac ____ bc.", ["<", "less than", "is less than"]),
      f(1, "The solution of 3x < 9 is x < ____.", ["3", "three"]),
      f(3, "The solution of |x| ≤ 2 in interval notation is [−2, ____].", ["2", "two"]),
    ],
    para: { q: "In two lines, explain why the inequality sign reverses when we multiply by a negative number.", k: ["negative", "reverse", "flip", "number line", "order", "opposite", "larger", "smaller"] },
    practice: [
      "Solve 3(x − 2) ≤ 5x + 4 and show the solution on the number line",
      "Solve |2x − 3| < 5",
      "Graph the inequality 2x + 3y ≤ 6",
    ],
  },

  {
    id: "m6", title: "Permutations and Combinations",
    mcq: [
      m(1, "The value of 5! is", ["24", "60", "120", "720"], 2),
      m(1, "The number of ways to arrange 3 different books on a shelf is", ["3", "6", "9", "27"], 1),
      m(1, "The value of ⁿC₀ is", ["0", "1", "n", "n!"], 1),
      m(2, "The value of ⁵C₂ is", ["5", "10", "20", "25"], 1),
      m(2, "The number of ways of selecting 2 students from 6 is", ["12", "15", "30", "36"], 1),
      m(3, "The number of 4-letter arrangements of the letters of the word MATH (no repetition) is", ["12", "16", "24", "256"], 2),
      m(3, "The number of distinct arrangements of the letters of the word LETTER is", ["720", "360", "180", "90"], 2),
      m(4, "A committee of 3 is chosen from 5 men and 4 women with at least one woman. The number of ways is", ["60", "74", "84", "80"], 1),
      m(4, "The number of ways 5 people can sit around a circular table is", ["120", "60", "24", "12"], 2),
    ],
    fib: [
      f(1, "ⁿPᵣ = n! / ____.", ["(n−r)!", "(n-r)!", "(n − r)!", "(n - r)!", "n−r!", "n-r!"]),
      f(1, "The value of 0! is ____.", ["1", "one"]),
      f(3, "The number of diagonals of a hexagon is ____.", ["9", "nine"]),
    ],
    para: { q: "In two lines, explain the difference between a permutation and a combination.", k: ["order", "arrangement", "selection", "matters", "does not matter", "ways", "choose"] },
    practice: [
      "How many 3-digit numbers can be formed from the digits 1 to 5 without repetition?",
      "In how many ways can 4 boys and 3 girls stand in a row so that no two girls are together?",
      "A committee of 4 is formed from 6 men and 4 women with exactly 2 women: find the number of ways",
    ],
  },

  {
    id: "m7", title: "Binomial Theorem",
    mcq: [
      m(1, "The number of terms in the expansion of (a + b)ⁿ is", ["n", "n + 1", "n − 1", "2n"], 1),
      m(1, "(a + b)² =", ["a² + b²", "a² + 2ab + b²", "a² − 2ab + b²", "2a + 2b"], 1),
      m(1, "The sum of the binomial coefficients in the expansion of (1 + x)ⁿ is", ["n", "2ⁿ", "n²", "n!"], 1),
      m(2, "The coefficient of x² in (1 + x)⁵ is", ["5", "10", "20", "25"], 1),
      m(2, "The (r + 1)th term of (a + b)ⁿ is", ["ⁿCᵣ aⁿ⁻ʳ bʳ", "ⁿCᵣ aʳ bʳ", "ⁿPᵣ aⁿ⁻ʳ bʳ", "ⁿCᵣ aⁿ bʳ"], 0),
      m(3, "The middle term in the expansion of (1 + x)⁶ is", ["15x³", "20x³", "15x⁴", "6x³"], 1),
      m(3, "Using the first two terms of the binomial expansion, (1.01)⁴ is approximately", ["1.01", "1.02", "1.04", "1.4"], 2),
      m(4, "The coefficient of x³ in (2 + 3x)⁵ is", ["270", "540", "1080", "2160"], 2),
      m(4, "The term independent of x in the expansion of (x + 1/x)⁶ is", ["15", "20", "6", "1"], 1),
    ],
    fib: [
      f(1, "The coefficients in a binomial expansion can be read from ____’s triangle.", ["pascal", "pascals", "pascal’s"]),
      f(1, "In every term of (a + b)ⁿ, the sum of the powers of a and b is ____.", ["n"]),
      f(3, "In the expansion of (1 + x)ⁿ, the coefficient of xʳ is ⁿC____.", ["r"]),
    ],
    para: { q: "In two lines, explain how Pascal’s triangle helps in expanding (a + b)ⁿ.", k: ["coefficients", "row", "sum of two", "above", "binomial", "triangle", "expansion", "pascal"] },
    practice: [
      "Expand (2x + 3)⁴",
      "Find the 5th term in the expansion of (x − 1/x)¹⁰",
      "Find the coefficient of x⁴ in the expansion of (1 + 2x)⁶",
    ],
  },

  {
    id: "m8", title: "Sequences and Series",
    mcq: [
      m(1, "The nth term of an AP with first term a and common difference d is", ["a + nd", "a + (n − 1)d", "a + (n + 1)d", "a·dⁿ"], 1),
      m(1, "The 10th term of the AP 2, 5, 8, … is", ["27", "29", "30", "32"], 1),
      m(1, "In a GP, the ratio of consecutive terms is called the", ["Common difference", "Common ratio", "Mean", "Median"], 1),
      m(2, "The sum of the first n natural numbers is", ["n(n + 1)", "n(n + 1)/2", "n²", "n(n − 1)/2"], 1),
      m(2, "The sum of the first 10 terms of the AP 1, 3, 5, … is", ["50", "90", "100", "110"], 2),
      m(3, "The 5th term of the GP 3, 6, 12, … is", ["24", "36", "48", "96"], 2),
      m(3, "The sum to infinity of the GP 1, 1/2, 1/4, … is", ["1", "1.5", "2", "∞"], 2),
      m(4, "Two positive numbers have arithmetic mean 10 and geometric mean 8. The numbers are", ["12 and 8", "16 and 4", "18 and 2", "10 and 10"], 1),
      m(4, "The value of 1² + 2² + … + 10² is", ["285", "385", "440", "550"], 1),
    ],
    fib: [
      f(1, "A sequence in which each term is obtained by adding a fixed number to the previous term is called an ____ progression.", ["arithmetic", "ap", "a.p."]),
      f(1, "The sum of an infinite GP with |r| < 1 is a / (1 − ____).", ["r"]),
      f(3, "For two positive numbers, the arithmetic mean is always greater than or equal to the ____ mean.", ["geometric", "gm"]),
    ],
    para: { q: "In two lines, explain the difference between an arithmetic progression and a geometric progression.", k: ["common difference", "common ratio", "add", "multiply", "constant", "terms", "sequence", "previous term"] },
    practice: [
      "Find the sum of the first 20 terms of the AP 5, 9, 13, …",
      "The 3rd term of a GP is 12 and the 6th term is 96: find the first term and the common ratio",
      "Find the sum 1 + 3 + 9 + … up to 6 terms",
    ],
  },

  {
    id: "m9", title: "Straight Lines",
    mcq: [
      m(1, "The slope of the line y = 3x + 2 is", ["2", "3", "−3", "1/3"], 1),
      m(1, "The slope of a line parallel to the x-axis is", ["0", "1", "Undefined", "−1"], 0),
      m(1, "The distance between the points (0, 0) and (3, 4) is", ["3", "4", "5", "7"], 2),
      m(2, "The equation of the line with slope 2 and y-intercept −1 is", ["y = x − 2", "y = 2x − 1", "y = −2x + 1", "y = 2x + 1"], 1),
      m(2, "The slope of the line joining (1, 2) and (3, 6) is", ["1", "2", "3", "4"], 1),
      m(3, "Two lines with slopes m₁ and m₂ are perpendicular when", ["m₁ = m₂", "m₁m₂ = −1", "m₁ + m₂ = 0", "m₁m₂ = 1"], 1),
      m(3, "The distance of the point (3, 4) from the line 3x + 4y − 5 = 0 is", ["3", "4", "5", "20"], 1),
      m(4, "The acute angle between the lines y = x and y = √3 x is", ["15°", "30°", "45°", "60°"], 0),
      m(4, "The line through (1, 2) perpendicular to 2x + y = 3 is", ["x − 2y + 3 = 0", "2x − y = 0", "x + 2y − 5 = 0", "2x + y − 4 = 0"], 0),
    ],
    fib: [
      f(1, "The slope of a line making an angle of 45° with the positive x-axis is ____.", ["1", "one"]),
      f(1, "The equation of the x-axis is y = ____.", ["0", "zero"]),
      f(3, "The intercept form of a line is x/a + y/b = ____.", ["1", "one"]),
    ],
    para: { q: "In two lines, explain what the slope of a line tells us.", k: ["steepness", "inclination", "angle", "tan", "rise", "run", "change", "gradient"] },
    practice: [
      "Find the equation of the line through (2, 3) and (4, 7)",
      "Find the distance between the parallel lines 3x + 4y = 5 and 3x + 4y = 15",
      "Find the point of intersection of x + y = 5 and 2x − y = 1",
    ],
  },

  {
    id: "m10", title: "Conic Sections",
    mcq: [
      m(1, "The set of all points at a fixed distance from a fixed point is a", ["Line", "Circle", "Parabola", "Hyperbola"], 1),
      m(1, "The equation of a circle with centre at the origin and radius r is", ["x² + y² = r", "x² + y² = r²", "x + y = r", "xy = r²"], 1),
      m(1, "Which of these is the equation of a parabola?", ["y² = 4ax", "x² + y² = a²", "x²/a² + y²/b² = 1", "x²/a² − y²/b² = 1"], 0),
      m(2, "The centre and radius of the circle (x − 2)² + (y + 3)² = 25 are", ["(2, 3) and 5", "(−2, 3) and 5", "(2, −3) and 5", "(2, −3) and 25"], 2),
      m(2, "The focus of the parabola y² = 8x is", ["(2, 0)", "(4, 0)", "(0, 2)", "(8, 0)"], 0),
      m(3, "The eccentricity of a circle is", ["0", "1", "Between 0 and 1", "More than 1"], 0),
      m(3, "The length of the latus rectum of the parabola y² = 4ax is", ["a", "2a", "4a", "8a"], 2),
      m(4, "The eccentricity of the ellipse x²/25 + y²/9 = 1 is", ["3/5", "4/5", "5/4", "4/3"], 1),
      m(4, "The foci of the hyperbola x²/9 − y²/16 = 1 are", ["(±3, 0)", "(±4, 0)", "(±5, 0)", "(±7, 0)"], 2),
    ],
    fib: [
      f(1, "A conic with eccentricity equal to 1 is a ____.", ["parabola"]),
      f(1, "The longest chord of a circle is its ____.", ["diameter"]),
      f(3, "For an ellipse, the sum of the distances of any point from the two foci equals the length of the ____ axis.", ["major"]),
    ],
    para: { q: "In two lines, explain what the eccentricity of a conic tells us.", k: ["shape", "circle", "ellipse", "parabola", "hyperbola", "ratio", "distance", "focus", "directrix"] },
    practice: [
      "Find the equation of the circle with centre (1, −2) and radius 3",
      "Find the vertex, focus and directrix of the parabola y² = 12x",
      "Find the lengths of the major and minor axes of 4x² + 9y² = 36",
    ],
  },

  {
    id: "m11", title: "Introduction to Three Dimensional Geometry",
    mcq: [
      m(1, "The number of coordinate planes in three-dimensional space is", ["1", "2", "3", "4"], 2),
      m(1, "The coordinates of the origin in 3D are", ["(1, 1, 1)", "(0, 0, 0)", "(1, 0, 0)", "(0, 1, 0)"], 1),
      m(1, "The point (3, 0, 0) lies on the", ["x-axis", "y-axis", "z-axis", "yz-plane"], 0),
      m(2, "The distance of the point (2, 3, 4) from the origin is", ["√9", "√20", "√29", "9"], 2),
      m(2, "The octant in which all three coordinates are positive is the", ["First octant", "Second octant", "Fourth octant", "Eighth octant"], 0),
      m(3, "The distance between (1, 2, 3) and (4, 6, 15) is", ["11", "12", "13", "15"], 2),
      m(3, "The midpoint of the segment joining (2, 4, 6) and (4, 6, 10) is", ["(3, 5, 8)", "(6, 10, 16)", "(1, 1, 2)", "(3, 5, 4)"], 0),
      m(4, "The point dividing the segment joining (1, 2, 3) and (4, 5, 6) internally in the ratio 2 : 1 is", ["(2, 3, 4)", "(3, 4, 5)", "(2.5, 3.5, 4.5)", "(5, 6, 7)"], 1),
      m(4, "The centroid of the triangle with vertices (0, 0, 0), (3, 0, 0) and (0, 6, 0) is", ["(1, 2, 0)", "(3, 6, 0)", "(1, 2, 3)", "(0, 0, 0)"], 0),
    ],
    fib: [
      f(1, "A point on the z-axis has its x and y coordinates equal to ____.", ["0", "zero"]),
      f(1, "The three mutually perpendicular axes in 3D are the x-axis, the y-axis and the ____.", ["z-axis", "z axis", "z"]),
      f(3, "The distance of the point (a, b, c) from the x-axis is √(b² + ____).", ["c²", "c^2", "c2", "c squared"]),
    ],
    para: { q: "In two lines, explain how the three coordinate planes divide space into octants.", k: ["three", "planes", "eight", "octants", "axes", "signs", "positive", "negative", "coordinate"] },
    practice: [
      "Find the distance between the points (2, −1, 3) and (−2, 3, 1)",
      "Find the point that divides the segment joining (1, −2, 3) and (3, 4, −5) internally in the ratio 1 : 3",
      "Show that the points (0, 7, 10), (−1, 6, 6) and (−4, 9, 6) form an isosceles right-angled triangle",
    ],
  },

  {
    id: "m12", title: "Limits and Derivatives",
    mcq: [
      m(1, "lim (x→2) (x + 3) equals", ["2", "3", "5", "Does not exist"], 2),
      m(1, "The derivative of x² is", ["x", "2x", "x²", "2"], 1),
      m(1, "The derivative of a constant is", ["1", "0", "The constant itself", "Undefined"], 1),
      m(2, "lim (x→0) sin x / x equals", ["0", "1", "∞", "Does not exist"], 1),
      m(2, "The derivative of sin x is", ["cos x", "−cos x", "sin x", "−sin x"], 0),
      m(3, "lim (x→2) (x² − 4)/(x − 2) equals", ["0", "2", "4", "Does not exist"], 2),
      m(3, "If y = x³ + 2x, then dy/dx at x = 1 is", ["3", "4", "5", "6"], 2),
      m(4, "The derivative of x² sin x is", ["2x cos x", "2x sin x + x² cos x", "x² cos x", "2x sin x − x² cos x"], 1),
      m(4, "lim (x→0) (eˣ − 1)/x equals", ["0", "1", "e", "∞"], 1),
    ],
    fib: [
      f(1, "The derivative of eˣ is ____.", ["eˣ", "e^x", "ex", "e to the x"]),
      f(1, "The derivative of x⁵ is ____ x⁴.", ["5", "five"]),
      f(3, "By the product rule, d(uv)/dx = u dv/dx + ____ du/dx.", ["v"]),
    ],
    para: { q: "In two lines, explain what the derivative of a function represents.", k: ["rate of change", "slope", "tangent", "instantaneous", "limit", "gradient", "graph", "change"] },
    practice: [
      "Evaluate lim (x→0) sin 3x / 2x",
      "Differentiate (x² + 1)/(x − 1)",
      "Find the derivative of cos x from first principles",
    ],
  },

  {
    id: "m13", title: "Statistics",
    mcq: [
      m(1, "The most frequently occurring value in a data set is the", ["Mean", "Median", "Mode", "Range"], 2),
      m(1, "The range of the data 4, 9, 12, 20 is", ["8", "12", "16", "20"], 2),
      m(1, "The mean of 2, 4, 6, 8 is", ["4", "5", "6", "20"], 1),
      m(2, "The median of 3, 5, 7, 9, 11 is", ["5", "7", "9", "35"], 1),
      m(2, "The variance is the square of the", ["Mean", "Median", "Standard deviation", "Mode"], 2),
      m(3, "The mean of the first five natural numbers is", ["2", "2.5", "3", "5"], 2),
      m(3, "The standard deviation of the data 2, 4, 6, 8 is", ["√5", "5", "2", "√20"], 0),
      m(4, "If every observation in a data set is increased by 5, the standard deviation", ["Increases by 5", "Stays the same", "Is multiplied by 5", "Becomes zero"], 1),
      m(4, "The mean of 5 observations is 12. If the observation 20 is replaced by 10, the new mean is", ["10", "11", "12", "13"], 0),
    ],
    fib: [
      f(1, "The middle value of an ordered data set is the ____.", ["median"]),
      f(1, "A measure of dispersion equal to the square root of the variance is the ____ deviation.", ["standard"]),
      f(3, "The coefficient of variation is (standard deviation / ____) × 100.", ["mean"]),
    ],
    para: { q: "In two lines, explain why standard deviation is a better measure of spread than the range.", k: ["spread", "range", "extreme", "all observations", "mean", "deviation", "outlier", "values", "dispersion"] },
    practice: [
      "Find the mean and variance of 6, 7, 10, 12, 13, 4, 8, 12",
      "Find the median of 12, 7, 3, 15, 9, 21",
      "Two series have means 50 and 60, each with standard deviation 6: which has more variability, and why?",
    ],
  },

  {
    id: "m14", title: "Probability",
    mcq: [
      m(1, "The probability of a certain event is", ["0", "1", "0.5", "−1"], 1),
      m(1, "A fair coin is tossed once. The probability of a head is", ["0", "1/4", "1/2", "1"], 2),
      m(1, "The sum of the probabilities of all outcomes of an experiment is", ["0", "1", "2", "Depends on the experiment"], 1),
      m(2, "A die is rolled once. The probability of getting an even number is", ["1/6", "1/3", "1/2", "2/3"], 2),
      m(2, "If P(A) = 0.3, then P(not A) =", ["0.3", "0.7", "1", "0"], 1),
      m(3, "Two coins are tossed. The probability of getting at least one head is", ["1/4", "1/2", "3/4", "1"], 2),
      m(3, "If A and B are mutually exclusive events, P(A ∪ B) =", ["P(A) × P(B)", "P(A) + P(B)", "P(A) − P(B)", "0"], 1),
      m(4, "Two dice are rolled. The probability that the sum is 8 is", ["1/6", "5/36", "1/9", "7/36"], 1),
      m(4, "A card is drawn from a well-shuffled pack of 52. The probability that it is a king or a heart is", ["4/13", "17/52", "1/2", "3/13"], 0),
    ],
    fib: [
      f(1, "The set of all possible outcomes of an experiment is called the ____ space.", ["sample"]),
      f(1, "An event that cannot happen has probability ____.", ["0", "zero"]),
      f(3, "For any two events, P(A ∪ B) = P(A) + P(B) − P(A ∩ ____).", ["b"]),
    ],
    para: { q: "In two lines, explain what mutually exclusive events are, with an example.", k: ["cannot", "same time", "together", "both", "occur", "disjoint", "coin", "head", "tail", "no common"] },
    practice: [
      "A bag has 4 red and 6 blue balls: find the probability of drawing a red ball",
      "Three coins are tossed: find the probability of getting exactly two heads",
      "If P(A) = 0.5, P(B) = 0.4 and P(A ∪ B) = 0.7, find P(A ∩ B)",
    ],
  },
];
