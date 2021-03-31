<template>
<div>
  <Calender ad-date="2020/01/01" v-on:dateSelected="test"/>
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
       
      }
    }
  }
</script>