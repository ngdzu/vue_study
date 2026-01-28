# Sample Project: Multi-Page Blog Application

**Module 4, Lesson 4.1** | Vue Router Setup & Basics

---

## Project Overview

Build a multi-page blog application with Vue Router that demonstrates:
- Router installation and configuration
- Multiple routes with static and dynamic paths
- Declarative navigation with `<router-link>`
- Programmatic navigation with `useRouter()`
- Nested routes for blog structure
- Route props for passing data

**Estimated Time**: 25-35 minutes

---

## Learning Objectives

By completing this project, you will:
- ✅ Set up Vue Router in a Vite project
- ✅ Define multiple routes with different paths
- ✅ Create navigation between pages
- ✅ Implement nested routes for blog categories
- ✅ Use route parameters for blog post details
- ✅ Navigate programmatically based on user actions

---

## Prerequisites

- Node.js 16+ installed
- Basic understanding of Vue 3 Composition API
- Familiarity with Vue component structure

---

## Step 1: Create Project

Create a new Vite project:

```bash
npm create vite@latest vue-blog -- --template vue-ts
cd vue-blog
npm install
```

Install Vue Router:

```bash
npm install vue-router@4
```

---

## Step 2: Project Structure

Create the following folder structure:

```
src/
├── router/
│   └── index.ts
├── views/
│   ├── HomeView.vue
│   ├── AboutView.vue
│   ├── BlogView.vue
│   ├── PostDetailView.vue
│   └── NotFoundView.vue
├── components/
│   ├── AppHeader.vue
│   └── PostCard.vue
├── types/
│   └── index.ts
├── App.vue
└── main.ts
```

---

## Step 3: Define TypeScript Types

Create type definitions for blog posts:

**File: `src/types/index.ts`**

```ts
export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
}

export interface Category {
  id: string
  name: string
  description: string
}
```

---

## Step 4: Configure Router

Create the router configuration:

**File: `src/router/index.ts`**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import views
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import BlogView from '@/views/BlogView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'About Us' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
    meta: { title: 'Blog' }
  },
  {
    path: '/blog/:id',
    name: 'post-detail',
    component: PostDetailView,
    props: true,
    meta: { title: 'Post' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title on navigation
router.afterEach((to) => {
  document.title = `${to.meta.title} | Vue Blog` || 'Vue Blog'
})

export default router
```

> 💡 **IMPORTANT**: We use `props: true` for the post detail route to pass the `id` param as a prop to the component.

---

## Step 5: Install Router in App

**File: `src/main.ts`**

```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.mount('#app')
```

---

## Step 6: Create App Component with Router View

**File: `src/App.vue`**

```ts
<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div id="app">
    <AppHeader />
    
    <main class="container">
      <router-view />
    </main>
    
    <footer class="footer">
      <p>&copy; 2024 Vue Blog. Built with Vue 3 + Vue Router.</p>
    </footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}
</style>
```

---

## Step 7: Create App Header with Navigation

**File: `src/components/AppHeader.vue`**

```ts
<script setup lang="ts">
// No imports needed - router-link is global
</script>

<template>
  <header class="header">
    <div class="container">
      <h1 class="logo">📝 Vue Blog</h1>
      
      <nav class="nav">
        <router-link to="/" exact-active-class="nav-link-exact-active">
          Home
        </router-link>
        <router-link to="/blog" active-class="nav-link-active">
          Blog
        </router-link>
        <router-link to="/about" active-class="nav-link-active">
          About
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.nav-link-exact-active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: 600;
}
</style>
```

---

## Step 8: Create Home View

**File: `src/views/HomeView.vue`**

```ts
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToBlog() {
  router.push('/blog')
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to Vue Blog</h1>
      <p>Explore articles about Vue.js, web development, and modern JavaScript</p>
      <button @click="navigateToBlog" class="btn-primary">
        Read Our Blog →
      </button>
    </section>
    
    <section class="features">
      <div class="feature-card">
        <h3>🚀 Modern Tech Stack</h3>
        <p>Built with Vue 3, TypeScript, and Vite</p>
      </div>
      <div class="feature-card">
        <h3>📱 Responsive Design</h3>
        <p>Optimized for all devices and screen sizes</p>
      </div>
      <div class="feature-card">
        <h3>⚡ Fast Navigation</h3>
        <p>Client-side routing with Vue Router</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.hero p {
  font-size: 1.3rem;
  color: #5a6c7d;
  margin-bottom: 2rem;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary:hover {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.feature-card p {
  color: #5a6c7d;
  margin-bottom: 0;
}
</style>
```

---

## Step 9: Create Blog View with Post List

**File: `src/views/BlogView.vue`**

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PostCard from '@/components/PostCard.vue'
import type { BlogPost } from '@/types'

const router = useRouter()

// Sample blog posts (in real app, fetch from API)
const posts = ref<BlogPost[]>([
  {
    id: 1,
    title: 'Getting Started with Vue 3',
    excerpt: 'Learn the basics of Vue 3 and the Composition API',
    content: 'Full content here...',
    author: 'Jane Doe',
    date: '2024-01-15',
    category: 'Tutorial'
  },
  {
    id: 2,
    title: 'Vue Router Deep Dive',
    excerpt: 'Master client-side routing with Vue Router 4',
    content: 'Full content here...',
    author: 'John Smith',
    date: '2024-01-18',
    category: 'Advanced'
  },
  {
    id: 3,
    title: 'TypeScript with Vue',
    excerpt: 'Add type safety to your Vue applications',
    content: 'Full content here...',
    author: 'Sarah Johnson',
    date: '2024-01-20',
    category: 'Tutorial'
  }
])

function viewPost(id: number) {
  router.push({ name: 'post-detail', params: { id } })
}
</script>

<template>
  <div class="blog">
    <header class="page-header">
      <h1>Blog Posts</h1>
      <p>{{ posts.length }} articles available</p>
    </header>
    
    <div class="posts-grid">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @click="viewPost(post.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #5a6c7d;
  font-size: 1.1rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
</style>
```

---

## Step 10: Create Post Card Component

**File: `src/components/PostCard.vue`**

```ts
<script setup lang="ts">
import type { BlogPost } from '@/types'

defineProps<{
  post: BlogPost
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <article class="post-card" @click="$emit('click')">
    <span class="category-badge">{{ post.category }}</span>
    <h2>{{ post.title }}</h2>
    <p class="excerpt">{{ post.excerpt }}</p>
    <div class="meta">
      <span class="author">👤 {{ post.author }}</span>
      <span class="date">📅 {{ post.date }}</span>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.category-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.post-card h2 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.excerpt {
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #7f8c8d;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}
</style>
```

---

## Step 11: Create Post Detail View

**File: `src/views/PostDetailView.vue`**

```ts
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { BlogPost } from '@/types'

// Receive id as prop (enabled by props: true in route)
const props = defineProps<{
  id: string
}>()

const router = useRouter()

// Sample posts data (in real app, fetch from API)
const allPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with Vue 3',
    excerpt: 'Learn the basics of Vue 3 and the Composition API',
    content: `
      Vue 3 introduces the Composition API, a new way to organize component logic
      that is more flexible and maintainable than the Options API.
      
      The Composition API allows you to extract and reuse logic across components,
      making your codebase more modular and testable.
      
      Key features include:
      - setup() function for component logic
      - Reactive refs with ref() and reactive()
      - Computed properties with computed()
      - Lifecycle hooks as functions (onMounted, onUpdated, etc.)
    `,
    author: 'Jane Doe',
    date: '2024-01-15',
    category: 'Tutorial'
  },
  {
    id: 2,
    title: 'Vue Router Deep Dive',
    excerpt: 'Master client-side routing with Vue Router 4',
    content: `
      Vue Router 4 is designed specifically for Vue 3 and brings many improvements
      over version 3, including better TypeScript support and a more intuitive API.
      
      This guide covers:
      - Setting up Vue Router
      - Defining routes and navigation
      - Nested routes for complex layouts
      - Navigation guards for access control
      - Route transitions and animations
    `,
    author: 'John Smith',
    date: '2024-01-18',
    category: 'Advanced'
  },
  {
    id: 3,
    title: 'TypeScript with Vue',
    excerpt: 'Add type safety to your Vue applications',
    content: `
      TypeScript provides static type checking that catches errors at compile time,
      making your Vue applications more robust and maintainable.
      
      Topics covered:
      - Setting up TypeScript with Vite
      - Typing component props and emits
      - Using TypeScript with Composition API
      - Type-safe routing and state management
    `,
    author: 'Sarah Johnson',
    date: '2024-01-20',
    category: 'Tutorial'
  }
]

const post = ref<BlogPost | null>(null)

const postId = computed(() => Number(props.id))

onMounted(() => {
  post.value = allPosts.find(p => p.id === postId.value) || null
})

function goBack() {
  router.back()
}
</script>

<template>
  <article v-if="post" class="post-detail">
    <button @click="goBack" class="btn-back">← Back to Blog</button>
    
    <header class="post-header">
      <span class="category-badge">{{ post.category }}</span>
      <h1>{{ post.title }}</h1>
      <div class="post-meta">
        <span class="author">👤 {{ post.author }}</span>
        <span class="date">📅 {{ post.date }}</span>
      </div>
    </header>
    
    <div class="post-content">
      <p v-for="(paragraph, index) in post.content.trim().split('\n').filter(p => p.trim())" :key="index">
        {{ paragraph.trim() }}
      </p>
    </div>
  </article>
  
  <div v-else class="not-found">
    <h2>Post Not Found</h2>
    <p>The blog post you're looking for doesn't exist.</p>
    <button @click="goBack" class="btn-primary">← Go Back</button>
  </div>
</template>

<style scoped>
.btn-back {
  background: #ecf0f1;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #bdc3c7;
}

.post-header {
  position: relative;
  padding-bottom: 2rem;
  border-bottom: 2px solid #ecf0f1;
  margin-bottom: 2rem;
}

.category-badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
}

.post-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.post-meta {
  display: flex;
  gap: 2rem;
  color: #7f8c8d;
  font-size: 1rem;
}

.post-content {
  line-height: 1.8;
  color: #34495e;
  font-size: 1.1rem;
}

.post-content p {
  margin-bottom: 1.5rem;
}

.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h2 {
  font-size: 2rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-top: 1rem;
}

.btn-primary:hover {
  background: #764ba2;
}
</style>
```

---

## Step 12: Create About View

**File: `src/views/AboutView.vue`**

```ts
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function contactUs() {
  // In a real app, navigate to contact page
  alert('Contact feature coming soon!')
}
</script>

<template>
  <div class="about">
    <h1>About Vue Blog</h1>
    
    <section class="content">
      <p>
        Welcome to Vue Blog, a demonstration project showcasing the power of
        Vue 3 and Vue Router for building modern single-page applications.
      </p>
      
      <p>
        This blog was built as part of Module 4 (Routing & Navigation) to
        demonstrate key routing concepts including:
      </p>
      
      <ul>
        <li>Router installation and configuration</li>
        <li>Static and dynamic routes</li>
        <li>Declarative and programmatic navigation</li>
        <li>Route parameters and props</li>
        <li>Active link styling</li>
      </ul>
      
      <h2>Technologies Used</h2>
      <div class="tech-stack">
        <span class="tech-badge">Vue 3</span>
        <span class="tech-badge">TypeScript</span>
        <span class="tech-badge">Vue Router 4</span>
        <span class="tech-badge">Vite</span>
      </div>
      
      <button @click="contactUs" class="btn-primary">Contact Us</button>
    </section>
  </div>
</template>

<style scoped>
.about h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content p {
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 1.5rem;
}

.content ul {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.content li {
  margin-bottom: 0.5rem;
  color: #34495e;
}

.content h2 {
  color: #2c3e50;
  margin: 2rem 0 1rem 0;
}

.tech-stack {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.tech-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary:hover {
  background: #764ba2;
  transform: translateY(-2px);
}
</style>
```

---

## Step 13: Create 404 Not Found View

**File: `src/views/NotFoundView.vue`**

```ts
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <button @click="goHome" class="btn-primary">← Go Home</button>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h1 {
  font-size: 6rem;
  color: #e74c3c;
  margin: 0;
}

.not-found h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.not-found p {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary:hover {
  background: #764ba2;
  transform: translateY(-2px);
}
</style>
```

---

## Step 14: Update Global Styles

**File: `src/style.css`**

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: #f8f9fa;
  color: #2c3e50;
}

#app {
  min-height: 100vh;
}
```

---

## Step 15: Run the Application

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Testing Checklist

Test the following features:

- [ ] Home page displays with hero section
- [ ] Navigation links work and highlight correctly
- [ ] Blog page shows list of posts
- [ ] Clicking a post card navigates to post detail
- [ ] Post detail page shows correct content
- [ ] Back button returns to blog list
- [ ] About page displays properly
- [ ] Entering invalid URL shows 404 page
- [ ] Page titles update on navigation
- [ ] Browser back/forward buttons work correctly

---

## Key Concepts Demonstrated

### 1. Router Configuration
- Routes array with path, name, component
- Route meta for page titles
- Catch-all route for 404

### 2. Navigation
- `<router-link>` for declarative navigation
- `router.push()` for programmatic navigation
- Active link classes for styling

### 3. Dynamic Routes
- `:id` parameter in route path
- Route props to pass params as component props
- Accessing route params with `useRoute()`

### 4. Router Lifecycle
- `router.afterEach()` hook for page title updates
- `router.back()` for navigation history

---

## Extensions

Try these enhancements:

1. **Add Categories**: Filter posts by category
2. **Search Feature**: Search posts by title/content
3. **Pagination**: Add pagination to blog list
4. **Route Transitions**: Animate page changes
5. **Breadcrumbs**: Add breadcrumb navigation
6. **Loading States**: Show loading spinner during navigation

---

## Summary

You've built a complete multi-page blog application with:

✅ Properly configured Vue Router  
✅ Multiple routes (home, blog, about, post detail, 404)  
✅ Declarative navigation with `<router-link>`  
✅ Programmatic navigation with `useRouter()`  
✅ Dynamic routes with parameters  
✅ Route props for better component design  
✅ Active link styling  
✅ Page title management  

This project demonstrates all fundamental Vue Router concepts needed for building real-world applications!
