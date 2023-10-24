import React from "react";
import "./App.css";
import { gql, useQuery } from "@apollo/client";

// This is an example query. Replace this with what you need
const EXAMPLE_QUERY = gql`
  query example {
    exampleObjects {
      foo
      bar
    }
  }
`;

function CardDealer() {
  const { data, error } = useQuery(EXAMPLE_QUERY);

  if (error || data == null) {
    return (
      <div className="App">
        <p>An error occurred</p>
      </div>
    );
  }

  return (
    <div className="App">
      {data.exampleObjects.map(exampleObject => (
        <p>{exampleObject.foo}</p>
      ))}
    </div>
  );
}

export default CardDealer;
