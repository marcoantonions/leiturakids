// Sistema de notificações
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message + ' 🎉';
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Mudança de seção no menu vertical
function changeSection(section) {
    // Remove classe ativa de todos os itens
    document.querySelectorAll('.side-nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Adiciona classe ativa ao item clicado
    event.target.classList.add('active');

    const sectionNames = {
        'perfil': 'Meu Perfil 👤',
        'aulas': 'Aulas 📚',
        'ideias': 'Novas Ideias 💡',
        'atividades': 'Atividades ✏️',
        'listas': 'Minhas Listas 📋',
        'jogos': 'Jogos Divertidos 🎮',
        'conquistas': 'Conquistas 🏆'
    };

    showNotification(sectionNames[section] || 'Nova seção');
}

// Animação de entrada
window.addEventListener('load', () => {
    setTimeout(() => {
        showNotification('Bem-vindo ao Leitura Kids!');
    }, 1000);
});

// Loading screen
window.addEventListener('load', function () {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 500);
});

// Menu responsivo
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
  
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-active");
  
      // troca o ícone de menu para 'close' e vice-versa
      const icon = hamburger.querySelector(".material-symbols-outlined");
      if(navMenu.classList.contains("mobile-active")){
        icon.textContent = "close";
        hamburger.setAttribute("aria-label", "Fechar menu");
      } else {
        icon.textContent = "menu";
        hamburger.setAttribute("aria-label", "Abrir menu");
      }
    });
  
    // Opcional: fechar menu ao clicar em algum link do menu
    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if(navMenu.classList.contains("mobile-active")){
          navMenu.classList.remove("mobile-active");
          hamburger.querySelector(".material-symbols-outlined").textContent = "menu";
          hamburger.setAttribute("aria-label", "Abrir menu");
        }
      });
    });
  });

// Informações do usuário
  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showBadgeInfo(badgeName) {
    showNotification(`Conquista: ${badgeName}! 🏆`);
}

    // Animação da barra de progresso
window.addEventListener('load', () => {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-progress');
            bar.style.width = width + '%';
        });
    }, 500);
});

    // Função para alternar seções (placeholder)
function changeSection(section) {
    showNotification(`Navegando para ${section}...`);
}

    // Função para inicializar atividades (placeholder)
function startActivity(activity) {
    showNotification(`Iniciando ${activity}...`);
}