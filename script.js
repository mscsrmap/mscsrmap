// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  
  // Toggle body scroll lock
  if (navMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = '';
  })
);

// Smooth scrolling for navigation links and checkpoint dots with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    if (target) {
      const navbarHeight = 100; // Adjust based on navbar height
      const targetPosition = target.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
      
      // Update active nav link
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      this.classList.add('active');
    }
  });
});

// Hero Title Shrinking Effect on Scroll
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  
  // Shrink hero title when scrolled more than 100px
  if (heroTitle && heroSubtitle) {
    if (scrolled > 100) {
      heroTitle.classList.add('scrolled');
      heroSubtitle.classList.add('scrolled');
    } else {
      heroTitle.classList.remove('scrolled');
      heroSubtitle.classList.remove('scrolled');
    }
  }
});

// Add scroll effect - Dynamic overlay tint + Navbar + Scroll Spy
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  const overlay = document.querySelector(".background-overlay");
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const scrollPercent = Math.min(window.scrollY / window.innerHeight, 1);
  
  // Dynamic overlay tint - darker on hero for better text readability
  const overlayOpacity = 0.7 + (scrollPercent * 0.15); // 0.7 to 0.85
  overlay.style.background = `rgba(0, 0, 0, ${overlayOpacity})`;
  
  // Navbar background effect - clean and elegant
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(15, 15, 20, 0.75)";
    navbar.style.backdropFilter = "blur(25px) saturate(150%)";
    navbar.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)";
  } else {
    navbar.style.background = "rgba(10, 10, 15, 0.6)";
    navbar.style.backdropFilter = "blur(20px) saturate(140%)";
    navbar.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)";
  }
  
  // Scroll spy - highlight active section
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const checkpointDots = document.querySelectorAll('.checkpoint-dot');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
  
  // Update checkpoint dots
  checkpointDots.forEach(dot => {
    dot.classList.remove('active');
    if (dot.getAttribute('data-section') === current) {
      dot.classList.add('active');
    }
  });
  
  // Hide scroll indicator when in contact section
  if (scrollIndicator) {
    if (current === 'contact') {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  }
});

// Event Modal Functionality
const eventModal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalBody = document.getElementById('modalBody');

// Event data for modals
const eventData = {
  'hackmsc2': {
    title: '<hack>2.0</msc>',
    date: 'NOV 1-2',
    sections: [
      {
        title: 'About the Hackathon',
        content: `<p>Solutions for Smart India is a national-level hackathon designed to encourage students to innovate and build impactful technology solutions that improve everyday life for Indians and contribute to the nation's progress.</p>`
      },
      {
        title: 'Event Details',
        content: `<ul>
          <li>Duration: 30 hours non-stop coding marathon</li>
          <li>Date: November 1st 11:00 AM - November 2nd 6:00 PM</li>
          <li>Venue: SRM University AP</li>
          <li>Team Size: 2-4 members</li>
        </ul>`
      },
      {
        title: 'Why Participate?',
        content: `<ul>
          <li>Win exciting prizes and certificates</li>
          <li>Network with industry professionals</li>
          <li>Showcase your skills to potential recruiters</li>
          <li>Get mentorship from experienced developers</li>
          <li>Access to latest Microsoft technologies</li>
        </ul>`
      },
      {
        title: 'Problem Statements',
        content: `<p>Solve real-world problems in domains like Healthcare, Education, Agriculture, Smart Cities, and Sustainability. Detailed problem statements will be revealed on the event day.</p>`
      }
    ]
  }
};

// Open modal function
function openEventModal(eventId) {
  const data = eventData[eventId];
  if (!data) return;
  
  modalTitle.textContent = data.title;
  modalDate.textContent = data.date;
  
  // Build modal body
  let bodyHTML = '';
  data.sections.forEach(section => {
    bodyHTML += `
      <div class="event-modal-section">
        <h4>${section.title}</h4>
        ${section.content}
      </div>
    `;
  });
  modalBody.innerHTML = bodyHTML;
  
  // Show modal with animation
  eventModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
if (closeModal) {
  closeModal.addEventListener('click', () => {
    eventModal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close on outside click
if (eventModal) {
  eventModal.addEventListener('click', (e) => {
    if (e.target === eventModal) {
      eventModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && eventModal && eventModal.classList.contains('active')) {
    eventModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Attach event listeners to Learn More buttons
document.addEventListener('DOMContentLoaded', () => {
  const learnMoreBtn = document.getElementById('hackmsc2-more-btn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => openEventModal('hackmsc2'));
  }
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".event-card, .founder-card, .stat-item, .contact-item"
  );

  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Event registration functionality
document.querySelectorAll(".register-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    // Create a simple modal for registration
    const modal = document.createElement("div");
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

    modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                padding: 2rem;
                border-radius: 15px;
                border: 1px solid rgba(27, 27, 27, 0.3);
                max-width: 400px;
                width: 90%;
                text-align: center;
            ">
                <h3 style="color: #ffffff; margin-bottom: 1rem;">Event Registration</h3>
                <p style="color: #e0e0e0; margin-bottom: 1.5rem;">Registrations has been closed.</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: linear-gradient(135deg, #4a90e2);
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">Close</button>
            </div>
        `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  });
});

// Web3Forms Contact Form Handling
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Enhanced validation
    if (!name || !email || !message) {
      showStatus("Please fill in all fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    showStatus("Sending your message...", "info");

    try {
      // Prepare form data for Web3Forms
      const formData = new FormData(contactForm);

      // Send to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showStatus(
          "Message sent successfully! We'll get back to you soon.",
          "success"
        );
        contactForm.reset();
      } else {
        throw new Error(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      showStatus(
        "Sorry, there was an error sending your message. Please try again or contact us directly.",
        "error"
      );
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

// Function to show status messages
function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }, 5000);
  }
}

// Parallax effect to hero background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".glow-circle");

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.1;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Typing effect to hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Typing effect when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 150);
    }, 1000);
  }
});

// Hover effects to cards
document.querySelectorAll(".event-card, .founder-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});

// Smooth Page Transitions
document.addEventListener('DOMContentLoaded', () => {
  // Handle page transition links
  const transitionLinks = document.querySelectorAll('.page-transition');
  
  transitionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      
      // Fade out animation
      document.body.style.animation = 'fadeOut 0.4s ease-in-out';
      
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Delayed Background Video Playback
window.addEventListener("load", () => {
  const bgVideo = document.getElementById('bgVideo');
  
  // Delay video start by 1 second to prevent glitching
  if (bgVideo) {
    // Set video properties
    bgVideo.muted = true;
    bgVideo.playsInline = true;
    
    setTimeout(() => {
      bgVideo.play().catch(err => {
        console.log('Video autoplay prevented:', err);
        // Try again after a short delay
        setTimeout(() => {
          bgVideo.play().catch(e => console.log('Second attempt failed:', e));
        }, 500);
      });
    }, 1000);
  }
});

// Tech Facts for Loading Screen
const techFacts = [
  "The first computer virus was created in 1983 and was called 'Elk Cloner'",
  "Python is named after Monty Python, not the snake",
  "The first 1GB hard drive weighed over 500 pounds and cost $40,000",
  "More than 570 new websites are created every minute",
  "The first computer mouse was made of wood in 1964",
  "Over 6,000 computer viruses are released every month",
  "The average person blinks 12 times a minute, but only 7 times while using a computer",
  "The first webcam was created to monitor a coffee pot at Cambridge University",
  "Bill Gates' house was designed using a Mac computer",
  "The original name of Windows was Interface Manager",
  "90% of the world's currency exists only on computers",
  "The first electronic computer weighed more than 27 tons",
  "There are over 700 programming languages in existence",
  "The QWERTY keyboard layout was designed to slow down typing speed",
  "Email existed before the World Wide Web was created"
];

// Loading Screen
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingFact = document.getElementById('loadingFact');
  
  // Display random tech fact
  if (loadingFact) {
    const randomFact = techFacts[Math.floor(Math.random() * techFacts.length)];
    loadingFact.textContent = randomFact;
  }
  
  // Minimum display time of 1.5 seconds for smooth experience
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    
    // Remove from DOM after transition
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1500);
});

// Smooth page load (no flash)
document.body.style.opacity = "1";
