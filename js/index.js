let game = { playingCardsNum: 4,
	         cards: ['bull', 'chick', 'cow', 'dog', 'dragon', 'monkey', 
	                 'mouse', 'pig', 'rabbit', 'sheep', 'snake', 'tiger'],
	         playingCards: [],
	         cardQueue: [],
	         openedPairsNum: 0,
	         grid:    null,
	         modal:   null,
	         restart: null,
	         quit:    null,
	       }

	       

function addCardToQueue(card){
    game.cardQueue.push(card);
    queueProcessing();	
};

function emulateClickToFlip(cardNum){
  var evt = new MouseEvent("click", {
    bubbles: false,
    cancelable: true,
    view: window
  });
  let elements = document.getElementsByClassName("flip-container card".concat(cardNum).concat(' face'));
  if (elements[0]) {
      elements[0].dispatchEvent(evt);
  }
};

function hideCard(cardNum){
    let elements = document.getElementsByClassName('card'.concat(cardNum));
    for (element of elements) {
    	element.classList.add('hidden');
    }
};

function hidePaire(card1Num, card2Num){
	hideCard(card1Num);
	hideCard(card2Num);
};

function checkGameOver(){
	return game.openedPairsNum * 2 === game.playingCardsNum;
};

function suggestNewGame(){
    game.modal.style.display = "block"; 
} 

function queueProcessing(){
    while (game.cardQueue.length > 1) {
    	if (game.cardQueue[0] === game.cardQueue[1]) {
    		game.cardQueue.shift();
    	
    	} else if (game.playingCards[game.cardQueue[0]] === game.playingCards[game.cardQueue[1]]) {    		
    		hidePaire(game.cardQueue[0], game.cardQueue[1]);
    		game.cardQueue.shift();
    		game.cardQueue.shift();
    		game.openedPairsNum++;
    		if (checkGameOver()) suggestNewGame();

    	} else {
    		emulateClickToFlip(game.cardQueue[0]);
    		emulateClickToFlip(game.cardQueue[1]);
     		game.cardQueue.shift();
    		game.cardQueue.shift();

    	};
    }
};

function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function handleStart(e){
    this.classList.toggle('face');
}

function initializeCards(){
	game.cards = shuffle(game.cards).slice(0, game.playingCardsNum / 2);
	return shuffle(game.cards.concat(game.cards));              
}

function createCards(grid, cardsInGridNumber){
    for (var i = 0; i < cardsInGridNumber; ++i) {
    	let cardFront = document.createElement('div');
    	cardFront.className = 'front card'.concat(i);
    	cardFront.style.backgroundImage = 'url(images/'.concat(game.playingCards[i]).concat('.png)');

    	let cardBack = document.createElement('div');
    	cardBack.className = 'back card'.concat(i);
    	cardBack.style.backgroundImage = 'url(images/card-back.png)';
    	
    	let flipper = document.createElement('div');
    	flipper.className = 'flipper card'.concat(i);

    	flipper.appendChild(cardFront);
    	flipper.appendChild(cardBack);

    	let cardContainer = document.createElement('div');
    	cardContainer.className = 'flip-container card'.concat(i);
    	cardContainer.addEventListener('click',handleStart,false);
    	//cardContainer.addEventListener('touchstart',handleStart,false);
    	cardContainer.appendChild(flipper);
    	
    	grid.appendChild(cardContainer);
    }
}

function removeCards(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}

function createGrid(grid){
    if (!grid) {
    	grid = document.createElement('div');
        grid.className = 'grid-container';
        grid.addEventListener('click', function(event){
            if (event.target && event.target.className.substr(0,4) === 'back') {
                // Delay to wait for card flipping
                setTimeout(addCardToQueue, 1000, event.target.className.substr(9));
            }
        });
    } else {
    	removeCards(grid);
    }

    createCards(grid, game.playingCardsNum);
    return grid;
}

function createInitialSet(){
	game.playingCards = initializeCards(); //keep globally
	if (!game.grid) { 
	    // first game
		game.grid = createGrid(null, game.playingCardsNum);
	    document.getElementById('playArea').appendChild(game.grid);
	}
}

function initializeGame(grid){
	if (!grid) {
	    game.modal = document.getElementById('finalModal');
	    game.quit  = document.getElementsByClassName("close")[0];
	    game.restart  = document.getElementsByClassName("restart")[0];

	    game.quit.onclick = function() {
            game.modal.style.display = "none";
        }

	    game.restart.onclick = function() {
            game.modal.style.display = "none";
            createInitialSet();
        }
    }
	createInitialSet(grid);
}