# Homechef

[![License](/public/README/license-badge.svg)](./LICENSE) [![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/JoeyHentges/home-chef/issues)

## Introduction

A clean, simple and powerful recipe manager web application for unforgettable family recipes, empowering you to curate and share your favorite recipes.
It is focused on simplicity for the whole family to enjoy.

![promo](/public/README/promo.PNG "Promo 1")

---

## Getting Started

First, create and modify your `.env` file. Note: the `.env.exmaple` file.

```bash
NODE_ENV=development
HOST_NAME=http://localhost:3000
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
REDIS_URL=redis://:password@localhost:6379
RESEND_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RESEND_EMAIL_FROM=email@provider.com
```

Next, run the following commands to start the server:

```bash
docker compose build

docker compose start

pnpm db:seed

pnpm dev
```

Open the app at [http://localhost:3000](http://localhost:3000)

Two users are initially seeded with the `pnpm db:seed` command. Modify the `src\db\seed\users.ts` file to change them.

```bash
email: testing@example.com
password: password

email: testing2@example.com
password: password
```

To get an interactive view of the database:

```bash
pnpm db:studio
```

Open the app at [https://local.drizzle.studio/](https://local.drizzle.studio/)

## More screenshots

![recipe-view-promo](/public/README/recipe-view-promo.PNG "Promo 2")
![recipe-edit-promo](/public/README/recipe-edit-promo.PNG "Promo 3")
