# syntax = docker/dockerfile:1

ARG NODE_VERSION=16.15.1

FROM node:${NODE_VERSION}-slim as base

ARG DATABASE_URL
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG PORT=3000

ENV NODE_ENV=production
ENV DATABASE_URL=$DATABASE_URL
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_KEY=$SUPABASE_KEY

#COPY --link . .
COPY . .
WORKDIR /src

# Build
FROM base as build

RUN npm install --production=false
RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT = $PORT

COPY --from=build /src/.output /src/.output

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

CMD [ "node", ".output/server/index.mjs" ]

