import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { createCharacter } from 'APP/app/reducers/user'

const Character = ({ characterClass, changeClassSelection, selectCharacterClass }) =>
  <div id="container">
    <form onSubmit={selectCharacterClass}>
      <label><h3>Choose a Character</h3></label>
      <div className="input-group">
        <div className="character-class-container">
          <div
            className={`character-class-choice ${characterClass === 'wizard' ? 'character-class-selected' : ''}`}
            value="wizard"
            onClick={changeClassSelection}>
            <span className="no-select">WIZARD</span>
          </div>
          <div
            className={`character-class-choice ${characterClass === 'cyborg' ? 'character-class-selected' : ''}`}
            value="cyborg"
            onClick={changeClassSelection}>
            <span className="no-select">CYBORG</span>
          </div>
        </div>
      </div>
      <div className="input-group">
        <button className="btn btn-success" type="submit">Select Character</button>
      </div>
    </form>
  </div>

class LocalContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      characterClass: ''
    }
    this.changeClassSelection = this.changeClassSelection.bind(this)
    this.selectCharacterClass = this.selectCharacterClass.bind(this)
  }

  changeClassSelection(event) {
    this.setState({ characterClass: event.target.getAttribute('value') })
  }

  selectCharacterClass(event) {
    event.preventDefault()
    //  this needs to change based off of what
    //  character user chooses
    if (this.state.characterClass) {
      const newCharacter = {
        hp: 100,
        weaponName: 'Basic Weapon',
        armorName: 'Basic Armor',
        x: 500,
        y: 500,
        currentMap: 'fantasyState',
        class: this.state.characterClass,
        user_id: this.props.user.id
      }
      this.props.createCharacter(newCharacter)
    }
  }

  render() {
    return (
      <Character
        {...this.state}
        changeClassSelection={this.changeClassSelection}
        selectCharacterClass={this.selectCharacterClass}
      />
    )
  }
}

const CharacterContainer = connect(({ auth }) => ({ user: auth }), { createCharacter })(LocalContainer)

export default CharacterContainer
