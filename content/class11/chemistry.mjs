// Class 11 Chemistry, NCERT (rationalised) chapter order. See physics.mjs for the format.

const m = (l, q, o, a) => ({ l, q, o, a });
const f = (l, q, a) => ({ l, q, a });

export const chapters = [
  { id: "c1", legacy: "c1" }, // Some Basic Concepts of Chemistry
  { id: "c2", legacy: "c2" }, // Structure of Atom

  {
    id: "c3", title: "Classification of Elements and Periodicity in Properties",
    mcq: [
      m(1, "In the modern periodic table, elements are arranged in order of increasing", ["Atomic mass", "Atomic number", "Number of neutrons", "Density"], 1),
      m(1, "The number of groups in the modern periodic table is", ["7", "8", "16", "18"], 3),
      m(1, "Which of the following is an alkali metal?", ["Calcium", "Sodium", "Aluminium", "Magnesium"], 1),
      m(2, "Atomic radius generally ____ across a period from left to right", ["Increases", "Decreases", "Stays the same", "First increases, then decreases"], 1),
      m(2, "Which element has the highest electronegativity?", ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"], 2),
      m(3, "Among these, the element with the highest first ionisation enthalpy is", ["Na", "Ne", "Mg", "Ar"], 1),
      m(3, "Which of these isoelectronic species has the smallest radius?", ["O²⁻", "F⁻", "Na⁺", "Mg²⁺"], 3),
      m(4, "Chlorine has a more negative electron gain enthalpy than fluorine because", ["Fluorine is larger", "Strong electron–electron repulsion in the small 2p subshell of fluorine reduces its electron gain", "Chlorine has fewer shells", "Fluorine has a lower nuclear charge"], 1),
      m(4, "The correct order of first ionisation enthalpy is", ["Be < B < C", "B < Be < C", "C < B < Be", "Be < C < B"], 1),
    ],
    fib: [
      f(1, "Elements in the same group have the same number of ____ electrons.", ["valence", "outer"]),
      f(1, "The element with atomic number 17 belongs to the ____ family.", ["halogen", "halogens"]),
      f(3, "Among isoelectronic ions, the one with the greater nuclear charge has a ____ ionic radius.", ["smaller", "lesser", "less"]),
    ],
    para: { q: "In two lines, explain why ionisation enthalpy generally increases across a period.", k: ["nuclear charge", "atomic size", "radius", "electrons", "attraction", "remove", "effective nuclear charge", "shell"] },
    practice: [
      "Arrange Na, Mg, Al and Si in increasing order of first ionisation enthalpy and justify the order",
      "Write the electronic configuration of the element in period 3, group 17 and name it",
      "Explain why Al₂O₃ is amphoteric whereas Na₂O is basic",
    ],
  },

  { id: "c4", legacy: "c3", title: "Chemical Bonding and Molecular Structure" },

  {
    id: "c5", title: "Thermodynamics",
    mcq: [
      m(1, "A system that can exchange both matter and energy with its surroundings is", ["Isolated", "Closed", "Open", "Adiabatic"], 2),
      m(1, "For an exothermic reaction, ΔH is", ["Positive", "Negative", "Zero", "Infinite"], 1),
      m(1, "The enthalpy change at constant pressure equals", ["The heat absorbed or released", "The work done", "The entropy", "The Gibbs energy"], 0),
      m(2, "The standard enthalpy of formation of an element in its standard state is", ["Positive", "Negative", "Zero", "Infinite"], 2),
      m(2, "Hess’s law states that the enthalpy change of a reaction", ["Depends on the path taken", "Is independent of the path taken", "Depends on the catalyst", "Is always negative"], 1),
      m(3, "Using ΔG = ΔH − TΔS, a reaction is spontaneous at all temperatures when", ["ΔH > 0 and ΔS < 0", "ΔH < 0 and ΔS > 0", "ΔH > 0 and ΔS > 0", "ΔH < 0 and ΔS < 0"], 1),
      m(3, "For a reaction ΔH = −40 kJ and ΔS = −100 J/K. Above which temperature does it stop being spontaneous?", ["100 K", "200 K", "400 K", "4000 K"], 2),
      m(4, "For N₂(g) + 3H₂(g) → 2NH₃(g) at constant temperature, ΔH − ΔU equals", ["+2RT", "−2RT", "−4RT", "0"], 1),
      m(4, "The enthalpy of combustion of carbon to CO₂ is −394 kJ/mol. The heat released on burning 6 g of carbon (C = 12) is", ["394 kJ", "197 kJ", "98.5 kJ", "788 kJ"], 1),
    ],
    fib: [
      f(1, "A process that releases heat to the surroundings is called ____.", ["exothermic"]),
      f(1, "A property whose value depends only on the initial and final states is called a ____ function.", ["state"]),
      f(3, "The measure of the randomness or disorder of a system is called ____.", ["entropy"]),
    ],
    para: { q: "In two lines, explain why the sign of Gibbs energy change decides whether a reaction is spontaneous.", k: ["gibbs", "spontaneous", "negative", "enthalpy", "entropy", "temperature", "free energy"] },
    practice: [
      "Calculate ΔU when a system absorbs 1 kJ of heat and does 400 J of work",
      "Find ΔH for CH₄ + 2O₂ → CO₂ + 2H₂O(l) given ΔHf: CH₄ = −74.8, CO₂ = −393.5, H₂O(l) = −285.8 kJ/mol",
      "Explain, using ΔG = ΔH − TΔS, why ice melts spontaneously above 0 °C",
    ],
  },

  {
    id: "c6", title: "Equilibrium",
    mcq: [
      m(1, "At chemical equilibrium, the rates of the forward and backward reactions are", ["Zero", "Equal", "Different", "Infinite"], 1),
      m(1, "The equilibrium constant Kc of a reaction depends on", ["Temperature", "Initial concentrations", "A catalyst", "Pressure only"], 0),
      m(1, "A catalyst", ["Shifts the equilibrium forward", "Shifts the equilibrium backward", "Does not change the position of equilibrium", "Changes Kc"], 2),
      m(2, "The pH of a solution with [H⁺] = 10⁻³ M is", ["3", "11", "7", "−3"], 0),
      m(2, "By Le Chatelier’s principle, adding more reactant to a system at equilibrium", ["Shifts it towards products", "Shifts it towards reactants", "Has no effect", "Changes Kc"], 0),
      m(3, "For N₂ + 3H₂ ⇌ 2NH₃, increasing the pressure shifts the equilibrium", ["Towards the reactants", "Towards the products", "Not at all", "Until Kc becomes zero"], 1),
      m(3, "The pH of 0.01 M HCl (a strong acid) is", ["1", "2", "12", "0.01"], 1),
      m(4, "For A ⇌ B, Kc = 4. If initially [A] = 1 M and [B] = 0, the equilibrium [B] is", ["0.2 M", "0.5 M", "0.8 M", "1 M"], 2),
      m(4, "Kp = Kc(RT)^Δn. For PCl₅ ⇌ PCl₃ + Cl₂, Δn is", ["−1", "0", "1", "2"], 2),
    ],
    fib: [
      f(1, "The negative logarithm of the hydrogen ion concentration is called ____.", ["ph"]),
      f(1, "According to Arrhenius, an acid gives ____ ions in water.", ["h+", "h⁺", "hydrogen", "proton", "protons"]),
      f(3, "The product [H⁺][OH⁻] = 10⁻¹⁴ at 25 °C is called the ionic ____ of water.", ["product"]),
    ],
    para: { q: "In two lines, state Le Chatelier’s principle.", k: ["equilibrium", "disturbed", "change", "oppose", "shift", "counteract", "concentration", "pressure", "temperature"] },
    practice: [
      "Write the expression for Kc for N₂(g) + 3H₂(g) ⇌ 2NH₃(g)",
      "Calculate the pH of 0.001 M NaOH at 25 °C",
      "Predict the effect of raising the temperature on N₂O₄ ⇌ 2NO₂ (ΔH > 0)",
    ],
  },

  {
    id: "c7", title: "Redox Reactions",
    mcq: [
      m(1, "Oxidation is the", ["Gain of electrons", "Loss of electrons", "Gain of protons", "Loss of neutrons"], 1),
      m(1, "The oxidation number of oxygen in most compounds is", ["+2", "−1", "−2", "0"], 2),
      m(1, "A reducing agent", ["Gains electrons", "Loses electrons", "Is always oxygen", "Is itself reduced"], 1),
      m(2, "The oxidation number of Mn in KMnO₄ is", ["+2", "+4", "+6", "+7"], 3),
      m(2, "In Zn + Cu²⁺ → Zn²⁺ + Cu, the oxidising agent is", ["Zn", "Cu²⁺", "Zn²⁺", "Cu"], 1),
      m(3, "The oxidation number of Cr in K₂Cr₂O₇ is", ["+3", "+5", "+6", "+7"], 2),
      m(3, "In 2H₂O₂ → 2H₂O + O₂, hydrogen peroxide acts as", ["Only an oxidising agent", "Only a reducing agent", "Both an oxidising and a reducing agent", "Neither"], 2),
      m(4, "The average oxidation number of sulphur in Na₂S₄O₆ is", ["+2", "+2.5", "+4", "+6"], 1),
      m(4, "In MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O, each MnO₄⁻ gains how many electrons?", ["1", "3", "5", "7"], 2),
    ],
    fib: [
      f(1, "A reaction in which oxidation and reduction occur together is called a ____ reaction.", ["redox"]),
      f(1, "The oxidation number of an element in its free state is ____.", ["zero", "0"]),
      f(3, "A reaction in which the same element is both oxidised and reduced is called a ____ reaction.", ["disproportionation"]),
    ],
    para: { q: "In two lines, explain what happens to electrons and oxidation numbers in a redox reaction.", k: ["oxidation", "reduction", "electrons", "oxidation number", "increase", "decrease", "loss", "gain"] },
    practice: [
      "Find the oxidation number of Cl in HClO₄",
      "Balance by the oxidation number method: Cu + HNO₃ → Cu(NO₃)₂ + NO₂ + H₂O",
      "Identify the oxidising and reducing agents in 2Mg + O₂ → 2MgO",
    ],
  },

  {
    id: "c8", title: "Organic Chemistry: Some Basic Principles and Techniques",
    mcq: [
      m(1, "The first member of the alkane family is", ["Ethane", "Methane", "Propane", "Butane"], 1),
      m(1, "The IUPAC name of CH₃CH₂OH is", ["Methanol", "Ethanol", "Propanol", "Ethanal"], 1),
      m(1, "Carbon shows catenation, which means", ["It forms ionic bonds", "It forms long chains with itself", "It is a metal", "It has a high density"], 1),
      m(2, "The functional group –COOH is called a", ["Aldehyde", "Ketone", "Carboxylic acid", "Alcohol"], 2),
      m(2, "Isomers have the same molecular formula but different", ["Atomic numbers", "Structures", "Molecular masses", "Numbers of atoms"], 1),
      m(3, "The hybridisation of carbon in ethene (CH₂=CH₂) is", ["sp", "sp²", "sp³", "sp³d"], 1),
      m(3, "Fractional distillation is used to separate liquids that", ["Have very different boiling points", "Have close boiling points", "Are immiscible", "Are solids"], 1),
      m(4, "The most stable carbocation among these is", ["CH₃⁺", "CH₃CH₂⁺", "(CH₃)₂CH⁺", "(CH₃)₃C⁺"], 3),
      m(4, "Lassaigne’s test is used to detect", ["Hydrogen only", "Nitrogen, sulphur and halogens", "Oxygen only", "Carbon only"], 1),
    ],
    fib: [
      f(1, "Compounds with the same molecular formula but different structures are called ____.", ["isomers"]),
      f(1, "The simplest hydrocarbon with a carbon–carbon double bond is ____.", ["ethene", "ethylene"]),
      f(3, "The complete transfer of the π electrons towards one atom in the presence of an attacking reagent is the ____ effect.", ["electromeric"]),
    ],
    para: { q: "In two lines, explain the inductive effect.", k: ["sigma", "electron", "displacement", "bond", "electronegativity", "atoms", "polar", "chain", "permanent"] },
    practice: [
      "Write the IUPAC name of CH₃–CH(CH₃)–CH₂–CH₃",
      "Draw all the structural isomers of C₄H₁₀",
      "Explain how Lassaigne’s test detects nitrogen in an organic compound",
    ],
  },

  {
    id: "c9", title: "Hydrocarbons",
    mcq: [
      m(1, "The general formula of alkanes is", ["CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙHₙ"], 1),
      m(1, "The general formula of alkenes is", ["CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙH₂ₙ₊₁"], 0),
      m(1, "Benzene is an example of an", ["Alkane", "Alkene", "Aromatic hydrocarbon", "Alkyne"], 2),
      m(2, "Markovnikov’s rule applies to the addition of HBr to", ["Alkanes", "Unsymmetrical alkenes", "Benzene", "Methane"], 1),
      m(2, "The products of complete combustion of a hydrocarbon are", ["CO and H₂", "CO₂ and H₂O", "C and H₂O", "CH₄ and O₂"], 1),
      m(3, "Which of these shows geometrical (cis–trans) isomerism?", ["But-1-ene", "But-2-ene", "Propene", "Ethene"], 1),
      m(3, "Ethyne (acetylene) is prepared in the laboratory by the action of water on", ["Calcium carbide", "Calcium carbonate", "Calcium oxide", "Sodium carbonate"], 0),
      m(4, "Addition of HBr to propene in the presence of peroxide gives mainly", ["2-bromopropane", "1-bromopropane", "2,2-dibromopropane", "Propyne"], 1),
      m(4, "Benzene reacts with Cl₂ in the presence of anhydrous AlCl₃ to give", ["Hexachlorocyclohexane", "Chlorobenzene", "Benzyl chloride", "Cyclohexane"], 1),
    ],
    fib: [
      f(1, "Alkanes undergo ____ reactions with halogens in the presence of light.", ["substitution", "free radical substitution"]),
      f(1, "The number of carbon atoms in benzene is ____.", ["6", "six"]),
      f(3, "Because of its delocalised π electrons, benzene mainly undergoes ____ substitution reactions.", ["electrophilic"]),
    ],
    para: { q: "In two lines, explain why benzene is unusually stable.", k: ["resonance", "delocalised", "π electrons", "aromatic", "stability", "huckel", "hückel", "energy", "conjugated", "6 electrons"] },
    practice: [
      "Write the product when ethene reacts with Br₂ in CCl₄",
      "Convert ethyne into benzene and name the conditions used",
      "Predict the major product when propene reacts with HCl, and name the rule you used",
    ],
  },
];
