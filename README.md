# Goal

The goal of this assignment is to create a mini-game that involves two players drawing cards from a deck of 52 playing cards at random. This involves building a server as well as a client (you can either build for web using React or for mobile using React Native). In either case, GraphQL should be used as the API for server and client to talk to each other.

# Functional Requirements

1. When a user opens the app (regardless of whether you chose to implement for web or mobile), it should ask if you want to play as Player A or Player B. For testing purposes since both players will be active at the same time, you would need to either open two different browsers (if you chose web) or two different phones / phone simulators (if you chose mobile).
2. Each player will take turns drawing cards at random from a deck of 52 playing cards:
   - The player whose turn it is should see a button to draw a card.
   - The player whose turn it is _not_ has nothing to do, and they wait for the other player to draw.
   - The turn alternates until the deck is empty or a player wins.
3. The UI should show these cards in order as they are being drawn (feel free to come up with what would make for a reasonable UI, but it should at least show the suit and rank).
4. A player wins if they draw a card of the same rank as the previous card drawn by the opponent. For example: if Player B draws "Three of Clubs" after Player A draws "Three of Hearts", then Player B wins, and the game stops right there.
5. If no player has won by the time all 52 cards are dealt, the game is a draw.

# Functional Requirements ~ Extra Credit

1. Server only needs to support one active game at a time
2. Server does not need long term persistence. It is ok if server restart results in all data being lost. However, each of the two players' clients should be able to restart and resume from same spot in the game.

# Notes

1. What state should be stored on the server to be able to support this game
2. What GraphQL APIs (reads, writes, etc) should exist
3. How do the two clients know its their turn
4. How the code may be organized
5. How the cards should appear in the UX
