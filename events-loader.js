/**
 * MSC Events Loader - Loads events dynamically from Supabase
 * This script fetches events from admin dashboard and displays them on the website
 */

// Supabase Configuration (same as msc-admin-sync.js)
const SUPABASE_CONFIG = {
    url: 'https://xqkmijjmgsmaesygoaff.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa21pamptZ3NtYWVzeWdvYWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTU0NjUsImV4cCI6MjA3NzczMTQ2NX0.HoDL21QuTTRbo76VzKeNRhfxctMjzscdLBD2yQufiC0'
};

let supabaseClient = null;

// Initialize Supabase
(function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        setTimeout(initSupabase, 100);
        return;
    }
    
    try {
        supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        console.log('✅ Events Loader: Supabase connected');
        loadEvents();
    } catch (error) {
        console.error('❌ Events Loader: Failed to initialize', error);
    }
})();

// Load events from Supabase
async function loadEvents() {
    if (!supabaseClient) {
        console.error('Events Loader: Supabase not initialized');
        return;
    }

    try {
        // Fetch all events
        const { data: events, error } = await supabaseClient
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!events || events.length === 0) {
            console.warn('⚠️ No events found in database');
            return;
        }

        console.log(`✅ Loaded ${events.length} events from database`);

        // Render events
        renderEvents(events);

    } catch (error) {
        console.error('❌ Error loading events:', error);
    }
}

// Render events
function renderEvents(events) {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    // Clear existing hardcoded events
    eventsGrid.innerHTML = '';

    events.forEach(event => {
        const card = createEventCard(event);
        eventsGrid.appendChild(card);
    });

    console.log(`✅ Rendered ${events.length} events`);
}

// Create event card
function createEventCard(event) {
    const card = document.createElement('div');
    const className = event.class_name || event.className || '';
    card.className = `event-card past-event ${className}`;

    card.innerHTML = `
        <div class="event-date">
            <span class="month">${event.month}</span>
            <span class="day">${event.day}</span>
        </div>
        <div class="event-content">
            <h4>${event.title}</h4>
            <p>${event.description}</p>
            <div class="event-details">
                <span class="event-time">
                    <i class="fas fa-clock"></i> ${event.status}
                </span>
                <span class="event-location">
                    <i class="fas fa-map-marker-alt"></i> ${event.location}
                </span>
            </div>
        </div>
    `;

    return card;
}

// Export for manual use
window.MSC_EVENTS_LOADER = {
    reload: loadEvents,
    isReady: () => supabaseClient !== null
};

console.log('✅ Events Loader: Script loaded');
