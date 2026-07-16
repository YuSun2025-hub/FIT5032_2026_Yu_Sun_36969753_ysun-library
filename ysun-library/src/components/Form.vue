<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="text-center">
          <h1>
            <i class="bi bi-book"></i>
            W5. Library Registration Form
          </h1>
          <p class="lead">Let's build some more advanced features into our form.</p>
        </div>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-6">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" 
                @blur="() =>validateName(true)"
                @input="() =>validateName(false)"
                v-model="formData.username" >
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="col-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender"
                @blur="() => validateGender(true)" @change="() => validateGender(true)">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" 
                @blur="() =>validatePassword(true)"
                @input="() =>validatePassword(false)"
                v-model="formData.password">
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
              {{ errors.confirmPassword }}
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              <label class="form-label d-block">Australian Resident?</label>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="resident" id="residentYes"
                  value="yes" v-model="formData.isAustralian"
                  @change="() => validateResident(true)">
                <label class="form-check-label" for="residentYes">Yes</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="resident" id="residentNo"
                  value="no" v-model="formData.isAustralian"
                  @change="() => validateResident(true)">
                <label class="form-check-label" for="residentNo">No</label>
              </div>
              <div v-if="errors.resident" class="text-danger">{{ errors.resident }}</div>
            </div>
          </div>
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea class="form-control" id="reason" rows="3" v-model="formData.reason"
              @blur="() => validateReason(true)" @input="() => validateReason(false)"></textarea>
            <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
            <div v-if="friendMessage" class="text-success">{{ friendMessage }}</div>
          </div>
          <div class="mb-3">
            <label for="suburb" class="form-label">Suburb</label>
            <input type="text" class="form-control" id="suburb" v-bind:value="formData.suburb" />
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <DataTable :value="submittedCards" responsiveLayout="scroll" class="mt-5" v-if="submittedCards.length">
    <Column field="username" header="Username" />
    <Column field="password" header="Password" />
    <Column field="isAustralian" header="Australian Resident" />
    <Column field="gender" header="Gender" />
    <Column field="reason" header="Reason" />
  </DataTable>
  <div class="row mt-5" v-if="submittedCards.length">
   <div class="d-flex flex-wrap justify-content-start">
      <div v-for="(card, index) in submittedCards" :key="index" class="card m-2" style="width: 18rem;">
          <div class="card-header">
            User Information
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Username: {{ card.username }}</li>
            <li class="list-group-item">Password: {{ card.password }}</li>
            <li class="list-group-item">Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}</li>
            <li class="list-group-item">Gender: {{ card.gender }}</li>
            <li class="list-group-item">Reason: {{ card.reason }}</li>
          </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// Our logic will go here
import { ref,computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const formData = ref({
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: '',
    reason: '',
    gender: '',
    suburb: 'Clayton'
});

const submittedCards = ref([]);

const submitForm = () => {
  validateName(true);
  validatePassword(true);
  validateResident(true);
  validateGender(true);
  validateReason(true);
  if (!errors.value.username && !errors.value.password && !errors.value.resident &&!errors.value.gender && !errors.value.reason) {
    submittedCards.value.push({
        ...formData.value
    });
    clearForm(); // Clear the form after submission
  }
};

const clearForm = () => {
    formData.value = {
        username: '',
        password: '',
        isAustralian: '',
        reason: '', 
        gender: ''
    };
    Object.keys(errors.value).forEach(k => errors.value[k] = null);    
}; 

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null,
});

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Username must be at least 3 characters';
  } else {
    errors.value.username = null;
  }
};  

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
  } else if (!hasLowercase) {
    if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
  } else if (!hasNumber) {
    if (blur) errors.value.password = "Password must contain at least one number.";
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = "Password must contain at least one special character.";
  } else {
    errors.value.password = null;
  }
};

/**
 * Confirm password validation function that checks if the password and confirm password fields match.
 * @param blur: boolean - If true, the function will display an error message if the passwords do not match.
 */
const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateResident = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) errors.value.resident = 'Please indicate whether you are an Australian resident.';
  } else {
    errors.value.resident = null;
  }
};

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select a gender.';
  } else {
    errors.value.gender = null;
  }
};

const validateReason = (blur) => {
  const text = formData.value.reason.trim();
  const min = 10;
  const max = 300;
  if (text.length < min) {
    if (blur) errors.value.reason = `Please enter at least ${min} characters.`;
  } else if (text.length > max) {
    if (blur) errors.value.reason = `Please limit to ${max} characters.`;
  } else {
    errors.value.reason = null;
  }
};

const friendMessage = computed(() => {
  const text = formData.value.reason;
  if (text && text.toLowerCase().includes('friend')) {
    return 'Great to have a friend';
  }
  return '';
});
</script>

<style scoped>
/* Our logic will go here */
.card {
   border: 1px solid #ccc;
   border-radius: 10px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }
   .card-header {
   background-color: #275FDA;
   color: white;
   padding: 10px;
   border-radius: 10px 10px 0 0;
   }
   .list-group-item {
   padding: 10px;
   }
</style>