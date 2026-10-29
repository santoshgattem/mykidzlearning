// Class 11 Chemistry, Set 3 (Complex): JEE Main hard / Advanced style, several steps. Numbers are computed where possible.
import { M, F, P } from "../helpers.mjs";

export const subjectId = "chem";
export const setNo = 3;

const s = String;
const R = 8.314;

export const chapters = [
  {
    id: "c1",
    mcq: [
      M("stoichiometry", 4, "How many grams of CO₂ are formed on complete combustion of 6 g of carbon (C = 12)?", `${(6 / 12) * 44} g`, ["6 g", "44 g", "11 g"]),
      M("gas-volume", 4, "The volume at STP (22.4 L/mol) of 8.8 g of CO₂ (M = 44 g/mol) is", "4.48 L", ["22.4 L", "8.8 L", "2.24 L"]),
      M("mole-fraction", 4, "A solution has 2 mol of A and 3 mol of B. The mole fraction of A is", s(2 / 5), ["0.6", "0.67", "0.2"]),
      M("hydrate", 4, "The percentage of water of crystallisation in CuSO₄·5H₂O (Cu = 63.5, S = 32, O = 16, H = 1) is about", `${((5 * 18) / 249.5 * 100).toFixed(0)}%`, ["18%", "64%", "56%"]),
      M("atoms", 4, "The number of atoms in 11.2 L of O₂ at STP is", "6.022 × 10²³", ["3.011 × 10²³", "1.2 × 10²⁴", "6.022 × 10²²"]),
      M("limiting-reagent", 4, "10 g of H₂ and 10 g of O₂ react to form water (2H₂ + O₂ → 2H₂O). The mass of water formed is", `${(10 / 32) * 2 * 18} g`, ["20 g", "90 g", "22.5 g"]),
    ],
    fib: [
      F("molarity", 4, "The molarity of a solution made by dissolving 5.85 g NaCl (M = 58.5) in water to make 250 mL is ____ M.", ["0.4"]),
      F("molality", 4, "4 g of NaOH in 500 g of water gives a molality of ____ m.", [s((4 / 40) / 0.5)]),
      F("empirical-formula", 4, "A hydrocarbon has an empirical formula CH₂ and molar mass 56 g/mol. Its molecular formula is C₄H____.", ["8"]),
      F("percent-composition", 4, "The mass percentage of nitrogen in urea, CO(NH₂)₂ (M = 60), is ____ % (nearest whole number).", [s(Math.round((28 / 60) * 100))]),
    ],
    para: [
      P("empirical-formula", "In two lines, explain how an empirical formula is found from percentage composition.", ["divide by atomic mass", "moles", "simplest ratio", "smallest", "whole number", "percentage", "ratio"]),
      P("concentration", "In two lines, explain why molality does not change with temperature but molarity does.", ["mass", "volume", "temperature", "expands", "kg of solvent", "molality", "molarity", "depends"]),
    ],
  },
  {
    id: "c2",
    mcq: [
      M("rydberg", 4, "The wavelength of the Hα line (n = 3 → 2) of hydrogen using R = 1.097 × 10⁷ m⁻¹ is about", `${Math.round(1 / (1.097e7 * (1 / 4 - 1 / 9)) * 1e9)} nm`, ["486 nm", "121 nm", "1875 nm"]),
      M("bohr-energy", 4, "The energy of the electron in the n = 2 level of hydrogen is", "−3.4 eV", ["−13.6 eV", "−1.51 eV", "−6.8 eV"]),
      M("nodes", 4, "The number of radial nodes in a 4p orbital is", s(4 - 1 - 1), ["1", "3", "0"]),
      M("shell-capacity", 4, "The maximum number of electrons that can have n = 4 is", s(2 * 16), ["16", "18", "8"]),
      M("configuration", 4, "The correct ground-state configuration of Cr (Z = 24) is", "[Ar] 3d⁵ 4s¹", ["[Ar] 3d⁴ 4s²", "[Ar] 3d⁶", "[Ar] 4s² 4p⁴"]),
      M("de-broglie", 4, "The de Broglie wavelength (in Å) of an electron accelerated through 150 V is about (λ = 12.27/√V Å)", `${(12.27 / Math.sqrt(150)).toFixed(1)} Å`, ["12.3 Å", "0.1 Å", "5 Å"]),
    ],
    fib: [
      F("bohr", 4, "The ionisation energy of a hydrogen atom in the n = 2 state is ____ eV.", ["3.4"]),
      F("quantum-numbers", 4, "The total number of orbitals in the n = 3 shell is ____.", ["9"]),
      F("quantum-numbers", 4, "For n = 3 and l = 2, the number of possible values of m is ____.", ["5"]),
      F("uncertainty", 4, "Heisenberg’s principle says the product Δx·Δp is at least h/(4π). If Δx decreases, Δp must ____. (increase or decrease)", ["increase"]),
    ],
    para: [
      P("bohr", "In two lines, state two postulates of Bohr’s model of the hydrogen atom.", ["stationary orbits", "angular momentum", "nh/2π", "quantised", "energy levels", "no radiation", "emits", "jump"]),
      P("exceptions", "In two lines, explain why Cr and Cu have unusual configurations.", ["half-filled", "fully filled", "stability", "exchange energy", "3d", "4s", "symmetry", "d⁵", "d¹⁰"]),
    ],
  },
  {
    id: "c3",
    mcq: [
      M("periodic-table", 4, "The element with Z = 33 belongs to", "Group 15, period 4", ["Group 13, period 4", "Group 17, period 3", "Group 15, period 3"]),
      M("periodic-table", 4, "The element with Z = 25 (Mn) is placed in group", s(7), ["5", "8", "2"]),
      M("diagonal", 4, "Lithium shows a diagonal relationship with", "Magnesium", ["Sodium", "Beryllium", "Aluminium"]),
      M("oxides", 4, "Which oxide is amphoteric?", "Al₂O₃", ["Na₂O", "SO₂", "MgO"]),
      M("isoelectronic", 4, "Among the isoelectronic species N³⁻, O²⁻, F⁻, Na⁺ and Mg²⁺, the smallest is", "Mg²⁺", ["N³⁻", "Na⁺", "F⁻"]),
      M("ionisation", 4, "The element X has successive ionisation enthalpies (kJ/mol) 738, 1451, 7733, 10543. X probably belongs to group", s(2), ["1", "13", "14"]),
    ],
    fib: [
      F("periodic-table", 4, "The element with atomic number 118 would be placed in group ____.", ["18"]),
      F("periodic-table", 4, "The element with atomic number 120 would be placed in group ____.", ["2"]),
      F("block", 4, "The general outer electronic configuration of the halogens is ns² np^____.", ["5"]),
      F("electronegativity", 4, "On the Pauling scale, the electronegativity of fluorine is about ____.", ["4", "4.0"]),
    ],
    para: [
      P("lanthanide", "In two lines, explain lanthanoid contraction and one of its consequences.", ["4f", "poor shielding", "size decreases", "nuclear charge", "similar radii", "zr", "hf", "contraction"]),
      P("shielding", "In two lines, explain the shielding (screening) effect and how it affects atomic size down a group.", ["inner electrons", "effective nuclear charge", "shielding", "size increases", "outer electrons", "repel", "down the group", "shells"]),
    ],
  },
  {
    id: "c4",
    mcq: [
      M("shape", 4, "The shape of ClF₃ is", "T-shaped", ["Trigonal planar", "Trigonal pyramidal", "Linear"]),
      M("shape", 4, "The shape of XeF₄ is", "Square planar", ["Tetrahedral", "See-saw", "Octahedral"]),
      M("hybridisation", 4, "The hybridisation of the central atom in IF₇ (pentagonal bipyramidal) is", "sp³d³", ["sp³d²", "sp³d", "sp³d⁴"]),
      M("mot", 4, "Which of the following is paramagnetic?", "O₂", ["N₂", "F₂", "H₂"]),
      M("bond-order", 4, "The bond order of the O₂⁻ (superoxide) ion is", s(1.5), ["2", "2.5", "1"]),
      M("resonance", 4, "The C–O bond order in the carbonate ion CO₃²⁻ is", "1.33", ["1", "1.5", "2"]),
    ],
    fib: [
      F("shape", 4, "The shape of PCl₅ is trigonal ____.", ["bipyramidal"]),
      F("hybridisation", 4, "The hybridisation of the central atom in ICl₄⁻ is sp³d^____.", ["2"]),
      F("existence", 4, "The bond order of He₂ is ____, so it does not exist.", ["0", "zero"]),
      F("hydrogen-bond", 4, "In ice each water molecule is hydrogen-bonded to ____ other molecules.", ["4", "four"]),
    ],
    para: [
      P("mot", "In two lines, explain how molecular orbital theory predicts that O₂ is paramagnetic.", ["unpaired", "π*", "antibonding", "two electrons", "degenerate", "hund", "paramagnetic", "molecular orbitals"]),
      P("dipole", "In two lines, explain why NF₃ has a much smaller dipole moment than NH₃.", ["lone pair", "bond dipoles", "opposite", "cancel", "direction", "partially", "electronegativity", "fluorine"]),
    ],
  },
  {
    id: "c5",
    mcq: [
      M("bond-enthalpy", 4, "Using bond enthalpies H–H = 436, Cl–Cl = 243 and H–Cl = 431 kJ/mol, ΔH for H₂ + Cl₂ → 2HCl is", `${436 + 243 - 2 * 431} kJ`, ["+183 kJ", "−862 kJ", "−436 kJ"]),
      M("spontaneity", 4, "ΔH = +30 kJ and ΔS = +100 J/K. The reaction becomes spontaneous above", `${(30000 / 100)} K`, ["30 K", "3000 K", "100 K"]),
      M("entropy", 4, "The molar enthalpy of vaporisation of water is 40.7 kJ/mol at 373 K. The entropy of vaporisation is about", `${(40700 / 373).toFixed(0)} J/mol K`, ["40.7 J/mol K", "373 J/mol K", "1.09 J/mol K"]),
      M("equilibrium", 4, "A reaction has K = 10 at 298 K. ΔG° is about (R = 8.314 J/mol K)", `${(-2.303 * R * 298 * 1 / 1000).toFixed(1)} kJ/mol`, ["+5.7 kJ/mol", "−57 kJ/mol", "0"]),
      M("hess", 4, "Given C(s) + O₂ → CO₂ ΔH = −393 kJ and CO + ½O₂ → CO₂ ΔH = −283 kJ, ΔH for C(s) + ½O₂ → CO is", `${-393 + 283} kJ`, ["−676 kJ", "+110 kJ", "−283 kJ"]),
      M("work", 4, "One mole of an ideal gas expands against a constant external pressure of 1 atm from 10 L to 20 L (1 L atm = 101.3 J). The work done by the gas is", `${(1 * 10 * 101.3).toFixed(0)} J`, ["10 J", "2026 J", "101.3 J"]),
    ],
    fib: [
      F("ugh", 4, "For a reaction at constant pressure, ΔH − ΔU = ____ RT, where Δn is the change in moles of gas. (give the symbol)", ["Δn", "Δng", "dn", "Δn(g)"]),
      F("kirchhoff", 4, "A reaction has ΔG° = −RT ln K. If K > 1, then ΔG° is ____. (negative or positive)", ["negative"]),
      F("entropy", 4, "The entropy of a perfect crystal at absolute zero is ____ (third law).", ["0", "zero"]),
      F("calorimetry", 4, "A bomb calorimeter measures the heat change at constant ____.", ["volume"]),
    ],
    para: [
      P("gibbs", "In two lines, explain how ΔG° and the equilibrium constant K are related.", ["ΔG° = −RT ln K", "negative", "positive", "K > 1", "spontaneous", "equilibrium", "standard"]),
      P("hess", "In two lines, explain how Hess’s law lets us find enthalpies that cannot be measured directly.", ["steps", "add", "path independent", "combine", "known reactions", "enthalpy", "state function", "indirectly"]),
    ],
  },
  {
    id: "c6",
    mcq: [
      M("weak-acid", 4, "The pH of 0.1 M acetic acid (Ka = 1.8 × 10⁻⁵) is about", `${(-Math.log10(Math.sqrt(1.8e-5 * 0.1))).toFixed(2)}`, ["1", "4.74", "5.0"]),
      M("mixing", 4, "50 mL of 0.1 M HCl is mixed with 25 mL of 0.1 M NaOH. The pH of the mixture is about", `${(-Math.log10(2.5 / 75 * 1)).toFixed(2)}`, ["1.00", "7.00", "2.00"]),
      M("dissociation", 4, "The degree of dissociation of 0.1 M acetic acid (Ka = 1.8 × 10⁻⁵) is about", `${Math.sqrt(1.8e-5 / 0.1).toFixed(4)}`, ["0.018", "0.0018", "0.13"]),
      M("buffer", 4, "A buffer contains 0.2 M CH₃COOH and 0.1 M CH₃COONa (pKa = 4.76). Its pH is about", `${(4.76 + Math.log10(0.1 / 0.2)).toFixed(2)}`, ["4.76", "5.06", "4.16"]),
      M("equilibrium-calc", 4, "A + B ⇌ C has Kc = 4. Starting with 1 mol each of A and B in 1 L (no C), the equilibrium amount of C is", "0.61 mol", ["0.5 mol", "0.8 mol", "1 mol"]),
      M("solubility-product", 4, "For Ca(OH)₂ with solubility s mol/L, the Ksp is", "4s³", ["s³", "27s⁴", "4s²"]),
    ],
    fib: [
      F("equilibrium", 4, "For 2SO₂ + O₂ ⇌ 2SO₃, Kp and Kc are related by Kp = Kc(RT)^____.", ["-1", "−1"]),
      F("ph", 4, "The pH of a solution with [H⁺] = 2 × 10⁻³ M is about ____ (to one decimal place). (log 2 = 0.30)", ["2.7"]),
      F("hydrolysis", 4, "An aqueous solution of NH₄Cl is ____. (acidic, basic or neutral)", ["acidic"]),
      F("pka", 4, "If pKa of an acid is 5, then its Ka is 10^____.", ["-5", "−5"]),
    ],
    para: [
      P("buffer", "In two lines, explain how a buffer resists a change in pH on adding a little acid.", ["weak acid", "conjugate base", "neutralises", "H⁺", "ratio", "henderson", "small change", "added acid"]),
      P("ksp", "In two lines, explain how Ksp and ionic product help to predict precipitation.", ["ionic product", "Ksp", "greater than", "precipitate", "less than", "saturated", "unsaturated", "solubility product"]),
    ],
  },
  {
    id: "c7",
    mcq: [
      M("oxidation-number", 4, "The average oxidation number of S in the tetrathionate ion S₄O₆²⁻ is", "+2.5", ["+2", "+3", "+6"]),
      M("oxidation-number", 4, "The oxidation number of Fe in Fe₃O₄ (average) is", "+8/3", ["+2", "+3", "+4"]),
      M("disproportionation", 4, "Cl₂ reacting with cold dilute NaOH gives", "Cl⁻ and ClO⁻", ["Cl⁻ and ClO₃⁻", "ClO⁻ and ClO₃⁻", "Cl⁻ only"]),
      M("equivalents", 4, "How many millimoles of Fe²⁺ are oxidised by 20 mL of 0.1 M KMnO₄ in acidic medium?", `${20 * 0.1 * 5} mmol`, ["2 mmol", "20 mmol", "50 mmol"]),
      M("oxidation-number", 4, "The oxidation state of Cr in CrO₅ (which contains two peroxide groups) is", "+6", ["+10", "+5", "+4"]),
      M("oxidation-number", 4, "In NH₄NO₃ the oxidation numbers of the two nitrogen atoms are", "−3 and +5", ["+3 and +5", "−3 and −5", "+5 and +5"]),
    ],
    fib: [
      F("electrons", 4, "In the reaction Cr₂O₇²⁻ → 2Cr³⁺, the number of electrons gained is ____.", ["6"]),
      F("n-factor", 4, "The n-factor of oxalic acid (H₂C₂O₄ → 2CO₂) in redox reactions is ____.", ["2"]),
      F("redox", 4, "In 2H₂O₂ → 2H₂O + O₂, hydrogen peroxide acts as both oxidising and reducing agent. This is called ____ reaction.", ["disproportionation"]),
      F("balancing", 4, "In the balanced equation MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O, the H₂O formed is ____ molecules.", ["4"]),
    ],
    para: [
      P("disproportionation", "In two lines, explain what a disproportionation reaction is with an example.", ["same element", "oxidised", "reduced", "simultaneously", "H₂O₂", "Cl₂", "intermediate", "oxidation state"]),
      P("titration", "In two lines, explain why KMnO₄ acts as its own indicator in titrations with Fe²⁺.", ["pink", "purple", "colourless", "Mn²⁺", "end point", "excess", "permanganate", "self indicator"]),
    ],
  },
  {
    id: "c8",
    mcq: [
      M("isomers", 4, "The number of structural isomers of C₆H₁₄ is", s(5), ["4", "6", "7"]),
      M("bonds", 4, "In CH₂=CH–C≡CH, the total numbers of σ and π bonds are", "7 σ and 3 π", ["6 σ and 4 π", "8 σ and 2 π", "5 σ and 5 π"]),
      M("kjeldahl", 4, "In Kjeldahl’s method 0.5 g of an organic compound gave NH₃ that neutralised 20 mL of 0.5 N H₂SO₄. The percentage of nitrogen is", `${(1.4 * 0.5 * 20 / 0.5).toFixed(0)}%`, ["14%", "7%", "2.8%"]),
      M("stability", 4, "The order of stability of alkyl carbanions is", "CH₃⁻ > 1° > 2° > 3°", ["3° > 2° > 1° > CH₃⁻", "2° > 3° > 1° > CH₃⁻", "All are equally stable"]),
      M("hyperconjugation", 4, "The number of hyperconjugative structures of the ethyl cation CH₃CH₂⁺ is", s(3), ["1", "2", "6"]),
      M("aromatic", 4, "Which of these is aromatic?", "Benzene", ["Cyclobutadiene", "Cyclooctatetraene (planar)", "Cyclohexane"]),
    ],
    fib: [
      F("isomerism", 4, "The number of monochloro structural isomers of neopentane (2,2-dimethylpropane) is ____.", ["1", "one"]),
      F("effects", 4, "The effect in which σ electrons of an adjacent C–H bond stabilise a carbocation is called ____.", ["hyperconjugation"]),
      F("nomenclature", 4, "The IUPAC name of (CH₃)₂CHCH₂CH₃ is 2-methyl____.", ["butane"]),
      F("tests", 4, "In Lassaigne’s test, the sodium extract of a compound containing nitrogen and sulphur gives a blood-red colour with ferric ions due to ____. (name or formula)", ["thiocyanate", "SCN", "NaSCN", "Fe(SCN)"]),
    ],
    para: [
      P("hyperconjugation", "In two lines, explain why a tertiary carbocation is more stable than a primary one.", ["inductive", "hyperconjugation", "alkyl groups", "electron donating", "positive charge", "dispersed", "more", "C–H"]),
      P("purification", "In two lines, explain when steam distillation is used to purify an organic compound.", ["immiscible", "decomposes", "boiling point", "steam", "water", "volatile", "lower temperature", "aniline"]),
    ],
  },
  {
    id: "c9",
    mcq: [
      M("ozonolysis", 4, "Ozonolysis of 2-butene followed by reduction with Zn/H₂O gives", "Two molecules of ethanal", ["Propanone", "Butanal", "Ethanoic acid only"]),
      M("markovnikov", 4, "2-Methylpropene reacts with HBr to give mainly", "2-Bromo-2-methylpropane", ["1-Bromo-2-methylpropane", "2-Bromobutane", "1-Bromobutane"]),
      M("chlorination", 4, "The number of different monochloro products from free-radical chlorination of 2-methylbutane is", s(4), ["2", "3", "5"]),
      M("saytzeff", 4, "Dehydrobromination of 2-bromobutane with alcoholic KOH gives mainly", "2-Butene", ["1-Butene", "Butane", "2-Butyne"]),
      M("directing", 4, "In electrophilic substitution of nitrobenzene, the incoming group goes mainly to the", "Meta position", ["Ortho position", "Para position", "Ortho and para equally"]),
      M("aromatic", 4, "Friedel–Crafts methylation of benzene with CH₃Cl and anhydrous AlCl₃ gives", "Toluene", ["Phenol", "Benzoic acid", "Chlorobenzene"]),
    ],
    fib: [
      F("alkynes", 4, "Hydration of ethyne with dilute H₂SO₄ and HgSO₄ finally gives ____. (name)", ["ethanal", "acetaldehyde"]),
      F("addition", 4, "In the presence of peroxide, HBr adds to propene against Markovnikov’s rule. This is the ____ effect.", ["peroxide", "kharasch"]),
      F("benzene", 4, "The number of π electrons in benzene is ____.", ["6"]),
      F("polymerisation", 4, "Three molecules of ethyne passed through a red-hot iron tube give ____.", ["benzene"]),
    ],
    para: [
      P("directing", "In two lines, explain why –OH is an ortho/para director and activates the benzene ring.", ["lone pair", "resonance", "electron donating", "ortho", "para", "activates", "electron density", "delocalised"]),
      P("isomerism", "In two lines, explain how cis and trans isomers of 2-butene differ in physical properties.", ["boiling point", "dipole moment", "cis", "trans", "polar", "melting point", "symmetry", "packing"]),
    ],
  },
];
