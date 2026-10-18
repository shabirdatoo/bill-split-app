# 🧾 FairShare — Smart Restaurant Bill & Receipt Splitter

A modern, responsive web application designed for settling restaurant bills with friends. Upload or photograph your receipt, assign dishes to friends, split shared plates (even by custom portions), calculate proportional service charges fairly, and settle up with whoever paid the bill.

---

## 🚀 How to Run the App on Your Mac

Because this app uses modern web standards (HTML5, CSS3, and JavaScript), it requires **zero installation** and runs on any Mac!

### Quick Start (Built-in Python Server)
Open Terminal and run:

```bash
cd "/Users/shabirdatoo/Documents/Bill Split App"
python3 -m http.server 8000
```

Then open your browser and go to:
👉 **[http://localhost:8000](http://localhost:8000)**

*(You can also access this URL from your iPhone or Android phone on the same Wi-Fi network!)*

---

## 🌟 Key Features

1. **Receipt Capture & Itemization**:
   - Upload receipt photos or snap with your phone's camera.
   - Built-in OCR (Optical Character Recognition) using Tesseract.js.
   - Editable item list with live price and quantity updates.
   - Instant "Try Sample Receipt" preset for quick testing.

2. **The "Payer" Settlement Model**:
   - In real meals, one person puts their card down.
   - Select who paid, and FairShare calculates exactly what everyone owes them back.

3. **Smart Item Claiming & Shared Dishes**:
   - Tap a friend's badge to claim an item (100%).
   - Tap multiple friends to split an item evenly (50/50, 1/3, etc.).
   - **Custom portion / slice splitter**: Split dishes by custom ratios (e.g. 1 slice vs 3 slices).

4. **Proportional Service Charge & Exact Penny Balancing**:
   - Rather than dividing service charge equally (which penalizes people who only ordered coffee or salad), service charge is split **proportionally** based on individual food and drink spend.
   - Exact penny balance check guarantees that the sum of individual shares matches the restaurant receipt total.

5. **WhatsApp / Group Chat Summary**:
   - Copy a clean, formatted breakdown in one tap to paste straight into your group chat.

---

## 📚 What We Built & Key Concepts to Learn

- **`index.html` (The Skeleton)**:
  - Accessible, semantic markup.
  - Divided into 3 guided steps: (1) Receipt & Items &rarr; (2) Friends & Claiming &rarr; (3) Summary & Settle.
- **`styles.css` (The Visual Design)**:
  - Mobile-first responsive layout (works great on phones at the table).
  - CSS Custom Properties (Variables) for consistent colors, shadows, and status highlights.
  - Clear visual feedback (Amber = Unassigned, Green = Claimed, Violet = Shared).
- **`app.js` (The Logic & Engine)**:
  - **State Management**: A clean `state` object holding items, friends, payer, and charges.
  - **Proportional Math**: Fair tip/service distribution formula.
  - **OCR Parsing**: Regular expressions that detect receipt line items, prices, and quantities.
