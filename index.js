import Jazz, {NoteTranslator} from "./jazz";
import UTM from "./utm";

const TOTAL_BARS = 8;
const MAXSTATES = 17;
const MINSTATES = 1;
document.addEventListener('DOMContentLoaded', () => {

  const gobutton = document.querySelector("#begin-button");
  gobutton.addEventListener('click', () => {
    //have utm play 
    const userOptions = getUserOptions();
    const tape = makeTape(); //empty tape 4x8 
    const utm = new UTM(tape, 20, userOptions.states);
    const jazz = new Jazz(userOptions.instruments); 
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
    jazz.play(freqs);
    moveBar();
    
    const reset = document.querySelector("#reset-button");
    reset.addEventListener('click', () => {
      jazz.stop();
      removeImage(staff);
    });

  });

  const randomizebutton = document.querySelector("#random-button");
  randomizebutton.addEventListener('click', () => {
  //have utm play with randomized instruments and states

  const randomizerOptions = getRandomizerOptions();
  const tape = makeTape(); //empty tape 4x8 
  const utm = new UTM(tape, 20, randomizerOptions.states);
  const jazz = new Jazz(randomizerOptions.instruments); 
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
  jazz.play(freqs);
  moveBar();

  const reset = document.querySelector("#reset-button");
    reset.addEventListener('click', () => {
      jazz.stop();
      removeImage(staff);
    });
  });

});


function getUserOptions() {
  const userOptions = {
    instruments: [], 
    states: 4,
  };
  userOptions.states = parseInt(document.querySelector("#stateval").value);
  console.log(userOptions)

  for (let i = 0; i < 4; i++) {
    userOptions.instruments.push(document.querySelector(`#instrument-${i}`).value);
  }

  return userOptions;
}

function getRandomizerOptions() {
  const randomizerOptions = {
    instruments: [], 
    states: 4,
  };
  randomizerOptions.states = Math.floor(Math.random() * MAXSTATES) + MINSTATES;
  console.log(randomizerOptions)

  var instrumentsoptions = ["chiptune","brass","bass","organ"];
  for (let i = 0; i < 4; i++) {
    var index = Math.floor(Math.random() * instrumentsoptions.length);
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
  var musicsheet = document.getElementById("music-sheets")

  //for each row in the staff (each instrument) create an image of a staff
  for (let y = 0; y < staff.length; y++){
   var notesheet = document.createElement("div");
   notesheet.id ="music-animation";
   musicsheet.appendChild(notesheet);
   var divider = document.createElement("div");
   divider.id ="sheet-divider";
   musicsheet.appendChild(divider);
   
   var notexvalue = 10; 
   var noteyvalue = 10; 
   //for each note for each instrument staff, create a new note and place on img
    for (let x = 0; x < staff[y].length; x++) {
      var newnote = document.createElement("div");
      newnote.id = "music-notes";
      notesheet.appendChild(newnote);

      if (staff[y][x] == 0) {
        newnote.style.bottom = noteyvalue;
        newnote.style.left = notexvalue;
        notexvalue += 10;
      } else {
        var notevalue = staff[y][x] % 8;
        newnote.style.bottom = (noteyvalue + 10*notevalue) + "px";
        notexvalue += 10;
        newnote.style.left = notexvalue + "px";

    }
  }
}
}

function removeImage(staff){
  var musicbar = document.getElementById("music-bar");
  var newbar = musicbar.cloneNode(true);
  musicbar.parentNode.replaceChild(newbar,musicbar);
  newbar.style.left = "0px";
  for (let y = 0; y < staff.length; y++){
    var musicsheet = document.getElementById("music-animation");
    musicsheet.parentNode.removeChild(musicsheet);
    var divider = document.getElementById("sheet-divider");
    divider.parentNode.removeChild(divider);
    }
  }

function moveBar(jazz, freqs){
  var bar = document.getElementById("music-bar");
  var pos = 0;
  var loc = setInterval(move,24);

  function move(){
    var imgwidth = document.getElementById("music-animation").clientWidth
    if (pos == imgwidth){
      clearInterval(loc);
    } else {
        pos++;
        bar.style.left = pos + "px";
    }
  }
}

