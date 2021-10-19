import React from "react";

/*User role form
Assign/change the user's role */
const UserRoleForm = ({user, handleUserInputChange, handleUserRoleSubmission}) => {
  // Current input value for user role select tag
  let userRole = "";
  if (user.userRoles.normal) {
    userRole = "normal";
  } else if (user.userRoles.management) {
    userRole = "management";
  } else if (user.userRoles.admin) {
    userRole = "admin";
  }

  return (
    <div>
      <h2 className="mb-5 h5 text-center">Change User Roles</h2>

      {/*User role form*/}
      <form onSubmit={handleUserRoleSubmission}>
        <div className="mb-3">
          <label htmlFor="userrole-username">Username</label>
          <input
            type="text"
            name="username"
            id="userrole-username"
            value={user.username}
            className="form-control"
            onChange={handleUserInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="userrole-user-role">User role</label>
          <select
            name="userRoles"
            id="userrole-user-role"
            value={userRole}
            className="form-select"
            onChange={handleUserInputChange}
            required
          >
            <option value="" hidden disabled>
              Select an option
            </option>
            <option value="normal">Normal</option>
            <option value="management">Management</option>
            <option value="admin">Admin</option>           
          </select>
        </div>

        <button type="submit" className="w-100 btn btn-outline-secondary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UserRoleForm;
