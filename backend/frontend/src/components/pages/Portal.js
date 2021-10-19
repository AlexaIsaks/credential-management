import React from "react";
import { withRouter } from "react-router-dom";
import Modal from "../components/Modal";
import Credential from "../layout/Credential";

// Portal page
class Portal extends React.Component {
  constructor(props) {
    super(props);

    // Modal reference
    this.modal = React.createRef();

    this.state = {
      // Single credentials
      credentials: {
        unit: "",
        division: "",
        repositoryId: null,
        title: null,
        username: null,
        password: null
      },
      // User
      user: {
        username: "",
        userRoles: {
          normal: false,
          management: false,
          admin: false
        },
        unit: "",
        division: ""
      },
      token: null,
      userRoles: {},
      repositories: null,
      repositoryStatus: {
        isLoaded: false,
        error: null,
        accessDenied: null
      },
      success: null,
      error: null,
      accessDenied: null
    };
  }

  // Check if user has access to portal page
  componentDidMount() {
    const token = this.props.history.location.state;

    // Allow user to refresh page and still have access to portal
    if (token) {
      this.props.setLogin(true);

      const parameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      fetch("/portal", parameters)
        .then((response) => response.json())
        .then((results) => {
          if (results.portalAccessDenied) {
            this.props.history.push("/");
          } else if (results.portalAccess) {
            this.props.setLogin(true);

            this.setState({
              token,
              userRoles: results.userRoles
            });

            this.fetchAllRepositories();
          }
        });
    } else {
      this.props.history.push("/");
    }
  }

  // Retrieves all repositories that the user has access to
  fetchAllRepositories = () => {
    const parameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.token}`
      }
    };

    // Retrieve all repositories accessible by user
    fetch("/all-repositories", parameters)
      .then((response) => response.json())
      .then(
        (results) => {
          if (results.error) {
            this.setState({
              repositoryStatus: {
                isLoaded: false,
                error: results.error,
                accessDenied: null
              }
            });
          } else if (results.accessDenied) {
            this.setState({
              repositoryStatus: {
                isLoaded: false,
                error: null,
                accessDenied: results.accessDenied
              }
            });
          } else {
            this.setState({
              repositoryStatus: {
                isLoaded: true,
                error: null,
                accessDenied: null
              },
              repositories: results
            });
          }
        },
        (error) => {
          this.setState({
            repositoryStatus: {
              isLoaded: false,
              error,
              accessDenied: null
            }
          });
        }
      );
  }

  // Opens modal
  handleModal = (event) => {
    this.modal.current.handleOpenModal(event);
  }

  // Resets state when modal is closed and when submission is complete
  resetState = () => {
    this.setState({
      credentials: {
        unit: "",
        division: "",
        repositoryId: null,
        title: null,
        username: null,
        password: null
      },
      user: {
        username: "",
        userRoles: {
          normal: false,
          management: false,
          admin: false
        },
        unit: "",
        division: ""
      },
      success: null,
      error: null,
      accessDenied: null
    });
  }

  // Updates state with credentials input
  handleCredentialsInputChange = (event) => {
    const input = event.target;
    const name = input.name;
    const value = input.value;

    this.setState((prevState) => ({
      credentials: {
        ...prevState.credentials,
        [name]: value
      },
    }));
  }

  // Updates state with user details input
  handleUserInputChange = (event) => {
    const input = event.target;
    const name = input.name;
    let value = input.value;

    // User roles update
    if (name === "userRoles") {
      let userRoles = this.state.user.userRoles;

      if (value === "normal") {
        userRoles.normal = true;
        userRoles.management = false;
        userRoles.admin = false;
      } else if (value === "management") {
        userRoles.normal = false;
        userRoles.management = true;
        userRoles.admin = false;
      } else {
        userRoles.normal = false;
        userRoles.management = false;
        userRoles.admin = true;
      }

      value = userRoles;
    }

    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [name]: value,
      },
    }));
  }

  // Submits unit and division values to retrieve a single division's credential repository
  handleViewSubmission = (event) => {
    event.preventDefault();

    const { unit, division } = this.state.credentials;

    // Fetch arguments
    const parameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({ unit, division })
    };

    fetch("/repository", parameters)
      .then((response) => response.json())
      .then(
        (results) => {
          if (results.error) {
            this.setState({
              error: results.error
            });
          } else if (results.accessDenied) {
            this.setState({
              accessDenied: results.accessDenied
            });
          } else {
            this.setState({
              repositories: results,
              repositoryStatus: {
                isLoaded: true,
                error: null,
                accessDenied: null
              }
            });
            this.modal.current.handleCloseModal();
          }
        },
        (error) => {
          this.setState({
            error
          });
        }
      );
  }

  // Submits new credentials
  handleAddSubmission = (event) => {
    event.preventDefault();

    const parameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify(this.state.credentials)
    };

    fetch("/add-credentials", parameters)
      .then((response) => response.json())
      .then(
        (results) => {
          if (results.error) {
            this.setState({
              error: results.error
            });
          } else if (results.accessDenied) {
            this.setState({
              accessDenied: results.accessDenied
            });
          } else {
            this.setState({
              success: results.success
            });

            this.fetchAllRepositories();
          }
        },
        (error) => {
          this.setState({
            error
          });
        }
      );
  }

  // Finds the selected credential which will be passed to the update form
  handleUpdateButton = (event) => {
    const id = event.target.dataset.id;

    let credentials = {};

    // Find repository
    this.state.repositories.forEach((division) => {
      const credentialFound = division.repository.find((repository) => {
        return id === repository._id;
      });

      // Add credetails details
      if (credentialFound) {
        credentials.unit = division.unit;
        credentials.division = division.division;
        credentials.repositoryId = credentialFound._id;
        credentials.title = credentialFound.title;
        credentials.username = credentialFound.username;
        credentials.password = credentialFound.password;
      }
    });

    this.setState({
      credentials
    });

    // Open modal
    this.handleModal(event);
  }

  // Submits updated credentials
  handleUpdateSubmission = (event) => {
    event.preventDefault();

    // Fetch arguments
    const parameters = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify(this.state.credentials)
    };

    fetch("/update-credentials", parameters)
      .then((response) => response.json())
      .then(
        (results) => {
          if (results.error) {
            this.setState({
              error: results.error
            });
          } else if (results.accessDenied) {
            this.setState({
              accessDenied: results.accessDenied
            });
          } else {
            this.setState({
              success: results.success
            });
            this.fetchAllRepositories();
          }
        },
        (error) => {
          this.setState({
            error
          });
        }
      );
  }

  // Submits updated/changed user roles
  handleUserRoleSubmission = (event) => {
    event.preventDefault();

    // Fetch arguments
    const parameters = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify(this.state.user)
    };

    fetch("/assign-roles", parameters)
      .then((response) => response.json())
      .then(
        (results) => {
          if (results.error) {
            this.setState({
              error: results.error
            });
          } else if (results.accessDenied) {
            this.setState({
              accessDenied: results.accessDenied
            });
          } else {
            this.setState({
              success: results.success
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

  // Submits the organisational unit and division details to grant or remove access
  handleAccessSubmission = (event) => {
    event.preventDefault();

    const { username, unit, division } = this.state.user;
    const submitButton = document.activeElement.dataset.access;

    // Check which button was clicked (assign or remove)
    let endpoint = submitButton === "assign" ? "/assign-access" : "/remove-access";

    // Fetch arguments
    const parameters = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({ username, unit, division })
    };

    fetch(endpoint, parameters)
      .then((response) => response.json())
      .then(
        (results) => {
          if (results.error) {
            this.setState({
              error: results.error
            });
          } else if (results.accessDenied) {
            this.setState({
              accessDenied: results.accessDenied
            });
          } else {
            this.setState({
              success: results.success
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
    const { repositories, repositoryStatus } = this.state;
    let displayRepositories = null;

    // An error occurred 
    if (repositoryStatus.error) {
      displayRepositories = (
        <p className="text-center">
          <span className="d-flex justify-content-center align-items-center fs-3 fw-bold text-danger">
            <ion-icon name="sad-outline"></ion-icon>
          </span>
          <span>{repositoryStatus.error}</span>
        </p>
      );
      // User has no access to the division repository
    } else if (repositoryStatus.accessDenied) {
      displayRepositories = (
        <p className="text-center">
          <span className="d-flex justify-content-center align-items-center fs-3 fw-bold text-danger">
            <ion-icon name="close-circle-outline"></ion-icon>
          </span>
          <span>{repositoryStatus.accessDenied}</span>
        </p>
      );
      // Waiting for repository to be laoded
    } else if (!repositoryStatus.isLoaded) {
      displayRepositories = (
        <p className="text-center">
          <span className="d-flex justify-content-center align-items-center fs-3 fw-bold text-primary">
            <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
          </span>
          <span data-testid="credentials-loading">Credentials loading...</span>
        </p>
      );
      // No repository available
    } else if (repositoryStatus.isLoaded && repositories.length === 0) {
      displayRepositories = (
        <p className="text-center">
          <span className="d-flex justify-content-center align-items-center fs-3 fw-bold text-primary">
            <ion-icon name="sad-outline"></ion-icon>
          </span>
          <span>No credentials available.</span>
        </p>
      );
      // Display repositories
    } else {
      displayRepositories = repositories.map((division) => {
        return division.repository.map((repository) => {
          return (
            <Credential
              key={repository._id}
              userRoles={this.state.userRoles}
              unit={division.unit}
              division={division.division}
              repository={repository}
              handleUpdateButton={this.handleUpdateButton}
            />
          );
        });
      });
    }

    return (
      // Portal page main content
      <main className="pt-5">
        <div className="pt-4 pt-md-5 container-sm">
          <div className="row">

            {/*User tasks*/}
            <aside className="col-12 col-md-3 col-lg-2 h-100 ">
              <ul className="p-0 d-flex flex-wrap flex-md-column justify-content-start align-items-start list-unstyled">
                {/*View single repository*/}
                <li
                  data-modal="view-credentials"
                  onClick={this.handleModal}
                  className="mb-1 me-1 mb-md-3 me-md-0 btn btn-sm btn-outline-secondary"
                >
                  View Single Repository
                </li>
                {/*Add credentials*/}
                <li
                  data-modal="add-credentials"
                  onClick={this.handleModal}
                  className="mb-1 me-1 mb-md-3 me-md-0 btn btn-sm btn-outline-secondary"
                >
                  Add Credentials
                </li>

                {/*Only admin users may assign user roles and access rights*/}
                {this.state.userRoles.admin && (
                  <React.Fragment>
                    {/*Assign user roles*/}
                    <li
                      data-modal="assign-user-role"
                      className="mb-1 me-1 mb-md-3 me-md-0 btn btn-sm btn-outline-secondary"
                      onClick={this.handleModal}
                    >
                      Assign User Roles
                    </li>
                    {/*Assign/remove unit and division access*/}
                    <li
                      data-modal="assign-division"
                      className="mb-1 me-1 mb-md-3 me-md-0 btn btn-sm btn-outline-secondary"
                      onClick={this.handleModal}
                    >
                      Assign/Remove Unit and Division
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </aside>

            <div className="col-12 col-md-9 col-lg-10 p-3 bg-light">
              {/*Modal*/}
              <Modal
                ref={this.modal}
                state={this.state}
                handleCredentialsInputChange={this.handleCredentialsInputChange}
                handleUserInputChange={this.handleUserInputChange}
                handleViewSubmission={this.handleViewSubmission}
                handleAddSubmission={this.handleAddSubmission}
                handleUpdateSubmission={this.handleUpdateSubmission}
                handleUserRoleSubmission={this.handleUserRoleSubmission}
                handleAccessSubmission={this.handleAccessSubmission}
                resetState={this.resetState}
              />

              {/*Repositories*/}
              {displayRepositories}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default withRouter(Portal);
