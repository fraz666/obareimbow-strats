FROM denoland/deno:latest AS builder
WORKDIR /app
COPY . .
RUN deno task build
RUN deno cache _fresh/server.js

EXPOSE 8000

CMD ["serve", "-A", "_fresh/server.js"]