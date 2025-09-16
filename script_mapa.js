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
    notification.textContent = message + ' 🏴‍☠️'; // Define texto da mensagem
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

// =====================================================
// FUNÇÕES MAPA
// =====================================================

// Função para iniciar nível
        function startLevel() {
            alert('🏴‍☠️ Ahoy! Preparando a aventura na Baía dos Piratas! ⚔️');
            window.open('atividades.html', '_self');
        }

        // Animação de entrada
        window.addEventListener('load', () => {
            setTimeout(() => {
                showNotification('Bem-vindo ao Mapa do Tesouro!');
            }, 1000);
        });

        // Efeitos nos nós
        document.querySelectorAll('.node-content').forEach(node => {
            node.addEventListener('click', function () {
                if (this.querySelector('.node-circle').classList.contains('node-completed')) {
                    createParticles(this, '⭐');
                } else if (this.querySelector('.node-circle').classList.contains('node-current')) {
                    createWaveEffect(this);
                }
            });
        });

        function createParticles(element, particle) {
            for (let i = 0; i < 6; i++) {
                const particleEl = document.createElement('div');
                particleEl.textContent = particle;
                particleEl.style.cssText = `
                    position: absolute;
                    pointer-events: none;
                    font-size: 1.5rem;
                    z-index: 1000;
                    animation: particleFloat 1s ease-out forwards;
                `;
                const rect = element.getBoundingClientRect();
                particleEl.style.left = (rect.left + rect.width / 2) + 'px';
                particleEl.style.top = (rect.top + rect.height / 2) + 'px';
                document.body.appendChild(particleEl);
                setTimeout(() => particleEl.remove(), 1000);
            }
        }

        function createWaveEffect(element) {
            const wave = document.createElement('div');
            wave.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100px;
                height: 100px;
                border: 3px solid #228B22;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: waveExpand 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
            `;
            element.appendChild(wave);
            setTimeout(() => wave.remove(), 600);
        }

        // CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% { transform: translateY(0px) scale(1); opacity: 1; }
                100% { transform: translateY(-100px) scale(0); opacity: 0; }
            }
            @keyframes waveExpand {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);