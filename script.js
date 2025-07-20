
// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
  document.querySelector('.loader').style.opacity = '0';
  setTimeout(() => {
    document.querySelector('.loader').style.display = 'none';
  }, 500);
});

// ===== TYPING ANIMATIONS =====
document.addEventListener("DOMContentLoaded", () => {
  const nameElement = document.getElementById("intro-name");
  const roleTitleElement = document.getElementById("role-title");
  const csitTextElement = document.getElementById("csit-text");

  const roleTexts = [
    "Aspiring Data Scientist",
    "Aspiring AI Engineer",
    "Problem Solver"
  ];
  let currentRoleIndex = 0;

  setTimeout(() => {
    nameElement.style.borderRight = "none";
    csitTextElement.style.display = "inline";
    startRoleAnimation();
  }, 2000);

  function startRoleAnimation() {
    typeText(roleTitleElement, roleTexts[currentRoleIndex], () => {
      setTimeout(() => {
        deleteText(roleTitleElement, () => {
          currentRoleIndex = (currentRoleIndex + 1) % roleTexts.length;
          startRoleAnimation();
        });
      }, 1500);
    });
  }

  function typeText(element, text, onComplete) {
    let i = 0;
    element.textContent = "";
    const typingSpeed = 100;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, typingSpeed);
      } else if (onComplete) {
        onComplete();
      }
    }
    type();
  }

  function deleteText(element, onComplete) {
    let text = element.textContent;
    let i = text.length;
    const deletingSpeed = 50;
    function deleteChar() {
      if (i > 0) {
        element.textContent = text.substring(0, i - 1);
        i--;
        setTimeout(deleteChar, deletingSpeed);
      } else if (onComplete) {
        onComplete();
      }
    }
    deleteChar();
  }
});

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
window.addEventListener('scroll', () => {
  scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== DARK MODE TOGGLE (Sun/Moon Icon) =====
const darkModeToggle = document.getElementById('dark-mode-toggle');
function updateDarkModeIcon() {
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.classList.add('dark');
  } else {
    darkModeToggle.classList.remove('dark');
  }
}
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  updateDarkModeIcon();
});
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}
updateDarkModeIcon();

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});


// ===== ANIMATED SVG CIRCULAR SKILL BARS =====
function animateSkillCircles() {
  document.querySelectorAll('.circle').forEach(circle => {
    const percent = parseInt(circle.dataset.percent);
    const color = circle.dataset.color;
    const ring = circle.querySelector('.progress-ring-bar');
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    ring.style.stroke = color;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;
    setTimeout(() => {
      ring.style.strokeDashoffset = `${circumference - (percent / 100) * circumference}`;
    }, 300);
  });
}
// Animate when skills section is in view
const skillsSection = document.getElementById('skills-section');
let skillsAnimated = false;
if (skillsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        animateSkillCircles();
        skillsAnimated = true;
      }
    });
  }, { threshold: 0.3 });
  observer.observe(skillsSection);
}

// ===== ENHANCED SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');
const searchResults = document.querySelector('.search-results-dropdown');

const searchableElements = [
  ...document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span:not(.icon), a:not([href^="#"])')
];

// Track current highlights
let currentHighlights = [];

function performSearch(query) {
  // Clear previous highlights when starting new search
  clearHighlights();
  
  if (!query.trim()) {
    searchResults.style.display = 'none';
    return;
  }

  const results = [];
  const regex = new RegExp(query, 'gi');

  searchableElements.forEach(element => {
    const text = element.textContent;
    if (regex.test(text)) {
      const markedText = text.replace(regex, match => `<mark class="search-highlight">${match}</mark>`);
      results.push({ element, html: markedText, original: text });
    }
  });

  displayResults(results, query);
}

function displayResults(results, query) {
  if (results.length === 0) {
    searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    searchResults.style.display = 'block';
    return;
  }

  searchResults.innerHTML = '';
  results.slice(0, 5).forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    resultItem.innerHTML = result.html.length > 50 ? `${result.html.substring(0, 50)}...` : result.html;

    resultItem.addEventListener('click', () => {
      navigateToResult(result.element, query);
    });

    searchResults.appendChild(resultItem);
  });

  searchResults.style.display = 'block';
}

function navigateToResult(element, query) {
  element.scrollIntoView({ behavior: 'smooth' });
  element.classList.add('highlight');
  highlightAllInstances(query);

  setTimeout(() => {
    element.classList.remove('highlight');
  }, 1500);

  searchResults.style.display = 'none';
  searchInput.value = '';
}

function highlightAllInstances(query) {
  const regex = new RegExp(query, 'gi');
  
  searchableElements.forEach(element => {
    const text = element.textContent;
    if (regex.test(text)) {
      const originalHTML = element.innerHTML;
      element.innerHTML = text.replace(regex, match => `<mark class="search-highlight">${match}</mark>`);
      
      // Store original content and element reference
      currentHighlights.push({
        element,
        originalHTML
      });
    }
  });
}

function clearHighlights() {
  currentHighlights.forEach(item => {
    item.element.innerHTML = item.originalHTML;
  });
  currentHighlights = [];
}

// Event Listeners
searchInput.addEventListener('input', () => performSearch(searchInput.value));
searchBtn.addEventListener('click', () => performSearch(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch(searchInput.value);
});

document.addEventListener('click', (e) => {
  // Hide results and clear highlights when clicking outside search area
  if (!e.target.closest('.search-container') && !e.target.classList.contains('search-highlight')) {
    searchResults.style.display = 'none';
    
    // Clear highlights only if search input is empty
    if (searchInput.value.trim() === '') {
      clearHighlights();
    }
  }
});

// Clear highlights when pressing Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    clearHighlights();
    searchResults.style.display = 'none';
    searchInput.value = '';
  }
});

// Initialize circular skills with proper animation
document.addEventListener('DOMContentLoaded', function() {
  const circles = document.querySelectorAll('.circle');
  
  // Set initial styles and animate on load
  circles.forEach((circle, index) => {
    const percent = circle.getAttribute('data-percent');
    const color = circle.getAttribute('data-color');
    
    // Set CSS variables
    circle.style.setProperty('--percent', `${percent}%`);
    circle.style.setProperty('--skill-color', color);
    
    // Delay animations for staggered effect
    circle.style.animation = `circle-grow 1s ${index * 0.1}s forwards`;
  });

  // Animate on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'circle-grow 1s forwards';
      }
    });
  }, { threshold: 0.1 });

  circles.forEach(circle => observer.observe(circle));
});

//contact us

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  
  contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;
      
      // Simulate form submission (replace with actual AJAX call)
      setTimeout(() => {
          // Reset form
          contactForm.reset();
          
          // Show success message
          formMessage.textContent = 'Thank you! Your message has been sent successfully.';
          formMessage.classList.add('visible', 'success');
          
          // Reset button
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          
          // Hide message after 5 seconds
          setTimeout(() => {
              formMessage.classList.remove('visible');
          }, 5000);
      }, 1500);
  });
  
  // Add floating label functionality
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
      const input = group.querySelector('input, textarea');
      const label = group.querySelector('label');
      
      input.addEventListener('focus', () => {
          label.classList.add('active');
      });
      
      input.addEventListener('blur', () => {
          if (!input.value) {
              label.classList.remove('active');
          }
      });
      
      // Initialize labels for pre-filled values
      if (input.value) {
          label.classList.add('active');
      }
  });
});

// Scroll Animation Functionality
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 100; // Pixels from bottom needed to trigger
    
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add('active');
    } else {
      // Optional: Remove to animate only once
      // reveals[i].classList.remove('active');
    }
  }
}

// Run on load and scroll
window.addEventListener('load', revealOnScroll);
window.addEventListener('scroll', revealOnScroll);

// More modern approach with Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {threshold: 0.1});

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});
















