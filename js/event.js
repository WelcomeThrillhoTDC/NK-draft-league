const params = new URLSearchParams(window.location.search);
const eventName = params.get("event");
// const SPREADSHEET_ID = "1BUaE0fYx0trpWqPQkQpeGWYmAAJvUvcZKDS78HjE7N8";

document.getElementById("event-title").textContent = eventName;

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
          <a href="../player.html?player=${encodeURIComponent(row.Name)}">
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
}

loadEvent();