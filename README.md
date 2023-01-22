## Table of Contents

1. [Installation](#installation)
   1. [Locally](#locally)
      1. [Install Dependencies](#install-dependencies)
      2. [Run](#run)
   2. [Docker](#docker)
2. [API Docs](#api-docs)
   1. [Open Endpoints](#open-endpoints)
   2. [Endpoints that require Authentication](#endpoints-that-require-authentication)
   3. [Memory related](#memory-related)
   4. [User related](#user-related)
   5. [Comment related](#comment-related)
   6. [Reset Password](#reset-password)
   7. [Upload Image](#upload-image)
3. [Project Structure](#project-structure)

## Installation

### Locally

##### Install Dependencies

$ `npm install`

$ `cp .env.example .env`

set these environment variables

##### Run

```
npm run dev (:5000)
```

### Docker

$ `docker compose up`
<br>Available at `http://localhost:5000/api/memory`

To stop and remove containers<br>
$ `docker compose down`

To run in production mode<br>
$ `docker compose -f docker-compose.yml -f docker-compose.prod.yml up`
<br>Available at `http://localhost/api/memory`

You can pass an additional flag `-d` to keep it running in background

## API Docs

BaseURL : `http://localhost:5000/api`

#### Open Endpoints

Open endpoints require no Authentication.

- `Login POST /user/login/`

#### Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

#### Memory related

Endpoints for viewing and manipulating the Memories.

- `Create Memory: POST /memory`
- `Get Everyone's Memories: GET /memory?`
- `Show Personal Memories: GET /memory/me?`
- `Delete A Memory: DELETE /memory/{{MemoryId}}`
- `Like A Memory: POST /memory/{{MemoryId}}/like`
- `Share A Memory: POST /memory/{{MemoryId}}/share`
- `Post A Comment: POST /memory/{{MemoryId}}/comment`

#### User related

Endpoints for viewing and manipulating the Users.

- `Login: POST /user/login/`
- `Create User: POST /user/`
- `Verify User: GET /user/verify/{{EMAIL}}/:token`
- `Resend Activation Link: POST /user/resend-activation-link`

#### Comment related

Endpoints for viewing and manipulating the Comments.

- `Get Memory Comments: POST /comment?`
- `Delete A Comment: DELETE /comment/{{CommentId}}`

#### Reset Password

Endpoints for User's password reset.

- `Request Password Reset: POST /reset-password`
- `Reset Password: POST /reset-password/:userId/:token`

#### Upload Image

Endpoints for Uploading Image.

- `Upload Image: POST /upload/image`

## Project Structure

```
memoryapp
├─ .dockerignore
├─ .gitignore
├─ app.js
├─ config
│  └─ db.js
├─ controllers
│  ├─ commentController.js
│  ├─ memoryController.js
│  ├─ passwordResetController.js
│  └─ userController.js
├─ docker-compose.override.yml
├─ docker-compose.prod.yml
├─ docker-compose.yml
├─ Dockerfile
├─ middleware
│  ├─ authMiddleware.js
│  └─ errorMiddleware.js
├─ models
│  ├─ commentModel.js
│  ├─ likedMemoryModel.js
│  ├─ memoryModel.js
│  ├─ sharedMemoryModel.js
│  ├─ tokenModel.js
│  └─ userModel.js
├─ package-lock.json
├─ package.json
├─ README.md
├─ routes
│  ├─ commentRoutes.js
│  ├─ memoryRoutes.js
│  ├─ passwordResetRoutes.js
│  ├─ uploadRoutes.js
│  └─ userRoutes.js
├─ seeder.js
├─ server.js
├─ services
│  ├─ commentServices.js
│  ├─ memoryServices.js
│  ├─ passwordResetServices.js
│  └─ userServices.js
├─ utils
│  ├─ generateToken.js
│  ├─ sendMail.js
│  ├─ uploadImage.js
│  └─ userWithoutPassword.js
└─ validators
   ├─ memoryValidator.js
   └─ userValidator.js
```
