# Use official Node.js LTS image
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Production image
FROM node:20-alpine as production
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the port (default 3000)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
