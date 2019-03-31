import Jazz, {NoteTranslator} from './jazz';
import UTM, {directions} from './utm';

const OUTPUT_CLASS = 'tape-snapshot';
const TOTAL_BARS = 8;
var newstates = parseInt(document.getElementsByName(stateval),10);
const tape = [];

// Initialize the tape as 4 by 8, full of zeroes.
for (let i = 0; i < 4; i++) {
  tape[i] = [];

  for (let j = 0; j < 8; j++) {
    tape[i][j] = 0;
  }
}

// Once the DOM has loaded:
// - create a utm object
// - display the initial tape
// - run the utm each time the button is pushed, then display tape
document.addEventListener('DOMContentLoaded', () => {
  // Create a utm object with a machine table
  const utm = new UTM(tape, 20, newstates);
  const jazz = new Jazz(['organ', 'bass', 'brass', 'bass']);

  // Function that displays the current state of the tap in an HTML div
  const tapeElement = staff => {
    const element = staff.reduce((acc, row) => {
      const rowElement = document.createElement('div');

      rowElement.textContent = row.toString();
      acc.append(rowElement);

      return acc;
    }, document.createElement('div'));

    element.className = OUTPUT_CLASS;

    return element;
  };

  // Run the utm every time the button is clicked, then display the new tape
  // state
  document.querySelector('#begin-button').addEventListener('click', () => {
    const staff = [];

    for (let i = 0; i < TOTAL_BARS; i++) {
      utm.begin();

      const tape = utm.getTape();
      for (let j = 0; j < tape.length; j++) {
        if (staff[j]) {
          staff[j] = staff[j].concat(tape[j].slice());
        } else {
          staff[j] = tape[j].slice();
        }
      }
    }

    const noteTranslator = new NoteTranslator(staff);
    noteTranslator.translate();
    const freqs = noteTranslator.getFreq();

    jazz.play(freqs);

    document.querySelector('#turing-tape').append(tapeElement(staff));
  });

  // Display the initial tape state
  document.querySelector('#turing-tape').append(tapeElement());
});
