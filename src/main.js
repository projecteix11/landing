import './style.css'

// Intersection Observer for scroll-triggered animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
)

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))

// Mobile nav toggle
const menuBtn = document.getElementById('menu-btn')
const mobileNav = document.getElementById('mobile-nav')

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open')
    const isOpen = mobileNav.classList.contains('open')
    menuBtn.setAttribute('aria-expanded', isOpen)
  })

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open')
      menuBtn.setAttribute('aria-expanded', 'false')
    })
  })
}

// Navbar background on scroll
const nav = document.getElementById('navbar')
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
  }, { passive: true })
}
