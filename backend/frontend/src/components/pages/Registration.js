import React from "react";
import { withRouter } from "react-router-dom";

// Registration page
class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      email: null,
      username: null,
      password: "",
      confirmedPassword: "",
      formErrors: {
        username: null,
        password: null
      },
      error: null
    };
  }

  // Updates state with registration input change
  handleRegistrationInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }

  // Submits user's registration
  handleRegistrationSubmission = (event) => {
    event.preventDefault();
    const { name, email, username, password, confirmedPassword } = this.state;

    // Password and confirmed password should match
    if (password === confirmedPassword) {
      const user = {
        name,
        email,
        username,
        password
      };

      // Fetch arguments
      const parameters = {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(user)
      };

      fetch("/registration", parameters)
        .then((response) => response.json())
        .then(
          (results) => {
            if (results.error) {
              this.setState({
                password: "",
                confirmedPassword: "",
                formErrors: results.error
              });
              // Registration successful
            } else {
              this.setState({
                name: null,
                email: null,
                username: "",
                password: "",
                confirmedPassword: ""
              });

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
              password: "",
              confirmedPassword: "",
              error
            });
          }
        );
    } else {
      this.setState({
        password: "",
        confirmedPassword: "",
        formErrors: {
          password: "Password and confirmed password do not match."
        }
      });
    }
  };

  render() {
    let displayRegistrationContent = null;

    // An error occurred
    if (this.state.error) {
      displayRegistrationContent = (
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
      displayRegistrationContent = (
        <div className="row py-5">
          <div className="col-10 col-md-6 col-lg-4 offset-1 offset-md-3 offset-lg-4 py-4 px-3 border">
            <h1 className="h5 text-center">Credential Management</h1>
            <h2 className="mb-5 h5 text-center">Registration</h2>

            {/*Registration form */}
            <form onSubmit={this.handleRegistrationSubmission} className="form">
              <div className="mb-3">
                <label htmlFor="registration-name">Fullname</label>
                <input
                  type="text"
                  name="name"
                  id="registration-name"
                  onChange={this.handleRegistrationInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registration-email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="registration-email"
                  onChange={this.handleRegistrationInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div>
                <label htmlFor="registration-username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="registration-username"
                  onChange={this.handleRegistrationInputChange}
                  className="form-control"
                  required
                />
              </div>

              {/*Username error */}
              {this.state.formErrors.username && (
                <div className="text-danger form__error">
                  {this.state.formErrors.username}
                </div>
              )}

              <div className="my-3">
                <label htmlFor="registration-password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  id="registration-password"
                  autoComplete="off"
                  onChange={this.handleRegistrationInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div>
                <label htmlFor="registration-confirmed-password">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmedPassword"
                  value={this.state.confirmedPassword}
                  id="registration-confirmed-password"
                  autoComplete="off"
                  onChange={this.handleRegistrationInputChange}
                  className="form-control"
                  required
                />
              </div>

              {/*Password error */}
              {this.state.formErrors.password && (
                <div className="text-danger form__error">
                  {this.state.formErrors.password}
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
        {displayRegistrationContent}
      </main>
    );
  }
}

export default withRouter(Registration);
