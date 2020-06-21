// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";

import App from './App';
import Lobby from './Lobby';
import Transition from './Transition';
import Game from "./screens/Game";

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <div>
          {/* <Redirect from="*" to="/"/> */}
          <Route exact path={"/"} component={App} />    
          <Route path={"/transition"} component={Transition} />
          <Route path={"/lobby"} component={Lobby} />
          <Route path={"/game"} component={Game} />
        </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
