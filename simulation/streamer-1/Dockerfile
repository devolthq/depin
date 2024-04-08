# Stage 1: Building the code
FROM node:18 AS builder

WORKDIR /app

# Copy package.json and yarn.lock for both streamer and sdk
COPY streamer/package.json streamer/yarn.lock ./streamer/

# Install dependencies for streamer and sdk
RUN cd streamer && yarn install --frozen-lockfile

# Copy the source code for streamer and sdk
COPY streamer ./streamer

# Build the streamer and sdk
RUN cd streamer && yarn build

# Stage 2: Setting up the production environment
FROM node:16-slim

WORKDIR /app

# Copy the built applications from the builder stage
COPY --from=builder /app/streamer/dist ./dist

# Copy package.json for starting the application
COPY streamer/package.json ./streamer/

# Set the environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
