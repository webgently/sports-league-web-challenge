<template>
  <div class="min-h-screen flex flex-col font-primary">
    <AppHeader />

    <main class="flex-grow container max-w-[90%] mx-auto px-4 pt-[60px] pb-[20px]">
      <router-view></router-view>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style>
@import './index.css';
</style>
