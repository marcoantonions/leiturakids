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
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("mobile-active");

        // troca o ícone de menu para 'close' e vice-versa
        const icon = hamburger.querySelector(".material-symbols-outlined");
        if (navMenu.classList.contains("mobile-active")) {
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
            if (navMenu.classList.contains("mobile-active")) {
                navMenu.classList.remove("mobile-active");
                hamburger.querySelector(".material-symbols-outlined").textContent = "menu";
                hamburger.setAttribute("aria-label", "Abrir menu");
            }
        });
    });
});

let currentGame = 0;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalAttempts = 0;
let currentWordFormed = "";

// Dados dos jogos
const game1Data = [
    {
        imagem: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop",
        correta: "gato",
        opcoes: ["gato", "cachorro", "pato"]
    },
    {
        imagem: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
        correta: "cachorro",
        opcoes: ["gato", "cachorro", "coelho"]
    },
    {
        imagem: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop",
        correta: "papagaio",
        opcoes: ["papagaio", "leão", "peixe"]
    },
    {
        imagem: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=300&h=300&fit=crop",
        correta: "pato",
        opcoes: ["pato", "urso", "gato"]
    },
    {
        imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
        correta: "coelho",
        opcoes: ["coelho", "rato", "porco"]
    }
];

const game2Data = [
    {
        imagem: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop",
        silabas: ["ga", "to"],
        correta: "gato"
    },
    {
        imagem: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
        silabas: ["ca", "chor", "ro"],
        correta: "cachorro"
    },
    {
        imagem: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=300&h=300&fit=crop",
        silabas: ["pa", "to"],
        correta: "pato"
    },
    {
        imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
        silabas: ["coe", "lho"],
        correta: "coelho"
    },
    {
        imagem: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop",
        silabas: ["pa", "pa", "gai", "o"],
        correta: "papagaio"
    }
];

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function selectGame(gameIndex) {
    // Atualizar seletor visual
    document.querySelectorAll('.game-option').forEach((option, index) => {
        option.classList.toggle('active', index === gameIndex);
    });

    // Mostrar jogo selecionado
    document.querySelectorAll('.game-area').forEach((area, index) => {
        area.classList.toggle('active', index === gameIndex);
    });

    currentGame = gameIndex;
    currentQuestionIndex = 0;
    resetStats();
    loadQuestion();
}

function resetStats() {
    correctAnswers = 0;
    totalAttempts = 0;
    updateStats();
}

function updateStats() {
    document.getElementById('correct-count').textContent = correctAnswers;
    document.getElementById('total-count').textContent = totalAttempts;
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    if (currentGame === 0) {
        loadGame1Question();
    } else {
        loadGame2Question();
    }
    updateStats();
}

function loadGame1Question() {
    const question = game1Data[currentQuestionIndex];
    document.getElementById('animal-image').src = question.imagem;
    document.getElementById('game1-message').textContent = '';
    document.getElementById('reset-btn-0').style.display = 'none';

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    const shuffledOptions = shuffle([...question.opcoes]);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkGame1Answer(option, question.correta);
        container.appendChild(button);
    });
}

function loadGame2Question() {
    const question = game2Data[currentQuestionIndex];
    document.getElementById('syllable-image').src = question.imagem;
    document.getElementById('game2-message').textContent = '';
    document.getElementById('constructed-word').textContent = 'Clique nas sílabas para formar a palavra';
    document.getElementById('reset-btn-1').style.display = 'none';
    currentWordFormed = '';

    const container = document.getElementById('syllables-container');
    container.innerHTML = '';

    const shuffledSyllables = shuffle([...question.silabas]);
    shuffledSyllables.forEach(syllable => {
        const button = document.createElement('button');
        button.className = 'syllable-btn';
        button.textContent = syllable;
        button.onclick = () => addSyllable(syllable, button);
        container.appendChild(button);
    });
}

function checkGame1Answer(selected, correct) {
    totalAttempts++;
    const messageEl = document.getElementById('game1-message');
    const buttons = document.querySelectorAll('#options-container .option-btn');

    if (selected === correct) {
        correctAnswers++;
        messageEl.textContent = '🎉 Parabéns! Você acertou!';
        messageEl.className = 'game-message success-message';

        // Desabilitar todos os botões
        buttons.forEach(btn => btn.disabled = true);

        setTimeout(() => {
            nextQuestion();
        }, 2000);
    } else {
        messageEl.textContent = '❌ Ops! Tente novamente!';
        messageEl.className = 'game-message error-message';

        // Desabilitar todos os botões e mostrar botão de reset
        buttons.forEach(btn => btn.disabled = true);
        document.getElementById('reset-btn-0').style.display = 'block';
    }
    updateStats();
}

function addSyllable(syllable, button) {
    currentWordFormed += syllable;
    document.getElementById('constructed-word').textContent = currentWordFormed;
    button.disabled = true;

    const question = game2Data[currentQuestionIndex];
    const messageEl = document.getElementById('game2-message');

    if (currentWordFormed.length >= question.correta.length) {
        totalAttempts++;

        if (currentWordFormed === question.correta) {
            correctAnswers++;
            messageEl.textContent = '🎉 Muito bem! Palavra formada!';
            messageEl.className = 'game-message success-message';

            // Desabilitar todos os botões restantes
            document.querySelectorAll('#syllables-container .syllable-btn').forEach(btn => btn.disabled = true);

            setTimeout(() => {
                nextQuestion();
            }, 2000);
        } else {
            messageEl.textContent = '❌ Palavra incorreta! Tente novamente!';
            messageEl.className = 'game-message error-message';

            // Desabilitar todos os botões e mostrar botão de reset
            document.querySelectorAll('#syllables-container .syllable-btn').forEach(btn => btn.disabled = true);
            document.getElementById('reset-btn-1').style.display = 'block';
        }
        updateStats();
    }
}

function resetCurrentQuestion(gameIndex) {
    if (gameIndex === 0) {
        loadGame1Question();
    } else {
        loadGame2Question();
    }
    showNotification('Vamos tentar novamente! 💪');
}

function nextQuestion() {
    const maxQuestions = currentGame === 0 ? game1Data.length : game2Data.length;
    currentQuestionIndex = (currentQuestionIndex + 1) % maxQuestions;

    if (currentQuestionIndex === 0) {
        showNotification('Parabéns! Você completou todas as perguntas! 🎊');
        setTimeout(() => {
            showNotification(`Resultado: ${correctAnswers} acertos em ${totalAttempts} tentativas! 📊`);
        }, 2000);
    }

    loadQuestion();
}

function changeSection(section) {
    showNotification(`Navegando para ${section}...`);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    showNotification('Hora dos jogos! 🎯');
});