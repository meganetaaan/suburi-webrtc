<template>
  <div class="web-rtc-client">
   <video ref="video" autoplay style=""></video>
  </div>
</template>

<script>
import config from '../assets/config'
import Peer from 'peerjs'

const peer = new Peer({
  key: config.apiKey
})

export default {
  name: 'WebRtcClient',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    this.startVideoStream()
    peer.on('open', id => {
      console.log('My peer ID is: ' + id)
    })
  },
  methods: {
    async startVideoStream () {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      this.$refs.video.srcObject = stream
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
video {
  width: 240px;
  height: 180px;
  border: 1px solid black;
}
</style>
