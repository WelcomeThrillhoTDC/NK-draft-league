const SPREADSHEET_ID = "1BUaE0fYx0trpWqPQkQpeGWYmAAJvUvcZKDS78HjE7N8";

const seasons = [
  { label: "Lorwyn Eclipsed", tab: "Lorwyn Eclipsed" },
  { label: "Avatar: The Last Airbender", tab: "Avatar: The Last Airbender" },
  { label: "Marvel's Spider-Man", tab: "Marvel's Spider-Man" },
  { label: "Edge of Eternities", tab: "Edge of Eternities" },
  { label: "Final Fantasy", tab: "Final Fantasy" },
  { label: "Tarkir: Dragonstorm", tab: "Tarkir: Dragonstorm" },
  { label: "Aetherdrift", tab: "Aetherdrift" }
];

const seasonSelect = document.getElementById("season-select");
const titleEl = document.getElementById("leaderboard-title");
const tbody = document.getElementById("table-body");

// Build dropdown - populate once
seasonSelect.innerHTML = ""; // Clear any existing options from HTML
seasons.forEach(season => {
  const option = document.createElement("option");
  option.value = season.tab;
  option.textContent = season.label;
  seasonSelect.appendChild(option);
});

let currentPlayers = [];
let currentSort = { key: "Points", direction: "desc" };

function updateLeaderboardTitle() {
  const season = seasonSelect.value;
  titleEl.textContent = `${season} Leaderboard`;
}

// Update on page load
updateLeaderboardTitle();

// Update when season changes
seasonSelect.addEventListener("change", updateLeaderboardTitle);

function loadSeason(tabName) {
  const url = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${encodeURIComponent(tabName)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      currentPlayers = data.map(p => ({
        ...p,
        Points: Number(p.Points) || 0,
        Wins: Number(p.Wins) || 0,
        Draws: Number(p.Draws) || 0,
        Matches: Number(p.Matches) || 0
      }));

      // 🔒 Always start sorted by Points (desc)
      currentSort = { key: "Points", direction: "asc" };
      sortAndRender();
    })
    .catch(() => {
      tbody.innerHTML =
        "<tr><td colspan='7'>Failed to load season</td></tr>";
    });
}
function sortPlayersForRanking(players) {
  return [...players].sort((a, b) => {
    if (b.Points !== a.Points) return b.Points - a.Points;
    if (b.Wins !== a.Wins) return b.Wins - a.Wins;
    if (b.Matches !== a.Matches) return b.Matches - a.Matches;
    return a.Player.localeCompare(b.Player);
  });
}

function applyCompetitionRanking(sortedPlayers) {
  let rank = 1;
  let prev = null;

  return sortedPlayers.map((player, index) => {
    if (
      prev &&
      player.Points === prev.Points &&
      player.Wins === prev.Wins &&
      player.Matches === prev.Matches
    ) {
      // Same stats → same rank
      player.Rank = prev.Rank;
    } else {
      // New rank = index + 1 (competition ranking)
      player.Rank = index + 1;
    }

    prev = player;
    return player;
  });
}


function sortAndRender() {
  const sorted = sortPlayersForRanking(currentPlayers);
  const ranked = applyCompetitionRanking(sorted);

  renderTable(ranked);
}

function renderTable(players) {
  tbody.innerHTML = "";

  players.forEach((p, index) => {

    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr class="${p.Rank <= 8 ? "top-eight" : ""}">
        <td>${p.Rank}</td>
        <td>
          <a class="player-link"
            href="players/index.html?player=${encodeURIComponent(p.Player)}">
            ${p.Player}
          </a>
        </td>
        <td>${p.Points}</td>
        <td>${p.Wins}</td>
        <td>${p.Draws ?? 0}</td>
        <td>${p.Matches}</td>
        <td>${p.WinPct}</td>
      </tr>`
    );

  });
}

// Load newest season by default
loadSeason(seasons[0].tab);

// Switch seasons
seasonSelect.addEventListener("change", e => {
  loadSeason(e.target.value);
});



