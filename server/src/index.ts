import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import http from "http";
import { WebSocketServer } from "ws";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers, typeDefs } from "./CardDealerServer";
import { sequelize } from "./database";
import { GameAPI } from "./datasources/game-api";
import { PlayerAPI } from "./datasources/player-api";
import { Deck } from "./models/Deck";
import { Player } from "./models/Player";

const pubsub = new PubSub();
const app = express();
const httpServer = http.createServer(app);

resolvers["Subscription"] = {
  deal: {
    subscribe: () => pubsub.asyncIterator(["EVENT_PLAYER_ADDED"]),
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});

const serverCleanup = useServer({ schema }, wsServer);

sequelize.sync().then(async () => {
  const players = await Player.findAll();
  const deck = await Deck.findAll();

  if (players.length <= 0) {
    Player.bulkCreate([
      { name: "Player 1", cards: "[]" },
      { name: "Player 2", cards: "[]" },
    ]);
  }

  if (deck.length <= 0) {
    Deck.create({
      deck: "[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51]",
    });
  }
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

server.start().then(() => {
  app.use(
    "/",
    cors<cors.CorsRequest>(),
    bodyParser.json({ limit: "50mb" }),
    expressMiddleware(server, {
      context: async () => {
        return {
          dataSources: {
            playerAPI: new PlayerAPI(),
            gameAPI: new GameAPI(),
            pubsub,
          },
        };
      },
    }),
  );

  new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve)).then(
    () => console.log(`🚀 Server ready at http://localhost:4000/`),
  );
});
