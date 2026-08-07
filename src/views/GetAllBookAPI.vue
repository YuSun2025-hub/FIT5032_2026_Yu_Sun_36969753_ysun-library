<template>
  <div v-if="apiResponse" class="api-response">
    <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
  </div>
  <div v-else-if="error" class="api-error">
    {{ error }}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import authors from '@/assets/json/authors.json'

const apiResponse = ref(null)
const error = ref(null)

const getApiData = async () => {
  try {
    const books = authors.flatMap(author =>
      author.famousWorks.map(work => ({
        author: author.name,
        title: work.title,
        year: work.year,
      }))
    )

    apiResponse.value = {
      success: true,
      data: {
        books,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (err) {
    error.value = `Error processing book data: ${err.message}`
    console.error('Error processing book data:', err)
  }
}

onMounted(getApiData)
</script>