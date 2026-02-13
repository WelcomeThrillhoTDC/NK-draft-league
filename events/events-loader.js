// Load and render events from config
function loadEvents() {
  // Render Draft League Events
  const draftLeagueContainer = document.getElementById('draft-league-events');
  EVENTS_CONFIG.draftLeagueEvents.forEach(event => {
    const row = document.createElement('div');
    row.className = 'events-row';
    row.innerHTML = `
      <div class="event-name">
        <a href="event.html?event=${encodeURIComponent(event.eventParam)}&name=${encodeURIComponent(event.name)}">
          ${event.name}
        </a>
      </div>
      <div class="event-date">${event.date}</div>
    `;
    draftLeagueContainer.appendChild(row);
  });

  // Render Other Events
  const otherEventsContainer = document.getElementById('other-events');
  EVENTS_CONFIG.otherEvents.forEach(event => {
    const row = document.createElement('div');
    row.className = 'events-row';
    row.innerHTML = `
      <div class="event-name">
        <a href="event.html?event=${encodeURIComponent(event.eventParam)}&name=${encodeURIComponent(event.name)}">
          ${event.name}
        </a>
      </div>
      <div class="event-date">${event.date}</div>
    `;
    otherEventsContainer.appendChild(row);
  });
}

// Load events when page loads
loadEvents();