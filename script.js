const SUPABASE_URL = 'https://vmbtqpnbbikuzbclronp.supabase.co'; // Your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYnRxcG5iYmlrdXpiY2xyb25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNzEwMTIsImV4cCI6MjA0NTg0NzAxMn0.WgBvoA9m_xKQ040B38Z8QIzEvIZq56gF5O96SxUYN-c'; // Your Supabase API Key
let supabase;

// Function to dynamically load Supabase library
function loadSupabaseLibrary() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Supabase library'));
        document.head.appendChild(script);
    });
}

// Show selected page and load data if necessary
async function showPage(page) {
    document.querySelectorAll('.page').forEach(pg => pg.classList.add('hidden'));
    const selectedPage = document.getElementById(page);
    selectedPage.classList.remove('hidden');

    // Load data based on the selected page
    if (page === 'viewConfessions') {
        await loadConfessions();
    } else if (page === 'viewPosts') {
        await loadPosts();
    } else if (page === 'chatRoom') {
        await loadChat();
    }
}

// Submit a new confession
async function submitConfession() {
    if (!supabase) return;
    const content = document.getElementById('confessionInput').value.trim();
    if (content) {
        try {
            const { error } = await supabase.from('confessions').insert([{ content }]);
            if (error) throw error;
            document.getElementById('confessionInput').value = '';
            // Optionally reload confessions after submission
            await loadConfessions();
        } catch (error) {
            console.error('Error submitting confession:', error.message);
        }
    }
}

// Load confessions
async function loadConfessions() {
    if (!supabase) return;
    try {
        const { data, error } = await supabase.from('confessions').select('*').order('timestamp', { ascending: false });
        if (error) throw error;
        const list = document.getElementById('confessionList');
        list.innerHTML = data.map(confession => `<p>${confession.content}</p>`).join('');
    } catch (error) {
        console.error('Error loading confessions:', error.message);
    }
}

// Submit a new post
async function submitPost() {
    if (!supabase) return;
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    if (title && content) {
        try {
            const { error } = await supabase.from('posts').insert([{ title, content }]);
            if (error) throw error;
            document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';
            // Optionally reload posts after submission
            await loadPosts();
        } catch (error) {
            console.error('Error submitting post:', error.message);
        }
    }
}

// Load posts
async function loadPosts() {
    if (!supabase) return;
    try {
        const { data, error } = await supabase.from('posts').select('*').order('timestamp', { ascending: false });
        if (error) throw error;
        const list = document.getElementById('postList');
        list.innerHTML = data.map(post => `<p><strong>${post.title}</strong>: ${post.content}</p>`).join('');
    } catch (error) {
        console.error('Error loading posts:', error.message);
    }
}

// Send a chat message
async function sendMessage() {
    if (!supabase) return;
    const message = document.getElementById('chatInput').value.trim();
    if (message) {
        try {
            const { error } = await supabase.from('chat').insert([{ message }]);
            if (error) throw error;
            document.getElementById('chatInput').value = '';
            // Optionally reload chat messages after sending
            await loadChat();
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    }
}

// Load chat messages
async function loadChat() {
    if (!supabase) return;
    try {
        const { data, error } = await supabase.from('chat').select('*').order('timestamp', { ascending: false });
        if (error) throw error;
        const list = document.getElementById('chatList');
        list.innerHTML = data.map(chat => `<p>${chat.message}</p>`).join('');
    } catch (error) {
         console.error('Error loading chat:', error.message);
     }
}

// Initialize the app
async function initializeApp() {
     const initialized = await loadSupabaseLibrary();
     if (initialized) {
         // Load existing confessions, posts, and chat messages immediately upon initialization
         await Promise.all([loadConfessions(), loadPosts(), loadChat()]);
     } else {
         console.error('Failed to initialize Supabase. Please check your internet connection and try again.');
     }
}

// Initial load
document.addEventListener('DOMContentLoaded', initializeApp);