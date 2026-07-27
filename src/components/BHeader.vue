<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">Home</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>

        <li class="nav-item" v-if="role === 'admin'">
          <router-link to="/FireRegister" class="nav-link" active-class="active">
            Admin Panel
          </router-link>
        </li>

        <li class="nav-item" v-if="role === 'user'">
          <router-link to="/FireLogin" class="nav-link" active-class="active">
            User Area
          </router-link>
        </li>

        <li class="nav-item" v-if="isLoggedIn">
          <button class="btn btn-danger btn-sm" @click="logout">Logout</button>
        </li>

        <li class="nav-item" v-else>
          <router-link to="/FireLogin" class="nav-link" active-class="active">Login</router-link>
        </li>

        <li class="nav-item" v-if="!isLoggedIn">
          <router-link to="/FireRegister" class="nav-link" active-class="active">Register</router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { getApps } from "firebase/app";

let auth = null;
const router = useRouter();

const role = ref("guest");
const isLoggedIn = ref(false);

const syncAuthState = () => {
  const savedRole = localStorage.getItem("userRole");
  const savedUser = localStorage.getItem("currentUser");
  const savedLogin = localStorage.getItem("isLoggedIn");

  if (getApps().length > 0) {
    auth = getAuth();
  }

  if (savedRole && savedUser && savedLogin === "true") {
    role.value = savedRole;
    isLoggedIn.value = true;
  } else {
    role.value = "guest";
    isLoggedIn.value = false;
  }
};

onMounted(() => {
  syncAuthState();
  window.addEventListener("auth-state-changed", syncAuthState);
});

onBeforeUnmount(() => {
  window.removeEventListener("auth-state-changed", syncAuthState);
});

const logout = async () => {
  try {
    if (auth) {
      await signOut(auth);
    }

    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");

    window.dispatchEvent(new Event("auth-state-changed"));

    role.value = "guest";
    isLoggedIn.value = false;

    console.log("User logged out");
    router.push("/FireLogin");
  } catch (error) {
    console.log(error);
  }
};
</script>