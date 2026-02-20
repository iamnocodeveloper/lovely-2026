# Deployment Checklist for cPanel

## Current Status
- ❌ Assets returning 404 errors
- ✅ Build completed successfully
- ❓ Files uploaded to cPanel?

## What Should Be on Your Server

Your `public_html` folder on cPanel should contain:

```
public_html/
├── index.html
├── assets/
│   ├── index-Bh1i69Wo.js
│   └── index-Ct-D1q5S.css
└── .htaccess (for SPA routing)
```

## Step-by-Step Deployment Instructions

### Option 1: Manual Upload via cPanel File Manager

1. **Login to cPanel**
   - Go to your hosting control panel
   - Open "File Manager"

2. **Navigate to public_html**
   - Click on `public_html` folder
   - **IMPORTANT:** Delete any old files from previous deployments

3. **Upload Files**
   - Click "Upload" button
   - Select ALL files from your local `dist` folder:
     - `index.html`
     - The entire `assets` folder
   - Wait for upload to complete

4. **Verify Upload**
   - You should see `index.html` in `public_html`
   - You should see `assets` folder in `public_html`
   - Inside `assets` folder, you should see the JS and CSS files

5. **Create .htaccess file**
   - Click "New File" in File Manager
   - Name it `.htaccess`
   - Edit and paste the content below

### Option 2: Upload via FTP

1. **Use an FTP client** (FileZilla, WinSCP, etc.)
2. **Connect to your server**
   - Host: Your domain or FTP hostname
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (or 22 for SFTP)

3. **Navigate to public_html**
4. **Delete old files** (if any)
5. **Upload the contents of the `dist` folder**
   - Drag and drop `index.html`
   - Drag and drop the `assets` folder
   - Make sure the folder structure is preserved

## .htaccess Content

Create a file named `.htaccess` in `public_html` with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## Verification Steps

After uploading:

1. **Visit** `https://siaprendi.com/check.html`
   - This diagnostic page will help verify files are present

2. **Click the links** on the check page
   - If you see code/CSS content → Files are uploaded correctly ✅
   - If you get 404 errors → Files are missing ❌

3. **Check browser console**
   - Press F12 in your browser
   - Go to Console tab
   - Refresh the page
   - Look for any 404 errors

## Common Issues & Solutions

### Issue: "I uploaded but still getting 404"
**Solution:** 
- Make sure you uploaded the **contents** of the `dist` folder, not the `dist` folder itself
- Your structure should be `public_html/index.html`, NOT `public_html/dist/index.html`

### Issue: "Assets folder is missing"
**Solution:**
- Re-upload the entire `assets` folder
- Make sure folder permissions are correct (755 for folders, 644 for files)

### Issue: "Files are there but still 404"
**Solution:**
- Check file permissions in cPanel File Manager
- Right-click → Change Permissions
- Folders: 755
- Files: 644

### Issue: "Page loads but is blank"
**Solution:**
- Check browser console for JavaScript errors
- Verify environment variables are set correctly
- Check if Supabase credentials are configured

## Quick Diagnostic

Upload `check.html` (created in your dist folder) to your server and visit:
`https://siaprendi.com/check.html`

This will help you verify which files are actually present.
