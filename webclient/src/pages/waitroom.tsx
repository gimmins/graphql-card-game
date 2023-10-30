import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box, Button, Center, VStack } from "@chakra-ui/react";
import { CornerDecoration } from "../components/CornerDecoration";
import { JoinGameBox } from "../components/JoinGameBox";

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
  const value = useSubscription(GET_DEAL, {
    onSubscriptionData: ({ subscriptionData: data }) => {
      console.log(data);
    },
  });
  const { data, loading, refetch } = useQuery(GET_NONE_ASSIGNED_PLAYERS);
  const navigate = useNavigate();
  const [setPlayer] = useMutation(SET_PLAYERS, {
    onCompleted: data => {
      if (data.setPlayer.code === 200) {
        navigate("/gameroom");
      }
    },
  });

  // useEffect(() => {
  //   console.log(subscriptionData);
  // }, [subscriptionData]);

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
    <Center w="100%" h="100vh" bgColor="#449144">
      <JoinGameBox>
        <Box bgColor="#449144" h="100%">
          <VStack p={10} borderRadius={3} h="100%" justifyContent="center">
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
        </Box>
      </JoinGameBox>
    </Center>
  );
};
