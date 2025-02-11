#!/bin/sh

newVersion=$1

if [ -z "$newVersion" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

latestVersionSHA=$(docker image inspect anguspllg/note:latest  | jq -r '.[].RepoDigests[]' | awk -F@ '{print $2}')
latestVersionName=$(curl -s 'https://hub.docker.com/v2/repositories/anguspllg/note/tags' -H 'Content-Type: application/json' | jq -r '.results[] | select(.digest == "'$latestVersionSHA'") | .name' | grep -v latest)

# Ensure we have a valid version before proceeding
if [ -z "$latestVersionName" ]; then
  echo "Error: Could not determine the latest version."
  exit 1
fi

# If the latest version is the same or lower than the new version, print an error and exit
if dpkg --compare-versions "$latestVersionName" ge "$newVersion"; then
  echo "Error: New version ($newVersion) must be greater than the latest version ($latestVersionName)"
  exit 1
fi

echo "Upgrading $latestVersionName -> $newVersion"

# Build docker image
docker compose build

# Tag the image
docker tag anguspllg/note:latest anguspllg/note:$newVersion

# Push the image to the registry
docker push anguspllg/note:$newVersion

# Push the latest tag
docker push anguspllg/note:latest


# Write the new version to the package.json
jq ".version = \"$newVersion\"" package.json > temp.json && mv temp.json package.json
rm -f temp.json
