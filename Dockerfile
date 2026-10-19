# --- Étape 1 : build de l'app Vue (Vite) ---
FROM node:24-alpine AS build
WORKDIR /app

# Dépendances d'abord : cette couche est mise en cache tant que package*.json ne change pas
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variables Vite : injectées dans le bundle au moment du build.
# La clé "anon" de Supabase est publique par conception (visible dans le navigateur) ;
# la sécurité repose sur les règles RLS côté Supabase, pas sur le secret de cette clé.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# --- Étape 2 : serveur statique, sans root ---
FROM nginxinc/nginx-unprivileged:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# nginx-unprivileged écoute sur 8080 (pas de port < 1024 sans root)
EXPOSE 8080
