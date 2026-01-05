/**
 * MSC Team Loader - Loads team members dynamically from Supabase
 * This script fetches team members from admin dashboard and displays them on the website
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
        console.log('✅ Team Loader: Supabase connected');
        loadTeamMembers();
    } catch (error) {
        console.error('❌ Team Loader: Failed to initialize', error);
    }
})();

// Load team members from Supabase
async function loadTeamMembers() {
    if (!supabaseClient) {
        console.error('Team Loader: Supabase not initialized');
        return;
    }

    try {
        // Fetch all team members
        const { data: members, error } = await supabaseClient
            .from('team_members')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (!members || members.length === 0) {
            console.warn('⚠️ No team members found in database');
            console.warn('Run import-team-to-admin.html to import existing members');
            return;
        }

        console.log(`✅ Loaded ${members.length} team members from database`);

        // Separate chief, board and regular members
        const chiefMembers = members.filter(m => m.type === 'chief');
        const boardMembers = members.filter(m => m.type === 'board');
        const regularMembers = members.filter(m => m.type === 'regular');

        // Render chief board members
        if (chiefMembers.length > 0) {
            renderChiefBoardMembers(chiefMembers);
        }

        // Render board members
        if (boardMembers.length > 0) {
            renderBoardMembers(boardMembers);
        }

        // Render regular team members
        if (regularMembers.length > 0) {
            renderTeamMembers(regularMembers);
        }

    } catch (error) {
        console.error('❌ Error loading team members:', error);
    }
}

// Render chief board members
function renderChiefBoardMembers(members) {
    const chiefBoardGrid = document.querySelector('.chief-board-grid');
    if (!chiefBoardGrid) return;

    // Clear existing hardcoded members
    chiefBoardGrid.innerHTML = '';

    members.forEach(member => {
        const card = createBoardCard(member);
        chiefBoardGrid.appendChild(card);
    });

    console.log(`✅ Rendered ${members.length} chief board members`);
}

// Render board members
function renderBoardMembers(members) {
    const boardGrid = document.querySelector('.board-grid');
    if (!boardGrid) return;

    // Clear existing hardcoded members
    boardGrid.innerHTML = '';

    members.forEach(member => {
        const card = createBoardCard(member);
        boardGrid.appendChild(card);
    });

    console.log(`✅ Rendered ${members.length} board members`);
}

// Render regular team members
function renderTeamMembers(members) {
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;

    // Clear existing hardcoded members
    teamGrid.innerHTML = '';

    members.forEach(member => {
        const card = createTeamCard(member);
        teamGrid.appendChild(card);
    });

    console.log(`✅ Rendered ${members.length} team members`);
}

// Create board member card
function createBoardCard(member) {
    const card = document.createElement('div');
    card.className = 'board-card';
    
    // Handle clickable link
    if (member.link) {
        card.style.cursor = 'pointer';
        card.onclick = () => window.open(member.link, '_blank');
    }

    const imageContent = member.image 
        ? `<img src="${member.image}" alt="${member.name}" class="founder-img">`
        : `<i class="fas fa-user"></i>`;

    card.innerHTML = `
        <div class="board-image">
            <div class="image-placeholder">
                ${imageContent}
            </div>
        </div>
        <div class="board-info">
            <h3>${member.name}</h3>
            <p class="board-role">${member.role}</p>
        </div>
    `;

    return card;
}

// Create team member card
function createTeamCard(member) {
    const card = document.createElement('div');
    card.className = 'team-card';
    
    // Handle clickable link
    if (member.link) {
        card.style.cursor = 'pointer';
        card.onclick = () => window.open(member.link, '_blank');
    }

    const imageContent = member.image 
        ? `<img src="${member.image}" alt="${member.name}" class="team-img">`
        : `<i class="fas fa-user"></i>`;

    card.innerHTML = `
        <div class="team-image">
            <div class="image-placeholder">
                ${imageContent}
            </div>
        </div>
        <div class="team-info">
            <h3>${member.name}</h3>
            <p class="team-role">${member.role}</p>
        </div>
    `;

    return card;
}

// Export for manual use
window.MSC_TEAM_LOADER = {
    reload: loadTeamMembers,
    isReady: () => supabaseClient !== null
};

console.log('✅ Team Loader: Script loaded');
