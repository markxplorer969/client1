# Use the official Bun image for optimal performance
FROM oven/bun:1 AS base

# Install dependencies into a temporary location
WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN bun install --frozen-lockfile --production

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1 AS runner
WORKDIR /app

# Copy built files from base stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/next.config.ts ./next.config.ts

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", "start"]
