const firebase = require('../../fire/index.js')
const database = firebase.database()
import StackQuest from '../main'

export const GamePlayers = {

}

export function updateCoordinates(x, y, direction, currentCharId) {
  // updates the x and y coordinates of the user's character
  database.ref('characters/' + currentCharId + '/position').update({
    x, y, direction,
  })
}

// Updates the phaser models
export function updateGame(characters) {
  for (const characterId in characters) {
    if (!GamePlayers[characterId]) {
      GamePlayers[characterId] = StackQuest.add.text(characters[characterId].position.x, characters[characterId].position.y, 'wizard', { font: '32px Arial', fill: '#ffffff', align: 'center' })
      GamePlayers[characterId].anchor.set(0.5, 1)
    } else {
      const currentPlayer = GamePlayers[characterId]
      currentPlayer.position.x = characters[characterId].position.x
      currentPlayer.position.y = characters[characterId].position.y
      // currentPlayer.body.rotation = characters[characterId].position.rotation
    }
    // StackQuest.add.text(currentChar.position.x, currentChar.position.y, currentChar.class, { font: '20px Arial', fill: '#ffffff', align: 'center' })
  }
}

// A listener for updated character positions
export const onCharacterUpdate = database.ref('characters/')
onCharacterUpdate.on('value', snapshot => {
  const characters = snapshot.val()

  updateGame(characters)
})

// When a user creates a character
export function addCharacter(currentCharId, character) {
  GamePlayers[currentCharId] = StackQuest.add.text(character.position.x, character.position.y, 'wizard', { font: '32px Arial', fill: '#ffffff', align: 'center' })
  GamePlayers[currentCharId].anchor.set(0.5, 1)
  // GamePlayers[currentCharId] = StackQuest.add.sprite(character.position.x, character.position.y, 'link')
  database.ref('characters/' + currentCharId).set(character)
}

// A listener for a new character
