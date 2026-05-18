// Loads portfolio data from Supabase, with a local fallback while the backend is being configured.
// Include this script before the main portfolio interactivity script in `index.html`.

let portfolioDataLoaded = {};

async function loadPortfolioData() {
    try {
        if (window.PortfolioBackend) {
            const data = await window.PortfolioBackend.loadPortfolioData({
                fallbackUrl: 'data.json'
            });
            portfolioDataLoaded = window.PortfolioBackend.normalizePortfolioData(data);
            return portfolioDataLoaded;
        }

        const response = await fetch('data.json', { cache: 'no-store' });
        portfolioDataLoaded = await response.json();
        return portfolioDataLoaded;
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        return getDefaultData();
    }
}

function getDefaultData() {
    return {
        profile: {
            name: "Elaine Domaycos",
            title: "UI/UX Designer",
            year: "2025",
            bio: "Creative designer passionate about user-centered design",
            profileImage: "ARA_2931.jpg",
            cvFile: "Resume of Elaine Domaycos (1).pdf"
        },
        social: {
            linkedin: "https://www.linkedin.com/in/ma-kassandra-elaine-domaycos/",
            github: "https://github.com/elainedomaycos",
            facebook: "https://www.facebook.com/elaine.domaycos.1",
            instagram: "https://www.instagram.com/mariadionysiaa/"
        },
        projects: [],
        education: [],
        achievements: []
    };
}

// Initialize and update page content
async function initializePortfolioContent() {
    const data = await loadPortfolioData();
    
    // Update profile section
    if (data.profile) {
        updateProfileSection(data.profile);
    }

    // Update social links
    if (data.social) {
        updateSocialLinks(data.social);
    }

    // Update projects if they exist on the page
    if (data.projects && data.projects.length > 0) {
        updateProjects(data.projects);
    }

    // Update education if it exists on the page
    if (data.education && data.education.length > 0) {
        updateEducation(data.education);
    }

    // Update achievements if they exist on the page
    if (data.achievements && data.achievements.length > 0) {
        updateAchievements(data.achievements);
    }
}

function updateProfileSection(profile) {
    // Update name
    const nameElements = document.querySelectorAll('.profile-name, .photo-caption, .name-display');
    nameElements.forEach(el => {
        el.textContent = profile.name;
    });

    // Update profile image
    const profileImg = document.querySelector('.profile-photo');
    if (profileImg) {
        profileImg.src = profile.profileImage;
        profileImg.alt = profile.name;
    }

    // Update CV download button
    const cvBtn = document.querySelector('.download-btn');
    if (cvBtn && profile.cvFile) {
        cvBtn.href = profile.cvFile;
    }

    // Update title/year tags if they exist
    const titleTag = document.querySelector('.uiux-tag, .title-tag');
    if (titleTag && profile.title) {
        titleTag.textContent = profile.title;
    }

    const yearTag = document.querySelector('.year-tag');
    if (yearTag && profile.year) {
        yearTag.textContent = profile.year;
    }

    // Update bio if there's a bio section
    const bioElement = document.querySelector('.profile-bio, .about-text');
    if (bioElement && profile.bio) {
        bioElement.textContent = profile.bio;
    }
}

function updateSocialLinks(social) {
    // Update social links in navbar and footer
    const socialLinks = {
        linkedin: social.linkedin,
        github: social.github,
        facebook: social.facebook,
        instagram: social.instagram
    };

    // Update navbar social links
    const navbarSocials = document.querySelectorAll('.navbar .social-icon');
    navbarSocials.forEach(link => {
        const platform = link.classList[1]; // Get class like 'linkedin', 'github', etc.
        if (socialLinks[platform]) {
            link.href = socialLinks[platform];
        }
    });

    // Update mobile menu social links
    const mobileSocials = document.querySelectorAll('.mobile-socials .social-icon');
    mobileSocials.forEach(link => {
        const platform = link.classList[1];
        if (socialLinks[platform]) {
            link.href = socialLinks[platform];
        }
    });

    // Update footer social links if they exist
    const footerSocials = document.querySelectorAll('.footer .social-icon, .socials .social-icon');
    footerSocials.forEach(link => {
        const platform = link.classList[1];
        if (socialLinks[platform]) {
            link.href = socialLinks[platform];
        }
    });
}

function updateProjects(projects) {
    // Find carousel track for projects
    const carouselTrack = document.querySelector('#carouselTrack');
    
    if (carouselTrack) {
        carouselTrack.innerHTML = projects.map((project, idx) => `
            <div class="project-card animate-on-scroll">
                <span class="project-category">${project.category || 'PROJECT'}</span>
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-overlay">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <a href="${project.link}" class="github-btn" target="_blank">View Project</a>
                </div>
            </div>
        `).join('');
        
        // Update carousel dots if they exist
        const carouselDots = document.getElementById('carouselDots');
        if (carouselDots) {
            carouselDots.innerHTML = projects.map((_, idx) => `
                <div class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="currentSlide(${idx})"></div>
            `).join('');
        }
    }
}

function updateEducation(education) {
    // Update left school
    if (education[0]) {
        const schoolLeftDiv = document.querySelector('.school.school-left');
        if (schoolLeftDiv) {
            schoolLeftDiv.innerHTML = `
                <img src="${education[0].image}" alt="${education[0].school}">
                <div>
                    <p><strong>${education[0].degree}</strong><br><span>${education[0].year}</span><br><strong>${education[0].description}</strong></p>
                </div>
            `;
        }
    }

    // Update right school
    if (education[1]) {
        const schoolRightDiv = document.querySelector('.school.school-right');
        if (schoolRightDiv) {
            schoolRightDiv.innerHTML = `
                <img src="${education[1].image}" alt="${education[1].school}">
                <div>
                    <p><strong>${education[1].degree}</strong><br><span>${education[1].year}</span><br><strong>${education[1].description}</strong></p>
                </div>
            `;
        }
    }
}

function updateAchievements(achievements) {
    // Update carousel images for achievements
    const carouselImages = document.querySelector('.carousel-images');
    if (carouselImages) {
        carouselImages.innerHTML = achievements.map((achievement, idx) => `
            <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <img src="${achievement.image}" alt="${achievement.title}">
                <div class="overlay">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolioContent);
} else {
    initializePortfolioContent();
}
