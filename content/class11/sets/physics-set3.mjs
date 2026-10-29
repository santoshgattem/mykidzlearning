// Class 11 Physics, Set 3 (Complex): JEE Main hard / Advanced style, several steps. g = 10 m/s² unless stated. Numbers are computed.
import { M, F, P } from "../helpers.mjs";

export const subjectId = "phy";
export const setNo = 3;

const s = String;
const g = 10;
const r1 = (x) => s(Number(x.toFixed(1)));

export const chapters = [
  {
    id: "p1",
    mcq: [
      M("dimensions", 3, "Which pair of quantities has the same dimensions?", "Torque and work", ["Force and impulse", "Power and energy", "Pressure and force"]),
      M("errors", 3, "In T = 2π√(L/g), L has a 1% error and g a 2% error. The maximum percentage error in T is", "1.5%", ["3%", "0.5%", "2%"]),
      M("dimensional-analysis", 4, "For a string of tension T and mass per unit length μ, the quantity √(T/μ) has the dimensions of", "Velocity", ["Acceleration", "Force", "Energy"]),
      M("significant-figures", 3, "The product 3.2 × 2.45, reported with the correct number of significant figures, is", s(7.8), ["7.84", "7.840", "8"]),
      M("instruments", 4, "A vernier calliper has 10 VSD = 9 MSD (1 MSD = 1 mm). The main scale reads 42 mm and the 3rd vernier division coincides. The reading is", "42.3 mm", ["42.03 mm", "43.0 mm", "45 mm"]),
      M("dimensions", 4, "The dimensions of ε₀ (permittivity of free space) are", "[M⁻¹L⁻³T⁴A²]", ["[ML³T⁻⁴A⁻²]", "[M⁻¹L⁻²T⁴A²]", "[ML⁻³T⁴A²]"]),
    ],
    fib: [
      F("errors", 4, "A cube’s mass has 1% error and its side 2% error. The percentage error in its density is ____ %.", [s(1 + 3 * 2)]),
      F("dimensions", 3, "Young’s modulus has dimensions [ML^____T⁻²].", ["-1", "−1"]),
      F("units", 3, "1 kWh = ____ × 10⁶ J.", ["3.6"]),
      F("units", 3, "9.8 m/s² = ____ cm/s².", ["980"]),
    ],
    para: [
      P("dimensional-analysis", "In two lines, explain how dimensional analysis can be used to derive the relation between the time period of a pendulum and its length and g.", ["T ∝ L^a g^b", "dimensions", "[T]", "equate", "powers", "a = 1/2", "b = −1/2", "constant"]),
      P("errors", "In two lines, explain how errors combine when quantities are multiplied or divided.", ["relative errors", "add", "percentage", "maximum error", "sum", "power", "multiplied", "divided"]),
    ],
  },
  {
    id: "p2",
    mcq: [
      M("free-fall", 3, "A stone falls freely from rest (g = 10 m/s²). The distance covered in the 3rd second is", `${0.5 * g * (9 - 4)} m`, ["45 m", "30 m", "15 m"]),
      M("vertical-throw", 3, "A ball is thrown up at 40 m/s (g = 10 m/s²). Its velocity after 5 s is", "10 m/s downward", ["10 m/s upward", "90 m/s downward", "0"]),
      M("stopping", 3, "A car at 20 m/s brakes with a retardation of 5 m/s². The stopping distance is", `${(20 * 20) / (2 * 5)} m`, ["80 m", "20 m", "10 m"]),
      M("calculus", 4, "A particle moves along x with x = 2t³ − 9t² + 12t (SI). Its acceleration at t = 1 s is", "−6 m/s²", ["6 m/s²", "0", "12 m/s²"]),
      M("calculus", 4, "For x = 2t³ − 9t² + 12t, the particle is momentarily at rest at", "t = 1 s and t = 2 s", ["t = 0 and t = 3 s", "t = 2 s only", "t = 6 s"]),
      M("relative", 3, "Two cars A and B move in the same direction at 20 m/s and 10 m/s. A is 100 m behind B. A catches up after", `${100 / (20 - 10)} s`, ["5 s", "20 s", "3.3 s"]),
    ],
    fib: [
      F("nth-second", 4, "A body with u = 2 m/s and a = 4 m/s² covers ____ m in its 5th second.", [s(2 + (4 * 9) / 2)]),
      F("graphs", 3, "The area under an acceleration–time graph gives the change in ____.", ["velocity", "speed"]),
      F("vertical-throw", 4, "A ball thrown up at 40 m/s (g = 10 m/s²) returns to the thrower’s hand after ____ s.", [s((2 * 40) / g)]),
      F("free-fall", 4, "A stone is dropped from a tower and takes 4 s to reach the ground (g = 10 m/s²). The height of the tower is ____ m.", [s(0.5 * g * 16)]),
    ],
    para: [
      P("graphs", "In two lines, explain how to find displacement and total distance from a velocity–time graph with a negative part.", ["area", "negative", "below the axis", "displacement", "distance", "modulus", "sign", "add"]),
      P("relative", "In two lines, explain how to solve a ‘catching up’ problem using relative velocity.", ["relative velocity", "gap", "closing speed", "difference", "distance", "time", "same direction", "divide"]),
    ],
  },
  {
    id: "p3",
    mcq: [
      M("projectile", 4, "A projectile is fired at 30° with 40 m/s (g = 10 m/s²). Its time of flight is", `${(2 * 40 * 0.5) / g} s`, ["8 s", "2 s", "6.9 s"]),
      M("projectile", 4, "For the same projectile, the maximum height is", `${(1600 * 0.25) / (2 * g)} m`, ["40 m", "80 m", "10 m"]),
      M("projectile", 4, "A projectile has its range equal to four times its maximum height. The angle of projection is", "45°", ["30°", "60°", "37°"]),
      M("river", 4, "A boat with speed 5 m/s relative to water heads straight across a 100 m wide river flowing at 3 m/s. It lands downstream by", `${(100 / 5) * 3} m`, ["100 m", "20 m", "33 m"]),
      M("river", 4, "In that case, the boat’s speed relative to the ground is", `${Math.sqrt(34).toFixed(1)} m/s`, ["8 m/s", "4 m/s", "2 m/s"]),
      M("circular", 4, "A particle moves on a circle of radius 2 m with a speed that increases uniformly from 0 to 4 m/s in 2 s. At t = 2 s, the magnitude of its total acceleration is", `${Math.sqrt(8 ** 2 + 2 ** 2).toFixed(1)} m/s²`, ["8 m/s²", "2 m/s²", "6 m/s²"]),
    ],
    fib: [
      F("projectile", 4, "Two projectiles with the same speed are fired at 30° and 60°. The ratio of their ranges is ____.", ["1", "1:1", "1/1", "equal"]),
      F("river", 4, "A swimmer wants to cross a river straight across. He must swim at an angle such that the component of his velocity upstream equals the river’s ____.", ["speed", "current", "velocity"]),
      F("projectile", 4, "A ball is launched at 60° to the horizontal with a speed of 40 m/s. Its speed at the highest point is ____ m/s.", ["20"]),
      F("vectors", 3, "Two vectors of magnitude 5 each have a resultant of magnitude 5. The angle between them is ____ degrees.", ["120"]),
    ],
    para: [
      P("projectile", "In two lines, show why the range of a projectile is the same for angles θ and (90° − θ).", ["sin 2θ", "sin(180° − 2θ)", "R = u² sin 2θ / g", "same", "complementary", "range"]),
      P("circular", "In two lines, explain the radial and tangential components of acceleration in non-uniform circular motion.", ["centripetal", "tangential", "v²/r", "dv/dt", "radial", "perpendicular", "speed changes", "direction changes"]),
    ],
  },
  {
    id: "p4",
    mcq: [
      M("atwood", 4, "In an Atwood machine, masses of 3 kg and 5 kg hang over a light pulley (g = 10 m/s²). The acceleration is", `${((5 - 3) * g) / 8} m/s²`, ["2 m/s²", "5 m/s²", "1.25 m/s²"]),
      M("atwood", 4, "The tension in the string of that Atwood machine is", `${(2 * 3 * 5 * g) / 8} N`, ["30 N", "50 N", "40 N"]),
      M("incline", 3, "A block slides on a smooth incline of 30° (g = 10 m/s²). Its acceleration is", `${g * 0.5} m/s²`, ["10 m/s²", "8.7 m/s²", "2.5 m/s²"]),
      M("rocket", 4, "A rocket ejects gas at 2 kg/s with a speed of 500 m/s relative to it. The thrust is", `${2 * 500} N`, ["250 N", "500 N", "4000 N"]),
      M("friction", 4, "A 2 kg block is pushed by a 15 N horizontal force on a floor with μ = 0.5 (g = 10 m/s²). Its acceleration is", `${(15 - 0.5 * 2 * g) / 2} m/s²`, ["7.5 m/s²", "5 m/s²", "10 m/s²"]),
      M("free-fall", 3, "The apparent weight of a person in a freely falling lift is", "Zero", ["mg", "2 mg", "mg/2"]),
    ],
    fib: [
      F("momentum", 4, "A 0.2 kg ball hits a wall at 10 m/s and rebounds at the same speed. The change in its momentum is ____ kg m/s.", [s(0.2 * 20)]),
      F("incline", 4, "A block just starts sliding on an incline of angle 45°. The coefficient of static friction is ____.", ["1"]),
      F("connected", 4, "Two blocks of 4 kg and 6 kg are in contact on a smooth floor. A 20 N force pushes the 4 kg block. The force between the blocks is ____ N.", [s((20 / 10) * 6)]),
      F("conservation", 3, "A gun of mass 5 kg fires a 50 g bullet at 200 m/s. The recoil speed of the gun is ____ m/s.", [s((0.05 * 200) / 5)]),
    ],
    para: [
      P("free-body", "In two lines, explain how to set up the equations of motion for connected bodies using free-body diagrams.", ["free body", "each body", "tension", "same acceleration", "net force", "F = ma", "string", "equations"]),
      P("impulse", "In two lines, explain how the impulse–momentum theorem helps to explain why a catcher moves his hands back while catching a fast ball.", ["time", "force", "impulse", "momentum", "increases time", "reduces force", "change in momentum"]),
    ],
  },
  {
    id: "p5",
    mcq: [
      M("variable-force", 4, "A force F = 3x newtons acts on a body as it moves from x = 0 to x = 4 m. The work done is", `${0.5 * 3 * 16} J`, ["12 J", "48 J", "6 J"]),
      M("collision", 4, "A 2 kg body at 6 m/s collides perfectly inelastically with a 4 kg body at rest. The loss of kinetic energy is", `${0.5 * 2 * 36 - 0.5 * 6 * 4} J`, ["36 J", "12 J", "0 J"]),
      M("power", 3, "A car moves at a steady 20 m/s against a resistance of 500 N. The engine power is", `${500 * 20} W`, ["25 W", "100 W", "1000 W"]),
      M("spring", 4, "A 0.5 kg block compresses a spring (k = 200 N/m) by 0.1 m and is released. Its speed when it leaves the spring is", `${0.1 * Math.sqrt(200 / 0.5)} m/s`, ["0.2 m/s", "4 m/s", "20 m/s"]),
      M("circular", 4, "A body slides without friction down a track and goes around a vertical loop of radius 1 m. The minimum speed at the bottom to just complete the loop is", `${Math.sqrt(5 * g * 1).toFixed(1)} m/s`, ["3.2 m/s", "10 m/s", "5 m/s"]),
      M("collision", 4, "A ball of mass m moving at v makes an elastic head-on collision with an identical ball at rest. After the collision", "The first stops and the second moves with v", ["Both move with v/2", "Both move with v", "The first rebounds with v"]),
    ],
    fib: [
      F("work-energy", 4, "A 2 kg body moving at 3 m/s is acted on by a force that increases its speed to 5 m/s. The work done is ____ J.", [s(0.5 * 2 * (25 - 9))]),
      F("potential-energy", 3, "A pendulum bob of mass 1 kg is raised 0.2 m above its lowest point (g = 10 m/s²). Its speed at the lowest point is ____ m/s.", [s(Math.sqrt(2 * g * 0.2))]),
      F("power", 4, "A pump raises 100 kg of water per minute through 6 m (g = 10 m/s²). The power used is ____ W.", [s((100 * g * 6) / 60)]),
      F("collision", 4, "The coefficient of restitution for a perfectly inelastic collision is ____.", ["0", "zero"]),
    ],
    para: [
      P("conservation", "In two lines, explain why momentum is conserved in all collisions but kinetic energy is conserved only in elastic ones.", ["external force", "internal forces", "momentum", "kinetic energy", "inelastic", "elastic", "heat", "deformation"]),
      P("loop", "In two lines, explain why the speed at the top of a vertical loop cannot be less than √(gr).", ["centripetal", "normal reaction", "zero", "mg", "weight", "contact", "top", "provides"]),
    ],
  },
  {
    id: "p6",
    mcq: [
      M("rolling", 4, "For a solid cylinder rolling without slipping, the rotational kinetic energy is what fraction of the total?", "1/3", ["1/2", "2/5", "2/7"]),
      M("angular-momentum", 4, "A skater spins at 2 rad/s with I = 4 kg m². She pulls in her arms to make I = 2 kg m². Her new angular speed is", `${(4 * 2) / 2} rad/s`, ["1 rad/s", "2 rad/s", "8 rad/s"]),
      M("moment-of-inertia", 4, "The moment of inertia of a thin ring about a diameter is", "MR²/2", ["MR²", "MR²/4", "2MR²/5"]),
      M("centre-of-mass", 4, "Masses of 1 kg at (0, 0), 2 kg at (3, 0) and 3 kg at (0, 2) have their centre of mass at", "(1, 1)", ["(1, 2)", "(2, 1)", "(3, 2)"]),
      M("rolling", 4, "Solid sphere, hollow sphere, solid cylinder and ring roll down the same incline from rest. Which reaches the bottom first?", "Solid sphere", ["Ring", "Solid cylinder", "Hollow sphere"]),
      M("torque", 4, "A uniform rod of mass M and length L is hinged at one end and released from horizontal. Its initial angular acceleration is", "3g/(2L)", ["g/L", "3g/L", "g/(2L)"]),
    ],
    fib: [
      F("perpendicular-axis", 3, "A thin disc has I = MR²/2 about its axis. About a diameter its moment of inertia is MR²/____.", ["4"]),
      F("angular-momentum", 4, "A particle of mass 2 kg moves at 3 m/s in a straight line at a perpendicular distance of 4 m from a point. Its angular momentum about that point is ____ kg m²/s.", [s(2 * 3 * 4)]),
      F("rotational-ke", 4, "A wheel of moment of inertia 0.5 kg m² slows from 20 rad/s to 10 rad/s. The loss in its kinetic energy is ____ J.", [s(0.5 * 0.5 * (400 - 100))]),
      F("rolling", 4, "A ring rolls without slipping. The fraction of its kinetic energy that is rotational is ____. (fraction)", ["1/2", "0.5", ".5", "half"]),
    ],
    para: [
      P("rolling-without-slipping", "In two lines, explain the condition v = Rω for rolling without slipping.", ["point of contact", "instantaneous rest", "no slipping", "v = ωR", "centre of mass", "translational", "rotational"]),
      P("parallel-axis", "In two lines, state the parallel axis theorem and one use of it.", ["I = I₀ + Md²", "parallel", "centre of mass", "axis", "distance", "moment of inertia", "d²"]),
    ],
  },
  {
    id: "p7",
    mcq: [
      M("orbital", 4, "A satellite orbits very close to the Earth’s surface (R = 6400 km, g = 10 m/s²). Its orbital speed is about", `${(Math.sqrt(g * 6.4e6) / 1000).toFixed(1)} km/s`, ["11.2 km/s", "3.0 km/s", "7.9 m/s"]),
      M("neutral-point", 4, "Two masses M and 4M are a distance d apart. The gravitational field is zero on the line joining them at a distance from M of", "d/3", ["d/2", "d/5", "2d/3"]),
      M("escape-velocity", 4, "A planet has 8 times the Earth’s mass and 2 times its radius. The escape velocity from it is (Earth’s: 11.2 km/s)", `${11.2 * 2} km/s`, ["11.2 km/s", "44.8 km/s", "5.6 km/s"]),
      M("energy", 4, "The total energy of a satellite of mass m in a circular orbit of radius r around a planet of mass M is", "−GMm/(2r)", ["GMm/(2r)", "−GMm/r", "GMm/r"]),
      M("g-variation", 4, "At a small height h above the Earth’s surface, g decreases approximately to", "g(1 − 2h/R)", ["g(1 − h/R)", "g(1 − 3h/R)", "g(1 − h/2R)"]),
      M("kepler", 4, "A satellite in a circular orbit of radius 4 times that of another satellite has a period", "8 times as long", ["4 times as long", "2 times as long", "16 times as long"]),
    ],
    fib: [
      F("orbital", 4, "The orbital speed of a satellite close to the Earth is v₀. Its escape speed is v₀ × √____.", ["2"]),
      F("energy", 4, "The binding energy of a satellite of mass m in a circular orbit of radius r is GMm/____.", ["2r", "(2r)"]),
      F("g-variation", 3, "The weight of a body at the Earth’s poles is ____ than at the equator. (greater or less)", ["greater", "more", "higher"]),
      F("field", 4, "The gravitational field inside a uniform thin spherical shell is ____.", ["0", "zero"]),
    ],
    para: [
      P("escape-velocity", "In two lines, show how the escape velocity is obtained from energy conservation.", ["kinetic", "potential", "−GMm/R", "total energy zero", "½mv²", "√(2GM/R)", "infinity", "escape"]),
      P("geostationary", "In two lines, list the conditions for a satellite to be geostationary.", ["equatorial", "24 hours", "same period", "west to east", "height", "35,800", "remains above", "orbit"]),
    ],
  },
  {
    id: "p8",
    mcq: [
      M("energy", 4, "A wire stretched by 2 mm under a load of 200 N stores elastic energy", `${0.5 * 200 * 0.002} J`, ["0.4 J", "400 J", "0.1 J"]),
      M("comparison", 4, "Two wires of the same material and load have lengths in the ratio 1 : 2 and radii in the ratio 1 : 2. The ratio of their extensions is", "2 : 1", ["1 : 1", "1 : 2", "1 : 4"]),
      M("bulk-modulus", 4, "The pressure on a liquid is increased by 10⁷ Pa. If the bulk modulus is 2 × 10⁹ Pa, the fractional decrease in volume is", `${(1e7 / 2e9) * 100}%`, ["0.05%", "5%", "2%"]),
      M("thermal-stress", 4, "A steel rod (Y = 2 × 10¹¹ Pa, α = 10⁻⁵ per °C) is fixed between two rigid walls and heated by 50 °C. The stress developed is", "10⁸ Pa", ["10⁷ Pa", "10⁹ Pa", "10¹¹ Pa"]),
      M("elasticity", 4, "Of steel and rubber, the one with the greater Young’s modulus is", "Steel", ["Rubber", "Both equal", "Depends on length"]),
      M("curve", 4, "Beyond the elastic limit in a stress–strain curve, if the load is removed the material", "Does not regain its original length", ["Regains its original length", "Breaks immediately", "Becomes more elastic"]),
    ],
    fib: [
      F("youngs-modulus", 4, "A wire of length L is stretched by l. If the same load is applied to a wire of the same material and cross-section with length 2L, the extension is ____ l.", ["2", "two"]),
      F("shear", 4, "The shear modulus of a liquid is ____.", ["0", "zero"]),
      F("energy-density", 4, "The energy stored per unit volume at stress σ and strain ε is ½ ____ ε.", ["σ", "stress", "sigma"]),
      F("poisson", 4, "Poisson’s ratio for most materials lies between 0 and ____.", ["0.5", ".5", "1/2"]),
    ],
    para: [
      P("thermal-stress", "In two lines, explain how thermal stress arises in a rod that is prevented from expanding.", ["expansion", "prevented", "rigid", "strain", "stress", "Y α ΔT", "heated", "compressive"]),
      P("hysteresis", "In two lines, explain what elastic hysteresis means and why rubber is used in shock absorbers.", ["loop", "energy loss", "heat", "area", "strain lags", "stress", "absorbs", "rubber"]),
    ],
  },
  {
    id: "p9",
    mcq: [
      M("terminal-velocity", 4, "A small drop of radius r has terminal velocity v in air. A drop of radius 2r has terminal velocity", "4v", ["2v", "8v", "v/2"]),
      M("manometer", 4, "In a U-tube, water stands 10 cm above the interface. The oil (relative density 0.8) in the other limb stands above the interface at", `${10 / 0.8} cm`, ["8 cm", "10 cm", "20 cm"]),
      M("torricelli", 4, "Water flows from a hole in a large tank, 5 m below the surface (g = 10 m/s²). The speed of efflux is", `${Math.sqrt(2 * g * 5)} m/s`, ["5 m/s", "50 m/s", "7 m/s"]),
      M("pressure", 3, "The absolute pressure at the bottom of a 5 m deep water tank (P₀ = 10⁵ Pa, g = 10 m/s²) is", `${1e5 + 1000 * g * 5} Pa`, ["5 × 10⁴ Pa", "10⁵ Pa", "6 × 10⁵ Pa"]),
      M("floating", 4, "A block of density 600 kg/m³ floats in water. The fraction of its volume submerged is", "0.6", ["0.4", "0.5", "1"]),
      M("capillary", 4, "If the radius of a capillary tube is halved, the height of liquid rise becomes", "Double", ["Half", "Four times", "Unchanged"]),
    ],
    fib: [
      F("continuity", 4, "Water flows at 2 m/s in a pipe of cross-section 4 cm². In a section of 1 cm² its speed is ____ m/s.", [s((2 * 4) / 1)]),
      F("bernoulli", 4, "In a horizontal pipe, if speed increases from 1 m/s to 3 m/s, the pressure drop in water (ρ = 1000 kg/m³) is ____ Pa.", [s(0.5 * 1000 * (9 - 1))]),
      F("buoyancy", 4, "An iron block of volume 200 cm³ is fully immersed in water (g = 10 m/s²). The buoyant force is ____ N.", [s(1000 * 200e-6 * g)]),
      F("surface-energy", 4, "The surface energy of a drop of radius r and surface tension T is 4πr²T. A drop splits into 8 equal drops; the total surface area becomes ____ times.", ["2", "two"]),
    ],
    para: [
      P("stokes", "In two lines, explain how terminal velocity is reached by a sphere falling in a viscous liquid.", ["weight", "buoyancy", "viscous force", "balanced", "net force zero", "constant velocity", "terminal", "increases with speed"]),
      P("capillary", "In two lines, explain why mercury is depressed and water rises in a glass capillary tube.", ["adhesion", "cohesion", "angle of contact", "meniscus", "obtuse", "acute", "concave", "convex"]),
    ],
  },
  {
    id: "p10",
    mcq: [
      M("calorimetry", 4, "The heat needed to convert 100 g of ice at −10 °C into water at 20 °C (c_ice = 2100, c_water = 4200 J/kg K, L = 3.36 × 10⁵ J/kg) is", `${2100 * 0.1 * 10 + 0.1 * 3.36e5 + 0.1 * 4200 * 20} J`, ["33600 J", "8400 J", "100000 J"]),
      M("mixing", 4, "200 g of water at 80 °C is mixed with 300 g of water at 30 °C. The final temperature is", `${(200 * 80 + 300 * 30) / 500} °C`, ["55 °C", "45 °C", "60 °C"]),
      M("conduction", 4, "A copper rod (k = 400 W/m K, area 10⁻⁴ m², length 1 m) has its ends at 100 °C and 0 °C. The heat flow rate is", `${(400 * 1e-4 * 100) / 1} W`, ["40 W", "0.4 W", "400 W"]),
      M("radiation", 4, "Two black bodies at 600 K and 300 K radiate power in the ratio", "16 : 1", ["2 : 1", "4 : 1", "8 : 1"]),
      M("wien", 4, "If the temperature of a black body is doubled, the wavelength of maximum emission", "Becomes half", ["Doubles", "Becomes four times", "Does not change"]),
      M("expansion", 4, "A metal sheet with a hole is heated. The size of the hole", "Increases", ["Decreases", "Remains the same", "Becomes zero"]),
    ],
    fib: [
      F("cooling", 4, "A body cools from 80 °C to 70 °C in 5 minutes in surroundings at 30 °C. By Newton’s law of cooling (use the average temperature in each interval), it cools from 70 °C to ____ °C in the next 5 minutes.", ["62"]),
      F("expansion", 4, "A steel tape is calibrated at 20 °C. At a higher temperature it reads lengths as ____ than the true length. (shorter or longer)", ["shorter", "less", "smaller"]),
      F("thermal-capacity", 3, "The thermal capacity of a body of mass 2 kg and specific heat 500 J/kg K is ____ J/K.", [s(2 * 500)]),
      F("radiation", 4, "A black body at 1000 K has a radiant power P. At 500 K its power is P/____.", ["16"]),
    ],
    para: [
      P("anomalous", "In two lines, explain the anomalous expansion of water and why lakes freeze from the top.", ["4 °C", "maximum density", "ice floats", "top", "below", "insulates", "lake", "density"]),
      P("conduction", "In two lines, explain why the same ΔT drives more heat through a thick rod of high conductivity.", ["k", "A", "L", "Q = kAΔT/L", "conductivity", "area", "length", "proportional"]),
    ],
  },
  {
    id: "p11",
    mcq: [
      M("isothermal", 4, "One mole of an ideal gas at 300 K expands isothermally to double its volume (R = 8.3 J/mol K, ln 2 = 0.693). The work done is about", `${(8.3 * 300 * Math.log(2)).toFixed(0)} J`, ["2490 J", "300 J", "8.3 J"]),
      M("adiabatic", 4, "A monatomic ideal gas (γ = 5/3) at 300 K is compressed adiabatically to 1/8 of its volume. The final temperature is", s(Math.round(300 * 8 ** (2 / 3))) + " K", ["900 K", "2400 K", "600 K"]),
      M("refrigerator", 4, "A Carnot refrigerator works between 270 K and 300 K. Its coefficient of performance is", s(270 / 30), ["10", "0.9", "1.1"]),
      M("efficiency", 4, "A Carnot engine has an efficiency of 40% with its sink at 300 K. The source temperature is", `${300 / 0.6} K`, ["750 K", "420 K", "400 K"]),
      M("cycle", 4, "A cycle of rectangle shape on a P–V diagram goes from (2 L, 1 atm) to (4 L, 3 atm). Taking 1 atm = 10⁵ Pa, the work done per cycle is", `${(3e5 - 1e5) * (4e-3 - 2e-3)} J`, ["800 J", "200 J", "1200 J"]),
      M("entropy", 4, "In a reversible adiabatic process, the entropy of the system", "Remains constant", ["Increases", "Decreases", "Becomes zero"]),
    ],
    fib: [
      F("first-law", 4, "A gas is taken from A to B by two different paths. The change in its internal energy is ____ for both. (same or different)", ["same", "equal"]),
      F("efficiency", 4, "A Carnot engine’s efficiency is 25%. If the sink temperature is lowered so that efficiency becomes 50% (source 400 K), the new sink temperature is ____ K.", ["200"]),
      F("work", 4, "In an isobaric process, the work done by n moles of an ideal gas when its temperature rises by ΔT is ____ × ΔT.", ["nR", "n R"]),
      F("heat-pump", 4, "In a refrigerator, the work done on the system is W, the heat taken from the cold body is Q₂, and heat given to the hot body is ____ + W.", ["Q₂", "Q2"]),
    ],
    para: [
      P("second-law", "In two lines, state the Kelvin–Planck statement of the second law.", ["no engine", "converts", "all the heat", "work", "single reservoir", "cycle", "efficiency", "100%"]),
      P("carnot", "In two lines, explain why no engine can be more efficient than a Carnot engine working between the same two temperatures.", ["reversible", "maximum efficiency", "T₂/T₁", "second law", "same temperatures", "irreversible", "less"]),
    ],
  },
  {
    id: "p12",
    mcq: [
      M("rms", 4, "The ratio of the rms speed of hydrogen to that of oxygen at the same temperature is", s(Math.sqrt(32 / 2)) + " : 1", ["16 : 1", "2 : 1", "1 : 4"]),
      M("rms", 4, "The rms speed of nitrogen molecules (M = 28 g/mol) at 300 K (R = 8.3 J/mol K) is about", `${Math.sqrt((3 * 8.3 * 300) / 0.028).toFixed(0)} m/s`, ["300 m/s", "1000 m/s", "50 m/s"]),
      M("internal-energy", 4, "The internal energy of 2 mol of a diatomic gas (rotation included) at 300 K (R = 8.3 J/mol K) is", `${(5 / 2) * 2 * 8.3 * 300} J`, ["7470 J", "14940 J", "4980 J"]),
      M("gamma", 4, "For a diatomic gas with 5 degrees of freedom, γ = Cp/Cv is", "7/5", ["5/3", "4/3", "9/7"]),
      M("dalton", 4, "A vessel has 2 mol of gas A and 3 mol of gas B at pressure 5 atm in total. The partial pressure of A is", `${(2 / 5) * 5} atm`, ["3 atm", "2.5 atm", "5 atm"]),
      M("energy", 4, "At the same temperature, the average translational kinetic energy per molecule of hydrogen compared with oxygen is", "Equal", ["16 times", "4 times", "1/4"]),
    ],
    fib: [
      F("rms", 4, "If the temperature of a gas rises from 27 °C to 327 °C, its rms speed becomes ____ times.", ["1.41", "√2", "1.414"]),
      F("equipartition", 4, "The molar heat capacity Cv of a diatomic gas at room temperature is ____ R. (fraction)", ["5/2", "2.5"]),
      F("mean-free-path", 4, "If the pressure of a gas is doubled at constant temperature, its mean free path becomes ____ of its value. (fraction)", ["1/2", "0.5", "half"]),
      F("ideal-gas", 3, "The volume of 1 mol of an ideal gas at 273 K and 1 atm is about ____ litres.", ["22.4", "22.4 L"]),
    ],
    para: [
      P("law-of-equipartition", "In two lines, state the law of equipartition of energy.", ["each degree of freedom", "½ kT", "thermal equilibrium", "average energy", "per molecule", "equal", "kT/2"]),
      P("specific-heat", "In two lines, explain why Cp is greater than Cv for a gas.", ["work", "expansion", "constant pressure", "extra heat", "volume", "Cp = Cv + R", "gas does work"]),
    ],
  },
  {
    id: "p13",
    mcq: [
      M("spring", 4, "A spring is cut into two equal halves. The force constant of each half and the time period of a mass on it (compared with the full spring) are", "2k and T/√2", ["k/2 and √2 T", "k and T", "2k and 2T"]),
      M("pendulum", 4, "A simple pendulum is in a lift that accelerates upward with a = g. Its period becomes", "T/√2", ["√2 T", "T", "T/2"]),
      M("superposition", 4, "Two SHMs along the same line with amplitudes 3 and 4 are 90° out of phase. The resultant amplitude is", s(Math.sqrt(9 + 16)), ["7", "1", "3.5"]),
      M("energy", 4, "At what displacement from the mean is the kinetic energy equal to the potential energy in SHM of amplitude A?", "A/√2", ["A/2", "A/4", "A"]),
      M("phase", 4, "A particle in SHM has x = A sin(ωt + π/6). At t = 0 the displacement is", "A/2", ["A", "0", "A/√2"]),
      M("damped", 3, "In damped oscillations, the amplitude", "Decreases with time", ["Increases with time", "Stays constant", "Oscillates"]),
    ],
    fib: [
      F("pendulum", 4, "A pendulum of length 1 m has a period of 2 s on Earth. On a planet with g one-fourth as large its period is ____ s.", ["4"]),
      F("spring", 4, "A mass m on a spring of constant k has T = 2π√(m/k). When the mass is made 4 times, the frequency becomes ____ times. (fraction)", ["1/2", "0.5", "half"]),
      F("shm", 4, "The total energy of a particle in SHM of amplitude 0.1 m, mass 0.1 kg and ω = 10 rad/s is ____ J.", [s(0.5 * 0.1 * 100 * 0.01)]),
      F("springs", 4, "Two identical springs of constant k are joined in series. The effective constant is k/____.", ["2"]),
    ],
    para: [
      P("shm-condition", "In two lines, show that a mass on a spring executes SHM.", ["F = −kx", "restoring force", "proportional", "ω = √(k/m)", "acceleration", "a = −ω²x", "displacement"]),
      P("resonance", "In two lines, explain why soldiers break step while crossing a bridge.", ["resonance", "natural frequency", "marching", "amplitude", "bridge", "collapse", "periodic force"]),
    ],
  },
  {
    id: "p14",
    mcq: [
      M("doppler", 4, "A source of 400 Hz moves towards a stationary observer at 20 m/s (v = 340 m/s). The observed frequency is", `${(400 * 340) / (340 - 20)} Hz`, ["377.8 Hz", "420 Hz", "400 Hz"]),
      M("pipes", 4, "A closed pipe has a fundamental frequency of 100 Hz. The next higher frequency it can resonate at is", "300 Hz", ["200 Hz", "400 Hz", "150 Hz"]),
      M("strings", 4, "A string 1 m long fixed at both ends supports waves at speed 200 m/s. The frequency of the third harmonic is", `${(3 * 200) / 2} Hz`, ["200 Hz", "600 Hz", "100 Hz"]),
      M("speed-of-sound", 4, "If the temperature of air rises from 27 °C to 327 °C, the speed of sound becomes", "√2 times", ["2 times", "11 times", "1/√2 times"]),
      M("intensity", 4, "Two identical sources, each giving 60 dB at a point, are sounded together there. The sound level is about", "63 dB", ["120 dB", "61 dB", "90 dB"]),
      M("beats", 4, "Two waves with frequencies 100 Hz and 104 Hz produce a beat each", "0.25 s", ["4 s", "0.5 s", "1 s"]),
    ],
    fib: [
      F("doppler", 4, "An observer moves towards a stationary source of 300 Hz at 17 m/s (v = 340 m/s). The observed frequency is ____ Hz.", [s(300 * (340 + 17) / 340)]),
      F("standing-waves", 4, "In a stationary wave, the distance between two consecutive nodes is ____ of the wavelength. (fraction)", ["1/2", "0.5", "half"]),
      F("open-pipe", 4, "The second overtone of an open pipe is the ____ harmonic.", ["third", "3rd", "3"]),
      F("intensity", 4, "If the amplitude of a sound wave is doubled, its intensity becomes ____ times.", ["4", "four"]),
    ],
    para: [
      P("doppler", "In two lines, explain why the pitch of an approaching ambulance siren drops after it passes you.", ["doppler", "frequency", "approaching", "receding", "higher", "lower", "relative motion", "observer"]),
      P("end-correction", "In two lines, explain what end correction is in a resonance tube experiment.", ["antinode", "slightly above the open end", "effective length", "0.6 r", "radius", "open end", "correction"]),
    ],
  },
];
