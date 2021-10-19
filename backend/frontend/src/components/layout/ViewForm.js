import React from "react";

/*View form
View a single division credential repository */
const ViewForm = ({credentials, handleCredentialsInputChange, handleViewSubmission}) => {
  return (
    <div>
      <h2 className="mb-5 h5 text-center">View Credentials</h2>

      {/*View form */}
      <form onSubmit={handleViewSubmission}>
        <div className="mb-3">
          <label htmlFor="view-unit">Organisational Unit</label>
          <select
            name="unit"
            id="view-unit"
            value={credentials.unit}
            className="form-select"
            onChange={handleCredentialsInputChange}
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
          <label htmlFor="view-division">Division</label>
          <select
            name="division"
            id="view-division"
            value={credentials.division}
            className="form-select"
            onChange={handleCredentialsInputChange}
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

        <button type="submit" className="w-100 btn btn-outline-secondary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ViewForm;
