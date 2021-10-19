import React from "react";

/*Add form
Add new credentials to division's repository*/
const AddForm = ({ handleCredentialsInputChange, handleAddSubmission }) => {
  return (
    <div>
      <h2 className="mb-5 h5 text-center">Add New Credentials</h2>

      {/*Add form */}
      <form onSubmit={handleAddSubmission}>
        <div className="mb-3">
          <label htmlFor="add-unit">Organisational Unit</label>
          <select
            name="unit"
            id="add-unit"
            defaultValue=""
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
          <label htmlFor="add-division">Division</label>
          <select
            name="division"
            id="add-division"
            defaultValue=""
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

        <div className="mb-3">
          <label htmlFor="add-title">Title</label>
          <input
            type="text"
            name="title"
            id="add-title"
            className="form-control"
            onChange={handleCredentialsInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="add-username">Username</label>
          <input
            type="text"
            name="username"
            id="add-username"
            className="form-control"
            onChange={handleCredentialsInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="add-password">Password</label>
          <input
            type="password"
            name="password"
            id="add-password"
            autoComplete="off"
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

export default AddForm;
