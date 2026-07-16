<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Library App</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <!-- Show the Login link when not logged in -->
          <li v-if="!auth.isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <!-- Show the Logout button when logged in -->
          <li v-else class="nav-item">
            <button class="btn btn-link nav-link" @click="handleLogout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { auth, logout } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  logout()                // clear authentication state
  router.push('/login')   // redirect to login page
}
</script>