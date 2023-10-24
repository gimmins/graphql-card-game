import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Box, Button, Center, HStack, Image, Spinner } from "@chakra-ui/react";
import { deckdata } from "../data/deckdata";

const GET_PLAYER_DECK = gql`
  query Query($playerId: String) {
    getDeckByPlayerId(playerId: $playerId)
  }
`;

const GET_OTHER_PLAYER_DECK = gql`
  query Query($playerId: String) {
    getOtherPlayerDeck(playerId: $playerId)
  }
`;

export const Deck = ({ who, gameStatus }) => {
  const playerId = localStorage.getItem("playerId");

  const { data, loading, refetch } = useQuery(
    who === "mine" ? GET_PLAYER_DECK : GET_OTHER_PLAYER_DECK,
    {
      variables: {
        playerId,
      },
    },
  );

  if (loading) {
    return (
      <Center h="100%">
        <Spinner color="white" size="xl" />
      </Center>
    );
  }

  const deckToParse =
    who === "mine"
      ? data?.getDeckByPlayerId
        ? data?.getDeckByPlayerId
        : ""
      : data?.getOtherPlayerDeck
      ? data?.getOtherPlayerDeck
      : "";

  const parsedDeck = JSON.parse(deckToParse);

  return (
    <Box w="100%" h="100%">
      <HStack position="relative">
        {parsedDeck.map((deck, index) => {
          return (
            <Image
              top={0}
              left={`${index * 60}px`}
              position="absolute"
              key={`card_${deckdata[deck].suit}_${deckdata[deck].value}`}
              src={`cards/${deckdata[deck].suit}_${deckdata[deck].value}.svg`}
            />
          );
        })}
      </HStack>
    </Box>
  );
};
