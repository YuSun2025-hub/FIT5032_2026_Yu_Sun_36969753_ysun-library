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

const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)

const getApiData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('src/assets/json/authors.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const authors = await response.json()

    const books = authors.flatMap(author =>
      author.famousWorks.map(work => ({
        author: author.name,
        title: work.title,
        year: work.year
      }))
    )

    apiResponse.value = {
      success: true,
      data: {
        books
      },
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    error.value = `Error loading book data: ${err.message}`
    console.error('Error loading book data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(getApiData)
</script>