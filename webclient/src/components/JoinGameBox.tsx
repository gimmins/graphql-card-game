import { Box, Center, Grid, GridItem } from "@chakra-ui/react";
import { CornerDecoration } from "./CornerDecoration";

export const JoinGameBox = ({ children }) => {
  return (
    <Center minW="860px">
      <Grid
        templateRows="repeat(10, 1fr)"
        templateColumns="repeat(16, 1fr)"
        minW="860px"
      >
        <GridItem w="110px" rowSpan={2} colSpan={2}>
          <CornerDecoration fill="yellow.400" boxSize="100px" />
        </GridItem>
        <GridItem rowSpan={2} colSpan={12}>
          <Box w="100%" h="100%" borderTop="3px solid #ECC94B" mt="22px" />
        </GridItem>
        <GridItem
          w="110px"
          rowSpan={2}
          display="flex"
          justifyContent="end"
          colSpan={2}
        >
          <CornerDecoration
            fill="yellow.400"
            boxSize="100px"
            css={{
              transform: "rotate(90deg)",
            }}
          />
        </GridItem>
        <GridItem
          rowSpan={6}
          colSpan={2}
          alignContent="center"
          display="flex"
          alignItems="center"
        >
          <Box w="100%" h="90%" borderLeft="3px solid #ECC94B" ml="23px" />
        </GridItem>
        <GridItem rowSpan={6} colSpan={12}>
          {children}
        </GridItem>
        <GridItem rowSpan={6} colSpan={2} display="flex" alignItems="center">
          <Box w="100%" h="90%" borderRight="3px solid #ECC94B" mr="23px" />
        </GridItem>
        <GridItem
          w="110px"
          rowSpan={2}
          display="flex"
          alignItems="end"
          colSpan={2}
        >
          <CornerDecoration
            boxSize="100px"
            fill="yellow.400"
            css={{
              transform: "rotate(270deg)",
            }}
          />
        </GridItem>
        <GridItem rowSpan={2} colSpan={12}>
          <Box w="100%" h="100%" borderTop="3px solid #ECC94B" mt="75px" />
        </GridItem>
        <GridItem
          w="100%"
          rowSpan={2}
          colSpan={2}
          display="flex"
          alignItems="end"
          justifyContent="end"
        >
          <CornerDecoration
            boxSize="100px"
            fill="yellow.400"
            css={{
              transform: "rotate(180deg)",
            }}
          />
        </GridItem>
      </Grid>
    </Center>
  );
};
