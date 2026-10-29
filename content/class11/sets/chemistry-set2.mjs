// Class 11 Chemistry, Set 2 (Medium): JEE Main style, one or two steps. Numbers are computed where possible.
import { M, F, P } from "../helpers.mjs";

export const subjectId = "chem";
export const setNo = 2;

const s = String;
const NA = 6.022e23;
const f2 = (x) => s(Number(x.toFixed(2)));

export const chapters = [
  {
    id: "c1",
    mcq: [
      M("mole", 2, "The number of moles in 44 g of CO₂ (C = 12, O = 16) is", s(44 / 44), ["2", "0.5", "4.4"]),
      M("molar-mass", 2, "The mass of 2 mol of NaOH (Na = 23, O = 16, H = 1) is", `${2 * 40} g`, ["40 g", "20 g", "60 g"]),
      M("mole", 3, "10 g of CaCO₃ (molar mass 100 g/mol) contains how many moles?", s(10 / 100), ["1", "0.01", "10"]),
      M("molarity", 3, "4 g of NaOH is dissolved to make 500 mL of solution. The molarity is", `${4 / 40 / 0.5} M`, ["0.8 M", "0.4 M", "2 M"]),
      M("dilution", 3, "100 mL of a 2 M solution is diluted to 500 mL. The new molarity is", `${(100 * 2) / 500} M`, ["10 M", "2.5 M", "0.2 M"]),
      M("empirical-formula", 3, "A compound has C 40%, H 6.7% and O 53.3% by mass. Its empirical formula is", "CH₂O", ["CHO", "C₂H₂O", "CH₄O"]),
    ],
    fib: [
      F("percent", 2, "The percentage by mass of hydrogen in water (H = 1, O = 16) is ____ % (to one decimal place).", ["11.1"]),
      F("limiting-reagent", 3, "In 2H₂ + O₂ → 2H₂O, 4 g of H₂ react with 16 g of O₂. The mass of water formed is ____ g.", ["18"]),
      F("avogadro", 2, "The number of molecules in 0.5 mol of a substance is ____ × 10²³ (to three significant figures).", ["3.01"]),
      F("molar-mass", 2, "The molar mass of H₂SO₄ (H = 1, S = 32, O = 16) is ____ g/mol.", ["98"]),
    ],
    para: [
      P("limiting-reagent", "In two lines, explain what a limiting reagent is and why it decides the amount of product.", ["limiting", "consumed first", "stops", "product", "excess", "reagent", "reaction", "completely"]),
      P("mole", "In two lines, explain what a mole is and why chemists use it.", ["6.022", "10²³", "avogadro", "particles", "atoms", "count", "amount of substance", "grams"]),
    ],
  },
  {
    id: "c2",
    mcq: [
      M("subatomic", 2, "The number of electrons in a Na⁺ ion (Z = 11) is", s(10), ["11", "12", "9"]),
      M("subatomic", 2, "The number of neutrons in ¹⁴C (Z = 6) is", s(14 - 6), ["6", "14", "12"]),
      M("shells", 2, "The maximum number of electrons in the n = 3 shell is", s(2 * 9), ["8", "32", "9"]),
      M("orbitals", 2, "The number of orbitals in the n = 2 shell is", s(4), ["2", "8", "3"]),
      M("bohr", 3, "In the Bohr model, the radius of the n = 3 orbit of hydrogen is how many times that of n = 1?", s(9), ["3", "6", "27"]),
      M("photon", 3, "The energy of a photon of wavelength 500 nm is about (hc = 1240 eV nm)", `${1240 / 500} eV`, ["0.4 eV", "6.2 eV", "24.8 eV"]),
    ],
    fib: [
      F("configuration", 3, "The electronic configuration of Fe (Z = 26) is [Ar] 3d⁶ 4s^____.", ["2"]),
      F("quantum-numbers", 2, "For a p orbital, the azimuthal quantum number l is ____.", ["1"]),
      F("quantum-numbers", 2, "The maximum number of electrons in one orbital is ____.", ["2"]),
      F("spectra", 3, "The line spectrum of hydrogen in the visible region is called the ____ series.", ["balmer"]),
    ],
    para: [
      P("pauli", "In two lines, state the Pauli exclusion principle.", ["no two electrons", "same four quantum numbers", "opposite spin", "orbital", "at most two", "spin"]),
      P("hund", "In two lines, state Hund’s rule of maximum multiplicity with an example.", ["degenerate", "singly", "parallel spins", "pairing", "p orbitals", "nitrogen", "before pairing", "maximum"]),
    ],
  },
  {
    id: "c3",
    mcq: [
      M("ionisation", 3, "Which has the higher first ionisation enthalpy?", "N", ["O", "C", "B"]),
      M("ionisation", 3, "Among Be, B, Li and Na, the highest first ionisation enthalpy belongs to", "Be", ["B", "Li", "Na"]),
      M("size", 3, "The correct order of ionic radii is", "O²⁻ > F⁻ > Na⁺ > Mg²⁺", ["Mg²⁺ > Na⁺ > F⁻ > O²⁻", "F⁻ > O²⁻ > Na⁺ > Mg²⁺", "Na⁺ > Mg²⁺ > O²⁻ > F⁻"]),
      M("size", 2, "The atomic radius of Na, Mg and Al follows the order", "Na > Mg > Al", ["Na < Mg < Al", "Mg > Na > Al", "Al > Mg > Na"]),
      M("electronegativity", 2, "The most electronegative element is", "Fluorine", ["Chlorine", "Oxygen", "Nitrogen"]),
      M("periodic-table", 2, "An element with atomic number 17 belongs to", "Group 17, period 3", ["Group 7, period 3", "Group 17, period 2", "Group 15, period 3"]),
    ],
    fib: [
      F("electron-affinity", 3, "The element with the most negative electron gain enthalpy among F, Cl, Br and I is ____.", ["chlorine", "Cl"]),
      F("periodic-table", 2, "The most electropositive stable alkali metal is ____. (symbol or name)", ["cesium", "caesium", "Cs"]),
      F("periodic-law", 2, "Moseley showed that the properties of elements are a periodic function of their ____ number.", ["atomic"]),
      F("block", 2, "The elements of groups 13 to 18 belong to the ____ block.", ["p"]),
    ],
    para: [
      P("trends", "In two lines, explain why the first ionisation enthalpy generally increases across a period.", ["nuclear charge", "atomic size", "decreases", "effective nuclear charge", "harder", "remove", "electron", "across"]),
      P("exceptions", "In two lines, explain why oxygen has a lower first ionisation enthalpy than nitrogen.", ["half-filled", "stable", "pairing", "repulsion", "2p", "electron", "removal", "nitrogen"]),
    ],
  },
  {
    id: "c4",
    mcq: [
      M("bond-order", 3, "The bond order of O₂ according to molecular orbital theory is", s(2), ["1", "3", "2.5"]),
      M("bond-order", 3, "The bond order of the O₂⁺ ion is", s(2.5), ["2", "1.5", "3"]),
      M("hybridisation", 2, "The hybridisation of carbon in CH₄ is", "sp³", ["sp²", "sp", "sp³d"]),
      M("shape", 2, "The shape of BF₃ is", "Trigonal planar", ["Pyramidal", "Tetrahedral", "Bent"]),
      M("shape", 2, "The H–N–H bond angle in NH₃ is closest to", "107°", ["90°", "120°", "180°"]),
      M("sigma-pi", 3, "In ethene (C₂H₄), the number of σ and π bonds is", "5 σ and 1 π", ["4 σ and 2 π", "6 σ and 0 π", "3 σ and 3 π"]),
    ],
    fib: [
      F("shape", 2, "CO₂ is a ____ molecule. (shape)", ["linear"]),
      F("hybridisation", 3, "The hybridisation of the central atom in BF₃ is sp^____.", ["2"]),
      F("hydrogen-bond", 2, "The type of intermolecular attraction that makes water’s boiling point high is ____ bonding.", ["hydrogen"]),
      F("polarity", 3, "A molecule with a zero net dipole moment even though its bonds are polar, like CO₂, is called ____. (polar or non-polar)", ["non-polar", "nonpolar"]),
    ],
    para: [
      P("vsepr", "In two lines, explain how lone pairs change the bond angle in H₂O compared with CH₄.", ["lone pair", "repulsion", "bond angle", "104.5", "109.5", "decreases", "lone pair–bond pair", "greater"]),
      P("hybridisation", "In two lines, explain what hybridisation means.", ["mixing", "orbitals", "equivalent", "same energy", "hybrid", "shape", "sp³", "atomic orbitals"]),
    ],
  },
  {
    id: "c5",
    mcq: [
      M("gibbs", 3, "For a reaction ΔH = −40 kJ and ΔS = −100 J/K at 300 K, ΔG is", "−10 kJ", ["−70 kJ", "+10 kJ", "−40 kJ"]),
      M("calorimetry", 2, "The heat absorbed by 100 g of water (c = 4.2 J/g K) when its temperature rises by 10 °C is", `${100 * 4.2 * 10} J`, ["420 J", "42000 J", "1000 J"]),
      M("enthalpy", 2, "The enthalpy of combustion of a substance is always", "Negative", ["Positive", "Zero", "Either sign"]),
      M("internal-energy", 3, "For a reaction at constant volume, the heat change equals the change in", "Internal energy", ["Enthalpy", "Entropy", "Free energy"]),
      M("spontaneity", 3, "A reaction with ΔH > 0 and ΔS > 0 is spontaneous at", "High temperature", ["Low temperature", "All temperatures", "No temperature"]),
      M("hess", 3, "Hess’s law states that the enthalpy change of a reaction depends only on", "The initial and final states", ["The path followed", "The rate of reaction", "The catalyst used"]),
    ],
    fib: [
      F("entropy", 2, "The entropy of a gas ____ when it expands into a larger volume. (increases or decreases)", ["increases", "increase"]),
      F("first-law", 2, "In an isolated system, the change in internal energy is ____.", ["0", "zero"]),
      F("enthalpy", 3, "For C(s) + O₂(g) → CO₂(g), ΔH = −393.5 kJ/mol. The ΔH for forming 2 mol of CO₂ this way is ____ kJ.", ["-787", "−787"]),
      F("gibbs", 3, "A reaction is at equilibrium when ΔG equals ____.", ["0", "zero"]),
    ],
    para: [
      P("spontaneity", "In two lines, explain how ΔH, ΔS and temperature decide whether a reaction is spontaneous.", ["ΔG", "ΔH − TΔS", "negative", "spontaneous", "temperature", "entropy", "enthalpy"]),
      P("state-function", "In two lines, explain what a state function is, with one example.", ["path", "independent", "initial and final", "enthalpy", "internal energy", "entropy", "state"]),
    ],
  },
  {
    id: "c6",
    mcq: [
      M("ph", 2, "The pH of 0.01 M HCl is", s(2), ["1", "12", "0.01"]),
      M("ph", 2, "The pH of 0.01 M NaOH at 25 °C is", s(12), ["2", "13", "10"]),
      M("kp-kc", 3, "For N₂ + 3H₂ ⇌ 2NH₃, Kp and Kc are related by", "Kp = Kc(RT)⁻²", ["Kp = Kc(RT)²", "Kp = Kc", "Kp = Kc(RT)⁻¹"]),
      M("buffer", 3, "A buffer has equal concentrations of acetic acid and acetate (pKa = 4.76). Its pH is", s(4.76), ["7", "9.24", "2.38"]),
      M("le-chatelier", 3, "For N₂ + 3H₂ ⇌ 2NH₃, increasing the pressure", "Shifts the equilibrium to the right", ["Shifts it to the left", "Has no effect", "Stops the reaction"]),
      M("solubility", 3, "The solubility of AgCl (Ksp = 1.8 × 10⁻¹⁰) is about", "1.3 × 10⁻⁵ M", ["1.8 × 10⁻¹⁰ M", "9 × 10⁻⁶ M", "1.8 × 10⁻⁵ M"]),
    ],
    fib: [
      F("kw", 2, "At 25 °C, the ionic product of water Kw is 10^____.", ["-14", "−14"]),
      F("ph", 2, "A solution with pH 3 has [H⁺] = 10^____ M.", ["-3", "−3"]),
      F("equilibrium", 3, "If Kc for A ⇌ B is 4, the Kc for B ⇌ A is ____. (fraction)", ["1/4", "0.25", ".25"]),
      F("acid-base", 2, "According to Brønsted–Lowry theory, an acid is a proton ____. (donor or acceptor)", ["donor"]),
    ],
    para: [
      P("le-chatelier", "In two lines, explain what happens to the position of an equilibrium when more reactant is added.", ["opposes", "change", "equilibrium", "shifts", "concentration", "pressure", "temperature", "counteract"]),
      P("common-ion", "In two lines, explain why adding NaCl to a saturated solution of AgCl lowers the solubility of AgCl.", ["suppresses", "ionisation", "common ion", "decreases", "solubility", "added", "same ion", "weak"]),
    ],
  },
  {
    id: "c7",
    mcq: [
      M("oxidation-number", 2, "The oxidation number of Cr in CrO₄²⁻ is", "+6", ["+3", "+7", "+2"]),
      M("oxidation-number", 2, "The oxidation number of Mn in MnO₂ is", "+4", ["+2", "+6", "+7"]),
      M("oxidation-number", 2, "The oxidation number of N in HNO₃ is", "+5", ["+3", "+4", "−3"]),
      M("electron-transfer", 3, "In MnO₄⁻ → Mn²⁺ (acidic medium), the number of electrons gained per Mn is", s(5), ["3", "1", "7"]),
      M("agents", 2, "In Zn + Cu²⁺ → Zn²⁺ + Cu, the species that is oxidised is", "Zn", ["Cu²⁺", "Zn²⁺", "Cu"]),
      M("oxidising-agent", 2, "A substance that gains electrons in a reaction is", "An oxidising agent", ["A reducing agent", "A catalyst", "An inert species"]),
    ],
    fib: [
      F("oxidation-number", 3, "The oxidation number of oxygen in OF₂ is ____.", ["+2", "2"]),
      F("oxidation-number", 2, "The oxidation number of Cl in HClO₄ is ____.", ["+7", "7"]),
      F("electrons", 3, "In Fe²⁺ → Fe³⁺ the number of electrons lost is ____.", ["1", "one"]),
      F("redox", 2, "Loss of electrons is called ____.", ["oxidation"]),
    ],
    para: [
      P("balancing", "In two lines, explain the ion–electron (half-reaction) method for balancing a redox equation.", ["half reactions", "oxidation", "reduction", "electrons", "balance", "add", "H⁺", "H₂O", "cancel"]),
      P("agents", "In two lines, explain the difference between an oxidising agent and a reducing agent.", ["gains electrons", "loses electrons", "reduced", "oxidised", "oxidising agent", "reducing agent", "itself"]),
    ],
  },
  {
    id: "c8",
    mcq: [
      M("nomenclature", 2, "The IUPAC name of CH₃CH₂CH₂OH is", "Propan-1-ol", ["Propan-2-ol", "Propanol-3", "Ethanol"]),
      M("hybridisation", 2, "The hybridisation of each carbon in ethene (C=C) is", "sp²", ["sp³", "sp", "sp³d"]),
      M("carbocation", 3, "The most stable carbocation among the following is", "(CH₃)₃C⁺", ["CH₃⁺", "CH₃CH₂⁺", "(CH₃)₂CH⁺"]),
      M("isomerism", 2, "The number of structural isomers of C₄H₁₀ is", s(2), ["1", "3", "4"]),
      M("fission", 2, "Homolytic fission of a covalent bond produces", "Free radicals", ["Ions", "Carbocations only", "Carbanions only"]),
      M("analysis", 3, "0.3 g of an organic compound on combustion gives 0.44 g CO₂. The percentage of carbon is", `${((12 / 44) * 0.44 / 0.3 * 100).toFixed(0)}%`, ["12%", "44%", "30%"]),
    ],
    fib: [
      F("reagents", 2, "An electron-rich species that attacks a positive centre is called a ____. (nucleophile or electrophile)", ["nucleophile"]),
      F("effects", 3, "The +I effect is shown by ____ groups. (alkyl or nitro)", ["alkyl"]),
      F("separation", 2, "Liquids with a large difference in boiling points are separated by ____ distillation. (simple or fractional)", ["simple"]),
      F("functional-group", 2, "The functional group in CH₃COOH is ____.", ["carboxyl", "carboxylic acid", "-COOH", "COOH"]),
    ],
    para: [
      P("resonance", "In two lines, explain how resonance stabilises a molecule or ion.", ["delocalisation", "resonance structures", "electrons", "stable", "hybrid", "energy", "lower", "charge"]),
      P("inductive", "In two lines, explain why chloroacetic acid is a stronger acid than acetic acid.", ["sigma bond", "polarisation", "electronegativity", "permanent", "electron withdrawing", "donating", "chain", "shift"]),
    ],
  },
  {
    id: "c9",
    mcq: [
      M("nomenclature", 2, "The IUPAC name of CH₃–CH=CH₂ is", "Propene", ["Propyne", "Propane", "1-Butene"]),
      M("markovnikov", 3, "HBr adds to propene mainly to give", "2-Bromopropane", ["1-Bromopropane", "Propyl radical", "2-Bromopropene"]),
      M("wurtz", 3, "Sodium with methyl bromide in dry ether (Wurtz reaction) gives", "Ethane", ["Methane", "Propane", "Ethene"]),
      M("tests", 2, "Alkenes decolourise", "Bromine water", ["Lime water", "Fehling’s solution", "Tollens’ reagent"]),
      M("kolbe", 3, "Electrolysis of aqueous sodium acetate (Kolbe) gives mainly", "Ethane", ["Methane", "Ethanol", "Ethene"]),
      M("conformations", 2, "The more stable conformation of ethane is", "Staggered", ["Eclipsed", "Both equal", "Boat"]),
    ],
    fib: [
      F("alkynes", 3, "The compound HC≡CH reacts with sodium amide because its hydrogen is ____. (acidic or basic)", ["acidic"]),
      F("benzene", 2, "The electrophile in the nitration of benzene is the ____ ion (give the formula or name).", ["NO₂⁺", "NO2+", "nitronium"]),
      F("combustion", 2, "Complete combustion of an alkane gives carbon dioxide and ____.", ["water", "H₂O", "h2o"]),
      F("hydrogenation", 3, "Complete hydrogenation of ethyne gives ____.", ["ethane"]),
    ],
    para: [
      P("markovnikov", "In two lines, state Markovnikov’s rule.", ["hydrogen", "more hydrogen", "carbon", "double bond", "negative part", "less hydrogen", "unsymmetrical", "addition"]),
      P("aromaticity", "In two lines, state the Hückel rule for aromaticity.", ["4n + 2", "π electrons", "planar", "cyclic", "delocalised", "conjugated", "6", "benzene"]),
    ],
  },
];
