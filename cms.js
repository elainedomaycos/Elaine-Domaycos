// CMS Data Management
let portfolioData = {};
let editingIndex = null;
let editingType = null;

function getBackend() {
    return window.PortfolioBackend || null;
}

function getEmptyPortfolio() {
    return {
        profile: {},
        social: {},
        projects: [],
        education: [],
        achievements: []
    };
}

function normalizePortfolioData(data) {
    const backend = getBackend();
    if (backend) {
        return backend.normalizePortfolioData(data);
    }

    return {
        profile: data?.profile || {},
        social: data?.social || {},
        projects: Array.isArray(data?.projects) ? data.projects : [],
        education: Array.isArray(data?.education) ? data.education : [],
        achievements: Array.isArray(data?.achievements) ? data.achievements : []
    };
}

function getFileName(value) {
    const backend = getBackend();
    if (backend?.getFileName) {
        return backend.getFileName(value);
    }

    if (!value) return '';
    const cleanValue = String(value).split('?')[0].split('#')[0];
    const parts = cleanValue.split('/');
    return parts[parts.length - 1] || cleanValue;
}

function handleImageUpload(inputFieldId, previewContainerId) {
    const fileInput = document.getElementById(`${inputFieldId}Input`);
    const file = fileInput?.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewContainerId);
        const previewImg = document.getElementById(`${inputFieldId}Img`);
        const previewName = document.getElementById(`${inputFieldId}Name`);

        if (previewImg) previewImg.src = e.target.result;
        if (previewName) previewName.textContent = '✓ ' + file.name;
        if (preview) preview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    showStatus('✓ Image loaded: ' + file.name, 'success');
}

function handleFileSelection(inputId, previewId) {
    const input = document.getElementById(inputId);
    const file = input?.files?.[0];
    const preview = document.getElementById(previewId);

    if (preview) {
        preview.textContent = file ? `✓ ${file.name}` : 'No CV selected';
    }
}

async function resolveAssetFromInput(inputId, folder, existingValue = '') {
    const input = document.getElementById(inputId);
    const file = input?.files?.[0];

    if (!file) {
        return existingValue || '';
    }

    const backend = getBackend();
    if (backend?.isConfigured()) {
        return await backend.uploadFile(file, folder);
    }

    return file.name;
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Load data from Supabase, local storage, or the fallback JSON file
async function loadData() {
    try {
        const backend = getBackend();
        const data = backend
            ? await backend.loadPortfolioData({ fallbackUrl: 'data.json' })
            : await fetch('data.json', { cache: 'no-store' }).then(response => response.json());

        portfolioData = normalizePortfolioData(data);
        populateForm();
        renderItems();
        showStatus(backend?.isConfigured() ? 'Data loaded from Supabase' : 'Data loaded locally', 'success');
    } catch (error) {
        console.error('Error loading data:', error);
        showStatus('Could not load Supabase data. Using an empty CMS template.', 'error');
        portfolioData = getEmptyPortfolio();
        populateForm();
        renderItems();
    }
}

// Populate the profile form with current data
function populateForm() {
    if (portfolioData.profile) {
        document.getElementById('profileName').value = portfolioData.profile.name || '';
        document.getElementById('profileTitle').value = portfolioData.profile.title || '';
        document.getElementById('profileYear').value = portfolioData.profile.year || '';
        document.getElementById('profileBio').value = portfolioData.profile.bio || '';
        const profileCVPreview = document.getElementById('profileCVPreview');
        if (profileCVPreview) {
            profileCVPreview.textContent = portfolioData.profile.cvFile
                ? `Current CV: ${getFileName(portfolioData.profile.cvFile)}`
                : 'No CV selected';
        }

        const profileImagePreview = document.getElementById('profileImagePreview');
        const profileImageImg = document.getElementById('profileImageImg');
        const profileImageName = document.getElementById('profileImageName');
        if (portfolioData.profile.profileImage) {
            if (profileImagePreview) profileImagePreview.style.display = 'block';
            if (profileImageImg) profileImageImg.src = portfolioData.profile.profileImage;
            if (profileImageName) profileImageName.textContent = `Current image: ${getFileName(portfolioData.profile.profileImage)}`;
        }
    }

    if (portfolioData.social) {
        document.getElementById('socialLinkedin').value = portfolioData.social.linkedin || '';
        document.getElementById('socialGithub').value = portfolioData.social.github || '';
        document.getElementById('socialFacebook').value = portfolioData.social.facebook || '';
        document.getElementById('socialInstagram').value = portfolioData.social.instagram || '';
    }
}

// Render items lists
function renderItems() {
    renderProjects();
    renderEducation();
    renderAchievements();
}

// Render projects
function renderProjects() {
    const list = document.getElementById('projectsList');
    list.innerHTML = '';

    if (!portfolioData.projects) portfolioData.projects = [];

    portfolioData.projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-content">
                <div class="item-title">${project.title}</div>
                <div class="item-desc">${project.description}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-small btn-secondary" onclick="editProject(${index})">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteProject(${index})">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// Render education
function renderEducation() {
    const list = document.getElementById('educationList');
    list.innerHTML = '';

    if (!portfolioData.education) portfolioData.education = [];

    portfolioData.education.forEach((edu, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-content">
                <div class="item-title">${edu.school}</div>
                <div class="item-desc">${edu.degree} • ${edu.year}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-small btn-secondary" onclick="editEducation(${index})">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteEducation(${index})">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// Render achievements
function renderAchievements() {
    const list = document.getElementById('achievementsList');
    list.innerHTML = '';

    if (!portfolioData.achievements) portfolioData.achievements = [];

    portfolioData.achievements.forEach((achievement, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-content">
                <div class="item-title">${achievement.title}</div>
                <div class="item-desc">${achievement.description}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-small btn-secondary" onclick="editAchievement(${index})">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteAchievement(${index})">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Save all data
async function saveData() {
    try {
        const backend = getBackend();

        // Update profile data
        portfolioData.profile = {
            name: document.getElementById('profileName').value,
            title: document.getElementById('profileTitle').value,
            year: document.getElementById('profileYear').value,
            bio: document.getElementById('profileBio').value,
            cvFile: await resolveAssetFromInput('profileCVInput', 'profile-files', portfolioData.profile?.cvFile || ''),
            profileImage: await resolveAssetFromInput('profileImageInput', 'profile-images', portfolioData.profile?.profileImage || '')
        };

        // Update social data
        portfolioData.social = {
            linkedin: document.getElementById('socialLinkedin').value,
            github: document.getElementById('socialGithub').value,
            facebook: document.getElementById('socialFacebook').value,
            instagram: document.getElementById('socialInstagram').value
        };

        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));

        if (backend?.isConfigured()) {
            await backend.saveToSupabase(portfolioData);
        }

        showStatus(backend?.isConfigured() ? '✓ Changes saved to Supabase!' : '✓ Changes saved locally. Configure Supabase to sync cloud storage.', 'success');
    } catch (error) {
        console.error('Error saving data:', error);
        showStatus('Error saving data', 'error');
    }
}

// Download JSON as file
function downloadJSON() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Project Functions
function openProjectModal() {
    editingIndex = null;
    editingType = 'project';
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectCategory').value = '';
    document.getElementById('projectDesc').value = '';
    document.getElementById('projectImageInput').value = '';
    document.getElementById('projectLink').value = '';
    document.getElementById('projectImagePreview').style.display = 'none';
    document.getElementById('projectModal').classList.add('active');
}

function editProject(index) {
    editingIndex = index;
    editingType = 'project';
    const project = portfolioData.projects[index];
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectCategory').value = project.category || '';
    document.getElementById('projectDesc').value = project.description;
    document.getElementById('projectLink').value = project.link;
    document.getElementById('projectImageInput').value = '';
    document.getElementById('projectImagePreview').style.display = 'none';
    document.getElementById('projectModal').classList.add('active');
}

async function saveProject() {
    const existingProject = editingIndex !== null ? portfolioData.projects[editingIndex] : null;
    const projectImage = await resolveAssetFromInput('projectImageInput', 'project-images', existingProject?.image || '');
    
    const project = {
        id: editingIndex !== null ? existingProject.id : Date.now(),
        title: document.getElementById('projectTitle').value,
        category: document.getElementById('projectCategory').value || 'PROJECT',
        description: document.getElementById('projectDesc').value,
        image: projectImage,
        link: document.getElementById('projectLink').value
    };

    if (!portfolioData.projects) portfolioData.projects = [];

    if (editingIndex !== null) {
        portfolioData.projects[editingIndex] = project;
    } else {
        portfolioData.projects.unshift(project);
    }

    renderProjects();
    closeModal('projectModal');
    showStatus('Project saved!', 'success');
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        portfolioData.projects.splice(index, 1);
        renderProjects();
        showStatus('Project deleted', 'success');
    }
}

// Education Functions
function openEducationModal() {
    editingIndex = null;
    editingType = 'education';
    document.getElementById('eduSchool').value = '';
    document.getElementById('eduDegree').value = '';
    document.getElementById('eduYear').value = '';
    document.getElementById('eduDesc').value = '';
    document.getElementById('eduImageInput').value = '';
    document.getElementById('eduImagePreview').style.display = 'none';
    document.getElementById('educationModal').classList.add('active');
}

function editEducation(index) {
    editingIndex = index;
    editingType = 'education';
    const edu = portfolioData.education[index];
    document.getElementById('eduSchool').value = edu.school;
    document.getElementById('eduDegree').value = edu.degree;
    document.getElementById('eduYear').value = edu.year;
    document.getElementById('eduDesc').value = edu.description;
    document.getElementById('eduImageInput').value = '';
    document.getElementById('eduImagePreview').style.display = 'none';
    document.getElementById('educationModal').classList.add('active');
}

async function saveEducation() {
    const existingEducation = editingIndex !== null ? portfolioData.education[editingIndex] : null;
    const eduImage = await resolveAssetFromInput('eduImageInput', 'education-images', existingEducation?.image || '');
    
    const edu = {
        id: editingIndex !== null ? existingEducation.id : Date.now(),
        school: document.getElementById('eduSchool').value,
        degree: document.getElementById('eduDegree').value,
        year: document.getElementById('eduYear').value,
        description: document.getElementById('eduDesc').value,
        image: eduImage
    };

    if (!portfolioData.education) portfolioData.education = [];

    if (editingIndex !== null) {
        portfolioData.education[editingIndex] = edu;
    } else {
        portfolioData.education.unshift(edu);
    }

    renderEducation();
    closeModal('educationModal');
    showStatus('Education saved!', 'success');
}

function deleteEducation(index) {
    if (confirm('Are you sure you want to delete this education entry?')) {
        portfolioData.education.splice(index, 1);
        renderEducation();
        showStatus('Education deleted', 'success');
    }
}

// Achievement Functions
function openAchievementModal() {
    editingIndex = null;
    editingType = 'achievement';
    document.getElementById('achievementTitle').value = '';
    document.getElementById('achievementDesc').value = '';
    document.getElementById('achievementImageInput').value = '';
    document.getElementById('achievementImagePreview').style.display = 'none';
    document.getElementById('achievementModal').classList.add('active');
}

function editAchievement(index) {
    editingIndex = index;
    editingType = 'achievement';
    const achievement = portfolioData.achievements[index];
    document.getElementById('achievementTitle').value = achievement.title;
    document.getElementById('achievementDesc').value = achievement.description;
    document.getElementById('achievementImageInput').value = '';
    document.getElementById('achievementImagePreview').style.display = 'none';
    document.getElementById('achievementModal').classList.add('active');
}

async function saveAchievement() {
    const existingAchievement = editingIndex !== null ? portfolioData.achievements[editingIndex] : null;
    const achievementImage = await resolveAssetFromInput('achievementImageInput', 'achievement-images', existingAchievement?.image || '');
    
    const achievement = {
        id: editingIndex !== null ? existingAchievement.id : Date.now(),
        title: document.getElementById('achievementTitle').value,
        description: document.getElementById('achievementDesc').value,
        image: achievementImage
    };

    if (!portfolioData.achievements) portfolioData.achievements = [];

    if (editingIndex !== null) {
        portfolioData.achievements[editingIndex] = achievement;
    } else {
        portfolioData.achievements.unshift(achievement);
    }

    renderAchievements();
    closeModal('achievementModal');
    showStatus('Achievement saved!', 'success');
}

function deleteAchievement(index) {
    if (confirm('Are you sure you want to delete this achievement?')) {
        portfolioData.achievements.splice(index, 1);
        renderAchievements();
        showStatus('Achievement deleted', 'success');
    }
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Status message
function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;

    if (type === 'success') {
        setTimeout(() => {
            statusEl.className = 'status-message';
        }, 4000);
    }
}

// View portfolio
function viewPortfolio() {
    window.open('index.html', '_blank');
}
