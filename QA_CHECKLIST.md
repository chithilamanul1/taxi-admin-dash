# 🧪 Master QA Checklist: Airport Taxis Sri Lanka

## 🚨 1. Booking Engine (The Core)

- [ ] **Data Entry & Validation**
  - [ ] Pickup/Dropoff inputs autocomplete correctly (Google Places API).
  - [ ] Selecting "Airport" triggers flight number input (if applicable) or popular route logic.
  - [ ] Date/Time picker blocks past dates/times.
  - [ ] Passenger count limits (Max 3 for Car, 5 for Van, etc.) - *Check logic*.
- [ ] **Pricing Logic**
  - [ ] Distance calculation is accurate (> 0km).
  - [ ] Base price calculates correctly for standard routes.
  - [ ] **Popular Route Check**: Airport -> Mirissa/Galle triggers fixed price.
  - [ ] Round Trip toggle doubles price (approx).
  - [ ] Currency conversion works (USD/EUR/GBP/INR -> LKR).
- [ ] **Vehicle Selection**
  - [ ] All vehicle categories (Car, Mini Van, KDH, Bus) displayed.
  - [ ] Correct images for each category.
  - [ ] "Features" list (AC, Bags, etc.) is correct for each.
- [ ] **Checkout & Payment**
  - [ ] Payment Method selection (Cash/Card) updates total (if fees apply).
  - [ ] "Complete Booking" submits data to DB.
  - [ ] Loading state appears during submission.
  - [ ] Success page/modal appears after booking.
  - [ ] Email confirmation sent to User & Admin.

## 🛠️ 2. Admin Dashboard (`/admin`)

- [ ] **Authentication**
  - [ ] Protected route: Redirects to `/admin/login` if unauthenticated.
  - [ ] Admin Login works.
  - [ ] Logout works.
- [ ] **Booking Management**
  - [ ] List View: Shows all bookings with correct status colors.
  - [ ] Detail View: Shows full route, customer info, and price.
  - [ ] Actions: Can Confirm, Complete, and Cancel bookings.
- [ ] **Driver Management**
  - [ ] Driver List loads.
  - [ ] "Add Driver" form works (validation on phone/email).
  - [ ] "Assign Driver" to booking works.
- [ ] **Pricing Engine**
  - [ ] Pricing table loads.
  - [ ] Edit Pricing works and saves to DB.
- [ ] **Support & Reviews**
  - [ ] Support Ticket list loads (Fixed `undefined` error).
  - [ ] Can reply to tickets.
  - [ ] Review moderation (Approve/Reject) works.

## 🚕 3. Driver Portal (`/driver`)

- [ ] **Access**
  - [ ] Driver Login works.
  - [ ] Dashboard loads specific driver data.
- [ ] **Job Management**
  - [ ] "New Jobs" appear when assigned.
  - [ ] Can Accept/Reject jobs.
  - [ ] "Trip Status" updates (On way -> Picked up -> Dropped).

## 🌍 4. Public Pages & UI

- [ ] **Homepage**
  - [ ] Hero section loads LCP (Largest Contentful Paint) fast.
  - [ ] "Why Choose Us" icons aligned.
  - [ ] Testimonials carousel works.
- [ ] **Destinations**
  - [ ] `/destinations` lists all locations.
  - [ ] Individual slug pages (`/destination/mirissa`) load correct data.
  - [ ] "Book This Route" button pre-fills booking widget.
- [ ] **Fleet Page**
  - [ ] Vehicle grid responsive (mobile stack, desktop grid).
- [ ] **Contact**
  - [ ] Contact form submission works.
  - [ ] Google Map loads.

## ⚙️ 5. Technical & Performance

- [ ] **Build Integrity**
  - [ ] `npm run build` succeeds.
  - [ ] No critical lint errors.
- [ ] **Mobile Responsiveness**
  - [ ] Navbar hamburger menu toggles.
  - [ ] No horizontal scroll on mobile.
  - [ ] Buttons are touch-friendly size.
- [ ] **SEO & Metadata**
  - [ ] Title tags and Meta descriptions present on key pages.
  - [ ] Heading hierarchy (H1 -> H2 -> H3) correct.

## 🔒 6. Security

- [ ] API Routes protected (Check `getServerSession`).
- [ ] No sensitive keys exposed in client bundles.
