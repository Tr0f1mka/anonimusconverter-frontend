FROM node:18-alpine AS builder

WORKDIR /app

COPY ./app /app

RUN npm install
ENV NODE_OPTIONS --max_old_space_size=384
RUN npm run build -- --configuration=production

FROM nginx:alpine

RUN mkdir -p /root/projects/converter/logs/frontend

COPY --from=builder /app/dist/cson-converter/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]