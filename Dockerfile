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

# Remove any existing Sharp installation and do a clean install
RUN npm ci --include=optional
RUN npm uninstall sharp
RUN npm install --platform=linux --arch=x64 sharp

COPY . .

ARG NEXT_PUBLIC_SOCKET
ARG NEXT_PUBLIC_API_URI
ARG NEXT_PUBLIC_DOMAIN_URI
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_PARAPHRASE_API_URI
ARG NEXT_PUBLIC_PARAPHRASE_SOCKET

ENV NEXT_PUBLIC_SOCKET=$NEXT_PUBLIC_SOCKET
ENV NEXT_PUBLIC_API_URI=$NEXT_PUBLIC_API_URI
ENV NEXT_PUBLIC_DOMAIN_URI=$NEXT_PUBLIC_DOMAIN_URI
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_PARAPHRASE_API_URI=$NEXT_PUBLIC_PARAPHRASE_API_URI
ENV NEXT_PUBLIC_PARAPHRASE_SOCKET=$NEXT_PUBLIC_PARAPHRASE_SOCKET

RUN npm run build

# ---------- Runner ----------
FROM node:18-slim AS runner

WORKDIR /app

# Install only runtime dependencies for Sharp
RUN apt-get update && apt-get install -y \
  libvips42 \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install production dependencies and ensure Sharp works
RUN npm ci --only=production --include=optional
RUN npm uninstall sharp  
RUN npm install --platform=linux --arch=x64 sharp

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ARG NEXT_PUBLIC_SOCKET
ARG NEXT_PUBLIC_API_URI
ARG NEXT_PUBLIC_DOMAIN_URI
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_PARAPHRASE_API_URI
ARG NEXT_PUBLIC_PARAPHRASE_SOCKET

ENV NEXT_PUBLIC_SOCKET=$NEXT_PUBLIC_SOCKET
ENV NEXT_PUBLIC_API_URI=$NEXT_PUBLIC_API_URI
ENV NEXT_PUBLIC_DOMAIN_URI=$NEXT_PUBLIC_DOMAIN_URI
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_PARAPHRASE_API_URI=$NEXT_PUBLIC_PARAPHRASE_API_URI
ENV NEXT_PUBLIC_PARAPHRASE_SOCKET=$NEXT_PUBLIC_PARAPHRASE_SOCKET

EXPOSE 3000

CMD ["npm", "start"]