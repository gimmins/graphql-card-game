import { Deck } from "../components/Deck";
import { gql, useQuery } from "@apollo/client";
import { usePusher } from "../hooks/usePusher";
import { Center, Flex, Heading, VStack } from "@chakra-ui/react";
import { DealerDeck } from "../components/DealerDeck";

const GET_GAME_STATUS = gql`
  query Query($playerId: String!) {
    getGameStatus(playerId: $playerId)
  }
`;

export const GameRoom = () => {
  const playerId = localStorage.getItem("playerId");

  const { channel }: { channel: any } = usePusher();
  const { data, loading, refetch } = useQuery(GET_GAME_STATUS, {
    variables: {
      playerId: playerId,
    },
  });

  channel?.bind("my-event", function (data) {
    refetch();
  });

  if (loading) return <>Loading</>;

  return (
    <Center h="100vh" w="100vw" bgColor="#449144">
      {data?.getGameStatus === 1 ? (
        <Heading color="#cccccc">Waiting for players</Heading>
      ) : (
        <Center h="100%" w="80%" flexDir="column">
          <Deck who="other" gameStatus={data?.getGameStatus} />
          <DealerDeck gameStatus={data?.getGameStatus} />
          <Deck who="mine" gameStatus={data?.getGameStatus} />
        </Center>
      )}
    </Center>
  );
};
