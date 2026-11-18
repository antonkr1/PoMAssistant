# build de l'app Vue (Vite)
FROM node:24-alpine AS build
WORKDIR /app

# ajout des dépendances avant le reste du code pour profiter du cache Docker
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variables Vite : injectées dans le bundle au moment du build.
# La clé "anon" de Supabase est publique par convention, elle est utilisée côté client.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# build de l'image finale avec Nginx
FROM nginxinc/nginx-unprivileged:alpine

# Mise à jour de l'image pour corriger les vulnérabilités (Trivy)
USER root
RUN apk upgrade --no-cache
USER 101

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
