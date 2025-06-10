const matchGrid = document.getElementById('matches');
const leagueSelect = document.getElementById('league-select');
const teamSelect = document.getElementById('team-select');
const noMatches = document.getElementById('no-matches');
const darkToggle = document.getElementById('dark-toggle');
const filterToggle = document.getElementById('filter-toggle');
const filtersDiv = document.getElementById('filters');

let matches = [];

async function fetchMatches() {
  try {
    const res = await fetch('/api/matches');
    const data = await res.json();
    matches = data.matches || [];
    populateFilters();
    renderMatches();
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

function populateFilters() {
  const leagues = new Set();
  const teams = new Set();

  matches.forEach(match => {
    if (match.competition) leagues.add(match.competition.name);
    teams.add(match.homeTeam.name);
    teams.add(match.awayTeam.name);
  });

  leagueSelect.innerHTML = `<option value="">All Leagues</option>`;
  teamSelect.innerHTML = `<option value="">All Teams</option>`;

  leagues.forEach(league => {
    leagueSelect.innerHTML += `<option value="${league}">${league}</option>`;
  });

  teams.forEach(team => {
    teamSelect.innerHTML += `<option value="${team}">${team}</option>`;
  });
}

function renderMatches() {
  const selectedLeague = leagueSelect.value;
  const selectedTeam = teamSelect.value;

  matchGrid.innerHTML = '';
  let filtered = matches;

  if (selectedLeague)
    filtered = filtered.filter(m => m.competition.name === selectedLeague);

  if (selectedTeam)
    filtered = filtered.filter(m => m.homeTeam.name === selectedTeam || m.awayTeam.name === selectedTeam);

  if (filtered.length === 0) {
    noMatches.style.display = 'block';
    return;
  }

  noMatches.style.display = 'none';

  filtered.forEach(match => {
    const card = document.createElement('div');
    card.className = 'match-card';

    const title = document.createElement('div');
    title.className = 'match-title';
    title.textContent = `${match.homeTeam.name} vs ${match.awayTeam.name}`;

    const date = document.createElement('div');
    date.className = 'match-date';
    date.textContent = new Date(match.utcDate).toLocaleString();

    const status = document.createElement('div');
    status.className = 'match-status';
    status.textContent = match.status === 'LIVE' ? '🔴 LIVE' : match.status;

    const logos = document.createElement('div');
    logos.className = 'team-logos';

    const homeLogo = document.createElement('img');
    const awayLogo = document.createElement('img');

    homeLogo.src = match.homeTeam.crest || '';
    awayLogo.src = match.awayTeam.crest || '';

    logos.appendChild(homeLogo);
    logos.appendChild(awayLogo);

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(status);
    card.appendChild(logos);

    matchGrid.appendChild(card);
  });
}

leagueSelect.addEventListener('change', renderMatches);
teamSelect.addEventListener('change', renderMatches);

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

filterToggle.addEventListener('click', () => {
  filtersDiv.classList.toggle('show');
});

fetchMatches();
setInterval(refreshMatches, 60000);