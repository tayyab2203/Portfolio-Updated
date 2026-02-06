# Admin Panel Guide

Welcome to your portfolio admin panel! This guide will help you manage your portfolio content.

## 🚀 Getting Started

### Accessing the Admin Panel

1. Navigate to `/admin/login` in your browser
2. **Default Credentials:**
   - Username: `admin`
   - Password: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production by setting environment variables:
- `ADMIN_USERNAME` - Your admin username
- `ADMIN_PASSWORD_HASH` - Hashed password (use bcrypt to generate)

### Generating a Password Hash

To create a secure password hash, you can use Node.js:

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
```

Then add to your `.env.local`:
```env
ADMIN_USERNAME=your-username
ADMIN_PASSWORD_HASH=your-hashed-password
JWT_SECRET=your-super-secret-jwt-key-change-this
```

## 📋 Features

### Dashboard
- Overview of your portfolio statistics
- Quick access to common actions
- Recent projects preview

### Projects Management
- **View All Projects**: See all your projects in a grid layout
- **Add New Project**: Create new projects with:
  - Title, problem, solution, impact
  - Tech stack (add multiple technologies)
  - Project images (upload multiple images)
  - Live and GitHub links
  - Metrics (users, revenue, growth, retention)
  - Featured toggle (show on homepage)
- **Edit Project**: Update any project details
- **Delete Project**: Remove projects (with confirmation)

### File Uploads
- Upload project images
- Images are stored in `/public/uploads/`
- Supports common image formats (JPG, PNG, GIF, etc.)

## 🎨 Managing Projects

### Creating a New Project

1. Go to **Projects** → **Add New Project**
2. Fill in the required fields:
   - **Title**: Project name
   - **Problem**: What problem does this solve?
   - **Solution**: How did you solve it?
   - **Impact**: Results and outcomes
3. Add **Tech Stack**: Type technology names and press Enter or click the + button
4. Upload **Images**: Click the upload area to select images
5. Add **Links**: Live demo and GitHub repository URLs
6. Set **Metrics**: Optional statistics about the project
7. Toggle **Featured** if you want it on the homepage
8. Click **Create Project**

### Editing a Project

1. Go to **Projects**
2. Click **Edit** on any project card
3. Make your changes
4. Click **Save Changes**

### Deleting a Project

1. Go to **Projects**
2. Click the trash icon on any project card
3. Confirm deletion in the modal

## 📁 Data Storage

Projects are stored in `src/data/projects.json`. This file is automatically created when you add your first project through the admin panel.

**Note**: The original `projects.js` file serves as a fallback. Once you create projects through the admin panel, they'll be saved to `projects.json` and that will be used instead.

## 🔒 Security

- All admin routes are protected by authentication
- JWT tokens are stored in HTTP-only cookies
- Passwords are hashed using bcrypt
- Middleware protects admin routes automatically

## 🛠️ Troubleshooting

### Can't Login
- Check that you're using the correct credentials
- Clear your browser cookies and try again
- Check browser console for errors

### Images Not Uploading
- Ensure the `/public/uploads/` directory exists and is writable
- Check file size (large files may fail)
- Verify file format is supported

### Projects Not Saving
- Check that `src/data/` directory is writable
- Check server logs for errors
- Ensure you have proper file permissions

### Changes Not Appearing
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check that the JSON file was updated

## 📝 Future Features

The admin panel is designed to be extensible. Future features can include:
- Skills management
- Company information management
- Blog posts
- Analytics dashboard
- User management (if needed)

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check server logs
3. Verify file permissions
4. Ensure all dependencies are installed

---

**Happy Managing!** 🎉
