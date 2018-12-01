import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@gouch/to-title-case';
import AutoComplete from './AutoComplete.js';
import Utils from '../utils/Utils.js';

import './GamePicker.css';

class GamePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gamesList: [],
      ready: false,
      selectedGames: []
    };
  }

  refreshGames = () => {
    fetchGames()
      .then(body => {
        if(body !== undefined) {
          this.setState(function() {
            const gamesList = body !== undefined && body.games !== undefined ? body.games : [];
            return {
              gamesList: gamesList,
              ready: true
            };
          });          
        }
      })
      .catch(console.error);

    this.updateGamesView();
  }

  componentDidMount() {
    this.refreshGames();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.settings.get('group') !== this.props.settings.get('group')) {
      this.refreshGames();
    }
  }

  render() {
    const title = Utils.isNotBlank(this.props.settings.get('group'))
      ? `Activity Selection for ${this.props.settings.get('group')}` 
      : 'Activity Selection';

    return(
      <div className="gamepicker">
        <div className="gamepicker-title">{title}</div>
        <SelectedGamesView gameTitles={this.state.selectedGames} settings={this.props.settings} onClick={this.handleGameViewClick} />
        {
          this.state.ready === true
            ? <AutoComplete choices={this.state.gamesList} onSelect={this.handleGameSelected} ref={this.initField} />
            : <div>Waiting for games list...</div>
        }
      </div>
    );
  }

  initField = field => {
    this.field = field;
  }

  handleGameSelected = term => {
    const body = {
      username: this.props.settings.get('username'),
      group: this.props.settings.get('group'),
      selected_game: term
    };
    return fetch('http://127.0.0.1:3001/games/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(this.updateGamesView.bind(this))
      .catch(console.error);
  }

  updateGamesView = () => {
    fetchSelectedGames(this.props.settings.get('username'), this.props.settings.get('group'))
      .then(this.setState.bind(this));    
  }

  handleGameViewClick = () => {
    this.updateGamesView();
  }
}

GamePicker.propTypes = {
  settings: PropTypes.object
};

GamePicker.defaultProps = {
  settings: {}
};

function SelectedGamesView({ gameTitles, settings, onClick }) {
  return(
    <div className="selected-games">
      {gameTitles
        .map(function convertToObjects(gameTitle) {
          return {
            gameTitle: gameTitle
          };
        })
        .map(function GameView({ gameTitle }) {
          function handleGameViewClick() {
            const body = { 
              username: settings.get('username'),
              group: settings.get('group'),
              deselected_game: gameTitle
            };
            return fetch('http://127.0.0.1:3001/games/deselect', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            })
              .then(res => res.json())
              .then(onClick)
              .catch(console.error);
          }
          return <div className="game-view" onClick={handleGameViewClick} title="Click to remove" key={gameTitle}>{gameTitle}</div>        
        })
      }
    </div>
  );
}

function fetchGames() {
  const address = '127.0.0.1';
  const port = 3001;
  return fetch(`http://${address}:${port}/games`)
    .then(res => res.json())
    .catch(console.error);
}

function fetchSelectedGames(username, group) {
  const body = {
    group
  };

  return fetch('http://127.0.0.1:3001/games/selected', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
      return function getNewState(state, props) {
        return {
          selectedGames: data.selected_games.filter(item => item.username === username).map(item => item.game_name)
        };
      };
    })
    .catch(err => console.error(err.message));
}

export default GamePicker;