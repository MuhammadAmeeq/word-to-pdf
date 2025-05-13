# Use a slim Node.js base image
FROM node:18-slim

# Install LibreOffice and clean up extra cache
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy package.json and install Node modules
COPY package*.json ./
RUN npm install

# Copy rest of the project files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
