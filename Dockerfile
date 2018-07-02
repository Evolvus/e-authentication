FROM node:8.9 as node


RUN npm install pm2 -g
COPY . /usr/app-auth/
COPY package.json /usr/app-auth
#COPY .npmrc ./
WORKDIR /usr/app-auth/
RUN npm install --only=production



#default environment variables
ENV NODE_ENV production
ENV PORT 8087
EXPOSE 8087
CMD ["pm2-runtime", "npm", "--", "start"]