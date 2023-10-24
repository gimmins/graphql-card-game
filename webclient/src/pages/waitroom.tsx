import { gql, useQuery, useMutation } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { usePusher } from "../hooks/usePusher";
import { Center, Button, VStack } from "@chakra-ui/react";

const GET_NONE_ASSIGNED_PLAYERS = gql`
  query GetNoneAssignedPlayers {
    getNoneAssignedPlayers {
      id
      name
    }
  }
`;

const GET_PLAYER_BY_PLAYER_ID = gql`
  query GetPlayerByPlayerId($playerId: String!) {
    getPlayerByPlayerId(playerId: $playerId) {
      id
      name
      playerId
      cards
      turn
    }
  }
`;

const SET_PLAYERS = gql`
  mutation SetPlayer($setPlayerId: ID!, $playerId: String) {
    setPlayer(id: $setPlayerId, playerId: $playerId) {
      code
      success
      message
    }
  }
`;

export const WaitRoom = () => {
  const playerId = localStorage.getItem("playerId");
  const { channel }: { channel: any } = usePusher();
  const { data, loading, refetch } = useQuery(
    playerId ? GET_PLAYER_BY_PLAYER_ID : GET_NONE_ASSIGNED_PLAYERS,
    playerId
      ? {
          variables: {
            playerId,
          },
        }
      : undefined,
  );
  const navigate = useNavigate();
  const [setPlayer] = useMutation(SET_PLAYERS, {
    onCompleted: data => {
      if (data.setPlayer.code === 200) {
        navigate("/gameroom");
      }
    },
  });

  channel?.bind("my-event", function (data) {
    refetch();
  });

  if (loading) return <>loading</>;

  const handlePlayerButtonClick = id => {
    const playerId = uuidv4();

    localStorage.setItem("playerId", playerId);

    setPlayer({
      variables: {
        setPlayerId: id,
        playerId,
      },
    });
  };

  return (
    <Center h="100vh" bgColor="#449144">
      <VStack
        border="2px"
        borderColor="#83d283"
        w="40vw"
        p={10}
        borderRadius={3}
      >
        {playerId ? (
          <Button
            w="100%"
            colorScheme="green"
            size="lg"
            onClick={e => {
              navigate("/gameroom");
            }}
          >
            Continue as {data?.getPlayerByPlayerId.name}
          </Button>
        ) : (
          data?.getNoneAssignedPlayers.map((player, index) => (
            <Button
              w="100%"
              colorScheme="green"
              size="lg"
              onClick={e => handlePlayerButtonClick(player.id)}
              key={index}
            >
              {player.name}
            </Button>
          ))
        )}
      </VStack>
    </Center>
  );
};
