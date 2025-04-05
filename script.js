document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matches = 0;
    let timeLeft = 60;
    let score = 0;
    let highScore = localStorage.getItem('memoryHighScore') || 0;
    let timer;
    let gameActive = false;
    
    const icons = [
        'fa-heart', 'fa-star', 'fa-bolt', 'fa-cloud', 
        'fa-moon', 'fa-sun', 'fa-leaf', 'fa-bell'
    ];
    
    // Set high score display
    highScoreDisplay.textContent = highScore;
    
    // Start game
    startBtn.addEventListener('click', startGame);
    
    // Reset game
    resetBtn.addEventListener('click', resetGame);
    
    function startGame() {
        if (gameActive) return;
        
        gameActive = true;
        timeLeft = 60;
        score = 0;
        matches = 0;
        
        timeDisplay.textContent = timeLeft;
        scoreDisplay.textContent = score;
        
        startBtn.disabled = true;
        
        createBoard();
        startTimer();
    }
    
    function resetGame() {
        clearInterval(timer);
        gameActive = false;
        gameBoard.innerHTML = '';
        timeDisplay.textContent = '60';
        scoreDisplay.textContent = '0';
        startBtn.disabled = false;
    }
    
    function createBoard() {
        gameBoard.innerHTML = '';
        cards = [];
        
        // Duplicate icons to create pairs
        const cardIcons = [...icons, ...icons];
        
        // Shuffle cards
        cardIcons.sort(() => 0.5 - Math.random());
        
        // Create cards
        cardIcons.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.icon = icon;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="front">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="back">
                    <i class="fas fa-question"></i>
                </div>
            `;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }
    
    function flipCard() {
        if (lockBoard || !gameActive) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        checkForMatch();
    }
    
    function checkForMatch() {
        const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
        
        if (isMatch) {
            disableCards();
            matches++;
            score += 10;
            scoreDisplay.textContent = score;
            
            // Check if all cards matched
            if (matches === icons.length) {
                endGame(true);
            }
        } else {
            unflipCards();
            score = Math.max(0, score - 2);
            scoreDisplay.textContent = score;
        }
    }
    
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame(false);
            }
        }, 1000);
    }
    
    function endGame(isWin) {
        clearInterval(timer);
        gameActive = false;
        lockBoard = true;
        
        // Update high score
        if (isWin && score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('memoryHighScore', highScore);
        }
        
        // Show message
        const message = isWin 
            ? `Selamat! Anda menang dengan skor ${score}!` 
            : `Waktu habis! Skor akhir Anda: ${score}`;
        
        setTimeout(() => {
            alert(message);
            startBtn.disabled = false;
        }, 500);
    }
});