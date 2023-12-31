import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Login from './pages/Login';
import Wallet from './pages/Wallet';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/carteira">
            <Wallet />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
