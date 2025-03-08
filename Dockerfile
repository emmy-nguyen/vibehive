# Use official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies using npm
COPY package.json package-lock.json ./
RUN npm ci

# Copy the entire project
COPY . .

# Build Next.js app
# RUN npm run build
RUN NEXT_PUBLIC_ESLINT_DISABLE=true npm run build


# Create a smaller production image
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built app from previous stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules

# Expose port 3000 for Next.js
EXPOSE 3000

# Start the app using npm
CMD ["npm", "start"]
