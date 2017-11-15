import React, { Component } from 'react'

export default class Login extends Component {
  loginToADFS (e) {
    e.preventDefault()
    window.location = '/auth/login-adfs'
  }


  render () {
    return (
      <div>
        <div className="container">
          <input
            color="secondary"
            onClick={this.loginToADFS.bind(this)}
            className="cursor-pointer"
          >
            Login with ADFS
          </input>{' '}
        </div>
      </div>
    )
  }
}
