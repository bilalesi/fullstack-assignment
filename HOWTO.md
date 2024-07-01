> I bootstrap the project using a monorepo architecture, the reason why, is to help scafold the application and also share code (even there is no real code-sharing between applications for this test) and also since the whole system is using js/ts, it's more convinient to have both the frontend and the backend under same directory managed by one build system.

> For all the commands, I write a `makefile` to group all needed commands to start playing with the app.

# Requirement

To start the application directly, this command should do the magic:

```
make all
```

or go through the following steps one by one:

### Monorepo build system

I choose turborepo coz I love it and have already better experience with it 😉, and using `bun` for package managment 🚀.

#### Installing `Bun`

```
npm install -g bun
```

#### Installing turborepo

```
pnpm install turbo --global
```

#### Installing packages

```
bun install
```

#### Start the app db container and initialize the database

```
make db-init
```

#### Start the dev server

```
make dev
```
