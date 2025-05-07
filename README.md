# ISMS  SERVER
A comprehensive school management RESTful API server written in Typescript and Nest.js

## SETUP
- Ensure you have a js package manager like npm, yarn, pnpm (pnpm is preferred)

- Run `pnpm install` to install dependencies

- Setup the env variables by writing them to a `.env` file

- Run `pnpm run start:dev` to start the server locally


## IMPLEMENTED FEATURES
- Authentication for all current user roles (`student`, `teacher`, `guardian`) using jwt
- CRUD operations for Subject implemented
- Attendance marking feature implemented
- Classroom creation, assingment to teachers and students implemented
- Grade uploads, update, viewing, batch upload of results, Promotion status
- RBAC implemented

## TODOS
- Add cloudinary, configure, and upload profile_images
- Implement Parse CSV function in  `lib/utils`
- Find a way to perform mongo sanitization and prevent csrf attacks in refresh when using cookies


## BUGS
- Bulk upload result returns never type for error key

## REMINDERS