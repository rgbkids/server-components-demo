FROM node:14.15.3

WORKDIR /opt/vteachers-app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]
