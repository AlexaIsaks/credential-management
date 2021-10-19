import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./styles/App.scss";
import Header from "./components/layout/Header";
import Login from "./components/pages/Login";
import Registration from "./components/pages/Registration";
import Portal from "./components/pages/Portal";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // User is logged in
      isLoggedIn: false,
    };
  }

  // Sets isLoggedIn property
  setLogin = (loggedIn) => {
    this.setState({
      isLoggedIn: loggedIn
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="min-vh-100" data-testid="app">
          {/*Site header*/}
          <Header isLoggedIn={this.state.isLoggedIn} setLogin={this.setLogin} />

          {/*Login page*/}
          <Route exact path="/">
            <Login setLogin={this.setLogin} />
          </Route>

          {/*Registration page*/}
          <Route path="/registration">
            <Registration setLogin={this.setLogin} />
          </Route>

          {/*Portal page */}
          <Route path="/portal">
            <Portal
              isLoggedIn={this.state.isLoggedIn}
              setLogin={this.setLogin}
            />
          </Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
