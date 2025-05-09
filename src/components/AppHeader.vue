<template>
  <header class="bg-header-bg font-primary">
    <nav class="container mx-auto px-[40px] h-[60px] flex items-center justify-between">
      <router-link to="/schedule" class="flex items-center">
        <img src="/images/logo.svg" alt="League Web UI" class="w-[110px]" />
      </router-link>
      <div class="flex items-center space-x-[40px]">
        <router-link to="/schedule" class="text-menu-text text-menu flex items-center">
          <img src="/images/schedule.png" alt="Schedule" class="h-[25px] w-[25px] mr-2" />
          Schedule
        </router-link>
        <router-link to="/leaderboard" class="text-menu-text text-menu flex items-center">
          <img src="/images/leaderboard.png" alt="Leaderboard" class="h-[25px] w-[25px] mr-2" />
          Leaderboard
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
};
</script>
