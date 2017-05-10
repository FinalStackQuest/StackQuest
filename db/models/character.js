'use strict'

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const { ENUM, INTEGER, STRING } = require('sequelize')

module.exports = db => db.define('characters', {
  hp: INTEGER,
  weaponName: STRING,
  armorName: STRING,
  x: {
    type: STRING,
    set: function(xCoord) {
      console.log(this)
      return this.setDataValue('x', String(xCoord))
    },
    get: function() {
      return +this.getDataValue('x')
    }
  },
  y: {
    type: STRING,
    set: function(yCoord) {
      return this.setDataValue('y', String(yCoord))
    },
    get: function() {
      return +this.getDataValue('y')
    }
  },
  currentMap: STRING,
  class: ENUM('wizard', 'cyborg')
})
