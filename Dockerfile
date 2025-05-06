# Prepare workspace
FROM node:22-slim AS workspace
RUN apt-get update && apt-get install -y ca-certificates

# Add Node.js memory options
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY . .
## Install deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile

# Build shared components first
FROM workspace AS build-components
WORKDIR /app
RUN pnpm --filter react-components build
# Create a new directory to store the built components
RUN mkdir -p /tmp/built-components
# Copy the built files and package.json
RUN cp -r packages/react-components/dist /tmp/built-components/
RUN cp packages/react-components/package.json /tmp/built-components/

# Build sveltekit
FROM workspace AS build-sveltekit
ENV NODE_ENV production
## Copy the built react-components
COPY --from=build-components /tmp/built-components /app/packages/react-components
## Build
RUN pnpm --filter sveltekit build
## Prune for prod
RUN pnpm deploy --filter sveltekit --prod pruned

## Production image
FROM node:22-slim AS sveltekit
WORKDIR /app

COPY --from=build-sveltekit / .
# COPY --from=build-sveltekit /app/pruned/build build/
# COPY --from=build-sveltekit /app/pruned/node_modules node_modules/
# COPY --from=build-sveltekit /app/pruned/package.json .

# CMD [ "node", "build" ]
CMD ["ls", "-la"]
