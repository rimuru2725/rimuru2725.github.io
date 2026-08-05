/* ============================================================
   VIVEK'S PORTFOLIO — 3D ENGINE + ANIMATIONS + INTERACTIONS
   ============================================================ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────
     0 ▸ GLOBALS
     ────────────────────────────────────────── */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollDir = "down";
  let lastScroll = 0;

  /* ──────────────────────────────────────────
     1 ▸ THREE.JS — IMMERSIVE HERO SCENE
     ────────────────────────────────────────── */
  function initHeroScene() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;

    const isMobile = window.innerWidth <= 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));

    /* ── Main Torus Knot ── */
    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(9, 3, isMobile ? 60 : 120, isMobile ? 8 : 16),
      new THREE.MeshBasicMaterial({
        color: 0x02794c,
        wireframe: true,
        transparent: true,
        opacity: 0.10,
      })
    );
    scene.add(torusKnot);

    // Adjust placement for very wide/desktops so the background doesn't overpower content
    const applyWideLayout = () => {
      const isWide = window.innerWidth >= 1400 && !isMobile;
      if (isWide) {
        torusKnot.scale.set(0.86, 0.86, 0.86);
        torusKnot.position.x = -8;
      } else {
        torusKnot.scale.set(1, 1, 1);
        torusKnot.position.x = 0;
      }
      if (stars && stars.material) {
        stars.material.opacity = isWide ? 0.45 : 0.65;
      }
      // nudge floating shapes slightly left on wide layouts
      shapes.forEach((s) => {
        s.position.x += isWide ? -6 : 0;
      });
    };

    /* ── Floating Shapes ── */
    const shapes = [];
    const geos = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
    ];
    const palette = [0x02794c, 0x04a66b, 0x34d399, 0x02794c];

    const shapeCount = isMobile ? 6 : 14;
    for (let i = 0; i < shapeCount; i++) {
      const geo = geos[i % geos.length];
      const mat = new THREE.MeshBasicMaterial({
        color: palette[i % palette.length],
        wireframe: true,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.12,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 25 - 5
      );
      const s = 0.5 + Math.random() * 1.8;
      mesh.scale.set(s, s, s);
      mesh.userData = {
        rx: 0.002 + Math.random() * 0.008,
        ry: 0.002 + Math.random() * 0.006,
        offset: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
        amp: 0.008 + Math.random() * 0.018,
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    /* ── Star Field ── */
    const starCount = isMobile ? 800 : 2800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 220;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.07,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
      })
    );
    scene.add(stars);

    // apply initial wide layout tweaks
    applyWideLayout();

    /* ── Animation Loop ── */
    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);

      // Smooth mouse follow
      mouse.tx += (mouse.x - mouse.tx) * 0.02;
      mouse.ty += (mouse.y - mouse.ty) * 0.02;

      // Main torus knot
      torusKnot.rotation.x += 0.002;
      torusKnot.rotation.y += 0.004;
      torusKnot.rotation.x += mouse.ty * 0.015;
      torusKnot.rotation.y += mouse.tx * 0.015;

      // Stars
      stars.rotation.y += 0.00015;
      stars.rotation.x += 0.0001;

      // Floating shapes
      const t = Date.now() * 0.001;
      shapes.forEach((s) => {
        const d = s.userData;
        s.rotation.x += d.rx;
        s.rotation.y += d.ry;
        s.position.y += Math.sin(t * d.speed + d.offset) * d.amp;
      });

      renderer.render(scene, camera);
    }

    animate();

    /* ── Resize ── */
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      // Re-apply layout tweaks when resizing
      applyWideLayout();
    });
  }

  /* ──────────────────────────────────────────
     2 ▸ CUSTOM CURSOR
     ────────────────────────────────────────── */
  function initCursor() {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let tracking = false;

    const setCursorMode = (enabled) => {
      document.body.classList.toggle("custom-cursor-active", enabled);
      dot.style.display = enabled ? "" : "none";
      ring.style.display = enabled ? "" : "none";
      if (!enabled) {
        dot.classList.remove("hovering");
        ring.classList.remove("hovering");
      }
    };

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";

      requestAnimationFrame(() => {
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
      });
    };

    const enableTracking = () => {
      if (tracking) return;
      tracking = true;
      document.addEventListener("mousemove", onMouseMove);
    };

    const disableTracking = () => {
      if (!tracking) return;
      tracking = false;
      document.removeEventListener("mousemove", onMouseMove);
    };

    const syncCursor = () => {
      const enabled = finePointerQuery.matches;
      setCursorMode(enabled);
      if (enabled) {
        enableTracking();
      } else {
        disableTracking();
      }
    };

    syncCursor();
    finePointerQuery.addEventListener("change", syncCursor);

    /* Event delegation for hover scaling on all current and dynamically created elements */
    const interactiveSelector = "a, button, .project-card, .skill-card, .cert-card, .contact-card, .stat-card, .pipeline-node, .filter-btn, .cmd-item, .nav-icon-btn, .dot, .btn-open-modal, input, textarea";

    document.addEventListener("mouseover", (e) => {
      if (!finePointerQuery.matches) return;
      if (e.target.closest(interactiveSelector)) {
        dot.classList.add("hovering");
        ring.classList.add("hovering");
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (!finePointerQuery.matches) return;
      if (e.target.closest(interactiveSelector)) {
        dot.classList.remove("hovering");
        ring.classList.remove("hovering");
      }
    });
  }

  /* ──────────────────────────────────────────
     3 ▸ SCROLL PROGRESS BAR
     ────────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;

    window.addEventListener(
      "scroll",
      () => {
        const h =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = (window.scrollY / h) * 100;
        bar.style.width = pct + "%";
      },
      { passive: true }
    );
  }

  /* ──────────────────────────────────────────
     4 ▸ NAVIGATION
     ────────────────────────────────────────── */
  function initNavigation() {
    const nav = document.getElementById("navbar");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    const allLinks = document.querySelectorAll(".nav-link");
    if (!nav) return;

    /* Hide / show on scroll direction */
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        scrollDir = y > lastScroll ? "down" : "up";
        if (y > 300 && scrollDir === "down") {
          nav.classList.add("hidden");
        } else {
          nav.classList.remove("hidden");
        }
        lastScroll = y;
      },
      { passive: true }
    );

    /* Active section highlight */
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener(
      "scroll",
      () => {
        let current = "";
        sections.forEach((sec) => {
          if (window.scrollY >= sec.offsetTop - 200) {
            current = sec.id;
          }
        });
        allLinks.forEach((l) => {
          l.classList.toggle("active", l.dataset.section === current);
        });
      },
      { passive: true }
    );

    /* Mobile toggle */
    if (toggle && links) {
      const setMenuOpen = (open) => {
        toggle.classList.toggle("open", open);
        links.classList.toggle("open", open);
        document.body.classList.toggle("menu-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      };

      toggle.addEventListener("click", () => {
        setMenuOpen(!links.classList.contains("open"));
      });

      allLinks.forEach((l) => {
        l.addEventListener("click", () => setMenuOpen(false));
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && links.classList.contains("open")) {
          setMenuOpen(false);
        }
      });
    }

    /* Smooth scroll for anchor links */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     5 ▸ TYPED.JS
     ────────────────────────────────────────── */
  function initTyped() {
    const el = document.querySelector(".typed-text");
    if (!el || typeof Typed === "undefined") return;

    new Typed(".typed-text", {
      strings: [
        "DevOps Engineer",
        "Platform Engineer",
        "Cloud Engineer",
        "Automation & Reliability",
      ],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 2200,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }

  // Removed 3D skill sphere — replaced with a categorized tech grid in HTML/CSS.

  /* ──────────────────────────────────────────
     7 ▸ GSAP + SCROLLTRIGGER ANIMATIONS
     ────────────────────────────────────────── */
  function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;
    gsap.registerPlugin(ScrollTrigger);

    /* ─ Hero entrance ─ */
    const heroTl = gsap.timeline({ delay: 0.4 });
    heroTl
      .from("#heroBadge", { y: 30, opacity: 0, duration: 0.7 })
      .from("#heroTitle", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.3")
      .from("#heroVisual", { x: 60, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
      .from("#heroTyped", { y: 25, opacity: 0, duration: 0.7 }, "-=0.6")
      .from("#heroDesc", { y: 25, opacity: 0, duration: 0.7 }, "-=0.4")
      .from(
        "#heroActions .btn",
        {
          y: 25,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.3"
      )
      .from("#scrollHint", { y: 15, opacity: 0, duration: 0.5 }, "-=0.2");

    /* ─ Section headers (each child staggers) ─ */
    gsap.utils.toArray(".section-header").forEach((hdr) => {
      gsap.from(hdr.children, {
        scrollTrigger: { trigger: hdr, start: "top 88%" },
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    });

    /* ─ About ─ */
    gsap.from(".about-text", {
      scrollTrigger: { trigger: ".about-grid", start: "top 82%" },
      x: -50,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });
    gsap.from(".about-visual", {
      scrollTrigger: { trigger: ".about-grid", start: "top 82%" },
      x: 50,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });

    /* ─ Stats ─ */
    const statsTrigger = ScrollTrigger.create({
      trigger: "#statsGrid",
      start: "top 88%",
      onEnter: () => {
        animateCounters();
        statsTrigger.kill();
      },
    });
    gsap.from(".stat-card", {
      scrollTrigger: { trigger: "#statsGrid", start: "top 88%" },
      y: 45,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });

    /* ─ Timeline track fill ─ */
    gsap.to("#timelineTrackFill", {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: "#timeline",
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
    });

    /* ─ Timeline items ─ */
    gsap.utils.toArray(".timeline-item").forEach((item) => {
      const isLeft = item.classList.contains("timeline-item--left");
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: "top 88%" },
        x: isLeft ? -70 : 70,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
      });
    });

    /* ─ Tech grid entrance ─ */
    gsap.from(".tech-column", {
      scrollTrigger: { trigger: "#skills", start: "top 88%" },
      y: 35,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "all"
    });

    /* ─ Skill bars ─ */
    const barsTrigger = ScrollTrigger.create({
      trigger: "#proficiencySection",
      start: "top 85%",
      onEnter: () => {
        animateSkillBars();
        barsTrigger.kill();
      },
    });
    gsap.from(".proficiency-item", {
      scrollTrigger: { trigger: "#proficiencySection", start: "top 88%" },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });

    /* ─ Certifications ─ */
    gsap.from(".cert-card", {
      scrollTrigger: { trigger: "#certsGrid", start: "top 88%" },
      y: 45,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });

    /* ─ Projects ─ */
    gsap.from(".project-card", {
      scrollTrigger: { trigger: "#projectsGrid", start: "top 88%" },
      y: 70,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });

    /* ─ Contact cards ─ */
    gsap.from(".contact-card", {
      scrollTrigger: { trigger: "#contactCards", start: "top 88%" },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });

    /* ─ Contact form ─ */
    gsap.from("#contactFormWrap", {
      scrollTrigger: { trigger: "#contactFormWrap", start: "top 88%" },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  /* ──────────────────────────────────────────
     8 ▸ COUNTER ANIMATION
     ────────────────────────────────────────── */
  function animateCounters() {
    document.querySelectorAll(".stat-value").forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;

      const duration = 1800; // ms
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * ease);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target + "+";
        }
      }
      requestAnimationFrame(tick);
    });
  }

  /* ──────────────────────────────────────────
     9 ▸ SKILL BARS ANIMATION
     ────────────────────────────────────────── */
  function animateSkillBars() {
    document.querySelectorAll(".skill-bar-fill").forEach((bar) => {
      const pct = bar.dataset.progress;
      if (!pct) return;
      // Tiny delay then animate
      requestAnimationFrame(() => {
        bar.style.width = pct + "%";
        bar.classList.add("animated");
      });
    });
  }

  /* ──────────────────────────────────────────
     9b ▸ GITHUB / DEV METRICS
     ────────────────────────────────────────── */
  function initGitHubStats() {
    const user = "rimuru2725";
    const url = `https://api.github.com/users/${user}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const reposEl = document.querySelector("#metricRepos .metric-value");
        const follEl = document.querySelector("#metricFollowers .metric-value");
        if (reposEl) reposEl.textContent = data.public_repos ?? "—";
        if (follEl) follEl.textContent = data.followers ?? "—";

        // fetch top languages (simple approximation)
        fetch(data.repos_url + "?per_page=100")
          .then((r) => r.json())
          .then((repos) => {
            const langCount = {};
            repos.forEach((rp) => {
              if (!rp.language) return;
              langCount[rp.language] = (langCount[rp.language] || 0) + 1;
            });
            const langs = Object.keys(langCount).sort((a, b) => langCount[b] - langCount[a]).slice(0, 3);
            const langEl = document.querySelector("#metricLanguages .metric-value");
            if (langEl) langEl.textContent = langs.length ? langs.join(", ") : "—";
          })
          .catch(() => {});
      })
      .catch(() => {});
  }

  /* ──────────────────────────────────────────
     10 ▸ PROJECT CARD 3D TILT
     ────────────────────────────────────────── */
  function init3DProjectCards() {
    if (window.innerWidth <= 768 || window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;

        card.style.transform = `perspective(800px) rotateX(${(
          -dy * 5
        ).toFixed(2)}deg) rotateY(${(dx * 5).toFixed(
          2
        )}deg) translateZ(10px)`;
        card.style.transition = "none";
        card.style.boxShadow = `
          ${(-dx * 12).toFixed(1)}px ${(-dy * 12).toFixed(
          1
        )}px 35px rgba(2,121,76,0.07),
          0 12px 45px rgba(0,0,0,0.30),
          inset 0 0 0 1px rgba(2,121,76,0.18)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition =
          "transform 0.5s ease, box-shadow 0.5s ease";
        card.style.boxShadow = "";
      });
    });
  }

  /* ──────────────────────────────────────────
     11 ▸ PROFILE CARD 3D TILT
     ────────────────────────────────────────── */
  function initProfileCard() {
    if (window.innerWidth <= 768 || window.matchMedia("(hover: none)").matches) return;

    const wrapper = document.getElementById("profileCard");
    if (!wrapper) return;
    const inner = wrapper.querySelector(".profile-card-inner");

    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      inner.style.transform = `rotateX(${(-dy * 8).toFixed(
        2
      )}deg) rotateY(${(dx * 8).toFixed(2)}deg)`;
    });

    wrapper.addEventListener("mouseleave", () => {
      inner.style.transform = "";
    });
  }

  /* ──────────────────────────────────────────
     12 ▸ CONTACT FORM
     ────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const submitBtn = document.getElementById("submitBtn");

    // EmailJS config — set `enabled: true` and fill your IDs before publishing.
    // Sign up at https://www.emailjs.com/ (free tier available) to get these values.
    const EMAILJS_CONFIG = {
      enabled: false, // set to true after adding your keys
      user: "p-6k0AAlD0kTlIAU_",
      service: "service_od44uha",
      template: "template_j9lkwgh",
    };

    async function sendViaEmailJS(templateParams) {
      try {
        // init will error if user id is not set; guard it
        if (!EMAILJS_CONFIG.user || EMAILJS_CONFIG.user === "YOUR_EMAILJS_USER_ID") {
          throw new Error("EmailJS user ID not configured");
        }
        emailjs.init(EMAILJS_CONFIG.user);
        await emailjs.send(EMAILJS_CONFIG.service, EMAILJS_CONFIG.template, templateParams);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err };
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("nameInput").value.trim();
      const email = document.getElementById("emailInput").value.trim();
      const subject = document.getElementById("subjectInput").value.trim();
      const message = document.getElementById("messageInput").value.trim();

      // Basic validation
      if (!name || !email || !subject || !message) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

      // Loading state
      submitBtn.disabled = true;
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<span>Sending...</span><i class="bi bi-arrow-repeat" style="animation:spin 1s linear infinite"></i>';

      try {
        let result;
        if (EMAILJS_CONFIG.enabled) {
          const templateParams = { from_name: name, from_email: email, subject, message };
          result = await sendViaEmailJS(templateParams);
        } else {
          // No EmailJS configured — fallback to simulated send (keeps UX intact)
          result = await new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 900));
        }

        if (result.ok) {
          // Success
          submitBtn.innerHTML = '<span>Sent!</span><i class="bi bi-check-lg"></i>';
          submitBtn.style.background = "linear-gradient(135deg, #10B981, #059669)";
          form.reset();
        } else {
          throw result.error || new Error('Send failed');
        }

        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 2200);
      } catch (err) {
        console.error("Form error:", err);
        submitBtn.innerHTML = '<span>Error — Try Again</span><i class="bi bi-exclamation-triangle"></i>';
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        }, 2500);
      }
    });
  }

  /* ──────────────────────────────────────────
     13 ▸ FOOTER YEAR
     ────────────────────────────────────────── */
  function setFooterYear() {
    const el = document.getElementById("currentYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ──────────────────────────────────────────
     14 ▸ SPIN KEYFRAME (for loading spinner)
     ────────────────────────────────────────── */
  /* ──────────────────────────────────────────
     16 ▸ TOAST NOTIFICATION ENGINE
     ────────────────────────────────────────── */
  function showToast(msg, icon = "bi-info-circle-fill") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="bi ${icon}"></i><span>${msg}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  /* ──────────────────────────────────────────
     17 ▸ AUDIO HAPTICS ENGINE (WEB AUDIO API)
     ────────────────────────────────────────── */
  let audioMuted = true;
  let audioCtx = null;

  function playHapticSound(freq = 440, type = "sine", duration = 0.05) {
    if (audioMuted) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function initSoundToggle() {
    const btn = document.getElementById("btnSoundToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      audioMuted = !audioMuted;
      btn.innerHTML = audioMuted
        ? '<i class="bi bi-volume-mute-fill"></i>'
        : '<i class="bi bi-volume-up-fill" style="color:var(--accent-bright)"></i>';
      showToast(audioMuted ? "Sound Haptics Muted" : "Sound Haptics Enabled", audioMuted ? "bi-volume-mute" : "bi-volume-up");
      if (!audioMuted) playHapticSound(880, "sine", 0.08);
    });
  }

  /* ──────────────────────────────────────────
     18 ▸ THEME SWITCHER ENGINE
     ────────────────────────────────────────── */
  function initThemeSwitcher() {
    const btn = document.getElementById("btnThemeToggle");
    if (!btn) return;

    const savedTheme = localStorage.getItem("vivek_theme") || "emerald";
    if (savedTheme === "cyber-cyan") {
      document.documentElement.setAttribute("data-theme", "cyber-cyan");
    }

    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "cyber-cyan" ? "emerald" : "cyber-cyan";
      if (next === "cyber-cyan") {
        document.documentElement.setAttribute("data-theme", "cyber-cyan");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      localStorage.setItem("vivek_theme", next);
      showToast(`Switched theme to ${next === "cyber-cyan" ? "Cyber Cyan" : "Emerald Void"}`, "bi-palette-fill");
      playHapticSound(600, "triangle", 0.08);
    });
  }

  /* ──────────────────────────────────────────
     19 ▸ INFRASTRUCTURE PIPELINE INSPECTOR
     ────────────────────────────────────────── */
  const nodeData = {
    git: {
      title: "GitLab & GitHub — Source Control & Webhook Triggers",
      tag: "ONLINE • 100% HEALTH",
      uptime: "99.99%",
      triggers: "14 Webhooks",
      latency: "12ms",
      logs: `[2026-08-05 23:58:01] INFO  git.webhook: Commit push detected on branch 'main' (sha: 7f3a8b2)\n[2026-08-05 23:58:02] INFO  pipeline.runner: Initializing runner pool #42...\n[2026-08-05 23:58:03] SUCCESS repo.sync: Multi-branch repository verification clean.`
    },
    cicd: {
      title: "GitLab CI/CD — Automated Build, Test & Lint Pipeline",
      tag: "RUNNING • STAGE 2/4",
      uptime: "99.95%",
      triggers: "4 Concurrent Jobs",
      latency: "45ms",
      logs: `[2026-08-05 23:58:04] EXEC  pytest tests/ --cov=app --cov-report=xml\n[2026-08-05 23:58:06] PASS  unit_tests: 148 passed in 2.14s (100% coverage)\n[2026-08-05 23:58:08] SUCCESS sonar.scan: Security Gate PASSED. 0 Vulnerabilities.`
    },
    docker: {
      title: "Docker & JFrog Artifactory — Containerization & Artifact Registry",
      tag: "PUSHED • v2.4.0",
      uptime: "100.0%",
      triggers: "JFrog Synced",
      latency: "22ms",
      logs: `[2026-08-05 23:58:10] EXEC  docker build -t registry.msg.global/ops/prod:v2.4.0 .\n[2026-08-05 23:58:14] INFO  trivy.scan: Image scan clear (0 High, 0 Critical)\n[2026-08-05 23:58:16] SUCCESS jfrog.push: Artifact uploaded sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.`
    },
    terraform: {
      title: "Terraform & Helm — Infrastructure as Code & Manifests",
      tag: "PROVISIONED • PLAN CLEAN",
      uptime: "99.98%",
      triggers: "Terraform Cloud",
      latency: "18ms",
      logs: `[2026-08-05 23:58:18] EXEC  terraform apply -auto-approve main.tf\n[2026-08-05 23:58:20] INFO  aws_eks_cluster.prod: Refreshing state...\n[2026-08-05 23:58:22] SUCCESS terraform.apply: Apply complete! Resources: 0 added, 1 changed, 0 destroyed.`
    },
    k8s: {
      title: "Kubernetes & AWS EKS — Production Cloud Cluster Deployment",
      tag: "ACTIVE • 12/12 PODS READY",
      uptime: "99.99%",
      triggers: "EKS AutoScaler",
      latency: "8ms",
      logs: `[2026-08-05 23:58:24] EXEC  helm upgrade --install prod-app ./helm-chart\n[2026-08-05 23:58:26] INFO  k8s.rollout: Deployment "prod-app" rolling update 100% complete.\n[2026-08-05 23:58:28] SUCCESS k8s.status: 12/12 pods Running on 3 AWS EC2 worker nodes.`
    },
    monitoring: {
      title: "Prometheus & Grafana — Real-time Telemetry & Observability",
      tag: "HEALTHY • 0 ALERTS",
      uptime: "100.0%",
      triggers: "Alertmanager active",
      latency: "4ms",
      logs: `[2026-08-05 23:58:30] METRIC prometheus.scrape: HTTP request duration 95th percentile: 14.2ms\n[2026-08-05 23:58:32] METRIC node_exporter: CPU usage 18.4%, Memory usage 42.1%\n[2026-08-05 23:58:34] SUCCESS grafana.alert: All operational thresholds green.`
    }
  };

  function initInfrastructureInspector() {
    const nodes = document.querySelectorAll(".pipeline-node");
    if (!nodes.length) return;

    nodes.forEach(node => {
      node.addEventListener("click", () => {
        const key = node.dataset.node;
        const data = nodeData[key];
        if (!data) return;

        nodes.forEach(n => n.classList.remove("active"));
        node.classList.add("active");

        document.getElementById("inspectorTitle").textContent = data.title;
        document.getElementById("inspectorTag").textContent = data.tag;
        document.getElementById("inspectorUptime").textContent = data.uptime;
        document.getElementById("inspectorTriggers").textContent = data.triggers;
        document.getElementById("inspectorLatency").textContent = data.latency;
        document.getElementById("inspectorLogs").textContent = data.logs;

        playHapticSound(750, "sine", 0.04);
      });
    });
  }

  /* ──────────────────────────────────────────
     20 ▸ INTERACTIVE CLI TERMINAL MODAL
     ────────────────────────────────────────── */
  function initTerminalModal() {
    const modal = document.getElementById("terminalModal");
    const input = document.getElementById("terminalInput");
    const output = document.getElementById("terminalOutput");
    const closeBtn = document.getElementById("termClose");
    const openBtns = [
      document.getElementById("btnTerminalToggle"),
      document.getElementById("btnHeroCLI")
    ];

    if (!modal || !input || !output) return;

    const commandHistory = [];
    let historyIdx = -1;

    const openTerminal = () => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      setTimeout(() => input.focus(), 150);
      playHapticSound(500, "square", 0.05);
    };

    const closeTerminal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    };

    openBtns.forEach(btn => btn && btn.addEventListener("click", openTerminal));
    closeBtn && closeBtn.addEventListener("click", closeTerminal);

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        modal.classList.contains("open") ? closeTerminal() : openTerminal();
      } else if (e.key === "Escape" && modal.classList.contains("open")) {
        closeTerminal();
      }
    });

    const printLine = (text, isHtml = false) => {
      const div = document.createElement("div");
      div.className = "term-line";
      if (isHtml) {
        div.innerHTML = text.trim().replace(/\n/g, "<br>");
      } else {
        div.textContent = text;
      }
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
    };

    const processCommand = (cmd) => {
      const clean = cmd.trim().toLowerCase();
      printLine(`<span style="color:#10b981">vivek@devops-cluster:~$</span> ${cmd}`, true);

      if (!clean) return;

      switch (clean) {
        case "help":
          printLine(`
Available Shell Commands:
  <strong class="term-highlight">kubectl get pods</strong> - Inspect simulated production K8s pods
  <strong class="term-highlight">terraform plan</strong>   - View infrastructure state diff
  <strong class="term-highlight">cat bio</strong>          - Print Vivek's background & role summary
  <strong class="term-highlight">skills</strong>           - List primary tech stack
  <strong class="term-highlight">projects</strong>         - Output featured repositories
  <strong class="term-highlight">contact</strong>          - Display contact channels & email
  <strong class="term-highlight">sudo hire</strong>        - Special recruiter override command 😉
  <strong class="term-highlight">matrix</strong>           - Toggle digital rain mode
  <strong class="term-highlight">resume</strong>           - Open resume document in new tab
  <strong class="term-highlight">clear</strong>            - Clear terminal history
          `, true);
          break;

        case "kubectl get pods":
        case "kubectl":
          printLine(`
NAME                           READY   STATUS    RESTARTS   AGE
msg-auth-service-7f4b8f-x92a   1/1     Running   0          42d
msg-pipeline-runner-9c1d-k41s  1/1     Running   0          18d
terraform-agent-5a2c-m88x      1/1     Running   0          5d
prometheus-k8s-0               2/2     Running   0          90d
grafana-dashboard-3b1a-p77f    1/1     Running   0          90d
          `, true);
          break;

        case "terraform plan":
        case "terraform":
          printLine(`
Terraform used the selected providers to generate the following execution plan:

# aws_eks_node_group.prod_nodes will be updated in-place
~ resource "aws_eks_node_group" "prod_nodes" {
    ~ scaling_config {
        ~ max_size = 5 -> 10
      }
  }

Plan: 0 to add, 1 to change, 0 to destroy.
          `, true);
          break;

        case "cat bio":
        case "bio":
          printLine(`
Vivek Sharma — DevOps & Cloud Engineer @ msg global Solutions.
B.Tech CSE Graduate (2026, CGPA 8.4). Specialist in GitLab CI/CD,
AWS Infrastructure, Kubernetes Orchestration, Terraform IaC, and Docker.
          `, true);
          break;

        case "skills":
          printLine(`
Cloud & Infra : AWS, Docker, Kubernetes, Helm, Terraform, Linux, Nginx
DevOps & CI/CD: GitLab CI/CD, Shell Scripting, Git, JFrog Artifactory
Programming   : Python, Java, JavaScript, C++, SQL, ABAP RAP
          `, true);
          break;

        case "projects":
          printLine(`
1. FitForge       - AI Fitness & Nutrition Platform (Flask, Python, MongoDB)
2. HealthGuardian - Emergency Healthcare SOS & Hospital Mapping (Node.js, Express)
3. ZipLink        - Encrypted Temporary File Sharing (Node.js, QR Access)
4. SplitEase      - Smart Group Expense Tracker & Settlements (Node.js, SQLite)
          `, true);
          break;

        case "contact":
          printLine(`
Email   : vikysharma644@gmail.com
LinkedIn: linkedin.com/in/vivek-sharma-06219a28b/
GitHub  : github.com/rimuru2725
Phone   : +91 95180 29569
          `, true);
          break;

        case "sudo hire":
        case "hire":
          printLine(`
<span style="color:#f59e0b;font-weight:700">🚀 ACCESS GRANTED!</span>
Thank you for your interest! Opening email client to contact Vivek immediately...
          `, true);
          setTimeout(() => {
            window.location.href = "mailto:vikysharma644@gmail.com?subject=Offer%20/%20Opportunity%20for%20Vivek%20Sharma";
          }, 1200);
          break;

        case "matrix":
          showToast("Matrix Rain Activated!", "bi-terminal-fill");
          printLine("01001000 01101001 01110010 01100101 00100000 01010110 01101001 01110110 01100101 01101011", true);
          break;

        case "resume":
          printLine("Opening Vivek's Resume PDF in new tab...", true);
          window.open("https://drive.google.com/file/d/1s27WrxsVYWHomYKZEhq-xdw8_v-rSieZ/view?usp=sharing", "_blank");
          break;

        case "clear":
          output.innerHTML = "";
          break;

        default:
          printLine(`bash: command not found: ${clean}. Type <strong class="term-highlight">'help'</strong> for valid commands.`, true);
          break;
      }
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = input.value;
        if (val) {
          commandHistory.push(val);
          historyIdx = commandHistory.length;
          processCommand(val);
          input.value = "";
          playHapticSound(600, "square", 0.03);
        }
      } else if (e.key === "ArrowUp") {
        if (historyIdx > 0) {
          historyIdx--;
          input.value = commandHistory[historyIdx];
        }
      } else if (e.key === "ArrowDown") {
        if (historyIdx < commandHistory.length - 1) {
          historyIdx++;
          input.value = commandHistory[historyIdx];
        } else {
          historyIdx = commandHistory.length;
          input.value = "";
        }
      }
    });
  }

  /* ──────────────────────────────────────────
     21 ▸ COMMAND PALETTE (`Ctrl + K`)
     ────────────────────────────────────────── */
  function initCommandPalette() {
    const palette = document.getElementById("cmdPalette");
    const input = document.getElementById("cmdInput");
    const results = document.getElementById("cmdResults");
    const btnOpen = document.getElementById("btnCmdPaletteToggle");

    if (!palette || !input || !results) return;

    const openCmd = () => {
      palette.classList.add("open");
      palette.setAttribute("aria-hidden", "false");
      input.value = "";
      setTimeout(() => input.focus(), 150);
      playHapticSound(500, "sine", 0.05);
    };

    const closeCmd = () => {
      palette.classList.remove("open");
      palette.setAttribute("aria-hidden", "true");
    };

    btnOpen && btnOpen.addEventListener("click", openCmd);

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        palette.classList.contains("open") ? closeCmd() : openCmd();
      } else if (e.key === "Escape" && palette.classList.contains("open")) {
        closeCmd();
      }
    });

    results.addEventListener("click", (e) => {
      const item = e.target.closest(".cmd-item");
      if (!item) return;

      const action = item.dataset.action;
      const target = item.dataset.target;

      closeCmd();

      if (action === "nav" && target) {
        const sec = document.querySelector(target);
        if (sec) sec.scrollIntoView({ behavior: "smooth" });
      } else if (action === "terminal") {
        const termModal = document.getElementById("terminalModal");
        if (termModal) {
          termModal.classList.add("open");
          document.getElementById("terminalInput")?.focus();
        }
      } else if (action === "theme") {
        document.getElementById("btnThemeToggle")?.click();
      } else if (action === "resume") {
        window.open("https://drive.google.com/file/d/1s27WrxsVYWHomYKZEhq-xdw8_v-rSieZ/view?usp=sharing", "_blank");
      } else if (action === "github") {
        window.open("https://github.com/rimuru2725", "_blank");
      }
    });

    input.addEventListener("input", () => {
      const q = input.value.toLowerCase().trim();
      const items = results.querySelectorAll(".cmd-item");
      items.forEach(it => {
        const txt = it.textContent.toLowerCase();
        it.style.display = txt.includes(q) ? "flex" : "none";
      });
    });
  }

  /* ──────────────────────────────────────────
     22 ▸ PROJECT FILTER & DETAIL MODAL THEATER
     ────────────────────────────────────────── */
  const projectDetailsMap = {
    fitforge: {
      title: "FitForge — AI Fitness Platform",
      tagline: "AI-driven personalized workout & nutrition recommendation system",
      img: "screenshots/home1.png",
      tags: ["Python", "Flask", "MongoDB", "Chart.js", "Machine Learning"],
      problem: "Fitness enthusiasts struggle to maintain consistency without custom tailored workout routines and nutrition tracking.",
      solution: "Developed an intelligent Flask application utilizing machine learning recommendation algorithms for custom plans, coupled with interactive Chart.js telemetry.",
      features: [
        "Personalized AI Workout & Meal Plan Generators",
        "Interactive Progress & Metric Tracking Dashboard",
        "Secure MongoDB User Authentication & History"
      ],
      github: "https://github.com/rimuru2725/FitForge"
    },
    healthguardian: {
      title: "HealthGuardian — Emergency Healthcare",
      tagline: "Real-time emergency medical assistant with instant SOS hospital locator",
      img: "screenshots/home2.png",
      tags: ["Node.js", "Express.js", "OpenStreetMap API", "Twilio API"],
      problem: "In critical medical emergencies, seconds matter. Finding nearest available emergency centers and dispatching alerts can be slow.",
      solution: "Engineered a rapid SOS workflow integrating real-time OpenStreetMap geo-location mapping with automated Twilio SMS alert triggers.",
      features: [
        "Instant One-Tap SOS Alert Dispatch via Twilio SMS",
        "Real-Time Hospital & Emergency Center Radius Mapping",
        "Resilient Node.js Microservice Backend"
      ],
      github: "https://github.com/rimuru2725/HealthGuardian"
    },
    ziplink: {
      title: "ZipLink — Secure File Sharing",
      tagline: "Encrypted, temporary file-sharing platform with password protection & QR access",
      img: "screenshots/home3.png",
      tags: ["Node.js", "Express.js", "Tailwind CSS", "Crypto API"],
      problem: "Users need a private, secure way to send files temporarily without creating permanent account footprints.",
      solution: "Built a sleek zero-footprint storage service with end-to-end payload encryption, password verification, self-destruct timers, and QR code access.",
      features: [
        "End-to-End Encrypted File Payload Storage",
        "Automatic File Expiration & Self-Destruct Cleanup",
        "Instant Dynamic QR Code Access Generation"
      ],
      github: "https://github.com/rimuru2725/ZipLink"
    },
    splitease: {
      title: "SplitEase — Smart Expense Tracker",
      tagline: "Multi-environment group expense calculation & transparent settlement engine",
      img: "screenshots/home4.png",
      tags: ["Node.js", "Express.js", "Bootstrap", "SQLite"],
      problem: "Groups traveling or sharing living spaces struggle to maintain transparent ledger entries and calculate optimal repayment paths.",
      solution: "Created an intuitive expense splitting engine featuring debt-simplification algorithms, category breakdowns, and multi-environment config.",
      features: [
        "Optimized Debt-Minimization Settlement Algorithm",
        "Category Budgeting & Visual Expense Analytics",
        "Multi-Environment Deployment Ready"
      ],
      demo: "https://split-ease-ruby.vercel.app/"
    }
  };

  function initProjectTheater() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("projectSearchInput");
    const cards = document.querySelectorAll(".project-card");
    const modal = document.getElementById("projectModal");
    const modalContent = document.getElementById("projectModalContent");
    const modalClose = document.getElementById("projectModalClose");

    if (!cards.length) return;

    /* Filter & Search */
    const filterProjects = () => {
      const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
      const query = searchInput?.value.toLowerCase().trim() || "";

      cards.forEach(card => {
        const cat = card.dataset.category || "";
        const text = card.textContent.toLowerCase();
        const matchesCategory = activeFilter === "all" || cat === activeFilter;
        const matchesQuery = !query || text.includes(query);

        if (matchesCategory && matchesQuery) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    };

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterProjects();
        playHapticSound(700, "sine", 0.03);
      });
    });

    searchInput && searchInput.addEventListener("input", filterProjects);

    /* Open Project Detail Modal */
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-open-modal");
      if (!btn || !modal || !modalContent) return;

      const id = btn.dataset.id;
      const data = projectDetailsMap[id];
      if (!data) return;

      modalContent.innerHTML = `
        <div class="project-modal-grid" style="display:grid;gap:1.5rem;grid-template-columns:1fr;">
          <div style="border-radius:var(--r-md);overflow:hidden;border:1px solid rgba(2,121,76,0.3)">
            <img src="${data.img}" alt="${data.title}" style="width:100%;max-height:300px;object-fit:cover;">
          </div>
          <div>
            <h2 style="font-size:1.5rem;margin-bottom:0.4rem;color:var(--text-primary)">${data.title}</h2>
            <p style="color:var(--accent-bright);font-weight:600;font-size:0.9rem;margin-bottom:1rem">${data.tagline}</p>

            <div style="margin-bottom:1rem">
              <strong style="color:var(--text-primary)">Problem:</strong>
              <p style="color:var(--text-secondary);font-size:0.88rem;margin-top:0.2rem">${data.problem}</p>
            </div>

            <div style="margin-bottom:1rem">
              <strong style="color:var(--text-primary)">Solution & Architecture:</strong>
              <p style="color:var(--text-secondary);font-size:0.88rem;margin-top:0.2rem">${data.solution}</p>
            </div>

            <div style="margin-bottom:1.25rem">
              <strong style="color:var(--text-primary)">Key Features:</strong>
              <ul style="list-style:disc;margin-left:1.25rem;color:var(--text-secondary);font-size:0.85rem;margin-top:0.4rem">
                ${data.features.map(f => `<li style="margin-bottom:0.3rem">${f}</li>`).join("")}
              </ul>
            </div>

            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1.5rem">
              ${data.tags.map(t => `<span style="background:rgba(2,121,76,0.2);color:var(--accent-bright);padding:0.25rem 0.65rem;border-radius:var(--r-full);font-size:0.75rem">${t}</span>`).join("")}
            </div>

            <div style="display:flex;gap:0.75rem">
              ${data.github ? `<a href="${data.github}" target="_blank" class="btn btn--primary" style="padding:0.6rem 1.2rem;font-size:0.85rem"><i class="bi bi-github"></i> View GitHub Repo</a>` : ""}
              ${data.demo ? `<a href="${data.demo}" target="_blank" class="btn btn--secondary" style="padding:0.6rem 1.2rem;font-size:0.85rem"><i class="bi bi-globe"></i> Live Demo</a>` : ""}
            </div>
          </div>
        </div>
      `;

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      playHapticSound(550, "sine", 0.05);
    });

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    };

    modalClose && modalClose.addEventListener("click", closeModal);
    modal && modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  /* ──────────────────────────────────────────
     23 ▸ COPY TO CLIPBOARD LISTENERS
     ────────────────────────────────────────── */
  function initCopyListeners() {
    const emailCard = document.getElementById("contactEmail");
    if (emailCard) {
      emailCard.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        navigator.clipboard.writeText("vikysharma644@gmail.com");
        showToast("Email copied to clipboard!", "bi-check-circle-fill");
        playHapticSound(800, "sine", 0.04);
      });
    }
  }

  /* ──────────────────────────────────────────
     15 ▸ INITIALIZATION
     ────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initHeroScene();
    initCursor();
    initScrollProgress();
    initNavigation();
    initTyped();
    initGitHubStats();
    initProfileCard();
    init3DProjectCards();
    initContactForm();
    initScrollAnimations();
    initSoundToggle();
    initThemeSwitcher();
    initInfrastructureInspector();
    initTerminalModal();
    initCommandPalette();
    initProjectTheater();
    initCopyListeners();
    setFooterYear();
  });
})();