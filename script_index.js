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

    // Verifica se o scroll está dentro da área da seção
    if (scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  // Atualiza os links do menu com a classe "active"
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

  // Duplica os cards para dar efeito de loop
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  // Calcula largura total de cada card (inclui margem)
  function getCardWidth() {
    const style = window.getComputedStyle(cards[0]);
    const margin = parseInt(style.marginRight);
    return cards[0].offsetWidth + margin;
  }

  // Move o carrossel para o card no índice atual
  function scrollToIndex(index) {
    const cardWidth = getCardWidth();
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  // Reseta o carrossel para o início (efeito infinito)
  function resetToStart() {
    track.style.transition = "none";
    track.style.transform = `translateX(0px)`;
    currentIndex = 0;
  }

  // Avança automaticamente o carrossel
  function autoScroll() {
    currentIndex++;
    scrollToIndex(currentIndex);

    if (currentIndex >= cardCount) {
      setTimeout(() => {
        resetToStart();
      }, 510);
    }
  }

  // Roda a cada 2 segundos
  setInterval(autoScroll, 2000);

  // Recalcula largura quando a tela é redimensionada
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

  // Abrir/fechar menu
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("mobile-active");

    // Troca ícone entre "menu" e "close"
    const icon = hamburger.querySelector(".material-symbols-outlined");
    if (navMenu.classList.contains("mobile-active")) {
      icon.textContent = "close";
      hamburger.setAttribute("aria-label", "Fechar menu");
    } else {
      icon.textContent = "menu";
      hamburger.setAttribute("aria-label", "Abrir menu");
    }
  });

  // Fechar menu ao clicar em um link
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
// MODAL DE LOGIN
// =====================================================
const openBtn = document.getElementById("abrirLogin");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

// Abrir modal
openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Fechar modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fechar ao clicar fora
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Atalhos para abrir modal
document.querySelectorAll(".abrirLogin").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("modal").style.display = "flex";
  });
});

// =====================================================
// LOGIN SIMPLES (SIMULAÇÃO)
// =====================================================
function trocarlogin() {
  cancelCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "none";
    modalLogin.style.display = "flex";
  });
}

function abrirPagina() {
  window.open("home.html", "_self");
}

function reiniciar() {
  window.open("index.html", "_self");
}

function login() {
  var user = document.getElementById("user").value;
  var senha = document.getElementById("senha").value;

  if ((user === "ADM" && senha === "123") || (user === "adm" && senha === "123")) {
    abrirPagina();
  } else {
    alert("Usuário ou Senha Inválidos. Tente Novamente.");
  }
}

function dado() {
  alert("Usuario = ADM  |  Senha = 123");
}

function cadastro() {
  var nome = document.getElementById("nome").value;
  var email = document.getElementById("email").value;
  var usuario = document.getElementById("usuario").value;
  var password = document.getElementById("password").value;

  if (nome != "" && email != "" && usuario != "" && password != "") {
    alert("Cadastro Realizado com Sucesso!\n\nFaça o Login na Sua Nova Conta!");
    reiniciar();
  } else {
    alert("Dados Incompletos!");
  }
}

// =====================================================
// MODAIS DE CADASTRO E LOGIN
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const modalCadastro = document.getElementById("modal-cadastro");
  const modalLogin = document.getElementById("modal-login");

  const abrirCadastro = document.getElementById("abrirCadastro");
  const abrirLogin = document.getElementById("abrirLogin");

  const closeCadastro = document.getElementById("closeCadastro");
  const closeLogin = document.getElementById("closeLogin");

  const cancelCadastro = document.getElementById("cancelCadastro");
  const cancelLogin = document.getElementById("cancelLogin");

  const cadastroContent = modalCadastro.querySelector(".modal-content");
  const loginContent = modalLogin.querySelector(".modal-content");

  // Abrir modais
  abrirCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "flex";
  });

  abrirLogin.addEventListener("click", () => {
    modalCadastro.style.display = "none";
    modalLogin.style.display = "flex";
  });

  // Fechar modais
  closeCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "none";
  });

  closeLogin.addEventListener("click", () => {
    modalLogin.style.display = "none";
  });

  // Trocar entre login e cadastro
  cancelCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "none";
    modalLogin.style.display = "flex";
  });

  cancelLogin.addEventListener("click", () => {
    modalLogin.style.display = "none";
    modalCadastro.style.display = "flex";
  });

  // Fechar ao clicar fora do conteúdo
  modalCadastro.addEventListener("click", (e) => {
    if (!cadastroContent.contains(e.target)) {
      modalCadastro.style.display = "none";
    }
  });

  modalLogin.addEventListener("click", (e) => {
    if (!loginContent.contains(e.target)) {
      modalLogin.style.display = "none";
    }
  });
});

// =====================================================
// MODAL DE CADASTRO ISOLADO
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const modalCadastro = document.getElementById("modal-cadastro");
  const abrirCadastro = document.getElementById("abrirCadastro");
  const closeCadastro = document.getElementById("closeCadastro");
  const cancelCadastro = document.getElementById("cancelCadastro");
  const modalContent = modalCadastro.querySelector(".modal-content");

  // Abrir modal
  abrirCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "flex";
  });

  // Fechar com botão X
  closeCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "none";
  });

  // Trocar para login
  cancelCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "none";
    modal.style.display = "flex";
  });

  // Fechar ao clicar fora
  modalCadastro.addEventListener("click", (e) => {
    if (!modalContent.contains(e.target)) {
      modalCadastro.style.display = "none";
    }
  });
});

// =====================================================
// CONFIGURAÇÕES INICIAIS
// =====================================================

// Sempre iniciar no topo ao carregar
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Animação do título "Leitura Kids"
setTimeout(() => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    typeWriter(heroTitle, 'LeituraKids', 150);
  }
}, 2000);
