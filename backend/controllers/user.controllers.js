const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");

// Adds user to database
const addUser = (request, response) => {
  const { name, email, username, password } = request.body;

  const userModel = new User({
    name,
    email,
    username,
    password
  });

  userModel.save((error, user) => {
    if (error) {
      // Username must be unique
      if (error.code === 11000) {
        response.status(409)
                .send({ error: { username: "Username already exists." } });
      } else {
        response.status(400).send({ error: "An error has occurred." });
      }
    } else {
      // Create a jwt token
      const payload = {
        username: user.username,
        userRoles: user.userRoles,
        access: user.access
      };

      const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
        algorithm: "HS256"
      });

      response.status(201).send({ token });
    }
  });
}

// Logs user into the application
const loginUser = (request, response) => {
  const { username, password } = request.body;

  // Check if user's login credentials are correct
  User.findOne({ username }, async (error, user) => {
    if (error) {
      response.status(400)
              .send({
                error: "There seems to be an error during the login process.",
              });
      // Username exists
    } else if (user) {
      // Check password
      const correctPassword = await bcrypt.compare(password, user.password);

      // Correct password
      if (correctPassword) {
        // Create a jwt token
        const payload = {
          username: user.username,
          userRoles: user.userRoles,
          access: user.access
        };

        const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
          algorithm: "HS256"
        });

        response.status(200).send({ token });
        // Incorrect password
      } else {
        response.status(403).send({ error: "Incorrect username/password." });
      }
      // Incorrect username
    } else {
      response.status(403).send({ error: "Incorrect username/password." });
    }
  });
}

// Checks if user has access to portal page
const accessPortal = (request, response) => {
  // Retrieve token
  const auth = request.headers["authorization"];
  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret");
    response.status(200)
            .send({ portalAccess: true, userRoles: decoded.userRoles });
  } catch (error) {
    response.status(403).send({ portalAccessDenied: true });
  }
}

// Assigns new user roles
const assignUserRoles = (request, response) => {
  const { username, userRoles } = request.body;

  // Retrieve token
  const auth = request.headers["authorization"];
  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret");

    // Check if user is authorized to make the change i.e. is an admin
    if (decoded.userRoles.admin) {
      User.findOneAndUpdate({ username }, { $set: { userRoles } }).exec(
        (error, results) => {
          if (error) {
            response.status(400).send({ error: "An error has occurred." });
          } else if (results) {
            response.status(200)
                    .send({ success: "Successfully updated user role." });
          } else {
              response.status(400)
                      .send({
                error: `${username} does not exist on the database. Please ensure that you have entered the correct username.`
              });
          }
        }
      );
      // User is not authorized.
    } else {
      response.status(403)
              .send({ accessDenied: "You are not authorized to assign divisions." });
    }
    // Not a valid user
  } catch (error) {
    response.status(403).send({ accessDenied: "You are not a valid user." });
  }
};

// Grant user access to a division
const assignAccess = (request, response) => {
  const { username, unit, division } = request.body;

  // Retrieve token
  const auth = request.headers["authorization"];
  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret");

    // Check if user is authorized to grant access i.e is an admin
    if (decoded.userRoles.admin) {
      // Retrieve the profile of user whom the access will be granted to
      User.findOne({ username }, (error, results) => {
        if (error) {
          response.status(400).send({ error: "An error has occurred." });
          // User is found
        } else if (results) {
          // Retrieve the user's access rights
          const access = results.access;

          // Check if user has access to the organisational unit
          const unitIndex = access.findIndex((accessItem) => {
            return accessItem.unit === unit;
          });

          // User has access to the organisational unit already (no need to add it again to their access rights)
          if (unitIndex !== -1) {
            // Check if user has access to the division already
            const divisionFound = access[unitIndex].divisions.includes(division);

            // User has access to division. No need to add division to the access rights
            if (divisionFound) {
              response.status(200)
                      .send({
                        success: `${username} has already access to ${unit}, ${division}`
                      });
              // Grant access 
            } else {
              access[unitIndex].divisions.push(division);
              // Update database
              User.updateOne({ username },{ $set: { access } },
                (error, results) => {
                  if (error) {
                    response.status(400)
                            .send({ error: "An error has occurred." });
                  } else {
                    response.status(200)
                            .send({
                            success: `${unit, division} has successfully been added to ${username} profile.`
                            });
                  }
                }
              );
            }
            // User has no access to the organisational unit. Grant access to both unit and division
          } else {
            access.push({
              unit,
              divisions: [division],
            });

            User.updateOne(
              { username },
              { $set: { access } },
              (error, results) => {
                if (error) {
                  response.status(400)
                          .send({ error: "An error has occurred." });
                } else {
                  response.status(200)
                          .send({
                            success: `${unit, division} has successfully been added to ${username} profile.`
                          });
                }
              }
            );
          }
          // User does not exist
        } else {
          response.status(200)
                  .send({
                    error: `${username} does not exist on the database. Please ensure that you have entered the correct username.`
                  });
        }
      });
      // User is not authorized to grant access.
    } else {
      response.status(403)
              .send({ accessDenied: "You are not authorized to change access." });
    }
    // Not a valid user
  } catch (error) {
    response.status(403).send({ accessDenied: "You are not a valid user." });
  }
};

// Remove user access from division
const removeAccess = (request, response) => {
  const { username, unit, division } = request.body;

  // Retrieve token
  const auth = request.headers["authorization"];
  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret");

    // Check if user is authorized to remove access i.e is an admin
    if (decoded.userRoles.admin) {
      // Retrieve the profile of user whom the access will be removed from
      User.findOne({ username }, (error, results) => {
        if (error) {
          response.status(400).send({ error: "An error has occurred." });
          // User is found
        } else if (results) {
          // Retrieve the user's access rights
          const access = results.access;

          // Check if user has access to the organisational unit
          const unitIndex = access.findIndex((accessItem) => {
            return accessItem.unit === unit;
          });

          // User has access to organisational unit
          if (unitIndex !== -1) {
            // Check if user has access to the division
            const divisionFound = access[unitIndex].divisions.includes(division);

            if (divisionFound) {
              // Check if division is the only division that the user has access to
              const onlyDivisionAccess = access[unitIndex].divisions.length;

              const divisionIndex = access[unitIndex].divisions.findIndex((accessItem) => {
                return accessItem === division;
              });

              /*If this division is the only division under the organisational unit that the user 
              currently has access to, remove the entire organisational unit.*/
              if (onlyDivisionAccess === 1) {
                access.splice(unitIndex, 1);
                // Remove only the division
              } else {
                access[unitIndex].divisions.splice(divisionIndex, 1);
              }

              User.updateOne({username}, {$set: {access}}).exec(
                (error, results) => {
                  if (error) {
                    response.status(400)
                            .send({ error: "An error has occurred." });
                  } else {
                    response.status(200)
                            .send({
                              success: `Access to ${unit}, ${division} has successfully been removed.`
                            });
                  }
                }
              );
              // User has no access to division
            } else {
              response.status(200)
                      .send({
                        success: `${username} already has no access to ${division}`
                      });
            }
            // User has no access to unit
          } else {
            response.status(200)
                    .send({success: `${username} has no access to ${unit}`});
          }
          //Username does not exist
        } else {
          response.status(200)
                  .send({
                    error: `${username} does not exist on the database. Please ensure that you have entered the correct username.`,
                  });
        }
      });
      // User is not authorized to remove access.
    } else {
      response.status(403)
              .send({ accessDenied: "You are not authorized to change access." });
    }
    // Not a valid user
  } catch (error) {
    response.status(403).send({ accessDenied: "You are not a valid user." });
  }
}

module.exports = {
  addUser,
  loginUser,
  accessPortal,
  assignUserRoles,
  assignAccess,
  removeAccess
};
