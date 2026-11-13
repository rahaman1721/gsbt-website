// Navbar Scroll Effect - Removed as new header is sticky by default

// Video Modal Logic
const videoModal = document.getElementById('videoModal');
const openVideoBtn = document.getElementById('openVideo');
const closeModalBtn = document.querySelector('.close-modal');
const videoPlayer = document.getElementById('videoPlayer');
let videoSrc = "";

if (videoPlayer) {
    videoSrc = videoPlayer.src;
}

if (openVideoBtn && videoPlayer) {
    openVideoBtn.addEventListener('click', () => {
        videoModal.classList.add('active');
        videoPlayer.src = videoSrc + "?autoplay=1";
        document.body.style.overflow = 'hidden';
    });
}

if (closeModalBtn && videoPlayer) {
    closeModalBtn.addEventListener('click', () => {
        videoModal.classList.remove('active');
        videoPlayer.src = "";
        videoPlayer.src = videoSrc;
        document.body.style.overflow = 'auto';
    });
}

window.addEventListener('click', (e) => {
    if (e.target == videoModal && videoPlayer) {
        videoModal.classList.remove('active');
        videoPlayer.src = "";
        videoPlayer.src = videoSrc;
        document.body.style.overflow = 'auto';
    }
});

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Mobile Dropdown Handling
document.querySelectorAll('.dropdown > a').forEach(dropdownLink => {
    dropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            const parent = dropdownLink.parentElement;
            parent.classList.toggle('active');
        }
    });
});

// AOS (Animate On Scroll) Implementation
const aosElements = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, {
    threshold: 0.1
});

aosElements.forEach(el => aosObserver.observe(el));

// Counter Animation
const counters = document.querySelectorAll('.counter');
const counterSpeed = 200;

const animateCounters = (counter) => {
    const target = +counter.getAttribute('data-target');
    const updateCount = () => {
        const count = +counter.innerText;
        const inc = target / counterSpeed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 1);
        } else {
            let suffix = counter.hasAttribute('data-suffix') ? counter.getAttribute('data-suffix') : (target === 98 ? '%' : '+');
            counter.innerText = target + suffix;
        }
    };
    updateCount();
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

counters.forEach(counter => counterObserver.observe(counter));

// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hero Slider Logic
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.slider-ctrl.next');
const prevBtn = document.querySelector('.slider-ctrl.prev');
let currentSlide = 0;
let slideInterval;

const showSlide = (n) => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
};

const nextSlide = () => showSlide(currentSlide + 1);
const prevSlide = () => showSlide(currentSlide - 1);

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });
}

const startTimer = () => {
    slideInterval = setInterval(nextSlide, 5000);
};

const resetTimer = () => {
    clearInterval(slideInterval);
    startTimer();
};
if (slides.length > 0) {
    startTimer();
}

// FAQ Accordion Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');

        // Close other items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
    });
});

// Experts Comments Section Interactivity (Optional)
// Currently handled by CSS hover, but can be extended here if needed.
