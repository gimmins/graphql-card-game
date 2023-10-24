import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

export class Player extends Model {}

Player.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    playerId: {
      type: DataTypes.STRING,
    },
    cards: {
      type: DataTypes.STRING,
    },
    turn: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "player",
  },
);
