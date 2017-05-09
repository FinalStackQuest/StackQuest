import React from 'react'
import { connect } from 'react-redux'

const Signup = () => (
  <div className="container signup-container">
    <form className="form-horizontal">
      <fieldset>
        <div id="legend">
          <legend className="">Register</legend>
        </div>
        <div className="control-group input-group">
          <label className="control-label">Username</label>
          <div className="controls">
            <input type="text" name="username" placeholder="" className="form-control input-lg" />
          </div>
        </div>

        <div className="control-group input-group">
          <label className="control-label">E-mail</label>
          <div className="controls">
            <input type="text" name="email" placeholder="" className="form-control input-lg" />
          </div>
        </div>

        <div className="control-group input-group">
          <label className="control-label">Password</label>
          <div className="controls">
            <input type="password" name="password" placeholder="" className="form-control input-lg" />
          </div>
        </div>

        <div className="control-group input-group">
          <div className="controls">
            <button className="btn btn-success">Register</button>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
)

const SignupContainer = connect(() => ({}))(Signup)

export default SignupContainer
