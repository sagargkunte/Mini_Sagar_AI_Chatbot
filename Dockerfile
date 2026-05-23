# ===== Build Stage =====
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# ===== Runtime Stage =====
FROM node:18-alpine


WORKDIR /app

# Copy node modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .


# Switch to nodejs user
USER nodejs

# Expose the port
EXPOSE 3001


# Start the application
CMD ["node", "index.js"]
