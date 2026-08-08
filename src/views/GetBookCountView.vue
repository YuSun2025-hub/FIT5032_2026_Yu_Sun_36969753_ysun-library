<template>
    <div id="app" class="center-container">
      <h1>Book Counter</h1>
      <button @click="getBookCount">Get Book Count</button>
      <p v-if="count !== null">Total number of books: {{ count }}</p>
      <p v-if="error">{{ error }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      count: null,
      error: null,
    };
  },
  methods: {
    async getBookCount() {
    try {
        const response = await fetch('https://countbook-us-mfwpqkqqxi.us-west-1.fcapp.run/', {
        method: 'GET'
        });
        const data = await response.json();
    
        if (data.error) {
            this.error = data.message;
            this.count = null;
        } else {
            this.count = data.count;
            this.error = null;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.message;
        this.count = null;
    }
    }
  },
};
</script>

<style scoped>
.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>