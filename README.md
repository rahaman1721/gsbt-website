# GSBT Website Clone

A reverse-engineered recreation of the [Gojan School of Business and Technology](https://gsbt.edu.in/) official website (`gsbt.edu.in`).

## 🏫 About the Institution

**Gojan School of Business and Technology (GSBT)** is an autonomous engineering institution located in Chennai, Tamil Nadu.

- ✅ Approved by AICTE, New Delhi
- ✅ Affiliated to Anna University, Chennai
- ✅ NAAC Accredited Institution
- 🎓 TNEA Code: **1123**
- 📍 Redhills Road, Avadi, Chennai – 600 062

---

## 🛠️ Tech Stack

This is a **vanilla HTML, CSS & JavaScript** website (no framework).

| Technology | Usage |
|---|---|
| HTML5 | Page structure |
| CSS3 (custom `styles.css`) | All styling — 165KB of custom styles |
| Bootstrap 5.3.2 | Grid, responsive layout |
| Font Awesome 6.4 | Icons |
| Animate.css 4.1.1 | Scroll animations |
| Google Fonts | Inter, Poppins, Montserrat, Outfit |
| Vanilla JavaScript | Slider, counter, mobile nav, AOS |

---

## 🎨 Design System

```css
/* Color Palette */
--primary:       #2f4f2f;   /* Dark Forest Green */
--secondary:     #416d41;   /* Medium Forest Green */
--accent:        #d8ae11;   /* Gold */
--text-dark:     #1a1a1a;
--bg-light:      #f8fafc;
```

---

## 📁 Project Structure

```
gsbt-website-clone/
├── index.html              ← Homepage (main entry point)
├── css/
│   ├── styles.css          ← Main custom stylesheet (165KB)
│   └── chatbot.css         ← Chatbot widget styles
├── js/
│   ├── script.js           ← Hero slider, counter, AOS, mobile nav
│   └── chatbot.js          ← Chatbot functionality
├── images/
│   ├── gojan-logo.png      ← Institution logo
│   ├── slider/             ← Hero carousel images (1.jpg, 2.jpg, 3.jpg)
│   └── ...
├── About/                  ← About pages (vision, leadership, etc.)
├── Academics/              ← Academic pages
├── Admission/              ← Admission pages
├── Departments/            ← 16 department pages
├── Campus-Life/            ← Student clubs, sports, facilities
├── Utility/                ← NAAC, NIRF, UGC, careers pages
├── COE/                    ← Exam schedule (Center of Excellence)
└── README.md
```

---

## 🧭 Navigation Structure

```
Home
About Us ▾
  Life@Gojan · Why GSBT? · Vision & Mission
  Chairman · Chairperson · Vice-Chairman · Principal
  VP Academic · VP Student · Directors
  Governing Council · Privacy Policy · Committees · Approval & Affiliation

Academics ▾
  Academic Council · Academic Schedule · Academic Calendar
  Regulations · Curriculum & Syllabus · Annual Report

Departments ▾ (16 Departments)
  CSE · AI&ML · Cyber Security · ECE · Mechanical · Medical Electronics
  CCE · Robotics · IT · AI&DS · CS&BS · Pharma · Biotech
  Aeronautical · MBA · H&S

Admissions ▾
  Eligibility · Procedure · Apply Online · Brochure · Scholarships

Placements ▾
  Corporate Connect · Career Framework · Hiring Highlights
  Regular Recruiters · Guidance Panel · ED Cell

Accreditation (NAAC · NIRF · UGC · AICTE)

Research & Innovation

Campus Life ▾
  Student Clubs · Sports · Library · Facilities · Best Practices

Contact
```

---

## ⚙️ Key JavaScript Features

| Feature | Implementation |
|---|---|
| Hero Slider | Auto-rotates every 5 seconds, prev/next buttons |
| Stats Counter | Animates on scroll using `IntersectionObserver` |
| AOS (Animate on Scroll) | Custom `IntersectionObserver` implementation |
| Mobile Navigation | Hamburger toggle with dropdown support |
| FAQ Accordion | Click to expand, closes others |
| Video Modal | Opens YouTube embed with autoplay |

---

## 🚀 How to Run Locally

No build step required — pure HTML/CSS/JS:

```bash
# Option 1: Open directly in browser
start index.html

# Option 2: Use VS Code Live Server
# Install Live Server extension → Right-click index.html → Open with Live Server

# Option 3: Python simple server
python -m http.server 8080
# Then visit: http://localhost:8080
```

---

## 📌 Live Site

🌐 **Original:** [https://gsbt.edu.in](https://gsbt.edu.in)

📞 Phone: 044-26311045
📧 Email: gsbt@gsbt.edu.in

---

## 👨‍💻 Developer

**Obaidhur Rahaman**
Full Stack & Hybrid App Developer | UI/UX Designer

🌐 [Portfolio](https://rahaman1721.framer.website/) · 💼 [LinkedIn](https://www.linkedin.com/in/obaidhur-rahaman-1721z) · 📧 rahaman171920@gmail.com

> *This project was reverse-engineered for portfolio and learning purposes. All content belongs to Gojan School of Business and Technology.*
