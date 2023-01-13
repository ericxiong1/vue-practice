<template>
  <div id="app">
    <amplify-authenticator>
    </amplify-authenticator>
    <div :class="[!signedIn ? 'hidden' : '']">
      <GameWindow/>
    </div>
    
  </div>
</template>

<script>
  import GameWindow from '@/components/GameWindow.vue'
  import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
  export default {
    data(){
      return{
        user:{},
        signedIn: false
      }
    },
    created(){
      onAuthUIStateChange((state,user)=>{
      if (state=== AuthState.SignedIn){
        this.user = user;
        this.signedIn = true;
      }
      })
    },    
    components:{
      GameWindow
    }
  };
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
.hidden{
  display:none;
}
</style>
