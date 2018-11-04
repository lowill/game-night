import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabGroup from './components/TabGroup.js';
import TabItem from './components/TabItem.js';
import TimeSheet from './scheduler/TimeSheet.js';
import GamePicker from './picker/GamePicker.js';
import Settings from './settings/Settings.js';
import SettingsOption from './settings/SettingsOption.js';
import SettingsCheckboxInput from './settings/SettingsCheckboxInput.js';
import SettingsTextInput from './settings/SettingsTextInput.js';

import Utils from './utils/Utils.js';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    const username = localStorage.getItem('username') || '';
    const group = localStorage.getItem('group') || '';
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const settings = {
      username,
      group,
      darkMode
    };

    const validation = validateSettings(settings);
    const dialog = validation.settingsValid === false ? this.renderSettings(settings) : null;

    this.state = {
      dialog: dialog,
      settings: settings
    };
  }

  render() {
    return(
      <div className="App" data-dark-mode={this.state.settings.darkMode}>
        <div className="dialog" data-active={this.state.dialog !== null}>
          {this.state.dialog}
        </div>
        <div onClick={() => {fetch('http://127.0.0.1:3001/users', {credentials: 'include'})}}>TEST BUTTON REMOVE THIS</div>
        <div className="settings-open-button" onClick={this.openSettings}>Settings</div>
        <div className="App-content">
          <TabGroup>
            <TabItem label='Game Picker' key="picker"><GamePicker settings={this.state.settings} /></TabItem>
            <TabItem label='Scheduler' key="test"><TimeSheet settings={this.state.settings} /></TabItem>
          </TabGroup>
        </div>
      </div>
    );
  }

  openSettings = () => {
    this.setState(function getNewState() {
      return {
        dialog: this.renderSettings(this.state.settings)
      };
    });
  }

  closeSettings = () => {
    this.setState(function getNewState() {
      return {
        dialog: null
      };
    });
  }

  renderSettings = (settings) => {
    return <GameNightSettings settings={settings} close={this.closeSettings} onSettingsChanged={this.onSettingsChanged} />
  }

  onSettingsChanged = settings => {
    this.setState(function getNewState() {
      return {
        settings: settings
      };
    });
  }
}

class GameNightSettings extends Component {
  constructor(props) {
    super(props);

    const validation = {
      username: true,
      group: true,
      settingsValid: true
    };

    this.state = {
      settings: props.settings,
      validation: validation,
      // username: username,
      // group: group,
      // darkMode: darkMode,
      // validUsername: true,
      // validGroup: true,
      // settingsValid: true
    };
  }

  render() {
    return(
      <div>
        <div className="settings-dialog-overlay" onClick={this.save}/>
        <div className="settings-dialog" onClick={function handleClick(event) {event.stopPropagation()}}>
          <Settings valid={this.state.validation.settingsValid}>
            <div className="settings-header">Settings</div>
            <SettingsOption valid={this.state.validation.username}><label className="settings-label">Username</label><SettingsTextInput value={this.state.settings.username} onChange={this.handleChange.bind(null, 'username')}/></SettingsOption>
            <SettingsOption valid={this.state.validation.group}><label className="settings-label">Group</label><SettingsTextInput value={this.state.settings.group} onChange={this.handleChange.bind(null, 'group')}/></SettingsOption>
            <SettingsOption><label className="settings-label">Dark Mode</label><SettingsCheckboxInput checked={this.state.settings.darkMode} onChange={this.handleChange.bind(null, 'darkMode')}/></SettingsOption>
            <div className="settings-footer"><div className="settings-save-button settings-button" onClick={this.save}>Save</div></div>
          </Settings>
        </div>
      </div>
    );
  }

  handleChange = (key, event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState(function getNewState(prevState) {
      prevState.settings[key] = value;
      return {
        settings: prevState.settings
      };
    })
  }

  save = event => {
    const validatedState = validateSettings(this.state.settings);
    this.setState(function getNewState(prevState) {
      prevState.validation = validatedState;
      return {
        validation: prevState.validation
      };
    });
    if(validatedState.settingsValid === true) {
      new Promise((resolve, reject) => {
        localStorage.setItem('username', this.state.settings.username);
        localStorage.setItem('group', this.state.settings.group);
        localStorage.setItem('darkMode', this.state.settings.darkMode);
        resolve();
      })
        .then(() => {
          this.props.onSettingsChanged(this.state.settings);
          this.props.close();          
        })
        .catch(console.error);
    }
  }
}

GameNightSettings.propTypes = {
  close: PropTypes.func,
  settings: PropTypes.object,
  onSettingsChanged: PropTypes.func
};

function validateSettings(state) {
  const validatedState = {
    validUsername: Utils.isNotBlank(state.username),
    validGroup: Utils.isNotBlank(state.group)
  };
  validatedState['settingsValid'] = Object.values(validatedState).reduce((prev, value) => prev && value, true);
  return validatedState;
}

export default App;


// fetch('http://127.0.0.1:3001/users/settings', {
//   method: 'POST',
//   credentials: 'include',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify(requestBody)
// })
//   .then(res => res.json())
//   .then(res => {
//     console.log(document.cookie);
//     // localStorage.setItem('user_id', res.body.user_id);
//   })
//   .then(() => this.props.close())
//   .catch(err => {
//     console.error(`Failed to save settings `, err.message);
//   });