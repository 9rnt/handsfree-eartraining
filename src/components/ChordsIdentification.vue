<template>
  <h1>Chords Identification</h1>

  <div class="config-block">
    <div class="description">
      <h3>Exercise Configuration</h3>
      <p>Train your ear to correctly name musical chords. You can configure which chords to include, base notes, ascendant, descendant or harmonic chords as well as inverted chords to suit your training
        objectives. You can also configure number of repetitions per set and the duration of the exercise</p>
      <p>The exercise will start when you click the launch button. Answers will be played at the end of each set</p>
    </div>
    <div class="config-sections">
      <!-- chord selection -->
      <fieldset class="config-choice">
        <legend>Chords</legend>
        <div class="checkbox-wrapper">
          <label class="checkbox-container">All
            <input type="checkbox" v-model="isChecked_chords" />
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="checkbox-wrapper" v-for="(chord, index) in chords" :key="index">
          <label class="checkbox-container" :for="chord"> {{ chord }}
            <input type="checkbox" :id="chord" :value="chord" v-model="selectedChords">
            <span class="checkmark"></span>
          </label>
        </div>
      </fieldset>

      <!-- base note selection -->
      <fieldset class="config-choice">
        <legend>Base notes</legend>
        <div class="checkbox-wrapper">
          <label class="checkbox-container">All
            <input type="checkbox" v-model="isChecked_base_note" />
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="checkbox-wrapper" v-for="(baseNote, index) in base_notes" :key="index">
          <label class="checkbox-container" :for="baseNote"> {{ baseNote }}
            <input type="checkbox" :id="baseNote" :value="baseNote" v-model="selectedBaseNotes">
            <span class="checkmark"></span>
          </label>
        </div>
      </fieldset>

      <!-- repetition selection -->
      <fieldset class="config-choice">
        <legend>Repetitions for each chord</legend>
        <button class="increment" @click="decrement_repetition">-</button>
        <input type="number" id="repetition" v-model.number="repetition" min="0" max="5">
        <button class="increment" @click="increment_repetition">+</button>
      </fieldset>

      <!-- time selection -->
      <fieldset class="config-choice">
        <legend>Exercise time</legend>
        <button class="increment" @click="decrement_time">-</button>
        <input type="number" id="time" v-model.number="time" min="1" max="240">
        <button class="increment" @click="increment_time">+</button>
      </fieldset>

      <!-- Addition config selection -->
      <fieldset class="config-choice">
        <legend>Additional configuration</legend>
        <div class="checkbox-wrapper">
          <label class="checkbox-container">Descendant scale
            <input type="checkbox" id="descendant" v-model="descendant" />
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="checkbox-wrapper">
          <label class="checkbox-container">Harmonic
            <input type="checkbox" id="harmonic" v-model="harmonic" />
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="checkbox-wrapper">
          <button class="increment" @click="decrement_inverted">-</button>
          <div class="inversion-wrapper">
            <p>{{ this.inversion_mapping[inverted] }}</p>
          </div>
          <button class="increment" @click="increment_inverted">+</button>
        </div>
        <div class="checkbox-wrapper">
          <label class="checkbox-container">All octaves
            <input type="checkbox" id="octaves" v-model="octaves" />
            <span class="checkmark"></span>
          </label>
        </div>
      </fieldset>


    </div>
  </div>

  <div class="center-container">
    <button class="launch-button" v-if="!launchChild" @click="launchChordIdentification">Launch</button>
  </div>

  <PlayChordIdentification v-if="launchChild" @update-launch-child="updateLaunchChild" :chords="this.selectedChords"
    :baseNotes="this.selectedBaseNotes" :repetition="this.repetition" :time="this.time" :octaves="this.octaves"
    :descendant="this.descendant" :harmonic="this.harmonic" :inverted="this.inverted"/>
</template>

<script>
import PlayChordIdentification from './PlayChordIdentification.vue'

export default {
  name: 'ChordExercises',
  data() {
    return {
      errorMessage: '',
      chords: ['Major', 'mi', 'dim', 'aug', 'sus2', 'sus4', '7', 'maj7','mi7','Minor Major 7','dim7','Sub diminished 7','aug7','Major augmented 7','Major diminished 7','7sus4'],
      selectedChords: [],
      selectedBaseNotes: [],
      base_notes: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
      repetition: 0,
      time: 5,
      launchChild: false,
      isChecked_chords: false,
      isChecked_base_note: false,
      descendant: false,
      octaves: false,
      harmonic: false,
      inverted: 0,
      inversion_mapping:['No inversion','First inversion','Second inversion','Third inversion']
    }
  },
  watch: {
    isChecked_chords(newVal) {
      if (newVal) {
        this.checkAll_chords();
      } else {
        this.uncheckAll_chords();
      }
    },
    isChecked_base_note(newVal) {
      if (newVal) {
        this.checkAll_base_notes();
      } else {
        this.uncheckAll_base_notes();
      }
    }
  },

  methods: {
    checkAll_chords() {
      this.selectedChords = this.chords.slice();
    },
    uncheckAll_chords() {
      this.selectedChords = [];
    },
    checkAll_base_notes() {
      this.selectedBaseNotes = this.base_notes.slice();
    },
    uncheckAll_base_notes() {
      this.selectedBaseNotes = [];
    },
    increment_time() {
      if (this.time < 240) {
        this.time++;
      }
    },
    decrement_time() {
      if (this.time > 1) {
        this.time--;
      }
    },
    increment_inverted() {
      if (this.inverted < 3) {
        this.inverted++;
      }
    },
    decrement_inverted() {
      if (this.inverted > 0) {
        this.inverted--;
      }
    },
    increment_repetition() {
      if (this.repetition < 10) {
        this.repetition++;
      }
    },
    decrement_repetition() {
      if (this.repetition > 0) {
        this.repetition--;
      }
    },
    updateLaunchChild(newValue) {
      this.launchChild = newValue;
    },
    launchChordIdentification() {
      if (!this.selectedChords.length) {
        this.errorMessage = 'You should select at least one chord.';
        window.alert(this.errorMessage);
      } else if (!this.selectedBaseNotes.length) {
        this.errorMessage = 'You should select at least one base note.';
        window.alert(this.errorMessage);
      } else if (this.harmonic&&this.descendant) {
        this.errorMessage = 'You cannot play harmonic and descedant chords at the same time.';
        window.alert(this.errorMessage);
      } else {
        this.launchChild = true;
      }
    }
  },
  components: {
    PlayChordIdentification
  }
}
</script>

<style scoped>
h1 {
  font-size: 2em;
  margin: 0.67em 0;
  margin-bottom: 7px;
}

.config-choice {
  margin: 20px 3px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ccc;
}


.checkbox-wrapper {
  margin: 0.4vh;
  margin-top:0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.inversion-wrapper {
  border: 1px solid #000;
  padding: 10px;
  text-align: center;
}

.inversion-wrapper p {
  margin: 0;
}

.checkbox-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: large;
  text-align: left;
  border: 1px solid #000000;
  border-radius: 2px;
  box-sizing: border-box;
  padding: 1vh;
}

legend {
  background-color: black;
  color: white;
  margin: 10px;
  padding: 3px;
  border-radius: 3px;
}

/* Hide the browser's default checkbox */
.checkbox-container input {
  position: relative;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #eeeeee15;
}

/* On mouse-over, add a grey background color */
.checkbox-container:hover input~.checkmark {
  background-color: #f3f2f269;
}

/* When the checkbox is checked, add a blue background */
.checkbox-container input:checked~.checkmark {
  background-color: #0e0e0e2d;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-container input:checked~.checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.wrapper {
  position: relative;
  width: 80%;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100px;
  margin-top: 10px;
  background-image: url('~@/assets/pianotiles.png');
  background-size: 100%;
  opacity: .7;
  background-position: center;
}

input[type="range"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  outline: none;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  background-color: transparent;
  pointer-events: none;
}

.slider-track {
  width: 100%;
  height: 2px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  border-radius: 5px;
  background-color: rgb(148, 148, 148);
}

input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  height: 5px;
}

input[type="range"]::-moz-range-track {
  -moz-appearance: none;
  height: 5px;
}

input[type="range"]::-ms-track {
  appearance: none;
  height: 5px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 2vh;
  width: 2vh;
  background-color: #ffffff;
  cursor: pointer;
  margin-top: -9px;
  pointer-events: auto;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  -webkit-appearance: none;
  height: 2vh;
  width: 2vh;
  cursor: pointer;
  border-radius: 50%;
  pointer-events: auto;
  border: 2px solid #000000;
}

input[type="range"]:active::-webkit-slider-thumb {
  background-color: #ffffff;
  border: 1px solid #000000;
}

.values {
  background-color: #000000;
  width: 32%;
  position: relative;
  margin: auto;
  padding: 10px 0;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
  font-size: large;
  color: #ffffff;
  height: 20%;
}

.values:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  border-top: 15px solid #000000;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  margin: auto;
  bottom: -14px;
  left: 0;
  right: 0;
}

.description {
  color: #797979;
  font-size: small;
  font-style: italic;
}

.center-container {
  display: flex;
  justify-content: center;
}

.launch-button {
  margin: 10px 3px;
  padding: 20px;
  background-color: #1d4821;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;
  font-size: large
}

.increment {
  background-color: #000000;
  color: white;
  border: none;
  width: 5vh;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.increment:hover {
  background-color: #0056b3;
}

input[type="number"] {
  width: 60px;
  padding: 10px;
  border: 1px solid #000000;
  font-size: 16px;
  text-align: center;
  outline: none;
  transition: border-color 0.3s ease;
}

input[type="number"]:focus {
  border-color: #414141;
}

/* Remove input number arrows */
/* For Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>