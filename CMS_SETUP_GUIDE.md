# Portfolio CMS Setup Guide

## 🎉 What You Now Have

I've created a complete CMS system for your portfolio that eliminates the need for hardcoding content. Here's what's included:

### New Files Created:

1. **cms.html** - The admin panel where you edit all your portfolio content
2. **cms.js** - The backend logic for the CMS (handles saving, editing, deleting)
3. **data.json** - Your portfolio data stored in JSON format (edit this file or use the CMS)
4. **cms-loader.js** - Script that loads data from data.json and updates your portfolio page

## 📝 How to Use

### Option 1: Using the CMS Admin Panel (Recommended)

1. Open `cms.html` in your browser
2. You'll see tabs for: Profile, Social Links, Projects, Education, and Achievements
3. Edit your information in each section
4. Click "Save Changes" button to save

**Note:** Currently, changes are saved to localStorage and can be downloaded. For a production setup, you'd need a backend.

### Option 2: Edit data.json Directly

You can also directly edit the `data.json` file if you prefer:

```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title",
    "year": "2025",
    "bio": "Your bio",
    "profileImage": "image.jpg",
    "cvFile": "resume.pdf"
  },
  "social": {
    "linkedin": "https://...",
    "github": "https://...",
    "facebook": "https://...",
    "instagram": "https://..."
  },
  "projects": [...],
  "education": [...],
  "achievements": [...]
}
```

## 🔗 Connecting to Your Portfolio

To connect your existing portfolio to the CMS, add this line to your `index.html` **before** your existing `port.js` script:

```html
<script src="cms-loader.js"></script>
```

Then at the end of your body, before `port.js`:

```html
<script src="cms-loader.js"></script>
<script src="port.js"></script>
```

The `cms-loader.js` script will:
- Load your data from `data.json`
- Automatically update profile info, social links, projects, education, and achievements
- Work seamlessly with your existing styles and animations

## 📚 Data Structure Explained

### Profile Section
- **name**: Your full name
- **title**: Your professional title (e.g., UI/UX Designer)
- **year**: Current year or portfolio year
- **bio**: Short biography
- **profileImage**: Filename of your profile photo
- **cvFile**: Filename of your resume/CV

### Social Links
- Direct URLs to your social media profiles
- Works with existing social icons in your portfolio

### Projects
Each project has:
- **id**: Unique identifier (auto-generated)
- **title**: Project name
- **description**: What the project does
- **image**: Project image filename
- **link**: URL to project or demo

### Education
Each education entry has:
- **id**: Unique identifier
- **school**: School/University name
- **degree**: Degree or certification
- **year**: Graduation year
- **description**: Additional details

### Achievements
Each achievement has:
- **id**: Unique identifier
- **title**: Achievement name
- **description**: What you achieved
- **image**: Badge or trophy image filename

## 🚀 Production Setup (Backend)

For a production website, you'll want to:

1. **Set up a backend** (Node.js, Python, PHP, etc.)
2. **Create an API endpoint** that saves data.json to your server
3. **Modify cms.js** to send data to your API instead of localStorage:

```javascript
// Instead of localStorage, do this:
const response = await fetch('/api/save-portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(portfolioData)
});
```

4. **Protect the CMS** with authentication (login/password)

## 💡 Tips

- Keep image files in the same folder as your portfolio
- Use relative paths for all file references (e.g., "image.jpg" not "C:\full\path\image.jpg")
- Back up your data.json regularly
- Test changes before deploying to production
- The CMS automatically validates URLs and required fields

## 📱 Mobile Responsive

The CMS admin panel is fully responsive and works on all devices!

## 🔐 Security Note

The current implementation saves to localStorage and downloads files. For a real website, add:
- Password protection on cms.html
- HTTPS for data transmission
- Database instead of file storage
- User authentication

Enjoy your new CMS! 🎨
