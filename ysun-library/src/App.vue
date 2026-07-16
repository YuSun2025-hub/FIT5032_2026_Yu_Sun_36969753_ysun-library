<script setup>
import JSON from './components/JSON.vue'
import Form from './components/Form.vue'  
import BHeader from './components/BHeader.vue'
import HeaderforCR from './components/HeaderforCR.vue'
</script>

<template>
  <div class="main-container">
    <header>
      <HeaderforCR />
    </header>

    <main class="main-box">
      <!-- <Form /> -->
      <!-- <JSONLab /> -->
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275FDA;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
</style>