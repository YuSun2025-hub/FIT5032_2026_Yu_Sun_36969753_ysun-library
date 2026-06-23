<template>
    <div class="my-name">
        <h2>Hello, I am Yu Sun!</h2>
        <p>Student ID: 36969753</p>
        <p>Link to My Project Repository: 
            <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="github-link">
            {{ githubUrl }}
            </a>
        </p>
    </div>
</template>

<script setup lang="ts">
const githubUrl = 'https://github.com/YuSun2025-hub/FIT5032_2026_Yu_Sun_36969753'
</script>

<style scoped>
.my-name {
    width: 100%; 
    box-sizing: border-box;
    margin-top: 30px;
    margin-inline: 20px; 
    padding: 30px; 
    background-color: #f0f8ff;
    border-radius: 10px;
    border: 1px solid #4325d8;
    color: #2c3e50;
}
.github-link {
    color: #066deb;
    font-weight: bold;
    text-decoration: none;
    border-bottom: 1px dashed #426bb8;
}
</style>