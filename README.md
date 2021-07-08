## Overview


Given a url, takes a snapshot of the content initially but will let you know when something has changed

There will also be a excluder functionality where you will be able to exclude certain content from the output (for things like cookie showing etc.)


Should have the UI where you can setup as many web pages as you like
Should also have a UI where you can exclude certian text (HTML) chunks from being considered a change




## Components


- Notifer: a cron job (could be a microservice) that constantly keeps track of all watching URLs and notify the users when something changed (could be done in Go)


## UI

Pages:
- Watched URLs
- (if no watched URLs) A simple Button to say Watch a new URL and a form to register the URL


 
## Lambdas

- POST /register -d {url: string}
- 
- Exclude chunk from URL
- 