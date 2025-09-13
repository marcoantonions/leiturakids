// =====================================================
// IR PARA O TOPO AO REINICIAR A PÁGINA
// =====================================================
window.history.scrollRestoration = 'manual'; // Impede o navegador de lembrar a posição de rolagem
window.scrollTo(0, 0); // Força voltar ao topo da página

// =====================================================
// SISTEMA DE NOTIFICAÇÕES
// =====================================================
function showNotification(message) {
    const notification = document.getElementById('notification'); // Seleciona elemento de notificação
    notification.textContent = message + ' 🎉'; // Define texto da mensagem
    notification.classList.add('show'); // Exibe a notificação

    setTimeout(() => {
        notification.classList.remove('show'); // Esconde após 3 segundos
    }, 3000);
}

// =====================================================
// MUDANÇA DE SEÇÃO NO MENU VERTICAL
// =====================================================
function changeSection(section, event) {
    // Remove classe ativa de todos os itens
    document.querySelectorAll('.side-nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Adiciona classe ativa ao item clicado
    event.target.classList.add('active');

    // Nomes para cada seção
    const sectionNames = {
        'perfil': 'Meu Perfil 👤',
        'aulas': 'Aulas 📚',
        'ideias': 'Novas Ideias 💡',
        'atividades': 'Atividades ✏️',
        'listas': 'Minhas Listas 📋',
        'jogos': 'Jogos Divertidos 🎮',
    };

    // Mostra notificação com nome da seção
    showNotification(sectionNames[section] || 'Nova seção');
}

// =====================================================
// ANIMAÇÃO DE ENTRADA (mensagem de boas-vindas)
// =====================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        showNotification('Bem-vindo ao Leitura Kids!');
    }, 1000);
});

// =====================================================
// MENU RESPONSIVO (HAMBÚRGUER PARA MOBILE)
// =====================================================
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector(".hamburger"); // Botão hambúrguer
    const navMenu = document.querySelector(".nav-menu");   // Menu de navegação
  
    // Clique no hambúrguer abre/fecha o menu
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("mobile-active");
  
        // Troca ícone de "menu" ↔ "close"
        const icon = hamburger.querySelector(".material-symbols-outlined");
        if(navMenu.classList.contains("mobile-active")){
            icon.textContent = "close";
            hamburger.setAttribute("aria-label", "Fechar menu");
        } else {
            icon.textContent = "menu";
            hamburger.setAttribute("aria-label", "Abrir menu");
        }
    });
  
    // Fecha menu automaticamente ao clicar em algum link
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

// =====================================================
// INFORMAÇÕES DO USUÁRIO (conquistas)
// =====================================================
function showNotification(message) {
    const notification = document.getElementById('notification'); // Seleciona elemento de notificação
    notification.textContent = message; // Define texto da mensagem
    notification.classList.add('show'); // Mostra notificação
    setTimeout(() => {
        notification.classList.remove('show'); // Esconde após 3s
    }, 3000);
}

function showBadgeInfo(badgeName) {
    showNotification(`Conquista: ${badgeName}! 🏆`); // Mostra conquista desbloqueada
}

// =====================================================
// ANIMAÇÃO DA BARRA DE PROGRESSO
// =====================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill'); // Todas as barras
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-progress'); // Valor armazenado no atributo
            bar.style.width = width + '%'; // Preenche a barra de acordo com o progresso
        });
    }, 500);
});

// =====================================================
// FUNÇÕES PLACEHOLDER (exemplo futuro)
// =====================================================

    // Função para alternar seções (placeholder)
function changeSection(section) {
    showNotification(`Navegando para ${section}...`);
}

    // Função para inicializar atividades (placeholder)
function startActivity(activity) {
    showNotification(`Iniciando ${activity}...`);
}

function toggleMenu() {
    document.getElementById("menuDropdown").classList.toggle("show");
}

// Fecha o menu se clicar fora
window.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown")) {
        document.getElementById("menuDropdown").classList.remove("show");
    }
});