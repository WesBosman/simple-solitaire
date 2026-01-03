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
    html += `<div id=${card.id} ${isDraggable} class="card ${card.suitColor} ${isFlipped}" ${onDoubleClick} ${onFlipCard}>
      <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
        <!-- Top left: rank -->
        <text x="0" y="16" font-size="32" font-weight="bold" class="card-rank">${card.cardString}</text>
        
        <!-- Top right: suit -->
        <text x="100" y="16" font-size="32" text-anchor="end" class="card-suit">${card.suitString}</text>
        
        <!-- Center: large suit -->
        <text x="50" y="90" font-size="64" text-anchor="middle" class="card-suit">${card.suitString}</text>
        
        <!-- Bottom left: suit (upside down) -->
        <text x="0" y="130" font-size="32" class="card-suit" transform="rotate(180 10 131.5)">${card.suitString}</text>
        
        <!-- Bottom right: rank (upside down) -->
        <text x="105" y="130" font-size="32" font-weight="bold" text-anchor="end" class="card-rank" transform="rotate(180 90 131.5)">${card.cardString}</text>
      </svg>
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
    flippedDeckSection.innerHTML = '<div class="empty"></div>';
    d = flippedDeck.slice();
    flippedDeck = [];
  }
});

/**
 * Animate a card from one position to another
 */
const moveCard = (cardId, targetId) => {
  const card = document.getElementById(cardId);
  const target = document.getElementById(targetId);

  const originalZIndex = card.style.zIndex;
  card.style.zIndex = "10";

  const startRect = card.getBoundingClientRect();

  target.appendChild(card);

  const  endRect = card.getBoundingClientRect();

  const deltaX = startRect.left - endRect.left;
  const deltaY = startRect.top - endRect.top;

  // Animate
  card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  card.offsetHeight; // Force reflow
  
  card.style.transition = 'transform 0.3s ease-out';
  card.style.transform = 'translate(0, 0)';
  
  // Cleanup
  setTimeout(() => {
    card.style.transition = '';
    card.style.transform = '';
    card.style.zIndex = originalZIndex;
  }, 300);
}

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
  
  // Find other cards that appear after card a
  const columnCards = Array.prototype.slice.call(
    document.getElementById(id).parentNode.childNodes
  );
  const colIndex = columnCards.findIndex((x) => x.id === id);

  // Check the card you're trying to flip is the last in the column
  if (colIndex !== columnCards.length - 1) {
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

// Check if the game is in a winnable state (all cards are flipped)
function checkAutoComplete() {
  // Check if deck is empty
  if (d.length > 0 || flippedDeck.length > 0) {
    return false;
  }
  
  // Check if all cards are flipped over
  const allCardsFlipped = allCards.every(x => x.isFlipped);
  
  return allCardsFlipped;
}

// Get all cards in the column
function getAllCardsInColumn(columnId) {
  const cards = Array.prototype.slice.call(
    document.getElementById(columnId).childNodes
  );

  return cards.map(x => {
    const c = allCards.find(y => y.id === x.id);

    return c;
  })
}

// Find the next card that can be moved to a foundation
function findNextMovableCard() {
  const allColumns = [
    { cards: getAllCardsInColumn(columnOneSection.id), element: columnOneSection },
    { cards: getAllCardsInColumn(columnTwoSection.id), element: columnTwoSection },
    { cards: getAllCardsInColumn(columnThreeSection.id), element: columnThreeSection },
    { cards: getAllCardsInColumn(columnFourSection.id), element: columnFourSection },
    { cards: getAllCardsInColumn(columnFiveSection.id), element: columnFiveSection },
    { cards: getAllCardsInColumn(columnSixSection.id), element: columnSixSection },
    { cards: getAllCardsInColumn(columnSevenSection.id), element: columnSevenSection }
  ];
  
  // Collect ALL cards from all columns
  let allAvailableCards = [];
  
  for (const column of allColumns) {
    for (const card of column.cards) {
      allAvailableCards.push({ card, column });
    }
  }
  
  // Sort by card number (lowest first - Ace=0, Two=1, etc.)
  allAvailableCards.sort((a, b) => a.card.cardNumber - b.card.cardNumber);
  
  // Find the first card that can legally move to its foundation
  for (const item of allAvailableCards) {
    const { card, column } = item;
    const suitName = card.suitName;
    const currentCompleted = completedCards[suitName];
    
    // Check if this card is the next one needed for its suit
    if (currentCompleted.length === card.cardNumber) {
      return { card, column };
    }
  }
  
  return null;
}

async function autoCompleteGame() {  
  while (true) {
    const move = findNextMovableCard();
    
    if (!move) {
      break;
    }
    
    const { card, column } = move;
    const suitName = card.suitName;
    
    let foundationElement;
    if (suitName === 'heart') {
      foundationElement = completedHeartsSection.id;
    } else if (suitName === 'spade') {
      foundationElement = completedSpadesSection.id;
    } else if (suitName === 'club') {
      foundationElement = completedClubsSection.id;
    } else if (suitName === 'diamond') {
      foundationElement = completedDiamondsSection.id;
    }
    
    // Update the completed cards array
    completedCards[suitName] = [...completedCards[suitName], card];
    
    // Remove from column array
    column.cards.pop();
    
    // Animate the card
    moveCard(card.id, foundationElement);
    
    // Small delay between cards for visual effect
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

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

  // Check we can move that card to the completed section
  if (numberOfCompletedCardsForSuit !== clickedCard.cardNumber) {
    return;
  }

  // Get the card and move it to the completed cards section
  if (cardSuitName === suitName.heart) {
    moveCard(clickedCard.id, 'completed-hearts')
  } else if (cardSuitName === suitName.club) {
    moveCard(clickedCard.id, 'completed-clubs')
  } else if (cardSuitName === suitName.diamond) {
    moveCard(clickedCard.id, 'completed-diamonds')
  } else if (cardSuitName === suitName.spade) {
    moveCard(clickedCard.id, 'completed-spades')
  }

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

  if (checkAutoComplete()) {
    autoCompleteGame();
  }
};

// touch handlers to prevent weird safari behavior
const touchHandler = (e) => {
  e.preventDefault();
}
