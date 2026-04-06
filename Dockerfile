# =============================================================================
# SchulFit - Docker Multi-Stage Build
# =============================================================================
# Stage 1: Development (hot reload)
# Stage 2: Build (production assets)
# Stage 3: Production (nginx server)
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Development
# -----------------------------------------------------------------------------
FROM node:20-slim AS dev

LABEL maintainer="Rahat Hameed"
LABEL description="SchulFit - German school prep for immigrant families (Development)"

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy source code (will be overridden by volume mount in development)
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# -----------------------------------------------------------------------------
# Stage 2: Build
# -----------------------------------------------------------------------------
FROM node:20-slim AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Production
# -----------------------------------------------------------------------------
FROM nginx:alpine AS prod

LABEL maintainer="Rahat Hameed"
LABEL description="SchulFit - German school prep for immigrant families (Production)"

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
