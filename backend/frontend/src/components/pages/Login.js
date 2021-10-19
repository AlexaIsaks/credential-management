import React from "react";
import { withRouter } from "react-router-dom";

// Login page
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: "",
      formErrors: null,
      error: null
    };
  }

  // Updates state with user's credentials
  handleLoginChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }

  // Submits user's login credentials
  handleLoginSubmission = (event) => {
    event.preventDefault();

    const { username, password } = this.state;

    // Fetch arguments
    const parameters = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username, password })
    };

    fetch("/login", parameters)
      .then((response) => response.json())
      .then(
        (results) => {
          if (results.error) {
            this.setState({
              password: "",
              formErrors: results.error
            });
            // Login successful
          } else {
            this.props.setLogin(true);
            // Redirect user to portal page
            this.props.history.push({
              pathname: "/portal",
              state: results.token
            });
          }
        },
        (error) => {
          this.setState({
            error
          });
        }
      );
  }

  render() {
    let displayLoginContent = null;

    // An error occurred
    if (this.state.error) {
      displayLoginContent = (
        <p className="pt-5 text-center">
          <span className="d-flex justify-content-center align-items-center fs-3 fw-bold text-danger">
            <ion-icon name="sad-outline"></ion-icon>
          </span>
          <span>
            An error has occurred. Please refresh the page or speak to you
            administrator.
          </span>
        </p>
      );
    } else {
      displayLoginContent = (
        <div className="row py-5">
          <div className="col-10 col-md-6 col-lg-4 offset-1 offset-md-3 offset-lg-4 py-4 px-3 border">
            <h1 className="h5 text-center">Credential Management</h1>
            <h2 className="mb-5 h5 text-center">Login</h2>

            {/*Login form */}
            <form onSubmit={this.handleLoginSubmission} className="form">
              <div className="mb-3">
                <label htmlFor="login-username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="login-username"
                  onChange={this.handleLoginChange}
                  className="form-control"
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  id="login-password"
                  autoComplete="off"
                  onChange={this.handleLoginChange}
                  className="form-control"
                  required
                />
              </div>

              {/*Login errors*/}
              {this.state.formErrors && (
                <div className="form__error text-danger">
                  {this.state.formErrors}
                </div>
              )}

              <button
                type="submit"
                className="mt-3 btn btn-outline-secondary w-100"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      );
    }
    return (
      <main className="pt-4 pt-md-5 min-vh-100 container">
        {/*Main content */}
        {displayLoginContent}
      </main>
    );
  }
}

export default withRouter(Login);
