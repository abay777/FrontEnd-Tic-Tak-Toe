let scores = JSON.parse(localStorage.getItem('scores')) ||
[{x:0,
  o:0}]
  newGame()
  scorebord()
  renderscore()

const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];



const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winnningMessageElement = document.getElementById('winningMessage');
const winningTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn;
startgame()

function startgame() {
  circleTurn = false;
  winnningMessageElement.classList.remove(
    'show'
  );
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS)
  })
  cellElements.forEach(cell => {
    cell.removeEventListener('click', handleclick);
    cell.addEventListener('click', handleclick, { once: true })
  })
  setboardHovering(circleTurn);
}


function handleclick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placemark(currentClass, cell);

  if (checkwin(currentClass)) {
    renderWinningMessage(currentClass);
    restartButton();
    scorebord(currentClass);
  } else if (isDraw()) {
    renderWinningMessage('draw');
    restartButton();
  } else {
    swaplayer()
    setboardHovering(circleTurn);
  }

}

function placemark(currentClass, cell) {
  cell.classList.add(currentClass);
}

function swaplayer() {
  circleTurn = !circleTurn
}

function setboardHovering(circleTurn) {
  board.classList.remove(CIRCLE_CLASS);
  board.classList.remove(X_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

function checkwin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })

}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) ||
      cell.classList.contains(CIRCLE_CLASS);
  })
}

function renderWinningMessage(currentClass) {
  winnningMessageElement.classList.add('show');
  if (currentClass === 'circle') {
    winningTextElement.innerHTML = `O Wins!`;
  } else if (currentClass === 'draw') {
    winningTextElement.innerHTML = `It's a Draw `;
  } else {
    winningTextElement.innerHTML = `X Wins!`;
  }
}

function restartButton() {
  const reButton = document.getElementById(
    'restartButton'
  );
  reButton.addEventListener('click', () => {
    startgame()
    scorebord()
    renderscore()
  })
}

function scorebord(winner){
  if(winner){
    scores.forEach(score => {
      if(winner ==='x'){
        score.x +=1;
      }else{
        score.o +=1;
      }
    })
    localStorage.setItem('scores',JSON.stringify(scores));
    }  
}

function renderscore(){
  let x,o;
  scores.forEach(score =>{
     o = score.o;
     x = score.x;
  })
  document.getElementById('xScore').innerHTML=x;
  document.getElementById('oScore').innerHTML=o;
}

function newGame(){
  document.getElementById('newGame')
  .addEventListener('click',() => {
    localStorage.clear();  
    location.reload()
  
  })
  
}

let intervalId ;
function autoPlay() {
  const delayBetweenMoves = 1000; // Adjust the delay between moves in milliseconds

  function simulateMove() {
    const emptyCells = [...cellElements]
    .filter(cell => !cell.classList.contains(X_CLASS) && 
    !cell.classList.contains(CIRCLE_CLASS));
    
    if (emptyCells.length === 0) {
      return; // No empty cells left
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placemark(currentClass, randomCell);

    if (checkwin(currentClass)) {
      renderWinningMessage(currentClass);
      restartButton();
      scorebord(currentClass);
    } else if (isDraw()) {
      renderWinningMessage('draw');
      restartButton();
    } else {
      swaplayer();
      setboardHovering(circleTurn);
    }
  }
 
  clearInterval(intervalId);

 intervalId = setInterval(simulateMove, delayBetweenMoves)

  
}

let toggle = false; // Initialize toggle as false

function toggleAutoplay() {
  const autoButton = document.getElementById('Autoplay');

  if (toggle) {
    autoButton.innerHTML = 'AutoPlay';
    document.removeEventListener('click', autoPlay);
    clearInterval(intervalId)

  } else {
    autoButton.innerHTML = 'Stop AutoPlay';
    document.addEventListener('click', autoPlay);

  }

  toggle = !toggle;
}

const autoButton = document.getElementById('Autoplay');
autoButton.addEventListener('click', toggleAutoplay);

