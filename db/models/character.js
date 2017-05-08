'use strict'

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const {ENUM, INTEGER, STRING} = require('sequelize')

module.exports = db => db.define('characters', {
  hp: INTEGER,
  weaponName: STRING,
  armorName: STRING,
  x: {
    type: STRING,
    set: (xCoord) => {
      this.setDataValues('x', String(xCoord))
    },
    get: () => String(this.getDataValue('x'))
  },
  y: {
    type: STRING,
    set: (yCoord) => {
      this.setDataValues('y', String(yCoord))
    },
    get: () => String(this.getDataValue('y'))
  },
  class: ENUM('wizard', 'cyborg')
})

module.exports.associations = (Character, {User}) => {

}
