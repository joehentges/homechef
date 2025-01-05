![promo](/public/promo.PNG "Promo")

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

To get an interactive view of the database:

```bash
pnpm db:studio
```

Open the app at [https://local.drizzle.studio/](https://local.drizzle.studio/)

## More screenshots

![recipe-view-promo](/public/recipe-view-promo.PNG "Promo")
![recipe-edit-promo](/public/recipe-edit-promo.PNG "Promo")
