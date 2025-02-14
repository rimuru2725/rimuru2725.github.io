// Scroll Progress Indicator
window.addEventListener("scroll", () => {
    const scrollProgress = document.querySelector(".scroll-progress");
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollableHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
  });
  
  // Custom Cursor
  const cursor = document.querySelector(".cursor");
  const cursorFollower = document.querySelector(".cursor-follower");
  
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  
    setTimeout(() => {
      cursorFollower.style.left = e.clientX + "px";
      cursorFollower.style.top = e.clientY + "px";
    }, 50);
  });
  
  document.addEventListener("mousedown", () => {
    cursor.style.transform = "scale(0.8)";
    cursorFollower.style.transform = "scale(0.8)";
  });
  
  document.addEventListener("mouseup", () => {
    cursor.style.transform = "scale(1)";
    cursorFollower.style.transform = "scale(1)";
  });
  
  // Typed.js Initialization
  document.addEventListener("DOMContentLoaded", () => {
    const typedElement = document.querySelector(".typed-text");
    if (typedElement) {
      const typed = new Typed(".typed-text", {
        strings: ["Software Craftsman", "Innovative Engineer", "AI Explorer"],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
      });
    }
  });
  
  // Navbar Scroll Effect
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  
  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
  
        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      }
    });
  });
  
  // Active Navigation Link Update
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });
  
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });
  
  // Interactive Skill Radar Chart
  document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("skillChart");
    if (ctx) {
        const skillChart = new Chart(ctx, {
            type: "radar",
            data: {
                labels: [
                    "Programming Languages",
                    "Web Technologies",
                    "Databases & Tools",
                    "Core Competencies",
                    "Problem Solving",
                    "Version Control"
                ],
                datasets: [{
                    label: "Skill Level",
                    data: [85, 90, 80, 85, 88, 82],
                    backgroundColor: "rgba(2, 121, 76, 0.15)",
                    borderColor: "rgba(2, 121, 76, 0.8)",
                    pointBackgroundColor: "rgba(2, 121, 76, 1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(2, 121, 76, 1)",
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: "rgba(0, 0, 0, 0.1)"
                        },
                        angleLines: {
                            color: "rgba(0, 0, 0, 0.1)"
                        },
                        pointLabels: {
                            font: {
                                size: 12,
                                family: "'Arial', sans-serif"
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: 10,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                }
            }
        });
    
  
      // Update chart for mobile
      const updateChartForMobile = () => {
        if (skillChart) {
          skillChart.options.scales.r.ticks.display = window.innerWidth > 768;
          skillChart.update();
        }
      };
  
      window.addEventListener('resize', updateChartForMobile);
      updateChartForMobile();
    }
  });
  
  // Project Hover Effects
  document.querySelectorAll(".project-card").forEach((project) => {
    project.addEventListener("mouseenter", () => {
      const overlay = project.querySelector(".project-content");
      if (overlay) {
        overlay.style.opacity = "1";
      }
    });
  
    project.addEventListener("mouseleave", () => {
      const overlay = project.querySelector(".project-content");
      if (overlay) {
        overlay.style.opacity = "0.9";
      }
    });
  });
  
  // Initialize Particles.js
  document.addEventListener("DOMContentLoaded", () => {
    const particlesContainer = document.getElementById("particles-js");
    if (particlesContainer) {
      particlesJS("particles-js", {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#02794c"
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.5,
            random: false
          },
          size: {
            value: 3,
            random: true
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#02794c",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "repulse"
            },
            onclick: {
              enable: true,
              mode: "push"
            },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  });
  
  // Contact Form Initialization
  const initializeContactForm = () => {
    const form = document.querySelector(".contact-form");
    if (!form) return;
  
    const inputs = form.querySelectorAll("input, textarea");
    const submitButton = form.querySelector('button[type="submit"]');
  
    // Basic email validation
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
  
    // Form validation
    const validateForm = () => {
      let isValid = true;
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
        }
        if (input.type === "email" && !isValidEmail(input.value)) {
          isValid = false;
        }
      });
      submitButton.disabled = !isValid;
      return isValid;
    };
  
    // Input event listeners
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        validateForm();
      });
    });
  
    // Form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      submitButton.disabled = true;
      const originalText = submitButton.textContent;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
  
      try {
        // Simulate form submission (replace with actual submission logic)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Success handling
        showNotification("Message sent successfully!", "success");
        form.reset();
        inputs.forEach(input => input.classList.remove("is-valid"));
      } catch (error) {
        console.error("Form submission error:", error);
        showNotification("Failed to send message. Please try again.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  };
  
  // Notification Component
  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type} animate__animated animate__fadeInDown`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="bi ${type === "success" ? "bi-check-circle" : "bi-x-circle"}"></i>
        <span>${message}</span>
      </div>
    `;
  
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.classList.remove("animate__fadeInDown");
      notification.classList.add("animate__fadeOutUp");
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };
  
  // Initialize AOS
  document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false
    });
    
    // Initialize contact form
    initializeContactForm();
  });
  
  // Responsive text sizing
  const updateResponsiveText = () => {
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 576) {
        heroTitle.style.fontSize = "1.75rem";
      } else if (viewportWidth < 768) {
        heroTitle.style.fontSize = "2rem";
      } else if (viewportWidth < 992) {
        heroTitle.style.fontSize = "2.5rem";
      } else {
        heroTitle.style.fontSize = "3rem";
      }
    }
  };
  
  window.addEventListener("resize", updateResponsiveText);
  document.addEventListener("DOMContentLoaded", updateResponsiveText);