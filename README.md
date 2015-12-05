# Keepass-NG

Keepass-NG is currently in pre-alpha and should not be used for anything.
Most of the useful functions are not implemented yet (see TODO)

The goal is to provide a password-manager that can serve as a replacement for keepass2, 
which doesn't quite fit my workflow.


## Design goals

- Have a functional desktop-application that can do everything keepass2 can do.
- Do not expose passwords. 
    That means passwords (and other protected fields) are not held in memory but only decrypted 
    and provided when explicitely requested.
- Use a modern approach to JavaScript with es6 (classes, promises, generators)
- Try to be test-driven. When that doesn't work, at least have a lot of tests after the fact


## How to run

From the project directory, install dependencies using npm:

```bash
npm install
```

Build the application and run it:

```bash
npm start
```
    

## TODO
- ~~be able to copy protected data (like passwords) to clipboard~~
- ~~ask for password and file~~
- ~~timeout for cached password and data~~
- remember last opened file
- add search functionality honoring the `protected` and `no-search` fields of entries
- autocomplete for search
- make search available via global shortcut
- automatically type into passwd-fields (p.e. using xdotools?) 
- edit and save entries
- edit and save groups
- edit database


## Code inspired by:
- https://github.com/gesellix/keepass-node
- https://github.com/chadly/gui.keepass.io

## dependencies
On linux, for better performance:
sudo apt-get install libcrypto++-dev
