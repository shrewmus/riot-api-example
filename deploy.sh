#!/bin/bash
export DIR_NAME=tproj

export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

wait_for_postgresql() {
  docker-compose up -d
  while true; do
      status=$(docker-compose ps | grep pg-dev-tst | awk '{print $4}')
      if [ "$status" == "Up" ] || [ "$status" == "Up (healthy)" ]; then
        echo "PostgreSQL is ready."
        break
      fi
      sleep 1
  done
}

wait_for_postgresql_stop() {
  while true; do
      status=$(docker-compose ps | grep pg-dev-tst | awk '{print $4}')
      if [ "$status" == "Exit" ]; then
        echo "PostgreSQL is stopped"
        break
      fi
      sleep 1
  done
}

# check if it a new deploy
if [ ! -d "$DIR_NAME" ]; then
  mkdir "$DIR_NAME"
  cd "$DIR_NAME"
  git clone git@github.com:shrewmus/riot-api-example.git .
  echo "${ENV_CONTENTS}" > .env
  npm install --production
  npm run build
  wait_for_postgresql
  pm2 start ./dist/main.js
else
  cd "$DIR_NAME"
  pm2 stop main
  docker-compose stop
  git pull origin master
  echo "${ENV_CONTENTS}" > .env
  npm install --production
  wait_for_postgresql_stop
  pm2 start ./dist/main.js
fi


