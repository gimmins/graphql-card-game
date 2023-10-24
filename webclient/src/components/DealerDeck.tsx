import { gql, useMutation } from "@apollo/client";
import { Box, Center, Button, Image } from "@chakra-ui/react";

const DRAW_DECK = gql`
  mutation Draw($playerId: String) {
    draw(playerId: $playerId) {
      code
      success
      message
      cards
    }
  }
`;

export const DealerDeck = ({ gameStatus }) => {
  const playerId = localStorage.getItem("playerId");
  const [drawDeck] = useMutation(DRAW_DECK);

  const handleDrawDeck = () => {
    drawDeck({
      variables: {
        playerId,
      },
    });
  };

  return (
    <Center h="100%" p={5}>
      <Box position="relative">
        <Image src="cards/1B.svg" />
        <Center h="100%" w="100%" position="absolute" top="0">
          <Button
            w="80%"
            colorScheme="yellow"
            onClick={handleDrawDeck}
            border="2px"
            borderColor="white"
            isDisabled={gameStatus !== 4}
          >
            Draw
          </Button>
        </Center>
      </Box>
    </Center>
  );
};
