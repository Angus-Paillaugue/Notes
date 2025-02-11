#!/bin/bash

function generateRandomString() {
  echo $(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
}

dockerComposeFileLocation="$(dirname $0)/docker-compose.yaml"
dotEnvFileLocation="$(dirname $0)/.env"
inputSqlScriptFileLocation="$(dirname $0)/config/init-base.sql"
outputSqlScriptFileLocation="$(dirname $0)/config/init.sql"

# If .env file does not exists, create it using default values
if [ ! -f $dotEnvFileLocation ]; then
  {
    echo "JWT_SECRET=$(generateRandomString)"
    echo "MYSQL_PASSWORD=$(generateRandomString)"
    echo "MYSQL_USER=note"
    echo "MYSQL_DATABASE=note"
    echo "MYSQL_HOST=db"
    echo "MYSQL_RANDOM_ROOT_PASSWORD=yes"
  } > $dotEnvFileLocation
fi

source $dotEnvFileLocation

mkdir -p $(dirname $outputSqlScriptFileLocation)

if [ ! -f $outputSqlScriptFileLocation ]; then
  # Download the base sql file if not exists
  if [ ! -f $inputSqlScriptFileLocation ]; then
    curl -s https://raw.githubusercontent.com/Angus-Paillaugue/Notes/refs/heads/main/init.sql -o $inputSqlScriptFileLocation
  fi
  # Replace mysql password in the sql script into a temp file
  sed "s/MYSQL_PASSWORD/$MYSQL_PASSWORD/g" $inputSqlScriptFileLocation > $outputSqlScriptFileLocation
fi


# Download the docker-compose file if not exists
if [ ! -f $dockerComposeFileLocation ]; then
  curl -s https://raw.githubusercontent.com/Angus-Paillaugue/Notes/refs/heads/main/docker-compose.yaml -o $dockerComposeFileLocation
fi

# Start the services
docker compose -f $dockerComposeFileLocation up -d
