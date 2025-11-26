// =====================================================
// DESTACAR SEÇÃO ATUAL NO MENU AO ROLAR A PÁGINA
// =====================================================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

function toggleMenu() {
    document.getElementById("menuDropdown").classList.toggle("show");
}

// =====================================================
// CAROUSEL AUTOMÁTICO
// =====================================================
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector('#carousel-track');
  const cards = document.querySelectorAll('.service-card');
  const cardCount = cards.length;
  let currentIndex = 0;

  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  function getCardWidth() {
    const style = window.getComputedStyle(cards[0]);
    const margin = parseInt(style.marginRight);
    return cards[0].offsetWidth + margin;
  }

  function scrollToIndex(index) {
    const cardWidth = getCardWidth();
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  function resetToStart() {
    track.style.transition = "none";
    track.style.transform = `translateX(0px)`;
    currentIndex = 0;
  }

  function autoScroll() {
    currentIndex++;
    scrollToIndex(currentIndex);

    if (currentIndex >= cardCount) {
      setTimeout(() => {
        resetToStart();
      }, 510);
    }
  }

  setInterval(autoScroll, 2000);

  window.addEventListener("resize", () => scrollToIndex(currentIndex));
});

// =====================================================
// ROLAGEM SUAVE PARA ÂNCORAS
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// =====================================================
// FORMULÁRIO DE CONTATO
// =====================================================
const form = document.getElementById('contactForm');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  alert("Obrigado pelo seu Feedback, Entraremos em Contato em Breve!");
  form.reset();
});

// =====================================================
// MENU FIXO DESTACANDO A SEÇÃO ATUAL
// =====================================================
window.addEventListener('scroll', function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
});

// =====================================================
// ANIMAÇÃO DE CARDS DE SERVIÇO
// =====================================================
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-15px) scale(1.02)';
  });

  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// =====================================================
// EFEITO DE TEXTO DIGITADO
// =====================================================
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// =====================================================
// MENU RESPONSIVO (HAMBÚRGUER)
// =====================================================
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("mobile-active");

    const icon = hamburger.querySelector(".material-symbols-outlined");
    if (navMenu.classList.contains("mobile-active")) {
      icon.textContent = "close";
      hamburger.setAttribute("aria-label", "Fechar menu");
    } else {
      icon.textContent = "menu";
      hamburger.setAttribute("aria-label", "Abrir menu");
    }
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("mobile-active")) {
        navMenu.classList.remove("mobile-active");
        hamburger.querySelector(".material-symbols-outlined").textContent = "menu";
        hamburger.setAttribute("aria-label", "Abrir menu");
      }
    });
  });
});

// =====================================================
// CONFIGURAÇÕES INICIAIS
// =====================================================
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

setTimeout(() => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    typeWriter(heroTitle, 'LeituraKids', 150);
  }
}, 2000);