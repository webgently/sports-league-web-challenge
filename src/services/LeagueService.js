/**
 * A class representing a service that processes the data for match schedule
 * and generates leaderboard.
 * 
 * NOTE: MAKE SURE TO IMPLEMENT ALL EXISITNG METHODS BELOW WITHOUT CHANGING THE INTERFACE OF THEM, 
 *       AND PLEASE DO NOT RENAME, MOVE OR DELETE THIS FILE.  
 * 
 *       ADDITIONALLY, MAKE SURE THAT ALL LIBRARIES USED IN THIS FILE FILE ARE COMPATIBLE WITH PURE JAVASCRIPT
 * 
 */
class LeagueService {    
    constructor() {
        this.matches = [];
    }
    
    /**
     * Sets the match schedule.
     * Match schedule will be given in the following form:
     * [
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      }
     * ]
     * 
     * @param {Array} matches List of matches.
     */    
    setMatches(matches) {
        this.matches = matches;
    }

    /**
     * Returns the full list of matches.
     * 
     * @returns {Array} List of matches.
     */
    getMatches() {
        return this.matches;
    }

    /**
     * Returns the leaderboard in a form of a list of JSON objects.
     * 
     * [     
     *      {
     *          teamName: [STRING]',
     *          matchesPlayed: [INTEGER],
     *          goalsFor: [INTEGER],
     *          goalsAgainst: [INTEGER],
     *          points: [INTEGER]     
     *      }
     * ]       
     * 
     * @returns {Array} List of teams representing the leaderboard.
     */
    getLeaderboard() {
        const teams = new Map();

        // Process all matches to build team statistics
        for (const match of this.matches) {
            if (!match.matchPlayed) continue;

            // Initialize or get teams
            const homeTeam = teams.get(match.homeTeam) || {
                teamName: match.homeTeam,
                matchesPlayed: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0,
                headToHead: new Map()
            };
            const awayTeam = teams.get(match.awayTeam) || {
                teamName: match.awayTeam,
                matchesPlayed: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0,
                headToHead: new Map()
            };

            if (!teams.has(match.homeTeam)) teams.set(match.homeTeam, homeTeam);
            if (!teams.has(match.awayTeam)) teams.set(match.awayTeam, awayTeam);

            // Update match statistics
            homeTeam.matchesPlayed++;
            awayTeam.matchesPlayed++;
            
            homeTeam.goalsFor += match.homeTeamScore;
            homeTeam.goalsAgainst += match.awayTeamScore;
            
            awayTeam.goalsFor += match.awayTeamScore;
            awayTeam.goalsAgainst += match.homeTeamScore;

            // Update points and head-to-head
            if (match.homeTeamScore > match.awayTeamScore) {
                homeTeam.points += 3;
                this.updateHeadToHead(homeTeam, awayTeam, 3, 0);
            } else if (match.homeTeamScore < match.awayTeamScore) {
                awayTeam.points += 3;
                this.updateHeadToHead(homeTeam, awayTeam, 0, 3);
            } else {
                homeTeam.points += 1;
                awayTeam.points += 1;
                this.updateHeadToHead(homeTeam, awayTeam, 1, 1);
            }
        }

        return Array.from(teams.values())
            .sort((a, b) => {
                // Points comparison
                if (b.points !== a.points) return b.points - a.points;
                
                // Head-to-head comparison
                const h2h = this.compareHeadToHead(a, b);
                if (h2h !== 0) return h2h;
                
                // Goal difference comparison
                const goalDiff = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
                if (goalDiff !== 0) return goalDiff;
                
                // Goals scored comparison
                if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
                
                // Alphabetical order
                return a.teamName.localeCompare(b.teamName);
            })
            .map(({ teamName, matchesPlayed, goalsFor, goalsAgainst, points }) => ({
                teamName,
                matchesPlayed,
                goalsFor,
                goalsAgainst,
                points
            }));
    }

    /**
     * Updates head-to-head records between two teams
     */
    updateHeadToHead(homeTeam, awayTeam, homePoints, awayPoints) {
        if (!homeTeam.headToHead.has(awayTeam.teamName)) {
            homeTeam.headToHead.set(awayTeam.teamName, 0);
        }
        if (!awayTeam.headToHead.has(homeTeam.teamName)) {
            awayTeam.headToHead.set(homeTeam.teamName, 0);
        }
        
        homeTeam.headToHead.set(awayTeam.teamName, homeTeam.headToHead.get(awayTeam.teamName) + homePoints);
        awayTeam.headToHead.set(homeTeam.teamName, awayTeam.headToHead.get(homeTeam.teamName) + awayPoints);
    }

    /**
     * Compares head-to-head records between two teams
     */
    compareHeadToHead(teamA, teamB) {
        const h2hPointsA = teamA.headToHead.get(teamB.teamName) || 0;
        const h2hPointsB = teamB.headToHead.get(teamA.teamName) || 0;
        return h2hPointsB - h2hPointsA;
    }
    
    /**
     * Asynchronic function to fetch the data from the server and set the matches.
     */
    async fetchData() {
        try {
            // Get access token first
            const tokenResponse = await fetch('http://localhost:3001/api/v1/getAccessToken');
            if (!tokenResponse.ok) {
                throw new Error(`Failed to get access token: ${tokenResponse.status} ${tokenResponse.statusText}`);
            }
            const tokenData = await tokenResponse.json();
            if (!tokenData.access_token) {
                throw new Error('Invalid access token response');
            }
            const accessToken = tokenData.access_token;

            // Fetch matches with the access token
            const matchesResponse = await fetch('http://localhost:3001/api/v1/getAllMatches', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!matchesResponse.ok) {
                throw new Error(`Failed to fetch matches: ${matchesResponse.status} ${matchesResponse.statusText}`);
            }
            const matchesData = await matchesResponse.json();
            
            if (!matchesData.success || !Array.isArray(matchesData.matches)) {
                throw new Error('Invalid matches data received');
            }
            this.setMatches(matchesData.matches);
        } catch (error) {
            console.error('Error fetching data:', error.message);
            throw error;
        }
    }   
}

export default LeagueService;