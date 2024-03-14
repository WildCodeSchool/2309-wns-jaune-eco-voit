# ECOVOIT
# Installation 
- Copier le .env.example
- cd back - npm i 
- cd front - npm i 
- docker compose up 


## Règles

- Ex nom de branch: `BACK-4156-nom-de-la-feature`
- Ex num d'US :
  `[ECOVOIT-4156][FRONT] simplifier l'auto complete`
- Etape de vie d'une US:
  - On prend un ticket dans la 'todo' liste, on se l'assigne et on le passe en 'in progress'
  - Une fois terminé on le passe en done
  - Quelqu'un (reviewer) le récupère et se l'assigne, la passe en review
  - Il review la PR
  - L'assignee corrige
  - Le reviewer valide / se met d'accord avec l'assignee
  - L'assignee merge la MR sur master
  - Formater et linter le code avant de commit : "npm run format"
