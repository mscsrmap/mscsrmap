/**
 * MSC Admin Dashboard Sync
 * This script syncs contact form submissions to your Supabase admin dashboard
 * 
 * SETUP:
 * 1. Add this script to your index.html BEFORE script.js
 * 2. Add Supabase CDN script
 * 3. Update SUPABASE_CONFIG with your credentials from supabase-config.js
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES!
// ============================================
const SUPABASE_CONFIG = {
    url: 'https://xqkmijjmgsmaesygoaff.supabase.co', // e.g., https://xxxxx.supabase.co
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa21pamptZ3NtYWVzeWdvYWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTU0NjUsImV4cCI6MjA3NzczMTQ2NX0.HoDL21QuTTRbo76VzKeNRhfxctMjzscdLBD2yQufiC0' // Your public anon key
};

// ============================================
// DO NOT EDIT BELOW THIS LINE
// ============================================

let supabaseClient = null;

// Initialize Supabase client
(function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.log('⏳ Waiting for Supabase library...');
        setTimeout(initSupabase, 100);
        return;
    }
    
    if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
        console.warn('⚠️ MSC Admin Sync: Supabase not configured. Messages will not be saved to admin dashboard.');
        console.warn('📖 Update SUPABASE_CONFIG in msc-admin-sync.js with your credentials');
        return;
    }
    
    try {
        supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        console.log('✅ MSC Admin Sync: Connected to admin dashboard');
    } catch (error) {
        console.error('❌ MSC Admin Sync: Failed to initialize', error);
    }
})();

// Save message to admin dashboard
async function saveToAdminDashboard(name, email, message) {
    if (!supabaseClient) {
        console.log('⚠️ Admin sync skipped - Supabase not initialized');
        return false;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('messages')
            .insert([{
                name: name,
                email: email,
                message: message,
                read: false,
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        
        console.log('✅ Message saved to admin dashboard');
        return true;
    } catch (error) {
        console.error('❌ Failed to save to admin dashboard:', error);
        return false;
    }
}

// Intercept form submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        console.warn('⚠️ Contact form not found');
        return;
    }
    
    // Store original submit handler
    const originalSubmit = contactForm.onsubmit;
    
    // Add admin dashboard sync to form submission
    contactForm.addEventListener('submit', async (e) => {
        // Get form data
        const name = document.getElementById('name')?.value?.trim();
        const email = document.getElementById('email')?.value?.trim();
        const message = document.getElementById('message')?.value?.trim();
        
        if (name && email && message) {
            // Save to admin dashboard (non-blocking - won't affect form submission)
            saveToAdminDashboard(name, email, message).catch(err => {
                console.error('Admin sync error:', err);
            });
        }
    }, { capture: true }); // Use capture phase to run before other handlers
    
    console.log('✅ MSC Admin Sync: Contact form monitoring active');
});

// Export for manual use
window.MSC_ADMIN_SYNC = {
    saveMessage: saveToAdminDashboard,
    isConfigured: () => SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL',
    isReady: () => supabaseClient !== null
};
