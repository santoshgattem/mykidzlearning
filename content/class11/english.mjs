// Class 11 English (NCERT Hornbill and Snapshots, plus writing skills), in the NCERT order.
// Every chapter reuses the prototype's content unchanged: `legacy: "<prototype id>"`.
// Each has 3 Foundation + 3 CBSE Board multiple-choice questions, 2 fill-in-the-blanks and 1 written
// question. Tests at the two JEE levels top up from these, so English tests stay short and fair.
// Questions excluded after review (their detail could not be confirmed against the NCERT text) go in
// `drop`, as a fragment of the question. Replacements go in `extra`.
const m = (l, q, o, a) => ({ l, q, o, a });
const f = (l, q, a) => ({ l, q, a });

export const chapters = [
  { id: "e1", legacy: "e1" }, // The Portrait of a Lady
  { id: "e2", legacy: "e2" }, // A Photograph (poem)
  { id: "e3", legacy: "e3", drop: ["badly injured"], extra: { fib: [f(1, "The family’s boat in the story was named ____.", ["wavewalker"])] } }, // We're Not Afraid to Die... if We Can All Be Together
  { id: "e4", legacy: "e4" }, // Discovering Tut: the Saga Continues
  { id: "e5", legacy: "e5", drop: ["leaves in the poem"], extra: { fib: [f(1, "The bird that visits the laburnum tree in the poem is a ____.", ["goldfinch"])] } }, // The Laburnum Top (poem)
  { id: "e6", legacy: "e6" }, // The Voice of the Rain (poem)
  { id: "e7", legacy: "e7" }, // The Ailing Planet: the Green Movement's Role
  { id: "e8", legacy: "e8" }, // Childhood (poem)
  {
    id: "e9", legacy: "e9",
    drop: ["Gaitonde moved between worlds", "thrown out of a meeting"],
    extra: {
      mcq: [
        m(2, "In the other world of the story, the Battle of Panipat was won by the", ["Afghans", "Marathas", "British", "Mughals"], 1),
        m(2, "Rajendra explains Gaitonde’s experience with the help of", ["Catastrophe theory", "Kepler’s laws", "A dream diary", "Astrology"], 0),
      ],
    },
  }, // The Adventure
  {
    id: "e10", legacy: "e10",
    drop: ["tone about Hor"],
    extra: { mcq: [m(2, "Mount Kailash, the author’s destination, lies in which region?", ["Tibet", "Greenland", "Patagonia", "The Alps"], 0)] },
  }, // Silk Road
  { id: "e11", legacy: "e11", drop: ["poem ends with the father"] }, // Father to Son (poem)
  { id: "e12", legacy: "e12" }, // The Summer of the Beautiful White Horse
  {
    id: "e13", legacy: "e13",
    drop: ["first visits"],
    extra: { mcq: [m(2, "At the end of the story, the narrator decides to", ["Forget the address", "Buy the house", "Write to the queen", "Move to Marconi Street"], 0)] },
  }, // The Address
  { id: "e14", legacy: "e14" }, // Mother's Day
  { id: "e15", legacy: "e15" }, // Birth
  { id: "e16", legacy: "e16" }, // The Tale of Melon City (poem)
  { id: "e17", legacy: "e17" }, // Note-making, Summarising and Sub-titling
  { id: "e18", legacy: "e18" }, // Essay, Letter and Creative Writing
];
