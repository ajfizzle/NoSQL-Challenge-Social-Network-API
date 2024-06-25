# NoSQL-Challenge-Social-Network-API

Module 18 Challenge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents:

- [Description](#Description)
- [User Story](#User-Story)
- [Acceptance Criteria](#Acceptance-Criteria)
- [Installation](#installation)
- [Usage](#Usage)
- [API Endpoints](#API-Endpoints)
  - [Users](#Users)
  - [Thoughts](#Thoughts)
- [Models](#Models)
  - [User](#User)
  - [Thought](#Thought)
  - [Reaction](#Reaction-schema-only)
- [Preview / Screenshot / Walkthrough Video](#Preview-Screenshot-Walkthrough-Video)
- [References](#References)
- [License](#License)

## Description

This project is an API for a social network web application where users can share their thoughts, react to friends’ thoughts, and create a friend list. The API is built using Express.js for routing, MongoDB for the database, and the Mongoose ODM for data modeling. This application demonstrates how a social media platform can handle large amounts of unstructured data using a NoSQL database.

## User Story

**AS A** social media startup  
**I WANT** an API for my social network that uses a NoSQL database  
**SO THAT** my website can handle large amounts of unstructured data

## Acceptance Criteria

- **GIVEN** a social network API
  - **WHEN** I enter the command to invoke the application
    - **THEN** my server is started and the Mongoose models are synced to the MongoDB database
  - **WHEN** I open API GET routes in Insomnia for users and thoughts
    - **THEN** the data for each of these routes is displayed in a formatted JSON
  - **WHEN** I test API POST, PUT, and DELETE routes in Insomnia
    - **THEN** I am able to successfully create, update, and delete users and thoughts in my database
  - **WHEN** I test API POST and DELETE routes in Insomnia
    - **THEN** I am able to successfully create and delete reactions to thoughts and add and remove friends to a user’s friend list

## Installation

To run this application locally, follow these steps:

1.  Clone the repository: `git clone <repository-url>`
2.  Install dependencies:

    - `npm init -y`
    - `npm i express mongoose dotenv validator`

    # Note:

    - Ensure "package.json" is configured with the accurate attributes.
    - Ensure `.env` file is in the root directory

3.  Start the server by running: `npm start` or `node server.js`
    - Note: You can seed DB `node utils/seed.js` before starting server

## Usage

- Use Insomnia or a similar API client to test the API routes.
- The server will be running at http://localhost:3001.

## API Endpoints

    # Users
        - GET /api/users - Get all users
        - GET /api/users/:userId - Get a single user by ID
        - POST /api/users - Create a new user
        - PUT /api/users/:userId - Update a user by ID
        - DELETE /api/users/:userId - Delete a user by ID
        - POST /api/users/:userId/friends/:frienduserId - Add a friend to a user's friend list
        - DELETE /api/users/:userId/friends/:frienduserId - Remove a friend from a user's friend list

    # Thoughts
       - GET /api/thoughts - Get all thoughts
       - GET /api/thoughts/:thoughtId - Get a single thought by ID
       - POST /api/thoughts - Create a new thought
       - PUT /api/thoughts/:thoughtId - Update a thought by ID
       - DELETE /api/thoughts/:thoughtId - Delete a thought by ID
       - POST /api/thoughts/:thoughtId/reactions - Add a reaction to a thought
       - DELETE /api/thoughts/:thoughtId/reactions/:reactionId - Remove a reaction from a thought

## Models

    # User
       - username (String, Unique, Required, Trimmed)
       - email (String, Unique, Required, Must match a valid email address)
       - thoughts (Array of \_id values referencing the Thought model)
       - friends (Array of \_id values referencing the User model (self-reference))

    # Thought
       - thoughtText (String, Required, Must be between 1 and 280 characters)
       - createdAt (Date, Set default value to the current timestamp, Use a getter method to format the timestamp)
       - username (String, Required)
       - reactions (Array of nested documents created with the reactionSchema)

    # Reaction (Schema only)
       - reactionId (ObjectId, Default value is set to a new ObjectId)
       - reactionBody (String, Required, 280 character maximum)
       - username (String, Required)
       - createdAt (Date, Set default value to the current timestamp, Use a getter method to format the timestamp)

## Preview / Screenshot / Walkthrough Video
![alt text](NoSQL-Challenge-Social-Network-API.gif)
<video controls src="NoSQL-Challenge-Social-Network-API.mp4" title="Title"></video>

## Contact

For more projects and information about the developer, please visit:

- https://ajfizzle.github.io/NoSQL-Challenge-Social-Network-API
- https://github.com/ajfizzle/NoSQL-Challenge-Social-Network-API

## References:

- UT Austin Bootcamp - UTA-VIRT-FSF-PT-02-2024-U-LOLC/28-Stu-Mini-Project
- https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- https://expressjs.com/en/starter/installing.html
- https://www.npmjs.com/package/inquirer/v/8.2.4
- https://docs.npmjs.com/cli/v10/commands/npm-init

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
