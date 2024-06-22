<template>
  <div class="center-container">
    <button class="leave-button" @click="stopAudio">Leave the exercise</button>
  </div>
</template>


<script>
export default {
  name: 'PlayModeIdentification',
  mounted() {
    this.playExercise();
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
    octaves: {
      type: Boolean,
      required: true
    },
    descendant: {
      type: Boolean,
      required: true
    },
    modes: {
      type: Array,
      required: true
    },
    baseNotes:{
      type: Array,
      required: true
    },
  },
  computed: {
    numberofExercises() {
      const exerciseDuration = 20 * (this.repetition+1) + 2.5 ; // each repetition lasts 20 seconds a 2.5 seconds for response + break
      return Math.floor(this.time * 60 / exerciseDuration);
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
    async playExercise() {
      this.isPlaying = true;
      const modes_mapping={
        'Ionian':[2,2,1,2,2,2,1], 
        'Dorian':[2,1,2,2,2,1,2], 
        'Phrygian':[1,2,2,2,1,2,2], 
        'Lydian':[2,2,2,1,2,2,1], 
        'Mixolydian':[2,2,1,2,2,1,2], 
        'Aeolian':[2,1,2,2,1,2,2],
        'Locrian':[1,2,2,1,2,2,2]
      }
      const modes_abr={
        'I':'Ionian',
        'ii':'Dorian',
        'iii':'Phrygian',
        'IV':'Lydian',
        'V':'Mixolydian',
        'vi':'Aeolian',
        'vii':'Locrian' 
      }
      const audioContext = require.context('@/assets/keys/', false, /\.mp3$/);
      
      await this.textToSpeech('Starting the exercise');
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second pause before response

      for (let i = 0; i < this.numberofExercises; i++) {
        let baseNote = this.baseNotes[Math.floor(Math.random() * this.baseNotes.length)];
        if (this.octaves) {
          baseNote += Math.floor(Math.random() * 6)+1;
        }
        else {
          baseNote += 3;
        }
        let baseNoteIndex=this.notes.indexOf(baseNote);
        let mode_abr = this.modes[Math.floor(Math.random() * this.modes.length)];
        let mode= modes_abr[mode_abr];
        let mode_intervals = modes_mapping[mode];
        let baseNoteFiles = []
        for (let l=0, j= baseNoteIndex; l < 8; l++) {
          baseNoteFiles.push(this.notes[j] + '.mp3');
          j+=mode_intervals[l];
        }
                
        for (let j = 0; j < this.repetition +1 ; j++) {      
          for (let k=0; k<8;k++){
            if (this.descendant){
              let o=7-k;
              await this.playAudio(audioContext('./' + baseNoteFiles[o]));
            } else 
            {
              await this.playAudio(audioContext('./' + baseNoteFiles[k]));
            }
            
          }          
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before repetition
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before response
        await this.textToSpeech(mode);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second pause after response
      }
    },
  beforeUnmount(){
    this.stopAudio();
  },
  updated(){
    this.stopAudio();
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