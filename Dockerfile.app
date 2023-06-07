FROM public.ecr.aws/docker/library/node:lts-alpine3.17

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY . .

RUN npm install --silent

EXPOSE 3000
ENV PORT 3000

CMD npm run start