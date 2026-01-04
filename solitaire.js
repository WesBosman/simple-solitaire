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
let drag = null;

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
    const isFlipped = card.isFlipped ? 'flipped' : '';
    const onFlipCard =
      card.isFlipped === false ? 'onclick=onFlipCard(event)' : '';
    html += `<div id=${card.id} class="card ${card.suitColor} ${isFlipped}" ${onFlipCard}>
      <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
        <!-- Top left: rank -->
        <text x="0" y="16" font-size="40" font-weight="bold" class="card-rank">${card.cardString}</text>
        
        <!-- Top right: suit -->
        <text x="100" y="16" font-size="40" text-anchor="end" class="card-suit">${card.suitString}</text>
        
        <!-- Center: large suit -->
        <text x="50" y="90" font-size="64" text-anchor="middle" class="card-suit">${card.suitString}</text>
        
        <!-- Bottom left: suit (upside down) -->
        <text x="0" y="130" font-size="40" class="card-suit" transform="rotate(180 10 131.5)">${card.suitString}</text>
        
        <!-- Bottom right: rank (upside down) -->
        <text x="105" y="130" font-size="40" font-weight="bold" text-anchor="end" class="card-rank" transform="rotate(180 90 131.5)">${card.cardString}</text>
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

setupDesktopDoubleClick();
setupMobileDoubleTap();
setupPointerDnD();

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

  setupDesktopDoubleClick();
  setupMobileDoubleTap();
  setupPointerDnD(); 
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

const moveCardsToTarget = (cardId, target) => {
  const cardElement = document.getElementById(cardId);
  if (!cardElement) return;

  const sourceColumn = cardElement.parentElement;
  if (!sourceColumn) return;

  const columnCards = Array.from(sourceColumn.children);

  const index = columnCards.findIndex(x => x.id === cardId);
  if (index === -1) return;

  const stack = columnCards.slice(index);

  stack.forEach((el) => {
    target.appendChild(el);
  })
}

/**
 * If the card is the last card in the column
 * and it is unflipped it should be able to be flipped
 */
const onFlipCard = (event) => {
  const cardElement = event.currentTarget;
  const cardId = cardElement.dataset.cardId || cardElement.id;
  const card = allCards.find((x) => x.id === cardId);

  if (!card) {
    return;
  }
  
  // Find other cards that appear after card a
  const columnCards = Array.prototype.slice.call(
    document.getElementById(cardId).parentNode.childNodes
  );
  const colIndex = columnCards.findIndex((x) => x.id === cardId);

  // Check the card you're trying to flip is the last in the column
  if (colIndex !== columnCards.length - 1) {
    return;
  }
  
  card.isFlipped = true;
  cardElement.outerHTML = createCards([card]);

  setupDesktopDoubleClick();
  setupMobileDoubleTap();
  setupPointerDnD(); 
};

/**
 * Determine if one card can be moved onto another card
 * @param {Card | undefined} cardA
 * @param {Card | undefined} cardB
 * @returns {boolean}
 */
const isValidMove = (cardA, cardB) => {
  if (cardA && cardB) {
    const isOffByOne = cardB.cardNumber - cardA.cardNumber === 1;
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

    // Move it to correct foundation
    const completedTargetIdBySuit = {
      [suitName.heart]: "completed-hearts",
      [suitName.club]: "completed-clubs",
      [suitName.diamond]: "completed-diamonds",
      [suitName.spade]: "completed-spades",
    };

    const foundationElement = completedTargetIdBySuit[suitName];
    
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

function setupPointerDnD() {
  document.querySelectorAll('.card.flipped').forEach((card) => {
    card.addEventListener('pointerdown', onPointerDownCard);
  })
}

function onPointerDownCard(e) {
  // Only left-click / primary touch
  if (e.button !== undefined && e.button !== 0) return;

  const cardEl = e.currentTarget; // IMPORTANT (wrapper .card)
  const cardId = cardEl.dataset.cardId || cardEl.id;
  if (!cardId) return;

  const sourceColumn = cardEl.closest(".column, #flipped-deck");
  if (!sourceColumn) return;

  // If you only want to allow dragging from tableau + flipped deck, you can gate here
  movedCardFromDeck = sourceColumn.id === "flipped-deck";

  // Build the moving stack: card + all below it (in the same column)
  const siblings = Array.from(sourceColumn.children).filter((el) => el.classList.contains("card"));
  const startIndex = siblings.findIndex((el) => (el.dataset.cardId || el.id) === cardId);
  if (startIndex === -1) return;

  const stackEls = siblings.slice(startIndex);

  // Create a floating container (“ghost”) at the same screen position
  const firstRect = stackEls[0].getBoundingClientRect();
  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.style.transform = `translate(${firstRect.left}px, ${firstRect.top}px)`;

  // Move DOM nodes into ghost (so you see the real cards moving)
  stackEls.forEach((el) => {
    el.classList.add("dragging");
    ghost.appendChild(el);
  });

  document.body.appendChild(ghost);

  // Store drag session state
  drag = {
    pointerId: e.pointerId,
    cardId,
    sourceColumn,
    stackEls, // now inside ghost
    ghost,
    startX: e.clientX,
    startY: e.clientY,
    originLeft: firstRect.left,
    originTop: firstRect.top,
    lastDropColumn: null,
  };

  // Capture pointer so we keep getting move/up events even if finger leaves element
  cardEl.setPointerCapture(e.pointerId);

  document.addEventListener("pointermove", onPointerMove, { passive: false });
  document.addEventListener("pointerup", onPointerUp, { passive: false });
  document.addEventListener("pointercancel", onPointerCancel, { passive: false });

  // Prevent iOS from treating this as scroll/zoom
  e.preventDefault();
}

function onPointerMove(e) {
  if (!drag || e.pointerId !== drag.pointerId) return;

  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;

  drag.ghost.style.transform = `translate(${drag.originLeft + dx}px, ${drag.originTop + dy}px)`;

  // Track which column we’re over (hit-test at finger position)
  const elUnderFinger = document.elementFromPoint(e.clientX, e.clientY);
  const col = elUnderFinger?.closest(".column, .completed-column");
  drag.lastDropColumn = col || null;

  e.preventDefault();
}

function onPointerUp(e) {
  if (!drag || e.pointerId !== drag.pointerId) return;

  cleanupPointerListeners();

  const target = drag.lastDropColumn;
  validCardMove = false;

  if (target) {
    const droppingOnCompleted = target.classList.contains("completed-column");

    if (droppingOnCompleted) {
      // Don't allow drag-drop to foundation (use double-click for that)
      validCardMove = false;
    } else {
      // Tableau column rules
      const targetCards = Array.from(target.children).filter((el) => 
        el.classList.contains("card")
      );
      
      if (targetCards.length === 0) {
        // Empty column: only Kings allowed
        const cardA = allCards.find((x) => x.id === drag.cardId);
        validCardMove = cardA && cardA.cardNumber === cardNumber.king;
      } else {
        const lastCardEl = targetCards[targetCards.length - 1];
        const lastCardId = lastCardEl.dataset.cardId || lastCardEl.id;

        const cardA = allCards.find((x) => x.id === drag.cardId);
        const cardB = allCards.find((x) => x.id === lastCardId);

        validCardMove = isValidMove(cardA, cardB);
      }
    }

    if (validCardMove) {
      // Move stack cards from ghost into the target column
      const movingEls = Array.from(drag.ghost.children);
      movingEls.forEach((el) => target.appendChild(el));
    }
  }

  // If invalid move OR no target, return to source column
  if (!validCardMove) {
    const movingEls = Array.from(drag.ghost.children);
    movingEls.forEach((el) => drag.sourceColumn.appendChild(el));
  }

  // Remove ghost container
  drag.stackEls.forEach((el) => el.classList.remove("dragging"));
  drag.ghost.remove();

  // If you moved from flipped deck and it was valid, update flipped deck UI
  if (movedCardFromDeck && validCardMove) {
    const draggedId = drag.cardId;
    flippedDeck = flippedDeck.filter((x) => x.id !== draggedId);

    if (flippedDeck.length >= 1) {
      flippedDeckSection.innerHTML = createCards([flippedDeck[0]]);
      setupDesktopDoubleClick();
      setupMobileDoubleTap();
      setupPointerDnD(); // re-bind for newly rendered card
    }
  }

  movedCardFromDeck = false;
  validCardMove = false;
  drag = null;

  e.preventDefault();
}

function onPointerCancel(e) {
  if (!drag || e.pointerId !== drag.pointerId) return;
  cleanupPointerListeners();

  // Return stack to source
  const movingEls = Array.from(drag.ghost.children);
  movingEls.forEach((el) => drag.sourceColumn.appendChild(el));

  drag.stackEls.forEach((el) => el.classList.remove("dragging"));
  drag.ghost.remove();

  movedCardFromDeck = false;
  validCardMove = false;
  drag = null;

  e.preventDefault();
}

function cleanupPointerListeners() {
  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerup", onPointerUp);
  document.removeEventListener("pointercancel", onPointerCancel);
}

function isTopCardInStack(cardEl) {
  const stack = cardEl.closest('.column, .completed-column, #flipped-deck')
  if (!stack) return false;

  const cards = Array.from(stack.children).filter((el) => el.classList.contains('card'))
  if (cards.length === 0) return false;

  return cards[cards.length-1] ===cardEl;
}

function autoMoveCard(cardEl) {
  if (!isTopCardInStack(cardEl)) return;

  // Get the card id from the wrapper
  const cardId = cardEl.dataset.cardId || cardEl.id;
  if (!cardId) return;

  // Pile/column the card is currently in
  const parentPileEl = cardEl.closest(".bottom-column, .completed-column, #flipped-deck, #deck");
  const parentId = parentPileEl?.id ?? "";

  const clickedCard = allCards.find((x) => x.id === cardId);
  if (!clickedCard) return;

  const cardSuitName = clickedCard.suitName;
  const currentCompletedCardsForSuit = completedCards[cardSuitName];
  const numberOfCompletedCardsForSuit = currentCompletedCardsForSuit.length;

  // Check we can move that card to the completed section
  if (numberOfCompletedCardsForSuit !== clickedCard.cardNumber) {
    return;
  }

  // Move it to correct foundation
  const completedTargetIdBySuit = {
    [suitName.heart]: "completed-hearts",
    [suitName.club]: "completed-clubs",
    [suitName.diamond]: "completed-diamonds",
    [suitName.spade]: "completed-spades",
  };

  const targetId = completedTargetIdBySuit[cardSuitName];
  if (!targetId) return;

  moveCard(clickedCard.id, targetId);

  completedCards[cardSuitName] = [...currentCompletedCardsForSuit, clickedCard];

  // If the card was moved from the flipped deck to complete cards
  if (parentId === "flipped-deck") {
    flippedDeck = flippedDeck.filter((x) => x.id !== cardId);

    if (flippedDeck.length >= 1) {
      flippedDeckSection.innerHTML = createCards([flippedDeck[0]]);

      setupDesktopDoubleClick();
      setupMobileDoubleTap();
      setupPointerDnD(); 
    }
  }

  if (checkAutoComplete()) {
    autoCompleteGame();
  }
}

function setupDesktopDoubleClick() {
  document.querySelectorAll('.card.flipped').forEach((card) => {
    card.addEventListener('dblclick', (e) => {
      autoMoveCard(e.currentTarget);
    })
  })
}

function setupMobileDoubleTap() {
  let lastTapTime = 0;
  let lastTappedCard = null;

  document.querySelectorAll('.card.flipped').forEach((card) => {
    card.addEventListener('touchend', (e) => {
      const now = Date.now();
      const timeSinceLastTap = now - lastTapTime;

      if (lastTappedCard === card &&
        timeSinceLastTap > 0 && 
        timeSinceLastTap < 300
      ) {
        e.preventDefault();
        autoMoveCard(card);
        lastTapTime = 0;
        lastTappedCard = null;
      } else {
        lastTapTime = now;
        lastTappedCard = card;
      }
    }, { passive: false })
  })
}
