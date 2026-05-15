# Image Placement Manager - Quick Start Guide

## What's New

The Image Placement Manager now includes:
1. **Image Preview** - See current image for each placement
2. **Direct Upload** - Upload/replace images without leaving the manager
3. **Quick Remove** - Remove images with one click
4. **Toast Notifications** - Real-time success/error feedback

## How to Use

### Replace an Existing Image

1. Go to Admin Dashboard → Image Placements
2. Click on a placement in the left panel
3. Look for the **green "Current Image"** panel at the top
4. Scroll to the **blue upload panel** below it
5. Click "Select Image File"
6. Choose your new image
7. Click "Replace Image"
8. Green success toast appears
9. Preview updates instantly
10. Front-end image updates automatically

### Upload an Image to Empty Placement

1. Select a placement with no image assigned
2. The blue panel shows **"Upload Image"** instead of "Replace Image"
3. Follow the same steps as above
4. Image is assigned and appears on the front-end

### Remove an Image

1. Select a placement with an image
2. Scroll to the **red "Remove Image"** button
3. Click it
4. Confirm the action in the popup
5. Green success toast appears
6. Image is removed from front-end

## UI Layout (When Image is Assigned)

```
Placement Name
Description

┌─ Current Image (GREEN) ──────┐
│ [Image Preview]              │
│ Image Title                  │
└──────────────────────────────┘

┌─ Replace Image (BLUE) ───────┐
│ Select Image File [Browse...]│
│ [Replace Image Button]       │
└──────────────────────────────┘

[Remove Image Button] (RED)
```

## UI Layout (No Image Assigned)

```
Placement Name
Description

┌─ Upload Image (BLUE) ────────┐
│ Select Image File [Browse...]│
│ [Upload Image Button]        │
└──────────────────────────────┘
```

## Toast Messages

| Message | Color | Meaning |
|---------|-------|---------|
| Image replaced successfully | Green | New image uploaded and assigned to placement |
| Image removed successfully | Green | Image removed from placement |
| Failed to upload image | Red | Upload to server failed |
| Failed to remove image | Red | Removal from placement failed |
| Error uploading image | Red | Unexpected error during upload |
| Error removing image | Red | Unexpected error during removal |

## File Requirements

- **Format:** Image files only (JPG, PNG, GIF, WebP, etc.)
- **Size:** No hard limit enforced (browser dependent)
- **Recommended:** Keep under 5MB for fast loading

## Troubleshooting

### Upload button is disabled
- Make sure you've selected a file
- Ensure file is an image format
- Check that upload is not already in progress

### Image doesn't update on front-end
- Wait 3-5 seconds for revalidation
- Check browser cache (Ctrl+F5 to hard refresh)
- Verify admin key is correct

### Remove button doesn't appear
- Image may not be assigned to this placement yet
- Try refreshing the page

### Red error toast appears
- Check internet connection
- Verify admin authentication (ADMIN_KEY)
- Try uploading a different image
- Check browser console for detailed errors

## Tips & Tricks

- **Preview before replacing:** You can see the current image before uploading a new one
- **Fast workflow:** Click placement → Select image → Upload → Done
- **File browser:** Click anywhere in the file input area to browse
- **Auto-dismiss:** Toasts disappear after 3 seconds automatically
- **Multiple placements:** Switch between placements without losing upload form

## Related Features

- **Media Management** (separate tab) - Manage all media assets library-wide
- **Image Placements** - Configure which locations display images
- **Gallery Configuration** - Set up image placement rules and categories

## Need Help?

Refer to the full guide: `IMAGE_PLACEMENT_MANAGER_GUIDE.md`
