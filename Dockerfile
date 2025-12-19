# Build Stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app

# Install production deps (express)
COPY package*.json ./
RUN npm install --omit=dev && npm install express

# Copy built assets
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY server.js .

# Create downloads dir
RUN mkdir -p public/downloads && chmod 777 public/downloads

EXPOSE 3000

CMD ["node", "server.js"]
