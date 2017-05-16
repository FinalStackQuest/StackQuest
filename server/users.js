'use strict'

const db = require('APP/db')
const User = db.model('users')
const Character = db.model('characters')

const { mustBeLoggedIn, forbidden } = require('./auth.filters')

module.exports = require('express').Router()
  .get('/',
  forbidden('listing users is not allowed'),
  (req, res, next) =>
    User.findAll()
      .then(users => res.json(users))
      .catch(next))
  .post('/',
  (req, res, next) =>
    User.create(req.body)
      .then(user => {
        Character.create({
          hp: 100,
          weaponName: 'Basic Weapon',
          armorName: 'Basic Armor',
          x: 783,
          y: 716,
          currentMap: 'caveState',
          user_id: user.id
        })
          .then(res.status(201).json(user))
      })
      .catch(next))
  .get('/:id',
  mustBeLoggedIn,
  (req, res, next) =>
    User.findById(req.params.id)
      .then(user => {
        if (!user) throw new Error('User not found')
        res.json(user)
      })
      .catch(next))
