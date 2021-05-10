FROM node:15.4-alpine as rainbow_maker

LABEL authors="chewbacca"

#Linux setup
RUN apk update \
  && apk add --update alpine-sdk \
  && apk add curl vim git zsh sed supervisor \ 
  && apk del alpine-sdk \
  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
  && npm cache verify \
  && sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd

#Angular CLI
RUN npm install -g @angular/cli

RUN sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
#run echo "export PROMPT=Docker$PROMPT" >> ~/.zshrc

RUN sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="agnoster"/g' ~/.zshrc

EXPOSE 3300

# Make frontend and backend applictions
RUN mkdir -p /opt/rainbow_maker
WORKDIR /opt/rainbow_maker

# Copy app code to app dir
RUN mkdir -p /opt/rainbow_maker/angular
COPY backend/angular /opt/rainbow_maker/
# Copy server code to server dir
COPY backend/controllers /opt/rainbow_maker/controllers
COPY backend/middleware /opt/rainbow_maker/middleware
COPY backend/models /opt/rainbow_maker/models
COPY backend/routes /opt/rainbow_maker/routes
COPY backend/*.js /opt/rainbow_maker/
COPY backend/package.json /opt/rainbow_maker/

# Preload images
#COPY backend/images /opt/rainbow_maker/images

# Install dependencies
RUN npm update

ENTRYPOINT ["node", "server.js"]
