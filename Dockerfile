FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
EXPOSE 8081
WORKDIR /app

COPY package*.json ./

COPY web .
RUN npm install
RUN npm install --save winston
RUN npm install --save shopify-api-node
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
