// Class 11 Physics, NCERT chapter order.
// `legacy: "<prototype id>"` reuses that chapter's content from the prototype unchanged.
// Question levels (l): 1 Foundation, 2 CBSE Board, 3 JEE Main, 4 JEE Advanced.
// mcq: {l, q, o:[4 options], a: index of the right option}
// fib: {l, q, a:[accepted answers]}  (compared case-insensitively)
// para: written question + key ideas (guidance for the AI grader and the fallback check)

const m = (l, q, o, a) => ({ l, q, o, a });
const f = (l, q, a) => ({ l, q, a });

export const chapters = [
  { id: "p1", legacy: "p1" }, // Units and Measurements
  { id: "p2", legacy: "p2" }, // Motion in a Straight Line

  {
    id: "p3", title: "Motion in a Plane",
    mcq: [
      m(1, "A quantity that has both magnitude and direction and follows the triangle law of addition is a", ["Scalar", "Vector", "Tensor", "Constant"], 1),
      m(1, "The resultant of two equal vectors of magnitude A acting at 90° to each other is", ["A", "√2 A", "2A", "A/√2"], 1),
      m(1, "At the highest point of a projectile’s path, the velocity is", ["Zero", "Vertical", "Horizontal", "Along the initial direction"], 2),
      m(2, "A projectile is fired at 30° with speed 20 m/s (g = 10 m/s²). Its time of flight is", ["1 s", "2 s", "3 s", "4 s"], 1),
      m(2, "For a given speed, the horizontal range of a projectile is maximum at an angle of", ["30°", "45°", "60°", "90°"], 1),
      m(3, "Two vectors of magnitudes 3 and 4 have a resultant of magnitude 5. The angle between them is", ["0°", "60°", "90°", "180°"], 2),
      m(3, "A body moves in a circle of radius 2 m at a constant speed of 4 m/s. Its centripetal acceleration is", ["2 m/s²", "4 m/s²", "8 m/s²", "16 m/s²"], 2),
      m(4, "The maximum height of a projectile equals its horizontal range when tan θ =", ["1", "2", "4", "1/4"], 2),
      m(4, "A projectile has range R when thrown at angle θ. With the same speed, at angle (90° − θ) its range is", ["R/2", "R", "2R", "R cos 2θ"], 1),
    ],
    fib: [
      f(1, "The vector product of two parallel vectors is ____.", ["zero", "0", "a null vector", "null vector"]),
      f(1, "In uniform circular motion, the acceleration is directed towards the ____ of the circle.", ["centre", "center"]),
      f(3, "The magnitude of A × B is maximum when the angle between A and B is ____ degrees.", ["90", "90°", "ninety"]),
    ],
    para: { q: "In two lines, explain why the horizontal component of a projectile’s velocity stays constant.", k: ["gravity", "vertical", "horizontal", "acceleration", "no force", "constant", "component"] },
    practice: [
      "A ball is thrown at 40 m/s at 30° above the horizontal: find time of flight, maximum height and range (g = 10 m/s²)",
      "Find the resultant of two forces of 6 N and 8 N acting at 90° to each other, and its direction",
      "A stone tied to a 0.5 m string is whirled at 2 revolutions per second: find its speed and centripetal acceleration",
    ],
  },

  { id: "p4", legacy: "p3" }, // Laws of Motion

  {
    id: "p5", title: "Work, Energy and Power",
    mcq: [
      m(1, "The SI unit of work is", ["Newton", "Joule", "Watt", "Pascal"], 1),
      m(1, "Work done by a force is zero when the force is", ["Parallel to the displacement", "Perpendicular to the displacement", "Opposite to the displacement", "Constant"], 1),
      m(1, "The kinetic energy of a 2 kg body moving at 3 m/s is", ["3 J", "6 J", "9 J", "18 J"], 2),
      m(2, "A force of 10 N moves a body 5 m in its own direction in 2 s. The power developed is", ["5 W", "25 W", "50 W", "100 W"], 1),
      m(2, "The work–energy theorem says that the work done by the net force equals the change in", ["Potential energy", "Momentum", "Kinetic energy", "Velocity"], 2),
      m(3, "A body of mass m is dropped from a height h. Its speed on reaching the ground is", ["√(gh)", "√(2gh)", "2gh", "gh/2"], 1),
      m(3, "The potential energy stored in a spring of constant k stretched by x is", ["kx", "½kx", "½kx²", "kx²"], 2),
      m(4, "A 2 kg block moving at 10 m/s collides head-on with a 3 kg block at rest and they stick together. The fraction of kinetic energy lost is", ["40%", "50%", "60%", "75%"], 2),
      m(4, "A block of mass m moving at speed v compresses a spring of constant k. The maximum compression is", ["v√(k/m)", "v√(m/k)", "mv²/k", "v/√(mk)"], 1),
    ],
    fib: [
      f(1, "Energy possessed by a body due to its motion is called ____ energy.", ["kinetic"]),
      f(1, "One watt is one ____ per second.", ["joule", "joules"]),
      f(3, "In an elastic collision, both momentum and ____ are conserved.", ["kinetic energy", "kinetic"]),
    ],
    para: { q: "In two lines, explain the work–energy theorem.", k: ["work", "kinetic energy", "change", "net force", "equal"] },
    practice: [
      "Find the work done in lifting a 5 kg bag through 3 m (g = 10 m/s²)",
      "A pump lifts 600 kg of water through 10 m in 1 minute: find its power (g = 10 m/s²)",
      "A 0.5 kg ball is thrown up at 20 m/s: find its kinetic and potential energy at the highest point (g = 10 m/s²)",
    ],
  },

  {
    id: "p6", title: "System of Particles and Rotational Motion",
    mcq: [
      m(1, "The centre of mass of a uniform rod of length L is at", ["One end", "L/4 from one end", "The middle", "L/3 from one end"], 2),
      m(1, "The SI unit of torque is", ["N", "N m", "N/m", "J/s"], 1),
      m(1, "In rotational motion, moment of inertia plays the role that ____ plays in linear motion", ["Force", "Velocity", "Mass", "Momentum"], 2),
      m(2, "A 10 N force acts perpendicular to a 0.5 m long spanner. The torque produced is", ["2.5 N m", "5 N m", "10 N m", "20 N m"], 1),
      m(2, "If no external torque acts on a system, which quantity is conserved?", ["Linear momentum", "Angular momentum", "Kinetic energy", "Force"], 1),
      m(3, "The moment of inertia of a solid disc of mass M and radius R about its axis is", ["MR²", "½MR²", "⅖MR²", "¼MR²"], 1),
      m(3, "A skater spinning with arms outstretched pulls her arms in. Her angular speed", ["Decreases", "Increases", "Stays the same", "Becomes zero"], 1),
      m(4, "A solid sphere and a hollow sphere of equal mass and radius roll without slipping down the same incline from rest. At the bottom", ["The hollow sphere is faster", "The solid sphere is faster", "Both are equally fast", "It depends on the mass"], 1),
      m(4, "The moment of inertia of a thin rod of mass M and length L about an axis through one end, perpendicular to the rod, is", ["ML²/12", "ML²/6", "ML²/3", "ML²/2"], 2),
    ],
    fib: [
      f(1, "Torque equals force times the ____ distance of its line of action from the axis.", ["perpendicular"]),
      f(1, "The rotational form of Newton’s second law is τ = I ____.", ["alpha", "α", "angular acceleration"]),
      f(3, "The radius of gyration k is defined by k = √(I / ____).", ["m", "mass"]),
    ],
    para: { q: "In two lines, explain why a figure skater spins faster when she pulls in her arms.", k: ["angular momentum", "conserved", "moment of inertia", "decreases", "increases", "angular speed"] },
    practice: [
      "Find the centre of mass of a 2 kg mass at x = 0 and a 3 kg mass at x = 5 m",
      "Find the moment of inertia of a ring of mass 2 kg and radius 0.5 m about its axis",
      "A wheel with I = 2 kg m² speeds up from rest to 10 rad/s in 5 s: find the torque applied",
    ],
  },

  {
    id: "p7", title: "Gravitation",
    mcq: [
      m(1, "The acceleration due to gravity on Earth’s surface is about", ["9.8 m/s²", "98 m/s²", "0.98 m/s²", "6.67 m/s²"], 0),
      m(1, "Kepler’s second law is a statement of conservation of", ["Energy", "Linear momentum", "Angular momentum", "Mass"], 2),
      m(1, "The gravitational force between two masses is always", ["Repulsive", "Attractive", "Zero in vacuum", "Dependent on charge"], 1),
      m(2, "If the distance between two masses is doubled, the gravitational force becomes", ["Half", "One-fourth", "Double", "Four times"], 1),
      m(2, "Compared with the surface, the acceleration due to gravity at a small height above Earth is", ["Less", "More", "The same", "Zero"], 0),
      m(3, "The escape speed from Earth’s surface is about", ["7.9 km/s", "11.2 km/s", "3 × 10⁵ km/s", "9.8 km/s"], 1),
      m(3, "A satellite orbits very close to Earth’s surface. Its orbital speed is about", ["7.9 km/s", "11.2 km/s", "1 km/s", "30 km/s"], 0),
      m(4, "A planet has twice Earth’s mass and twice its radius. The acceleration due to gravity on it is", ["g/4", "g/2", "g", "2g"], 1),
      m(4, "The time period T of a satellite in a circular orbit of radius r is proportional to", ["r", "r²", "r^(3/2)", "r^(1/2)"], 2),
    ],
    fib: [
      f(1, "Kepler’s third law says the square of the time period is proportional to the ____ of the semi-major axis.", ["cube"]),
      f(1, "The weight of a body at the centre of the Earth is ____.", ["zero", "0"]),
      f(3, "The orbital speed of a satellite close to Earth equals the escape speed divided by ____.", ["√2", "root 2", "sqrt 2", "sqrt(2)", "1.414"]),
    ],
    para: { q: "In two lines, explain why astronauts in an orbiting satellite feel weightless.", k: ["free fall", "gravity", "orbit", "falling", "apparent weight", "normal force", "acceleration"] },
    practice: [
      "Find the acceleration due to gravity at a height equal to the Earth’s radius, in terms of g",
      "Calculate the escape speed from a planet of mass 6 × 10²⁴ kg and radius 6.4 × 10⁶ m (G = 6.67 × 10⁻¹¹ N m² kg⁻²)",
      "Find the orbital speed of a satellite at a height equal to the Earth’s radius, in terms of g and R",
    ],
  },

  {
    id: "p8", title: "Mechanical Properties of Solids",
    mcq: [
      m(1, "Stress is defined as", ["Force per unit area", "Force × area", "Change in length", "Extension per unit length"], 0),
      m(1, "Strain has", ["Units of N/m²", "Units of N", "No units", "Units of m"], 2),
      m(1, "Hooke’s law is valid within the", ["Plastic region", "Elastic limit", "Breaking point", "Fracture point"], 1),
      m(2, "Young’s modulus is the ratio of", ["Shear stress to shear strain", "Tensile stress to tensile strain", "Volume stress to volume strain", "Force to extension"], 1),
      m(2, "The SI unit of Young’s modulus is", ["N", "N/m", "N/m²", "N m"], 2),
      m(3, "A wire of length L and cross-section A is stretched by a force F and extends by l. Young’s modulus is", ["FL/(Al)", "Fl/(AL)", "AL/(Fl)", "FA/(Ll)"], 0),
      m(3, "Two wires of the same material have lengths in the ratio 1 : 2 and radii in the ratio 2 : 1. Under the same load the ratio of their extensions is", ["1 : 2", "1 : 4", "1 : 8", "2 : 1"], 2),
      m(4, "The elastic energy stored per unit volume in a stretched wire is", ["Stress × strain", "½ × stress × strain", "Stress / strain", "2 × stress × strain"], 1),
      m(4, "Poisson’s ratio is the ratio of", ["Lateral strain to longitudinal strain", "Longitudinal strain to lateral strain", "Shear stress to tensile stress", "Volume stress to volume strain"], 0),
    ],
    fib: [
      f(1, "The property of a body to regain its original shape after the deforming force is removed is called ____.", ["elasticity"]),
      f(1, "Bulk modulus is the ratio of volume stress to ____ strain.", ["volumetric", "volume"]),
      f(3, "Within the elastic limit, stress is directly proportional to ____.", ["strain"]),
    ],
    para: { q: "In two lines, explain the difference between an elastic and a plastic body.", k: ["regain", "original", "shape", "deformation", "permanent", "force removed", "elastic", "plastic"] },
    practice: [
      "A steel wire (Y = 2 × 10¹¹ N/m²) of length 2 m and area 1 mm² carries a load of 100 N: find its extension",
      "Draw and label the stress–strain curve of a ductile material and mark the elastic limit",
      "Why are bridges built with steel rather than rubber? Explain using Young’s modulus",
    ],
  },

  {
    id: "p9", title: "Mechanical Properties of Fluids",
    mcq: [
      m(1, "The pressure at depth h in a fluid of density ρ (due to the fluid) is", ["ρgh", "ρg/h", "ρh/g", "gh/ρ"], 0),
      m(1, "The SI unit of pressure is", ["Pascal", "Newton", "Joule", "Watt"], 0),
      m(1, "The tendency of a liquid surface to contract is due to", ["Viscosity", "Surface tension", "Density", "Buoyancy"], 1),
      m(2, "A block of wood floats in water with 60% of its volume submerged. Its density is", ["400 kg/m³", "600 kg/m³", "800 kg/m³", "1000 kg/m³"], 1),
      m(2, "According to Pascal’s law, pressure applied to an enclosed fluid is", ["Transmitted undiminished everywhere", "Reduced with distance", "Felt only at the bottom", "Zero at the top"], 0),
      m(3, "Bernoulli’s theorem is based on the conservation of", ["Mass", "Momentum", "Energy", "Charge"], 2),
      m(3, "Water flows at 2 m/s through a pipe of cross-section 4 cm² into a section of 2 cm². The speed in the narrow section is", ["1 m/s", "2 m/s", "4 m/s", "8 m/s"], 2),
      m(4, "The terminal velocity of a small sphere falling through a viscous fluid is proportional to", ["r", "r²", "r³", "1/r"], 1),
      m(4, "The excess pressure inside a soap bubble of radius r and surface tension S is", ["2S/r", "4S/r", "S/r", "8S/r"], 1),
    ],
    fib: [
      f(1, "The buoyant force on a body immersed in a fluid equals the ____ of the fluid it displaces.", ["weight"]),
      f(1, "The internal friction between layers of a flowing fluid is called ____.", ["viscosity"]),
      f(3, "Water rises in a thin capillary tube because its angle of contact is ____ than 90°.", ["less", "smaller", "lesser"]),
    ],
    para: { q: "In two lines, explain why a ship made of steel floats on water.", k: ["buoyant force", "weight", "displaced", "water", "density", "average density", "hollow", "volume"] },
    practice: [
      "Find the pressure at the bottom of a lake 20 m deep (ρ = 1000 kg/m³, g = 10 m/s², atmospheric pressure 10⁵ Pa)",
      "In a hydraulic lift the small piston has area 10 cm² and the large one 1000 cm²: find the force needed to lift 5000 N",
      "Explain why a fast-moving train pulls nearby objects towards it, using Bernoulli’s principle",
    ],
  },

  {
    id: "p10", title: "Thermal Properties of Matter",
    mcq: [
      m(1, "The SI unit of temperature is the", ["Celsius", "Fahrenheit", "Kelvin", "Joule"], 2),
      m(1, "Heat flows naturally from a body at", ["Lower to higher temperature", "Higher to lower temperature", "Higher to lower mass", "Lower to higher volume"], 1),
      m(1, "0 °C is equal to about", ["273 K", "0 K", "100 K", "373 K"], 0),
      m(2, "The heat needed to raise the temperature of 2 kg of water by 5 °C (c = 4200 J/kg K) is", ["4200 J", "21000 J", "42000 J", "84000 J"], 2),
      m(2, "The three modes of heat transfer are conduction, convection and", ["Evaporation", "Radiation", "Condensation", "Reflection"], 1),
      m(3, "27 °C in kelvin is", ["246 K", "273 K", "300 K", "327 K"], 2),
      m(3, "A 1 m metal rod expands by 1 mm when heated by 50 °C. Its coefficient of linear expansion is", ["2 × 10⁻⁵ /°C", "5 × 10⁻⁵ /°C", "2 × 10⁻³ /°C", "5 × 10⁻³ /°C"], 0),
      m(4, "By Stefan’s law, the energy radiated per unit area per second by a black body is proportional to", ["T", "T²", "T³", "T⁴"], 3),
      m(4, "A black body radiates energy at rate E. If its absolute temperature is doubled, the rate becomes", ["2E", "4E", "8E", "16E"], 3),
    ],
    fib: [
      f(1, "The heat needed to change 1 kg of a solid to liquid at constant temperature is the latent heat of ____.", ["fusion"]),
      f(1, "In ____, heat is transferred by the actual movement of the heated fluid.", ["convection"]),
      f(3, "Newton’s law of cooling says the rate of cooling is proportional to the temperature ____ between the body and its surroundings.", ["difference"]),
    ],
    para: { q: "In two lines, explain why a metal spoon feels colder than a wooden one at the same temperature.", k: ["conductor", "heat", "conduct", "faster", "hand", "thermal conductivity", "wood", "insulator"] },
    practice: [
      "How much heat is needed to convert 100 g of ice at 0 °C into water at 0 °C (L = 336 J/g)?",
      "A steel rail 10 m long at 20 °C is heated to 40 °C (α = 1.2 × 10⁻⁵ /°C): find its expansion",
      "Explain why water is a poor conductor of heat but a pot of water heats quickly on a stove",
    ],
  },

  {
    id: "p11", title: "Thermodynamics",
    mcq: [
      m(1, "The first law of thermodynamics is a statement of conservation of", ["Mass", "Momentum", "Energy", "Charge"], 2),
      m(1, "In an isothermal process, the temperature of the system", ["Increases", "Decreases", "Stays constant", "Becomes zero"], 2),
      m(1, "The zeroth law of thermodynamics is related to", ["Thermal equilibrium", "Energy conservation", "Entropy", "Absolute zero"], 0),
      m(2, "A gas absorbs 500 J of heat and does 200 J of work. The change in its internal energy is", ["100 J", "300 J", "500 J", "700 J"], 1),
      m(2, "In an adiabatic process", ["Temperature is constant", "No heat is exchanged", "Pressure is constant", "Volume is constant"], 1),
      m(3, "For an ideal gas, Cp − Cv equals", ["R", "2R", "R/2", "Zero"], 0),
      m(3, "The work done by a gas expanding at constant pressure P from V₁ to V₂ is", ["P(V₂ − V₁)", "PV₁", "PV₂", "Zero"], 0),
      m(4, "The efficiency of a Carnot engine working between 500 K and 300 K is", ["20%", "40%", "60%", "80%"], 1),
      m(4, "One mole of an ideal gas expands isothermally at temperature T from volume V to 2V. The work done by the gas is", ["RT", "RT ln 2", "2RT", "RT/2"], 1),
    ],
    fib: [
      f(1, "The second law of thermodynamics introduces the concept of ____.", ["entropy"]),
      f(1, "A process in which no heat enters or leaves the system is called ____.", ["adiabatic"]),
      f(3, "The ratio Cp/Cv is called the adiabatic index and is denoted by ____.", ["gamma", "γ"]),
    ],
    para: { q: "In two lines, explain the first law of thermodynamics.", k: ["energy", "heat", "work", "internal energy", "conservation", "change", "conserved"] },
    practice: [
      "A gas is compressed by 300 J of work and loses 100 J of heat: find the change in internal energy",
      "Find the efficiency of an engine that takes 800 J from the source and rejects 600 J to the sink",
      "Draw the P–V diagram for an isothermal and an adiabatic expansion of an ideal gas and compare them",
    ],
  },

  {
    id: "p12", title: "Kinetic Theory",
    mcq: [
      m(1, "Avogadro’s number is the number of molecules in", ["1 gram of a gas", "1 mole of a gas", "1 litre of a gas", "1 kg of a gas"], 1),
      m(1, "The ideal gas equation is", ["PV = nRT", "P = nRTV", "PT = nRV", "V = nRTP"], 0),
      m(1, "At constant temperature the pressure of a gas is inversely proportional to its volume. This is", ["Charles’ law", "Boyle’s law", "Gay-Lussac’s law", "Avogadro’s law"], 1),
      m(2, "When a gas is heated at constant volume, its pressure", ["Decreases", "Increases", "Stays constant", "Becomes zero"], 1),
      m(2, "The average kinetic energy of a gas molecule depends on", ["Pressure only", "Volume only", "Absolute temperature", "The mass of the molecule only"], 2),
      m(3, "The average translational kinetic energy per molecule of an ideal gas is", ["½kT", "kT", "3/2 kT", "3kT"], 2),
      m(3, "If the absolute temperature of a gas is raised from T to 4T, the rms speed of its molecules", ["Stays the same", "Doubles", "Becomes four times", "Halves"], 1),
      m(4, "A diatomic gas molecule at ordinary temperature has how many degrees of freedom (translational + rotational)?", ["3", "5", "6", "7"], 1),
      m(4, "By the law of equipartition of energy, each degree of freedom carries an average energy of", ["kT", "½kT", "3/2 kT", "2kT"], 1),
    ],
    fib: [
      f(1, "The constant k in the expression 3/2 kT is called the ____ constant.", ["boltzmann"]),
      f(1, "The pressure of a gas is caused by collisions of its molecules with the ____ of the container.", ["walls", "wall"]),
      f(3, "The mean free path of a gas molecule is the average distance between two successive ____.", ["collisions", "collision"]),
    ],
    para: { q: "In two lines, explain how kinetic theory accounts for the pressure of a gas.", k: ["molecules", "collide", "walls", "momentum", "force", "area", "random", "collisions"] },
    practice: [
      "Find the ratio of the rms speeds of hydrogen and oxygen molecules at the same temperature",
      "Find the volume of 1 mole of an ideal gas at 0 °C and 1 atm (R = 8.314 J/mol K, 1 atm = 1.013 × 10⁵ Pa)",
      "Find the total translational kinetic energy of 2 moles of an ideal gas at 300 K (R = 8.314 J/mol K)",
    ],
  },

  {
    id: "p13", title: "Oscillations",
    mcq: [
      m(1, "The time taken for one complete oscillation is called the", ["Frequency", "Amplitude", "Time period", "Phase"], 2),
      m(1, "The SI unit of frequency is", ["Second", "Hertz", "Metre", "Radian"], 1),
      m(1, "In simple harmonic motion the restoring force is proportional to", ["Velocity", "Displacement", "Time", "Amplitude squared"], 1),
      m(2, "A simple pendulum of length 1 m is used where g = π² m/s². Its time period is", ["1 s", "2 s", "π s", "2π s"], 1),
      m(2, "In SHM the speed is maximum at the", ["Extreme position", "Mean position", "Halfway point", "Never"], 1),
      m(3, "The time period of a spring–mass system with mass m and spring constant k is", ["2π√(k/m)", "2π√(m/k)", "2π√(mk)", "(1/2π)√(m/k)"], 1),
      m(3, "A particle in SHM has amplitude 4 cm and time period 2 s. Its maximum speed is", ["2π cm/s", "4π cm/s", "8π cm/s", "π cm/s"], 1),
      m(4, "The total energy of a particle in SHM with amplitude A and spring constant k is", ["½kA", "kA²", "½kA²", "¼kA²"], 2),
      m(4, "Two identical springs of constant k are joined end to end (in series). The effective spring constant is", ["2k", "k", "k/2", "k/4"], 2),
    ],
    fib: [
      f(1, "The maximum displacement from the mean position is called the ____.", ["amplitude"]),
      f(1, "The angular frequency is related to the time period T by ω = 2π / ____.", ["t", "time period", "period"]),
      f(3, "In SHM the acceleration is zero at the ____ position.", ["mean", "equilibrium", "central"]),
    ],
    para: { q: "In two lines, explain why the time period of a simple pendulum does not depend on the mass of the bob.", k: ["mass", "gravity", "length", "independent", "acceleration", "restoring force", "proportional"] },
    practice: [
      "Find the time period of a simple pendulum of length 0.4 m (g = 10 m/s²)",
      "A 0.5 kg mass hangs on a spring of constant 200 N/m: find its frequency of oscillation",
      "Write the equation of SHM with amplitude 5 cm and time period 2 s, starting from the mean position",
    ],
  },

  {
    id: "p14", title: "Waves",
    mcq: [
      m(1, "Sound waves in air are", ["Transverse", "Longitudinal", "Electromagnetic", "Stationary only"], 1),
      m(1, "The speed of a wave of frequency f and wavelength λ is", ["v = fλ", "v = f/λ", "v = λ/f²", "v = f + λ"], 0),
      m(1, "Waves on a stretched string are", ["Longitudinal", "Transverse", "Neither", "Both"], 1),
      m(2, "A wave has frequency 50 Hz and wavelength 4 m. Its speed is", ["12.5 m/s", "54 m/s", "200 m/s", "400 m/s"], 2),
      m(2, "Beats are produced by the interference of two waves of", ["Equal frequencies", "Slightly different frequencies", "Very different amplitudes only", "Different speeds only"], 1),
      m(3, "Two tuning forks of 256 Hz and 260 Hz are sounded together. The beat frequency is", ["2 Hz", "4 Hz", "258 Hz", "516 Hz"], 1),
      m(3, "The fundamental frequency of a closed organ pipe of length L (speed of sound v) is", ["v/2L", "v/4L", "2v/L", "v/L"], 1),
      m(4, "The speed of a transverse wave on a string of tension T and mass per unit length μ is", ["√(μ/T)", "√(T/μ)", "T/μ", "μT"], 1),
      m(4, "When a source of sound approaches a stationary listener, the frequency heard is", ["Lower than the true frequency", "Higher than the true frequency", "The same", "Zero"], 1),
    ],
    fib: [
      f(1, "The distance between two consecutive crests of a wave is its ____.", ["wavelength"]),
      f(1, "The change in apparent frequency due to relative motion of source and listener is the ____ effect.", ["doppler"]),
      f(3, "The points of zero displacement in a stationary wave are called ____.", ["nodes", "node"]),
    ],
    para: { q: "In two lines, explain how standing waves are formed on a string fixed at both ends.", k: ["interference", "reflect", "two waves", "opposite", "nodes", "antinodes", "superposition", "fixed"] },
    practice: [
      "A string of mass 0.01 kg and length 1 m is under a tension of 100 N: find the speed of a wave on it",
      "An open organ pipe is 0.5 m long (speed of sound 340 m/s): find its fundamental frequency",
      "A siren of 600 Hz moves towards a stationary listener at 30 m/s (speed of sound 330 m/s): find the frequency heard",
    ],
  },
];
