/**
 * Caribbean KNF Calculator - JavaScript Logic
 * Premium Nature Theme - Updated Formulas
 */

// ============================================
// CONSTANTS - KNF Ratios (per gallon)
// ============================================

const RATIOS = {
    // Chick Water (per gallon) - WCA is now SEPARATE
    chickWater: {
        labs: 4,           // ml
        fpj: 13,           // ml
        vinegar: 19,       // ml
        seaWater: 133,     // ml
        salt: 3            // grams (alternative to sea water)
    },

    // Calcium - SEPARATE from chick water (per gallon)
    calcium: {
        wca: 4             // ml
    },

    // Fermented Feed - 1:1.39 weight ratio
    fermentedFeed: {
        waterRatio: 1.39,           // lbs water per lb feed
        labsPerGallon: 4,           // ml LABs per gallon water
        fpjPerGallon: 8             // ml FPJ per gallon water
    },

    // Coop Bedding Spray (per gallon)
    coopSpray: {
        labs: 4,        // ml
        fpj: 8,         // ml
        seawater: 126,  // ml
        vinegar: 8      // ml
    },

    // Fermented Sea Water (per gallon fresh water)
    // Sea Water 1:30, BRV 1:200, WCA 1:500
    seaWater: {
        seaWaterMl: 126,    // ml sea water (1:30 ratio)
        brv: 19,            // ml BRV (1:200 ratio)
        wca: 8              // ml WCA (1:500 ratio)
    }
};

// Conversion constants
const GALLON_TO_LITER = 3.78541;
const LBS_TO_KG = 0.453592;
const LBS_PER_GALLON_WATER = 8.34;

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initInputCards();
    initCalculatorTabs();
    initCalculators();
    initFAQ();
    initSmoothScroll();
});

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Close menu when clicking a link
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
}

// ============================================
// INPUT CARDS (Expand/Collapse)
// ============================================

function initInputCards() {
    const cards = document.querySelectorAll('.input-card');

    cards.forEach(card => {
        const toggleBtn = card.querySelector('.card-toggle');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                // Close other cards first
                cards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('expanded')) {
                        otherCard.classList.remove('expanded');
                    }
                });

                // Toggle current card
                card.classList.toggle('expanded');
            });
        }
    });
}

// ============================================
// CALCULATOR TABS
// ============================================

function initCalculatorTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.calculator-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Update button states
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panel visibility
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// ============================================
// CALCULATORS - Main Logic
// ============================================

function initCalculators() {
    initChickWaterCalculator();
    initCalciumCalculator();
    initFermentedFeedCalculator();
    initSOSCalculator();
    initSeaWaterCalculator();
}

// Chick Water Calculator (NO WCA - separate now)
function initChickWaterCalculator() {
    const input = document.getElementById('cw-gallons');
    const unitSelect = document.getElementById('cw-unit');

    if (!input || !unitSelect) return;

    const calculate = () => {
        let value = parseFloat(input.value) || 0;
        const unit = unitSelect.value;

        // Convert to gallons if liters
        let gallons = unit === 'liters' ? value / GALLON_TO_LITER : value;

        // Calculate amounts
        const labs = (RATIOS.chickWater.labs * gallons).toFixed(1);
        const fpj = (RATIOS.chickWater.fpj * gallons).toFixed(1);
        const vinegar = (RATIOS.chickWater.vinegar * gallons).toFixed(1);
        const seaWater = (RATIOS.chickWater.seaWater * gallons).toFixed(0);
        const salt = (RATIOS.chickWater.salt * gallons).toFixed(1);

        // Update DOM
        updateElement('cw-labs', formatNumber(labs));
        updateElement('cw-fpj', formatNumber(fpj));
        updateElement('cw-vinegar', formatNumber(vinegar));
        updateElement('cw-seawater', formatNumber(seaWater));
        updateElement('cw-salt', formatNumber(salt));
    };

    input.addEventListener('input', calculate);
    unitSelect.addEventListener('change', calculate);

    // Initial calculation
    calculate();
}

// Calcium Calculator (SEPARATE from chick water)
function initCalciumCalculator() {
    const input = document.getElementById('ca-gallons');
    const unitSelect = document.getElementById('ca-unit');

    if (!input || !unitSelect) return;

    const calculate = () => {
        let value = parseFloat(input.value) || 0;
        const unit = unitSelect.value;

        // Convert to gallons if liters
        let gallons = unit === 'liters' ? value / GALLON_TO_LITER : value;

        // Calculate WCA amount
        const wca = (RATIOS.calcium.wca * gallons).toFixed(1);

        // Update DOM
        updateElement('ca-wca', formatNumber(wca));
    };

    input.addEventListener('input', calculate);
    unitSelect.addEventListener('change', calculate);

    // Initial calculation
    calculate();
}

// Fermented Feed Calculator
// Formula: 6 lbs feed : 8.34 lbs water (1:1.39 ratio)
// Additives: 4ml LAB + 8ml FPJ per gallon of water
function initFermentedFeedCalculator() {
    const input = document.getElementById('ff-feed');
    const unitSelect = document.getElementById('ff-unit');

    if (!input || !unitSelect) return;

    const calculate = () => {
        let value = parseFloat(input.value) || 0;
        const unit = unitSelect.value;

        // Convert to lbs if kg
        let feedLbs = unit === 'kg' ? value / LBS_TO_KG : value;

        // Calculate water needed (1:1.39 ratio)
        const waterLbs = feedLbs * RATIOS.fermentedFeed.waterRatio;
        const waterGallons = waterLbs / LBS_PER_GALLON_WATER;

        // Calculate additives based on gallons of water
        const labs = waterGallons * RATIOS.fermentedFeed.labsPerGallon;
        const fpj = waterGallons * RATIOS.fermentedFeed.fpjPerGallon;

        // Update DOM
        updateElement('ff-water', waterLbs.toFixed(2));
        updateElement('ff-water-gal', waterGallons.toFixed(2));
        updateElement('ff-labs', formatNumber(labs.toFixed(1)));
        updateElement('ff-fpj', formatNumber(fpj.toFixed(1)));
    };

    input.addEventListener('input', calculate);
    unitSelect.addEventListener('change', calculate);

    // Initial calculation
    calculate();
}

// Coop Bedding Spray Calculator
function initSOSCalculator() {
    const input = document.getElementById('sos-gallons');
    const unitSelect = document.getElementById('sos-unit');

    if (!input || !unitSelect) return;

    const calculate = () => {
        let value = parseFloat(input.value) || 0;
        const unit = unitSelect.value;

        // Convert to gallons if liters
        let gallons = unit === 'liters' ? value / GALLON_TO_LITER : value;

        // Calculate amounts
        const labs = (RATIOS.coopSpray.labs * gallons).toFixed(0);
        const fpj = (RATIOS.coopSpray.fpj * gallons).toFixed(0);
        const seawater = (RATIOS.coopSpray.seawater * gallons).toFixed(0);
        const vinegar = (RATIOS.coopSpray.vinegar * gallons).toFixed(0);

        // Update DOM
        updateElement('sos-labs', formatNumber(labs));
        updateElement('sos-fpj', formatNumber(fpj));
        updateElement('sos-seawater', formatNumber(seawater));
        updateElement('sos-vinegar', formatNumber(vinegar));
    };

    input.addEventListener('input', calculate);
    unitSelect.addEventListener('change', calculate);

    // Initial calculation
    calculate();
}

// Fermented Sea Water Calculator
// Formula: Sea Water (1:30) + BRV (1:200) + WCA (1:500)
function initSeaWaterCalculator() {
    const input = document.getElementById('sw-gallons');
    const unitSelect = document.getElementById('sw-unit');

    if (!input || !unitSelect) return;

    const calculate = () => {
        let value = parseFloat(input.value) || 0;
        const unit = unitSelect.value;

        // Convert to gallons if liters
        let gallons = unit === 'liters' ? value / GALLON_TO_LITER : value;

        // Calculate amounts
        const seaWater = (RATIOS.seaWater.seaWaterMl * gallons).toFixed(0);
        const brv = (RATIOS.seaWater.brv * gallons).toFixed(0);
        const wca = (RATIOS.seaWater.wca * gallons).toFixed(0);

        // Update DOM
        updateElement('sw-seawater', formatNumber(seaWater));
        updateElement('sw-brv', formatNumber(brv));
        updateElement('sw-wca', formatNumber(wca));
    };

    input.addEventListener('input', calculate);
    unitSelect.addEventListener('change', calculate);

    // Initial calculation
    calculate();
}

// ============================================
// FAQ ACCORDION
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatNumber(num) {
    const parsed = parseFloat(num);
    if (isNaN(parsed)) return '0';

    // Remove unnecessary decimals
    if (parsed === Math.floor(parsed)) {
        return parsed.toString();
    }

    // Remove trailing zeros
    return parseFloat(parsed.toFixed(2)).toString();
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

// ============================================
// SCROLL EFFECTS - Header shadow on scroll
// ============================================

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section-header, .input-card, .recipe-card, .guide-card, .faq-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
