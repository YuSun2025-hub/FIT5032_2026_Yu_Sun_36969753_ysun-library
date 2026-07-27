<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card p-4 shadow">
          <h2 class="text-center mb-4">Create an Account</h2>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="text" class="form-control" placeholder="Email" v-model="email" />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" placeholder="Password" v-model="password" />
          </div>

          <button class="btn btn-primary w-100" @click="register">Save to Firebase</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref ("")
const password = ref("")
const router = useRouter()
const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((data) => {
    console.log("Firebase Register Successful!")
    router.push("/FireLogin")
  }).catch((error) => {
    console.log(error.code);
  })
};
</script>