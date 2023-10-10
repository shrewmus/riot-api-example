# This is test or experiment to get Riot Games API for LOL
For license please see LICENSE file

Please **NOTE:** that endpoint GET /api/v1/data/leaderboard for now calculates leaders only by data that saved in local db

# TODO
## v1
- [x] get player (summoner) data by name
- [x] store player data
- [x] get matches list
- [x] add queue filter to match list
- [x] store common match data and player part of match
- [x] get user and update save stats (league api)
- [x] keep api rate limits (no queues)
- [x] get leaderboard by pleayer
- [x] cid/cd from github actions to digitalocean
- [x] check github action
- [x] add postman collection

## v2
- [ ] translate shell script to docker containers

## next
- [ ] keep api rate litmits (queues)
- [ ] add error logs
- [ ] change from auto update from typeorm entites to migrations
- [ ] add graphql
- [ ] handle bad request for api (repeat or log)
- [ ] ci/cd from github actions to aws
- [ ] caching
- [ ] annotations to swagger docs
- [ ] testing
- [ ] create scheduler (crontask) for regular checks of players updates 
