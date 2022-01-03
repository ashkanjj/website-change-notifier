For phase 1:

1. monitoring service reads all the websites registered in the database
2. creates go routines for each website and every 5 seconds fetches the content of the website minus the excluded content
3. If any changes, it create a new snapshot and informs the user that something has changed SNS or SES
