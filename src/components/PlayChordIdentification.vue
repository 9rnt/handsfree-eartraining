<template>
  <div class="center-container">
    <button class="leave-button" @click="stopAudio">Leave the exercise</button>
  </div>
</template>


<script>
export default {
  name: 'PlayChordIdentification',
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
    harmonic: {
      type: Boolean,
      required: true
    },
    inverted: {
      type: Number,
      required: true
    },
    descendant: {
      type: Boolean,
      required: true
    },
    chords: {
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
      let set_base=0;
      if(this.harmonic){
        set_base=1.5+1;
      } else {
        set_base=4.5+1;
      }
      const exerciseDuration = set_base * (this.repetition+1) + 2.5 ; // each repetition lasts 20 seconds a 2.5 seconds for response + break
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
      const chords_mapping={
        'Major':[4,3], 
        'mi':[3,4], 
        'dim':[3,3], 
        'aug':[4,4], 
        'sus2':[2,5], 
        'sus4':[5,2], 
        '7':[4,3,3], 
        'maj7':[4,3,4],
        'mi7':[3,4,3],
        'Minor Major 7':[3,4,4],
        'dim7':[3,3,3],
        'Sub diminished 7':[3,3,4],
        'aug7':[4,4,2],
        'Major augmented 7':[4,4,3],
        'Major diminished 7':[3,3,5],
        '7sus4':[2,5,3]
      }
      const chords_abr={
        'Major':'Major', 
        'mi':'Minor', 
        'dim':'Diminished', 
        'aug':'Augmented', 
        'sus2':'Sus 2', 
        'sus4':'Sus 4', 
        '7':'Dominant 7', 
        'maj7':'Major 7',
        'mi7':'Minor 7',
        'Minor Major 7':'Minor Major 7',
        'dim7':'Diminished 7',
        'Sub diminished 7':'Sub Diminished 7',
        'aug7':'Augmented 7',
        'Major augmented 7':'Major Augmented 7',
        'Major diminished 7':'Major diminished 7',
        '7sus4':'7 Sus 4'
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
        let chord = this.chords[Math.floor(Math.random() * this.chords.length)];
        let chord_abr= chords_abr[chord];
        let chord_intervals = chords_mapping[chord];
        let baseNoteFiles = []
        for (let l=0, j= baseNoteIndex; l < chord_intervals.length+1; l++) {
          baseNoteFiles.push(this.notes[j] + '.mp3');
          j+=chord_intervals[l];
        }
        if (this.inverted===1){
          for (let q=0;q<baseNoteFiles.length-1;q++){
            baseNoteFiles[q]=baseNoteFiles[q+1]
          }
          baseNoteFiles[baseNoteFiles.length-1]=this.notes[baseNoteIndex+12] + '.mp3'
        } else if (this.inverted===2){
          for (let q=0;q<baseNoteFiles.length-1;q++){
            baseNoteFiles[q]=baseNoteFiles[q+1]
          }
          baseNoteFiles[baseNoteFiles.length-1]=this.notes[baseNoteIndex+12] + '.mp3'
          for (let q=0;q<baseNoteFiles.length-1;q++){
            baseNoteFiles[q]=baseNoteFiles[q+1]
          }
          baseNoteFiles[baseNoteFiles.length-1]=this.notes[baseNoteIndex+12+chord_intervals[0]] + '.mp3'
        } else if (this.inverted===3&&chord_intervals.length>2){
          for (let q=0;q<baseNoteFiles.length-1;q++){
            baseNoteFiles[q]=baseNoteFiles[q+1]
          }
          baseNoteFiles[baseNoteFiles.length-1]=this.notes[baseNoteIndex+12] + '.mp3'
          for (let q=0;q<baseNoteFiles.length-1;q++){
            baseNoteFiles[q]=baseNoteFiles[q+1]
          }
          baseNoteFiles[baseNoteFiles.length-1]=this.notes[baseNoteIndex+12+chord_intervals[0]] + '.mp3'
          for (let q=0;q<baseNoteFiles.length-1;q++){
            baseNoteFiles[q]=baseNoteFiles[q+1]
          }
          baseNoteFiles[baseNoteFiles.length-1]=this.notes[baseNoteIndex+12+chord_intervals[0]+chord_intervals[1]] + '.mp3'
        }
        if (!this.harmonic) {
          for (let j = 0; j < this.repetition +1 ; j++) {      
            for (let k=0; k<chord_intervals.length+1;k++){
              if (this.descendant){
                let o=chord_intervals.length-k;
                await this.playAudio(audioContext('./' + baseNoteFiles[o]));
              } else 
              {
                await this.playAudio(audioContext('./' + baseNoteFiles[k]));
              }
              
            }          
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before repetition
          }
        } else {
          for (let j = 0; j < this.repetition +1 ; j++) {      
          if (baseNoteFiles.length===3){
            await Promise.all([
              this.playAudio(audioContext('./' + baseNoteFiles[0])),
              this.playAudio(audioContext('./' + baseNoteFiles[1])),
              this.playAudio(audioContext('./' + baseNoteFiles[2]))
            ]);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before response;
            } else if (baseNoteFiles.length===4){
              await Promise.all([
                this.playAudio(audioContext('./' + baseNoteFiles[0])),
                this.playAudio(audioContext('./' + baseNoteFiles[1])),
                this.playAudio(audioContext('./' + baseNoteFiles[2])),
                this.playAudio(audioContext('./' + baseNoteFiles[3])),
              ]);
              await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before response;
            } else if (baseNoteFiles.length===5){
              await Promise.all([
                this.playAudio(audioContext('./' + baseNoteFiles[0])),
                this.playAudio(audioContext('./' + baseNoteFiles[1])),
                this.playAudio(audioContext('./' + baseNoteFiles[2])),
                this.playAudio(audioContext('./' + baseNoteFiles[3])),
                this.playAudio(audioContext('./' + baseNoteFiles[4])),
              ]);
              await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before response;
            }
          }
        }   
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before response
        await this.textToSpeech(chord_abr);
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