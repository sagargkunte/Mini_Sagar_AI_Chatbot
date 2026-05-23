# ===== Build Stage =====
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ===== Runtime Stage =====
FROM node:18-alpine

WORKDIR /app

# install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# copy app from builder
COPY --from=builder /app /app

# create non-root user (IMPORTANT FIX)
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# fix permissions
RUN chown -R nodejs:nodejs /app

# switch user safely
USER nodejs

EXPOSE 3001

CMD ["node", "index.js"]
