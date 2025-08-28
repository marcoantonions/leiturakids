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
    };

    showNotification(sectionNames[section] || 'Nova seção');
}


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

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function playSound(text) {
    // Mostrar indicador de áudio
    const indicator = document.getElementById('audio-indicator');
    indicator.classList.add('show');

    // Simular reprodução de áudio (substituir por áudio real)
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.7;
        utterance.pitch = 1.2;

        utterance.onend = () => {
            indicator.classList.remove('show');
        };

        speechSynthesis.speak(utterance);
    } else {
        // Fallback se não houver suporte a síntese de voz
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 1500);
    }
}

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
        button.onclick = () => playSound(syllable);
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

function showLesson(lessonIndex) {
    // Ocultar todas as lições
    document.querySelectorAll('.lesson-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar lição selecionada
    document.getElementById(`lesson-${lessonIndex}`).classList.add('active');

    // Atualizar indicador de progresso
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

function changeSection(section) {
    showNotification(`Navegando para ${section}...`);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    createLettersGrid();
    createSyllablesGrid();
    createWordsGrid();
    createSentencesContainer();
    updateNavigationButtons();
    showNotification('Vamos para as aulas! 🎓');
});