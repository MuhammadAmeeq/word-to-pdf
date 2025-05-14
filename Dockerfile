# Use a full Node base image for better compatibility
FROM node:18-bullseye

# Install LibreOffice and Microsoft fonts
RUN apt-get update && \
    apt-get install -y libreoffice wget fontconfig && \
    mkdir -p /usr/share/fonts/truetype/msttcorefonts && \
    cd /usr/share/fonts/truetype/msttcorefonts && \
    wget https://sourceforge.net/projects/corefonts/files/the%20fonts/final/arial32.exe && \
    apt-get install -y cabextract && \
    cabextract arial32.exe && \
    fc-cache -fv && \
    rm arial32.exe && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
