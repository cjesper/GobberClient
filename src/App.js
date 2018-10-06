import React , {Component } from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import './App.css';

//Internal
import Main from './Main.js';
import Login from './components/Login.js'

const App = () => {
  return (
  <Router>
      <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={Main} />
      </Switch>
  </Router>
  )
}

export default App;
