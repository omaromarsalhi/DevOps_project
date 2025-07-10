# Stage 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /DevOps_project

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files
COPY . .

# Build the NestJS app (compile TS to JS)
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /DevOps_project

# Copy only package files for production deps
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm install --only=production

# Copy the compiled output from the builder stage
COPY --from=builder /DevOps_project/dist ./dist

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Start the app using the compiled files
CMD ["node", "dist/main.js"]
