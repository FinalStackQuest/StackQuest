'use strict'

const db = require('APP/db')
const Character = db.model('characters')

const { mustBeLoggedIn } = require('./auth.filters')

module.exports = require('express').Router()
  .param('id', (req, res, next, id) => {
    Character.findById(id)
      .then(character => {
        if (!character) throw new Error('Character not found')
        req.character = character
        next()
      })
      .catch(next)
  })
  .get('/',
  mustBeLoggedIn,
  (req, res, next) =>
    Character.findAll()
      .then(characters => {
        if (characters.length === 0) throw new Error('Characters not found')
        res.json(characters)
      })
      .catch(next))
  .post('/',
  mustBeLoggedIn,
  (req, res, next) =>
    Character.create(req.body)
      .then(character => res.json(character))
      .catch(next))
  .get('/:id',
  mustBeLoggedIn,
  (req, res, next) =>
    res.json(req.character))
  .put('/:id',
  mustBeLoggedIn,
  (req, res, next) =>
    Character.update(req.body, {
      where: {
        id: req.params.id
      },
      returning: true
    })
      .spread((numAffected, updatedCharacter) => {
        if (updatedCharacter.length === 0) throw Error('Character not found')
        res.send(updatedCharacter[0])
      })
      .catch(next))
