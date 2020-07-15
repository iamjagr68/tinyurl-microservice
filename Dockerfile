# Use latest ndoe version 12.x
FROM node:12

# Create app directory in container
WORKDIR /usr/src/app

# Only copy the package.json/package-lock.json files to work directory
COPY package.json package-lock.json ./
# Install all Packages
RUN npm install

# Copy all other source code to work directory
ADD . /usr/src/app

# TypeScript
RUN npm run build

# Start
EXPOSE 8080
CMD [ "npm", "start" ]