# ===== Build Stage =====
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# ===== Runtime Stage =====
FROM node:18-alpine

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy node modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app to the nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Expose the port
EXPOSE 3001

# Use dumb-init to handle process signals correctly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "index.js"]
