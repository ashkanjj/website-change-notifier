Brain dump for website change notifier:


# Brief Description

Partly an experiment, A little tool written in Go that will take a web address as an input and informs you when something has changed



# Longer Description

it will store snapshots of the webpages (only the body) (but it will need to store them in a format that doesn't take too much space but it's still diffable and return what the difference is)

it will allow you to specify where and how it should store the result or even email it to you

# TODO
- Parse the cli for:
  - |~~Web address to listen for~~
  - An email address or a google cloud/AWS email service in which case a config file
- Take a snapshot of the current state of web document's body and store it
- start the cron job (or we can just call it listener) and have it running forever
  - at every specified tick, compare the registered document's body with what's stored on file
  - if a change is detected, compose an email and send it off to the registered email address or pass it to the configured service
- accept a signal to end the active listener

# Things to find out
  1. Find a way to use a two-way hash function so we can store the body but also recover it for diffing later, very similar to how git stores the whole snapshot of changes  
  2. Find out how to send an email 
  3. How can go be used a cron job? can it be run in the background? how can we terminate it? 
  4. How to scale it to millions of registered websites and listeners


# Run in background

Different systems have different ways to run processes in the background and the solution for any OS is typically only a google search away.

I use Ubuntu on Windows (WSL) and I do the following:

```sh
go build
nohup ./go-websiteChangeNotifier &
(copy the process ID that is's outputted)
tail -f nohup.out (watch the logs)
```

# How to run

```sh
go run main.go snapshot.go fetcher.go email.go config.go -url=http://localhost:8000 -config=./config.json 
```
// TODO: add steps to install
