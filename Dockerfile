# FIXED: Upgraded to Node 20 to support modern AI/LangChain dependencies natively
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY . .

RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

CMD ["node", "index.js"]
