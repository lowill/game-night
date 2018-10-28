import React, { Component } from 'react';
import autocomplete from 'js-autocomplete';
import fuzz from 'fuzzball';

const gameSet = ['Grand Theft Auto 5', 'Civilization V', 'StarCraft II', 'Diablo 3', 'Minecraft', 'Terraria', 'Risk of Rain', 'Neverwinter Nights', 'Civilization IV', 'Civilization III', 'Civilization: Beyond Earth'];

class TestInput extends Component {
  render() {
    return(
      <div className="wrapper">
        <input type="text" ref={this.initInput}></input>
      </div>
    );
  }

  onSelect = (event, term, item) => {
    const matchAdd = term.match(/^Add: (.+)/);
    if(matchAdd !== null) {
      const entry = matchAdd[1];
      console.log(`Add: ${entry}`);
    }
    else {
      console.log(`Chosen: ${term}`);
    }
    this.input.value = '';
  }

  initInput = input => {
    this.input = input;
    this.completer = new autocomplete({
      selector: input,
      source: function(term, suggest) {

        const termLower = term.toLowerCase();
        const fuzzOpts = {
          scorer: fuzz.partial_ratio,
          cutoff: 75
        };
        const suggestions = fuzz
          .extract(termLower, gameSet, fuzzOpts)
          .map(suggestion => suggestion[0]);

        if(suggestions.length === 0) {
          suggest([`Add: ${term}`]);
        }
        else {
          suggest(suggestions);        
        }
      },
      minChars: 2,
      menuClass: `ac-menu`,
      onSelect: this.onSelect
    });
  }

}

export default TestInput;