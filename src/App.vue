<template>
  <div id="app">
    <div class="loading" v-if="loading < 100">
      loading resources... {{loading}}%
    </div>
    <div class="progress">
      <div class="bar" :style="{width:progress}"></div>
    </div>
    <button @click="play" class="btn">播放(play)</button>
    <button @click="stop" class="btn">停止(stop)</button>
    <select name="" id="" v-model="selectedSong">
      <option v-for="song in songs" :value="song" :key="song">
        {{song}}
      </option>
    </select>
    <div class="piano"
         @mousedown="activate($event.target.attributes.note.value)"
         @mouseup="deactivate($event.target.attributes.note.value)"
    >
      <div class="octave first">
        <div class="white"   :class="{active:activeKeys[1]}" :note="1"></div>
        <span class="black" :class="{active:activeKeys[2]}" :note="2"></span>
        <div class="white" :class="{active:activeKeys[3]}" :note="3"></div>
      </div>
      <div class="octave" v-for="n in 7" :key="n">
        <div class="white"  :class="{active:activeKeys[(n -1)*12+4]}" :note="(n -1)*12+4"></div>
        <span class="black" :class="{active:activeKeys[(n -1)*12+5]}" :note="(n -1)*12+5"></span>
        <div class="white" :class="{active:activeKeys[(n -1)*12+6]}" :note="(n -1)*12+6"></div>
        <span class="black"  :class="{active:activeKeys[(n -1)*12+7]}" :note="(n -1)*12+7"></span>
        <div class="white"  :class="{active:activeKeys[(n -1)*12+8]}" :note="(n -1)*12+8"></div>
        <div class="white"  :class="{active:activeKeys[(n -1)*12+9]}" :note="(n -1)*12+9"></div>
        <span class="black"  :class="{active:activeKeys[(n -1)*12+10]}" :note="(n -1)*12+10"></span>
        <div class="white"  :class="{active:activeKeys[(n -1)*12+11]}" :note="(n -1)*12+11"></div>
        <span class="black"  :class="{active:activeKeys[(n -1)*12+12]}" :note="(n -1)*12+12"></span>
        <div class="white"  :class="{active:activeKeys[(n -1)*12+13]}" :note="(n -1)*12+13"></div>
        <span class="black"  :class="{active:activeKeys[(n -1)*12+14]}" :note="(n -1)*12+14"></span>
        <div class="white"  :class="{active:activeKeys[(n -1)*12+15]}" :note="(n -1)*12+15"></div>
      </div>
      <div class="octave last">
        <div class="white" :class="{active:activeKeys[88]}" :note="88"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading:0,
        progress:0,
        timer:null,
        totalTime:0,
        startTime:0,
        activeKeys:{},
        selectedSong:'Attack on Titan.mid',
        songs:[ 'Again.mid',
          'aLIEz.mid',
          'All in good time.mid',
          'Allegro Cantabile Sound.mid',
          'Amnanesis.mid',
          'AQUA.mid',
          'Aruji Naki Sono Koe.mid',
          'Ashita e no Kaerimichi.mid',
          'Attack on Titan.mid',
          'Before my body is dry.mid',
          'Bios.mid',
          'Blessing.mid',
          'Blue Bird.mid',
          'Blumenkranz.mid',
          'Boku ja nai.mid',
          'Boys be Smile.mid',
          'Brave Heart.mid',
          'Brave Shine.mid',
          'Brave Song (piano + viola).mid',
          'Brave Song.mid',
          'Butterfly.mid',
          'Cha-la Head-Cha-La.mid',
          'Challenge accepted (1).mid',
          'City of Eternity.mid',
          'COLORS.mid',
          'Cras numquam scire.mid',
          'Daydream Syndrome.mid',
          'departures.mid',
          'Dream theme from Nazo no Kanojo X.mid',
          'Enter Enter Mission.mid',
          'EONIAN.mid',
          'Esoragoto.mid',
          'Euterpe.mid',
          'Everyday World.mid',
          'Extra magic hour.mid',
          'Fallen Angel.mid',
          'Fubuki.mid',
          'GO GO Maniac.mid',
          'Gotta catch \'em all.mid',
          'Guren no Yumiya.mid',
          'Heartwarming.mid',
          'Hello Alone -Yui Ballade-.mid',
          'Hikari no Senritsu.mid',
          'Hikaru Nara.mid',
          'Jiyuu no Tsubasa for two pianos (MIDI).mid',
          'Kanashimi no ato ni.mid',
          'Kancolle - Piano Suite.mid',
          'Key anime piano suite.mid',
          'Kibou ni Tsuite.mid',
          'Kibou no Hana.mid',
          'Killy Killy Joker.mid',
          'Kimi ni Matsuwaru Mystery.mid',
          'Kimi no Shiranai Monogatari.mid',
          'Koibumi.mid',
          'Koko Kara Hajimaru Monogatari.mid',
          'Kokoro no Senritsu.mid',
          'Kono Namida wo Kimi ni Sasagu (2).mid',
          'kono suba piano suite.mid',
          'Kuchizuke Diamond.mid',
          'Kuusou Mesorogiwi.mid',
          'Level 5 - Judgelight.mid',
          'Life goes on.mid',
          'Light my Fire.mid',
          'Little Busters!.mid',
          'Lumis Eterne.mid',
          'Madoka Magica - Piano Medley.mid',
          'Magia.mid',
          'Main Theme from Non Non Byori.mid',
          'Masshiro World.mid',
          'Megumeru - Cuckool mix 2007 -.mid',
          'Miiro.mid',
          'Mikansei Stride.mid',
          'Moonlight Densetsu.mid',
          'My Dearest.mid',
          'My precious friend - Isshuukan Friends.mid',
          'My Soul Your Beats.mid',
          'Nagi no Asukara - Piano Suite.mid',
          'Namae no nai Kaibutsu.mid',
          'Niji no Ressha.mid',
          'Ninelie.mid',
          'Oath Sign.mid',
          'One Last Song.mid',
          'Only my railgun (easy ver).mid',
          'Only my railgun (full ver).mid',
          'Only my railgun.mid',
          'Owari no Sekai Kara.mid',
          'Patema Inverse.mid',
          'Philosophyz.mid',
          'Pierce the Heavens with your drill!.mid',
          'REDLINE DAY.mid',
          'Resonance.mid',
          'Rewrite v2 - Lenno Liu.mid',
          'Sagitta Luminis.mid',
          'Sakura.mid',
          'Satori_Maiden__3rd_eye_-_Satori_Komeijis_Theme_-_by_Animenzzz.mid',
          'Sayonara Memories.mid',
          'Scarlet Ballet.mid',
          'Secret_Base_-_Kimi_ga_Kureta_Mono_(10_years_after_Ver - ThePianoL.mid',
          'Shakugan no Shana Medley.mid',
          'Sis puella magica!.mid',
          'Sister\'s Noise.mid',
          'Snow Halation.mid',
          'Sora to Kimi no Message.mid',
          'Sparkling Daydream.mid',
          'Sweet & Sweet Cherry.mid',
          'Swordland (Main Theme).mid',
          'The city in the night.mid',
          'The Reluctant Heroes.mid',
          'The Song of Aether.mid',
          'This Game (1).mid',
          'This Game (TV Size).mid',
          'This is (not) the end.mid',
          'Toki Tsukasadoru Juuni no Meiyaku.mid',
          'tokimeki poporon.mid',
          'Trust me.mid',
          'Unbeatable Network.mid',
          'unfinished.mid',
          'Unravel.mid',
          'We are!.mid',
          'Wiosna.mid',
          'World End.mid',
          'Yasashii Boukyaku.mid',
          'Yasashisa no Riyuu.mid',
          'Yoake Umarekuru Shoujo.mid',
          'Yume wa Nando mo Umarekawaru.mid',
          'ZZZ.mid' ],
      }
    },
    watch: {
      selectedSong() {

      }
    },
    methods:{
      initTimer() {
        this.startTime = +new Date()
        this.totalTime = MIDI.Player.endTime
        this.timer = setInterval(()=>{
          this.progress = 100*(new Date() - this.startTime)/this.totalTime +'%'
        },20)

      },
      stopTimer() {
        let timer = this.timer
        clearInterval(timer)
        this.progress = 0
        //this.timer = null
      },
      activate(note) {
        note = Number(note) -20
        if(this.activeKeys[note]){
          this.deactivate(note)
          this.$nextTick(()=>{
            setTimeout(()=>{
              this.$set(this.activeKeys,note,true)
            },20)
          })
        }else {
          this.$set(this.activeKeys,note,true)
        }

      },
      deactivate(note) {
        note = Number(note) - 20
        this.$delete(this.activeKeys,note)
      },
      play() {
        this.stopTimer()
        let player = MIDI.Player
        player.timeWarp = 1
        player.loadFile('./midifiles/'+this.selectedSong, ()=>{
          player.start();
          this.initTimer()
        })

      },
      stop() {
        this.stopTimer()
        let player = MIDI.Player
        player.stop()
      }
    },
    created() {

    },
    mounted() {
      let i = 0
      let vm = this
      MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
          vm.loading = parseInt(progress * 100)
        },
        onsuccess: function() {
          let player = MIDI.Player
          player.addListener(function(data) {
            if(data.message === 144){
              vm.activate(data.note)
            }
            if(data.message === 128){
              vm.deactivate(data.note)
            }
          });
        }
      });
    }
  }
</script>
<style lang="less" scoped>
  @whiteWidth:(100/52);
  @whiteHeight:(25/4.16667)*@whiteWidth;
  @blackWidth:(2.77778/4.16667)*@whiteWidth;
  @blackHeight:(16.6667/2.77778)*@blackWidth;
  #app{
    width: 100%;
    height: 100%;
    position: relative;
    background-color: rgb(48, 48, 48);
    .loading{
      position: fixed;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 25px;
      background-color: rgba(255,255,255,0.8);
      z-index: 10000;
    }
    .btn{
     // margin-right: 20px;
      /*display: inline-block;
      width: 70px;
      height: 36px;
      background-color: gray;*/
    }
    .progress{
      z-index: 50;
      height: 30px;
      background-color: rgb(48, 48, 48);
      width: 100%;
      box-shadow: rgba(255, 255, 255, 0.4) 0px 1px inset;
      background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.12) 51%, rgba(0, 0, 0, 0.04));
      border-width: 1px;
      border-style: solid;
      border-color: initial;
      border-image: initial;
      border-radius: 1px;
      .bar{
        display: inline-block;
        height: 100%;
        background-image: linear-gradient(rgba(118, 255, 53, 0.3), rgb(38, 255, 83));
      }
    }
  }
.piano{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  display: flex;
  .octave{
    position: relative;
    display: flex;
    flex-shrink:7;
    flex-grow: 7;
    &.first{
      flex-shrink: 2;
      flex-grow: 2;
      .white{
        padding-top: @whiteHeight*7*7/2%;
      }
      .black{
        width: @blackWidth * 7*7/2%;
        padding-top: @blackHeight * 7*7/2%;
        &:first-of-type{
          left: 41.5%;
        }
      }
    }
    &.last{
      flex-shrink: 1;
      flex-grow: 1;
      .white{
        padding-top: @whiteHeight*7*7%;
      }
    }
  }
  .black{
    cursor: pointer;
    position: absolute;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 2px;
    z-index: 100;
    width: @blackWidth * 7%;
    //height: @blackHeight * 1vw;
    padding-top: @blackHeight * 7%;
    transform-origin: center top 0px;
    transform: translate(0px, 0px) rotateX(0deg);
    border-width: 1px;
    border-style: solid;
    border-color: grey;
    border-image: initial;
    border-radius: 0px 0px 5px 5px;
    background: black;
    transition: all 0.003s ease 0s;
    &.active{
      transform: rotateX(-1deg) scale(0.95);
      background-color: red;
    }
    &:first-of-type{
      left: 8.5%;
    }
    &:nth-of-type(2){
      left: 25.5%;
    }
    &:nth-of-type(3){
      left: 50.6%;
    }
    &:nth-of-type(4){
      left: 67%;
    }
    &:nth-of-type(5){
      left: 84%;
    }
  }

  .white{
    flex: 1;
    box-sizing: border-box;
    width: @whiteWidth*7%;
    cursor: pointer;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 2px;
    z-index: 90;
    //height: @whiteHeight*1vw;
    height: 0;
    padding-top: @whiteHeight*7%;
    transform-origin: center top 0px;
    transform: translate(0px, 0px) rotateX(0deg);
    border-width: 1px;
    border-style: solid;
    border-color: grey;
    border-image: initial;
    border-radius: 0px 0px 5px 5px;
    background: white;
    transition: all 0.003s ease 0s;
    &.active{
      transform: rotateX(-1deg) scale(0.95);
      background-color: red;
    }
  }
}
</style>
<style>
  body,html,p{
    min-height: 500px;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
</style>
