# ---------- Builder ----------
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./

# Install with optional dependencies (e.g. sharp)
RUN npm install --include=optional

# Install native deps required for sharp
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  pkg-config \
  libvips-dev \
  && rm -rf /var/lib/apt/lists/*

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

COPY package*.json ./
RUN npm install --production --include=optional

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
