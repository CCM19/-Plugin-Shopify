FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
ENV NODE_ENV production
EXPOSE 8081
WORKDIR /app
COPY package.json .
COPY web .
RUN npm install --omit=dev --legacy-peer-deps
RUN cd frontend && npm install && SHOPIFY_API_KEY=$SHOPIFY_API_KEY npm run build
USER node
CMD ["npm", "run", "serve"]
