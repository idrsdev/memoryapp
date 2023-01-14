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

##### Project Structure

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
