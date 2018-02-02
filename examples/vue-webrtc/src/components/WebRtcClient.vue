<template>
  <div class="web-rtc-client">
   <video ref="localVideo" autoplay style=""></video>
   <video ref="remoteVideo" autoplay style=""></video>
   <div>{{myId}}</div>
   <input v-model="peerId" placeholder="peer id">
   <input type="button"
   val="start"
   @click="onClick" />
  </div>
</template>

<script>
import config from '../assets/config'
import Peer from 'peerjs'

const peer = new Peer({ key: config.apiKey })

export default {
  name: 'WebRtcClient',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      peerId: '',
      myId: ''
    }
  },
  mounted () {
    this.startVideoStream()
    peer.on('open', id => {
      console.log('My peer ID is: ' + id)
      this.myId = id
    })
    peer.on('call', call => {
      // Answer the call, providing our mediaStream
      call.answer(this.$refs.localVideo.srcObject)
      call.on('stream', stream => {
        this.$refs.remoteVideo.srcObject = stream
      })
      call.on('close', stream => {
        this.$refs.remoteVideo.srcObject = null
      })
    })
    peer.on('stream', stream => {
      this.$refs.remoteVideo.srcObject = stream
    })
  },
  methods: {
    async startVideoStream () {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      this.$refs.localVideo.srcObject = stream
    },
    onClick () {
      console.debug('clicked')
      this.connect()
    },
    async connect () {
      const peerId = this.peerId
      const call = peer.call(peerId, this.$refs.localVideo.srcObject)
      call.on('stream', stream => {
        this.$refs.remoteVideo.srcObject = stream
      })
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
