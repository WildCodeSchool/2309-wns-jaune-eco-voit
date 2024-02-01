# Base image:
#   specifie l'image de base de docker utilisée
#   Alpine linux est la plus distribution linux la plus légère. 
FROM node:20-alpine

# Working directory:
#   Definie '/app' comme le working directory dans le container Docker, et le créé s'il n'existe pas
RUN mkdir /app
WORKDIR /app

# Copy Package > ça cope package.json dans l''app' container directory et intall les dependances en utilisant 'npm install'
COPY package.json .
RUN npm i 

# Copy tout le fichier src et colle le tout dans un nouveau fichier src dans le container
COPY src src
COPY tsconfig.json .

# Specifie la commande par défaut à run quand le container starts. 
CMD npm run start



