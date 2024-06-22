import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import IntervalIdentification from './components/IntervalIdentification.vue'
import ModeIdentification from './components/ModeIdentification.vue'
import ChordsIdentification from './components/ChordsIdentification.vue'
import ProgressionsIdentification from './components/ProgressionsIdentification.vue'
import PlayIntervalIdentification from './components/PlayIntervalIdentification.vue'
import PlayModeIdentification from './components/PlayModeIdentification.vue'
import PlayChordIdentification from './components/PlayChordIdentification.vue'
import ContactMe from './components/ContactMe.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld
    },
    {
      path: '/interval-identification',
      name: 'IntervalIdentification',
      component: IntervalIdentification
    },
    {
      path: '/interval-identification-start',
      name: 'PlayIntervalIdentification',
      component: PlayIntervalIdentification
    },
    {
      path: '/mode-identification',
      name: 'ModeIdentification',
      component: ModeIdentification
    },
    {
      path: '/mode-identification-start',
      name: 'PlayModeIdentification',
      component: PlayModeIdentification
    },
    {
      path: '/chords-identification',
      name: 'ChordsIdentification',
      component: ChordsIdentification
    },
    {
      path: '/chord-identification-start',
      name: 'PlayChordsIdentification',
      component: PlayChordIdentification
    },
    {
      path: '/progressions-identification',
      name: 'ProgressionsIdentification',
      component: ProgressionsIdentification
    },
    {
      path: '/contact-me',
      name: 'ContactMe',
      component: ContactMe
    },
  ]
})

export default router