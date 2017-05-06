'use strict'

const db = require('APP/db')
const Character= db.model('characters')

const {mustBeLoggedIn} = require('./auth.filters')

module.exports = require('express').Router()
  .get('/',
    mustBeLoggedIn,
    (req, res, next) =>
      Character.findAll()
      .then(characters => {
        if (characters.length === 0) return res.sendStatus(404)
        res.json(characters)
      })
      .catch(next))
  .get('/:id',
    mustBeLoggedIn,
    (req, res, next) =>
      Character.findById(req.params.id)
      .then(user => res.json(user))
      .catch(next))
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
        if (updatedCharacter[0]) res.send(updatedCharacter[0])
        else next('not found')
      })
      .catch(next))
