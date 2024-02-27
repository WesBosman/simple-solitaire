/**
 * An enum for Suits
 * @readonly
 * @enum {number}
 */
const suitNumber = {
  spade: 0,
  heart: 1,
  club: 2,
  diamond: 3,
};

/**
 * An enum for names of suits
 * @readonly
 * @enum {string}
 */
const suitName = {
  spade: 'spade',
  heart: 'heart',
  club: 'club',
  diamond: 'diamond',
};

/**
 * An enum for SuitString
 * @readonly
 * @enum {string}
 */
const suitString = {
  spade: '\u2660',
  heart: '\u2665',
  club: '\u2663',
  diamond: '\u2666',
};

/**
 * An enum for SuitColor
 * @readonly
 * @enum {string}
 */
const suitColor = {
  red: 'red',
  black: 'black',
};

/**
 * An enum for CardNumber
 * @readonly
 * @enum {number}
 */
const cardNumber = {
  ace: 0,
  two: 1,
  three: 2,
  four: 3,
  five: 4,
  six: 5,
  seven: 6,
  eight: 7,
  nine: 8,
  ten: 9,
  jack: 10,
  queen: 11,
  king: 12,
};

/**
 * An enum for CardString
 * @readonly
 * @enum {string}
 */
const cardString = {
  ace: 'A',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  jack: 'J',
  queen: 'Q',
  king: 'K',
};

/**
 * @type Card
 * @property {string} id
 * @property {boolean} isFlipped
 * @property {SuitNumber} suitNumber
 * @property {SuitString} suitString
 * @property {SuitColor} suitColor
 * @property {CardNumber} cardNumber
 * @property {CardString} cardString
 * @property {string} displayString
 * @property {number} column
 * @property {number} row
 * @property {boolean} isLastCardInColumn
 */
const card = {
  isFlipped: false,
};

/**
 * @type {Card[]}
 */
let allCards = [];

/**
 * @type {Card[]}
 */
let deck = [];

/**
 * @type {Card[]}
 */
let flippedDeck = [];

/**
 * Keep track of cards in the top right completed section
 * @property {Card[]} spade
 * @property {Card[]} heart
 * @property {Card[]} club
 * @property {Card[]} diamond
 */
let completedCards = {
  spade: [],
  heart: [],
  club: [],
  diamond: [],
};

/**
 * Shuffle a deck of cards
 * @param {Card[]} array
 */
const shuffleDeck = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * Create a deck of cards
 * @returns {Card[]}
 */
const makeDeck = () => {
  /**
   * @type {Card[]}
   */
  let newDeck = [];
  for (const [s, suitNum] of Object.entries(suitNumber)) {
    for (const c in cardNumber) {
      const cardNum = cardNumber[c];
      const isRed =
        suitNum === suitNumber.heart || suitNum === suitNumber.diamond;
      const color = isRed ? suitColor.red : suitColor.black;
      const suitStr = suitString[s];
      const cardStr = cardString[c];
      const card = {
        id: `card-c${cardNum}s${suitNum}`,
        isFlipped: false,
        suitName: s,
        suitNumber: suitNum,
        suitString: suitStr,
        suitColor: color,
        cardNumber: cardNum,
        cardString: cardStr,
        displayString: `${cardStr}${suitStr}`,
      };
      newDeck.push(card);
      allCards.push(card);
    }
  }
  return newDeck;
};

/**
 * Create a column of cards to start with
 * @param {Card[]} deck
 * @param {number} number
 * @returns {Card[]}
 */
const makeColumn = (deck, number) => {
  let cards = [];

  for (let i = 0; i < number; i++) {
    let card = deck.pop();
    card.column = number;
    card.row = i;

    if (card && i + 1 === number) {
      card.isFlipped = true;
      card.isLastCardInColumn = true;
    }

    cards.push(card);
  }

  return cards;
};

// Create a new deck of cards
let d = makeDeck();

shuffleDeck(d);

// Create all the columns
let columnOne = makeColumn(d, 1);
let columnTwo = makeColumn(d, 2);
let columnThree = makeColumn(d, 3);
let columnFour = makeColumn(d, 4);
let columnFive = makeColumn(d, 5);
let columnSix = makeColumn(d, 6);
let columnSeven = makeColumn(d, 7);

let movedCardFromDeck = false;
let validCardMove = false;

/**
 * Draw a card from the deck.
 * Take a card from the deck pile and put it in the flipped deck.
 * @returns {Card | null}
 */
const drawCard = () => {
  if (d.length === 0) {
    return null;
  }
  const card = d.pop();
  card.isFlipped = true;
  flippedDeck.unshift(card);
  return card;
};

const deckSection = document.getElementById('deck');
const flippedDeckSection = document.getElementById('flipped-deck');
const columnOneSection = document.getElementById('column-one');
const columnTwoSection = document.getElementById('column-two');
const columnThreeSection = document.getElementById('column-three');
const columnFourSection = document.getElementById('column-four');
const columnFiveSection = document.getElementById('column-five');
const columnSixSection = document.getElementById('column-six');
const columnSevenSection = document.getElementById('column-seven');
const completedHeartsSection = document.getElementById('completed-hearts');
const completedSpadesSection = document.getElementById('completed-spades');
const completedClubsSection = document.getElementById('completed-clubs');
const completedDiamondsSection = document.getElementById('completed-diamonds');

completedHeartsSection.innerHTML = suitString.heart;
completedSpadesSection.innerHTML = suitString.spade;
completedClubsSection.innerHTML = suitString.club;
completedDiamondsSection.innerHTML = suitString.diamond;

completedHeartsSection.style.color = suitColor.red;
completedSpadesSection.style.color = suitColor.black;
completedClubsSection.style.color = suitColor.black;
completedDiamondsSection.style.color = suitColor.red;

/**
 * Take an array of cards and create a string of html
 * @param {Card[]} cards
 * @returns {string}
 */
const createCards = (cards) => {
  let html = '';
  cards.forEach((card, index) => {
    const isLastCard = index === cards.length - 1;
    const isFlipped = card.isFlipped ? 'flipped' : '';
    const onFlipCard =
      card.isFlipped === false ? 'onclick=onFlipCard(event)' : '';
    const onDoubleClick = 'ondblclick="doubleClickHandler(event)"';
    const isDraggable = card.isFlipped
      ? 'draggable="true" ondragstart="dragstartHandler(event)" ondragend="dragendHandler(event)"'
      : '';
    html += `<div id=${card.id} class="card ${card.suitColor} ${isFlipped}" ${isDraggable} ${onDoubleClick} ${onFlipCard}>
            ${card.displayString}
        </div>`;
  });
  return html;
};

// Fill all columns with cards
columnOneSection.innerHTML = createCards(columnOne);
columnTwoSection.innerHTML = createCards(columnTwo);
columnThreeSection.innerHTML = createCards(columnThree);
columnFourSection.innerHTML = createCards(columnFour);
columnFiveSection.innerHTML = createCards(columnFive);
columnSixSection.innerHTML = createCards(columnSix);
columnSevenSection.innerHTML = createCards(columnSeven);

/**
 * Add an event listener to draw from the deck
 */
deckSection.addEventListener('click', (e) => {
  const card = drawCard();

  if (card) {
    flippedDeckSection.innerHTML = createCards([card]);
  } else {
    flippedDeckSection.innerText = 'Click deck to go through remaining cards';
    d = flippedDeck.slice();
    flippedDeck = [];
  }
});

/**
 * If the card is the last card in the column
 * and it is unflipped it should be able to be flipped
 */
const onFlipCard = (event) => {
  const id = event.target.id;
  const card = allCards.find((x) => x.id === id);

  if (!card) {
    return;
  }

  card.isFlipped = true;
  const cardElement = document.getElementById(id);
  cardElement.outerHTML = createCards([card]);
};

/**
 * Determine if one card can be moved onto another card
 * @param {Card | undefined} cardA
 * @param {Card | undefined} cardB
 * @returns {boolean}
 */
const isValidMove = (cardA, cardB) => {
  if (cardA && cardB) {
    const isOffByOne = Math.abs(cardA.cardNumber - cardB.cardNumber) === 1;
    const isDifferentSuit =
      (cardA.suitColor === suitColor.red &&
        cardB.suitColor === suitColor.black) ||
      (cardA.suitColor === suitColor.black &&
        cardB.suitColor === suitColor.red);

    return isOffByOne && isDifferentSuit;
  }

  return false;
};

/**
 * Should be able to drag and drop a draggable card
 * and all draggable cards beneath it to a column
 * as long as the move is valid
 */
const dragstartHandler = (event) => {
  const parentId = event.target.parentElement.id;
  movedCardFromDeck = parentId === 'flipped-deck';
  event.dataTransfer.setData('card-id', event.target.id);
  event.effectAllowed = 'move';
};

/**
 * Have to call prevent default when dragging over in order to drop
 * @param {*} event
 */
const dragoverHandler = (event) => {
  event.preventDefault();
  event.dropEffect = 'move';
};

const dropHandler = (event) => {
  let target = event.target.parentElement;

  // If the column has no cards in it then the target is the column
  // instead of the columns parent
  if ([...event.target.classList].includes('column')) {
    target = event.target;
    const cardId = event.dataTransfer.getData('card-id');

    // Find other cards that appear after card a
    const columnCards = Array.prototype.slice.call(
      document.getElementById(cardId).parentNode.childNodes
    );
    const card = columnCards.find((x) => x.id === cardId);
    const index = columnCards.indexOf(card);
    const otherCards = columnCards.slice(index);

    otherCards.forEach((x) => {
      target.appendChild(document.getElementById(x.id));
    });
    validCardMove = true;
  } else {
    const cardId = event.dataTransfer.getData('card-id');
    const lastCardInTarget = target.children[target.children.length - 1];

    const cardA = allCards.find((x) => x.id === cardId);
    const cardB = allCards.find((x) => x.id === lastCardInTarget.id);

    const isLegalMove = isValidMove(cardA, cardB);
    if (isLegalMove) {
      // Find other cards that appear after card a
      const columnCards = Array.prototype.slice.call(
        document.getElementById(cardId).parentNode.childNodes
      );
      const card = columnCards.find((x) => x.id === cardId);
      const index = columnCards.indexOf(card);
      const otherCards = columnCards.slice(index);

      otherCards.forEach((x) => {
        target.appendChild(document.getElementById(x.id));
      });
      validCardMove = true;
    }
  }
};

const dragendHandler = (event) => {
  // If a card is removed from the deck into a column
  // then update the flipped deck to show the previous card
  if (movedCardFromDeck && validCardMove) {
    flippedDeck = flippedDeck.filter((x) => x.id !== event.target.id);

    if (flippedDeck.length >= 1) {
      flippedDeckSection.innerHTML = createCards([flippedDeck[0]]);
    }
  }

  // Set the variables back to false
  movedCardFromDeck = false;
  validCardMove = false;
};

const doubleClickHandler = (event) => {
  const parentId = event.target.parentElement.id;

  const clickedCard = allCards.find((x) => x.id === event.target.id);

  if (clickedCard === undefined) {
    return;
  }

  const cardSuitName = clickedCard.suitName;
  const currentCompletedCardsForSuit = completedCards[cardSuitName];
  const numberOfCompletedCardsForSuit = currentCompletedCardsForSuit.length;

  if (numberOfCompletedCardsForSuit === clickedCard.cardNumber) {
    const newCompletedCards = [...currentCompletedCardsForSuit, clickedCard];
    completedCards[cardSuitName] = newCompletedCards;

    // If the card was moved from the deck to complete cards remove last
    // element from flipped cards
    if (parentId === 'flipped-deck') {
      flippedDeck = flippedDeck.filter((x) => x.id !== event.target.id);

      if (flippedDeck.length >= 1) {
        flippedDeckSection.innerHTML = createCards([flippedDeck[0]]);
      }
    }

    // Get the card and move it to the completed cards section
    if (cardSuitName === suitName.heart) {
      completedHeartsSection.appendChild(event.target);
    } else if (cardSuitName === suitName.club) {
      completedClubsSection.appendChild(event.target);
    } else if (cardSuitName === suitName.diamond) {
      completedDiamondsSection.appendChild(event.target);
    } else if (cardSuitName === suitName.spade) {
      completedSpadesSection.appendChild(event.target);
    }
  }
};
