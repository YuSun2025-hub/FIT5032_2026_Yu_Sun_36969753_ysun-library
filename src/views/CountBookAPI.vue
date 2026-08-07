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

const calculateStats = (authorsData) => {
  const authorsCount = authorsData.length
  const totalBooks = authorsData.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)

  return {
    authorsCount,
    totalBooks,
    authors: authorsData.map(author => ({
      name: author.name,
      bookCount: author.famousWorks.length,
    })),
  }
}

const getApiData = async () => {
  try {
    const stats = calculateStats(authors)

    apiResponse.value = {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    }
  } catch (err) {
    error.value = `Error processing authors data: ${err.message}`
    console.error('Error processing authors data:', err)
  }
}

onMounted(getApiData)
</script>