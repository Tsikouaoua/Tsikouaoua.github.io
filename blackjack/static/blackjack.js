//BlackJack

let blackjackGame = {
    'you':{'scorespan': '#your-blackjack-result', 'div': '#your-box', 'score': 0, 'aceCounter': 0, 'aceIs1': false, },
    'dealer':{'scorespan': '#Dealer-blackjack-result', 'div': '#dealer-box', 'score': 0, 'aceCounter': 0, 'aceIs1': false, },
    'cards': ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsmap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,'9': 9,'10': 10, 'J': 10,'Q': 10, 'K': 10, 'A': [1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'isHit': false,
    'stopStand': false,
    'turnsOver': false,
    'dealersTurn': false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];



const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const loseSound = new Audio('static/sounds/aww.mp3');



document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-Stand-button').addEventListener('click', blackjackStand);

document.querySelector('#blackjack-Deal-button').addEventListener('click', blackjackDeal);


function blackjackHit() {
    if (blackjackGame['isStand'] === false && blackjackGame['isHit'] === false) {
        blackjackGame['dealersTurn'] = true;
        let card = randomCard();
        showCard(card,YOU);
        uptadeScore(card,YOU);
        showScore(YOU);

        if (YOU['score'] === 21) {blackjackGame['isHit'] = true;}

        if (YOU['score'] > 21) {
            blackjackGame['turnsOver'] = true;
            blackjackGame['isStand'] = true;
            showResult(computeWinner());    
        }
    }    
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blackjackStand() {
    if (blackjackGame['isStand'] === false && blackjackGame['dealersTurn'] === true) {
        blackjackGame['isStand'] = true;
        while (blackjackGame['stopStand'] === false) {
            let card = randomCard();
            showCard(card,DEALER);
            uptadeScore(card,DEALER);
            showScore(DEALER);
            await sleep(800);

            if (DEALER['score'] >= 17) {
                blackjackGame['turnsOver'] = true;
                blackjackGame['stopStand'] = true;
                showResult(computeWinner());
            }
        }
    }        
}



function randomCard() {
    let randomIndex = Math.floor(Math.random()*blackjackGame['cards'].length); 
    return blackjackGame['cards'][randomIndex];
}


function showCard(card, activePlayer) {
    if (activePlayer['score'] < 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage); //continious further from the "flex-blackjack-row-1"
        hitSound.play();  //shorter time
    }
}


function uptadeScore(card, activePlayer) {
    if (card == 'A') {
        activePlayer['aceCounter']++; 
        //if adding 11 keeps me below 21
        if (activePlayer['score'] + blackjackGame['cardsmap'][card][1] <= 21 || activePlayer['aceCounter'] >= 2) {
            activePlayer['score'] += blackjackGame['cardsmap'][card][1]; 
        } else {
            activePlayer['aceIs1'] = true;
            activePlayer['score'] += blackjackGame['cardsmap'][card][0]; 
        }
    } else if (activePlayer['score'] <21 && card != 'A' ) {
        activePlayer['score'] += blackjackGame['cardsmap'][card]; 
    }
    if (activePlayer['aceCounter'] === 1 && activePlayer['score'] > 21 && activePlayer['aceIs1'] === false) {
        activePlayer['score'] -= 10;
        activePlayer['aceIs1'] = true;
    }
}


function showScore(activePlayer){
    if (activePlayer['score'] < 21) {
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    } else if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scorespan']).textContent = 'BUSTED';
        document.querySelector(activePlayer['scorespan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scorespan']).textContent = 'BLACKJACK';
    }   

}



function showResult(winner) {
    let message, messageColor;
    if (winner === YOU) {
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = 'You win!';
        messageColor = 'green';
        winSound.play();
    } else if (winner === DEALER) {
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        message = 'You lose!';
        messageColor = 'red';
        loseSound.play();

    } else {
        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = 'Draw!';
        messageColor = 'black';
    }    

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
}


function computeWinner() {
    let winner;

    if (YOU['score'] <=21) {
    //condition higher score than the dealer or dealer goes bust
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU;
            blackjackGame['wins']++;
        } else if (YOU['score'] < DEALER['score']) {
            winner = DEALER;
            blackjackGame['losses']++;
        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }
    } else {
        blackjackGame['losses']++;
        winner = DEALER;
    }
    console.log(winner);
    return winner;   
}





function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        blackjackGame['isHit'] = blackjackGame['isStand'] = blackjackGame['stopStand'] = blackjackGame['turnsOver'] =blackjackGame['dealersTurn'] = YOU['aceIs1'] = DEALER['aceFlag'] = false;
        YOU['aceCounter'] = DEALER['aceCounter'] = 0;
        let yourImages = document.querySelector(YOU['div']).querySelectorAll('img');
        for (let i = 0; i < yourImages.length; i++){
            yourImages[i].remove();
        }
        document.querySelector(YOU['scorespan']).textContent = 0;
        YOU['score'] = 0;
        document.querySelector(YOU['scorespan']).style.color = '#ffffff'


        //same for dealer
        let DealerImages = document.querySelector(DEALER['div']).querySelectorAll('img'); 
        for (let i = 0; i < DealerImages.length; i++){
            DealerImages[i].remove();
        }
        document.querySelector(DEALER['scorespan']).textContent = 0;
        DEALER['score'] = 0;
        document.querySelector(DEALER['scorespan']).style.color = '#ffffff';


        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color ='black';
    }    
}







