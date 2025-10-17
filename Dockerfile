# ---------- Base image ----------
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
      chromium \
      ca-certificates \
      fonts-dejavu \
      libnss3 \
      libfreetype6 \
      libharfbuzz0b \
      sqlite3 \
      --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
     
# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm i

# Copy the rest of the app
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port if needed
EXPOSE 4000

# Run the Slackbot
CMD ["node", "index.js"]
