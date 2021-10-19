import React from "react";

/*Update form
 Used to update existing credentials.*/
const UpdateForm = ({credentials, handleCredentialsInputChange, handleUpdateSubmission}) => {
  const { unit, division, title, username, password } = credentials;
  return (
    <div>
      <h2 className="mb-5 h5 text-center">Update Credentials</h2>

      {/*Update form*/}
      <form onSubmit={handleUpdateSubmission}>
        <div className="mb-3">
          <label htmlFor="update-unit">Organisational Unit</label>
          <input
            type="text"
            name="unit"
            id="update-unit"
            value={unit}
            className="form-control"
            onChange={handleCredentialsInputChange}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="update-division">Division</label>
          <input
            name="division"
            id="update-division"
            value={division}
            className="form-control"
            onChange={handleCredentialsInputChange}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="update-title">Title</label>
          <input
            type="text"
            name="title"
            id="update-title"
            value={title}
            className="form-control"
            onChange={handleCredentialsInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="update-username">Username</label>
          <input
            type="text"
            name="username"
            id="update-username"
            value={username}
            className="form-control"
            onChange={handleCredentialsInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="update-password">Password</label>
          <input
            type="password"
            name="password"
            id="update-password"
            value={password}
            className="form-control"
            onChange={handleCredentialsInputChange}
            required
          />
        </div>

        <button type="submit" className="w-100 btn btn-outline-secondary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdateForm;
