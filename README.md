<h1 align="center">Cool Tech Credential Management Application</h1>

An application to manage Cool Tech's credentials.


## Table of Contents

* [About the Application](#about-the-application)
* [Installation](#installation)
* [Usage](#usage)
* [Acknowledgments](#acknowledgments)

## About the Application

Cool Tech is an online company that provides all the latest tech news. They consist of five organisational units, namely News management, Software reviews, Hardware reviews and Opinion publishing. Within each unit are various divisions including IT, Finance etc. Each division  has a list of login/signin credentials to different places such as the bank, facebook etc. 

The Credential Management Application is used to store and manage all the credentials for each division under each organisational unit. 

Normal users can only view and add credentials to divisions that they have access to. Credentials can be updated if the user has authorization. User's profile can also be updated to change their user role or to provide or remove access to divisions. 

User roles include:
|User Role|Function|
|---------|--------|
|normal| Read credential repository. Add new credentials.|
|management|Read credential repository. Add new credentials. Update existing credentials.|
|admin| Read credential repository. Add new credentials. Update existing credentials. Change user roles. Assign and remove users to/from divisions and organisational units|

**NOTE: The connection string has been removed from the config file. Therefore a connection to the database cannot be made.**

Below are three example users that are currently stored in the database. Feel free to use the login credentials. Each user has a different user role. 
|Name|Username|Password|User Role|
|----|--------|--------|---------|
|Taylor Swift|taylorswift|12345|admin|
|Katy Perry|katyperry|12345|management|
|Bruno Mars|brunomars|12345|normal|

The skills demonstrated in this project:<br>

![](https://img.shields.io/badge/React-brightgreen)  ![](https://img.shields.io/badge/Node.js-orange) ![](https://img.shields.io/badge/Express-blue) ![](https://img.shields.io/badge/Mongoose-green) ![](https://img.shields.io/badge/MongoDB-yellowgreen)

## Installation

* Download the folder onto your computer.

* Open the credential-management folder in your favourite code editor.

* If you are using Visual Studio Code, open the built-in terminal or use your command prompt terminal. 

* **cd** into the backend folder and enter **npm install** to install all the backend node modules.

* Enter **npm start** to run the application.

* **cd** into the frontend folder and enter **npm install** to install all the frontend node modules.

* Enter **npm start** to run the application.

## Usage

**Frontend**
See **README.md** in the frontend folder. 
`credential-management/backend/frontend/README.md`

**Backend**
See **README.md** in the backend folder. 
`credential-management/backend/README.md`

## Acknowledgments

**HyperionDev**

Certified Full Stack Web and Software Engineer 
