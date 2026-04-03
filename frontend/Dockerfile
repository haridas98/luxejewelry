# Frontend Development Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files (из-за того что context = корень проекта)
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy project (из-за того что context = корень проекта)
COPY frontend/ .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
