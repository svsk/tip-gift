# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.17.0

#--------------------
# Base Stage
#--------------------
FROM node:${NODE_VERSION}-slim as base
ENV NODE_ENV=production
WORKDIR /src

#--------------------
# Build Stage
# Installs devDependencies, builds the app, and prunes devDependencies
#--------------------
FROM base as build

# Set NODE_ENV to development to install devDependencies (like 'prisma')
ENV NODE_ENV=development
RUN apt-get update -y && apt-get install -y openssl

# Copy package files from the 'src' subfolder
COPY src/package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy all source code from the 'src' subfolder
COPY src/. .

# Build the Nuxt app
RUN npm run build

# Remove devDependencies, leaving only production modules
RUN npm prune --production

#--------------------
# Run Stage
# This is our final, slim production image
#--------------------
FROM base
ARG PORT=3000
ENV PORT=$PORT

# Copy built app, node_modules, prisma schema, and entrypoint
COPY --from=build /src/.output /src/.output
COPY --from=build /src/node_modules /src/node_modules
COPY --from=build /src/prisma /src/prisma
COPY entrypoint.sh /src/entrypoint.sh
RUN chmod +x /src/entrypoint.sh

# Install Google Chrome
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "/src/entrypoint.sh" ]
CMD [ "node", ".output/server/index.mjs" ]