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

    const hoverEls = document.querySelectorAll(
      "a, button, .project-card, .skill-card, .cert-card, .contact-card, .stat-card, .sphere-tag, input, textarea"
    );
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (!finePointerQuery.matches) return;
        dot.classList.add("hovering");
        ring.classList.add("hovering");
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("hovering");
        ring.classList.remove("hovering");
      });
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
        "Software Craftsman",
        "Innovative Engineer",
        "AI Explorer",
        "Problem Solver",
      ],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 2200,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }

  /* ──────────────────────────────────────────
     6 ▸ 3D SKILL SPHERE (Fibonacci Distribution)
     ────────────────────────────────────────── */
  function initSkillSphere() {
    const sphere = document.getElementById("skillSphere");
    if (!sphere) return;

    const skills = [
      "C++", "Java", "Python", "HTML5", "CSS3", "JavaScript",
      "Node.js", "Express", "React", "Flask", "MongoDB", "MySQL",
      "Git", "Bootstrap", "REST APIs", "DSA", "OOP", "AWS",
      "Cloud", "Tailwind",
    ];

    // Use clientWidth or fallback
    const size = sphere.offsetWidth || 300;
    const radius = size / 2 - 35;
    const n = skills.length;
    const goldenAngle = Math.PI * (1 + Math.sqrt(5));

    skills.forEach((skill, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = goldenAngle * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const tag = document.createElement("span");
      tag.className = "sphere-tag";
      tag.textContent = skill;
      tag.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(
        1
      )}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`;

      // Slightly scale based on z for depth
      const scale = 0.7 + ((z + radius) / (2 * radius)) * 0.5;
      const opacity = 0.45 + ((z + radius) / (2 * radius)) * 0.55;
      tag.style.fontSize = (0.72 + scale * 0.2).toFixed(2) + "rem";
      tag.style.opacity = opacity.toFixed(2);

      sphere.appendChild(tag);
    });

    // Pause rotation on hover
    sphere.addEventListener("mouseenter", () => {
      sphere.style.animationPlayState = "paused";
    });
    sphere.addEventListener("mouseleave", () => {
      sphere.style.animationPlayState = "running";
    });
  }

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

    /* ─ Skills sphere ─ */
    gsap.from(".sphere-wrapper", {
      scrollTrigger: { trigger: ".skills-layout", start: "top 82%" },
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    /* ─ Skill cards ─ */
    gsap.from(".skill-card", {
      scrollTrigger: { trigger: ".skill-cards", start: "top 88%" },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
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
        // Simulate send (replace with EmailJS or backend call)
        await new Promise((resolve) => setTimeout(resolve, 1600));

        // Success
        submitBtn.innerHTML =
          '<span>Sent!</span><i class="bi bi-check-lg"></i>';
        submitBtn.style.background =
          "linear-gradient(135deg, #10B981, #059669)";
        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 2500);
      } catch (err) {
        console.error("Form error:", err);
        submitBtn.innerHTML =
          '<span>Error — Try Again</span><i class="bi bi-exclamation-triangle"></i>';
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
  (function injectSpinKeyframe() {
    const style = document.createElement("style");
    style.textContent = `@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`;
    document.head.appendChild(style);
  })();

  /* ──────────────────────────────────────────
     15 ▸ INITIALIZATION
     ────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initHeroScene();
    initCursor();
    initScrollProgress();
    initNavigation();
    initTyped();
    initSkillSphere();
    initProfileCard();
    init3DProjectCards();
    initContactForm();
    initScrollAnimations();
    setFooterYear();
  });
})();