<template>
  <div id="app">
    <header>
    </header>
    <div id="content">
      <router-view/>
    </div>
    <footer :class="{'scrolled-nav':scrolledPosition}">
      <div class="nav-container">
        <div class="brand">
          <router-link to="/">
            <img src="@/assets/logo.png" alt="Logo" class="logo">
          </router-link>
        </div>
        <div v-show="!mobile" class="navigation">
          <router-link class="footer-link" to="/interval-identification">Intervals</router-link>
          <router-link class="footer-link" to="/mode-identification">Modes</router-link>
          <router-link class="footer-link" to="/chords-identification">Chords</router-link>
          <router-link class="footer-link" to="/progressions-identification">Chords Progression</router-link>
          <router-link class="footer-link" to="/contact-me">Give feedback</router-link>
        </div>
        <div class="icon">
          <button @click="toggleMobile" v-show="mobile" :class="['transparent-button',{ 'icon-active': mobileNav }]">{{ notBurger }}</button>
        </div>
      </div>
    </footer>
    <transition name="mobile-nav">
      <ul v-show="mobileNav" class="dropdown-nav">
        <li class="nav"><router-link @click="mobileOff" class="footer-link" to="/">Home</router-link></li>
        <li class="nav"><router-link @click="mobileOff" class="footer-link" to="/interval-identification">Intervals</router-link></li>
        <li class="nav"><router-link @click="mobileOff" class="footer-link" to="/mode-identification">Modes</router-link></li>
        <li class="nav"><router-link @click="mobileOff" class="footer-link" to="/chords-identification">Chords</router-link></li>
        <li class="nav"><router-link @click="mobileOff" class="footer-link" to="/progressions-identification">Chords Progression</router-link></li>
        <li class="nav"><router-link @click="mobileOff" class="footer-link" to="/contact-me">Give feedback</router-link></li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      scrolledPosition: null,
      mobile: null,
      mobileNav: null,
      windowWidth: null,
      notBurger: '☰',
    }
  },
  created() {
    window.addEventListener('resize', this.checkScreen);
    this.checkScreen();
  },
  methods: {
    toggleMobile() {
      this.mobileNav = !this.mobileNav;
      this.notBurger = this.mobileNav ? '✖' : '☰';
    },
    mobileOff() {
      this.mobileNav = false;
      this.notBurger = this.mobileNav ? '✖' : '☰';
    },
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 750) {
        this.mobile = true;
        return;
      } else {
        this.mobile = false;
        this.mobileNav = false;
        return
      }
    }
  },
}
</script>

<style>
header {
  display: flex;
  justify-content: space-around;
  border-color: black;
  height: 1vh;
  border-bottom: 1px solid;
  width: 100%;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}
body {
  font-family: 'Poppins', sans-serif;
  margin: 1vh;
  padding: 1vh;
  box-sizing: border-box;
}
#content {
  padding-bottom: 40px;
}

.logo {
  height: auto;
  margin-right: 0%;
}

footer {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-top: 1px solid;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  max-height: 35px;
  color: rgb(5, 0, 0);
  text-align: center;
  border-color: black;
  font-size: large;
  background-color: white;
}

.config-block {
  margin: 20px 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Default styling for all router-link elements */
router-link, a {
  color: rgb(40, 40, 40); /* Grey color for non-selected links */
  text-decoration: none; /* Removes underline from all links */
  font-size: smaller;
}

/* Styling for active router-link elements */
.router-link-active, .router-link-exact-active {
  color: black; /* Black color for selected (active) links */
  font-size: large;
  font-weight: bold;
}

ul.dropdown-nav, .link {
  list-style: none;
}

li.nav, .footer-link {
  padding: 1%;
  transition: .5s ease all;
  padding-bottom: 4px;
  border-bottom:1px solid transparent;
  &:hover {
    color:black;
    font-weight: bold;
    border-color: grey;
  }
}

.brand {
  position: absolute;
  left: 30px;
  img {
    width: 30px;
    height: 30px;
    margin-bottom: 1px;
    transition: .5s ease all;
  }
}
.nav-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.navigation {
  display: flex;
  justify-content: space-around;
  width: 80%;
}

.icon {
  display: flex;
  position: absolute;
  bottom: 0;
  right: 30px;
  height: 100%;
}

.transparent-button {
  background-color: transparent;
  border: none;
  color: inherit;
  font: inherit;
  font-weight: bold;
  font-size: 1.5em;
  cursor: pointer;
  transition: .5s ease all;
}
.dropdown-nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  max-width: 300px;
  height: calc(100% - 70px);
  bottom: 40px;
  top:0;
  right:0;
  background-color: black;
  li {
    margin-left: 0;
    margin-top: 4%;
    .footer-link {
      color: white;
      font-size: large;

    }
  }
  .mobile-nav-enter-active, .mobile-nav-leave-active {
    transition: 2s ease all;
  }
  .mobile-nav-enter-from, .mobile-nav-leave-to {
    transform: translateX(-300px);
  }
  .mobile-nav-enter-to {
    transform: translateX(0);
  }
}
</style>