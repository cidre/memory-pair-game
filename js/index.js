let game = { playingCardsNum: 16,
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

function handleClick(){
    this.classList.toggle('face');
}

function initializeCards(){
	//for a change not all of the cards take place in one game
	let cards = shuffle(game.cards).slice(0, game.playingCardsNum / 2);
	//return shuffle(game.cards.concat(game.cards)); 
	return shuffle([...cards, ...cards]);             
}

function createCards(grid){
    for (var i = 0; i < game.playingCardsNum; ++i) {
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
    	cardContainer.addEventListener('click',handleClick,false);
    	cardContainer.appendChild(flipper);
    	
    	grid.appendChild(cardContainer);
    }
}

function resetCards(){
    removeChildElem(game.grid);
    createCards(game.grid);
}

function removeChildElem(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function createGrid(){
	let grid = document.createElement('div');
    grid.className = 'grid-container';
    grid.addEventListener('click', function(event){
        if (event.target && event.target.className.substr(0,4) === 'back') {
            // Delay to wait for card flipping
            setTimeout(addCardToQueue, 1000, event.target.className.substr(9));
        }
    });

    createCards(grid);
    return grid;
}

function dealTheCards(){
	game.playingCards = initializeCards(); 
	if (!game.grid) { 
	    // first game
		game.grid = createGrid();
	    document.getElementById('playArea').appendChild(game.grid);
	} else {
		// game restart
	    game.openedPairsNum = 0;
		resetCards();
	}
}

function initializeModal(){
    game.modal = document.getElementById('finalModal');
    game.quit  = document.getElementsByClassName("close")[0];
    game.restart  = document.getElementsByClassName("restart")[0];

    game.quit.onclick = function() {
        game.modal.style.display = "none";
    }

    game.restart.onclick = function() {
        game.modal.style.display = "none";
        dealTheCards();
    }
}

function initializeGame(){
	if (!game.grid) {
		initializeModal()
    }
	dealTheCards();
}