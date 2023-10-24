# TODO

## Client
- no empty titles allowed
- Display items list
- Items list functionality

## Server
- 

## Database related
- With ``Connection:``
    - should the reads be made to local database even with connection?
        - Server sends updates every time it is updated
    - should the requests should always be made to the server?
        - Every read to server side database (with connection) so that way we have everything updated.
    - Creating a ``new Shopping List`` should the request be send automatically to Server or made it locally and _``dirty``_

- With ``No Connection:``
    - requests to local database
    - every time new user is created, create a new local database
    - when creating a new 'Shopping List'

- Items that are __``dirty``__:
    - When there is connection should the Clients checks for dirty content and send it to the Server?
    - The Server can reject the dirty content if it is older than the current alteration?

- How does the local database knows if it has deprecated content? How would this be done?
    - Every time a Client connects try to send dirty content if any exists and checks for updates after?
    