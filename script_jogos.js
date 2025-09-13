// ============================
        //  CONFIGURAÇÕES INICIAIS
        // ============================
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);

        // ============================
        //  VARIÁVEIS GLOBAIS
        // ============================
        let totalScore = 0;
        let totalCorrect = 0;
        let gamesPlayed = 0;
        let currentStreak = 0;
        let selectedMatchingItem = null;

        // Dados dos jogos de animais
        let gameStats = {
            currentAnimalIndex: 0,
            currentSyllableIndex: 0,
            correctAnswers: 0,
            totalAttempts: 0,
            currentWordFormed: ""
        };

        // Dados do Jogo: Adivinhe o Animal
        const animalData = [
            { imagem: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop", correta: "gato", opcoes: ["gato", "cachorro", "pato"] },
            { imagem: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop", correta: "cachorro", opcoes: ["gato", "cachorro", "coelho"] },
            { imagem: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop", correta: "papagaio", opcoes: ["papagaio", "leão", "peixe"] },
            { imagem: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=300&h=300&fit=crop", correta: "pato", opcoes: ["pato", "urso", "gato"] },
            { imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", correta: "coelho", opcoes: ["coelho", "rato", "porco"] }
        ];

        // Dados do Jogo: Monte as Sílabas
        const syllableData = [
            { imagem: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop", silabas: ["ga", "to"], correta: "gato" },
            { imagem: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop", silabas: ["ca", "chor", "ro"], correta: "cachorro" },
            { imagem: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=300&h=300&fit=crop", silabas: ["pa", "to"], correta: "pato" },
            { imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", silabas: ["coe", "lho"], correta: "coelho" },
            { imagem: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop", silabas: ["pa", "pa", "gai", "o"], correta: "papagaio" }
        ];

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
        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        function updateGlobalScore(points) {
            totalScore += points;
            if (points > 0) {
                totalCorrect++;
                currentStreak++;
            } else {
                currentStreak = 0;
            }

            document.getElementById('total-score').textContent = totalScore;
            document.getElementById('total-correct').textContent = totalCorrect;
            document.getElementById('streak').textContent = currentStreak;
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
            gamesPlayed++;
            document.getElementById('games-played').textContent = gamesPlayed;

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

        // ============================
        //  JOGO: ADIVINHE O ANIMAL
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
                updateGlobalScore(10);
                messageEl.textContent = '🎉 Parabéns! Você acertou!';
                messageEl.className = 'game-message success-message';
                buttons.forEach(btn => btn.disabled = true);
            } else {
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
        //  JOGO: MONTE AS SÍLABAS
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
                    updateGlobalScore(10);
                    messageEl.textContent = '🎉 Muito bem! Palavra formada!';
                    messageEl.className = 'game-message success-message';
                    document.querySelectorAll('#syllables-container .syllable-btn').forEach(btn => btn.disabled = true);
                } else {
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
        //  JOGO 1: CAÇA PALAVRAS
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

        function selectGridCell(row, col) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

            if (cell.classList.contains('selected')) {
                selectedCells = selectedCells.filter(c => !(c.row === row && c.col === col));
                cell.classList.remove('selected');
            } else {
                selectedCells.push({ row, col, letter: wordSearchData.grid[row][col] });
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
                    updateGlobalScore(10);
                    showFeedback('search-feedback', `🎉 Você encontrou: ${word}!`, 'success');

                    selectedCells = [];

                    if (wordSearchData.foundWords.length === wordSearchData.words.length) {
                        setTimeout(() => {
                            showFeedback('search-feedback', '🏆 Parabéns! Encontrou todas as palavras!', 'success');
                            updateGlobalScore(20);
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

        function giveHint() {
            const unFoundWords = wordSearchData.words.filter(w => !wordSearchData.foundWords.includes(w));
            if (unFoundWords.length > 0) {
                const hintWord = unFoundWords[0];
                showFeedback('search-feedback', `💡 Procure pela palavra: ${hintWord}`, 'success');
            }
        }

        // ============================
        //  JOGO 2: JOGO DA MEMÓRIA
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
                updateGlobalScore(10);

                if (matchedPairs === 8) {
                    showFeedback('memory-feedback', '🏆 Parabéns! Você encontrou todos os pares!', 'success');
                    updateGlobalScore(30);
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
        //  JOGO 3: ASSOCIAR PALAVRA E EMOJI
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

                    updateGlobalScore(5);
                    showFeedback('matching-feedback', '🎉 Combinação perfeita!', 'success');

                    const allMatched = document.querySelectorAll('.matching-item:not(.matched)').length === 0;
                    if (allMatched) {
                        setTimeout(() => {
                            showFeedback('matching-feedback', '🏆 Parabéns! Você completou todas as associações!', 'success');
                            updateGlobalScore(20);
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