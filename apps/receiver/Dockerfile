FROM node:16.2.0 as builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build:receiver
EXPOSE 3101
CMD ["yarn","start:receiver-prod"]

#FROM node:16.2.0 as production
#WORKDIR /app
#COPY  --from=builder /app/dist/ /app
#COPY --from=builder /app/node_modules/ /app
#COPY package.json /app
#COPY .env /app
#COPY ormconfig.ts /app
#
#CMD ["yarn","start:prod"]
