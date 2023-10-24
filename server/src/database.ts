import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("card-game-db", "user", "pass", {
  dialect: "sqlite",
  host: ":memory:",
});
