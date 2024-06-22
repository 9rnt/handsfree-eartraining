<template>
  <div class="center-container">
    <button class="leave-button" @click="stopAudio">Stop the exercise</button>
  </div>
</template>


<script>
export default {
  name: 'PlayIntervalIdentification',
  mounted() {
    this.playExercise(this.exercises);
  },
  props: {
    repetition: {
      type: Number,
      required: true
    },
    time: {
      type: Number,
      required: true
    },
    difficulty: {
      type: Number,
      required: true
    },
    intervals : {
      type: Array,
      required: true
    },
    startRange: {
      type: Number,
      required: true
    },
    endRange: {
      type: Number,
      required: true
    },
    superpose: {
      type: Boolean,
      required: true
    },
    descendant: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    semitones() {
      const semitones = {
        'P1':0,
        'm2':1,
        'M2':2,
        'm3':3,
        'M3':4,
        'P4':5,
        'TT':6,
        'P5':7,
        'm6':8,
        'M6':9,
        'm7':10,
        'M7':11,
        'P8':12
      };
      return this.intervals.map(interval => semitones[interval]);
    },
    notesRange() {
      return this.notes.slice(this.startRange, this.endRange);
    },
    numberofExercises() {
      let set_time=0;
      if (this.superpose) {
        set_time = 3.5;
      } else {
        set_time = 6;
      }
      const exerciseDuration = set_time * (this.repetition+1) + 2.5 ; // each repetition lasts 6 seconds a 2.5 seconds for response + break
      return Math.floor(this.time * 60 / exerciseDuration);
    },
    exercises() {
      let result = [];
      for (let i = 0; i < this.numberofExercises; i++) {
        result.push({
          "baseNote":Math.floor(Math.random() * this.notesRange.length),
          "semitonesN":this.semitones[Math.floor(Math.random() * this.semitones.length)],
      });
      }
      return result;
    },
    delay() {
      if (this.superpose) {
        return 0
      } else {
        return 1000
      }
    },
  },
  data() {
    return {
      notes : ['C1', 'Db1', 'D1', 'Eb1', 'E1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'B1', 'C2', 'Db2', 'D2', 'Eb2', 'E2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'B2', 'C3', 'Db3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5', 'C6', 'Db6', 'D6', 'Eb6', 'E6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'B6', 'C7', 'Db7', 'D7', 'Eb7', 'E7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'B7', 'C8'],
      currentAudio: null,
      currentAudios: [],
      isPlaying: false,
    }
  },
  methods: {
    async playAudio(src) {
      return new Promise((resolve, reject) => {
        if (!this.isPlaying) {
          resolve();
          return;
        }

        const audio = new Audio(src);
        audio.addEventListener('ended', resolve);
        audio.addEventListener('error', reject);

        if (audio === null) {
          reject();
        } else {
          audio.play();
          this.currentAudios.push(audio);
        }
      });
    },
    textToSpeech(text) {
      if (!this.isPlaying) {
        return;
      }

      const synth = window.speechSynthesis;
      let voices = synth.getVoices();
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices[14];
      synth.speak(utterance);
    },
    stopAudio() {
      this.isPlaying = false;
      window.speechSynthesis.cancel();
      this.currentAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      this.currentAudios = [];
      this.$emit('update-launch-child', false);
    },
    async playExercise(exercise) {
      this.isPlaying = true;
      const intervals_names=[
        'Unison', 
        'Minor Second', 
        'Major Second', 
        'Minor Third', 
        'Major Third', 
        'Perfect Fourth', 
        'Tritone', 
        'Perfect Fifth', 
        'Minor Sixth', 
        'Major Sixth', 
        'Minor Seventh', 
        'Major Seventh', 
        'Octave'
    ]
      const audioContext = require.context('@/assets/keys/', false, /\.mp3$/);
      
      await this.textToSpeech('Starting the exercise');
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second pause before response

      for (let i = 0; i < exercise.length; i++) {
        let baseNote = exercise[i].baseNote;
        let semitones = exercise[i].semitonesN;

        let baseNoteFile = "";
        let intervalNoteFile = "";
        if (this.startRange + baseNote + semitones > this.notes.length) { // avoid notes out of piano range
          baseNoteFile = this.notes[this.startRange + baseNote - 12] + '.mp3'; // base note from the range of selected notes
          intervalNoteFile = this.notes[this.startRange + baseNote + semitones - 12] + '.mp3';
        } else {
          baseNoteFile = this.notes[this.startRange + baseNote] + '.mp3'; // base note from the range of selected notes
          intervalNoteFile = this.notes[this.startRange + baseNote + semitones] + '.mp3';
        }
        for (let j = 0; j < this.repetition +1 ; j++) {      
          if (this.superpose) {
            await Promise.all([
              this.playAudio(audioContext('./' + baseNoteFile)),
              this.playAudio(audioContext('./' + intervalNoteFile))
            ]);
          } else if (this.descendant) {
            await this.playAudio(audioContext('./' + intervalNoteFile));
            await this.playAudio(audioContext('./' + baseNoteFile));
          } else {
            await this.playAudio(audioContext('./' + baseNoteFile));
            await this.playAudio(audioContext('./' + intervalNoteFile));
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before repetition
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before response
        await this.textToSpeech(intervals_names[semitones]);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second pause after response
      }
    }
  },
  beforeUnmount(){
    this.stopAudio();
  },
  updated(){
    this.stopAudio();
  }
}
</script>

<style scoped>
.leave-button {
  margin: 10px 3px;
  padding: 20px;
  background-color: #5a1818;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;
  font-size:large
}
</style>