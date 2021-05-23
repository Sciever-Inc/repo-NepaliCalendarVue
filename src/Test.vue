<template>
<div>
  <Calender  v-on:dateSelected="test"/>
</div>
</template>
<script>
import Calender from "./Calender";
  export default {
    name: "TestPage",
    components: {
      Calender
    },
    methods:{
      test:function(message){
       console.log(message);
      }
    }
  }
</script>