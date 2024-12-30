FROM ubuntu:22.04 AS builder

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  build-essential \
  pip \
  net-tools \
  iputils-ping \
  iproute2 \
  curl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable pnpm

WORKDIR /usr/code

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3001

# CMD ["pnpm", "dev"]