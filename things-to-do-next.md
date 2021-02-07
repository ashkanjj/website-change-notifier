Things to do next :
Getting the commit out there

- provide a way to configure sendGrid settings DONE
- sendGrid key (could be just in the env or the json file could be overwritten)
- from email, recipients etc. DONE
- test it once with sending emails to the recipients DONE
- git commit DONE
- Currently going through the code and refactoring and making it better
- Learn how to handle file paths for example to get something from the root of the directory rather than relative in go (look at cairo) DONE
- Carry on adding a test for everything, next is email_service.go IT"S very tightly integrated with sendgrid
- Carry on adding a test for process THIS ONE
- While doing the above, I can't figure out a way to stop the ticker and end the function execution therefore the test is never finished DONE
  - So now I had a little refresher of goroutines and channels and select (which I now know that it will ONLY select one case and gives control back to the main goroutine). Also i've realised that my select{} without for{} is broken and it's not an infinite loop. So now I have to figure out a way to run an infinite loop with a way to stop it for testing purposes (hint: Look at the docs for time.NewTicker)
- Write tests for the process file DONE
- What am I doing next? need to figure out a way of skipping certain html chunks from the diffs
  - we have a cli tool which is actually quite nice for developers however how would they ignore certain html chunks from the diff like a cookie that comes up every now and then
    ideas: 1. One way is to store each website as a series of files THIS 3. It's probably best to store each change under a file
    -add latest file name the url name inside snapshots DONE
- Next is to complete the modules article and the packages article and then go back to the next item DONE
- next is to add the log with the correct date DONE
- Read about pointers DONE
- learn how to do fmt.SprintF, Println because it's getting embarresing
- Add the snaps one per snap inside a directory named after the website DONE
- The other tool can be called websiteChangeDiffer DONE
- Add another cli tool which starts a differ server that has a UI and using that UI the user can go and exclude chunks of text from the diffing algorithm THIS IS NOW
  - Now I need to understand how to set a server up...reading list:
    - https://golang.org/doc/articles/wiki/ DONE
    - https://golang.org/doc/effective_go.html ( i should understand this)
- You've decided to with with bbolt and have a separate repo called messing_with_bolt inside the test folder of the projects folder
- Next is to figure out how to abstract the updates to websites,
  snapshots and exclusions in a wayin that makes sense,
  testable and possibly in a way that we're not leaking too much of bbolt
  into each abstraction (this is essentially going to replace my current types and interfaces) DONE the I've created Website and Snapshot abstractions for now
- I've so far added Website which adds a new entry to bolt and Snapshot which also adds a new entry for each snapshot created
- Go through this for application folder structure first https://medium.com/@benbjohnson/standard-package-layout-7cdbc8391fc1
- You've gone with the approach of adding one db interface (called Storage) for your database interactions which is fantastic because it means you have added an implementation
  for the database which uses bolt but now you can write e different version for test purposes which maybe uses an in memory map instead
- Next is the ReadLatest function which needs to create a key value map of all the website snapshots, sort them by latest date first, and return the first one (latest one)
  For sorting look at https://golang.org/pkg/sort/ and https://gist.github.com/xigang/827e342fc2580198f625ce272257ef37. how to get all items out of bolt is already done in your messing_with_bolt repo DONE
- Now add tests and make sure all is well
- Add tests for the databse and anything else missing (don't forget this is will be public and hopefully used..also we need badges for tests and test coverage)
- https://blog.questionable.services/article/vue-react-ember-server-golang/ read this next and make sure the changeExcluder is aligned with this (having handlers folders etc.) DONE
- Now i'm trying to change my go-websiteChangeExcluder to run off of the db. But as I started consuming db.go file and the db.Store and started writing my ListWebsite function there I've realised that I don't want my db.go to be coupled with the type of the entity it's returning....or do I?
  Go through this video https://www.youtube.com/watch?v=oL6JBUk6tj0 has got the answers DONE
- I've gone through the video it was very good...She talked about using DDD concepts in the folder structure and even provided some examples domain-hex and domain-hex-actor. It's difficult to summarise the video but if I had to it would be to group folders by context (adding, listing, revewiing) rather than what they contain
  and have two top level folders called cmd and pkg (i'm already using the cmd folder which is great) next is to come up with a list of ddd terms and categories for my project, go through her examples (using the video as reference and refresher) and start applying it to my folder strucutre
- I've identified the domain services and external services.
  Next is to move things into cmd/ for notifier-cli and excluder-web to add their main file and pkg/ which will contain domain service folders, http (the static folder goes in here as well), storage, and email. Also I think Process will have to go to the SnapshotAdding.addSnapshot()....actually I don't know maybe it will just sit in main.go of the notifier-cli
- I've started the folder changes. So far I've added notifier and excluder folders and a pkg/storage/bolt/. I've added the repository.go is the file i'm editing at the moment...i've added snapshot.go inside the folder now need to change LatestSnapshot to pass the webId and addition to Date and Content
- Next start moving the cli related changes inside the pkg/cli folder DONE
- Next is making sure storage CreateWebsite references the actual type in adding.Website since storage is in the outer layer of the hexagonal layout and can reference inwards DONE
- Next add email sender DONE
- Fix the issue in latestSnapshot where the regex is splitting the date wrong because there is a : in the middle DONE althought not the best
- test that it's working DONE
- add the handlers in a handler file ONGOING
- I can't serve any files....index.html or static content can't be served
- maybe write about it a bit
- move on to the FE

Best way to test the app:

- Create a mock database
- Create a mock server with some mock content
- pass the mock db and the mock endpoint to the cli
- Make sure an item is added to the db for the initial snapshot
- make a change to the server
- make sure a new snapshot is added there
