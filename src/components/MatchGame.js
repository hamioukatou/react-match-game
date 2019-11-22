import React, { Component } from "react";
import utils from "../utils";

export default class MatchGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stars: utils.random(1, 9),
      candidateNums: [],
      availableNums: utils.range(1, 9),
      secondsLeft: 10,
      timer: "",
      gameId: 1
    };
  }

  decrementTimeRemaining = () => {
    if (this.state.secondsLeft > 0) {
      this.setState({
        secondsLeft: this.state.secondsLeft - 1
      });
    }
  };

  componentDidMount() {
    this.setTimer();
  }

  setTimer = () => {
    const timer = setInterval(() => {
      this.decrementTimeRemaining();
    }, 1000);
    this.setState(
      {
        timer: timer
      },
      () => {
        console.log(this.state);
      }
    );
  };

  //   resetGame = () => {
  //     this.setState(
  //       {
  //         stars: utils.random(1, 9),
  //         candidateNums: [],
  //         availableNums: utils.range(1, 9),
  //         secondsLeft: 10
  //       },
  //       () => {
  //         clearInterval(this.state.timer);
  //         this.setTimer();
  //       }
  //     );
  //   };

  handleClick = (number, btnStatus, gameStatus) => {
    if (gameStatus !== "active" || btnStatus === "used") {
      return;
    }

    let candidates = [...this.state.candidateNums];
    const newCandidateNums =
      btnStatus === "available"
        ? [...this.state.candidateNums, number]
        : candidates.filter(cn => cn !== number);

    if (utils.sum(newCandidateNums) !== this.state.stars) {
      this.setState(
        {
          candidateNums: newCandidateNums
        },
        () => {
          console.log(this.state);
        }
      );
    } else {
      let available = [...this.state.availableNums];
      const newAvailableNums = available.filter(
        n => !newCandidateNums.includes(n)
      );

      this.setState(
        {
          stars: utils.randomSumIn(newAvailableNums, 9),
          candidateNums: [],
          availableNums: newAvailableNums
        },
        () => {
          console.log(this.state);
        }
      );
    }
  };

  render() {
    const { startNewGame } = this.props;
    // Color Theme
    const colors = {
      available: "lightgray",
      used: "lightgreen",
      wrong: "lightcoral",
      candidate: "deepskyblue"
    };

    const candidatesAreWrong =
      utils.sum(this.state.candidateNums) > this.state.stars;

    const numberStatus = number => {
      if (!this.state.availableNums.includes(number)) {
        return "used";
      }
      if (this.state.candidateNums.includes(number)) {
        return candidatesAreWrong ? "wrong" : "candidate";
      }
      return "available";
    };

    const gameStatus =
      this.state.availableNums.length === 0
        ? "won"
        : this.state.secondsLeft === 0
        ? "lost"
        : "active";

    return (
      <div className="game">
        <h3 className="help">Match Game</h3>
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="left">
            {gameStatus !== "active" ? (
              <div className="game-done">
                <div
                  className="message"
                  style={{
                    color: gameStatus === "lost" ? "red" : "green"
                  }}
                >
                  {gameStatus === "lost" ? "Game Over" : "Nice"}
                </div>
                <button onClick={startNewGame}>Play Again</button>
              </div>
            ) : (
              utils
                .range(1, this.state.stars)
                .map(number => <div key={number} className="star"></div>)
            )}
          </div>
          <div className="right">
            {utils.range(1, 9).map(number => (
              <button
                onClick={() => {
                  this.handleClick(number, numberStatus(number), gameStatus);
                }}
                key={number}
                className="number"
                style={{ backgroundColor: colors[numberStatus(number)] }}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
        <div className="timer">Time Remaining: {this.state.secondsLeft}</div>
      </div>
    );
  }
}
