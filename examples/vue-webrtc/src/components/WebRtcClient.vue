<template>
  <div class="web-rtc-client">
   <video v-if="localStream" ref="localVideo" autoplay style=""></video>
   <template v-for="s of streams">
    <video :key="s.id" :ref="s.id" autoplay style=""></video>
   </template>
   <div>{{myId}}</div>
   <input v-model="peerId" placeholder="peer id">
   <button value="start" @click="onClick">Call</button>
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
      myId: '',
      localStream: null,
      remoteStream: null,
      streams: []
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
      call.answer(this.localStream)
      call.on('stream', stream => {
        this.streams.push(stream)
        // this.remoteStream = stream
        // this.$refs.remoteVideo.srcObject = stream
      })
      call.on('close', stream => {
        // this.remoteStream = null
        // this.$refs.remoteVideo.srcObject = null
      })
    })
    peer.on('stream', stream => {
      this.streams.push(stream)
      // this.remoteStream = stream
    })
  },
  watch: {
    localStream () {
      this.$nextTick(() => {
        this.$refs.localVideo.srcObject = this.localStream
      })
    },
    // remoteStream () {
    //   this.$nextTick(() => {
    //     this.$refs.remoteVideo.srcObject = this.localStream
    //   })
    // }
    streams () {
      this.$nextTick(() => {
        for (let s of this.streams) {
          this.$refs[s.id][0].srcObject = s
        }
      })
    }
  },
  methods: {
    async startVideoStream () {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      this.localStream = stream
    },
    onClick () {
      console.debug('clicked')
      this.connect()
    },
    async connect () {
      const peerId = this.peerId
      const call = peer.call(peerId, this.$refs.localVideo.srcObject)
      call.on('stream', stream => {
        this.remoteStream = stream
        this.streams.push(stream)
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
