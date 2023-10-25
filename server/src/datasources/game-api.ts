import { deckdata } from "../../../data/deckdata";
import { Deck } from "../models/Deck";
import { Player } from "../models/Player";

/* https://www.educative.io/answers/how-to-shuffle-an-array-in-javascript */
const shuffle = array => {
  let len = array.length,
    currentIndex;

  for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
    let randIndex = Math.floor(Math.random() * (currentIndex + 1));
    var temp = array[currentIndex];
    array[currentIndex] = array[randIndex];
    array[randIndex] = temp;
  }

  return array;
};

export class GameAPI {
  async initializeGame() {
    const players = await Player.findAll();

    let initialize = true;

    for (let i = 0; i < 2; i++) {
      if (!players[i].dataValues.playerId) {
        initialize = false;
      }
    }

    if (initialize) {
      const deck = await Deck.findAll();
      const parsedDeck = JSON.parse(deck[0].dataValues.deck);

      Deck.update(
        { deck: JSON.stringify(shuffle(parsedDeck)) },
        {
          where: {
            id: 1,
          },
        },
      );

      Player.update(
        { turn: true },
        {
          where: {
            id: 1,
          },
        },
      );
    }
  }

  async getGameStatus(playerId) {
    const players = await Player.findAll();

    for (let i = 0; i < 2; i++) {
      if (!players[i].dataValues.playerId) {
        return 1;
      }
    }

    const deck = await Deck.findAll();
    const parsedDeck = JSON.parse(deck[0].dataValues.deck);

    if (parsedDeck.length <= 0) {
      return 2;
    }

    const playerACards = JSON.parse(players[0].dataValues.cards);
    const playerBCards = JSON.parse(players[1].dataValues.cards);

    const lastPlayerACard =
      playerACards && playerACards.length > 0
        ? playerACards[playerACards.length - 1]
        : null;
    const lastPlayerBCard =
      playerBCards && playerBCards.length > 0
        ? playerBCards[playerBCards.length - 1]
        : null;

    if (
      lastPlayerACard &&
      lastPlayerBCard &&
      deckdata[lastPlayerACard].value === deckdata[lastPlayerBCard].value
    ) {
      return 3;
    }

    if (players[0].dataValues.turn) {
      if (players[0].dataValues.playerId === playerId) {
        return 4;
      } else {
        return 5;
      }
    }

    if (players[1].dataValues.turn) {
      if (players[1].dataValues.playerId === playerId) {
        return 4;
      } else {
        return 5;
      }
    }

    return -1;
  }

  async draw(playerId) {
    const players = await Player.findAll({
      where: {
        playerId,
      },
    });

    if (players && !players[0].dataValues.turn) {
      return null;
    }

    const deck = await Deck.findAll();
    const parsedDeck = JSON.parse(deck[0].dataValues.deck);

    const topCard = parsedDeck.shift();

    let playerCards = JSON.parse(players[0].dataValues.cards);
    playerCards.push(topCard);

    const playerUpdateResult = await Player.update(
      { cards: JSON.stringify(playerCards), turn: false },
      {
        where: {
          playerId,
        },
      },
    );

    const otherPlayerUpdateResult = await Player.update(
      {
        turn: true,
      },
      {
        where: {
          id: players[0].dataValues.id === 1 ? 2 : 1,
        },
      },
    );

    const deckUpdateResult = await Deck.update(
      {
        deck: JSON.stringify(parsedDeck),
      },
      {
        where: {
          id: 1,
        },
      },
    );

    return playerUpdateResult &&
      deckUpdateResult &&
      otherPlayerUpdateResult &&
      playerUpdateResult[0] === 1 &&
      deckUpdateResult[0] === 1 &&
      otherPlayerUpdateResult[0] === 1
      ? JSON.stringify(playerCards)
      : null;
  }

  async getDeck() {
    const result = await Deck.findAll();

    return result[0].dataValues.deck;
  }
}
