<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4 shadow">
          <h1 class="text-center mb-4">Add Book</h1>

          <form @submit.prevent="addBook">
            <div class="mb-3">
              <label for="isbn" class="form-label">ISBN:</label>
              <input type="text" class="form-control" v-model="isbn" id="isbn" required />
            </div>

            <div class="mb-3">
              <label for="name" class="form-label">Name:</label>
              <input type="text" class="form-control" v-model="name" id="name" required />
            </div>

            <div class="text-center">
              <button type="submit" class="btn btn-primary">Add Book</button>
            </div>
          </form>

          <BookList />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore';

import BookList from '../components/BookList.vue';

export default {
  setup() {
    const isbn = ref('');
    const name = ref('');

    const addBook = async () => {
      try {
        const isbnNumber = Number(isbn.value);
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }

        await addDoc(collection(db, 'books'), {
          isbn: isbnNumber,
          name: name.value
        });

        isbn.value = '';
        name.value = '';
        alert('Book added successfully!');
      } catch (error) {
        console.error('Error adding book: ', error);
      }
    };

      return {
        isbn,
        name,
        addBook
      };
    },
    components: {
        BookList
    }   
};
</script>