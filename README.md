# ISMS  SERVER
A comprehensive school management RESTful API server written in Typescript and Nest.js

## SETUP
- Ensure you have a js package manager like npm, yarn, pnpm (pnpm is preferred)

- Run `pnpm install` to install dependencies

- Setup the env variables by writing them to a `.env` file

- Run `pnpm run start:dev` to start the server locally


## IMPLEMENTED FEATURES
- Authentication for all current user roles (`student`, `teacher`, `guardian`) using jwt

## TODOS
- Write Tests
- Remember to upload profile_images and add them to the respective user models
- Auto generate staff id (use nano_id pkg) and student admission no on create
- Find a way to perform mongo sanitization and prevent csrf attacks in refresh when using cookies

## BUGS

## REMINDERS