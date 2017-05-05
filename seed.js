const firebase = require('./fire')
const database = firebase.database()

function syncSeedToDatabase() {
  database.ref('users/').set({
    user1: {
      userName: "me",
      password: "mee",
      characters: {
        character1: "true",
      }
    }
  })
  database.ref('characters/').set({
    character1: {
      class: "cyborg",
      position: {
        x: 0,
        y: 0,
        direction: 0,
      },
      users: {
        user1: "true",
      }
    }
  })
}

syncSeedToDatabase()
