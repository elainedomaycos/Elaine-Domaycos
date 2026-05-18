// Shared Supabase helper for the CMS and public portfolio
(() => {
    const PLACEHOLDER_HINTS = ['your_supabase_url', 'your_supabase_anon_key', 'replace_me', 'insert_your'];

    const config = {
        url: window.SUPABASE_URL || '',
        anonKey: window.SUPABASE_ANON_KEY || '',
        tableName: window.SUPABASE_TABLE || 'portfolio_content',
        bucketName: window.SUPABASE_BUCKET || 'portfolio-assets',
        rowId: Number(window.SUPABASE_ROW_ID || 1)
    };

    let supabaseClient = null;

    function isPlaceholder(value) {
        if (!value) return true;
        const normalized = String(value).trim().toLowerCase();
        return PLACEHOLDER_HINTS.some(hint => normalized.includes(hint));
    }

    function isConfigured() {
        return !isPlaceholder(config.url) && !isPlaceholder(config.anonKey) && !!window.supabase?.createClient;
    }

    function getClient() {
        if (!isConfigured()) return null;
        if (!supabaseClient) {
            supabaseClient = window.supabase.createClient(config.url, config.anonKey);
        }
        return supabaseClient;
    }

    function getFileName(value) {
        if (!value) return '';
        const cleanValue = String(value).split('?')[0].split('#')[0];
        const parts = cleanValue.split('/');
        return parts[parts.length - 1] || cleanValue;
    }

    function createStoragePath(file, folder) {
        const safeName = getFileName(file.name).replace(/[^a-zA-Z0-9._-]+/g, '_');
        return `${folder}/${Date.now()}-${safeName}`;
    }

    async function loadFromSupabase() {
        const client = getClient();
        if (!client) return null;

        const { data, error } = await client
            .from(config.tableName)
            .select('content')
            .eq('id', config.rowId)
            .maybeSingle();

        if (error) throw error;
        return data?.content || null;
    }

    async function saveToSupabase(portfolioData) {
        const client = getClient();
        if (!client) {
            throw new Error('Supabase is not configured.');
        }

        const { error } = await client
            .from(config.tableName)
            .upsert(
                {
                    id: config.rowId,
                    content: portfolioData,
                    updated_at: new Date().toISOString()
                },
                { onConflict: 'id' }
            );

        if (error) throw error;
        return true;
    }

    async function uploadFile(file, folder = 'assets') {
        const client = getClient();
        if (!client) {
            throw new Error('Supabase is not configured.');
        }

        const path = createStoragePath(file, folder);
        const { error } = await client.storage
            .from(config.bucketName)
            .upload(path, file, {
                upsert: true,
                contentType: file.type || 'application/octet-stream',
                cacheControl: '3600'
            });

        if (error) throw error;

        const { data } = client.storage.from(config.bucketName).getPublicUrl(path);
        return data.publicUrl;
    }

    async function loadPortfolioData(options = {}) {
        const fallbackUrl = options.fallbackUrl || 'data.json';
        const allowLocalStorage = options.allowLocalStorage !== false;

        try {
            const supabaseData = await loadFromSupabase();
            if (supabaseData) return supabaseData;
        } catch (error) {
            console.warn('Supabase load failed, falling back to local sources.', error);
        }

        if (allowLocalStorage) {
            try {
                const cached = window.localStorage.getItem('portfolioData');
                if (cached) return JSON.parse(cached);
            } catch (error) {
                console.warn('Local storage load failed.', error);
            }
        }

        const response = await fetch(fallbackUrl, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Unable to load fallback data from ${fallbackUrl}`);
        }
        return response.json();
    }

    function normalizePortfolioData(data) {
        return {
            profile: data?.profile || {},
            social: data?.social || {},
            projects: Array.isArray(data?.projects) ? data.projects : [],
            education: Array.isArray(data?.education) ? data.education : [],
            achievements: Array.isArray(data?.achievements) ? data.achievements : []
        };
    }

    window.PortfolioBackend = {
        config,
        isConfigured,
        getClient,
        getFileName,
        loadFromSupabase,
        loadPortfolioData,
        normalizePortfolioData,
        saveToSupabase,
        uploadFile
    };
})();
