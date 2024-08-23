export default class View {
  $ = {};
  $$ = {};

  constructor() {
    this.$.actionMenu = this.#qsCheck("[data-id = 'action-menu']");
    this.$.menuItems = this.#qsCheck("[data-id = 'hidden-action-menu']");
    this.$.resetButton = this.#qsCheck("[data-id = 'reset-btn']");
    this.$.newRoundButton = this.#qsCheck("[data-id = 'new-round-btn']");
    this.$.resultBox = this.#qsCheck("[data-id = 'result-box']");
    this.$.resultText = this.#qsCheck("[data-id = 'result-text']");
    this.$.playAgainButton = this.#qsCheck("[data-id = 'play-again-btn']");
    this.$.turn = this.#qsCheck("[data-id = 'turn']");
    this.$.p1Wins = this.#qsCheck("[data-id = 'p1-wins']");
    this.$.p2Wins = this.#qsCheck("[data-id = 'p2-wins']");
    this.$.ties = this.#qsCheck("[data-id = 'ties']");
    this.$.squareGrid = this.#qsCheck("[data-id = 'square-grid']");

    this.$$.squares = this.#qsCheck("[data-id = 'square']", 1);

    // EVENT LISTENERS
    this.$.actionMenu.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeActionMenu();
    this.#closeActionMenu();
    this.#clearBoard();

    this.#updateScoreBoard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );

    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openResultBox(winner ? `${winner.name} wins!` : "It's a tie!");
      return;
    } else {
      this.#closeResultBox();
    }

    this.#turnIndicator(currentPlayer);
  }

  bindGameResetEvent(handler) {
    this.$.resetButton.addEventListener("click", handler);
    this.$.playAgainButton.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundButton.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.#delegate(this.$.squareGrid, '[data-id = "square"]', "click", handler);
  }

  //   DOM HELPER METHODS
  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
  }

  #updateScoreBoard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.textContent = `${p1Wins} Wins`;
    this.$.p2Wins.textContent = `${p2Wins} Wins`;
    this.$.ties.textContent = `${ties}`;
  }
  #openResultBox(message) {
    this.$.resultBox.classList.remove("hidden");
    this.$.resultText.innerText = message;
  }

  #closeResultBox() {
    this.$.resultBox.classList.add("hidden");
  }

  #closeActionMenu() {
    this.$.menuItems.classList.add("hidden");
  }

  #clearBoard() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) {
        this.#playerMove(square, existingMove.player);
      }
    });
  }

  #playerMove(squareNo, player) {
    const moveIcon = document.createElement("i");
    moveIcon.classList.add("fa-solid", "icon", player.iconClass);

    squareNo.replaceChildren(moveIcon);
  }

  #turnIndicator(player) {
    let turnIcon = document.createElement("i");
    let turnText = document.createElement("p");

    turnText = `${player.name}, you're up !`;
    turnIcon.classList.add("fa-solid", "fa-2x", "white", player.iconClass);

    this.$.turn.replaceChildren(turnIcon, turnText);
  }

  #qsCheck(tempSelector, allSelector) {
    const element = allSelector
      ? document.querySelectorAll(tempSelector)
      : document.querySelector(tempSelector);

    if (!element) throw new Error("Element not found !");
    return element;
  }

  #delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
