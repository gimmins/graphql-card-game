import { Player } from "../models/Player";

export class PlayerAPI {
  async getPlayer(id) {
    const result = await Player.findAll({
      where: {
        id,
      },
    });

    return {
      id: result[0].dataValues.id,
      name: result[0].dataValues.name,
      playerId: result[0].dataValues.playerId,
      cards: result[0].dataValues.cards,
      turn: result[0].dataValues.turn,
    };
  }

  async getPlayerByPlayerId(playerId) {
    const result = await Player.findAll({
      where: {
        playerId,
      },
    });

    return result && result[0]
      ? {
          id: result[0].dataValues.id,
          name: result[0].dataValues.name,
          playerId: result[0].dataValues.playerId,
          cards: result[0].dataValues.cards,
          turn: result[0].dataValues.turn,
        }
      : null;
  }

  async getDeckByPlayerId(playerId) {
    const result = await Player.findAll({
      where: {
        playerId,
      },
    });

    return result[0].dataValues.cards;
  }

  async getOtherPlayerDeck(playerId) {
    const result = await Player.findAll();

    const otherPlayer = result.filter(
      player => player.dataValues.playerId !== playerId,
    );

    return otherPlayer[0].dataValues.cards;
  }

  async setPlayer(playerId, id) {
    const result = await Player.update(
      { playerId },
      {
        where: {
          id,
        },
      },
    );

    return result ? result[0] : null;
  }

  async getAllPlayers() {
    const result = await Player.findAll();

    return result.map(player => ({
      id: player.dataValues.id,
      name: player.dataValues.name,
      playerId: player.dataValues.playerId,
      cards: player.dataValues.cards,
      turn: player.dataValues.turn,
    }));
  }

  async getNoneAssignedPlayers() {
    const result = await Player.findAll();

    return result
      .filter(player => !player.dataValues.playerId)
      .map(player => ({
        id: player.dataValues.id,
        name: player.dataValues.name,
      }));
  }
}
