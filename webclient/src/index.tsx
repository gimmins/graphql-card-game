import "./index.css";
import { createClient } from "graphql-ws";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { ChakraProvider } from "@chakra-ui/react";
import Pages from "./pages";

// Create an http link
const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

// Create a websocket link
const link = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000",
  }),
);

// Create a split link:
// if you are trying to subscribe, use websocket
// if you are trying to do anything else, use http
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  link,
  httpLink,
);

const gqlClient = new ApolloClient({
  // This port must be the same as in server/src/index.ts
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <ApolloProvider client={gqlClient}>
    <ChakraProvider>
      <Pages />
    </ChakraProvider>
  </ApolloProvider>,
);
