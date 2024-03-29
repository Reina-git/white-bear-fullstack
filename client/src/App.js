import React from "react";
import "./style/master.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
import CreateAnswer from "./components/pages/CreateAnswer";
import CreateImagery from "./components/pages/CreateImagery";
import ReviewImagery from "./components/pages/ReviewImagery";
import ReviewAnswer from "./components/pages/ReviewAnswer";
import AllCards from "./components/pages/AllCards";
import ReviewEmpty from "./components/pages/ReviewEmpty";
import Edit from "./components/pages/Edit";
import S3 from "./components/pages/S3";
import NotFound from "./components/pages/NotFound";
import jwtDecode from "jwt-decode";
import store from "./store/store";
import actions from "./store/actions";
import axios from "axios";

const authToken = localStorage.authToken;

if (authToken) {
   const currentTimeInSec = Date.now() / 1000;
   const user = jwtDecode(authToken);
   if (currentTimeInSec > user.exp) {
      console.log("expiredToken");
      store.dispatch({
         type: actions.UPDATE_CURRENT_USER,
         payload: {},
      });
      delete axios.defaults.headers.common["x-auth-token"];
   } else {
      console.log("valid token");
      store.dispatch({
         type: actions.UPDATE_CURRENT_USER,
         payload: user,
      });
      // set authorization headers for every request
      axios.defaults.headers.common["x-auth-token"] = authToken;
      const currentUrl = window.location.pathname;
      if (currentUrl === "/log-in") {
         window.location.href = "/create-answer";
      }
   }
} else {
   console.log("no token");
   delete axios.defaults.headers.common["x-auth-token"];
}

function App() {
   return (
      <Router>
         <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/create-answer" component={CreateAnswer} />
            <Route exact path="/create-imagery" component={CreateImagery} />
            <Route exact path="/review-imagery" component={ReviewImagery} />
            <Route exact path="/review-answer" component={ReviewAnswer} />
            <Route exact path="/all-cards" component={AllCards} />
            <Route exact path="/review-empty" component={ReviewEmpty} />
            <Route exact path="/edit" component={Edit} />
            <Route exact path="/s3" component={S3} />
            <Route component={NotFound} />
         </Switch>
      </Router>
   );
}

export default App;
