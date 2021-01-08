# Instagram Profile Crawler

# Description

*insta-crawler* is an automated tool to crawl instagram profiles
  - Pictures
  - Videos
  - Posts
  - etc.  
Made using [puppeteer](https://github.com/puppeteer/puppeteer/).  

## How to Use!

  - Clone the repo `git clone https://github.com/ouss1002/insta-crawler`
  - Run `npm install`
  - Fill in the file `./utils/rules.js` witht the appropriate information
  - Launch `node ./connect.js` to connect with your account
  - Launch `node ./crawler.js`

## How to Win!

### Time

The game tracks the time spent using a timer, it stops when the player matches all the cards in the table.

### Stars

The player starts with 3 whole **Stars**, he loses a **Star** after making 12 and 15 moves.

### Congratz

After matching all cards, a modal appears which shows the time spent to win the game, the number of stars achieved and the number of moves exhausted.

## Additional Content

### Restart

* by clicking the **reset** button, the game restarts.

### winGame()

* is a function intended for development purposes, you can use it to test winning features, etc. without having to go through the gameplay
* Just call the function in the javascript console

### Game Sounds

* The game has sound effects (on success and failure while matching cards).