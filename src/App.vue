<script setup lang="ts">
import Message from './components/message/src/Message.vue';

</script>

<template>
  <Message type="warn" :duration="2000"/>
  <Message type="success" :duration="3000"/>
  <Message type="info" :duration="4000"/>
  <Message type="error" :duration="5000"/>
</template>

<style scoped>

</style>
