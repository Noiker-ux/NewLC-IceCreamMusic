This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# ГАЙД ПО УСТАНОВКЕ И НАСТРОЙКЕ ПРОЕКТА НА VPS

1. Настройка Ubuntu Server 24.04 LTS

- настройка vps https://www.youtube.com/watch?v=F-9KWQByeU0&list=LL&index=17

2. Настройка Docker

- docker без sudo https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo
- docker save image на источнике
- docker load image на сервере

3. Настройка почты

- https://docs.smtp.bz/#/varification
- поправка environment по compose файлу

4. Настройка PostgreSQL

- установка pgagent https://dba.stackexchange.com/questions/324310/using-pgagent-with-docker
- бекапы https://www.youtube.com/watch?v=ne8Jg_lQldQ

5. настройка Minio

- создание ключа для доступа
- создание ведер с именами previews, tracks, syncs, ringtones, videos, videoshots
- настройка привелегий для ключа
