<template>
  <div class="font-primary">
    <h1 class="text-heading font-bold mb-[20px] text-center">League Standings</h1>
    <div
      v-if="isLoading"
      class="flex justify-center items-center min-h-[200px]"
      role="status"
      aria-label="Loading standings"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-4" role="alert">
      {{ error }}
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse" aria-label="League Standings">
        <thead class="bg-table-header">
          <tr class="h-[40px]">
            <th class="table-header text-left w-[180px]" scope="col">Team Name</th>
            <th class="table-header text-center" scope="col" title="Matches Played">MP</th>
            <th class="table-header text-center hidden md:table-cell" scope="col" title="Goals For">GF</th>
            <th class="table-header text-center hidden md:table-cell" scope="col" title="Goals Against">GA</th>
            <th class="table-header text-center table-cell md:hidden" scope="col" title="Goal Difference">GD</th>
            <th class="table-header text-center" scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in standings" :key="team.teamName">
            <td class="table-cell">
              <div class="flex items-center gap-[14px] font-bold">
                <div class="flag-wrapper">
                  <img :src="getCountryFlag(team.teamName)" :alt="team.teamName" class="flag-image" />
                </div>
                {{ team.teamName }}
              </div>
            </td>
            <td class="table-cell text-center">{{ team.matchesPlayed }}</td>
            <td class="table-cell text-center hidden md:table-cell">
              {{ team.goalsFor }}
            </td>
            <td class="table-cell text-center hidden md:table-cell">
              {{ team.goalsAgainst }}
            </td>
            <td class="table-cell text-center table-cell md:hidden">
              {{ team.goalsFor - team.goalsAgainst }}
            </td>
            <td class="table-cell text-center font-bold !text-table-special-text">
              {{ team.points }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import LeagueService from '../services/LeagueService';

export default {
  name: 'LeaderboardView',
  setup() {
    const standings = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const leagueService = new LeagueService();

    const getCountryFlag = (country) => {
      return `https://flagsapi.codeaid.io/${encodeURIComponent(country)}.png`;
    };

    onMounted(async () => {
      try {
        isLoading.value = true;
        error.value = null;
        await leagueService.fetchData();
        standings.value = leagueService.getLeaderboard();
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        error.value = 'Failed to load standings. Please try again later.';
      } finally {
        isLoading.value = false;
      }
    });

    return {
      standings,
      isLoading,
      error,
      getCountryFlag
    };
  }
};
</script>

<style scoped>
.table-header {
  @apply text-text text-th px-[20px];
}

.table-cell {
  @apply text-text text-table-cell border-b border-table-border h-[70px] px-[20px];
}

.flag-wrapper {
  @apply w-[53px] h-[37px] relative;
}

.flag-image {
  @apply w-full h-full object-cover;
}
</style>
