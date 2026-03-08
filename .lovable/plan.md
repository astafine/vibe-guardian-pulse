

## Plan: Add Counselor List to "Talk to Counselor" Button

The "Talk to Counselor" button (line 228) is currently static with no expand behavior. I'll make it toggleable like the other panels, showing a list of 2-3 dummy Indian school counselors.

### Changes to `src/pages/ChildProfile.tsx`:

1. **Add `'counselor'` to the `ActivePanel` type** (line 29)
2. **Add a dummy counselors array** near the top:
   - Mrs. Sunita Sharma (Senior School Counselor)
   - Mr. Rajesh Iyer (Student Wellness Coordinator)  
   - Ms. Priya Nair (Junior School Counselor)
3. **Make the "Talk to Counselor" button toggleable** — same pattern as nudge/toolkit panels
4. **Add an expandable panel below it** showing counselor cards with name, role, and a "Chat" or "Contact" action button

This follows the exact same expand/collapse pattern already used for "Nudge Parents" and "The Toolkit".

