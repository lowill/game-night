import React, { Component } from 'react';
import fuzz from 'fuzzball';

import AutoCompleteInput from './AutoCompleteInput.js';
import './GamePicker.css';

class GamePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gamesList: [],
      ready: false
    };
  }

  componentDidMount() {
    fetchGames()
      .then(body => this.setState(function() {
        return {
          gamesList: body.games,
          ready: true
        };
      }));
  }

  render() {
    return(
      <div className="gamepicker">
        {
          this.state.ready === true
            ? <AutoCompleteInput sourceFn={this.gameSource} onSelect={this.onGameSelected} ref={this.initField} />
            : null
        }
      </div>
    );
  }

  initField = field => {
    this.field = field;
  }

  gameSource = (term, suggest) => {
    if(this.state.gamesList.length > 0) {
      const termLower = term.toLowerCase();
      const fuzzballOptions = {
        scorer: fuzz.partial_ratio,
        cutoff: 75
      };
      const suggestions = fuzz
        .extract(termLower, this.state.gamesList, fuzzballOptions)
        .map(suggestion => suggestion[0]);

      suggest(suggestions);
    }
  }

  onGameSelected(event, term, item) {

  }
}

function fetchGames() {
  const address = 'localhost';
  const port = 3001;
  return fetch(`http://${address}:${port}/games`)
    .then(res => res.json())
    .catch(console.error);
}

export default GamePicker;