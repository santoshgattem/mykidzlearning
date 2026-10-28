import { mcq, num, CHEM as C } from "./helpers.mjs";

export const chemistry = [
  // ---- 20 multiple-choice
  mcq(C.mole, "The number of moles in 11 g of carbon dioxide (C = 12, O = 16) is", "0.25", ["0.5", "2.5", "4"]),
  mcq(C.mole, "4 g of hydrogen reacts with 32 g of oxygen according to 2H₂ + O₂ → 2H₂O. The limiting reagent is", "Neither; both are completely consumed", ["Hydrogen", "Oxygen", "It cannot be decided"]),
  mcq(C.atom, "The number of unpaired electrons in Fe³⁺ (atomic number of Fe = 26) is", "5", ["3", "4", "6"]),
  mcq(C.atom, "The orbital with principal quantum number n = 3 and azimuthal quantum number l = 2 is", "3d", ["3s", "3p", "4f"]),
  mcq(C.atom, "According to Bohr’s model, the radius of the second orbit (n = 2) of hydrogen in terms of the first Bohr radius a₀ is", "4a₀", ["a₀", "2a₀", "8a₀"]),
  mcq(C.atom, "Which of the following sets of quantum numbers is NOT possible?", "n = 3, l = 3, m = 0, s = +½", ["n = 2, l = 1, m = −1, s = −½", "n = 4, l = 2, m = 0, s = +½", "n = 1, l = 0, m = 0, s = −½"]),
  mcq(C.period, "Among Be, B, C and N, the element with the lowest first ionisation energy is", "B", ["Be", "C", "N"]),
  mcq(C.period, "The correct order of atomic radii is", "Na > Mg > Al > Si", ["Si > Al > Mg > Na", "Mg > Na > Si > Al", "Al > Si > Na > Mg"]),
  mcq(C.bond, "The hybridisation of the central atom in SF₄ is", "sp³d", ["sp³", "sp³d²", "sp²"]),
  mcq(C.bond, "The bond order of the superoxide ion O₂⁻ is", "1.5", ["1", "2", "2.5"]),
  mcq(C.bond, "The shape of the XeF₂ molecule is", "Linear", ["Bent", "Trigonal planar", "T-shaped"]),
  mcq(C.bond, "Which of the following has the highest boiling point?", "HF", ["HCl", "HBr", "HI"]),
  mcq(C.thermo, "A reaction is spontaneous at all temperatures when", "ΔH is negative and ΔS is positive", ["ΔH is positive and ΔS is negative", "ΔH is positive and ΔS is positive", "ΔH is negative and ΔS is negative"]),
  mcq(C.thermo, "For N₂(g) + 3H₂(g) → 2NH₃(g), the relation between ΔH and ΔU is", "ΔH = ΔU − 2RT", ["ΔH = ΔU + 2RT", "ΔH = ΔU", "ΔH = ΔU − 4RT"]),
  mcq(C.eq, "For N₂ + 3H₂ ⇌ 2NH₃, the relation between Kp and Kc is", "Kp = Kc (RT)⁻²", ["Kp = Kc (RT)²", "Kp = Kc", "Kp = Kc (RT)⁻¹"]),
  mcq(C.eq, "In the equilibrium N₂O₄(g) ⇌ 2NO₂(g), increasing the pressure at constant temperature shifts the equilibrium", "Towards N₂O₄ (the left)", ["Towards NO₂ (the right)", "It has no effect", "First right, then left"]),
  mcq(C.redox, "The oxidation state of chromium in K₂Cr₂O₇ is", "+6", ["+3", "+4", "+7"]),
  mcq(C.goc, "Which of the following carbocations is the most stable?", "(CH₃)₃C⁺", ["CH₃⁺", "CH₃CH₂⁺", "(CH₃)₂CH⁺"]),
  mcq(C.goc, "The IUPAC name of CH₃–CH(CH₃)–CH₂–CH₃ is", "2-Methylbutane", ["2-Methylpropane", "3-Methylbutane", "Pentane"]),
  mcq(C.hc, "The addition of HBr to propene (in the absence of peroxide) gives mainly", "2-Bromopropane", ["1-Bromopropane", "2-Bromo-2-methylpropane", "1,2-Dibromopropane"]),

  // ---- 10 numerical
  num(C.mole, "What mass of NaOH (Na = 23, O = 16, H = 1) is needed to prepare 500 mL of a 0.2 M solution? Give the mass in grams.", 0.2 * 0.5 * (23 + 16 + 1), 0.001),
  num(C.mole, "Find the volume, in litres, occupied at STP by 8 g of oxygen gas (O = 16; one mole of gas occupies 22.4 L at STP).", (8 / 32) * 22.4, 0.01),
  num(C.atom, "What is the total number of orbitals present in the third shell (n = 3)?", 3 ** 2),
  num(C.bond, "How many sigma (σ) bonds are present in one molecule of ethene, C₂H₄?", 5),
  num(C.bond, "How many lone pairs of electrons are present on the central atom of XeF₄?", 2),
  num(C.thermo, "Given C(s) + O₂(g) → CO₂(g), ΔH = −394 kJ and CO(g) + ½O₂(g) → CO₂(g), ΔH = −283 kJ, find the enthalpy of formation of CO(g) in kJ/mol.", -394 - -283),
  num(C.eq, "Find the pH of a 0.005 M solution of Ba(OH)₂ at 25 °C, assuming complete dissociation.", 14 - -Math.log10(2 * 0.005) * 1, 0.01),
  num(C.eq, "For the reaction 2A ⇌ B, the equilibrium concentrations are [A] = 0.2 M and [B] = 0.8 M. Find the equilibrium constant Kc.", 0.8 / 0.2 ** 2, 0.01),
  num(C.redox, "What is the oxidation number of manganese in KMnO₄?", 7),
  num(C.hc, "How many structural isomers (excluding stereoisomers) does pentane, C₅H₁₂, have?", 3),
];
