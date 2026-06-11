/* =========================================================
   Ashlesha Chauhan — Portfolio Scripts (Vanilla JS)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Theme (dark / light) toggle ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  const root = document.documentElement;

  // (typing roles defined in section 4)

  // Restore saved preference, else respect system setting
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startTheme = saved || (prefersDark ? "dark" : "light");
  applyTheme(startTheme);

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  /* ---------- 2. Mobile navigation ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  // Close menu when a link is clicked
  navLinks.querySelectorAll(".nav-link").forEach(link =>
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    })
  );

  /* ---------- 3. Navbar shadow on scroll ---------- */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    toTop.classList.toggle("show", window.scrollY > 500);
    highlightNav();
  });

  /* ---------- 4. Typing effect for hero role ---------- */
  const roles = [
    "Full-Stack Developer",
    "AI / ML Engineer",
    "MERN Stack Developer",
    "Generative AI Enthusiast"
  ];
  const typedEl = document.getElementById("typed");
  let roleIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = roles[roleIndex];
    typedEl.textContent = deleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);

    let delay = deleting ? 45 : 95;
    if (!deleting && charIndex === current.length + 1) { deleting = true; delay = 1400; }
    else if (deleting && charIndex < 0) {
      deleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; delay = 300;
    }
    setTimeout(type, delay);
  }
  type();

  /* ---------- 5. Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 6. Animated skill bars ---------- */
  const skillsSection = document.getElementById("skills");
  const bars = document.querySelectorAll(".bar i");
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach(bar => { bar.style.width = bar.getAttribute("data-width"); });
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  if (skillsSection) skillsObserver.observe(skillsSection);

  /* ---------- 7. Animated stat counters ---------- */
  const counters = document.querySelectorAll(".stat-num");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => animateCount(counter));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  const statsStrip = document.querySelector(".stats-strip");
  if (statsStrip) counterObserver.observe(statsStrip);

  function animateCount(el) {
    const target = +el.getAttribute("data-target");
    const suffix = el.getAttribute("data-suffix") || "";
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      count += step;
      if (count >= target) { count = target; clearInterval(timer); }
      el.textContent = count.toLocaleString() + suffix;
    }, 25);
  }

  /* ---------- 8. Active nav link highlight ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-link");
  function highlightNav() {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navItems.forEach(item => {
      item.classList.toggle("active", item.getAttribute("href") === "#" + current);
    });
  }

  /* ---------- 9. Contact form (client-side handling) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message) {
      setStatus("Please fill in all fields.", "err"); return;
    }
    if (!emailValid) {
      setStatus("Please enter a valid email address.", "err"); return;
    }

    // No backend on GitHub Pages — open the user's email client as a fallback.
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:chauhanashlesha980@gmail.com?subject=${subject}&body=${body}`;

    setStatus("Thank you! Your email client is opening to send the message.", "ok");
    form.reset();
  });

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = "form-status " + type;
  }

  /* ---------- 10. Back to top + current year ---------- */
  const toTop = document.getElementById("toTop");
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.getElementById("year").textContent = new Date().getFullYear();

  // Expose toTop for the scroll handler above
  window.toTop = toTop;
});
