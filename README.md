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
