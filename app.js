const p1 = {
    score: 0,
    button: document.querySelector('#p1button'),
    display: document.querySelector('#p1display'),
    name: document.querySelector('.p1name'),
    wins: 0
}
const p2 = {
    score: 0,
    button: document.querySelector('#p2button'),
    display: document.querySelector('#p2display'),
    name: document.querySelector('.p2name'),
    wins: 0
}
const maxScore = 100;
const resetButton = document.querySelector('#reset');
const winningScoreSelect = document.querySelector('#playto');
const winBy2 = document.querySelector('#winby2');
const settings = document.querySelector('.dropdown');
const renamePlayer1 = document.querySelector('#renameplayer1');
const renamePlayer2 = document.querySelector('#renameplayer2');
const card = document.querySelector('.card');
const resetStats = document.querySelector('#resetstats');
const timerEnabled = document.querySelector('#istimerenabled');
const timer = document.querySelector('#timer');
const content = document.querySelector('.content');

const statsTable = document.createElement('table');
const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');
const tableFooter = document.createElement('tfoot');
const renamePlayerForm = document.createElement('input');
const timerInput = document.createElement('input');
const timerInputSeconds = document.createElement('input');
const form = document.createElement('form');
const timerSubmit = document.createElement('button');
const errorBlock = document.createElement('div');
const errorMessage = document.createElement('p');
const errorButton = document.createElement('button');
const countdown = document.createElement('div');
const colon = document.createTextNode(' : ');

// initalize document and table
winBy2.checked = false;
timerEnabled.checked = false;
timerSubmit.innerText = 'START';
timerSubmit.classList.add('button', 'is-success', 'is-half');
timerSubmit.style = "margin: 1em 0;"
timerInput.style = "width: 10%; margin-right: .5em;"
timerInputSeconds.style = "width: 10%; margin-left: .5em;"
colon.style = "font-size: 2em; padding: 0 .25em;"
countdown.style = "font-weight: bold; font-size: 2em;"
initializeTable(statsTable);
initializeOptions();
let winningScore = parseInt(winningScoreSelect.value);
let isGameOver = false;
let timerMinuteValue = 0;
let timerSecondsValue = 0;
let intervalId = null;
initializeScoreHeader();
document.body.appendChild(statsTable);

// event listeners
p1.button.addEventListener('click', () => { update(p1, p2); })
p2.button.addEventListener('click', () => { update(p2, p1); })
winningScoreSelect.addEventListener('change', function() {
    winningScore = parseInt(this.value);
    reset();
})
winBy2.addEventListener('change', () => {
    reset();
})
settings.addEventListener('click', (e) => {
    e.stopPropagation();
    settings.classList.toggle('is-active');
    card.classList.toggle('is-padding');
})
resetButton.addEventListener('click', reset);
renamePlayer1.addEventListener('click', (e) => {
    let p1name = prompt('Player 1 Name\ndefault: "Player 1"\nMax Length: 12 characters');
    if (p1name === "") p1name = "Player 1";
    if (p1name.length > 12) {
        while (p1name.length > 12) {
            alert('Name exceeds Max Length');
            p1name = prompt('Player 1 Name\ndefault: "Player 1"\nMax Length: 12 characters')
        }
    }
    p1.name.textContent = p1name;
    p1Header.innerText = p1.name.textContent;
})
renamePlayer2.addEventListener('click', (e) => {
    let p2name = prompt('Player 2 Name\ndefault: "Player 2"\nMax Length: 12 characters');
    if (p2name === "") p1name = "Player 2";
    if (p2name.length > 12) {
        while (p2name.length > 12) {
            alert('Name exceeds Max Length');
            p2name = prompt('Player 2 Name\ndefault: "Player 2"\nMax Length: 12 characters')
        }
    }
    p2.name.textContent = p2name;
    p2Header.innerText = p2.name.textContent;
})
resetStats.addEventListener('click', (e) => {
    tableBody.innerHTML = "";
    tableFooter.innerHTML = "";
    p1.wins=0;
    p2.wins=0;
})
timerEnabled.addEventListener('change', () => {
    reset();
    if (timerEnabled.checked === true) {
        timerInput.type = 'number';
        timerInput.placeholder = 'min.';
        timerInput.classList.add('input', 'is-primary')
        timerInputSeconds.type = 'number';
        timerInputSeconds.placeholder = 'sec.';
        timerInputSeconds.classList.add('input', 'is-primary')
        timer.appendChild(timerInput);
        timer.appendChild(colon);
        timer.appendChild(timerInputSeconds);
        timer.appendChild(timerSubmit);
    }
    else {
        timer.removeChild(timerInput);
        timer.removeChild(timerSubmit);
        timer.removeChild(timerInputSeconds);
        timer.removeChild(colon);
    }
})
timerSubmit.addEventListener('click', () => {
    clearInterval(intervalId);
    countdown.innerText = '';
    timerMinuteValue = parseInt(timerInput.value);
    timerSecondsValue = parseInt(timerInputSeconds.value);
    let message = "The number you entered is not valid. Either minutes or seconds must contain a number greater than zero.  Seconds cannot be greater than 59.";
    if (timerInput.value === "") {
        timerMinuteValue = 0;
    }
    if (timerInputSeconds.value === "") {
        timerSecondsValue = 0;
    }
    if (isNaN(timerMinuteValue) || (timerSecondsValue === 0 && timerMinuteValue === 0)
        || (timerSecondsValue < 0 || timerMinuteValue < 0 || timerSecondsValue > 59))
    {
        errorMessage.innerText = message;
        errorBlock.classList.add('notification', 'is-warning');
        errorBlock.appendChild(errorButton);
        errorButton.classList.add('delete');
        errorBlock.appendChild(errorMessage);
        timer.appendChild(errorBlock);
    }
    else {
        startTimer();
    }
})
errorButton.addEventListener('click', () => {
    errorBlock.parentElement.removeChild(errorBlock);
})

// functions
function initializeScoreHeader(){
    const tableTitle = document.createElement('h1');
    tableTitle.innerText = 'Game Results';
    tableTitle.classList.add('title');
    tableTitle.classList.add('is-1');
    tableTitle.style.color = 'white';
    tableTitle.style.textAlign = 'center';
    tableTitle.style.marginTop = '3rem';
    document.body.appendChild(tableTitle);
}
function update(player, opponent) {
    if (!isGameOver) {
        player.score += 1;
        if ((player.score === winningScore && winBy2.checked === false)
        || ((player.score >= winningScore && winBy2.checked === true) && (player.score - opponent.score >= 2))) {
            isGameOver = true;
            gameFinish(player, opponent);
        }
        player.display.textContent = player.score; 
    }     
}

function initializeTable(table) {
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    table.appendChild(tableFooter);

    headerRow = document.createElement('tr');

    p1Header = document.createElement('th');
    p1Header.classList.add('player1header');
    p1Header.innerText = p1.name.textContent;

    p2Header = document.createElement('th');
    p2Header.classList.add('player2header');
    p2Header.innerText = p2.name.textContent;

    headerRow.appendChild(p1Header);
    headerRow.appendChild(p2Header);
    tableHead.appendChild(headerRow);
}

function startTimer() {
    content.replaceChild(countdown, timer);
    runTimer();
}

function gameFinish(player, opponent){
    if (player.score === opponent.score) {
        player.display.classList.add('has-text-warning');
        opponent.display.classList.add('has-text-warning');
        player.button.disabled = true;
        opponent.button.disabled = true;
        recordStats(player, opponent);
    }
    else {
        player.display.classList.add('has-text-success');
        opponent.display.classList.add('has-text-danger');
        player.button.disabled = true;
        opponent.button.disabled = true;
        recordStats(player, opponent);
    }
}

function runTimer() {
    const startingMinutes = timerMinuteValue;
    const startingSeconds = timerSecondsValue;
    let time = startingMinutes * 60 + startingSeconds;
    window.clearInterval(intervalId);
    intervalId = window.setInterval(updateCountdown, 1000);

    function updateCountdown() {
        if (time < 0) {
            window.clearInterval(intervalId);
            let playerTimer, opponentTimer;
            if (p1.score > p2.score) {
                playerTimer = p1;
                opponentTimer = p2;
            }
            else {
                playerTimer = p2;
                opponentTimer = p1;
            }
            gameFinish(playerTimer, opponentTimer);
        }
        else if (isGameOver === true || !content.contains(countdown)) {
            window.clearInterval(intervalId);
            countdown.innerHTML = '';
        }
        else {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            if (minutes === 0 && seconds < 11)
                countdown.classList.add('has-text-danger');
            else {
                if (countdown.classList.contains('has-text-danger')) {
                    countdown.classList.remove('has-text-danger');
                }
            }
            countdown.innerText = `${minutes < 10 ? `0${minutes}` : minutes} : ${seconds < 10 ? `0${seconds}` : seconds}`;
            time--;
        }
    }
}
function recordStats(player, opponent) {
    const scoresRow = document.createElement('tr');
    const p1Data = document.createElement('td');
    const p2Data = document.createElement('td');

    if (player === p1) {
        p1Data.innerText = player.score;
        p1Data.classList.add('has-text-success');
        p2Data.innerText = opponent.score;
        p2Data.classList.add('has-text-danger');
        p1.wins++;
    }
    else if (player.score === opponent.score) {
        p1Data.innerText = player.score;
        p1Data.classList.add('has-text-warning');
        p2Data.innerText = opponent.score;
        p2Data.classList.add('has-text-warning');
    }
    else {
        p1Data.innerText = opponent.score;
        p1Data.classList.add('has-text-danger');
        p2Data.innerText = player.score;
        p2Data.classList.add('has-text-success');
        p2.wins++;
    }

    scoresRow.appendChild(p1Data);
    scoresRow.appendChild(p2Data);
    tableBody.appendChild(scoresRow);

    updateTotals();
}

function updateTotals() {
    const p1Total = document.createElement('td');
    const p2Total = document.createElement('td');
    const totalRow = document.createElement('tr');
    p1Total.innerText = `Wins: ${p1.wins}`;
    p2Total.innerText = `Wins: ${p2.wins}`;
    tableFooter.innerHTML = "";
    totalRow.appendChild(p1Total);
    totalRow.appendChild(p2Total);
    tableFooter.appendChild(totalRow);
}

function initializeOptions() {
    for (let i = 1; i <= maxScore; i++){
        const option = document.createElement('option');
        option.value = i;
        option.innerText = i;
        winningScoreSelect.appendChild(option);
    }
}

function reset() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        if (content.contains(countdown)){
            content.replaceChild(timer, countdown);
        }
    }
    isGameOver = false;
    for (let p of [p1, p2]) {
        p.score = 0;
        p.display.textContent = 0;
        p.display.classList.remove('has-text-success', 'has-text-danger', 'has-text-warning');
        p.button.disabled = false;
    }

}
