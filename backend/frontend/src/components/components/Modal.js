import React from "react";
import ViewForm from "../layout/ViewForm";
import AddForm from "../layout/AddForm";
import UpdateForm from "../layout/UpdateForm";
import UserRoleForm from "../layout/UserRoleForm";
import AccessForm from "../layout/AccessForm";

// Modal
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      modalDialog: ""
    };
  }

  // Opens modal
  handleOpenModal = (event) => {
    this.setState({
      isModalOpen: true,
      modalDialog: event.currentTarget.dataset.modal
    });
  }

  // Closes modal
  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
      modalDialog: ""
    })

    // Reset portal state (credentials, user, success, error, accessDenied)
    this.props.resetState();
  };

  render() {
    const {
      state,
      handleCredentialsInputChange,
      handleUserInputChange,
      handleViewSubmission,
      handleAddSubmission,
      handleUpdateSubmission,
      handleUserRoleSubmission,
      handleAccessSubmission,
    } = this.props;

    const { modalDialog } = this.state;
    let displayModalDialog = null;

    // Display the correct modal dialog (form)
    if (modalDialog === "view-credentials") {
      displayModalDialog = (
        <ViewForm
          credentials={state.credentials}
          handleCredentialsInputChange={handleCredentialsInputChange}
          handleViewSubmission={handleViewSubmission}
        />
      );
    } else if (modalDialog === "add-credentials") {
      displayModalDialog = (
        <AddForm
          handleCredentialsInputChange={handleCredentialsInputChange}
          handleAddSubmission={handleAddSubmission}
        />
      );
    } else if (modalDialog === "update-credentials") {
      displayModalDialog = (
        <UpdateForm
          credentials={state.credentials}
          handleCredentialsInputChange={handleCredentialsInputChange}
          handleUpdateSubmission={handleUpdateSubmission}
        />
      );
    } else if (modalDialog === "assign-user-role") {
      displayModalDialog = (
        <UserRoleForm
          user={state.user}
          handleUserInputChange={handleUserInputChange}
          handleUserRoleSubmission={handleUserRoleSubmission}
        />
      );
    } else if (modalDialog === "assign-division") {
      displayModalDialog = (
        <AccessForm
          user={state.user}
          handleUserInputChange={handleUserInputChange}
          handleAccessSubmission={handleAccessSubmission}
        />
      );
    }

    // Form submission status:
    // Task was successful
    if (state.success) {
      displayModalDialog = (
        <p className="text-center">
          <span className="d-flex justify-content-center align-items-center fs-3 fw-bold text-success">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </span>
          <span>{state.success}</span>
        </p>
      );
      // User is not authorised to perform task
    } else if (state.accessDenied) {
      displayModalDialog = (
        <p className="text-center">
          <span className="d-flex justify-content-center align-items-center fs-3 fw-bold text-danger">
            <ion-icon name="close-circle-outline"></ion-icon>
          </span>
          <span>{state.accessDenied}</span>
        </p>
      );
      // An error occurred
    } else if (state.error) {
      displayModalDialog = (
        <p className="text-center">
          <span className="d-flex justify-content-center align-items-center fs-3 fw-bold text-danger">
            <ion-icon name="sad-outline"></ion-icon>
          </span>
          <span>{state.error}</span>
        </p>
      );
    }

    return (
      // Modal
      <div className={`custom-modal ${this.state.isModalOpen ? "" : "d-none"}`}>
        <div className="mx-auto position-relative bg-white custom-modal__dialog">
          <button
            type="button"
            className="btn btn-sm position-absolute top-0 end-0 p-2"
          >
            <span
              className="fs-3 text-secondary"
              onClick={this.handleCloseModal}
            >
              <ion-icon name="close-outline"></ion-icon>
            </span>
          </button>

          {/*Modal dialog*/}
          {displayModalDialog}
        </div>
      </div>
    );
  }
}

export default Modal;
