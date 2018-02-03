<template>
  <div class="web-rtc-client">
    <video v-if="localStream" ref="localVideo" autoplay style=""></video>
    <template v-for="s of streams">
      <video :key="s.id" :ref="s.id" autoplay style=""></video>
    </template>
    <div>id: {{myId}}</div>
    <input v-model="peerId" placeholder="peer id">
    <button @click="onClick">Call</button>
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
      streams: []
    }
  },
  mounted () {
    this.startVideoStream()
    peer.on('open', id => {
      this.myId = id
    })
    peer.on('call', call => {
      call.answer(this.localStream)
      this.setupCall(call)
    })
  },
  watch: {
    localStream () {
      this.$nextTick(() => {
        this.$refs.localVideo.srcObject = this.localStream
      })
    },
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
    setupCall (call) {
      const vm = this
      call.on('stream', stream => {
        // add received stream
        vm.streams.push(stream)
      })
      call.on('close', () => {
        // remove closed stream
        const closedStream = this.remoteStream
        const idx = this.streams.indexOf(closedStream)
        vm.streams.splice(idx, 1)
      })
    },
    onClick () {
      this.connect()
    },
    async connect () {
      const peerId = this.peerId
      if (peerId == null) {
        console.warn('peerId is empty')
        return
      }
      const call = peer.call(peerId, this.localStream)
      this.setupCall(call)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
video {
  width: 240px;
  height: 180px;
}
</style>
