# Portfolio CMS - File Upload Guide

## 🖼️ Image Upload Feature

Your CMS now has a built-in file browser feature to select images directly from your folder!

### How to Use:

1. **Browse Images**: Click the "📁 Browse" button next to any image field
2. **Select File**: Choose an image from your computer
3. **See Preview**: The image preview will appear instantly below the field
4. **Filename Auto-fills**: The input field automatically fills with the filename

### Image Fields with Upload:
- **Profile Image** - Your profile photo
- **Project Images** - Images for each project
- **Education Logo** - School/University logos
- **Achievement Images** - Achievement/award photos

## ✅ What Happens:

When you select an image:
1. ✓ Image preview displays
2. ✓ Filename is automatically added to the field
3. ✓ Filename is stored in data.json
4. ✓ Success message appears

## 📁 Important Notes:

### Local Development:
- Images must be in the **same folder** as your portfolio files
- The CMS stores just the **filename**, not the actual file
- Make sure to copy the actual image files to the portfolio folder

### Production Deployment:
For a production website, you have two options:

**Option 1: Simple File Storage**
- Upload images to the same server folder as your HTML files
- Filenames in data.json will work automatically

**Option 2: Cloud Storage (Recommended)**
- Use services like:
  - AWS S3
  - Google Cloud Storage
  - Firebase Storage
  - Cloudinary
- Store the full URL in data.json instead of just the filename

## 🔄 Workflow:

1. **In CMS**: Click Browse → Select image → Preview appears
2. **Filename stored**: `myimage.jpg` is saved in data.json
3. **On Portfolio**: The portfolio automatically finds the image in the folder

## 🚀 Example File Structure:

```
Portfolio/
├── index.html
├── cms.html
├── port.js
├── cms.js
├── cms-loader.js
├── style.css
├── data.json
├── ARA_2931.jpg          ← Profile image
├── p1.png               ← Project image
├── p2.png               ← Project image
├── bsu logo.png         ← Education logo
├── na.jpg               ← Achievement image
└── ... (other images)
```

## 💾 Saving & Downloading:

1. Edit your content in CMS
2. Select images using Browse
3. Click "Save Changes"
4. Download the updated `data.json`
5. Replace your existing `data.json` with the new one
6. Make sure all image files are in the same folder

## 🛠️ For Backend Setup:

If you want to add a proper file upload system that saves files to the server, you'll need:

### Simple Node.js Example:
```javascript
const multer = require('multer');
const app = require('express')();

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), (req, res) => {
    // Save filename to data.json
    res.json({ filename: req.file.filename });
});
```

### Or use a service like:
- **Firebase Storage** - Easiest for beginners
- **Cloudinary** - Great for portfolio use
- **AWS S3** - Professional solution

## 📝 Tips:

✓ Keep image filenames **simple and descriptive**
✓ Use lowercase without spaces: `profile-photo.jpg` not `Profile Photo.JPG`
✓ Supported formats: JPG, PNG, GIF, WebP
✓ Recommended sizes:
  - Profile image: 400x500px
  - Project images: 800x600px
  - Achievement images: 500x500px

## ❓ Troubleshooting:

**Images not showing on portfolio?**
1. Check that files are in the correct folder
2. Verify filenames match exactly (including extension)
3. Check browser console for errors (F12)

**Preview not appearing?**
1. Make sure it's a valid image file
2. Try a different format (JPG instead of PNG)
3. Check file size (keep under 5MB)

Enjoy managing your portfolio! 🎨
