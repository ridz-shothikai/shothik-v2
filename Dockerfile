# ---------- Builder ----------
FROM node:18-slim AS builder

WORKDIR /app

# Install system dependencies for Sharp and other native modules
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  pkg-config \
  libvips-dev \
  libcfitsio-dev \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Clean install with platform-specific Sharp
RUN npm ci --include=optional && npm rebuild sharp

COPY . .

ARG NEXT_PUBLIC_SOCKET
ARG NEXT_PUBLIC_API_URI
ARG NEXT_PUBLIC_DOMAIN_URI
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_SOCKET=$NEXT_PUBLIC_SOCKET
ENV NEXT_PUBLIC_API_URI=$NEXT_PUBLIC_API_URI
ENV NEXT_PUBLIC_DOMAIN_URI=$NEXT_PUBLIC_DOMAIN_URI
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

RUN npm run build

# ---------- Runner ----------
FROM node:18-slim AS runner

WORKDIR /app

# Install only runtime dependencies for Sharp
RUN apt-get update && apt-get install -y \
  libvips42 \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install production dependencies and rebuild Sharp for runtime
RUN npm ci --only=production --include=optional && npm rebuild sharp

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ARG NEXT_PUBLIC_SOCKET
ARG NEXT_PUBLIC_API_URI
ARG NEXT_PUBLIC_DOMAIN_URI
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_SOCKET=$NEXT_PUBLIC_SOCKET
ENV NEXT_PUBLIC_API_URI=$NEXT_PUBLIC_API_URI
ENV NEXT_PUBLIC_DOMAIN_URI=$NEXT_PUBLIC_DOMAIN_URI
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

EXPOSE 3000

CMD ["npm", "start"]