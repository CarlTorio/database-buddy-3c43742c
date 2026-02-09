
# Plan: Fix "Join Now" Button to Scroll to Inquiry Form

## Summary
Update the "Join Now" buttons to scroll directly to the "Inquire About Membership" form instead of the top of the membership section.

## What Will Change

### 1. Add ID to the Inquiry Form (MembershipSection.tsx)
Add a unique `id="membership-inquiry"` to the inquiry form card so we can link directly to it.

### 2. Update Hero "Join Now" Button (Hero.tsx)
Change the anchor link from `#membership` to `#membership-inquiry` so clicking scrolls to the form.

### 3. Update Header "Join Now" Button (Header.tsx)
- Desktop: Change `navigate("/membership")` to scroll to `#membership-inquiry` on the homepage
- Mobile: Same behavior - scroll to the inquiry form section

## Files to Modify
- `src/components/MembershipSection.tsx` - Add `id` to the form container
- `src/components/Hero.tsx` - Update href to `#membership-inquiry`
- `src/components/Header.tsx` - Update Join Now button click handler

## Technical Details

### MembershipSection.tsx (Line 135-139)
```tsx
// Add id="membership-inquiry" to the form card
<motion.div
  id="membership-inquiry"
  initial={{ opacity: 0, x: 40 }}
  ...
```

### Hero.tsx (Line 146)
```tsx
// Change href from #membership to #membership-inquiry
<a href="#membership-inquiry">Join Now</a>
```

### Header.tsx (Lines 108-114, 166-175)
```tsx
// Desktop: Change onClick to scroll to #membership-inquiry
onClick={() => {
  if (location.pathname === "/") {
    document.getElementById("membership-inquiry")?.scrollIntoView({ behavior: "smooth" });
  } else {
    navigate("/");
    setTimeout(() => {
      document.getElementById("membership-inquiry")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}}

// Mobile: Same logic for the mobile Join Now button
```

## Expected Result
When clicking "Join Now" from the Hero or Header:
- If on homepage → smooth scroll directly to the inquiry form
- If on another page → navigate to homepage, then scroll to the inquiry form
