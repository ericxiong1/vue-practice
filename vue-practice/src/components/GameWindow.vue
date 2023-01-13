<template>
  <div>
    <div class="title">
      Asteroids!
    </div>
      <div @click="moveUp" class="window">
        <button :class="[gameActive || endActive ? 'buttonDisable' : 'buttonPlay']" @click="playGame">Play</button>
        <div :class="[gameActive ? 'player' : 'playerDisabled']" :style="{top:yStr}"></div>
        <div :class="[gameActive ? 'asteroid' : 'playerDisabled']" :style="{left:asteroidXStr, top:asteroidYStr}" ></div>
        <div :class="[gameActive ? 'score' : 'playerDisabled']" >Score: {{ score }}</div>
        <div :class="[(!gameActive && endActive) ? 'finalscore' : 'playerDisabled']">Your final score is: {{ score }}</div>
        <div :class="[endActive ? 'title' : 'playerDisabled']">
          <h3>Leaderboard</h3>
          <div v-for="item in todos" :key="item.id">
            <p>{{ item.name }}'s Score: {{ item.description }}</p>
          </div>
        </div>
        <button :class="[!endActive ? 'buttonDisable' : 'buttonPost']" @click="createTodo">Post Score</button>
        <button :class="[!endActive ? 'buttonDisable' : 'buttonPost']" @click="reset">Play Again</button>
      
      </div>
  </div>
</template>

<script>
  import { API } from 'aws-amplify';
  import { createTodo } from '../graphql/mutations';
  import { listTodos } from '../graphql/queries';
export default {
  async created() {
      this.getTodos();
    },
  data(){
    return{
      y: 200,
      yStr: "",
      asteroidX: 828,
      asteroidXStr: "",
      asteroidY: Math.random()*400,
      asteroidYStr: "",
      toggleUp: true,
      gameActive: false,
      score: 0,
      asteroidSpeed: 2,
      endActive: false,
      name: '',
      description: '',
      todos: []
    }
  },
  methods:{
    moveUp: function(){
      this.toggleUp = !this.toggleUp
    },
    playGame:function(){
      this.gameActive = !this.gameActive
      this.score = 0
    },
    reset:function(){
      this.gameActive = !this.gameActive
      this.score = 0
      this.asteroidSpeed = 2
      this.endActive = false;
    },
    async createTodo() {
        const name = "Eric"
        const description = this.score
        if (!name || !description) return;
        const todo = { name, description };
        this.todos = [...this.todos, todo];
        await API.graphql({
          query: createTodo,
          variables: { input: todo }
        });
      },
      async getTodos() {
        const todos = await API.graphql({
          query: listTodos
        });
        this.todos = todos.data.listTodos.items;
      }
  },
  mounted: function () {
  window.setInterval(() => {
    if (this.gameActive){
      this.score += 1;
      this.asteroidX -= this.asteroidSpeed
      if (this.asteroidX < 0){
        this.asteroidY = Math.random()*400
        this.asteroidX = 828
        this.asteroidSpeed += 1
      }
      this.asteroidXStr = this.asteroidX + "px"
      this.asteroidYStr = this.asteroidY + "px"
      if(this.asteroidX < 50 && ((this.y-75) < this.asteroidY && (this.y) > this.asteroidY)){
        this.gameActive = !this.gameActive
        this.asteroidSpeed = 2
        this.asteroidY = Math.random()*400
        this.asteroidX = 828
        console.log("HIT")
        this.endActive = !this.endActive
      }
      if (this.y >= -1){
          if (this.toggleUp){
            this.y += 2
            this.yStr = this.y + "px"
          }
          else{
            this.y -= 2
            this.yStr = this.y + "px"
          }
        }
      if(this.y <-1){
        this.toggleUp = !this.toggleUp
        this.y = 0
      }
      if(this.y > 462){
        this.toggleUp = !this.toggleUp
        this.y = 462
      }
    }
  }, 10)
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.window{
  width: 50vw;
  height: 50vh;
  border-radius: 5px;
  background-color: white;
  background-image: url(../assets/gamebackground.png);
  background-size: contain;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  overflow-x: hidden;
}
.player{
  background-image: url(../assets/player.png);
  background-size: contain;
  width:50px;
  height: 50px;
  position: relative;
}
.playerDisabled{
  display:none;
}
.buttonPlay{
  background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	outline: inherit;
  font-size: 50px;
  margin-top: 200px;
  color: white;
}
.buttonPlay:hover{
  cursor:pointer;
}
.buttonDisable{
  display:none;
}
.title{
  font-size: 30px;
  color: white;
}
.asteroid{
  background-color: white;
  width:50px;
  height: 50px;
  position: relative;
}
.score{
  color: white;
  font-size: 30px;
  position: relative;
  left: 360px;
  bottom: 90px;
}
.finalscore{
  color: white;
  font-size: 30px;
  position: relative;
  top: 20px;
}
.buttonPost{
  background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	outline: inherit;
  font-size: 30px;
  color: white;
  padding-right: 50px;
  padding-left: 25px
}
.buttonPost:hover{
  cursor:pointer;
}
</style>
