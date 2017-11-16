import React from 'react';
import { Button } from 'react-bootstrap';
import createReactClass from 'create-react-class';
import '../styles/Global.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Fluxxor from 'fluxxor';
import Header from '../components/Header';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const AppPage = createReactClass({
  mixins: [FluxMixin, StoreWatchMixin],

  componentDidMount() {
    this.getFlux().actions.DASHBOARD.initializeDashboard(this.props.params.siteKey);
  },

  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  getInitialState() {
    return {
      firstName: null,
      lastName: null,
      loginName: null
    }
  },

  loginToADFS (e) {
    e.preventDefault()
    window.location = 'http://localhost:8000/auth/login-adfs'
  },

  componentWillMount(){
    console.log(`**(Nav) Checking local storage...`)
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user')) /// TODO: error check - bad state 
      console.log(`**(Nav) User found in local storage...`)
      this.setState({
        firstName: user.firstName || user.email,
        lastName: user.lastName,
        loginName: user.email
      })
    } else {
      console.log(
        `**(Nav) User not found in local storage. Checking if user is logged in...`
      )
      
      fetch('http://localhost:8000/api/profile', {
        // credentials: 'include'
      }).then( response => {
          if (response.ok){
            const contentType = response.headers.get("content-type");
            if(contentType && contentType.includes("application/json")) {
              return response.json();
            }
            throw new TypeError("Oops, we haven't got JSON!");
        } else {
            throw new Error('Network response was not ok.');
        }
      }).then( json => {
          const { firstName, lastName, email } = json.data.user;
          localStorage.setItem('user', JSON.stringify(json.data.user))
          this.setState({
            firstName: firstName || email,
            lastName: lastName,
            loginName: email
          })
      }).catch( err => {
          console.log(
            `**(Nav) User is not logged. Redirecting to login page...`
          )
          console.log(err)
          window.location.href = '/#/login'
      })

    }

  },

  render () {
    if (this.state.firstName) {
      console.log('attempting Full View load ...');
      return this.renderFull()
    } else {
      console.log('attempting Login page load ...');
      return this.renderLogin()
    }
  },

  renderLogin() {
    return (
      <MuiThemeProvider>
      <div id="appn">
        <Header id="header"/>
          <Button
            color="secondary"
            onClick={this.loginToADFS}
            className="cursor-pointer">
            Login with ADFS
          </Button>
      </div>
     </MuiThemeProvider>
    )
  },

  renderFull() {
    console.log('attempting AppPage load ...');

    return (
      this.state.bbox.length ? 
      <MuiThemeProvider>
      <div id="appn">
        <Header id="header" flux={this.props.flux}
            {...this.props.params}
            title={this.state.title}
            logo={this.state.logo}
            category={this.props.params.siteKey}
            language={this.state.language}
            supportedLanguages={this.state.supportedLanguages}
            settings={this.state.settings} />
        <div id="main">
          <div id="content">
            {this.props.children}
          </div>
        </div>
      </div>
     </MuiThemeProvider> : 
    <div className="loadingPage">
      <h1>loading {this.props.params.siteKey} watcher...</h1>
    </div>
  )}
});
