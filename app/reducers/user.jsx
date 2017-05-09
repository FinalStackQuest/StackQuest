import axios from 'axios'
import { login, whoami } from './auth'

export const register = user =>
  dispatch =>
    axios.post('/api/users', user)
      .then(res => dispatch(login(res.data.email, res.data.password)))
      .catch(err => console.error('Could not create account', err))

export const createCharacter = character =>
  dispatch =>
    axios.post('/api/characters', character)
      .then(() => dispatch(whoami()))
      .catch(err => console.error('Problem with retrieving character', err))
