# Use the official Node.js 18 image as the base image for building
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

ARG NEXT_PUBLIC_SOCKET
ARG NEXT_PUBLIC_API_URI
ARG NEXT_PUBLIC_DOMAIN_URI
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID


ENV NEXT_PUBLIC_SOCKET=$NEXT_PUBLIC_SOCKET
ENV NEXT_PUBLIC_API_URI=$NEXT_PUBLIC_API_URI
ENV NEXT_PUBLIC_DOMAIN_URI=$NEXT_PUBLIC_DOMAIN_URI
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Build the Next.js application
RUN npm run build

# Use the official Node.js 18 image as the base image for running the application
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Remove this line - we're installing fresh node_modules in runner
# COPY --from=builder /app/node_modules ./node_modules

# Set environment variables in runner stage as well (for server-side)
ARG NEXT_PUBLIC_SOCKET
ARG NEXT_PUBLIC_API_URI
ARG NEXT_PUBLIC_DOMAIN_URI
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID


ENV NEXT_PUBLIC_SOCKET=$NEXT_PUBLIC_SOCKET
ENV NEXT_PUBLIC_API_URI=$NEXT_PUBLIC_API_URI
ENV NEXT_PUBLIC_DOMAIN_URI=$NEXT_PUBLIC_DOMAIN_URI
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
# Expose port 3000
EXPOSE 3000

# Start the Next.js application in production mode
CMD ["npm", "start"]