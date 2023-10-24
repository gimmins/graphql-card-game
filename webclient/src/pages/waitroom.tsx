import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Button, Center, VStack } from "@chakra-ui/react";

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

const GET_DEAL = gql`
  subscription Subscription {
    deal {
      title
      description
    }
  }
`;

export const WaitRoom = () => {
  const playerId = localStorage.getItem("playerId");
  const { data: subscriptionData, loading: subscriptionLoading } =
    useSubscription(GET_DEAL);
  const { data, loading, refetch } = useQuery(GET_NONE_ASSIGNED_PLAYERS);
  const navigate = useNavigate();
  const [setPlayer] = useMutation(SET_PLAYERS, {
    onCompleted: data => {
      if (data.setPlayer.code === 200) {
        navigate("/gameroom");
      }
    },
  });

  useEffect(() => {
    console.log(subscriptionData);
  }, [subscriptionData]);

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
            Continue as {data?.getPlayerByPlayerId?.name}
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
              {player?.name}
            </Button>
          ))
        )}
      </VStack>
    </Center>
  );
};
