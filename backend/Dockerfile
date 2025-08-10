# Use an official Node.js 18 runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Bundle your app's source code
COPY . .

# Cloud Run provides the port on this env var. Your app should listen to it.
EXPOSE 8080

# The command to start your server
CMD [ "node", "index.js" ]