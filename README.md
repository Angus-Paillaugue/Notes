# TODO:

 - [x] ~~Fix checkboxes not being the right ones checked on list notes~~ : Temp fix, more info in [Checkbox.svelte](src/lib/components/Checkbox/Checkbox.svelte) on line 20:22
 - [x] Add links from log-in to sign-up and vice-versa
 - [x] Add abort controller to saving function to avoid race condition to avoid saving stale data.
 - [x] Add the ability to delete notes
 - [x] Add ability to pin notes
 - [x] Add toasts
 - [x] Make it a container
 - [x] Add ability to share notes
 - [ ] Make the dashboard notes content update when going back to it from a note page after updating it's content
 - [ ] Make it a webapp
 - [ ] Make a homepage
 - [ ] Make an error page
 - [ ] Make a custom select component
 - [ ] Add ability to archive notes
 - [ ] Settings
   - [ ] Change password
   - [ ] Change username
   - [ ] Delete account


# Running
```bash
curl -s https://raw.githubusercontent.com/Angus-Paillaugue/Notes/refs/heads/main/run.sh -o run.sh
chmod +x ./run.sh
./run.sh
```


# Contributing
To dev on the project, clone the repository, then run the `./scripts/build-dev.sh` script to initialize the required environment variables.
You can then take a look at the `package.json` file to run the dev server.
