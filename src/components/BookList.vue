<template>
  <div>
    <h2>Books(ISBN > 1000, ordered by ISBN, limit 5)</h2>

    <ul v-if="books.length">
      <li v-for="book in books" :key="book.id">
        {{ book.name }} - ISBN: {{ book.isbn }}

        <button class="btn btn-sm btn-outline-primary ms-2" @click="startEdit(book)">
          Edit
        </button>

        <button class="btn btn-sm btn-outline-danger ms-2" @click="deleteBook(book.id)">
          Delete
        </button>
      </li>
    </ul>

    <p v-else>No books found.</p>

    <div v-if="editingBook" class="mt-3">
      <h4>Edit Book</h4>
      <input v-model="editingBook.name" class="form-control mb-2" placeholder="Book name" />
      <input v-model.number="editingBook.isbn" type="number" class="form-control mb-2" placeholder="ISBN" />

      <button class="btn btn-success me-2" @click="saveEdit">Save</button>
      <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import db from '../firebase/init.js'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

export default {
  setup() {
    const books = ref([])
    const editingBook = ref(null)
    let unsubscribe = null

    onMounted(() => {
      const q = query(
        collection(db, 'books'),
        where('isbn', '>', 1000),
        orderBy('isbn'),
        limit(5)
      )

      unsubscribe = onSnapshot(q, (snapshot) => {
        books.value = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data()
        }))
      })
    })

    onBeforeUnmount(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    const startEdit = (book) => {
      editingBook.value = { ...book }
    }

    const cancelEdit = () => {
      editingBook.value = null
    }

    const saveEdit = async () => {
      if (!editingBook.value) return

      try {
        await updateDoc(doc(db, 'books', editingBook.value.id), {
          name: editingBook.value.name,
          isbn: Number(editingBook.value.isbn)
        })

        editingBook.value = null
      } catch (error) {
        console.error('Update failed:', error)
      }
    }

    const deleteBook = async (id) => {
      try {
        await deleteDoc(doc(db, 'books', id))
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }

    return {
      books,
      editingBook,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteBook
    }
  }
}
</script>

<style scoped>
ul {
  padding-left: 1rem;
}

li {
  margin-bottom: 12px;
  line-height: 1.6;
}

button {
  margin-left: 6px;
}
</style>