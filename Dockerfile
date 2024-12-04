FROM ubuntu

RUN apt-get update && \
  apt-get install -y build-essential pip net-tools iputils-ping iproute2 curl
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr/code

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 3001

CMD ["pnpm", "dev"]