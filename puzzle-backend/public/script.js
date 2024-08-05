document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle');
    const size = 4;
    let pieces = [];

    function init() {
        pieces = [...Array(size * size).keys()];
        render();
    }

    function render() {
        puzzleContainer.innerHTML = '';
        pieces.forEach((piece, index) => {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('piece');
            if (piece === 0) {
                pieceElement.classList.add('empty');
            } else {
                pieceElement.textContent = piece;
            }
            pieceElement.addEventListener('click', () => movePiece(index));
            puzzleContainer.appendChild(pieceElement);
        });
    }

    function movePiece(index) {
        const emptyIndex = pieces.indexOf(0);
        const validMoves = [
            emptyIndex - 1,
            emptyIndex + 1,
            emptyIndex - size,
            emptyIndex + size
        ];

        if (validMoves.includes(index)) {
            [pieces[emptyIndex], pieces[index]] = [pieces[index], pieces[emptyIndex]];
            render();
            if (checkWin()) {
                setTimeout(() => {
                    const name = prompt('Felicitări! Ai câștigat! Introdu numele tău:');
                    if (name) {
                        const score = calculateScore(); // Implementați funcția pentru a calcula scorul
                        submitScore(name, score);
                    }
                }, 100);
            }
        }
    }

    function checkWin() {
        for (let i = 0; i < pieces.length - 1; i++) {
            if (pieces[i] !== i + 1) {
                return false;
            }
        }
        return true;
    }

    function shuffle() {
        do {
            for (let i = pieces.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
            }
        } while (checkWin());
        render();
    }

    function calculateScore() {
        // Implementați o funcție pentru a calcula scorul, dacă doriți.
        // De exemplu, puteți returna numărul de mișcări.
        return 100; // Exemplu de scor. Modificați după cum este necesar.
    }

    function submitScore(name, score) {
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, score })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score saved:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Initialize the puzzle on page load
    init();

    // Attach the shuffle function to the window object so it can be called from the button
    window.shuffle = shuffle;
});
