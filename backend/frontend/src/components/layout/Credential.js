import React from "react";

// Template for each credentials
const Credential = ({userRoles, unit, division, repository, handleUpdateButton}) => {
  return (
    <div className="p-3 mb-3 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center bg-white rounded">
      <div>
        <div className="d-flex flex-column flex-md-row justify-content-start align-items-start">
          <span className="me-2 fw-bold">Organisational Unit:</span>
          <span>{unit}</span>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-start align-items-start">
          <span className="me-2 fw-bold">Division:</span>
          <span>{division}</span>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-start align-items-start">
          <span className="me-2 fw-bold">Title:</span>
          <span>{repository.title}</span>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-start align-items-start">
          <span className="me-2 fw-bold">Username:</span>
          <span>{repository.username}</span>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-start align-items-start">
          <span className="me-2 fw-bold">Password:</span>
          <span>{repository.password}</span>
        </div>
      </div>

      {/*Update credentials button
      Only management and admin may update credentials.*/}
      {userRoles.management || userRoles.admin ? (
        <div className="align-self-center">
          <button
            type="button"
            data-modal="update-credentials"
            data-id={repository._id}
            className="btn btn-sm btn-outline-secondary"
            onClick={handleUpdateButton}
          >
            Update
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Credential;
