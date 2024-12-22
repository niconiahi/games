FROM denoland/deno:2.1.4

EXPOSE 8000

WORKDIR /app

USER deno

COPY . .

CMD ["run", "--allow-net", "--allow-read","main.ts"]
