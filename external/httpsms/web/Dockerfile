# build stage
FROM node:lts-alpine as build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# install python
RUN apk add --no-cache python3

RUN pnpm install
COPY . .
RUN pnpm run generate

# production stage
FROM nginx:stable-alpine as production

# Clean default nginx pages
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

# Ensure index.html exists (Nuxt generate might produce 200.html for SPAs)
RUN if [ -f /usr/share/nginx/html/200.html ]; then cp /usr/share/nginx/html/200.html /usr/share/nginx/html/index.html; fi

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
