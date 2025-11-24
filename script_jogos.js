// ============================
//  CONFIGURAÇÕES INICIAIS
// ============================
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ============================
//  VARIÁVEIS GLOBAIS E DADOS
// ============================

// Recupera progresso salvo
let savedStats = JSON.parse(localStorage.getItem('gameStats')) || {};

let gameStats = {
    totalScore: savedStats.totalScore || 0,
    totalCorrect: savedStats.totalCorrect || 0,
    gamesPlayed: savedStats.gamesPlayed || 0,
    streak: savedStats.streak || 0,
    currentAnimalIndex: 0,
    currentSyllableIndex: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    currentWordFormed: ""
};

let selectedMatchingItem = null;

// ============================
//  FUNÇÕES DE SINCRONIZAÇÃO COM BANCO DE DADOS
// ============================

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
        console.warn("⚠️ Supabase ainda não está disponível");
        return;
    }

    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        console.warn("⚠️ Nenhum usuário logado");
        return;
    }

    try {
        console.log("💾 Salvando progresso no Supabase...", gameStats);

        const { data, error } = await window.supabaseClient
            .from('progresso')
            .upsert({
                user_id: usuarioId,
                pontos: gameStats.totalScore,
                jogos_concluidos: gameStats.gamesPlayed,
                acertos: gameStats.totalCorrect,
            }, { 
                onConflict: 'user_id',
                returning: 'minimal'
            });

        if (error) {
            console.error("❌ Erro ao salvar progresso:", error);
        } else {
            console.log("✅ Progresso salvo com sucesso no Supabase!");
        }
    } catch (err) {
        console.error("❌ Erro inesperado ao salvar:", err);
    }
}

// Carrega progresso do Supabase
async function loadStatsFromDatabase() {
    if (!window.supabaseClient) {
        console.warn("⚠️ Supabase não disponível, usando dados locais");
        return;
    }

    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) return;

    try {
        const { data, error } = await window.supabaseClient
            .from('progresso')
            .select('pontos, jogos_concluidos, acertos')
            .eq('user_id', usuarioId)
            .maybeSingle();

        if (error) {
            console.error("❌ Erro ao carregar progresso:", error);
            return;
        }

        if (data) {
            console.log("✅ Progresso carregado do banco:", data);
            gameStats.totalScore = data.pontos ?? 0;
            gameStats.gamesPlayed = data.jogos_concluidos ?? 0;
            gameStats.totalCorrect = data.acertos ?? 0;
            updateGlobalStats();
        }
    } catch (err) {
        console.error("❌ Erro ao carregar progresso:", err);
    }
}

// Adiciona pontos e sincroniza
function addPoints(points, correct = true) {
    gameStats.totalScore += points;
    if (correct) {
        gameStats.totalCorrect++;
        gameStats.streak++;
    } else {
        gameStats.streak = 0;
    }

    updateGlobalStats();
    saveStatsToDatabase();
}

// Incrementa jogos jogados
function incrementGamesPlayed() {
    gameStats.gamesPlayed++;
    updateGlobalStats();
    saveStatsToDatabase();
}

// ============================
//  DADOS DOS JOGOS
// ============================

// Dados do Jogo: Adivinhe o Animal
const animalData = shuffle([
    { imagem: "img/gato.png", correta: "gato", opcoes: ["gato", "cachorro", "pato"] },
    { imagem: "img/cachorro.png", correta: "cachorro", opcoes: ["gato", "cachorro", "porco"] },
    { imagem: "img/papagaio2.png", correta: "papagaio", opcoes: ["papagaio", "leão", "peixe"] },
    { imagem: "img/pato.png", correta: "pato", opcoes: ["pato", "urso", "gato"] },
    { imagem: "img/coelho.png", correta: "coelho", opcoes: ["coelho", "rato", "porco"] },
    { imagem: "img/leao.png", correta: "leão", opcoes: ["tigre", "gato", "leão"] },
    { imagem: "img/tigre.png", correta: "tigre", opcoes: ["urso", "tigre", "zebra"] },
    { imagem: "img/elefante.png", correta: "elefante", opcoes: ["hipopótamo", "rinoceronte", "elefante"] },
    { imagem: "img/girafa.png", correta: "girafa", opcoes: ["zebra", "girafa", "leopardo"] },
    { imagem: "img/zebra.png", correta: "zebra", opcoes: ["zebra", "cavalo", "vaca"] },
    { imagem: "img/urso.png", correta: "urso", opcoes: ["tigre", "urso", "lobo"] },
    { imagem: "img/macaco.png", correta: "macaco", opcoes: ["macaco", "coelho", "cavalo"] },
    { imagem: "img/cavalo.png", correta: "cavalo", opcoes: ["vaca", "cavalo", "porco"] },
    { imagem: "img/vaca.png", correta: "vaca", opcoes: ["vaca", "cabra", "ovelha"] },
    { imagem: "img/ovelha.png", correta: "ovelha", opcoes: ["vaca", "cabra", "ovelha"] },
    { imagem: "img/porco.png", correta: "porco", opcoes: ["porco", "vaca", "gato"] },
    { imagem: "img/peixe.png", correta: "peixe", opcoes: ["golfinho", "peixe", "sapo"] },
    { imagem: "img/onca.png", correta: "onça", opcoes: ["cobra", "onça", "tartaruga"] },
    { imagem: "img/arara.png", correta: "arara", opcoes: ["arara", "lagarto", "leopardo"] },
    { imagem: "img/tartaruga2.png", correta: "tartaruga", opcoes: ["sapo", "tartaruga", "peixe"] }
]);


// Dados do Jogo: Monte as Sílabas
const syllableData = shuffle([
    { imagem: "img/gato.png", silabas: ["ga", "to"], correta: "gato" },
    { imagem: "img/cachorro.png", silabas: ["ca", "chor", "ro"], correta: "cachorro" },
    { imagem: "img/papagaio2.png", silabas: ["pa", "pa", "gai", "o"], correta: "papagaio" },
    { imagem: "img/pato.png", silabas: ["pa", "to"], correta: "pato" },
    { imagem: "img/coelho.png", silabas: ["co", "e", "lho"], correta: "coelho" },
    { imagem: "img/leao.png", silabas: ["le", "ão"], correta: "leão" },
    { imagem: "img/tigre.png", silabas: ["ti", "gre"], correta: "tigre" },
    { imagem: "img/elefante.png", silabas: ["e", "le", "fan", "te"], correta: "elefante" },
    { imagem: "img/girafa.png", silabas: ["gi", "ra", "fa"], correta: "girafa" },
    { imagem: "img/zebra.png", silabas: ["ze", "bra"], correta: "zebra" },
    { imagem: "img/urso.png", silabas: ["ur", "so"], correta: "urso" },
    { imagem: "img/macaco.png", silabas: ["ma", "ca", "co"], correta: "macaco" },
    { imagem: "img/cavalo.png", silabas: ["ca", "va", "lo"], correta: "cavalo" },
    { imagem: "img/vaca.png", silabas: ["va", "ca"], correta: "vaca" },
    { imagem: "img/ovelha.png", silabas: ["o", "ve", "lha"], correta: "ovelha" },
    { imagem: "img/porco.png", silabas: ["por", "co"], correta: "porco" },
    { imagem: "img/peixe.png", silabas: ["pei", "xe"], correta: "peixe" },
    { imagem: "img/onca.png", silabas: ["on", "ça"], correta: "onça" },
    { imagem: "img/arara.png", silabas: ["a", "ra", "ra"], correta: "arara" },
    { imagem: "img/tartaruga2.png", silabas: ["tar", "ta", "ru", "ga"], correta: "tartaruga" }
]);


// Dados do jogo 1: Caça Palavras
let wordSearchData = {
    words: ['SOL', 'LUA', 'CÉU', 'MAR'],
    grid: [],
    foundWords: []
};

// Dados do jogo 2: Jogo da Memória
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

// Dados do jogo 3: Associar Palavra e Emoji
const matchingPairs = [
    { word: 'CASA', emoji: '🏠' },
    { word: 'GATO', emoji: '🐱' },
    { word: 'CARRO', emoji: '🚗' },
    { word: 'FLOR', emoji: '🌸' },
    { word: 'SOL', emoji: '☀️' },
    { word: 'ÁGUA', emoji: '💧' }
];

let selectedCells = [];

// ============================
//  FUNÇÕES DE INTERFACE
// ============================

function toggleMenu() {
    document.getElementById("menuDropdown").classList.toggle("show");
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateGlobalScore(points) {
    addPoints(points, points > 0);
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showFeedback(elementId, message, type) {
    const feedback = document.getElementById(elementId);
    feedback.textContent = message;
    feedback.className = `feedback ${type} show`;
    setTimeout(() => feedback.classList.remove('show'), 3000);
}

function showGame(gameId) {
    document.getElementById('games-menu').style.display = 'none';
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(gameId).classList.add('active');

    // Inicializar jogos específicos
    if (gameId === 'animal-quiz') loadAnimalQuestion();
    if (gameId === 'syllable-game') loadSyllableQuestion();
}

function showMenu() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById('games-menu').style.display = 'grid';
}

// Incrementa jogos completados e salva no banco
function incrementGamesPlayed() {
    gameStats.gamesPlayed++;
    updateGlobalStats();
    saveStatsToDatabase();
    showNotification('🎮 Jogo concluído! Parabéns!');
}

// ============================
//  JOGO 1: ADIVINHE O ANIMAL
// ============================
function loadAnimalQuestion() {
    const question = animalData[gameStats.currentAnimalIndex];
    document.getElementById('animal-image').src = question.imagem;
    document.getElementById('game1-message').textContent = '';
    document.getElementById('reset-btn-animal').style.display = 'none';

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    shuffle([...question.opcoes]).forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnimalAnswer(option, question.correta);
        container.appendChild(button);
    });
}

function checkAnimalAnswer(selected, correct) {
    gameStats.totalAttempts++;
    const messageEl = document.getElementById('game1-message');
    const buttons = document.querySelectorAll('#options-container .option-btn');

    if (selected === correct) {
        gameStats.correctAnswers++;
        addPoints(10, true);
        messageEl.textContent = '🎉 Parabéns! Você acertou!';
        messageEl.className = 'game-message success-message';
        buttons.forEach(btn => btn.disabled = true);
        incrementGamesPlayed();
    } else {
        addPoints(0, false);
        messageEl.textContent = '❌ Ops! Tente novamente!';
        messageEl.className = 'game-message error-message';
        buttons.forEach(btn => btn.disabled = true);
        document.getElementById('reset-btn-animal').style.display = 'block';
    }
}

function resetAnimalQuestion() {
    loadAnimalQuestion();
    showNotification('Vamos tentar novamente! 💪');
}

function nextAnimalQuestion() {
    gameStats.currentAnimalIndex = (gameStats.currentAnimalIndex + 1) % animalData.length;
    loadAnimalQuestion();
}

// ============================
//  JOGO 2: MONTE AS SÍLABAS
// ============================
function loadSyllableQuestion() {
    const question = syllableData[gameStats.currentSyllableIndex];
    document.getElementById('syllable-image').src = question.imagem;
    document.getElementById('game2-message').textContent = '';
    document.getElementById('constructed-word').textContent = 'Clique nas sílabas para formar a palavra';
    document.getElementById('reset-btn-syllable').style.display = 'none';
    gameStats.currentWordFormed = '';

    const container = document.getElementById('syllables-container');
    container.innerHTML = '';

    shuffle([...question.silabas]).forEach(syllable => {
        const button = document.createElement('button');
        button.className = 'syllable-btn';
        button.textContent = syllable;
        button.onclick = () => addSyllable(syllable, button);
        container.appendChild(button);
    });
}

function addSyllable(syllable, button) {
    gameStats.currentWordFormed += syllable;
    document.getElementById('constructed-word').textContent = gameStats.currentWordFormed;
    button.disabled = true;

    const question = syllableData[gameStats.currentSyllableIndex];
    const messageEl = document.getElementById('game2-message');

    if (gameStats.currentWordFormed.length >= question.correta.length) {
        gameStats.totalAttempts++;

        if (gameStats.currentWordFormed === question.correta) {
            gameStats.correctAnswers++;
            addPoints(10, true);
            messageEl.textContent = '🎉 Muito bem! Palavra formada!';
            messageEl.className = 'game-message success-message';
            document.querySelectorAll('#syllables-container .syllable-btn').forEach(btn => btn.disabled = true);
            incrementGamesPlayed();
        } else {
            addPoints(0, false);
            messageEl.textContent = '❌ Palavra incorreta! Tente novamente!';
            messageEl.className = 'game-message error-message';
            document.querySelectorAll('#syllables-container .syllable-btn').forEach(btn => btn.disabled = true);
            document.getElementById('reset-btn-syllable').style.display = 'block';
        }
    }
}

function resetSyllableQuestion() {
    gameStats.currentWordFormed = '';
    loadSyllableQuestion();
    showNotification('Vamos tentar novamente! 💪');
}

function nextSyllableQuestion() {
    gameStats.currentSyllableIndex = (gameStats.currentSyllableIndex + 1) % syllableData.length;
    gameStats.currentWordFormed = '';
    loadSyllableQuestion();
}

// ============================
//  JOGO 3: CAÇA PALAVRAS
// ============================
function generateWordSearchGrid() {
    const grid = Array(8).fill().map(() => Array(8).fill(''));
    const words = wordSearchData.words;

    words.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 50) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const row = Math.floor(Math.random() * 8);
            const col = Math.floor(Math.random() * 8);

            if (canPlaceWord(grid, word, row, col, direction)) {
                placeWord(grid, word, row, col, direction);
                placed = true;
            }
            attempts++;
        }
    });

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }

    wordSearchData.grid = grid;
    renderWordSearchGrid();
}

function canPlaceWord(grid, word, row, col, direction) {
    if (direction === 'horizontal') {
        if (col + word.length > 8) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) {
                return false;
            }
        }
    } else {
        if (row + word.length > 8) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) {
                return false;
            }
        }
    }
    return true;
}

function placeWord(grid, word, row, col, direction) {
    if (direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
        }
    }
}

function renderWordSearchGrid() {
    const gridElement = document.getElementById('word-search-grid');
    gridElement.innerHTML = '';

    wordSearchData.grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';
            cellElement.textContent = cell;
            cellElement.dataset.row = i;
            cellElement.dataset.col = j;
            cellElement.onclick = () => selectGridCell(i, j);
            gridElement.appendChild(cellElement);
        });
    });

    const wordsElement = document.getElementById('words-to-find');
    wordsElement.innerHTML = '';
    wordSearchData.words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-to-find';
        wordElement.textContent = word;
        wordElement.id = `word-${word}`;
        wordsElement.appendChild(wordElement);
    });
}

function isValidSelection(cells) {
    if (cells.length < 2) return true;

    const first = cells[0];
    const second = cells[1];
    const rowDiff = second.row - first.row;
    const colDiff = second.col - first.col;

    if (rowDiff !== 0 && colDiff !== 0) {
        return false;
    }

    const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

    for (let i = 1; i < cells.length; i++) {
        const expectedRow = first.row + (rowStep * i);
        const expectedCol = first.col + (colStep * i);

        if (cells[i].row !== expectedRow || cells[i].col !== expectedCol) {
            return false;
        }
    }

    return true;
}

function selectGridCell(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if (cell.classList.contains('selected')) {
        selectedCells = selectedCells.filter(c => !(c.row === row && c.col === col));
        cell.classList.remove('selected');
    } else {
        const newSelectedCells = [...selectedCells, { row, col, letter: wordSearchData.grid[row][col] }];

        if (!isValidSelection(newSelectedCells)) {
            selectedCells.forEach(c => {
                const cellElement = document.querySelector(`[data-row="${c.row}"][data-col="${c.col}"]`);
                cellElement.classList.remove('selected');
            });
            selectedCells = [];
            showFeedback('search-feedback', '⚠️ Selecione as letras em linha reta!', 'error');
            return;
        }

        selectedCells = newSelectedCells;
        cell.classList.add('selected');
        checkForWord();
    }
}

function checkForWord() {
    const selectedWord = selectedCells.map(c => c.letter).join('');
    const reversedWord = selectedCells.map(c => c.letter).reverse().join('');

    wordSearchData.words.forEach(word => {
        if ((selectedWord === word || reversedWord === word) && !wordSearchData.foundWords.includes(word)) {
            wordSearchData.foundWords.push(word);

            selectedCells.forEach(cell => {
                const cellElement = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                cellElement.classList.remove('selected');
                cellElement.classList.add('found');
            });

            document.getElementById(`word-${word}`).classList.add('found');
            addPoints(10, true);
            showFeedback('search-feedback', `🎉 Você encontrou: ${word}!`, 'success');

            selectedCells = [];

            if (wordSearchData.foundWords.length === wordSearchData.words.length) {
                setTimeout(() => {
                    showFeedback('search-feedback', '🏆 Parabéns! Encontrou todas as palavras!', 'success');
                    addPoints(20, true);
                    incrementGamesPlayed();
                }, 1000);
            }
        }
    });
}

function generateNewWordSearch() {
    wordSearchData.foundWords = [];
    selectedCells = [];
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('selected', 'found');
    });
    generateWordSearchGrid();
}

// ============================
//  JOGO 4: JOGO DA MEMÓRIA
// ============================
function initMemoryGame() {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    memoryCards = [...letters, ...letters].sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedPairs = 0;

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    memoryCards.forEach((letter, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.letter = letter;
        card.onclick = () => flipCard(index);

        card.innerHTML = `
            <div class="card-back">❓</div>
            <div class="card-front">${letter}</div>
        `;

        grid.appendChild(card);
    });
}

setTimeout(() => {
    document.querySelectorAll('.memory-card').forEach(card => {
        card.classList.add('flipped');
    });
}, 100);

// 🔥 ESCONDER DEPOIS DE 3s
setTimeout(() => {
    document.querySelectorAll('.memory-card').forEach(card => {
        if (!card.classList.contains('matched')) {
            card.classList.remove('flipped');
        }
    });
}, 3000);

function flipCard(index) {
    const card = document.querySelector(`[data-index="${index}"]`);

    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push({ index, letter: card.dataset.letter, element: card });

    if (flippedCards.length === 2) {
        setTimeout(checkMemoryMatch, 1000);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = flippedCards;

    if (card1.letter === card2.letter) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        addPoints(10, true);

        if (matchedPairs === 8) {
            showFeedback('memory-feedback', '🏆 Parabéns! Você encontrou todos os pares!', 'success');
            addPoints(30, true);
            incrementGamesPlayed();
        }
    } else {
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
    }

    flippedCards = [];
}

function resetMemoryGame() {
    document.querySelectorAll('.memory-card').forEach(card => {
        card.classList.remove('flipped', 'matched');
    });
    initMemoryGame();
}

function showAllCards() {
    document.querySelectorAll('.memory-card').forEach(card => {
        card.classList.add('flipped');
    });

    setTimeout(() => {
        document.querySelectorAll('.memory-card:not(.matched)').forEach(card => {
            card.classList.remove('flipped');
        });
    }, 5000);
}

// ============================
//  JOGO 5: ASSOCIAR PALAVRA E EMOJI
// ============================
function initMatchingGame() {
    const wordsCol = document.getElementById('words-column');
    const emojisCol = document.getElementById('emojis-column');
    wordsCol.innerHTML = '';
    emojisCol.innerHTML = '';

    const shuffledWords = [...matchingPairs].sort(() => Math.random() - 0.5);
    const shuffledEmojis = [...matchingPairs].sort(() => Math.random() - 0.5);

    shuffledWords.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'matching-item';
        btn.textContent = item.word;
        btn.dataset.word = item.word;
        btn.onclick = () => selectMatchingItem(btn, 'word');
        wordsCol.appendChild(btn);
    });

    shuffledEmojis.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'matching-item';
        btn.textContent = item.emoji;
        btn.dataset.word = item.word;
        btn.onclick = () => selectMatchingItem(btn, 'emoji');
        emojisCol.appendChild(btn);
    });
}

function selectMatchingItem(element, type) {
    if (element.classList.contains('matched')) return;

    if (selectedMatchingItem === null) {
        selectedMatchingItem = { element, type, word: element.dataset.word };
        element.classList.add('selected');
    } else {
        if (selectedMatchingItem.word === element.dataset.word && selectedMatchingItem.type !== type) {
            selectedMatchingItem.element.classList.remove('selected');
            selectedMatchingItem.element.classList.add('matched');
            element.classList.add('matched');

            addPoints(5, true);
            showFeedback('matching-feedback', '🎉 Combinação perfeita!', 'success');

            const allMatched = document.querySelectorAll('.matching-item:not(.matched)').length === 0;
            if (allMatched) {
                setTimeout(() => {
                    showFeedback('matching-feedback', '🏆 Parabéns! Você completou todas as associações!', 'success');
                    addPoints(20, true);
                    incrementGamesPlayed();
                }, 1000);
            }
        } else {
            selectedMatchingItem.element.classList.remove('selected');
            showFeedback('matching-feedback', '❌ Essa combinação não está correta. Tente novamente!', 'error');
        }

        selectedMatchingItem = null;
    }
}

function resetMatchingGame() {
    selectedMatchingItem = null;
    initMatchingGame();
}

// ============================
//  MENU RESPONSIVO
// ============================
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Página de Jogos carregada!");
    
    // Aguarda o Supabase estar disponível antes de carregar progresso
    let attempts = 0;
    const maxAttempts = 10;
    
    const waitForSupabase = setInterval(() => {
        attempts++;
        console.log(`⏳ Tentativa ${attempts} de carregar Supabase...`);
        
        if (window.supabaseClient) {
            console.log("✅ Supabase conectado!");
            clearInterval(waitForSupabase);
            loadStatsFromDatabase();
        } else if (attempts >= maxAttempts) {
            console.warn("⚠️ Supabase não disponível após 10 tentativas, usando dados locais");
            clearInterval(waitForSupabase);
        }
    }, 500);

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

// ============================
//  INICIALIZAÇÃO
// ============================
window.onload = function () {
    generateWordSearchGrid();
    initMemoryGame();
    initMatchingGame();
    showNotification('Vamos jogar e aprender! 🎮');
};