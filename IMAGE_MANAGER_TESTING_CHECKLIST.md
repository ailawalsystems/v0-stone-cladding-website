# Image Placement Manager - Testing & Validation Checklist

## Pre-Testing Setup

- [ ] Admin key is set to 'key' in environment variables
- [ ] Admin dashboard is accessible at `/admin`
- [ ] Image Placements tab is visible in admin
- [ ] Test images are available (JPG, PNG, GIF)
- [ ] Browser console is open (F12)
- [ ] Network tab is open to monitor requests

## Feature 1: Image Preview

### Preview Display
- [ ] Select a placement that already has an image assigned
- [ ] Green "Current Image" panel appears above upload controls
- [ ] Image preview displays correctly (h-32 height)
- [ ] Image title/filename is visible below preview
- [ ] Preview is responsive on mobile/tablet/desktop

### Preview Update After Upload
- [ ] Upload new image to placement (see Feature 2)
- [ ] Confirm preview updates immediately after success toast
- [ ] Old image no longer visible in preview
- [ ] New image title displays correctly

### Preview Removal
- [ ] Remove image from placement (see Feature 3)
- [ ] Confirm green preview panel disappears
- [ ] Upload panel changes to "Upload Image" (not "Replace")

## Feature 2: Upload/Replace Controls

### Initial State (No Image)
- [ ] Select placement with no assigned image
- [ ] Blue "Upload Image" panel appears
- [ ] "Select Image File" input is visible
- [ ] "Upload Image" button is visible and disabled (no file selected)
- [ ] Button disabled state is visually distinct

### Initial State (With Image)
- [ ] Select placement with assigned image
- [ ] Blue "Replace Image" panel appears (not "Upload Image")
- [ ] "Select Image File" input is visible
- [ ] "Replace Image" button is visible and disabled

### File Selection
- [ ] Click file input
- [ ] File browser opens
- [ ] Only image files are selectable (filter working)
- [ ] Select a valid image file
- [ ] Selected filename appears below input
- [ ] Upload button becomes enabled
- [ ] Can deselect and button becomes disabled again

### Upload Process
- [ ] Button shows "Uploading..." text during upload
- [ ] Button is disabled during upload
- [ ] Upload completes (may take 2-5 seconds)
- [ ] Green success toast appears: "Image replaced successfully"
- [ ] File input resets (value cleared)
- [ ] Gallery updates with new image

### Upload Error Handling
- [ ] Test with corrupted image file
- [ ] Verify red error toast appears
- [ ] Toast message is specific and helpful
- [ ] Component remains usable after error
- [ ] Can retry with different file

### Multiple Placements
- [ ] Switch between placements without uploading
- [ ] File selection persists in input
- [ ] Clicking upload uploads to newly selected placement
- [ ] Confirm correct placement is updated

## Feature 3: Remove Image

### Remove Button Visibility
- [ ] Button only appears when image is assigned
- [ ] Button disappears after image is removed
- [ ] Button text is "Remove Image"
- [ ] Button is red (destructive styling)

### Remove Confirmation
- [ ] Click "Remove Image" button
- [ ] Browser confirmation dialog appears
- [ ] Dialog asks to confirm removal
- [ ] Click "Cancel" - nothing happens
- [ ] Click "OK" - proceeds with removal

### Remove Process
- [ ] After confirming, image begins removing
- [ ] Green success toast appears: "Image removed successfully"
- [ ] Preview panel disappears (green panel gone)
- [ ] Upload panel changes to "Upload Image"
- [ ] Remove button disappears
- [ ] Front-end image is removed/gone

### Remove Error Handling
- [ ] Simulate network error during removal
- [ ] Red error toast appears: "Error removing image"
- [ ] Component remains usable
- [ ] Image still assigned after error
- [ ] User can retry removal

## Feature 4: Toast Notifications

### Success Toast
- [ ] Success toast has green background
- [ ] Green checkmark icon appears
- [ ] Message is clear and concise
- [ ] Appears in top-right corner
- [ ] Auto-dismisses after 3 seconds
- [ ] Multiple operations show sequential toasts

### Error Toast
- [ ] Error toast has red background
- [ ] Red alert icon appears
- [ ] Message describes the error
- [ ] Appears in top-right corner
- [ ] Auto-dismisses after 3 seconds

### Toast Dismissal
- [ ] Toast automatically disappears after 3 seconds
- [ ] No manual close button needed
- [ ] Multiple toasts don't stack indefinitely
- [ ] Can dismiss by performing another action

### Toast Messages
Check each message appears correctly:
- [ ] "Image replaced successfully" (green)
- [ ] "Image removed successfully" (green)
- [ ] "Failed to upload image" (red)
- [ ] "Failed to remove image" (red)
- [ ] "Error uploading image" (red)
- [ ] "Error removing image" (red)

## Feature 5: Front-End Integration

### Image Updates After Upload
- [ ] Open home page in separate browser tab
- [ ] Return to admin, upload image to a placement
- [ ] Switch to home page
- [ ] Refresh page
- [ ] New image appears in correct placement location
- [ ] Old image is completely gone

### Image Removal on Front-End
- [ ] Remove image from placement in admin
- [ ] Switch to home page
- [ ] Refresh page
- [ ] Image is gone from front-end
- [ ] Placement shows empty/placeholder (expected behavior)

### Multiple Placements
- [ ] Update images for different placements
- [ ] Verify each placement on front-end shows correct image
- [ ] No cross-contamination between placements

## Performance & Responsiveness

### Upload Performance
- [ ] Small image (< 1MB) uploads within 2 seconds
- [ ] Larger image (2-5MB) uploads within 5 seconds
- [ ] UI remains responsive during upload
- [ ] Can't accidentally submit multiple times

### Mobile Responsiveness
- [ ] Test on mobile (iPhone 375px, Android 360px)
- [ ] Preview image is readable on small screen
- [ ] File input is accessible
- [ ] Buttons are 44px+ for touch
- [ ] No horizontal scrolling
- [ ] Text is properly sized

### Tablet Responsiveness
- [ ] Test on tablet (iPad 768px)
- [ ] Layout adapts to tablet width
- [ ] All controls are easily accessible
- [ ] Preview size is appropriate

### Desktop Responsiveness
- [ ] Test on large desktop (1440px+)
- [ ] Layout uses available space well
- [ ] No oversized elements
- [ ] Proportions look balanced

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## API Integration

### API Calls
- [ ] Open network tab (F12)
- [ ] Upload image, verify POST to `/api/media`
- [ ] Verify PUT to `/api/media/placements`
- [ ] Verify x-admin-key header is sent
- [ ] Verify response contains correct data

### Auth Verification
- [ ] Change ADMIN_KEY in environment
- [ ] Verify upload fails with "Unauthorized"
- [ ] Restore correct ADMIN_KEY
- [ ] Uploads work again

### Error Responses
- [ ] Disconnect network during upload
- [ ] Verify error toast appears
- [ ] Network status in console shows failed request
- [ ] Component recovers gracefully

## Data Integrity

### Database State
- [ ] After upload, new media asset exists in database
- [ ] After assignment, placement references correct media
- [ ] After removal, placement has no media reference
- [ ] No orphaned media assets created

### Media Library
- [ ] Uploaded images appear in Media Management tab
- [ ] Image metadata is correct (title, description)
- [ ] Image URL is accessible
- [ ] Image is retrievable via API

## Edge Cases

### Edge Case: No Images in Library
- [ ] Even with empty media library, upload works
- [ ] New image is created and assigned in one flow

### Edge Case: Same Image Multiple Times
- [ ] Upload same image to different placements
- [ ] Each placement gets its own assignment
- [ ] Images are correctly indexed

### Edge Case: Rapid Submissions
- [ ] Quickly select file and click upload twice
- [ ] Second click is ignored (button disabled)
- [ ] Only one upload happens

### Edge Case: Large File
- [ ] Test with 10MB+ image file
- [ ] Verify upload still works (if browser allows)
- [ ] Or verify appropriate error message

### Edge Case: Missing Admin Key
- [ ] Remove ADMIN_KEY from environment
- [ ] Try to upload
- [ ] Verify 401 error and appropriate message
- [ ] Restore ADMIN_KEY

## Accessibility

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] File input is keyboard accessible
- [ ] Buttons can be activated with Enter/Space
- [ ] Focus is visible on all elements

### Screen Reader
- [ ] File input has associated label
- [ ] Toast notifications are announced (aria-live)
- [ ] Buttons have descriptive text
- [ ] Images have alt text

### Color Contrast
- [ ] Success toast is readable (green)
- [ ] Error toast is readable (red)
- [ ] Text on all backgrounds meets WCAG AA
- [ ] Icon colors are visible

## Admin Workflow

### Complete Workflow 1: Fresh Upload
1. [ ] Select placement with no image
2. [ ] Select image file
3. [ ] Click "Upload Image"
4. [ ] Verify success toast
5. [ ] Verify preview appears
6. [ ] Verify front-end updates

### Complete Workflow 2: Replace Image
1. [ ] Select placement with image
2. [ ] View current preview
3. [ ] Select new image file
4. [ ] Click "Replace Image"
5. [ ] Verify success toast
6. [ ] Verify preview updates
7. [ ] Verify front-end updates

### Complete Workflow 3: Remove Image
1. [ ] Select placement with image
2. [ ] View current preview
3. [ ] Click "Remove Image"
4. [ ] Confirm removal
5. [ ] Verify success toast
6. [ ] Verify preview disappears
7. [ ] Verify front-end updates

## Final Sign-Off

- [ ] All features working as expected
- [ ] No console errors
- [ ] No network errors
- [ ] Responsive across all devices
- [ ] Accessible to all users
- [ ] Ready for production deployment

---

## Notes & Issues Found

Use this space to document any issues found during testing:

```
Issue #1:
Description:
Steps to Reproduce:
Expected:
Actual:
Severity: [Low/Medium/High/Critical]
```

## Test Completion

- **Date Tested:** ___________
- **Tested By:** ___________
- **Overall Status:** [ ] PASS [ ] FAIL
- **Issues Found:** ___________
- **Ready for Release:** [ ] YES [ ] NO
