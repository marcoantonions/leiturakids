// ==========================
// Mudança de seção no menu vertical
// ==========================
function changeSection(section, event) {
    // Remove classe ativa de todos os itens
    document.querySelectorAll('.side-nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Adiciona classe ativa ao item clicado
    event.target.classList.add('active');

    // Nomes das seções
    const sectionNames = {
        'perfil': 'Meu Perfil 👤',
        'aulas': 'Aulas 📚',
        'ideias': 'Novas Ideias 💡',
        'atividades': 'Atividades ✏️',
        'listas': 'Minhas Listas 📋',
        'jogos': 'Jogos Divertidos 🎮',
    };

    // Mostra notificação da seção
    showNotification(sectionNames[section] || 'Nova seção');
}

// ==========================
// Menu responsivo (hamburger)
// ==========================
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    // Abre/fecha menu ao clicar no ícone
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("mobile-active");

        // Troca ícone de "menu" para "close"
        const icon = hamburger.querySelector(".material-symbols-outlined");
        if (navMenu.classList.contains("mobile-active")) {
            icon.textContent = "close";
            hamburger.setAttribute("aria-label", "Fechar menu");
        } else {
            icon.textContent = "menu";
            hamburger.setAttribute("aria-label", "Abrir menu");
        }
    });

    // Fecha menu ao clicar em um link
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

// ==========================
// Controle das lições
// ==========================
let currentLesson = 0;
const totalLessons = 4;

// Dados das lições
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const syllables = [
    'BA', 'BE', 'BI', 'BO', 'BU',
    'CA', 'CE', 'CI', 'CO', 'CU',
    'DA', 'DE', 'DI', 'DO', 'DU',
    'FA', 'FE', 'FI', 'FO', 'FU',
    'GA', 'GE', 'GI', 'GO', 'GU',
    'LA', 'LE', 'LI', 'LO', 'LU',
    'MA', 'ME', 'MI', 'MO', 'MU',
    'PA', 'PE', 'PI', 'PO', 'PU',
    'RA', 'RE', 'RI', 'RO', 'RU',
    'SA', 'SE', 'SI', 'SO', 'SU'
];

const words = [
    'CASA', 'BOLA', 'GATO', 'CARRO', 'FLOR',
    'SOL', 'LUA', 'ÁGUA', 'PEIXE', 'ÁRVORE',
    'LIVRO', 'ESCOLA', 'FAMÍLIA', 'AMIGO', 'FELIZ',
    'CORAÇÃO', 'SORRISO', 'ABRAÇO', 'CARINHO', 'AMOR'
];

const sentences = [
    'O GATO SUBIU NO TELHADO.',
    'A BOLA É VERMELHA E REDONDA.',
    'EU AMO MINHA FAMÍLIA.',
    'O SOL BRILHA NO CÉU AZUL.',
    'AS FLORES SÃO MUITO BONITAS.',
    'VAMOS BRINCAR NO PARQUE.',
    'A ESCOLA É UM LUGAR DE APRENDER.',
    'OS AMIGOS GOSTAM DE BRINCAR JUNTOS.',
    'A LEITURA É MUITO DIVERTIDA.',
    'JUNTOS PODEMOS APRENDER MUITO!'
];

// Mapeia sílabas para pronúncias fonéticas
const syllablePronunciations = { BA: 'bá', BE: 'bê', BI: 'bi', BO: 'bô', BU: 'bu', CA: 'cá', CE: 'cê', CI: 'ci', CO: 'cô', CU: 'cu', DA: 'dá', DE: 'dê', DI: 'di', DO: 'dô', DU: 'du', FA: 'fá', FE: 'fê', FI: 'fi', FO: 'fô', FU: 'fu', GA: 'gá', GE: 'gê', GI: 'gi', GO: 'gô', GU: 'gu', LA: 'lá', LE: 'lê', LI: 'li', LO: 'lô', LU: 'lu', MA: 'má', ME: 'mê', MI: 'mi', MO: 'mô', MU: 'mu', PA: 'pá', PE: 'pê', PI: 'pi', PO: 'pô', PU: 'pu', RA: 'rá', RE: 'rê', RI: 'ri', RO: 'rô', RU: 'ru', SA: 'sá', SE: 'sê', SI: 'si', SO: 'sô', SU: 'su' };

// ==========================
// Sistema de Notificação
// ==========================
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ==========================
// Reprodução de áudio (TTS)
// ==========================
function playSound(text) {
    const indicator = document.getElementById('audio-indicator');
    indicator.classList.add('show');

    // Interrompe áudio anterior
    if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
    }

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        utterance.pitch = 1.2;

        // Remove indicador ao terminar
        utterance.onend = () => {
            indicator.classList.remove('show');
        };

        utterance.onerror = () => {
            indicator.classList.remove('show');
        };

        speechSynthesis.speak(utterance);
    } else {
        indicator.classList.remove('show');
    }
}

// ==========================
// Geração dinâmica das lições
// ==========================

function createLettersGrid() {
    const grid = document.getElementById('letters-grid');
    grid.innerHTML = '';

    alphabet.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'letter-card';
        button.textContent = letter;
        button.onclick = () => playSound(letter);
        grid.appendChild(button);
    });
}

function createSyllablesGrid() {
    const grid = document.getElementById('syllables-grid');
    grid.innerHTML = '';

    syllables.forEach(syllable => {
        const button = document.createElement('button');
        button.className = 'syllable-card';
        button.textContent = syllable;

        const soundText = syllablePronunciations[syllable] || syllable;
        button.onclick = () => playSound(soundText);

        grid.appendChild(button);
    });
}
function createWordsGrid() {
    const grid = document.getElementById('words-grid');
    grid.innerHTML = '';

    words.forEach(word => {
        const button = document.createElement('button');
        button.className = 'word-card';
        button.textContent = word;
        button.onclick = () => playSound(word);
        grid.appendChild(button);
    });
}

function createSentencesContainer() {
    const container = document.getElementById('sentences-container');
    container.innerHTML = '';

    sentences.forEach(sentence => {
        const button = document.createElement('button');
        button.className = 'sentence-card';
        button.textContent = sentence;
        button.onclick = () => playSound(sentence);
        container.appendChild(button);
    });
}

// ==========================
// Controle de navegação das lições
// ==========================

function showLesson(lessonIndex) {
    // Ocultar todas as lições
    document.querySelectorAll('.lesson-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar a lição atual
    document.getElementById(`lesson-${lessonIndex}`).classList.add('active');

    // Atualiza a barra de progresso
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < lessonIndex) {
            step.classList.add('completed');
        } else if (index === lessonIndex) {
            step.classList.add('active');
        }
    });

    currentLesson = lessonIndex;
    updateNavigationButtons();
}

function nextLesson() {
    if (currentLesson < totalLessons - 1) {
        showLesson(currentLesson + 1);
        showNotification('Parabéns! Vamos para a próxima lição! 🎉');
    }
}

function previousLesson() {
    if (currentLesson > 0) {
        showLesson(currentLesson - 1);
        showNotification('Voltando para a lição anterior 📚');
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentLesson === 0;
    nextBtn.disabled = currentLesson === totalLessons - 1;
}

// ==========================
// Navegação entre seções
// ==========================

function changeSection(section) {
    showNotification(`Navegando para ${section}...`);
}

// ==========================
// Inicialização
// ==========================

document.addEventListener('DOMContentLoaded', () => {
    createLettersGrid();
    createSyllablesGrid();
    createWordsGrid();
    createSentencesContainer();
    updateNavigationButtons();
    showNotification('Vamos para as aulas! 🎓');
});

// ==========================
// Ir para o topo ao recarregar
// ==========================
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);