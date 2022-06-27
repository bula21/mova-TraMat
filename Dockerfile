# build environment
FROM node:lts as build-stage
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ARG EMAIL_SECRET
ENV VUE_APP_EMAIL_SECRET=$EMAIL_SECRET
COPY package*.json ./
RUN npm install
RUN npm install -g @vue/cli
COPY ./ .
RUN npm run build

# production environment
FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

#Build your docker image: docker build . -t tramat
#Run your docker image: docker run -d -p 8080:80 tramat