import axios from 'axios'
import { login, whoami } from './auth'

export const register = user =>
  dispatch =>
    axios.post('/api/users', user)
      .then(res => dispatch(login(res.data.email, res.data.password)))
      .catch(err => console.error('Could not create account', err))
