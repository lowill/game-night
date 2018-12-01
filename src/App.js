import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map as IMap } from 'immutable';

import OverviewLayout from './overview/OverviewLayout.js';
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

    const settings = IMap({
      username,
      group,
      darkMode
    });

    const validation = validateSettings(settings);
    const dialog = validation.settingsValid === false ? this.renderSettings(settings) : null;

    this.state = {
      dialog: dialog,
      settings: settings
    };
  }

  render() {
    return(
      <div className="App" data-dark-mode={this.state.settings.get('darkMode')}>
        <div className="dialog" data-active={this.state.dialog !== null}>
          {this.state.dialog}
        </div>
        <div onClick={() => {fetch('http://127.0.0.1:3001/users', {credentials: 'include'})}}>TEST BUTTON REMOVE THIS</div>
        <div className="settings-open-button" onClick={this.openSettings}>Settings</div>
        <div className="App-content">
          <TabGroup>
            <TabItem label='Game Picker' key="picker"><GamePicker settings={this.state.settings} /></TabItem>
            <TabItem label='Scheduler' key="scheduler"><TimeSheet settings={this.state.settings} /></TabItem>
            <TabItem label='Overview' key="overview"><OverviewLayout settings={this.state.settings}><div/></OverviewLayout></TabItem>
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

    const settings = props.settings.toObject();

    this.state = {
      settings: settings,
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
        <div className="settings-dialog" onClick={function handleClick(event) {event.stopPropagation()}} onKeyDown={this.handleKeyDown}>
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

  handleKeyDown = event => {
    if(event.key === 'Enter') {
      this.save();
    }
  }

  handleChange = (key, event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState(function getNewState(prevState) {
      // prevState.settings[key] = value;
      const newSettings = {
        ...prevState.settings,
        [key]: value
      };
      return {
        settings: newSettings
      };
    })
  }

  save = event => {
    const validatedState = validateSettings(IMap(this.state.settings));
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
          const body = {
            group_name: this.state.settings.group
          };
          return fetch('http://127.0.0.1:3001/groups/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
        })
        .then(res => {
          if(res.ok) {
            return;
          }
          throw new Error('Failed to create group');
        })
        .then(() => {
          this.props.onSettingsChanged(IMap(this.state.settings));
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

function validateSettings(settings) {
  const validatedSettings = {
    validUsername: Utils.isNotBlank(settings.get('username')),
    validGroup: Utils.isNotBlank(settings.get('group'))
  };
  validatedSettings['settingsValid'] = Object.values(validatedSettings).reduce((prev, value) => prev && value, true);
  return validatedSettings;
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