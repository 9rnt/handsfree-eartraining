<template>
  <div class="center-container">
    <button class="leave-button" @click="stopAudio">Leave the exercise</button>
  </div>
</template>


<script>
export default {
  name: 'PlayProgressionIdentification',
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
    progressions: {
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
      chorNames:{
        'I':'Tonic',
        'ii':'Supertonic',
        'iii':'Mediant',
        'IV':'Subdominant',
        'V':'Dominant',
        'vi':'Submediant',
        'vii':'Leading Tone'},
      currentAudio: null,
      currentAudios: [],
      isPlaying: false,
      notesNames:{
        'C':'C',
        'Db':'D Flat',
        'D':'D',
        'Eb':'E Flat',
        'E':'E',
        'F':'F',
        'Gb':'G Flat',
        'G':'G',
        'Ab':'A Flat',
        'A':'A',
        'Bb':'B Flat',
        'B':'B'
      }
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
    async getVoicesAsync() {
      const synth = window.speechSynthesis;
      return new Promise((resolve) => {
        let voices = synth.getVoices();
        if (voices.length > 0) {
          resolve(voices);
        } else {
          synth.onvoiceschanged = () => {
            voices = synth.getVoices();
            resolve(voices);
          };
        }
      });
    },
    async textToSpeech(text) {
      if (!this.isPlaying) {
        return;
      }

      const synth = window.speechSynthesis;
      const voices = await this.getVoicesAsync();
      let utterance = new SpeechSynthesisUtterance(text);

      // Attempt to find a male voice with a preference for en-GB locale
      const maleVoice = voices.find(voice => voice.lang.startsWith('en-GB'));// Use pop() to get the last voice in the filtered array
      
      if (maleVoice) {
        utterance.voice = maleVoice;
      } else {
        // Fallback to any es-US voice if no male voice is found
        const fallbackVoice = voices.find(voice => voice.lang.startsWith('es-US'));
        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
        }
      }

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
    get_chord(chord,noteIndex,color){
      let mode_intervals=[]
      if(color=='Major'){
        mode_intervals=[2,4,5,7,9,11,12]
      } else {
        mode_intervals=[2,3,5,7,8,11,12]
        // 0 // 1 2 3 4 5 6 7
        // C // D E F G A B C
      }
      let notesToPlay=[]
      if(chord==="I"){
        notesToPlay=[noteIndex,noteIndex+mode_intervals[1],noteIndex+mode_intervals[4]]
      } else if (chord==="ii"){
        notesToPlay=[noteIndex+mode_intervals[2],noteIndex+mode_intervals[5],noteIndex+mode_intervals[1]]
      } else if (chord==="iii"){
        notesToPlay=[noteIndex+mode_intervals[4],noteIndex+mode_intervals[1],noteIndex+mode_intervals[5]]
      } else if (chord==="IV"){
        notesToPlay=[noteIndex+mode_intervals[5],noteIndex+mode_intervals[1],noteIndex+mode_intervals[4]]
      } else if (chord==="V"){
        notesToPlay=[noteIndex+mode_intervals[1],noteIndex+mode_intervals[4],noteIndex+mode_intervals[6]]
      } else if (chord==="vi"){
        notesToPlay=[noteIndex+mode_intervals[4],noteIndex+mode_intervals[6],noteIndex+mode_intervals[2]]
      } else if (chord==="vii"){
        notesToPlay=[noteIndex+mode_intervals[6],noteIndex+mode_intervals[2],noteIndex+mode_intervals[5]]
      }
      let notesFiles=[]
      
      notesFiles.push(this.notes[notesToPlay[0]] + '.mp3');
      notesFiles.push(this.notes[notesToPlay[1]] + '.mp3');
      notesFiles.push(this.notes[notesToPlay[2]] + '.mp3');
      return notesFiles
    },
    async playExercise() {
      this.isPlaying = true;
      const progressions_mapping={
        'Common Cadences':['Perfect','Imperfect','Plagal','Deceptive'], 
        '3 Chords Diatonic Progressions': [['I', 'IV', 'V'], ['ii', 'V', 'I'], ['IV', 'V', 'I'], ['I', 'V', 'IV'], ['I', 'vi', 'IV'], ['vi', 'IV', 'I'], ['I', 'ii', 'V'], ['vi', 'ii', 'V'], ['I', 'vi', 'ii'], ['ii', 'IV', 'V']],
        '4 Chords Diatonic Progressions': [['I', 'IV', 'V', 'vi'], ['ii', 'V', 'I', 'IV'], ['IV', 'V', 'I', 'vi'], ['I', 'vi', 'IV', 'V'], ['vi', 'IV', 'I', 'V'], ['I', 'V', 'vi', 'IV'], ['ii', 'IV', 'I', 'V'], ['I', 'II', 'V', 'I']]
      }

      const audioContext = require.context('@/assets/keys/', false, /\.mp3$/);
      
      await this.textToSpeech('Starting the exercise');
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second pause before response

      for (let i = 0; i < this.numberofExercises; i++) {
        let baseNote = this.baseNotes[Math.floor(Math.random() * this.baseNotes.length)];
        let noteName=this.notesNames[baseNote]
        baseNote=baseNote+'3'
        
        let baseNoteIndex=this.notes.indexOf(baseNote);
        let progression = this.progressions[Math.floor(Math.random() * this.progressions.length)];
        let progressionName=progression
        
        progression = progressions_mapping[progression][Math.floor(Math.random() * progressions_mapping[progression].length)];

        let colors=['Major','Minor']
        let color=colors[Math.floor(Math.random() * colors.length)];
        if(progression==='Perfect'){
          let notesFilesV=this.get_chord('V',baseNoteIndex,color)
          let notesFilesI=this.get_chord('I',baseNoteIndex,color)
          for (let j = 0; j < this.repetition +1 ; j++) {      
            await Promise.all([
              this.playAudio(audioContext('./' + notesFilesV[0])),
              this.playAudio(audioContext('./' + notesFilesV[1])),
              this.playAudio(audioContext('./' + notesFilesV[2]))
            ]);
            await Promise.all([
              this.playAudio(audioContext('./' + notesFilesI[0])),
              this.playAudio(audioContext('./' + notesFilesI[1])),
              this.playAudio(audioContext('./' + notesFilesI[2]))
            ]);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause between repetition
          }
        } else if (progression==='Imperfect'){
          let starting_chords=['I','ii','IV','vi']
          let starting_chord=starting_chords[Math.floor(Math.random() * starting_chords.length)];
          let notesFilesI=this.get_chord(starting_chord,baseNoteIndex,color)
          let notesFilesV=this.get_chord('V',baseNoteIndex,color)
          for (let j = 0; j < this.repetition +1 ; j++) {      
            await Promise.all([
              this.playAudio(audioContext('./' + notesFilesI[0])),
              this.playAudio(audioContext('./' + notesFilesI[1])),
              this.playAudio(audioContext('./' + notesFilesI[2]))
            ]);
            await Promise.all([
              this.playAudio(audioContext('./' + notesFilesV[0])),
              this.playAudio(audioContext('./' + notesFilesV[1])),
              this.playAudio(audioContext('./' + notesFilesV[2]))
            ]);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause between repetition
          }
        } else if (progression==='Plagal'){
          let notesFilesIV=this.get_chord('IV',baseNoteIndex,color)
          let notesFilesI=this.get_chord('I',baseNoteIndex,color)
          for (let j = 0; j < this.repetition +1 ; j++) {      
            await Promise.all([
              this.playAudio(audioContext('./' + notesFilesIV[0])),
              this.playAudio(audioContext('./' + notesFilesIV[1])),
              this.playAudio(audioContext('./' + notesFilesIV[2]))
            ]);
            await Promise.all([
              this.playAudio(audioContext('./' + notesFilesI[0])),
              this.playAudio(audioContext('./' + notesFilesI[1])),
              this.playAudio(audioContext('./' + notesFilesI[2]))
            ]);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause between repetition
          }
        } else if (progression==='Deceptive'){
          let notesFilesV=this.get_chord('V',baseNoteIndex,color)
          let endingChords=['ii','iii','IV','vi']
          let endingChord=endingChords[Math.floor(Math.random() * endingChords.length)];
          let notesFilesI=this.get_chord(endingChord,baseNoteIndex,color)
          for (let j = 0; j < this.repetition +1 ; j++) {      
            await Promise.all([
              this.playAudio(audioContext('./' + notesFilesV[0])),
              this.playAudio(audioContext('./' + notesFilesV[1])),
              this.playAudio(audioContext('./' + notesFilesV[2]))
            ]);
            await Promise.all([
              this.playAudio(audioContext('./' + notesFilesI[0])),
              this.playAudio(audioContext('./' + notesFilesI[1])),
              this.playAudio(audioContext('./' + notesFilesI[2]))
            ]);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause between repetition
          }
        } else {
          for (let j = 0; j < this.repetition +1 ; j++) { 
            for (let j = 0; j < progression.length; j++) {
              let notesFiles=this.get_chord(progression[j],baseNoteIndex,color);
              await Promise.all([
                this.playAudio(audioContext('./' + notesFiles[0])),
                this.playAudio(audioContext('./' + notesFiles[1])),
                this.playAudio(audioContext('./' + notesFiles[2]))
              ]);
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before repetition
          }
        }
        if(progressionName==='Common Cadences'){
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before response
          await this.textToSpeech(progression + ' cadence in ' + noteName + ' ' + color);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second pause after response
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause before response
          for (let j = 0; j < progression.length; j++) {
            await this.textToSpeech(this.chorNames[progression[j]]);
          await new Promise(resolve => setTimeout(resolve, 1000)); // 0.5 second pause after each chord
          }
          await this.textToSpeech('. In ' + noteName + ' ' + color);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second pause after response
        }
        
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