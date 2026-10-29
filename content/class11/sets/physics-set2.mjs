// Class 11 Physics, Set 2 (Medium): JEE Main style, one or two steps. g = 10 m/s² unless stated. Numbers are computed.
import { M, F, P } from "../helpers.mjs";

export const subjectId = "phy";
export const setNo = 2;

const s = String;
const g = 10;

export const chapters = [
  {
    id: "p1",
    mcq: [
      M("dimensions", 2, "The dimensional formula of power is", "[ML²T⁻³]", ["[ML²T⁻²]", "[MLT⁻³]", "[ML³T⁻³]"]),
      M("dimensions", 2, "The dimensional formula of angular momentum is", "[ML²T⁻¹]", ["[MLT⁻¹]", "[ML²T⁻²]", "[ML²T⁰]"]),
      M("dimensions", 2, "The dimensions of surface tension are", "[MT⁻²]", ["[MLT⁻²]", "[ML⁻¹T⁻²]", "[MT⁻¹]"]),
      M("errors", 2, "A rectangle has sides 10.0 ± 0.1 cm and 5.0 ± 0.1 cm. The percentage error in its area is", "3%", ["1%", "2%", "1.5%"]),
      M("significant-figures", 2, "The number of significant figures in 6.032 × 10³ is", s(4), ["3", "5", "6"]),
      M("units", 2, "A light year is a unit of", "Distance", ["Time", "Speed", "Mass"]),
    ],
    fib: [
      F("dimensions", 2, "The dimensions of acceleration are [LT^____].", ["-2", "−2"]),
      F("significant-figures", 2, "The number of significant figures in 0.00450 is ____.", ["3"]),
      F("instruments", 3, "A screw gauge reads 2.50 mm with a zero error of +0.02 mm. The corrected reading is ____ mm.", ["2.48"]),
      F("errors", 3, "The radius of a sphere is measured with a 1% error. The percentage error in its volume is ____ %.", ["3"]),
    ],
    para: [
      P("zero-error", "In two lines, explain what a zero error is and how a reading is corrected for it.", ["zero error", "subtract", "correction", "positive", "negative", "instrument", "reading", "zero mark"]),
      P("dimensions", "In two lines, explain why an equation that is dimensionally correct need not be physically correct.", ["constants", "dimensionless", "numerical factor", "dimensions", "necessary", "not sufficient", "homogeneity", "check"]),
    ],
  },
  {
    id: "p2",
    mcq: [
      M("kinematics", 2, "A car starts from rest and accelerates at 2 m/s² for 5 s. The distance covered is", `${0.5 * 2 * 25} m`, ["10 m", "50 m", "12.5 m"]),
      M("projectile-vertical", 2, "A ball is thrown vertically up at 30 m/s (g = 10 m/s²). The maximum height reached is", `${(30 * 30) / (2 * g)} m`, ["90 m", "15 m", "30 m"]),
      M("average-speed", 3, "A body travels 60 km at 30 km/h and returns the same 60 km at 60 km/h. The average speed for the whole trip is", `${120 / (2 + 1)} km/h`, ["45 km/h", "50 km/h", "30 km/h"]),
      M("free-fall", 2, "A stone is dropped from a height of 80 m (g = 10 m/s²). It reaches the ground after", `${Math.sqrt((2 * 80) / g)} s`, ["8 s", "2 s", "16 s"]),
      M("graphs", 2, "The slope of a velocity–time graph gives the body’s", "Acceleration", ["Displacement", "Speed", "Jerk"]),
      M("graphs", 2, "The area under a velocity–time graph gives the body’s", "Displacement", ["Acceleration", "Force", "Momentum"]),
    ],
    fib: [
      F("equations", 2, "A body starts from rest with acceleration 5 m/s². After covering 40 m its speed is ____ m/s.", [s(Math.sqrt(2 * 5 * 40))]),
      F("free-fall", 2, "A stone dropped from 45 m (g = 10 m/s²) takes ____ s to reach the ground.", [s(Math.sqrt((2 * 45) / g))]),
      F("relative-motion", 3, "A 100 m long train moving at 20 m/s takes ____ s to cross a pole.", [s(100 / 20)]),
      F("kinematics", 3, "A body moving at 10 m/s stops uniformly in 5 s. Its retardation is ____ m/s².", [s(10 / 5)]),
    ],
    para: [
      P("speed-velocity", "In two lines, explain how velocity differs from speed, using the word direction.", ["scalar", "vector", "direction", "magnitude", "displacement", "distance", "speed", "velocity"]),
      P("equations", "In two lines, state when the three equations of motion can be used.", ["constant acceleration", "uniform", "straight line", "v = u + at", "s = ut", "v² = u²", "equations"]),
    ],
  },
  {
    id: "p3",
    mcq: [
      M("projectile", 3, "A ball is projected at 45° with 20 m/s (g = 10 m/s²). Its horizontal range is", `${(20 * 20 * Math.sin(Math.PI / 2)) / g} m`, ["20 m", "80 m", "28.3 m"]),
      M("projectile", 3, "For the same projectile, the maximum height is", `${(20 * 20 * 0.5) / (2 * g)} m`, ["20 m", "5 m", "40 m"]),
      M("vectors", 2, "The resultant of two perpendicular forces 3 N and 4 N is", "5 N", ["7 N", "1 N", "12 N"]),
      M("circular", 2, "A particle moves at 10 m/s on a circle of radius 5 m. Its centripetal acceleration is", `${(10 * 10) / 5} m/s²`, ["2 m/s²", "50 m/s²", "10 m/s²"]),
      M("projectile", 3, "A ball is thrown horizontally at 10 m/s from a 45 m high tower (g = 10 m/s²). The horizontal distance covered before landing is", `${10 * Math.sqrt((2 * 45) / g)} m`, ["45 m", "10 m", "90 m"]),
      M("relative-motion", 3, "A man walks east at 3 m/s and rain falls vertically at 4 m/s. To the man, the rain’s speed is", "5 m/s", ["7 m/s", "1 m/s", "12 m/s"]),
    ],
    fib: [
      F("projectile", 2, "For a given speed of projection on level ground, the range is maximum when the angle is ____ degrees.", ["45"]),
      F("circular", 3, "A particle moves on a circle of radius 2 m at 4 m/s. Its angular velocity is ____ rad/s.", [s(4 / 2)]),
      F("projectile", 3, "A projectile’s horizontal velocity during flight (ignoring air) is ____. (constant or changing)", ["constant", "unchanged", "same"]),
      F("vectors", 3, "Two forces of 6 N and 8 N act at right angles. Their resultant is ____ N.", ["10"]),
    ],
    para: [
      P("projectile", "In two lines, explain why the horizontal and vertical motions of a projectile can be treated independently.", ["independent", "horizontal", "vertical", "gravity", "acceleration", "no force", "components", "constant"]),
      P("circular", "In two lines, explain why a body moving in a circle at constant speed is still accelerating.", ["direction", "velocity", "changes", "centripetal", "towards centre", "vector", "acceleration"]),
    ],
  },
  {
    id: "p4",
    mcq: [
      M("newton-second", 2, "A force of 20 N acts on a 5 kg body. Its acceleration is", `${20 / 5} m/s²`, ["100 m/s²", "15 m/s²", "0.25 m/s²"]),
      M("friction", 2, "A 10 kg block rests on a surface with μ = 0.4 (g = 10 m/s²). The maximum static friction is", `${0.4 * 10 * g} N`, ["4 N", "100 N", "25 N"]),
      M("lift", 3, "A 60 kg man stands in a lift accelerating upward at 2 m/s² (g = 10 m/s²). The reading of the scale is", `${60 * (g + 2)} N`, ["480 N", "600 N", "120 N"]),
      M("impulse", 2, "A force of 20 N acts for 0.5 s. The impulse is", `${20 * 0.5} N s`, ["40 N s", "20 N s", "0.025 N s"]),
      M("connected", 3, "A 10 N force pulls a 3 kg block that is joined by a string to a 2 kg block on a smooth floor. The tension in the string is", `${(10 / 5) * 2} N`, ["10 N", "6 N", "2 N"]),
      M("inertia", 2, "A passenger in a bus falls forward when the bus brakes suddenly because of", "Inertia", ["Friction", "Gravity", "Centripetal force"]),
    ],
    fib: [
      F("momentum", 2, "The momentum of a 2 kg body moving at 5 m/s is ____ kg m/s.", [s(2 * 5)]),
      F("newton-second", 2, "A 4 kg body accelerates at 3 m/s². The net force on it is ____ N.", [s(4 * 3)]),
      F("friction", 3, "The coefficient of friction between a block and a surface is 0.5. The angle of repose is tan⁻¹(____).", ["0.5", ".5", "1/2"]),
      F("weight", 2, "The weight of a 5 kg mass on Earth (g = 10 m/s²) is ____ N.", [s(5 * g)]),
    ],
    para: [
      P("third-law", "In two lines, state Newton’s third law and explain why action and reaction do not cancel each other.", ["equal", "opposite", "different bodies", "act on", "pair", "cancel", "reaction", "action"]),
      P("friction", "In two lines, explain the difference between static and kinetic friction.", ["static", "kinetic", "limiting", "greater", "motion", "sliding", "opposes", "less"]),
    ],
  },
  {
    id: "p5",
    mcq: [
      M("work", 2, "A 10 N force moves a body 5 m at 60° to the force. The work done is", "25 J", ["50 J", "43.3 J", "12.5 J"]),
      M("kinetic-energy", 2, "The kinetic energy of a 2 kg body moving at 10 m/s is", `${0.5 * 2 * 100} J`, ["20 J", "200 J", "10 J"]),
      M("power", 2, "A motor lifts a 50 kg load through 10 m in 10 s (g = 10 m/s²). The power developed is", `${(50 * g * 10) / 10} W`, ["50 W", "5000 W", "10 W"]),
      M("spring", 3, "A spring with k = 200 N/m is compressed by 0.1 m. The stored energy is", `${0.5 * 200 * 0.01} J`, ["20 J", "2 J", "0.1 J"]),
      M("conservation", 3, "A body falls from rest from 20 m (g = 10 m/s²). Its speed just before hitting the ground is", `${Math.sqrt(2 * g * 20)} m/s`, ["10 m/s", "40 m/s", "200 m/s"]),
      M("work-energy", 2, "The work done by the net force on a body equals the change in its", "Kinetic energy", ["Potential energy", "Momentum", "Mass"]),
    ],
    fib: [
      F("power", 2, "Power = force × ____. (give the quantity)", ["velocity", "speed"]),
      F("kinetic-energy", 3, "If the speed of a body is doubled, its kinetic energy becomes ____ times.", ["4", "four"]),
      F("potential-energy", 2, "The gain in potential energy of a 2 kg mass raised by 5 m (g = 10 m/s²) is ____ J.", [s(2 * g * 5)]),
      F("work", 3, "The work done by a force perpendicular to the displacement is ____.", ["0", "zero"]),
    ],
    para: [
      P("conservation", "In two lines, state the law of conservation of mechanical energy and when it holds.", ["conservative", "kinetic", "potential", "total", "constant", "no friction", "mechanical energy", "conserved"]),
      P("collisions", "In two lines, state the difference between elastic and inelastic collisions.", ["kinetic energy", "conserved", "momentum", "elastic", "inelastic", "lost", "perfectly", "stick"]),
    ],
  },
  {
    id: "p6",
    mcq: [
      M("moment-of-inertia", 2, "The moment of inertia of a thin ring of mass M and radius R about its axis is", "MR²", ["MR²/2", "2MR²/5", "MR²/4"]),
      M("torque", 2, "A body of moment of inertia 2 kg m² has angular acceleration 3 rad/s². The torque is", `${2 * 3} N m`, ["1.5 N m", "5 N m", "0.67 N m"]),
      M("centre-of-mass", 3, "Masses 2 kg at x = 0 and 3 kg at x = 10 m. The centre of mass is at", `${(3 * 10) / 5} m`, ["5 m", "4 m", "7.5 m"]),
      M("angular-momentum", 3, "An ice skater pulls her arms in while spinning. Her angular speed", "Increases", ["Decreases", "Stays the same", "Becomes zero"]),
      M("moment-of-inertia", 3, "The moment of inertia of a uniform solid sphere about a diameter is", "2MR²/5", ["MR²/2", "MR²", "2MR²/3"]),
      M("parallel-axis", 3, "A thin rod of mass M and length L has I = ML²/12 about its centre. About one end I is", "ML²/3", ["ML²/6", "ML²/2", "7ML²/12"]),
    ],
    fib: [
      F("torque", 2, "A force of 10 N acts at 0.5 m from the axis perpendicular to the lever arm. The torque is ____ N m.", [s(10 * 0.5)]),
      F("angular-momentum", 3, "A body of moment of inertia 4 kg m² rotates at 5 rad/s. Its angular momentum is ____ kg m²/s.", [s(4 * 5)]),
      F("rotational-ke", 3, "The rotational kinetic energy of that body is ____ J.", [s(0.5 * 4 * 25)]),
      F("equilibrium", 2, "For rotational equilibrium, the net ____ on a body must be zero.", ["torque", "moment"]),
    ],
    para: [
      P("angular-momentum", "In two lines, state the law of conservation of angular momentum and give one example.", ["external torque", "zero", "conserved", "skater", "angular momentum", "I ω", "constant"]),
      P("rolling", "In two lines, explain why a hollow cylinder takes longer than a solid cylinder to roll down an incline.", ["moment of inertia", "larger", "rotational", "translational", "energy", "slower", "acceleration", "share"]),
    ],
  },
  {
    id: "p7",
    mcq: [
      M("g-variation", 2, "At a height equal to the Earth’s radius above the surface, the acceleration due to gravity is", "g/4", ["g/2", "g", "g/9"]),
      M("g-variation", 3, "At a depth d below the surface (d ≪ R), the acceleration due to gravity is", "g(1 − d/R)", ["g(1 − 2d/R)", "g(1 + d/R)", "g(R/d)"]),
      M("kepler", 3, "A planet orbits at 4 times the distance of Earth from the Sun. Its period in years is", s(Math.sqrt(4 ** 3)), ["16", "4", "64"]),
      M("escape-velocity", 2, "The escape velocity from the Earth’s surface is about", "11.2 km/s", ["7.9 km/s", "3 × 10⁵ km/s", "1 km/s"]),
      M("weight", 2, "The acceleration due to gravity on the Moon is about", "g/6", ["g/2", "g/10", "g"]),
      M("potential", 3, "The gravitational potential energy of a mass m at a distance r from the centre of a planet of mass M is", "−GMm/r", ["GMm/r", "−GMm/r²", "GMm/r²"]),
    ],
    fib: [
      F("inverse-square", 2, "If the distance between two masses is doubled, the gravitational force becomes ____ of its value. (fraction)", ["1/4", "one fourth", "one quarter", "0.25"]),
      F("orbital", 3, "The ratio of escape velocity to orbital velocity near the Earth’s surface is √____.", ["2"]),
      F("g-variation", 3, "At the centre of the Earth the value of g is ____.", ["0", "zero"]),
      F("kepler", 2, "Kepler’s second law is a consequence of conservation of ____ momentum.", ["angular"]),
    ],
    para: [
      P("free-fall", "In two lines, explain why a body inside a freely falling lift appears weightless.", ["free fall", "both fall", "no normal reaction", "orbit", "gravity", "acceleration", "apparent weight"]),
      P("kepler", "In two lines, state Kepler’s law of periods.", ["T²", "r³", "cube", "semi-major axis", "square of the period", "proportional", "third law"]),
    ],
  },
  {
    id: "p8",
    mcq: [
      M("youngs-modulus", 3, "A wire of length 2 m and area 1 mm² (Y = 2 × 10¹¹ Pa) carries a load of 200 N. The extension is", `${(200 * 2) / (1e-6 * 2e11) * 1000} mm`, ["0.2 mm", "20 mm", "0.02 mm"]),
      M("stress-strain", 2, "Which of these has the same unit as stress?", "Pressure", ["Force", "Energy", "Momentum"]),
      M("strain", 2, "Longitudinal strain is the ratio of", "Change in length to original length", ["Original length to change in length", "Force to area", "Change in area to force"]),
      M("poisson", 3, "Poisson’s ratio for a material is the ratio of", "Lateral strain to longitudinal strain", ["Stress to strain", "Longitudinal to lateral strain", "Shear to bulk modulus"]),
      M("energy", 3, "The elastic energy stored per unit volume of a stretched wire is", "½ × stress × strain", ["stress × strain", "½ × stress / strain", "stress / strain"]),
      M("bulk-modulus", 2, "The modulus that measures resistance to change in volume is", "Bulk modulus", ["Young’s modulus", "Shear modulus", "Poisson’s ratio"]),
    ],
    fib: [
      F("hooke", 2, "Within the elastic limit, stress is directly proportional to ____. (Hooke’s law)", ["strain"]),
      F("youngs-modulus", 3, "If a wire’s length is doubled (same material), its Young’s modulus becomes ____ times.", ["1", "one"]),
      F("stress", 2, "A force of 100 N acts on an area of 0.01 m². The stress is ____ Pa.", [s(100 / 0.01)]),
      F("elasticity", 3, "A material that returns to its original shape after the load is removed is called ____.", ["elastic"]),
    ],
    para: [
      P("stress-strain", "In two lines, describe the main regions of a stress–strain curve.", ["elastic limit", "proportional", "yield", "plastic", "fracture", "breaking", "hooke", "permanent"]),
      P("modulus", "In two lines, state the three kinds of elastic moduli.", ["young", "bulk", "shear", "rigidity", "modulus", "stress", "strain", "volume"]),
    ],
  },
  {
    id: "p9",
    mcq: [
      M("pressure", 2, "The pressure due to water at a depth of 10 m (ρ = 1000 kg/m³, g = 10 m/s²) is", `${1000 * g * 10} Pa`, ["10⁴ Pa", "10⁶ Pa", "10³ Pa"]),
      M("continuity", 3, "Water flows through a pipe whose diameter is halved at a constriction. The speed there becomes", "4 times", ["2 times", "1/2 times", "1/4 times"]),
      M("pascal", 3, "In a hydraulic lift, the area ratio of the output to input piston is 50. A force of 100 N on the input piston balances a load of", `${100 * 50} N`, ["2 N", "150 N", "100 N"]),
      M("buoyancy", 2, "A body floats in a liquid. The buoyant force equals", "The weight of the body", ["Zero", "Twice the weight", "The weight of the liquid in the container"]),
      M("viscosity", 3, "The terminal velocity of a small sphere falling in a viscous fluid is proportional to", "r²", ["r", "r³", "1/r"]),
      M("capillary", 3, "The rise of liquid in a capillary tube of radius r is proportional to", "1/r", ["r", "r²", "1/r²"]),
    ],
    fib: [
      F("pascal", 2, "The SI unit of pressure is the ____.", ["pascal", "Pa"]),
      F("bernoulli", 3, "Where the speed of a fluid is higher, the pressure is ____. (higher or lower)", ["lower", "less"]),
      F("buoyancy", 2, "An object weighs 10 N in air and 6 N when fully immersed in water. The buoyant force is ____ N.", [s(10 - 6)]),
      F("surface-tension", 3, "Surface tension has dimensions [M^1 L^0 T^____].", ["-2", "−2"]),
    ],
    para: [
      P("bernoulli", "In two lines, state Bernoulli’s theorem and the conditions for its use.", ["steady", "incompressible", "non-viscous", "streamline", "pressure", "energy", "constant", "height"]),
      P("surface-tension", "In two lines, explain why small drops of water are spherical.", ["surface tension", "minimum surface area", "sphere", "energy", "minimise", "area", "cohesion"]),
    ],
  },
  {
    id: "p10",
    mcq: [
      M("heat", 2, "The heat needed to raise 2 kg of water from 20 °C to 70 °C (c = 4200 J/kg K) is", `${2 * 4200 * 50} J`, ["42000 J", "210000 J", "8400 J"]),
      M("stefan", 3, "If the absolute temperature of a black body is doubled, the power it radiates becomes", "16 times", ["2 times", "4 times", "8 times"]),
      M("expansion", 3, "A rod of length 1 m (α = 1.2 × 10⁻⁵ per °C) is heated by 100 °C. The increase in length is", "1.2 mm", ["12 mm", "0.12 mm", "1.2 cm"]),
      M("scales", 2, "A temperature of 27 °C on the Kelvin scale is", "300 K", ["273 K", "246 K", "327 K"]),
      M("calorimetry", 3, "Heat required to melt 100 g of ice at 0 °C (L = 336 J/g) is", `${100 * 336} J`, ["3360 J", "336 J", "100 J"]),
      M("conduction", 2, "Heat transfer in a vacuum takes place only by", "Radiation", ["Conduction", "Convection", "Evaporation"]),
    ],
    fib: [
      F("scales", 2, "Normal body temperature, 98.6 °F, is ____ °C.", ["37"]),
      F("expansion", 3, "The coefficient of areal expansion is ____ times the coefficient of linear expansion.", ["2", "two"]),
      F("calorimetry", 3, "Equal masses of water at 20 °C and 60 °C are mixed. The final temperature is ____ °C.", ["40"]),
      F("radiation", 3, "According to Wien’s law, the wavelength of maximum emission is inversely proportional to ____.", ["temperature", "absolute temperature", "T"]),
    ],
    para: [
      P("newton-cooling", "In two lines, state Newton’s law of cooling.", ["rate of cooling", "difference", "surroundings", "temperature", "proportional", "small", "excess"]),
      P("specific-heat", "In two lines, explain why water has a high specific heat capacity and one effect of it.", ["high", "specific heat", "coast", "moderate", "climate", "slowly", "heat", "temperature"]),
    ],
  },
  {
    id: "p11",
    mcq: [
      M("first-law", 2, "A gas absorbs 800 J of heat and does 300 J of work. The change in its internal energy is", `${800 - 300} J`, ["1100 J", "300 J", "800 J"]),
      M("isothermal", 2, "For an isothermal process of an ideal gas, the change in internal energy is", "Zero", ["Equal to heat absorbed", "Equal to work done", "Negative"]),
      M("carnot", 3, "A Carnot engine works between 600 K and 300 K. Its efficiency is", "50%", ["25%", "75%", "100%"]),
      M("isobaric", 3, "A gas expands at a constant pressure of 10⁵ Pa from 1 L to 3 L. The work done by the gas is", `${1e5 * 2e-3} J`, ["200 kJ", "100 J", "300 J"]),
      M("adiabatic", 2, "A process in which no heat enters or leaves the system is called", "Adiabatic", ["Isothermal", "Isochoric", "Isobaric"]),
      M("specific-heats", 3, "The molar specific heat at constant pressure is greater than that at constant volume because", "Extra heat is needed for the work done in expansion", ["The gas becomes heavier", "The pressure becomes zero", "The volume decreases"]),
    ],
    fib: [
      F("first-law", 2, "In an isochoric process, the work done by the gas is ____.", ["0", "zero"]),
      F("carnot", 3, "A heat engine absorbs 800 J and rejects 600 J. Its efficiency is ____ %.", [s(((800 - 600) / 800) * 100), "25"]),
      F("cycle", 3, "In a complete cycle, the change in internal energy of the gas is ____.", ["0", "zero"]),
      F("second-law", 2, "The second law of thermodynamics says that heat cannot flow from a ____ body to a hotter body on its own. (hotter or colder)", ["colder", "cold"]),
    ],
    para: [
      P("first-law", "In two lines, state the first law of thermodynamics and what each term means.", ["ΔU", "Q", "W", "heat", "work", "internal energy", "conservation", "energy"]),
      P("reversible", "In two lines, explain what a reversible process is.", ["quasi-static", "equilibrium", "retraced", "reversed", "no friction", "slowly", "surroundings", "ideal"]),
    ],
  },
  {
    id: "p12",
    mcq: [
      M("rms", 2, "If the absolute temperature of a gas is made 4 times, the rms speed of its molecules becomes", "2 times", ["4 times", "16 times", "1/2 times"]),
      M("kinetic-energy", 2, "The average translational kinetic energy per molecule of an ideal gas at temperature T is", "(3/2) kT", ["(1/2) kT", "kT", "3RT"]),
      M("dof", 2, "The number of degrees of freedom of a monatomic gas molecule is", s(3), ["5", "6", "2"]),
      M("gamma", 3, "The ratio Cp/Cv for a monatomic ideal gas is", "5/3", ["7/5", "4/3", "3/2"]),
      M("ideal-gas", 3, "The pressure of 2 mol of an ideal gas in 0.0249 m³ at 300 K (R = 8.3 J/mol K) is about", `${((2 * 8.3 * 300) / 0.0249 / 1000).toFixed(0)} × 10³ Pa`, ["100 × 10³ Pa", "400 × 10³ Pa", "50 × 10³ Pa"]),
      M("mean-free-path", 3, "The mean free path of gas molecules is", "Inversely proportional to the number density", ["Proportional to the number density", "Independent of the density", "Proportional to T²"]),
    ],
    fib: [
      F("equipartition", 3, "By the law of equipartition, each degree of freedom has an energy of ____ kT per molecule. (fraction)", ["1/2", "0.5", ".5", "half"]),
      F("avogadro", 2, "The number of molecules in one mole is about 6.02 × 10^____.", ["23"]),
      F("gas-laws", 2, "At constant temperature, the pressure of a gas is inversely proportional to its ____. (Boyle’s law)", ["volume"]),
      F("rms", 3, "The rms speed of gas molecules is proportional to the square root of ____.", ["temperature", "absolute temperature", "T"]),
    ],
    para: [
      P("pressure", "In two lines, explain how the kinetic theory explains the pressure of a gas.", ["collisions", "walls", "momentum", "molecules", "force", "area", "average", "rate"]),
      P("assumptions", "In two lines, state two assumptions of the kinetic theory of an ideal gas.", ["negligible volume", "no forces", "elastic", "random", "collisions", "point", "intermolecular", "large number"]),
    ],
  },
  {
    id: "p13",
    mcq: [
      M("period", 2, "A 0.5 kg mass on a spring with k = 50 N/m has a time period of about", `${(2 * Math.PI * Math.sqrt(0.5 / 50)).toFixed(2)} s`, ["1.26 s", "0.31 s", "3.14 s"]),
      M("pendulum", 3, "A simple pendulum 1 m long at a place where g = π² m/s² has a time period of", "2 s", ["1 s", "π s", "4 s"]),
      M("velocity", 3, "A particle in SHM has amplitude 0.1 m and angular frequency 10 rad/s. Its maximum speed is", `${0.1 * 10} m/s`, ["100 m/s", "0.01 m/s", "10 m/s"]),
      M("energy", 3, "The total energy of a SHM of amplitude A and spring constant k is", "½ k A²", ["k A²", "½ k A", "k A"]),
      M("springs", 3, "Two identical springs of constant k are joined in parallel. The effective constant is", "2k", ["k/2", "k", "4k"]),
      M("phase", 2, "In SHM the velocity is maximum when the displacement is", "Zero", ["Maximum", "Half the amplitude", "Equal to the amplitude"]),
    ],
    fib: [
      F("period", 2, "If the length of a simple pendulum is made 4 times, its time period becomes ____ times.", ["2", "two"]),
      F("shm", 3, "The acceleration of a particle in SHM is maximum at the ____ positions.", ["extreme", "end", "amplitude"]),
      F("frequency", 2, "A body completes 20 oscillations in 10 s. Its frequency is ____ Hz.", [s(20 / 10)]),
      F("energy", 3, "At a displacement equal to half the amplitude, the kinetic energy is ____ of the total energy. (fraction)", ["3/4", "0.75", ".75"]),
    ],
    para: [
      P("shm", "In two lines, state the condition for a motion to be simple harmonic.", ["restoring force", "proportional", "displacement", "opposite", "F = −kx", "acceleration", "towards mean"]),
      P("resonance", "In two lines, explain what resonance is.", ["natural frequency", "driving", "amplitude", "maximum", "equal", "forced", "oscillation"]),
    ],
  },
  {
    id: "p14",
    mcq: [
      M("wave-speed", 2, "A wave of frequency 500 Hz has wavelength 0.68 m. Its speed is", `${500 * 0.68} m/s`, ["340 m", "735 m/s", "170 m/s"]),
      M("beats", 2, "Two tuning forks of 300 Hz and 305 Hz are sounded together. The beat frequency is", "5 Hz", ["10 Hz", "3 Hz", "605 Hz"]),
      M("closed-pipe", 3, "The fundamental frequency of a closed pipe of length 0.85 m (v = 340 m/s) is", `${340 / (4 * 0.85)} Hz`, ["400 Hz", "200 Hz", "50 Hz"]),
      M("string", 3, "The speed of a wave on a string of tension 100 N and linear density 0.01 kg/m is", `${Math.sqrt(100 / 0.01)} m/s`, ["10 m/s", "1000 m/s", "100 m/s²"]),
      M("intensity", 3, "A sound of intensity 10⁻⁶ W/m² has a loudness of (I₀ = 10⁻¹² W/m²)", "60 dB", ["6 dB", "120 dB", "600 dB"]),
      M("waves", 2, "Which of these waves is transverse?", "Light", ["Sound in air", "Ultrasound", "Sound in water"]),
    ],
    fib: [
      F("open-pipe", 3, "An open pipe of length 0.85 m (v = 340 m/s) has a fundamental frequency of ____ Hz.", [s(340 / (2 * 0.85))]),
      F("wave-speed", 2, "A wave has frequency 50 Hz and wavelength 4 m. Its speed is ____ m/s.", [s(50 * 4)]),
      F("doppler", 3, "When a source moves towards a stationary observer, the observed frequency is ____ than the source frequency. (higher or lower)", ["higher", "greater", "more"]),
      F("superposition", 3, "At a node of a stationary wave, the displacement is always ____.", ["0", "zero"]),
    ],
    para: [
      P("stationary", "In two lines, explain how a stationary wave is formed.", ["superposition", "two waves", "opposite", "same frequency", "reflected", "nodes", "antinodes", "amplitude"]),
      P("beats", "In two lines, explain how beats are produced.", ["two", "close frequencies", "interference", "loud", "soft", "difference", "waxing", "waning"]),
    ],
  },
];
