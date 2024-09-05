# Stage 1:20uild
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run migrate
RUN npm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3434

CMD ["node", "dist/index.js"]
