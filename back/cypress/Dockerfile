# Base image:
#   spécifie l'image de base de Docker utilisée
#   Alpine Linux est la distribution Linux la plus légère. 
FROM node:20-alpine

# Installer curl
RUN apk --update --no-cache add curl

# Working directory:
#   Définit '/app' comme le répertoire de travail dans le conteneur Docker
WORKDIR /app

# Copier package.json et installer les dépendances
COPY ../package.json ./package.json
RUN npm install

# Copier tous les fichiers nécessaires du répertoire parent vers le conteneur
COPY ../src ./src
COPY ../tsconfig.json ./tsconfig.json

# Spécifie la commande par défaut à exécuter quand le conteneur démarre
CMD ["npm", "run", "start:test"]