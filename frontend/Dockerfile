# Stage 1 — build React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

# Stage 2 — serve with Nginx
# nginx:alpine auto-runs envsubst on /etc/nginx/templates/*.template at startup
# so BACKEND_URL (injected by Vault Agent) is substituted into nginx.conf
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
