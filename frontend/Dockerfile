# frontend/Dockerfile
FROM node:16.13.1

RUN apt-get update && apt-get install -y nginx

WORKDIR /usr/app
COPY package.json .
RUN yarn install
COPY src/ src/
COPY public/ public/
COPY *.js .
COPY *.json .
COPY .* .

RUN yarn build --prod --silent

# Install nginx and copy configuration file
COPY nginx.conf /etc/nginx/sites-available/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/nginx.conf

RUN mkdir -p /usr/share/nginx/html
RUN cp -r build/* /usr/share/nginx/html/

# CMD ["nginx", "-g", "daemon off;"]
