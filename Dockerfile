FROM node:22-alpine AS build
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN npm i -g pnpm@9.12.3
WORKDIR /app


COPY package.json .
RUN --mount=type=cache,target=/root/.npm npm install

# Copy the application code
COPY . .

# Build
RUN npm run build

# Prod server
FROM node:22-alpine AS note_frontend
WORKDIR /app
COPY --from=build /app/build build
COPY --from=build /app/node_modules node_modules
COPY package.json .
EXPOSE 3000
CMD [ "node", "build" ]
