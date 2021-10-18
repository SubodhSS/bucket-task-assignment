import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import BucketsList from "./components/bucket.component";
import TasksList from "./components/tasks.component";
import BucketsTasksList from "./components/tasks.component";
import CreateBuckets from "./components/bucket.create.component";
import CreateTasks from "./components/tasks.create.component";

function App() {
  return (<Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/tasks/:id" exact component={CreateTasks} />
            <Route path="/tasks" component={TasksList} />
            <Route path="/buckets/:bucketId/tasks" component={BucketsTasksList} />
            <Route path="/buckets/:id" exact component={CreateBuckets} />
            <Route path="/buckets" component={BucketsList} />
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;