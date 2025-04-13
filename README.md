# ISMS  SERVER
A comprehensive school management RESTful API server written in Typescript and Nest.js

## SETUP
- Ensure you have a js package manager like npm, yarn, pnpm (pnpm is preferred)

- Run `pnpm install` to install dependencies

- Setup the env variables by writing them to a `.env` file

- Run `pnpm start:dev` to start the server locally


## IMPLEMENTED FEATURES
- Authentication for all current user roles (`student`, `teacher`, `guardian`) using jwt

## TODOS
- Write Tests
- Auto generate staff id and student admission no on create
- Find a way to perform mongo sanitization and prevent csrf attacks in refresh when using cookies

## BUGS

## REMINDERS