// GraphQL type and query definitions
// Note: These are example types. You should replace them with what you need
export const typeDefs = `#graphql
  type Query {
    getPlayer(id: ID!): Player
    getPlayerByPlayerId(playerId: String!): Player
    getAllPlayers: [Player]!
    getNoneAssignedPlayers: [NoneAssignedPlayer]!
    getDeck: String
    getDeckByPlayerId(playerId: String): String
    getOtherPlayerDeck(playerId: String): String
    getGameStatus(playerId: String!): Int!
  }

  type Mutation {
    setPlayer(playerId: String, id: ID!): GeneralResponse!
    draw(playerId: String): DrawResponse!
  }

  type DrawResponse {
    code: Int!
    success: Boolean!
    message: String!
    cards: String
  }

  type GeneralResponse {
    code: Int!
    success: Boolean!
    message: String!
  }

  type Player {
    id: ID!
    name: String
    playerId: String
    cards: String
    turn: Boolean
  }

  type NoneAssignedPlayer {
    id: ID!
    name: String
  }
`;

// GraphQL query logic
// Note: These are example queries. You should replace them with what you need
export const resolvers = {
  Query: {
    getPlayer: (_, { id }, { dataSources }) => {
      return dataSources.playerAPI.getPlayer(id);
    },
    getPlayerByPlayerId: (_, { playerId }, { dataSources }) => {
      return dataSources.playerAPI.getPlayerByPlayerId(playerId);
    },
    getAllPlayers: (_, __, { dataSources }) => {
      return dataSources.playerAPI.getAllPlayers();
    },
    getNoneAssignedPlayers: (_, __, { dataSources }) => {
      return dataSources.playerAPI.getNoneAssignedPlayers();
    },
    getDeck: (_, __, { dataSources }) => {
      return dataSources.gameAPI.getDeck();
    },
    getDeckByPlayerId: (_, { playerId }, { dataSources }) => {
      return dataSources.playerAPI.getDeckByPlayerId(playerId);
    },
    getOtherPlayerDeck: (_, { playerId }, { dataSources }) => {
      return dataSources.playerAPI.getOtherPlayerDeck(playerId);
    },
    getGameStatus: (_, { playerId }, { dataSources }) => {
      return dataSources.gameAPI.getGameStatus(playerId);
    },
  },
  Mutation: {
    setPlayer: async (_, { playerId, id }, { dataSources }) => {
      try {
        const response = await dataSources.playerAPI.setPlayer(playerId, id);

        if (response) {
          dataSources.gameAPI.initializeGame();
          dataSources.pusher.trigger("my-channel", "my-event", "player joined");

          return {
            code: 200,
            success: true,
            message: "Successfully set player",
          };
        } else {
          throw new Error();
        }
      } catch (err) {
        return {
          code: 404,
          success: false,
          message: "Failed to set player",
        };
      }
    },
    draw: async (_, { playerId }, { dataSources }) => {
      try {
        const response = await dataSources.gameAPI.draw(playerId);

        if (response) {
          dataSources.pusher.trigger("my-channel", "my-event", "draw card");

          return {
            code: 200,
            success: true,
            message: "Successfully draw card from deck",
            cards: response,
          };
        } else {
          throw new Error();
        }
      } catch (err) {
        return {
          code: 404,
          success: false,
          message: "Failed to draw card from deck",
        };
      }
    },
  },
};
