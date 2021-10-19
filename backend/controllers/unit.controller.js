const jwt = require("jsonwebtoken");
const {Unit} = require("../models/unitModel");

// Retrieves all the credential repositories that the user has access to.
const getAllRepositories = (request, response) => {
  // Retrieve token
  const auth = request.headers['authorization'];
  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret");
    const access = decoded.access;

    // What will be returned to the user.
    const finalResults = [];

    // User is an admin and has access to all repositories
    if (decoded.userRoles.admin) {
      Unit.find((error, results) => {       
        if (error) {
          response.status(400).send({error: "An error has occurred."});
        } else if (results.length === 0) {
          response.status(200).send([]);
        } else {
          // Arrange repository details in a specific format
          results.forEach((result) => {
            result.divisions.forEach((division) => {    
              // Only send repositories that have credentials.               
              if (division.repository.length > 0) {           
                const resultItem = {
                  unit: result.unit,
                  division: division.division,
                  repository: division.repository
                }
                finalResults.push(resultItem);
              }
            });            
          });
          response.status(200).send(finalResults);
        }
      });
      // User is not an admin, but has access to certain repositories
    } else if (access.length > 0 && !decoded.userRoles.admin) {
      /* Create query parameters to find all the repositories the
      user has access to.*/
      const parameters = access.map((unitItem) => {
        return {unit: unitItem.unit, divisions: {$elemMatch: {division: {$in: unitItem.divisions}}}};
      });

      Unit.find({$or: parameters})
        .exec((error, results) => {
          if (error) {
            response.status(400).send({error: "An error has occurred."});
            // No repositories were returned
          } else if (results.length === 0) {
            response.status(200).send([]);
          } else {
            /*The query returns all the credentials belonging to the organisational
             unit selected. The repositories that the user has access to are extracted 
             from these results. */
            access.forEach((unit) => {
              results.forEach((result) => {
                if (unit.unit === result.unit) {
                  unit.divisions.forEach((division) => {
                    result.divisions.forEach((divisionItem) => {
                      if (division === divisionItem.division) {
                        // Only send repositories that have credentials.
                        if (divisionItem.repository.length > 0) {
                          const resultItem = {
                            unit: result.unit,
                            division: divisionItem.division,
                            repository: divisionItem.repository
                          }
                          finalResults.push(resultItem);
                        } 
                      }
                    });
                  });               
                }
              });
            });
            response.status(200).send(finalResults);
          }
        });
      // User has no access to any repositories
    } else {
      response.status(403).send({
        accessDenied: "You do not have access to any repositories. Please speak to your admin."
      });
    }
    // Not a valid user
  } catch (error) {
    response.status(403).send({
      accessDenied: "You are not a valid user."
    });
  }
}

// Retrieves a single division's credential repository
const getRepository = (request, response) => {
  const {unit, division} = request.body;

  // Retrieve token
  const auth = request.headers['authorization'];
  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret");

    // Check if user has access to the organisational unit and the division
    const divisionAccess = decoded.access.find((unitItem) => {
      return unitItem.unit === unit && unitItem.divisions.includes(division);
    });

    // User has access to division or is an admin
    if (divisionAccess || decoded.userRoles.admin) {
      Unit.findOne({
          unit,
          divisions: {
            $elemMatch: {
              division
            }
          }
        })
        .select({
          unit,
          divisions: {
            $elemMatch: {
              division
            }
          }
        })
        .exec((error, results) => {
          if (error) {
            response.status(400).send({
              error: "An error has occurred."
            });
          } else if (results) {
             // Only send repository that has credentials.
            if (results["divisions"][0]["repository"].length > 0) {
              const finalResults = [];

              const resultItem = {
                unit: results.unit,
                division: results["divisions"][0]["division"],
                repository: results["divisions"][0]["repository"]
              };
  
              finalResults.push(resultItem);
              response.status(200).send(finalResults);
            } else {
              response.status(200).send([]);
            }            
          } else {
            response.status(200).send([]);
          }
        });
      // User is not authorized.
    } else {
      response.status(403).send({
        accessDenied: `You are not authorized to access ${unit}, ${division}.`
      });
    }
    // Not a valid user.
  } catch (error) {
    response.status(403).send({
      accessDenied: "You are not a valid user."
    });
  }
}

// Adds new credentials to the selected organisational unit and division
const addCredentials = (request, response) => {
  const {unit, division, title, username, password} = request.body;

  // Retrieve token
  const auth = request.headers['authorization'];
  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret");

    // Check if user has access to the organisational unit and the division
    const divisionAccess = decoded.access.find((unitItem) => {
      return unitItem.unit === unit && unitItem.divisions.includes(division);
    });

    // User has access to the division or is an admin
    if (divisionAccess || decoded.userRoles.admin) {
      const credentials = {
        title,
        username,
        password
      };

      Unit.updateOne({
          unit,
          divisions: {
            $elemMatch: {
              division
            }
          }
        }, {
          $push: {
            "divisions.$.repository": credentials
          }
        })
        .exec((error, results) => {
          if (error) {
            response.status(400).send({
              error: "An error has occurred."
            });
          } else if (results) {
            response.status(200).send({
              success: "Credentials successfully added to database."
            });
          } else {
            response.status(400).send({
              error: "An error has occurred."
            });
          }
        });
      // User has no access to the division
    } else {
      response.status(403).send({
        accessDenied: `You are not authorized to access ${unit}, ${division}.`
      });
    }
    // Not a valid user
  } catch (error) {
    response.status(403).send({
      accessDenied: "You are not a valid user."
    });
  }
}

// Updates existing credentials
const updateCredentials = (request, response) => {
  const {unit, division, repositoryId, title, username, password} = request.body;

  // Retrieve token
  const auth = request.headers['authorization'];
  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret");

     // Check if user has access to the organisational unit and the division
     const divisionAccess = decoded.access.find((unitItem) => {
      return unitItem.unit === unit && unitItem.divisions.includes(division);
    });

    // Check if user is authorized to perform an update
    if (decoded.userRoles.management && divisionAccess || decoded.userRoles.admin) {
      Unit.findOneAndUpdate({
          unit,
          divisions: {
            $elemMatch: {
              repository: {
                $elemMatch: {
                  _id: repositoryId
                }
              }
            }
          }
        }, {
          $set: {
            "divisions.$.repository.$[placeholder].title": title,
            "divisions.$.repository.$[placeholder].username": username,
            "divisions.$.repository.$[placeholder].password": password,

          }
        }, {
          arrayFilters: [{
            "placeholder._id": repositoryId
          }]
        })
        .exec((error, results) => {
          if (error) {
            response.status(400).send({
              error: "An error has occurred."
            });
          } else if (results) {
            response.status(200).send({
              success: "Credentials successfully updated."
            });
          } else {
            response.response.status(400).send({
              error: "An error has occurred."
            });
          }
        });
      // User is not authorized to update credentials     
    } else {
      response.status(403).send({
        accessDenied: "You are not authorized to update credentials."
      });
    }
    // Not a valid user
  } catch (error) {
    response.status(403).send({
      accessDenied: "You are not a valid user."
    });
  }
}


module.exports = {
  getAllRepositories,
  getRepository,
  addCredentials,
  updateCredentials
}