/**
 * 
 *  THIS IS A TESTING FILE. YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO TEST YOUR WORK.
 *  PLEASE DON´T CHANGE THE INTERFACE OF leagueService.js METHODS
 *
 */

require('jest-fetch-mock').enableMocks();
fetchMock.dontMock();

import LeagueService from "../src/services/LeagueService";

describe("schedule", () => {
  let leagueService;

  beforeEach(() => {
    leagueService = new LeagueService();
  });

  test('check-schedule-matches', async () => {
    const testMatches = [
      {
        matchDate: 1743166597000,
        stadium: 'Maracanã',
        homeTeam: 'Brazil',
        awayTeam: 'Serbia',
        matchPlayed: true,
        homeTeamScore: 1,
        awayTeamScore: 0
      },
      {
        matchDate: 1743166597000,
        stadium: 'Stade de Suisse',
        homeTeam: 'Switzerland',
        awayTeam: 'Serbia',
        matchPlayed: false,
        homeTeamScore: 0,
        awayTeamScore: 0
      }
    ];

    // Set the matches
    leagueService.setMatches(testMatches);

    // Get the matches and verify
    const matches = leagueService.getMatches();

    // Check if matches array exists and has correct length
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBe(2);

    // Check first match details
    const firstMatch = matches[0];
    expect(firstMatch.matchDate).toBe(1743166597000);
    expect(firstMatch.stadium).toBe('Maracanã');
    expect(firstMatch.homeTeam).toBe('Brazil');
    expect(firstMatch.awayTeam).toBe('Serbia');
    expect(firstMatch.matchPlayed).toBe(true);
    expect(firstMatch.homeTeamScore).toBe(1);
    expect(firstMatch.awayTeamScore).toBe(0);

    // Check second match details
    const secondMatch = matches[1];
    expect(secondMatch.matchDate).toBe(1743166597000);
    expect(secondMatch.stadium).toBe('Stade de Suisse');
    expect(secondMatch.homeTeam).toBe('Switzerland');
    expect(secondMatch.awayTeam).toBe('Serbia');
    expect(secondMatch.matchPlayed).toBe(false);
    expect(secondMatch.homeTeamScore).toBe(0);
    expect(secondMatch.awayTeamScore).toBe(0);
  });

  test('check-fetch-matches', async () => {
    // Mock the fetch responses
    fetchMock.mockResponses(
      [
        JSON.stringify({
          success: true,
          access_token: 'YuHBdSlDXY000xa8IlCm7Qgq4_s'
        }),
        { status: 200 }
      ],
      [
        JSON.stringify({
          success: true,
          matches: [
            {
              matchDate: 1743166597000,
              stadium: 'Maracanã',
              homeTeam: 'Brazil',
              awayTeam: 'Serbia',
              matchPlayed: true,
              homeTeamScore: 1,
              awayTeamScore: 0
            },
            {
              matchDate: 1743166597000,
              stadium: 'Stade de Suisse',
              homeTeam: 'Switzerland',
              awayTeam: 'Serbia',
              matchPlayed: true,
              homeTeamScore: 2,
              awayTeamScore: 2
            },
            {
              matchDate: 1743166597000,
              stadium: 'Stadion Rajko Mitic',
              homeTeam: 'Serbia',
              awayTeam: 'Cameroon',
              matchPlayed: true,
              homeTeamScore: 0,
              awayTeamScore: 1
            },
            {
              matchDate: 1743166597000,
              stadium: 'Maracanã',
              homeTeam: 'Brazil',
              awayTeam: 'Switzerland',
              matchPlayed: true,
              homeTeamScore: 3,
              awayTeamScore: 0
            },
            {
              matchDate: 1743166597000,
              stadium: 'Maracanã',
              homeTeam: 'Brazil',
              awayTeam: 'Cameroon',
              matchPlayed: true,
              homeTeamScore: 4,
              awayTeamScore: 4
            },
            {
              matchDate: 1743166597000,
              stadium: 'Stade de Suisse',
              homeTeam: 'Switzerland',
              awayTeam: 'Cameroon',
              matchPlayed: true,
              homeTeamScore: 2,
              awayTeamScore: 2
            }
          ]
        }),
        { status: 200 }
      ]
    );

    // Test the fetchData method
    await leagueService.fetchData();

    // Get the matches and verify
    const matches = leagueService.getMatches();
    
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBe(6);
    
    // Check first match
    const firstMatch = matches[0];
    expect(firstMatch.homeTeam).toBe('Brazil');
    expect(firstMatch.awayTeam).toBe('Serbia');
    expect(firstMatch.matchPlayed).toBe(true);
    expect(firstMatch.homeTeamScore).toBe(1);
    expect(firstMatch.awayTeamScore).toBe(0);

    // Check last match
    const lastMatch = matches[5];
    expect(lastMatch.homeTeam).toBe('Switzerland');
    expect(lastMatch.awayTeam).toBe('Cameroon');
    expect(lastMatch.matchPlayed).toBe(true);
    expect(lastMatch.homeTeamScore).toBe(2);
    expect(lastMatch.awayTeamScore).toBe(2);

    // Verify that fetch was called with correct endpoints
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/getAccessToken');
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/getAllMatches', {
      headers: {
        'Authorization': 'Bearer YuHBdSlDXY000xa8IlCm7Qgq4_s'
      }
    });
  });
}); 