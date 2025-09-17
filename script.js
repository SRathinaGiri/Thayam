document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const board = document.getElementById('board');
    const playerTurnDisplay = document.getElementById('player-turn');
    const messageArea = document.getElementById('message-area');
    const dice1Display = document.getElementById('dice1');
    const dice2Display = document.getElementById('dice2');
    const uiPanel = document.getElementById('ui-panel');

    // --- GAME CONFIGURATION ---
    const coinsPerPlayer = 4;
    const pathLength = 48;
    const goalPosition = { r: 3, c: 3 };
    const outerGateIndex = 23;
    const middleGateIndex = 37;
    const safeSteps = [0, 6, 12, 18, 24, 28, 32, 36, 48];

    // Player paths from user diagrams
    const player1Path = [ {r:6,c:3},{r:6,c:4},{r:6,c:5},{r:6,c:6},{r:5,c:6},{r:4,c:6},{r:3,c:6},{r:2,c:6},{r:1,c:6},{r:0,c:6},{r:0,c:5},{r:0,c:4},{r:0,c:3},{r:0,c:2},{r:0,c:1},{r:0,c:0},{r:1,c:0},{r:2,c:0},{r:3,c:0},{r:4,c:0},{r:5,c:0},{r:6,c:0},{r:6,c:1},{r:6,c:2},{r:5,c:1},{r:4,c:1},{r:3,c:1},{r:2,c:1},{r:1,c:1},{r:1,c:2},{r:1,c:3},{r:1,c:4},{r:1,c:5},{r:2,c:5},{r:3,c:5},{r:4,c:5},{r:5,c:5},{r:5,c:4},{r:5,c:3},{r:5,c:2},{r:4,c:2},{r:3,c:2},{r:2,c:2},{r:2,c:3},{r:2,c:4},{r:4,c:4},{r:4,c:4},{r:4,c:3} ];
    const player2Path = [ {r:3,c:6},{r:2,c:6},{r:1,c:6},{r:0,c:6},{r:0,c:5},{r:0,c:4},{r:0,c:3},{r:0,c:2},{r:0,c:1},{r:0,c:0},{r:1,c:0},{r:2,c:0},{r:3,c:0},{r:4,c:0},{r:5,c:0},{r:6,c:0},{r:6,c:1},{r:6,c:2},{r:6,c:3},{r:6,c:4},{r:6,c:5},{r:6,c:6},{r:5,c:6},{r:4,c:6},{r:5,c:5},{r:5,c:4},{r:5,c:3},{r:5,c:2},{r:5,c:1},{r:4,c:1},{r:3,c:1},{r:2,c:1},{r:1,c:1},{r:1,c:2},{r:1,c:3},{r:1,c:4},{r:1,c:5},{r:2,c:5},{r:3,c:5},{r:4,c:5},{r:4,c:4},{r:4,c:3},{r:4,c:2},{r:3,c:2},{r:2,c:2},{r:2,c:3},{r:2,c:4},{r:4,c:4} ];
    const player3Path = [ {r:0,c:3},{r:0,c:2},{r:0,c:1},{r:0,c:0},{r:1,c:0},{r:2,c:0},{r:3,c:0},{r:4,c:0},{r:5,c:0},{r:6,c:0},{r:6,c:1},{r:6,c:2},{r:6,c:3},{r:6,c:4},{r:6,c:5},{r:6,c:6},{r:5,c:6},{r:4,c:6},{r:3,c:6},{r:2,c:6},{r:1,c:6},{r:0,c:6},{r:0,c:5},{r:0,c:4},{r:1,c:5},{r:2,c:5},{r:3,c:5},{r:4,c:5},{r:5,c:5},{r:5,c:4},{r:5,c:3},{r:5,c:2},{r:5,c:1},{r:4,c:1},{r:3,c:1},{r:2,c:1},{r:1,c:1},{r:1,c:2},{r:1,c:3},{r:1,c:4},{r:2,c:4},{r:3,c:4},{r:4,c:4},{r:4,c:3},{r:4,c:2},{r:3,c:2},{r:2,c:2},{r:2,c:3} ];
    const player4Path = [ {r:3,c:0},{r:4,c:0},{r:5,c:0},{r:6,c:0},{r:6,c:1},{r:6,c:2},{r:6,c:3},{r:6,c:4},{r:6,c:5},{r:6,c:6},{r:5,c:6},{r:4,c:6},{r:3,c:6},{r:2,c:6},{r:1,c:6},{r:0,c:6},{r:0,c:5},{r:0,c:4},{r:0,c:3},{r:0,c:2},{r:0,c:1},{r:0,c:0},{r:1,c:0},{r:2,c:0},{r:1,c:1},{r:1,c:2},{r:1,c:3},{r:1,c:4},{r:1,c:5},{r:2,c:5},{r:3,c:5},{r:4,c:5},{r:5,c:5},{r:5,c:4},{r:5,c:3},{r:5,c:2},{r:5,c:1},{r:4,c:1},{r:3,c:1},{r:2,c:1},{r:2,c:2},{r:2,c:3},{r:2,c:4},{r:3,c:4},{r:4,c:4},{r:4,c:3},{r:4,c:2},{r:3,c:2} ];
    const allPaths = [player1Path, player2Path, player3Path, player4Path];

    let players = [];
    let currentPlayerIndex = 0;
    let turnInProgress = false;

    function getDiceSVG(value) {
        const dotPositions = { 0: [], 1: [[50, 50]], 2: [[25, 25], [75, 75]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[25, 25], [25, 75], [75, 25], [75, 75]], 5: [[25, 25], [25, 75], [75, 25], [75, 75], [50, 50]], };
        const dots = dotPositions[value].map(pos => `<circle cx="${pos[0]}" cy="${pos[1]}" r="8" fill="black"/>`).join('');
        return `<svg viewbox="0 0 100 100">${dots}</svg>`;
    }

    function initializeGame() {
        createBoard(); createPlayers(); renderAll(); addEventListeners();
        dice1Display.innerHTML = getDiceSVG(0); dice2Display.innerHTML = getDiceSVG(0);
        setTimeout(handleRollDice, 1000);
    }

    function createBoard() {
        board.innerHTML = '';
        for (let r = 0; r < 7; r++) { for (let c = 0; c < 7; c++) { const cell = document.createElement('div'); cell.className = 'cell'; cell.id = `cell-${r}-${c}`; board.appendChild(cell); }}
        player1Path.slice(0, 48).forEach(pos => document.getElementById(`cell-${pos.r}-${pos.c}`)?.classList.add('path-cell'));
        safeSteps.forEach(step => {
            if(step < pathLength) document.getElementById(`cell-${player1Path[step].r}-${player1Path[step].c}`)?.classList.add('safe-zone');
        });
        document.getElementById(`cell-3-3`).classList.add('safe-zone');
    }

    function createPlayers() {
        const playerSetupData = [ { id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }, { id: 3, name: 'Player 3' }, { id: 4, name: 'Player 4' } ];
        playerSetupData.forEach((setup, index) => {
            players.push({
                id: setup.id, name: setup.name, path: allPaths[index], hasCut: false,
                coins: Array.from({ length: coinsPerPlayer }, (_, j) => ({ id: j, position: -1 })),
            });
        });
    }

    /**
     * Renders all coins.
     * This function now checks if a coin is on a safe space.
     * If so, it assigns a specific corner to each player's color.
     * Otherwise, it centers the coin.
     */
    function renderAll() {
        document.querySelectorAll('.coin').forEach(c => c.remove());
    
        players.forEach(player => {
            player.coins.forEach(coin => {
                const coinEl = document.createElement('div');
                coinEl.className = 'coin';
                coinEl.dataset.player = player.id;
                coinEl.dataset.coin = coin.id;

                if (coin.position === -1) {
                    document.getElementById(`player-${player.id}-home`).appendChild(coinEl);
                } else {
                    let targetCell;
                    let currentPosition = coin.position;
                    
                    if (currentPosition < pathLength) {
                        const pos = player.path[currentPosition];
                        targetCell = document.getElementById(`cell-${pos.r}-${pos.c}`);
                    } else {
                        // Goal is also a safe step
                        const pos = goalPosition;
                        targetCell = document.getElementById(`cell-${pos.r}-${pos.c}`);
                        currentPosition = pathLength; 
                    }
    
                    // --- NEW LOGIC: Check if the coin is on a safe step ---
                    const isSafe = safeSteps.includes(currentPosition);

                    if (isSafe) {
                        // If safe, assign a corner based on the player's ID
                        const cornerPositionClass = `coin-pos-${player.id - 1}`;
                        coinEl.classList.add(cornerPositionClass);
                    } else {
                        // If not safe, center the coin
                        coinEl.classList.add('coin-center');
                    }
                    // --- END NEW LOGIC ---

                    if (targetCell) {
                        targetCell.appendChild(coinEl);
                    }
                }
            });
        });
        updateTurnDisplay();
    }
    
    function handleRollDice() {
        turnInProgress = true;

        const dice1 = Math.floor(Math.random() * 6); const dice2 = Math.floor(Math.random() * 6);
        dice1Display.innerHTML = getDiceSVG(dice1); dice2Display.innerHTML = getDiceSVG(dice2);
        const moveTotal = (dice1 === 0 && dice2 === 0) ? 12 : dice1 + dice2;
        messageArea.textContent = `You rolled a total of ${moveTotal}. Select a coin.`;
        
        const currentPlayer = players[currentPlayerIndex];
        const homeCoins = currentPlayer.coins.filter(c => c.position === -1);
        const activeCoins = currentPlayer.coins.filter(c => c.position >= 0 && c.position < 48);
        let hasMovableCoins = false;
        
        const canEnter = (moveTotal === 1 || moveTotal === 5);
        if (canEnter && homeCoins.length > 0) {
            const playerHomeEl = document.getElementById(`player-${currentPlayer.id}-home`);
            if (playerHomeEl) {
                playerHomeEl.querySelectorAll('.coin').forEach(coinEl => coinEl.classList.add('movable'));
            }
            hasMovableCoins = true;
        }

        activeCoins.forEach(coin => {
            const potentialPosition = coin.position + moveTotal;
            let isMoveValid = true;
            if (potentialPosition < pathLength) {
                const isDestinationSafe = safeSteps.includes(potentialPosition);
                if (!isDestinationSafe && currentPlayer.coins.some(c => c.id !== coin.id && c.position === potentialPosition)) { isMoveValid = false; }
            }
            if (isMoveValid) {
                document.querySelector(`.coin[data-player="${currentPlayer.id}"][data-coin="${coin.id}"]`)?.classList.add('movable');
                hasMovableCoins = true;
            }
        });

        if (!hasMovableCoins) {
            messageArea.textContent = `You rolled ${moveTotal}, but have no valid moves.`;
            setTimeout(() => endTurn(moveTotal, false), 1500);
        } else {
            turnInProgress = false; // Allow clicks now
        }
    }

    function handleCoinClick(e) {
        if (turnInProgress) return;
        if (!e.target.classList.contains('coin') || !e.target.classList.contains('movable')) return;
        
        turnInProgress = true; 
        const playerId = parseInt(e.target.dataset.player);
        const player = players[currentPlayerIndex];
        if (playerId !== player.id) {
            turnInProgress = false; 
            return;
        }
        
        document.querySelectorAll('.coin.movable').forEach(c => c.classList.remove('movable'));
        
        const coinId = parseInt(e.target.dataset.coin); const coin = player.coins[coinId];
        const d1 = Array.from(dice1Display.querySelectorAll('circle')).length;
        const d2 = Array.from(dice2Display.querySelectorAll('circle')).length;
        const moveTotal = (d1 === 0 && d2 === 0) ? 12 : d1 + d2;

        let newPosition;
        if (coin.position === -1) { newPosition = 0; } 
        else { newPosition = coin.position + moveTotal; }
        
        if (coin.position !== -1) {
            if (coin.position <= outerGateIndex && newPosition > outerGateIndex && !player.hasCut) {
                newPosition = outerGateIndex; messageArea.textContent = "Capture an opponent to enter the inner circle!";
            }
            if (coin.position <= middleGateIndex && newPosition > middleGateIndex && !player.hasCut) {
                 newPosition = middleGateIndex; messageArea.textContent = "Capture an opponent to enter the final circle!";
            }
        }
        coin.position = newPosition;
        
        let wasCaptureBonus = false;
        if (coin.position >= pathLength) { messageArea.textContent = "A coin reached the goal!"; } 
        else { wasCaptureBonus = checkForCapture(player, coin); }

        renderAll();
        endTurn(moveTotal, wasCaptureBonus);
    }
    
    function checkForCapture(attackingPlayer, attackingCoin) {
        if (attackingCoin.position >= pathLength) return false;
        const isAttackerSafe = safeSteps.includes(attackingCoin.position);
        if (isAttackerSafe) return false;

        const targetCoord = attackingPlayer.path[attackingCoin.position];
        let captureMade = false;
        
        players.forEach(opponent => {
            if (opponent.id === attackingPlayer.id) return;
            opponent.coins.forEach(opponentCoin => {
                if (opponentCoin.position >= 0 && opponentCoin.position < pathLength) {
                    const opponentCoord = opponent.path[opponentCoin.position];
                    if (opponentCoord.r === targetCoord.r && opponentCoord.c === targetCoord.c) {
                        const isOpponentSafe = safeSteps.includes(opponentCoin.position);
                        if (!isOpponentSafe) { opponentCoin.position = -1; captureMade = true; }
                    }
                }
            });
        });
        if (captureMade) {
            if (!attackingPlayer.hasCut) { attackingPlayer.hasCut = true; messageArea.textContent = `Capture! You can now enter the inner circles.`; } 
            else { messageArea.textContent = `Capture!`; }
        }
        return captureMade;
    }

    function endTurn(lastMove, wasCaptureBonus) {
        const bonusRolls = [1, 5, 6, 12];
        if (bonusRolls.includes(lastMove) || wasCaptureBonus) {
            if (wasCaptureBonus) { messageArea.textContent = "Bonus turn for capturing!"; }
            else { messageArea.textContent = "Bonus turn!"; }
            setTimeout(handleRollDice, 1200);
            return;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateTurnDisplay();
        messageArea.textContent = "Next player's turn...";
        setTimeout(handleRollDice, 1200);
        
        const winner = players.find(p => p.coins.every(c => c.position >= pathLength));
        if (winner) { alert(`Player ${winner.name} wins the game! Congratulations!`); turnInProgress = true; }
    }
    
    function updateTurnDisplay() {
        const currentPlayer = players[currentPlayerIndex];
        let turnText = `${currentPlayer.name}'s Turn`;
        if (currentPlayer.hasCut) { turnText += ' 👑'; }
        playerTurnDisplay.textContent = turnText;
        const uiPanelPositions = { 1: '3 / 2 / 4 / 3', 2: '2 / 3 / 3 / 4', 3: '1 / 2 / 2 / 3', 4: '2 / 1 / 3 / 2' };
        uiPanel.style.gridArea = uiPanelPositions[currentPlayer.id];
    }

    function addEventListeners() {
        document.body.addEventListener('click', handleCoinClick);
    }
    
    initializeGame();
});
