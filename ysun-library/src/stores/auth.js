import { reactive } from 'vue'

// Global Authentication State (Singleton)
export const auth = reactive({
  isAuthenticated: false
})

// Hardcoded Credentials 
const VALID_USERNAME = 'sunyu'
const VALID_PASSWORD = 'Sy36969753@'

/**
 * Login function to authenticate the user
 * @param {string} username
 * @param {string} password
 * @returns {boolean} Whether the login was successful
 */
export function login(username, password) {
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    auth.isAuthenticated = true
    return true
  }
  return false
}

/**
 * Logout function to invalidate the user's session
 */
export function logout() {
  auth.isAuthenticated = false
}