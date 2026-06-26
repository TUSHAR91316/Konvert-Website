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
        if (moonWrapper) moonWrapper.style.display = 'none';
        if (sunWrapper) sunWrapper.style.display = 'block';
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        if (moonWrapper) moonWrapper.style.display = 'block';
        if (sunWrapper) sunWrapper.style.display = 'none';
        localStorage.setItem('theme', 'light');
    }
}

// Check saved preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme) {
    setTheme(savedTheme);
} else if (systemThemeMedia.matches) {
    setTheme('dark');
} else {
    setTheme('light');
}

// Listen for system theme changes
systemThemeMedia.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Toggle Event Listener
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

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

// Modal Logic
const downloadModal = document.getElementById('downloadModal');

function openModal() {
    if (downloadModal) {
        downloadModal.classList.add('active');
    }
}

function closeModal() {
    if (downloadModal) {
        downloadModal.classList.remove('active');
    }
}

// Setup click listeners for close buttons and outside click
document.addEventListener('DOMContentLoaded', () => {
    const closeBtns = document.querySelectorAll('.modal-close, .modal-close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === downloadModal) {
            closeModal();
        }
    });

    // Handle Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && downloadModal && downloadModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Scroll Reveal Logic
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered successfully:', reg.scope))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}
