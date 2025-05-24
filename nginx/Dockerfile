FROM nginx:stable-alpine

RUN echo 'server { \
    listen 80 default_server; \
    server_name _; \
    location / { \
        return 444; \
    } \
}' > /etc/nginx/conf.d/default.conf && chmod 644 /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY .htpasswd /etc/nginx/.htpasswd
COPY conf.d/myapp.conf.template /etc/nginx/conf.d/myapp.conf.template

RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/certbot
RUN mkdir -p /etc/letsencrypt

ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

EXPOSE 443