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
  
    const inputs = form.querySelectorAll(".form-control");
    const submitButton = form.querySelector('button[type="submit"]');
  
    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        validateInput(input);
        validateForm();
      });
      
      input.addEventListener("blur", () => {
        validateInput(input);
        validateForm();
      });
    });
  
    // Input validation
    const validateInput = (input) => {
      const value = input.value.trim();
      let isValid = true;
      
      switch (input.type) {
        case 'email':
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case 'text':
          isValid = value.length >= 3;
          break;
        case 'textarea':
          isValid = value.length >= 10;
          break;
      }
      
      if (isValid && value) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
      } else if (value) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
      } else {
        input.classList.remove('is-valid', 'is-invalid');
      }
      
      return isValid;
    };
  
    // Form validation
    const validateForm = () => {
      let isValid = true;
      inputs.forEach((input) => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      submitButton.disabled = !isValid;
      return isValid;
    };
  
    // Form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      submitButton.disabled = true;
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending...
      `;
  
      try {
        // Simulate form submission (replace with actual submission logic)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success modal if it exists, otherwise show notification
        const successModal = document.getElementById('successModal');
        if (successModal) {
          const modal = new bootstrap.Modal(successModal);
          modal.show();
        } else {
          showNotification("Message sent successfully!", "success");
        }
        
        // Reset form
        form.reset();
        
        // Clear validation states
        inputs.forEach(input => {
          input.classList.remove('is-valid', 'is-invalid');
        });
        
      } catch (error) {
        console.error("Form submission error:", error);
        showNotification("Failed to send message. Please try again.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  };
  
  // Contact info card hover effects (new functionality)
  const initContactCards = () => {
    const cards = document.querySelectorAll('.contact-info-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.contact-icon');
        if (icon) {
          icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.contact-icon');
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
      });
    });
  };
  
  // Update the DOMContentLoaded event listener to include new contact functionality
  document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false
    });
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize contact cards
    initContactCards();
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


  // Add this to script.js
// 3D Interactive Background
const initThreeJsBackground = () => {
  const container = document.querySelector('.hero');
  if (!container) return;
  
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  
  // Create a container for the canvas and position it absolutely
  const threeJsContainer = document.createElement('div');
  threeJsContainer.classList.add('three-js-background');
  threeJsContainer.style.position = 'absolute';
  threeJsContainer.style.top = '0';
  threeJsContainer.style.left = '0';
  threeJsContainer.style.width = '100%';
  threeJsContainer.style.height = '100%';
  threeJsContainer.style.zIndex = '-1';
  threeJsContainer.style.opacity = '0.6';
  container.appendChild(threeJsContainer);
  
  threeJsContainer.appendChild(renderer.domElement);
  
  // Create geometry for the points
  const geometry = new THREE.BufferGeometry();
  const count = 1500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count * 3; i += 3) {
    // Position
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
    
    // Color - using your accent green with some variation
    colors[i] = 0.01 + Math.random() * 0.05;  // R
    colors[i + 1] = 0.3 + Math.random() * 0.2; // G
    colors[i + 2] = 0.2 + Math.random() * 0.1; // B
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Material
  const material = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  // Create points and add to scene
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  
  // Mouse interaction
  const mouse = new THREE.Vector2();
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  
  // Animate
  const animate = () => {
    requestAnimationFrame(animate);
    
    // Rotate based on mouse position with damping
    points.rotation.x += (mouse.y * 0.05 - points.rotation.x) * 0.01;
    points.rotation.y += (mouse.x * 0.05 - points.rotation.y) * 0.01;
    
    // Gentle default rotation
    points.rotation.x += 0.002;
    points.rotation.y += 0.001;
    
    renderer.render(scene, camera);
  };
  
  // Handle resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  window.addEventListener('resize', handleResize);
  animate();
};

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', initThreeJsBackground);

// Add to script.js
// Enhanced Project Cards with 3D Tilt Effect
const initProjectCards = () => {
  const cards = document.querySelectorAll('.project-card');
  
  cards.forEach(card => {
    // Create a zoom button for each project
    const zoomBtn = document.createElement('button');
    zoomBtn.className = 'project-zoom-btn';
    zoomBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
    card.appendChild(zoomBtn);
    
    // 3D Tilt Effect
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      card.style.transform = `perspective(1000px) rotateX(${-deltaY * 8}deg) rotateY(${deltaX * 8}deg) translateZ(10px)`;
      card.style.transition = 'none';
      
      // Add glow effect on hover
      const glowStrength = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 30;
      card.style.boxShadow = `
        0 5px 15px rgba(0,0,0,0.3),
        ${-deltaX * 20}px ${-deltaY * 20}px 20px rgba(2, 121, 76, 0.03),
        ${deltaX * 20}px ${deltaY * 20}px 20px rgba(2, 121, 76, 0.03),
        inset 0 0 ${glowStrength}px rgba(2, 121, 76, 0.4)
      `;
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'all 0.5s ease';
      card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    });
    
    // Zoom button click handler to open modal
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectTitle = card.querySelector('h3').textContent;
      const projectDesc = card.querySelector('p').textContent;
      const projectImg = card.querySelector('img').src;
      const projectTags = Array.from(card.querySelectorAll('.badge')).map(tag => tag.textContent);
      const projectLink = card.querySelector('.btn-outline-light').href;
      
      showProjectModal(projectTitle, projectDesc, projectImg, projectTags, projectLink);
    });
  });
};

// Project Modal Function
const showProjectModal = (title, description, image, tags, link) => {
  // Create modal elements
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  
  modal.innerHTML = `
    <div class="project-modal-content">
      <div class="project-modal-close"><i class="bi bi-x-lg"></i></div>
      <div class="project-modal-header">
        <h2>${title}</h2>
      </div>
      <div class="project-modal-body">
        <div class="project-modal-image">
          <img src="${image}" alt="${title}">
        </div>
        <div class="project-modal-details">
          <h3>Project Overview</h3>
          <p>${description}</p>
          <h3>Technologies Used</h3>
          <div class="project-modal-tags">
            ${tags.map(tag => `<span class="badge bg-accent me-2">${tag}</span>`).join('')}
          </div>
          <div class="project-modal-actions mt-4">
            <a href="${link}" class="btn btn-accent btn-lg" target="_blank">
              <i class="bi bi-github me-2"></i>View Repository
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to body
  document.body.appendChild(modal);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Animate modal in
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.querySelector('.project-modal-content').style.transform = 'translateY(0)';
  }, 50);
  
  // Close modal functionality
  const closeModal = () => {
    modal.style.opacity = '0';
    modal.querySelector('.project-modal-content').style.transform = 'translateY(-50px)';
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.remove();
    }, 500);
  };
  
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  
  modal.querySelector('.project-modal-close').addEventListener('click', closeModal);
};

document.addEventListener('DOMContentLoaded', initProjectCards);