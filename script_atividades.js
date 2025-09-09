// =====================================================
// VARIÁVEIS GLOBAIS E DADOS
// =====================================================

let gameStats = {
    totalScore: 0,
    totalCorrect: 0,
    gamesPlayed: 0,
    streak: 0,
    currentGame: null
};

// Dados para Complete a Palavra
let wordData = {
    currentIndex: 0,
    selectedSlot: null,
    words: [
        { word: 'CASA', hint: '🏠', missing: [0, 2] },
        { word: 'GATO', hint: '🐱', missing: [1, 3] },
        { word: 'FLOR', hint: '🌸', missing: [0, 2] },
        { word: 'BOLA', hint: '⚽', missing: [1, 3] },
        { word: 'SOL', hint: '☀️', missing: [0, 2] },
        { word: 'PEIXE', hint: '🐟', missing: [0, 2, 4] }
    ]
};

// Dados para Formar Frases
let sentenceData = {
    currentIndex: 0,
    sequence: [],
    sentences: [
        { target: 'O gato subiu na árvore', words: ['O', 'gato', 'subiu', 'na', 'árvore', 'casa', 'bola'] },
        { target: 'A bola é vermelha', words: ['A', 'bola', 'é', 'vermelha', 'gato', 'casa', 'grande'] },
        { target: 'Eu amo minha família', words: ['Eu', 'amo', 'minha', 'família', 'escola', 'brincar', 'feliz'] },
        { target: 'O sol brilha no céu', words: ['O', 'sol', 'brilha', 'no', 'céu', 'água', 'flores'] }
    ]
};

// Dados para Quiz de Sons
let soundData = {
    currentIndex: 0,
    words: [
        { word: 'CASA', options: ['CASA', 'MESA', 'ROSA', 'VASO'] },
        { word: 'GATO', options: ['GATO', 'PATO', 'RATO', 'MATO'] },
        { word: 'BOLA', options: ['BOLA', 'COLA', 'SOLA', 'FOLA'] },
        { word: 'FLOR', options: ['FLOR', 'AMOR', 'DOR', 'COR'] },
        { word: 'ÁGUA', options: ['ÁGUA', 'MÁGOA', 'RÉGUA', 'LÍNGUA'] }
    ]
};

// Dados para Rimas
let rhymeData = {
    currentIndex: 0,
    words: [
        { word: 'GATO', options: ['PATO', 'CASA', 'BOLA', 'FLOR'], correct: 'PATO' },
        { word: 'CASA', options: ['MESA', 'GATO', 'SOL', 'ASA'], correct: 'MESA' },
        { word: 'FLOR', options: ['AMOR', 'GATO', 'BOLA', 'CASA'], correct: 'AMOR' },
        { word: 'BOLA', options: ['COLA', 'GATO', 'FLOR', 'MESA'], correct: 'COLA' },
        { word: 'CORAÇÃO', options: ['LIMÃO', 'GATO', 'CASA', 'BOLA'], correct: 'LIMÃO' }
    ]
};

// Dados para Sílabas
let syllableData = {
    currentIndex: 0,
    sequence: [],
    words: [
        { word: 'CASA', syllables: ['CA', 'SA'] },
        { word: 'GATO', syllables: ['GA', 'TO'] },
        { word: 'BOLA', syllables: ['BO', 'LA'] },
        { word: 'FLOR', syllables: ['FLOR'] },
        { word: 'PATO', syllables: ['PA', 'TO'] },
        { word: 'BANANA', syllables: ['BA', 'NA', 'NA'] }
    ]
};

// Dados para Caça Letras
let letterHuntData = {
    currentLetter: 'A',
    timeLimit: 10,
    timeLeft: 10,
    timer: null,
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
};

// =====================================================
// FUNÇÕES DE INTERFACE E NAVEGAÇÃO
// =====================================================

function showMenu() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById('activities-menu').style.display = 'grid';
    gameStats.currentGame = null;
    updateGlobalStats();
}

function showGame(gameId) {
    document.getElementById('activities-menu').style.display = 'none';
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(gameId).classList.add('active');
    gameStats.currentGame = gameId;

    // Inicializar jogo específico
    switch (gameId) {
        case 'complete-word': initWordGame(); break;
        case 'sentence-builder': initSentenceGame(); break;
        case 'sound-quiz': initSoundGame(); break;
        case 'rhyme-game': initRhymeGame(); break;
        case 'syllable-order': initSyllableGame(); break;
        case 'letter-hunt': initLetterHunt(); break;
    }
}

function updateGlobalStats() {
    document.getElementById('total-score').textContent = gameStats.totalScore;
    document.getElementById('total-correct').textContent = gameStats.totalCorrect;
    document.getElementById('games-played').textContent = gameStats.gamesPlayed;
    document.getElementById('streak').textContent = gameStats.streak;

    // Aqui seria o ponto de integração com banco de dados
    // saveStatsToDatabase(gameStats);
}

function addPoints(points, correct = true) {
    gameStats.totalScore += points;
    if (correct) {
        gameStats.totalCorrect++;
        gameStats.streak++;
    } else {
        gameStats.streak = 0;
    }
    updateGlobalStats();
}

function playSound(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.7;
        utterance.pitch = 1.2;
        speechSynthesis.speak(utterance);
    }
}

function showFeedback(elementId, message, isCorrect) {
    const feedback = document.getElementById(elementId);
    feedback.textContent = message;
    feedback.className = `feedback ${isCorrect ? '' : 'error'} show`;
    setTimeout(() => feedback.classList.remove('show'), 3000);
}

// =====================================================
// JOGO 1: COMPLETE A PALAVRA
// =====================================================

function initWordGame() {
    const current = wordData.words[wordData.currentIndex];
    document.getElementById('word-hint').textContent = `${current.hint} ${current.word}`;

    const puzzle = document.getElementById('word-puzzle');
    const options = document.getElementById('letter-options');
    puzzle.innerHTML = '';
    options.innerHTML = '';
    wordData.selectedSlot = null;

    // Criar slots para cada letra
    for (let i = 0; i < current.word.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.dataset.index = i;

        if (current.missing.includes(i)) {
            slot.onclick = () => selectSlot(i);
        } else {
            slot.textContent = current.word[i];
            slot.classList.add('filled');
        }
        puzzle.appendChild(slot);
    }

    // Criar opções de letras
    const correctLetters = current.missing.map(i => current.word[i]);
    const wrongLetters = ['B', 'D', 'F', 'J', 'K', 'Q', 'V', 'W', 'X', 'Y', 'Z'].slice(0, 3);
    const allLetters = [...correctLetters, ...wrongLetters].sort(() => Math.random() - 0.5);

    allLetters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-option';
        btn.textContent = letter;
        btn.onclick = () => placeLetter(letter, btn);
        options.appendChild(btn);
    });
}

function selectSlot(index) {
    document.querySelectorAll('.letter-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    wordData.selectedSlot = index;
    document.querySelector(`[data-index="${index}"]`).classList.add('selected');
}

function placeLetter(letter, button) {
    if (wordData.selectedSlot === null) {
        showFeedback('word-feedback', 'Primeiro selecione um espaço vazio!', false);
        return;
    }

    const slot = document.querySelector(`[data-index="${wordData.selectedSlot}"]`);
    slot.textContent = letter;
    slot.classList.add('filled');
    slot.classList.remove('selected');
    button.classList.add('used');
    wordData.selectedSlot = null;
}

function checkWord() {
    const current = wordData.words[wordData.currentIndex];
    const slots = document.querySelectorAll('.letter-slot');
    const userWord = Array.from(slots).map(s => s.textContent || '_').join('');

    if (userWord === current.word) {
        showFeedback('word-feedback', '🎉 Parabéns! Palavra completada!', true);
        addPoints(10, true);
        playSound('Parabéns! Palavra correta!');
    } else {
        showFeedback('word-feedback', '❌ Tente novamente!', false);
        addPoints(0, false);
        playSound('Tente novamente');
    }
}

function nextWord() {
    wordData.currentIndex = (wordData.currentIndex + 1) % wordData.words.length;
    initWordGame();
    document.getElementById('word-feedback').classList.remove('show');
}

// =====================================================
// JOGO 2: FORMAR FRASES
// =====================================================

function initSentenceGame() {
    const current = sentenceData.sentences[sentenceData.currentIndex];
    document.getElementById('sentence-target').textContent = `Monte a frase: "${current.target}"`;

    const wordsContainer = document.getElementById('sentence-words');
    wordsContainer.innerHTML = '';
    sentenceData.sequence = [];

    const shuffled = [...current.words].sort(() => Math.random() - 0.5);
    shuffled.forEach(word => {
        const btn = document.createElement('button');
        btn.className = 'word-option';
        btn.textContent = word;
        btn.onclick = () => addWordToSequence(word, btn);
        wordsContainer.appendChild(btn);
    });

    updateSentenceDropZone();
}

function addWordToSequence(word, button) {
    if (button.classList.contains('used')) return;

    sentenceData.sequence.push(word);
    button.classList.add('used');
    updateSentenceDropZone();
}

function updateSentenceDropZone() {
    const dropZone = document.getElementById('sentence-drop-zone');
    if (sentenceData.sequence.length === 0) {
        dropZone.innerHTML = '<span style="color: #7f8c8d;">Clique nas palavras abaixo na ordem correta</span>';
    } else {
        dropZone.innerHTML = sentenceData.sequence.map((word, index) =>
            `<span class="word-in-sentence" onclick="removeWordFromSequence(${index})">${word}</span>`
        ).join(' ');
    }
}

function removeWordFromSequence(index) {
    const word = sentenceData.sequence[index];
    sentenceData.sequence.splice(index, 1);

    document.querySelectorAll('.word-option').forEach(btn => {
        if (btn.textContent === word && btn.classList.contains('used')) {
            btn.classList.remove('used');
            return;
        }
    });

    updateSentenceDropZone();
}

function checkSentence() {
    const current = sentenceData.sentences[sentenceData.currentIndex];
    const userSentence = sentenceData.sequence.join(' ');

    if (userSentence === current.target) {
        showFeedback('sentence-feedback', '🎉 Frase perfeita!', true);
        addPoints(15, true);
        playSound('Excelente! Frase correta!');
    } else {
        showFeedback('sentence-feedback', '❌ A ordem não está correta!', false);
        addPoints(0, false);
        playSound('Tente organizar as palavras corretamente');
    }
}

function nextSentence() {
    sentenceData.currentIndex = (sentenceData.currentIndex + 1) % sentenceData.sentences.length;
    initSentenceGame();
    document.getElementById('sentence-feedback').classList.remove('show');
}

// =====================================================
// JOGO 3: QUIZ DE SONS
// =====================================================

function initSoundGame() {
    const current = soundData.words[soundData.currentIndex];
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    const shuffled = [...current.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.onclick = () => checkSoundAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

function playCurrentWord() {
    const currentWord = soundData.words[soundData.currentIndex].word;
    playSound(currentWord);
}

function checkSoundAnswer(selectedWord) {
    const correct = soundData.words[soundData.currentIndex].word;
    const buttons = document.querySelectorAll('.quiz-option');

    buttons.forEach(btn => {
        btn.style.pointerEvents = 'none';
        if (btn.textContent === correct) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedWord && selectedWord !== correct) {
            btn.classList.add('wrong');
        }
    });

    if (selectedWord === correct) {
        showFeedback('quiz-feedback', '🎉 Correto!', true);
        addPoints(10, true);
        playSound('Parabéns! Resposta correta!');
    } else {
        showFeedback('quiz-feedback', `❌ Era: ${correct}`, false);
        addPoints(0, false);
        playSound(`A palavra era ${correct}`);
    }
}

function nextSoundQuiz() {
    soundData.currentIndex = (soundData.currentIndex + 1) % soundData.words.length;
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.style.pointerEvents = 'auto';
    });
    initSoundGame();
    document.getElementById('quiz-feedback').classList.remove('show');
}

// =====================================================
// JOGO 4: RIMAS
// =====================================================

function initRhymeGame() {
    const current = rhymeData.words[rhymeData.currentIndex];
    document.getElementById('rhyme-word-display').textContent = current.word;

    const optionsContainer = document.getElementById('rhyme-options');
    optionsContainer.innerHTML = '';

    const shuffled = [...current.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'rhyme-option';
        btn.textContent = option;
        btn.onclick = () => checkRhymeAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

function checkRhymeAnswer(selectedWord) {
    const current = rhymeData.words[rhymeData.currentIndex];
    const buttons = document.querySelectorAll('.rhyme-option');

    buttons.forEach(btn => {
        btn.style.pointerEvents = 'none';
        if (btn.textContent === current.correct) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedWord && selectedWord !== current.correct) {
            btn.classList.add('wrong');
        }
    });

    if (selectedWord === current.correct) {
        showFeedback('rhyme-feedback', '🎉 Perfeito! Essas palavras rimam!', true);
        addPoints(8, true);
        playSound(`Correto! ${current.word} rima com ${current.correct}!`);
    } else {
        showFeedback('rhyme-feedback', `❌ ${current.word} rima com ${current.correct}`, false);
        addPoints(0, false);
        playSound(`${current.word} rima com ${current.correct}`);
    }
}

function nextRhymeWord() {
    rhymeData.currentIndex = (rhymeData.currentIndex + 1) % rhymeData.words.length;
    document.querySelectorAll('.rhyme-option').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.style.pointerEvents = 'auto';
    });
    initRhymeGame();
    document.getElementById('rhyme-feedback').classList.remove('show');
}

// =====================================================
// JOGO 5: SÍLABAS
// =====================================================

function initSyllableGame() {
    const current = syllableData.words[syllableData.currentIndex];
    document.getElementById('syllable-target').textContent = `Forme a palavra: ${current.word}`;

    syllableData.sequence = [];
    const optionsContainer = document.getElementById('syllable-options');
    optionsContainer.innerHTML = '';

    const shuffled = [...current.syllables].sort(() => Math.random() - 0.5);
    shuffled.forEach(syllable => {
        const btn = document.createElement('button');
        btn.className = 'syllable-option';
        btn.textContent = syllable;
        btn.onclick = () => addSyllableToSequence(syllable, btn);
        optionsContainer.appendChild(btn);
    });

    updateSyllableDropZone();
}

function addSyllableToSequence(syllable, button) {
    if (button.classList.contains('used')) return;

    syllableData.sequence.push(syllable);
    button.classList.add('used');
    updateSyllableDropZone();
}

function updateSyllableDropZone() {
    const dropZone = document.getElementById('syllable-drop-zone');
    if (syllableData.sequence.length === 0) {
        dropZone.innerHTML = '<span style="color: #7f8c8d;">Clique nas sílabas na ordem correta</span>';
    } else {
        dropZone.innerHTML = syllableData.sequence.map((syllable, index) =>
            `<span class="syllable-in-zone" onclick="removeSyllableFromSequence(${index})">${syllable}</span>`
        ).join('');
    }
}

function removeSyllableFromSequence(index) {
    const syllable = syllableData.sequence[index];
    syllableData.sequence.splice(index, 1);

    document.querySelectorAll('.syllable-option').forEach(btn => {
        if (btn.textContent === syllable && btn.classList.contains('used')) {
            btn.classList.remove('used');
            return;
        }
    });

    updateSyllableDropZone();
}

function checkSyllableOrder() {
    const current = syllableData.words[syllableData.currentIndex];
    const userWord = syllableData.sequence.join('');

    if (userWord === current.word) {
        showFeedback('syllable-feedback', '🎉 Perfeito! Palavra formada!', true);
        addPoints(12, true);
        playSound('Excelente! Palavra correta!');
    } else {
        showFeedback('syllable-feedback', '❌ A ordem não está correta!', false);
        addPoints(0, false);
        playSound('Tente colocar as sílabas na ordem correta');
    }
}

function nextSyllableWord() {
    syllableData.currentIndex = (syllableData.currentIndex + 1) % syllableData.words.length;
    initSyllableGame();
    document.getElementById('syllable-feedback').classList.remove('show');
}

// =====================================================
// JOGO 6: CAÇA LETRAS (NOVA ATIVIDADE)
// =====================================================

function initLetterHunt() {
    // Escolher letra aleatória
    letterHuntData.currentLetter = letterHuntData.alphabet[Math.floor(Math.random() * letterHuntData.alphabet.length)];
    document.getElementById('target-letter-display').textContent = `Encontre a letra: ${letterHuntData.currentLetter}`;

    // Criar grade com letras aleatórias
    const grid = document.getElementById('alphabet-grid');
    grid.innerHTML = '';

    // Gerar 24 letras aleatórias + garantir que a letra alvo apareça pelo menos uma vez
    const gridLetters = [];
    for (let i = 0; i < 23; i++) {
        gridLetters.push(letterHuntData.alphabet[Math.floor(Math.random() * letterHuntData.alphabet.length)]);
    }
    gridLetters.push(letterHuntData.currentLetter); // Garantir que a letra apareça

    // Embaralhar
    gridLetters.sort(() => Math.random() - 0.5);

    gridLetters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'alphabet-letter';
        btn.textContent = letter;
        btn.onclick = () => checkLetterHunt(letter, btn);
        grid.appendChild(btn);
    });

    // Iniciar timer
    letterHuntData.timeLeft = letterHuntData.timeLimit;
    startLetterHuntTimer();
}

function startLetterHuntTimer() {
    if (letterHuntData.timer) {
        clearInterval(letterHuntData.timer);
    }

    letterHuntData.timer = setInterval(() => {
        letterHuntData.timeLeft--;
        document.getElementById('target-letter-display').textContent =
            `Encontre a letra: ${letterHuntData.currentLetter} (${letterHuntData.timeLeft}s)`;

        if (letterHuntData.timeLeft <= 0) {
            clearInterval(letterHuntData.timer);
            showFeedback('letter-feedback', '⏰ Tempo esgotado! Tente novamente.', false);
            addPoints(0, false);
        }
    }, 1000);
}

function checkLetterHunt(selectedLetter, button) {
    clearInterval(letterHuntData.timer);

    if (selectedLetter === letterHuntData.currentLetter) {
        button.classList.add('found');
        showFeedback('letter-feedback', '🎉 Letra encontrada!', true);
        const timeBonus = Math.max(0, letterHuntData.timeLeft);
        addPoints(5 + timeBonus, true);
        playSound(`Parabéns! Encontrou a letra ${letterHuntData.currentLetter}!`);
    } else {
        button.classList.add('wrong');
        showFeedback('letter-feedback', `❌ Essa é a letra ${selectedLetter}. Procure ${letterHuntData.currentLetter}!`, false);
        addPoints(0, false);
        playSound(`Essa não é a letra correta`);
    }

    // Desabilitar todos os botões
    document.querySelectorAll('.alphabet-letter').forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
}

function nextLetterHunt() {
    clearInterval(letterHuntData.timer);
    document.querySelectorAll('.alphabet-letter').forEach(btn => {
        btn.classList.remove('found', 'wrong');
        btn.style.pointerEvents = 'auto';
    });
    initLetterHunt();
    document.getElementById('letter-feedback').classList.remove('show');
}

// =====================================================
// MENU RESPONSIVO E INICIALIZAÇÃO
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
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
    }
});

// =====================================================
// INICIALIZAÇÃO DOS JOGOS (executado quando a página carrega)
// =====================================================

window.onload = function () {
    generateWordSearchGrid();   // Inicia caça-palavras
    initMemoryGame();           // Inicia jogo da memória
    initSentenceActivity();     // Inicia formar frases
    initSoundQuiz();            // Inicia quiz de sons
    initRhymeActivity();        // Inicia rimas
    showNotification('Vamos praticar com 5 jogos diferentes! 🎮');   // Mensagem inicial
};

// ==========================
// Ir para o topo ao recarregar
// ==========================
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);