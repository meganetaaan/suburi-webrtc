<template>
  <div id="app">
    <img src="./assets/logo.png">
    <WebRtcClient/>
  </div>
</template>

<script>
import WebRtcClient from './components/WebRtcClient'

export default {
  name: 'App',
  components: {
    WebRtcClient
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
