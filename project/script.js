// Initialize Lucide Icons
lucide.createIcons();

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const moonWrapper = document.getElementById('moon-wrapper');
const sunWrapper = document.getElementById('sun-wrapper');
const htmlElement = document.documentElement;

// Function to set theme
function setTheme(theme) {
    if (theme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        moonWrapper.style.display = 'none';
        sunWrapper.style.display = 'block';
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        moonWrapper.style.display = 'block';
        sunWrapper.style.display = 'none';
        localStorage.setItem('theme', 'light');
    }
}
// Set initial state explicitly if needed
if (!localStorage.getItem('theme') && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('light');
}

// Scroll Reveal Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));




// Check saved preference or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
}

// Toggle Event Listener
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Typewriter Effect
const textToType = "Advanced File Management & Conversion Tool";
const subtitleElement = document.querySelector('.hero-subtitle');

if (subtitleElement) {
    subtitleElement.textContent = ""; // Clear initial text
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    subtitleElement.appendChild(cursor);

    let i = 0;
    function typeWriter() {
        if (i < textToType.length) {
            // Insert before cursor
            subtitleElement.insertBefore(document.createTextNode(textToType.charAt(i)), cursor);
            i++;
            setTimeout(typeWriter, 50); // Speed of typing
        } else {
            // Optional: Remove cursor after typing
            setTimeout(() => cursor.style.display = 'none', 3000);
        }
    }

    // Start after a small delay
    setTimeout(typeWriter, 500);
}


