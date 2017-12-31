let game = { rowsNum: 4,
	         columnsNum: 4,
	         cards: ['bull', 'chick', 'cow', 'dog', 'dragon', 'monkey', 
	                 'mouse', 'pig', 'rabbit', 'sheep', 'snake', 'tiger'],
	         playingCards: [],
	         cardQueue: [],
	         openedPairsNum: 0
	       }

function addCardToQueue(card){
    game.cardQueue.push(card);	
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
	return game.openedPairsNum * 2 === game.rowsNum * game.columnsNum;
};

function suggestNewGame(){

} 

function considerQueue(){
    console.log('considerQueue length before:', game.cardQueue.length);
    while (game.cardQueue.length > 1) {
    	if (game.cardQueue[0] === game.cardQueue[1]) {
    	
    		game.cardQueue.shift();
    	
    	} else if (game.playingCards[game.cardQueue[0]] === game.playingCards[game.cardQueue[1]]) {    		
    		
    		console.log('Пара ',game.playingCards[game.cardQueue[0]],' detected!');
    		hidePaire(game.cardQueue[0], game.cardQueue[1]);
    		game.cardQueue.shift();
    		game.cardQueue.shift();
    		game.openedPairsNum++;
    		if (checkGameOver()) suggestNewGame();

    	} else {
    		//setTimeout(emulateClickToFlip(game.cardQueue[0]), 800);
    		//setTimeout(emulateClickToFlip(game.cardQueue[1]), 800);
    		emulateClickToFlip(game.cardQueue[0]);
    		emulateClickToFlip(game.cardQueue[1]);
     		game.cardQueue.shift();
    		game.cardQueue.shift();
    	};
    }
    console.log('considerQueue length after:',game.cardQueue.length);
};

function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function handleStart(e){
//	console.log(this.classList);
//    this.classList.toggle('hover');
    this.classList.toggle('face');
  //  return true;
}

function initializeCards(){
	game.cards = shuffle(game.cards).slice(0, 8);
	return shuffle(game.cards.concat(game.cards));              
}

function createGrid(grid, rows, columns){

	//animals.sort(function() { return 0.5 - Math.random() });               

    if (!grid) grid = document.createElement('div');
    grid.className = 'grid-container';
    grid.addEventListener('click', function(event){
        if (event.target && event.target.className.substr(0,4) === 'back') {
            // Event triggered
            //console.log(event.target.className);
            //setTimeout(addCardToQueue(event.target.className.substr(9)), 500);
            addCardToQueue(event.target.className.substr(9));
            //considerQueue();
            setTimeout(considerQueue, 1500);
        }
        //console.log(event.path[1].className);
    });
    for (var i = 0; i < rows * columns; ++i) {
    	//let cardImg = document.createElement('img');
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
    return grid;
}

function createInitialSet(){
	game.playingCards = initializeCards(); //keep globally
	document.getElementById('playArea')
        .appendChild(createGrid(null, game.rowsNum, game.columnsNum));
}