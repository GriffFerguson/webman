FROM ubuntu:jammy

RUN apt update && \
    apt install curl --no-install-recommended -y && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash && \
    nvm install 18.0 && \
    mkdir /var/lib/webman

COPY ./public /var/www/html
COPY ./assets /var/www/html
COPY ./dist /var/lib/webman
COPY ./package.json /var/lib/webman
COPY ./package-lock.json /var/lib/webman

CMD ["node", "index.js"]