FROM node:16.14.0-slim as base
WORKDIR /app
COPY package*.json ./
RUN pwd
RUN npm install

FROM base as dev
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules 
COPY . .

FROM dev as prod
ENV NODE_ENV=production
RUN npm prune
CMD ["npm", "run", "start"]