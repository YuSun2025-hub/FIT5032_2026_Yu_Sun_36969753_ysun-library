<template>
  <div class="draw-container">
    <h2>🎰 Daily Book Drawing</h2>
    <p>Remaining Tokens: <strong>{{ tokens }}</strong></p>

    <button @click="drawCard" :disabled="loading || tokens <= 0" class="draw-btn">
      {{ loading ? 'Loading...' : 'Consume 1 Token to Draw Card' }}
    </button>

    <div v-if="card" class="card-box">
      <div class="card-header">
        <span class="card-id">{{ card.cardId }}</span>
        <span class="card-time">{{ new Date(card.timestamp).toLocaleTimeString() }}</span>
      </div>

      <div class="card-body">
        <img 
            :src="card.book.coverUrl" 
            @error="handleImageError" 
            alt="Book Cover" 
            class="book-cover" 
         />
        <h3 class="book-title">{{ card.book.name }}</h3>
        
        <svg id="barcode"></svg>
      </div>
    </div>

    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode';

export default {
  data() {
    return {
      tokens: 3,
      loading: false,
      card: null,
      error: null
    };
  },
  methods: {
    async drawCard() {
      if (this.tokens <= 0) return;
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch('https://sellbook-sy-gjjtkdmnsy.us-west-1.fcapp.run/');
        const data = await res.json();

        if (data.error) {
          this.error = data.message;
        } else {
          this.card = data;
          this.tokens--; 

          this.$nextTick(() => {
            const isbnStr = String(this.card.book.isbn).trim();

            const formatType = (isbnStr.length === 13 && /^\d+$/.test(isbnStr)) ? "EAN13" : "CODE128";

            try {
                JsBarcode("#barcode", isbnStr, {
                    format: formatType,
                    width: 2,
                    height: 50,
                    displayValue: true
                });
            } catch (e) {
                console.error("Barcode render error:", e);
            }
        });
        }
      } catch (err) {
        this.error = "Draw card failed: " + err.message;
      } finally {
        this.loading = false;
      }
    },
    handleImageError(e) {
      const title = encodeURIComponent(this.card.book.name || 'BOOK');
      const svgDataUri = `data:image/svg+xml;utf8,
        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="200" viewBox="0 0 140 200">
          <rect width="100%" height="100%" fill="%232f3542" rx="8"/>
          <rect x="10" y="10" width="120" height="180" fill="none" stroke="%23eccc68" stroke-width="2" rx="4"/>
          <text x="50%" y="45%" fill="%23ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">${title}</text>
          <text x="50%" y="85%" fill="%23eccc68" font-size="10" text-anchor="middle" font-family="sans-serif">DIGITAL CARD</text>
        </svg>`.replace(/\n\s*/g, '');

      e.target.src = svgDataUri;
    }
  }
};
</script>

<style scoped>
.draw-container {
  text-align: center;
  max-width: 400px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

.draw-btn {
  background: #2b6ef6;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}

.draw-btn:disabled {
  background: #ccc;
}

.card-box {
  margin-top: 25px;
  border: 2px solid #eccc68;
  background: #f1f2f6;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #747d8c;
  margin-bottom: 12px;
}

.book-cover {
  width: 140px;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.book-title {
  margin: 12px 0 8px 0;
  font-size: 18px;
  color: #2f3542;
}

#barcode {
  margin-top: 10px;
  max-width: 100%;
}

.error-msg {
  color: red;
  margin-top: 10px;
}
</style>
