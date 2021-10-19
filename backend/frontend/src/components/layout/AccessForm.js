import React from "react";

/*Access form
Assign and remove user to/from division*/
const AccessForm = ({user, handleUserInputChange, handleAccessSubmission}) => {
  return (
    <div>
      <h2 className="mb-5 h5 text-center">Access Rights</h2>

      {/*Access form */}
      <form onSubmit={handleAccessSubmission}>
        <div className="mb-3">
          <label htmlFor="access-username">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            id="access-username"
            className="form-control"
            onChange={handleUserInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="access-unit">Organisational Unit</label>
          <select
            name="unit"
            value={user.unit}
            id="access-unit"
            className="form-select"
            onChange={handleUserInputChange}
            required
          >
            <option value="" hidden disabled>
              Select an option
            </option>
            <option value="Hardware reviews">Hardware reviews</option>
            <option value="News management">News management</option>
            <option value="Opinion publishing">Opinion publishing</option>
            <option value="Software reviews">Software reviews</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="access-division">Division</label>
          <select
            name="division"
            value={user.division}
            id="access-division"
            className="form-select"
            onChange={handleUserInputChange}
            required
          >
            <option value="" hidden disabled>
              Select an option
            </option>
            <option value="Administration">Administration</option>
            <option value="Content writers">Content writers</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Finance">Finance</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="Research and development">
              Research and development
            </option>
            <option value="Sales">Sales</option>
            <option value="Support">Support</option>
          </select>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <button
            type="submit"
            data-access="assign"
            className="btn btn-outline-secondary me-3"
          >
            Assign
          </button>
          <button
            type="submit"
            data-access="remove"
            className="btn btn-outline-secondary"
          >
            Remove
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccessForm;
