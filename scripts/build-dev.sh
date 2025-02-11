#!/bin/bash

function generateRandomString() {
  echo $(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
}

dockerComposeFileLocation="$(dirname $0)/../docker-compose.yaml"
dotEnvFileLocation="$(dirname $0)/../.env"
inputSqlScriptFileLocation="$(dirname $0)/../init.sql"
outputSqlScriptFileLocation="$(dirname $0)/init-for-dev.sql"

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
  # Replace mysql password in the sql script into a temp file
  sed "s/MYSQL_PASSWORD/$MYSQL_PASSWORD/g" $inputSqlScriptFileLocation > $outputSqlScriptFileLocation
fi
