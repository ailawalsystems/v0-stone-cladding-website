# Image Placement Manager Enhancement Guide

## Overview

The Image Placement Manager has been enhanced with direct image preview, upload/replace, and removal controls. This allows administrators to manage placement images directly from the admin dashboard without navigating to the separate media management section.

## New Features

### 1. Current Image Preview
When a placement is selected and has an assigned image:
- Shows a visual preview of the currently assigned image (h-32 thumbnail)
- Displays the image title/filename below the preview
- Preview is highlighted with a green border indicating it's the active image

**Location:** Green panel labeled "Current Image" above the upload controls

### 2. Replace/Upload Controls
A dedicated section for uploading or replacing images:
- File input accepts image files only (`accept="image/*"`)
- Shows selected filename when a file is chosen
- Displays contextual button label:
  - "Upload Image" when no image is currently assigned
  - "Replace Image" when replacing an existing image
- Handles both new uploads and replacements in a single flow

**Location:** Blue panel labeled "Replace Image" or "Upload Image"

### 3. Remove Image Button
Dedicated button to remove an image from a placement:
- Only visible when an image is currently assigned
- Shows confirmation dialog before removing
- Updates the front-end immediately after removal

**Location:** Red button below the upload section (when image is assigned)

### 4. Toast Notifications
Real-time feedback for all operations:
- Success notifications (green) for successful operations
- Error notifications (red) for failed operations
- Auto-dismiss after 3 seconds
- Fixed position in top-right corner

**Types:**
- Image replaced successfully
- Image removed successfully
- Failed to upload image
- Failed to remove image
- Error uploading/removing image

## Technical Implementation

### State Management
```typescript
const [uploadFile, setUploadFile] = useState<File | null>(null)
const [isUploading, setIsUploading] = useState(false)
const [toastMessage, setToastMessage] = useState('')
const [toastType, setToastType] = useState<'success' | 'error' | ''>('')
```

### Toast Handler
```typescript
const showToast = (msg: string, type: 'success' | 'error') => {
  setToastMessage(msg)
  setToastType(type)
  setTimeout(() => {
    setToastType('')
    setToastMessage('')
  }, 3000)
}
```

### Upload/Replace Flow
1. User selects an image file
2. Form submission triggers `handleUploadReplaceImage`
3. File is uploaded via `/api/media` POST endpoint
4. New media asset is created and receives an ID
5. New media ID is assigned to placement via `/api/media/placements` PUT
6. Gallery state is updated
7. Toast notification confirms success
8. Media list is reloaded

### Remove Flow
1. User clicks "Remove Image" button
2. Confirmation dialog appears
3. On confirmation, placement media ID is cleared (set to empty string)
4. Gallery state is updated
5. Toast notification confirms success

## API Endpoints Used

### Upload New Image
**POST** `/api/media`
- Requires FormData with file, type, title, description
- Returns media asset with ID
- Auth: x-admin-key header

### Assign Media to Placement
**PUT** `/api/media/placements`
- Requires JSON body: { placementKey, mediaId }
- Returns updated gallery
- Auth: x-admin-key header

## File Changes

### Modified Files
- `components/admin/image-placement-manager.tsx` (240+ lines added)

### Changes Summary
- Added 4 state variables for upload, uploading, toast message, and toast type
- Added `showToast()` helper function for notifications
- Added `handleUploadReplaceImage()` for upload/replace flow
- Added `handleRemoveImage()` for removal with confirmation
- Updated JSX layout with preview, upload controls, and remove button
- Replaced old media selection grid with streamlined upload interface
- Added fixed-position toast notification component

## User Experience Flow

### Uploading/Replacing an Image
1. Admin opens Image Placement Manager
2. Clicks on a placement in the left panel
3. If image exists, preview appears in green panel
4. Admin clicks file input in blue panel
5. Selects new image file
6. Clicks "Upload Image" or "Replace Image" button
7. Green success toast appears
8. Preview updates immediately
9. Front-end displays new image

### Removing an Image
1. Admin selects placement with assigned image
2. Clicks "Remove Image" button
3. Confirmation dialog appears
4. On confirm, red toast appears
5. Preview and button disappear
6. Front-end stops displaying image for that placement

## Responsive Behavior

The image preview and controls are fully responsive:
- On mobile: Preview and controls stack vertically
- On tablet/desktop: Preview and controls display side-by-side in organized grid
- File input maintains usability across all screen sizes
- Buttons maintain 44px+ touch targets on mobile

## Error Handling

The component handles multiple error scenarios:
- File upload failures → "Failed to upload image" toast
- Placement assignment failures → "Failed to assign image to placement" toast
- Image removal failures → "Failed to remove image" toast
- General exceptions → "Error uploading/removing image" toast

## Browser Compatibility

- Modern browsers with FormData support (all current versions)
- Image file input with accept attribute filtering
- CSS grid and flexbox for layout
- Smooth animations with CSS transitions

## Performance Considerations

- File uploads are handled asynchronously with loading state
- Gallery is reloaded after successful operations to ensure sync
- Toast notifications auto-dismiss to prevent accumulation
- File input is reset after successful upload to allow re-selection

## Security

- All operations require admin authentication via x-admin-key header
- Confirmation dialog prevents accidental removals
- File input restricted to image MIME types only
- Server-side validation enforced in API endpoints

## Future Enhancements

Potential improvements for future versions:
- Drag-and-drop image upload
- Multiple image assignment per placement
- Image cropping/editing tools
- Batch operations for multiple placements
- Image optimization/compression before upload
