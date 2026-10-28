// Helpers for writing JEE-style papers.
// mcq(chapter, prompt, correct, [three wrong options])  - the right option is placed at a fixed,
//   spread-out position derived from the question text, so answers are not always "B".
// num(chapter, prompt, value, tolerance)               - a numerical answer. Compute `value` in code.
export const mcq = (chapter, prompt, correct, wrong, grade = 11) => {
  if (wrong.length !== 3) throw new Error(`mcq needs exactly 3 wrong options: ${prompt}`);
  let h = 0;
  for (const ch of prompt) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const at = h % 4;
  const options = [...wrong];
  options.splice(at, 0, correct);
  return { t: "mcq", ch: chapter, q: prompt, o: options, a: at, grade };
};
export const num = (chapter, prompt, value, tol = 0, grade = 11) => ({ t: "num", ch: chapter, q: prompt, n: value, tol, grade });

export const PHY = { units: "Units and Measurements", kin: "Motion in a Straight Line", plane: "Motion in a Plane", laws: "Laws of Motion",
  wep: "Work, Energy and Power", rot: "System of Particles and Rotational Motion", grav: "Gravitation", solids: "Mechanical Properties of Solids",
  fluids: "Mechanical Properties of Fluids", thermal: "Thermal Properties of Matter", thermo: "Thermodynamics", ktg: "Kinetic Theory",
  osc: "Oscillations", waves: "Waves" };
export const CHEM = { mole: "Some Basic Concepts of Chemistry", atom: "Structure of Atom", period: "Classification of Elements and Periodicity in Properties",
  bond: "Chemical Bonding and Molecular Structure", thermo: "Thermodynamics", eq: "Equilibrium", redox: "Redox Reactions",
  goc: "Organic Chemistry: Some Basic Principles and Techniques", hc: "Hydrocarbons" };
export const MATH = { sets: "Sets", rel: "Relations and Functions", trig: "Trigonometric Functions", cplx: "Complex Numbers and Quadratic Equations",
  ineq: "Linear Inequalities", pnc: "Permutations and Combinations", bin: "Binomial Theorem", seq: "Sequences and Series", line: "Straight Lines",
  conic: "Conic Sections", d3: "Introduction to Three Dimensional Geometry", lim: "Limits and Derivatives", stat: "Statistics", prob: "Probability" };
