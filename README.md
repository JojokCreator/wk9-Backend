
# Bootcamper Social.

This is the Backend of our Mid-way project for School Of Code, we were presented with the task of creating an app that would help a bootcamper through this experience. After some discussion we decided to create an APP centered around meeting other bootcampers outside of Bootcamp Hours.

App is deployed [here](https://front-end-bootcamper-social.netlify.app/)
## To Run Locally:

Clone the project

```bash
  git clone https://github.com/SchoolOfCode/w9_backend-project.git
```

Go to the project directory

```bash
  cd my-app
```

Install dependencies

```bash
  npm i (or npm install)
```

Start the server

```bash
  npm run dev
```


## Environment Variables

Create a copy of the .env.example file then fill in those credentials with those for your own database and rename the file .env (dont forget to makesure youre gitignore has .env in it).
## To Run the Tests:

To run tests, run the following command

```bash
  npm run test
```


## Authors

- [@Plume93](https://github.com/Plume93)
- [@JojokCreator](https://github.com/JojokCreator)
- [@Musy88](https://github.com/Musy88)
- [@danielknight261](https://github.com/danielknight261)


## Authentication

The authentication is provided using JSON Web Tokens the expiry times for the tokens can be changed in the utils/jwt.helpers.js file. When logged in the user receives a short lived access token that is exchanged with a refresh token automatically that keeps the user logged in. The access token is decryptable to allow access to the users email and user_id.

## API Reference
#### Auth Routes
```http
  POST localhost:3000/login
```

| Route     | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `/login` | `POST` | POSTs the username and password to the database and receieves an access token if correct. |

#### GET 

```http
  POST localhost:3000/refresh_token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/refresh_token`      | `GET` | GETs the receieves a refresh token if correct. |

#### DELETE 

```http
  POST localhost:3000/refresh_token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/refresh_token`      | `DELETE` | DELETEs the refresh token from the database (logs the user out)|


#### GET ALL USERS

```http
  GET localhost:3000/users
```

| Route     | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `/users` | `GET` | GETs all the users in the database |

#### POST 

```http
  POST localhost:3000/users
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/users`      | `POST` | Creates a new user |

#### PATCH 

```http
  PATCH localhost:3000/users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/users/:id`      | `PATCH` | Updates a user with the designated id |

#### DELETE

```http
  DELETE localhost:3000/users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/users/:id`      | `DELETE` | Delete the user with the designated id |


#### Events Routes
```http
 For events paths use the above references but with /events instead of /users.
```






