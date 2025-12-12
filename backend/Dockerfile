FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN mkdir -p /app/uploads /app/logs && \
    chown -R node:node /app && \
    chmod +x entrypoint.sh
USER node
EXPOSE 5071
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5071/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "start"]
