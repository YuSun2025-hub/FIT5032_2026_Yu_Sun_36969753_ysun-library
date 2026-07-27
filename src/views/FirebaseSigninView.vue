<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card p-4 shadow">
          <h2 class="text-center mb-4">Sign in</h2>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="text" class="form-control" placeholder="Email" v-model="email" />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" placeholder="Password" v-model="password" />
          </div>

          <button class="btn btn-primary w-100" @click="signin">Sign in via Firebase</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { getApps } from "firebase/app";

const email = ref("");
const password = ref("");
const router = useRouter();

let auth = null;

if (getApps().length > 0) {
  auth = getAuth();
}

const signin = () => {
  if (!auth) {
    console.log("Firebase auth is not ready yet");
    return;
  }

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const userEmail = userCredential.user.email;

      let role = "user";
      if (userEmail === "admin@example.com") {
        role = "admin";
      }

      localStorage.setItem("userRole", role);
      localStorage.setItem("currentUser", userEmail);
      localStorage.setItem("isLoggedIn", "true");

      window.dispatchEvent(new Event("auth-state-changed"));

      console.log("Login success!", userCredential.user);
      console.log("Current user:", userEmail);
      console.log("Role:", role);

      router.push("/");
    })
    .catch((error) => {
      console.log("Login error code:", error.code);
    });
};
</script>