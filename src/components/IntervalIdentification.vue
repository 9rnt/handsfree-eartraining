<template>
  <h1>Intervals Identification</h1>

  <div class="config-block">
    <div class="description">
      <h3>Exercise Configuration</h3>
      <p>Train your ear to correctly name musical intervals. You can configure which intervals to include, notes range, epetition per set, exercise time as well as if the notes will be played superposed or not to suit your training
        objectives</p>
      <p>The exercise will start when you click the launch button. Answers will be played at the end of each set.</p>
    </div>
    <div class="config-sections">
      <!-- interval selection -->
      <fieldset class="config-choice">
        <legend>Intervals</legend>
        <div class="checkbox-wrapper">
          <label class="checkbox-container">All
            <input type="checkbox" v-model="isChecked" />
            <span class="checkmark"></span>
          </label>
        </div>

        <div class="checkbox-wrapper" v-for="(interval, index) in intervals" :key="index">
          <label class="checkbox-container" :for="interval"> {{ interval }}
            <input type="checkbox" :id="interval" :value="interval" v-model="selectedIntervals">
            <span class="checkmark"></span>
          </label>
        </div>
      </fieldset>

      <!-- range selection -->
      <fieldset class="config-choice">
        <legend>Notes Range</legend>
        <div class="wrapper">
          <div class="values">
            <span id="range1">
              {{ notes[startRange] }}
            </span>
            <span> &dash; </span>
            <span id="range2">
              {{ notes[endRange] }}
            </span>
          </div>
          <div class="slider-container">
            <div class="slider-track"></div>
            <input type="range" id="startRange" v-model.number="startRange" :min="0" :max="notes.length - 2"
              @input="startRangeControl">
            <input type="range" id="endRange" v-model.number="endRange" :min="0" :max="notes.length - 1"
              @input="endRangeControl">
          </div>
        </div>
      </fieldset>

      <!-- repetition selection -->
      <fieldset class="config-choice">
        <legend>Repetitions for each interval</legend>
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
          <label class="checkbox-container">Superpose notes
            <input type="checkbox" id="superpose" v-model="superpose"/>
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="checkbox-wrapper">
          <label class="checkbox-container">Descendant notes
            <input type="checkbox" id="descendant" v-model="descendant"/>
            <span class="checkmark"></span>
          </label>
        </div>
      </fieldset>
    </div>
  </div>
  <div class="center-container">
    <button class="launch-button" v-if="!launchChild" @click="launchIntervalIdentification">Launch</button>
  </div>
  <PlayIntervalIdentification v-if="launchChild" @update-launch-child="updateLaunchChild"
    :intervals="this.selectedIntervals" :startRange="this.startRange" :endRange="this.endRange"
    :repetition="this.repetition" :time="this.time" :difficulty="this.difficulty" :superpose="this.superpose" :descendant="this.descendant" />
</template>

<script>
import PlayIntervalIdentification from './PlayIntervalIdentification.vue'

export default {
  name: 'IntervalExercises',
  data() {
    return {
      startRange: 0,
      endRange: 84,
      errorMessage: '',
      intervals: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'],
      selectedIntervals: [],
      showIntervals: false,
      showRangeConfig: false,
      notes: ['C1', 'Db1', 'D1', 'Eb1', 'E1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'B1', 'C2', 'Db2', 'D2', 'Eb2', 'E2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'B2', 'C3', 'Db3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5', 'C6', 'Db6', 'D6', 'Eb6', 'E6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'B6', 'C7', 'Db7', 'D7', 'Eb7', 'E7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'B7', 'C8'],
      repetition: 0,
      time: 5,
      difficulty: 1,
      canStart: false,
      launchChild: false,
      isChecked: false,
      superpose: false,
      descendant: false,
    }
  },
  watch: {
    isChecked(newVal) {
      if (newVal) {
        this.checkAll();
      } else {
        this.uncheckAll();
      }
    },
  },

  methods: {
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
    increment_repetition() {
      if (this.repetition < 10) {
        this.repetition++;
      }
    },
    decrement_repetition() {
      if (this.repetition > 1) {
        this.repetition--;
      }
    },
    startRangeControl() {
      if (this.startRange >= this.endRange) {
        this.startRange = this.endRange - 1;
      }
    },
    endRangeControl() {
      if (this.startRange >= this.endRange) {
        this.endRange = this.startRange + 1;
      }
    },
    updateLaunchChild(newValue) {
      this.launchChild = newValue;
    },
    checkAll() {
      this.selectedIntervals = this.intervals.slice();
    },
    uncheckAll() {
      this.selectedIntervals = [];
    },
    launchIntervalIdentification() {
      const semitones = {
        'P1': 0,
        'm2': 1,
        'M2': 2,
        'm3': 3,
        'M3': 4,
        'P4': 5,
        'TT': 6,
        'P5': 7,
        'm6': 8,
        'M6': 9,
        'm7': 10,
        'M7': 11,
        'P8': 12
      };
      if (!this.selectedIntervals.length) {
        this.errorMessage = 'You should select at least one interval size.';
        window.alert(this.errorMessage);
      } else if ((this.endRange - this.startRange) < semitones[this.selectedIntervals[this.selectedIntervals.length - 1]]) {
        this.errorMessage = 'The selected range is too small for the selected interval.';
        window.alert(this.errorMessage);
      } else {
        this.launchChild = true;
      }
    }
  },
  components: {
    PlayIntervalIdentification
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
  background-color: #f3f2f276;
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