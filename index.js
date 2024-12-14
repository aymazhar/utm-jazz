import Jazz, {NoteTranslator} from './jazz';
import UTM from './utm';

const TOTAL_BARS = 8;
const MAXSTATES = 17;
const MINSTATES = 1;
const jazz = new Jazz();

document.addEventListener('DOMContentLoaded', () => {
  const gobutton = document.querySelector('#begin-button');
  gobutton.addEventListener('click', () => {
    // Reset img and any sound
    resetAll();

    // Have utm play
    const userOptions = getUserOptions();
    const tape = makeTape(); // Empty tape 4x8
    const utm = new UTM(tape, 20, userOptions.states);
    jazz.oscillatorTypes = userOptions.instruments;
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
    makeImage(staff);
    showInstruments(userOptions);
    jazz.play(freqs);
    moveBar();

    const stopbutton = document.querySelector('#stop-button');
    stopbutton.addEventListener('click', () => {
      stop(jazz);
    });

    const replaybutton = document.querySelector('#replay-button');
    replaybutton.addEventListener('click', () => {
      jazz.stop();
      removeImage();
      makeImage(staff);
      showInstruments(userOptions);
      jazz.play(freqs);
      moveBar();
    });

    const reset = document.querySelector('#reset-button');
    reset.addEventListener('click', () => {
      jazz.stop();
      removeImage();
    });
  });

  const randomizebutton = document.querySelector('#random-button');
  randomizebutton.addEventListener('click', () => {
  // Reset img and any sound
    resetAll();

    // Have utm play with randomized instruments and states
    const randomizerOptions = getRandomizerOptions();
    const tape = makeTape(); // Empty tape 4x8
    const utm = new UTM(tape, 20, randomizerOptions.states);
    jazz.oscillatorTypes = randomizerOptions.instruments;
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

    makeImage(staff);
    showInstruments(randomizerOptions);
    showStates(randomizerOptions);
    jazz.play(freqs);
    moveBar();

    const stopbutton = document.querySelector('#stop-button');
    stopbutton.addEventListener('click', () => {
      stop(jazz);
    });

    const replaybutton = document.querySelector('#replay-button');
    replaybutton.addEventListener('click', () => {
      jazz.stop();
      removeImage();
      makeImage(staff);
      showInstruments(randomizerOptions);
      showStates(randomizerOptions);
      jazz.play(freqs);
      moveBar();
    });

    const reset = document.querySelector('#reset-button');
    reset.addEventListener('click', () => {
      jazz.stop();
      removeImage();
    });
  });
});

function getUserOptions() {
  const userOptions = {
    instruments: [],
    states: 4
  };
  const stateSelector = document.querySelector('#stateval')
  console.log(stateSelector.value, 'stateSelector.value', typeof stateSelector.value)
  let selectedState = parseInt(stateSelector.value, 10);
  if (selectedState > MAXSTATES) {
    selectedState = MAXSTATES
    stateSelector.value = MAXSTATES.toString()
  } else if (selectedState < MINSTATES) {
    selectedState = MINSTATES
    stateSelector.value = MINSTATES.toString()
  }

  userOptions.states = selectedState
  console.log(userOptions.states)
  for (let i = 0; i < 4; i++) {
    userOptions.instruments.push(
      document.querySelector(`#instrument-${i}`).value);
  }

  return userOptions;
}

function getRandomizerOptions() {
  const randomizerOptions = {
    instruments: [],
    states: 4
  };
  randomizerOptions.states = Math.floor(Math.random() * MAXSTATES) + MINSTATES;

  const instrumentsoptions = ['chiptune', 'brass', 'bass', 'organ'];
  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * instrumentsoptions.length);
    randomizerOptions.instruments.push(instrumentsoptions[index]);
  }

  return randomizerOptions;
}

function makeTape() {
  const tape = [];

  for (let i = 0; i < 4; i++) {
    tape[i] = [];

    for (let j = 0; j < 8; j++) {
      tape[i][j] = 0;
    }
  }

  return tape;
}

function makeImage(staff) {
  const musicsheet = document.querySelector('#music-sheets');

  // For each row in the staff (each instrument) create an image of a staff
  for (let y = 0; y < staff.length; y++) {
    const notesheet = document.createElement('div');
    notesheet.id = 'music-animation';
    musicsheet.append(notesheet);
    const divider = document.createElement('div');
    divider.id = 'sheet-divider';
    musicsheet.append(divider);

    let notexvalue = 10;
    const noteyvalue = 10;
    // For each note for each instrument staff, create a new note and place on img
    for (let x = 0; x < staff[y].length; x++) {
      const svgNamespace = "http://www.w3.org/2000/svg";
      const newnote = document.createElementNS(svgNamespace, "svg");
      newnote.setAttribute("viewBox", "-7 0 30 30");

      const path = document.createElementNS(svgNamespace, "path");
      path.setAttribute("d", "M14.992 0c-.961 0-1.008 1.002-1.008 1.002v16.361c-2.236-1.648-5.926-1.65-9.196.226C.725 19.922-1.018 24.27.616 27.3c1.663 3.084 6.481 3.596 10.544 1.263C14.316 26.751 16.007 23.807 16 21V1c-.018-.538-.463-1-1.008-1");
      path.setAttribute("fill", "#000");
      path.setAttribute("fill-rule", "evenodd"); 
      newnote.appendChild(path)

      newnote.id = 'music-notes';
      notesheet.append(newnote);

      if (staff[y][x] === 0) {
        newnote.style.bottom = noteyvalue;
        newnote.style.left = notexvalue;
        notexvalue += 10;
      } else {
        const notevalue = staff[y][x] % 8;
        newnote.style.bottom = (noteyvalue + (10 * notevalue)) + 'px';
        notexvalue += 10;
        newnote.style.left = notexvalue + 'px';
      }
    }
  }
}

function removeImage() {
  resetAll();

  for (let j = 0; j < 4; j++) {
    const instname = document.querySelector(`#inst-${j}`);
    instname.innerHTML = '';
  }
}

function moveBar() {
  const bar = document.querySelector('#music-bar');
  let pos = 0;
  const loc = setInterval(move, 25);

  function move() {
    const imgwidth = document.querySelector('#music-animation').clientWidth;
    if (!imgwidth || pos === imgwidth) {
      clearInterval(loc);
    } else {
      pos++;
      bar.style.left = pos + 'px';
    }
  }
}

function resetAll() {
  const musicsheet = document.querySelector('#music-sheets');
  while (musicsheet.firstChild) {
    musicsheet.removeChild(musicsheet.firstChild);
  }

  const newbar = document.createElement('div');
  newbar.id = 'music-bar';
  musicsheet.append(newbar);
  jazz.stop();
}

function stop(jazz) {
  jazz.stop();
  const musicbar = document.querySelector('#music-bar');
  const pos = window.getComputedStyle(musicbar)
    .getPropertyValue('margin-left');
  const newbar = musicbar.cloneNode(true);
  musicbar.parentNode.replaceChild(newbar, musicbar);
  newbar.style.left = pos + 'px';
}

function showInstruments(userOptions) {
  const instr = userOptions.instruments;
  for (let i = 0; i < instr.length; i++) {
    const element = document.querySelector(`#inst-${i}`);
    element.innerHTML = instr[i];

    const choseninstr = document.querySelector(`#instrument-${i}`);
    choseninstr.value = instr[i];
  }
}

function showStates(randomizerOptions) {
  const states = randomizerOptions.states;
  const element = document.querySelector('#stateval');
  element.value = states;
}
