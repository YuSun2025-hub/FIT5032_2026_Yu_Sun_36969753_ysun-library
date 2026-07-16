<template>
  <div class="access-denied-container">
    <div class="alert alert-danger text-center" role="alert" style="max-width: 500px; width: 100%;">
      <h4 class="alert-heading">
        <i class="bi bi-exclamation-triangle"></i> Access Denied
      </h4>
      <p>You do not have permission to view this page.</p>
      <p class="mb-0">
        Redirecting to login page in <strong>{{ countdown }}</strong> seconds...
      </p>
      <hr />
      <router-link to="/login" class="btn btn-outline-danger">Go to Login Now</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(5)

onMounted(() => {
  const interval = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(interval)
      router.replace('/login')
    }
  }, 1000)
})
</script>

<style scoped>
.access-denied-container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>