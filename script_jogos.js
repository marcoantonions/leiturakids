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

        // Dados dos jogos
        let wordSearchData = {
            words: ['SOL', 'LUA', 'CÉU', 'MAR'],
            grid: [],
            foundWords: []
        };

        let memoryCards = [];
        let flippedCards = [];
        let matchedPairs = 0;

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

        function playSound(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'pt-BR';
                utterance.rate = 0.7;
                utterance.pitch = 1.2;
                speechSynthesis.speak(utterance);
            }
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
        }

        function showMenu() {
            document.querySelectorAll('.game-container').forEach(container => {
                container.classList.remove('active');
            });
            document.getElementById('games-menu').style.display = 'grid';
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
                    playSound(`Encontrou ${word}!`);
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
                playSound(`Procure pela palavra ${hintWord}`);
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
                playSound('Par encontrado!');

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
                    playSound('Correto!');
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
                    playSound('Tente novamente');
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