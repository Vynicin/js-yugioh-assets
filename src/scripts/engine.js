const state = {
    score: {
        scoreBox: document.getElementById("score_points"),
        playerScore: 0,
        computerScore: 0,
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    bot: document.getElementById("next-duel"),
};

const players = {
    player: "player-cards",
    computer: "computer-cards",
}

class Card  {
    constructor(id,name,type,img,winOf,loseOf)
    {
        this.id = id;
        this.name = name;
        this.type = type;
        this.img = img;
        this.winOf = winOf;
        this.loseOf = loseOf;
    }
}

const imgPath = './src/assets/icons/'

const cardData = [
    new Card(0,'Blue Eyes White Dragon','Paper',`${imgPath}dragon.png`,[1],[2]),
    new Card(1,'Dark Magiccian','Rock',`${imgPath}magician.png`,[2],[0]),
    new Card(2,'Exodia','Scissors',`${imgPath}exodia.png`,[0],[1]),
]

async function playAudio(status) {
    let audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random()*cardData.length)
    return cardData[randomIndex].id;
}

async function drawSelectCard(IdCard) {
    let card = cardData[IdCard]
    state.cardSprites.avatar.src = card.img;
    state.cardSprites.name.innerText = card.name;
    state.cardSprites.type.innerText = 'attribute: ' + card.type;
}

async function removeAllCardsImages() {
    let cards = document.querySelector('#computer-cards');
    let imgelements = cards.querySelectorAll('img');
    imgelements.forEach((img) => img.remove());

    cards = document.querySelector('#player-cards');
    imgelements = cards.querySelectorAll('img');
    imgelements.forEach((img) => img.remove());
}

async function checkDuelResults (playerCardId,computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId]

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = 'YOU WIN';
        await playAudio('win')
        state.score.playerScore++;
    }
    else if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = 'YOU LOSE';
        await playAudio('lose')
        state.score.computerScore++;
    };
    return duelResults;
}

async function updateScore(Result) {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function  drawButton(text) {
    state.bot.innerText = text;
    state.bot.style.display = "block";
}

async function setCardField(id) {
    await removeAllCardsImages();
    
    let computerCardId = await getRandomCardId();
    console.log(computerCardId)

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[id].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(id, computerCardId);

    await updateScore(duelResults);
    await drawButton(duelResults);
}

async function createCardImage(IdCard,fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', `${imgPath}card-back.png`);
    cardImage.setAttribute('data-id',IdCard);
    cardImage.classList.add('card');
    
    if (fieldSide === players.player) {
        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () =>{
            setCardField(cardImage.getAttribute("data-id"));
        });
    };

    return cardImage;
};

async function drawCards(cardNumber, fieldSide) {
    for(let i = 0; i < cardNumber; i++){
        const randomIdCard = await getRandomCardId();

        const cardImage = await createCardImage(randomIdCard,fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel () {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Hover a Card";
    state.cardSprites.type.innerText = "to see the details";

    state.bot.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}


function init (){
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5,players.player);
    drawCards(5,players.computer);

    const bgm = document.getElementById('bgm');
    bgm.volume = 0.3;
    bgm.play();
};
init();