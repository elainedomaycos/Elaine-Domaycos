// Admin authentication and CMS access control
let isSignUp = false;
let currentUser = null;

function getBackend() {
    return window.PortfolioBackend || null;
}

function getSupabase() {
    const backend = getBackend();
    return backend?.getClient ? backend.getClient() : null;
}

function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;

    if (type === 'error' || type === 'success') {
        setTimeout(() => {
            statusEl.className = 'status-message';
        }, 5000);
    }
}

function setLoading(isLoading) {
    const spinner = document.getElementById('loadingSpinner');
    const btn = document.getElementById('authBtn');

    if (isLoading) {
        spinner.classList.add('active');
        btn.disabled = true;
    } else {
        spinner.classList.remove('active');
        btn.disabled = false;
    }
}

function toggleAuthMode() {
    isSignUp = !isSignUp;
    const form = document.getElementById('authForm');
    const authBtn = document.getElementById('authBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleLink = document.getElementById('toggleLink');

    if (isSignUp) {
        form.querySelector('label').textContent = 'Email';
        authBtn.textContent = 'Create Account';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Sign In';
    } else {
        form.querySelector('label').textContent = 'Email';
        authBtn.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
    }
}

async function handleAuth(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showStatus('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showStatus('Password must be at least 6 characters', 'error');
        return;
    }

    setLoading(true);

    try {
        const supabase = getSupabase();

        if (!supabase) {
            showStatus('Supabase not configured. Check your settings.', 'error');
            setLoading(false);
            return;
        }

        let result;

        if (isSignUp) {
            result = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/admin.html`
                }
            });

            if (result.error) {
                showStatus(`Sign up failed: ${result.error.message}`, 'error');
            } else if (result.data.user) {
                showStatus('Account created! Check your email to confirm, then sign in.', 'success');
                isSignUp = false;
                toggleAuthMode();
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            }
        } else {
            result = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (result.error) {
                showStatus(`Sign in failed: ${result.error.message}`, 'error');
            } else if (result.data.user) {
                currentUser = result.data.user;
                showStatus('Signed in! Loading CMS...', 'success');
                setTimeout(() => {
                    showCMS();
                }, 500);
            }
        }
    } catch (error) {
        console.error('Auth error:', error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
}

function showCMS() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('cms-container').classList.add('visible');

    // Load CMS in iframe
    const cmsFrame = document.getElementById('cmsFrame');
    cmsFrame.src = 'cms.html';
}

async function handleLogout() {
    try {
        const supabase = getSupabase();
        if (supabase) {
            await supabase.auth.signOut();
        }

        currentUser = null;
        document.getElementById('auth-section').style.display = 'flex';
        document.getElementById('cms-container').classList.remove('visible');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        showStatus('Signed out', 'info');
    } catch (error) {
        console.error('Logout error:', error);
        showStatus('Error signing out', 'error');
    }
}

async function checkAuthState() {
    try {
        const supabase = getSupabase();

        if (!supabase) {
            console.warn('Supabase not configured yet');
            return;
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Session check error:', error);
            return;
        }

        if (data.session) {
            currentUser = data.session.user;
            showCMS();
        }
    } catch (error) {
        console.error('Auth state check failed:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('authForm').addEventListener('submit', handleAuth);

    // Check if already authenticated
    setTimeout(() => {
        checkAuthState();
    }, 500);
});

// Listen for auth changes
window.addEventListener('load', () => {
    const supabase = getSupabase();
    if (supabase) {
        supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                currentUser = session.user;
                showCMS();
            } else {
                currentUser = null;
                if (document.getElementById('cms-container').classList.contains('visible')) {
                    document.getElementById('auth-section').style.display = 'flex';
                    document.getElementById('cms-container').classList.remove('visible');
                }
            }
        });
    }
});
