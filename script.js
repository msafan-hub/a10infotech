// Mobile navigation toggle + page animations + Join A10 popup

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Fade-in on scroll
  const fadeItems = document.querySelectorAll(".fade-item");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeItems.forEach((item) => observer.observe(item));
  }

  // Animated network canvas
  initNetworkCanvas();

  // JOIN A10 SLIDE-DOWN POPUP (only on careers page where element exists)
  const joinPopup = document.getElementById("joinA10Popup");
  if (joinPopup) {
    const closeBtn = joinPopup.querySelector(".join-a10-close");

    // Show popup after 7 seconds
    setTimeout(() => {
      joinPopup.classList.add("visible");
    }, 7000);

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        joinPopup.classList.remove("visible");
      });
    }
      // HOME PAGE WELCOME POPUP (shown once per session)
  const welcomePopup = document.getElementById("welcomePopup");
  if (welcomePopup && window.sessionStorage) {
    const alreadyShown = sessionStorage.getItem("a10WelcomeShown");

    if (!alreadyShown) {
      setTimeout(() => {
        welcomePopup.classList.add("visible");
        sessionStorage.setItem("a10WelcomeShown", "yes");
      }, 2500);
    }

    const closeBtn = welcomePopup.querySelector(".welcome-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        welcomePopup.classList.remove("visible");
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        welcomePopup.classList.remove("visible");
      }
    });
  }
  
    // Close with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        joinPopup.classList.remove("visible");
      }
    });
  }
});

function initNetworkCanvas() {
  const canvas = document.getElementById("networkCanvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  let nodes = [];
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createNodes() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const count = 28;
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 2 + Math.random() * 2,
      });
    }
  }

  function step() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const alpha = 1 - dist / 110;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 2);
      g.addColorStop(0, "rgba(248, 250, 252, 1)");
      g.addColorStop(1, "rgba(56, 189, 248, 0.7)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
    requestAnimationFrame(step);
  }

  function init() {
    resizeCanvas();
    createNodes();
    step();
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createNodes();
  });

  init();
}

