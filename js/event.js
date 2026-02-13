

const params = new URLSearchParams(window.location.search);
const eventName = params.get("event");
const eventDisplayName = params.get("name"); 

const list = document.getElementById("events-list");

// const SPREADSHEET_ID = "1BUaE0fYx0trpWqPQkQpeGWYmAAJvUvcZKDS78HjE7N8";



document.getElementById("event-title").textContent = eventDisplayName || eventName;

if (!eventName) {
  console.error("No event specified in URL");
  document.getElementById("event-title").textContent = "Event not found";
  throw new Error("Missing event parameter");
}

const url = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${encodeURIComponent(eventName)}`;

console.log("Fetching event data from:", url);

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Event data:", data);
    // render table here
  })
  .catch(err => {
    console.error("Failed to load event data", err);
  });

async function loadEvent() {
  const url = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${encodeURIComponent(eventName)}`;
  const data = await fetch(url).then(r => r.json());

  const body = document.getElementById("event-body");
  body.innerHTML = "";

  data.forEach(row => {
    body.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${row.Rank}</td>
        <td>
          <a href="../players/index.html?player=${encodeURIComponent(row.Name)}">
            ${row.Name}
          </a>
        </td>
        <td>${row.Pod}</td>
        <td>${row.Points}</td>
        <td>${row["OMW%"]}</td>
        <td>${row["GW%"]}</td>
        <td>${row["OGW%"]}</td>
      </tr>`
    );
  });

renderNotableUpsets(data);

}

function renderNotableUpsets(data) {
  const card = document.getElementById("notable-upsets-card");
  const tbody = document.getElementById("upsets-body");
  if (!card || !tbody) return;

  tbody.innerHTML = "";

  const upsets = data
    .filter(r => r.Winner && r.Loser && (r["Elo change"] || r["Δ ELO"]))
    .sort((a, b) => {
      const aElo = Number(a["Elo change"] ?? a["Δ ELO"]) || 0;
      const bElo = Number(b["Elo change"] ?? b["Δ ELO"]) || 0;
      return bElo - aElo; // high → low
    });

  // 🚫 No data → remove card entirely
  if (!upsets.length) {
    card.remove();
    return;
  }

  // ✅ Data exists → render rows
  upsets.forEach(r => {
    const elo = Number(r["Elo change"] ?? r["Δ ELO"]) || 0;
    const eloClass =
      elo > 0 ? "elo-up" : elo < 0 ? "elo-down" : "";

    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${r.Winner} (${r["Winner Rating"]})</td>
        <td>${r.Loser} (${r["Loser Rating"]})</td>
        <td class="${eloClass}">
          ${elo > 0 ? "+" : ""}${elo}
        </td>
      </tr>`
    );
  });
}

loadEvent();