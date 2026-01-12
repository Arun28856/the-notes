# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Install wget for health checks (lightweight alternative to curl)
RUN apk add --no-cache wget

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Health check using wget (more robust than inline node)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start the application
CMD ["npm", "start"]
