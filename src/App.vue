<template>
  <div id="app">
    <header>
      <img src="@/assets/logo.png" alt="Logo" class="logo">
    </header>
    <div id="content">
      <router-view/>
    </div>
    <footer>
      <router-link class="footer-link" to="/">Home</router-link>
      <router-link class="footer-link" to="/interval-identification">Intervals</router-link>
      <router-link class="footer-link" to="/mode-identification">Modes</router-link>
      <router-link class="footer-link" to="/chords-identification">Chords</router-link>
      <router-link class="footer-link" to="/progressions-identification">Chords Progression</router-link>
      <router-link class="footer-link" to="/contact-me">Give feedback</router-link>
    </footer>
  </div>
</template>

<script>

</script>

<style>
header {
  display: flex;
  justify-content: space-around;
  border-color: black;
  height: 5vh;
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

.footer-link{
  color: inherit; /* or specify a color */
}

</style>