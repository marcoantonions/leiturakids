// =====================================================
// VARIÁVEIS GLOBAIS E DADOS
// =====================================================

// Recupera progresso salvo
let savedStats = JSON.parse(localStorage.getItem('gameStats')) || {};

let gameStats = {
    totalScore: savedStats.totalScore || 0,
    totalCorrect: savedStats.totalCorrect || 0,
    gamesPlayed: savedStats.gamesPlayed || 0,
    streak: savedStats.streak || 0,
    currentGame: null
};

// Atualiza a interface
function updateGlobalStats() {
    document.getElementById('total-score').textContent = gameStats.totalScore;
    document.getElementById('total-correct').textContent = gameStats.totalCorrect;
    document.getElementById('games-played').textContent = gameStats.gamesPlayed;
    document.getElementById('streak').textContent = gameStats.streak;
    
    // Salva localmente
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
}

// Sincroniza com o Supabase
async function saveStatsToDatabase() {
    // Aguarda o supabase estar disponível
    if (!window.supabaseClient) {
        console.warn(" Supabase ainda não está disponível");
        return;
    }

    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        console.warn(" Nenhum usuário logado");
        return;
    }

    try {
        console.log(" Salvando progresso no Supabase...", gameStats);

        const { data, error } = await window.supabaseClient
            .from('progresso')
            .upsert({
                user_id: usuarioId,
                pontos: gameStats.totalScore,
                atividades_concluidas: gameStats.gamesPlayed,
                acertos: gameStats.totalCorrect,
            }, { 
                onConflict: 'user_id',
                returning: 'minimal'
            });

        if (error) {
            console.error(" Erro ao salvar progresso:", error);
        } else {
            console.log(" Progresso salvo com sucesso no Supabase!");
        }
    } catch (err) {
        console.error(" Erro inesperado ao salvar:", err);
    }
}

// Carrega progresso do Supabase
async function loadStatsFromDatabase() {
    if (!window.supabaseClient) {
        console.warn(" Supabase não disponível, usando dados locais");
        return;
    }

    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) return;

    try {
        const { data, error } = await window.supabaseClient
            .from('progresso')
            .select('pontos, atividades_concluidas, acertos')
            .eq('user_id', usuarioId)
            .maybeSingle();

        if (error) {
            console.error(" Erro ao carregar progresso:", error);
            return;
        }

        if (data) {
            console.log(" Progresso carregado do banco:", data);
            gameStats.totalScore = data.pontos ?? 0;
            gameStats.gamesPlayed = data.atividades_concluidas ?? 0;
            gameStats.totalCorrect = data.acertos ?? 0;
            updateGlobalStats();
        }
    } catch (err) {
        console.error(" Erro ao carregar progresso:", err);
    }
}

function addPoints(points, correct = true) {
    gameStats.totalScore += points;
    if (correct) {
        gameStats.totalCorrect++;
        gameStats.streak++;
        gameStats.gamesPlayed++;
    } else {
        gameStats.streak = 0;
    }

    updateGlobalStats();
    saveStatsToDatabase();
}

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
        { word: 'PEIXE', hint: '🐟', missing: [0, 2, 4] },
        { word: 'CARRO', hint: '🚗', missing: [1, 3] },
        { word: 'BANANA', hint: '🍌', missing: [0, 3, 5] },
        { word: 'PATO', hint: '🦆', missing: [1, 2] },
        { word: 'COELHO', hint: '🐇', missing: [0, 3, 5] },
        { word: 'LEÃO', hint: '🦁', missing: [0, 2] },
        { word: 'MACACO', hint: '🐒', missing: [1, 4] },
        { word: 'RATO', hint: '🐭', missing: [0, 2] },
        { word: 'VACA', hint: '🐄', missing: [0, 2] },
        { word: 'CAVALO', hint: '🐴', missing: [1, 4] },
        { word: 'PANDA', hint: '🐼', missing: [0, 3] },
        { word: 'TIGRE', hint: '🐯', missing: [1, 3] },
        { word: 'ABELHA', hint: '🐝', missing: [0, 3, 5] },
        { word: 'SAPO', hint: '🐸', missing: [0, 2] },
        { word: 'FOGO', hint: '🔥', missing: [1, 2] },
        { word: 'LUA', hint: '🌙', missing: [0, 1] },
        { word: 'NAVE', hint: '🚀', missing: [1, 3] },
        { word: 'ESTRELA', hint: '⭐', missing: [0, 3, 5] },
        { word: 'CORAÇÃO', hint: '❤️', missing: [0, 3, 6] },
        { word: 'CHUVA', hint: '🌧️', missing: [1, 4] },
        { word: 'ARCO', hint: '🌈', missing: [0, 2] },
        { word: 'LIVRO', hint: '📖', missing: [1, 3] },
        { word: 'ESCOLA', hint: '🏫', missing: [0, 3] },
        { word: 'BEBÊ', hint: '🍼', missing: [1, 2] },
        { word: 'CAMA', hint: '🛏️', missing: [0, 2] },
        { word: 'FOGÃO', hint: '🍳', missing: [1, 3] },
        { word: 'MAÇÃ', hint: '🍎', missing: [0, 2] },
        { word: 'DENTE', hint: '🦷', missing: [0, 3] },
        { word: 'SAPATO', hint: '👟', missing: [1, 4] },
        { word: 'ROUPA', hint: '👕', missing: [0, 2] },
        { word: 'FADA', hint: '🧚‍♀️', missing: [1, 2] },
        { word: 'TERRA', hint: '🌍', missing: [1, 3] }
    ].sort(() => Math.random() - 0.5) 
};
// Dados para Formar Frases
let sentenceData = {
    currentIndex: 0,
    sequence: [],
    sentences: [
        { target: 'O gato subiu na árvore', words: ['O', 'gato', 'subiu', 'na', 'árvore', 'casa', 'bola'] },
        { target: 'A bola é vermelha', words: ['A', 'bola', 'é', 'vermelha', 'gato', 'casa', 'grande'] },
        { target: 'Eu amo minha família', words: ['Eu', 'amo', 'minha', 'família', 'escola', 'brincar', 'feliz'] },
        { target: 'O sol brilha no céu', words: ['O', 'sol', 'brilha', 'no', 'céu', 'água', 'flores'] },
        { target: 'O cachorro corre no parque', words: ['O', 'cachorro', 'corre', 'no', 'parque', 'bola', 'menino'] },
        { target: 'A menina come uma maçã', words: ['A', 'menina', 'come', 'uma', 'maçã', 'livro', 'carro'] },
        { target: 'O peixe nada no rio', words: ['O', 'peixe', 'nada', 'no', 'rio', 'gato', 'flor'] },
        { target: 'A escola é muito grande', words: ['A', 'escola', 'é', 'muito', 'grande', 'pequena', 'verde'] },
        { target: 'O passarinho canta bonito', words: ['O', 'passarinho', 'canta', 'bonito', 'árvore', 'janela', 'menina'] },
        { target: 'Eu gosto de brincar', words: ['Eu', 'gosto', 'de', 'brincar', 'livro', 'azul', 'feliz'] },
        { target: 'O carro está na garagem', words: ['O', 'carro', 'está', 'na', 'garagem', 'porta', 'chão'] },
        { target: 'A flor tem um perfume doce', words: ['A', 'flor', 'tem', 'um', 'perfume', 'doce', 'chuva'] },
        { target: 'O menino lê um livro', words: ['O', 'menino', 'lê', 'um', 'livro', 'sapato', 'amigo'] },
        { target: 'A casa é azul e bonita', words: ['A', 'casa', 'é', 'azul', 'e', 'bonita', 'nuvem'] },
        { target: 'O gato dorme no sofá', words: ['O', 'gato', 'dorme', 'no', 'sofá', 'bola', 'carne'] },
        { target: 'Eu bebo água gelada', words: ['Eu', 'bebo', 'água', 'gelada', 'quente', 'chuva', 'vento'] },
        { target: 'A vaca come capim verde', words: ['A', 'vaca', 'come', 'capim', 'verde', 'branco', 'sol'] },
        { target: 'O menino joga bola', words: ['O', 'menino', 'joga', 'bola', 'livro', 'peixe', 'roupa'] },
        { target: 'A lua brilha à noite', words: ['A', 'lua', 'brilha', 'à', 'noite', 'sol', 'nuvem'] },
        { target: 'O bebê sorri feliz', words: ['O', 'bebê', 'sorri', 'feliz', 'gato', 'livro', 'copo'] }
    ].sort(() => Math.random() - 0.5) 
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
        { word: 'CASA', options: ['BONECA', 'GATO', 'SOL', 'ASA'], correct: 'ASA' },
        { word: 'FLOR', options: ['AMOR', 'GATO', 'BOLA', 'CASA'], correct: 'AMOR' },
        { word: 'BOLA', options: ['COLA', 'GATO', 'FLOR', 'MESA'], correct: 'COLA' },
        { word: 'CORAÇÃO', options: ['LIMÃO', 'GATO', 'CASA', 'BOLA'], correct: 'LIMÃO' },
        { word: 'SAPO', options: ['PAPO', 'CASA', 'FADA', 'LUA'], correct: 'PAPO' },
        { word: 'MÃO', options: ['PÃO', 'CASA', 'BOLA', 'PEIXE'], correct: 'PÃO' },
        { word: 'PEIXE', options: ['DEIXE', 'CASA', 'FLOR', 'BOLA'], correct: 'DEIXE' },
        { word: 'SOL', options: ['GOL', 'CASA', 'FADA', 'LUA'], correct: 'GOL' },
        { word: 'LUA', options: ['RUA', 'CASA', 'PEIXE', 'FLOR'], correct: 'RUA' },
        { word: 'PÉ', options: ['CAFÉ', 'CASA', 'LUA', 'MAR'], correct: 'CAFÉ' },
        { word: 'DENTE', options: ['GENTE', 'CASA', 'FADA', 'SOL'], correct: 'GENTE' },
        { word: 'FADA', options: ['NADA', 'CASA', 'LUA', 'BOLA'], correct: 'NADA' },
        { word: 'COPO', options: ['TOPO', 'CASA', 'FADA', 'PEIXE'], correct: 'TOPO' },
        { word: 'TREM', options: ['BEM', 'CASA', 'PATO', 'FLOR'], correct: 'BEM' },
        { word: 'LEITE', options: ['JEITE', 'CASA', 'BOLA', 'PÉ'], correct: 'JEITE' },
        { word: 'NOITE', options: ['FOICE', 'CASA', 'MAR', 'FLOR'], correct: 'FOICE' },
        { word: 'MAR', options: ['LAR', 'CASA', 'LUA', 'SOL'], correct: 'LAR' },
        { word: 'CHUVA', options: ['LUVA', 'CASA', 'BOLA', 'FADA'], correct: 'LUVA' },
        { word: 'FELIZ', options: ['RAIZ', 'CASA', 'SOL', 'FLOR'], correct: 'RAIZ' }
    ]
};

// Dados para Sílabas
let syllableData = {
    currentIndex: 0,
    sequence: [],
    words: [
        { word: 'SAPO', syllables: ['SA', 'PO'] },
        { word: 'MESA', syllables: ['ME', 'SA'] },
        { word: 'MACACO', syllables: ['MA', 'CA', 'CO'] },
        { word: 'CAVALO', syllables: ['CA', 'VA', 'LO'] },
        { word: 'BEBÊ', syllables: ['BE', 'BÊ'] },
        { word: 'ESCOLA', syllables: ['ES', 'CO', 'LA'] },
        { word: 'CAMISA', syllables: ['CA', 'MI', 'SA'] },
        { word: 'CACHORRO', syllables: ['CA', 'CHOR', 'RO'] },
        { word: 'LEITE', syllables: ['LEI', 'TE'] },
        { word: 'TOMATE', syllables: ['TO', 'MA', 'TE'] },
        { word: 'ABACAXI', syllables: ['A', 'BA', 'CA', 'XI'] },
        { word: 'JANELA', syllables: ['JA', 'NE', 'LA'] },
        { word: 'PEIXE', syllables: ['PEI', 'XE'] },
        { word: 'CASA', syllables: ['CA', 'SA'] },
        { word: 'GATO', syllables: ['GA', 'TO'] },
        { word: 'BOLA', syllables: ['BO', 'LA'] },
        { word: 'PATO', syllables: ['PA', 'TO'] },
        { word: 'BANANA', syllables: ['BA', 'NA', 'NA'] }
    ].sort(() => Math.random() - 0.5) 
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

function toggleMenu() {
    document.getElementById("menuDropdown").classList.toggle("show");
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

    // Restaura o botão
    const actionBtn = document.getElementById('word-action-btn');
    if (actionBtn) {
        actionBtn.textContent = 'Verificar';
        actionBtn.onclick = checkWord;
    }
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
    const actionBtn = document.getElementById('word-action-btn');

    if (userWord === current.word) {
        showFeedback('word-feedback', 'Parabéns! Palavra completada!', true);
        addPoints(10, true);
        playSound('Parabéns! Palavra correta!');
    } else {
        showFeedback('word-feedback', 'Tente novamente!', false);
        addPoints(0, false);
        playSound('Tente novamente');
    }

    if (actionBtn) {
        actionBtn.textContent = 'Próxima Palavra';
        actionBtn.onclick = nextWord;
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
// JOGO 6: CAÇA LETRAS
// =====================================================

function initLetterHunt() {
    letterHuntData.currentLetter = letterHuntData.alphabet[Math.floor(Math.random() * letterHuntData.alphabet.length)];
    document.getElementById('target-letter-display').textContent = `Encontre a letra: ${letterHuntData.currentLetter}`;

    const grid = document.getElementById('alphabet-grid');
    grid.innerHTML = '';

    const gridLetters = [];
    for (let i = 0; i < 23; i++) {
        gridLetters.push(letterHuntData.alphabet[Math.floor(Math.random() * letterHuntData.alphabet.length)]);
    }
    gridLetters.push(letterHuntData.currentLetter);
    gridLetters.sort(() => Math.random() - 0.5);

    gridLetters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'alphabet-letter';
        btn.textContent = letter;
        btn.onclick = () => checkLetterHunt(letter, btn);
        grid.appendChild(btn);
    });

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
// INICIALIZAÇÃO
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Página carregada!");
    
    // Carrega progresso do banco de dados
    setTimeout(() => {
        loadStatsFromDatabase();
    }, 500);

    // Menu hambúrguer (se existir)
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

// Scroll para o topo ao recarregar
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);