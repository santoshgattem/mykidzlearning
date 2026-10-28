import { mcq, num, PHY as P } from "./helpers.mjs";
const g = 10;

export const physics = [
  // ---- 20 multiple-choice
  mcq(P.units, "The dimensional formula of Planck’s constant h (energy = h × frequency) is", "[M L² T⁻¹]", ["[M L T⁻¹]", "[M L² T⁻²]", "[M L⁻¹ T⁻¹]"]),
  mcq(P.units, "Which pair of physical quantities has the same dimensions?", "Work and torque", ["Impulse and force", "Power and energy", "Momentum and kinetic energy"]),
  mcq(P.kin, "A ball is thrown vertically upward with a speed of 20 m/s (take g = 10 m/s²). The time taken to return to the thrower’s hand is", "4 s", ["2 s", "3 s", "5 s"]),
  mcq(P.kin, "The position of a particle is x = 3t² − 2t + 4 (in metres, t in seconds). Its velocity at t = 2 s is", "10 m/s", ["8 m/s", "12 m/s", "14 m/s"]),
  mcq(P.plane, "A projectile launched at 45° with speed v has a range R. Launched at 30° with the same speed, its range is", "(√3/2) R", ["R/2", "R", "2R/√3"]),
  mcq(P.plane, "A particle moves on a circle of radius r with constant speed v. The magnitude of its average acceleration over half a revolution is", "2v²/(πr)", ["v²/r", "Zero", "πv²/(2r)"]),
  mcq(P.laws, "A 2 kg block on a rough horizontal floor (μ = 0.5) is pulled by a horizontal force of 15 N (g = 10 m/s²). Its acceleration is", "2.5 m/s²", ["5 m/s²", "7.5 m/s²", "10 m/s²"]),
  mcq(P.laws, "A 60 kg man stands in a lift accelerating upward at 2 m/s² (g = 10 m/s²). The reading of a weighing scale he stands on is", "720 N", ["600 N", "480 N", "840 N"]),
  mcq(P.wep, "A force F = 3x² newton acts on a particle along the x-axis. The work done from x = 0 to x = 2 m is", "8 J", ["6 J", "12 J", "4 J"]),
  mcq(P.wep, "The kinetic energy of a body is increased by 300%. Its momentum increases by", "100%", ["300%", "200%", "50%"]),
  mcq(P.rot, "The moment of inertia of a uniform solid sphere of mass M and radius R about a diameter is", "(2/5) M R²", ["(1/2) M R²", "(2/3) M R²", "(7/5) M R²"]),
  mcq(P.rot, "A skater spinning freely pulls in her arms so that her moment of inertia becomes half. Her rotational kinetic energy", "Doubles", ["Halves", "Stays the same", "Becomes four times"]),
  mcq(P.grav, "The acceleration due to gravity at a height equal to the radius R of the Earth above its surface is", "g/4", ["g/2", "g/3", "g/8"]),
  mcq(P.grav, "The ratio of escape speed to the orbital speed of a satellite just above the Earth’s surface is", "√2", ["1", "2", "1/√2"]),
  mcq(P.fluids, "A small sphere falls through a viscous liquid. Its terminal velocity is proportional to", "r² (square of its radius)", ["r", "r³", "1/r"]),
  mcq(P.solids, "A wire is stretched. If both its length and its diameter are doubled, the Young’s modulus of its material", "Remains unchanged", ["Doubles", "Becomes half", "Becomes four times"]),
  mcq(P.thermal, "A rod of cross-section A and length L conducts heat at a rate H for a fixed temperature difference. If both A and L are doubled, the rate of conduction becomes", "H (unchanged)", ["2H", "H/2", "4H"]),
  mcq(P.thermo, "In the isothermal expansion of an ideal gas, the heat absorbed by the gas is equal to", "The work done by the gas", ["The change in internal energy", "Zero", "The negative of the work done by the gas"]),
  mcq(P.ktg, "If the absolute temperature of an ideal gas is made four times, the rms speed of its molecules becomes", "2 times", ["4 times", "√2 times", "16 times"]),
  mcq(P.osc, "A simple pendulum has time period T. If its length is made four times, the new time period is", "2T", ["T/2", "4T", "T/4"]),

  // ---- 10 numerical (values are computed, not typed)
  num(P.kin, "A car starts from rest and moves with a uniform acceleration of 2 m/s² for 10 s. Find the distance covered, in metres.", 0.5 * 2 * 10 ** 2),
  num(P.plane, "A projectile is fired at 30° to the horizontal with a speed of 40 m/s (g = 10 m/s²). Find its maximum height, in metres.", (40 * Math.sin(Math.PI / 6)) ** 2 / (2 * g), 0.01),
  num(P.laws, "Masses of 2 kg and 3 kg hang from the ends of a light string passing over a smooth light pulley (g = 10 m/s²). Find the tension in the string, in newtons.", (2 * 2 * 3 * g) / (2 + 3)),
  num(P.osc, "A block of mass 2 kg is attached to a spring of spring constant 200 N/m. Find the angular frequency of its oscillation, in rad/s.", Math.sqrt(200 / 2), 0.001),
  num(P.rot, "A constant torque of 20 N m acts on a disc of moment of inertia 5 kg m², initially at rest. Find its angular speed after 4 s, in rad/s.", (20 / 5) * 4),
  num(P.grav, "At what depth below the Earth’s surface is the value of g equal to 3/4 of its value at the surface? Take the Earth’s radius as 6400 km. Give the depth in km.", 6400 * (1 - 3 / 4)),
  num(P.fluids, "Find the gauge pressure at a depth of 20 m in water, in kPa (density of water 1000 kg/m³, g = 10 m/s²).", (1000 * g * 20) / 1000),
  num(P.thermal, "How much heat is needed to raise the temperature of 2 kg of water from 20 °C to 70 °C? Specific heat of water = 4200 J kg⁻¹ K⁻¹. Give the answer in kJ.", (2 * 4200 * 50) / 1000),
  num(P.thermo, "Two moles of an ideal gas are heated at constant pressure so that the temperature rises by 50 K. Find the work done by the gas, in joules (R = 8.3 J mol⁻¹ K⁻¹).", 2 * 8.3 * 50, 0.5),
  num(P.waves, "A wave on a string has frequency 50 Hz and wavelength 0.4 m. Find the speed of the wave, in m/s.", 50 * 0.4, 0.001),
];
