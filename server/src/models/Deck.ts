import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

export class Deck extends Model {}

Deck.init(
  {
    deck: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "deck",
  },
);
