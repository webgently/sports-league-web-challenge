<template>
  <div class="font-primary">
    <h1 class="text-heading font-bold mb-[20px] text-center">League Schedule</h1>
    <div
      v-if="isLoading"
      class="flex justify-center items-center min-h-[200px]"
      role="status"
      aria-label="Loading matches"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-4" role="alert">
      {{ error }}
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse" aria-label="Match Schedule">
        <thead class="bg-table-header">
          <tr class="h-[40px]">
            <th class="table-header hidden md:table-cell text-right" scope="col">Date/Time</th>
            <th class="table-header hidden lg:table-cell text-left" scope="col">Stadium</th>
            <th class="table-header text-right" scope="col">
              <span>Home Team</span>
            </th>
            <th class="table-header-center" scope="col" />
            <th class="table-header text-left" scope="col">
              <span>Away Team</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(match, index) in matches" :key="index" :class="{ 'bg-table-row-even': index % 2 === 1 }">
            <td class="table-cell hidden md:table-cell text-right max-w-[90px]">
              {{ formatDate(match.matchDate) }}
            </td>
            <td class="table-cell hidden lg:table-cell text-left">
              {{ match.stadium }}
            </td>
            <td class="table-cell text-right">
              <div class="flex justify-end items-center gap-[14px]">
                {{ match.homeTeam }}
                <div class="flag-wrapper">
                  <img :src="getCountryFlag(match.homeTeam)" :alt="match.homeTeam" class="flag-image" />
                </div>
              </div>
            </td>
            <td class="text-text text-table-cell text-center font-bold whitespace-nowrap">
              {{ match.matchPlayed ? `${match.homeTeamScore} : ${match.awayTeamScore}` : '- : -' }}
            </td>
            <td class="table-cell">
              <div class="flex items-center gap-[14px]">
                <div class="flag-wrapper">
                  <img :src="getCountryFlag(match.awayTeam)" :alt="match.awayTeam" class="flag-image" />
                </div>
                {{ match.awayTeam }}
              </div>
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
  name: 'ScheduleView',
  setup() {
    const matches = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const leagueService = new LeagueService();

    const formatDate = (date) => {
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      };
      return new Date(date).toLocaleString('en-GB', options).replace(/,|\//g, (match) => (match === ',' ? '' : '.'));
    };

    const getCountryFlag = (country) => {
      return `https://flagsapi.codeaid.io/${encodeURIComponent(country)}.png`;
    };

    onMounted(async () => {
      try {
        isLoading.value = true;
        error.value = null;
        await leagueService.fetchData();
        matches.value = leagueService.getMatches();
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        error.value = 'Failed to load matches. Please try again later.';
      } finally {
        isLoading.value = false;
      }
    });

    return {
      matches,
      isLoading,
      error,
      formatDate,
      getCountryFlag
    };
  }
};
</script>

<style scoped>
.table-header {
  @apply text-text text-th px-[20px];
}

.table-header-center {
  @apply text-text text-center;
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
