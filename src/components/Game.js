import React, { Component } from "react";
import MatchGame from "./MatchGame";

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: 1
    };
  }

  startNewGame = () => {
    console.log(this.state.gameId);

    this.setState(prevState => ({
      gameId: prevState.gameId + 1
    }));
  };

  render() {
    return (
      <MatchGame key={this.state.gameId} startNewGame={this.startNewGame} />
    );
  }
}

export default Game;
