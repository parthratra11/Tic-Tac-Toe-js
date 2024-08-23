import View from "./testProjectView-v2.js";
import Store from "./testProjectStore-v2.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-o",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-x",
  },
];

function init() {
  const view = new View();
  const store = new Store("t3-storage-key", players);

  //   UPDATE STATE ON THE SAME TAB
  store.addEventListener("stateChange", () => {
    view.render(store.game, store.stats);
  });

  //   UPDATE STATE ACROSS DIFFERENT SESSION
  window.addEventListener("storage", () => {});
  view.render(store.game, store.stats);

  // RELOADING THE SAVES ON REFRESH
  view.render(store.game, store.stats);

  // GAME RESET
  view.bindGameResetEvent((event) => {
    store.reset();
  });

  // NEW ROUND
  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  //   PLAYER MOVE
  view.bindPlayerMoveEvent((square) => {
    // CHECKING IF THE SQUARE HAS BEEN ALREADY PLAYED BEFORE
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }

    // UPDATING THE MOVES ARRAY AND ADVANCING TO THE  NEXT STATE
    store.playerMove(+square.id);

    view.render(store.game, store.stats);
  });
}

window.addEventListener("load", init);
