<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" v-model="username" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required />
              </div>
              <div v-if="error" class="text-danger mb-3">{{ error }}</div>
              <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const route = useRoute()

const handleLogin = () => {
  const success = login(username.value, password.value)
  if (success) {
    error.value = ''
    //If the redirect parameter exists, redirect to the corresponding page; otherwise, return to the home page.
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    error.value = 'Invalid username or password'
  }
}
</script>