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
  - The crawler may take some time downloading media

## After Crawling
The result of the crawling will be saved to the folder `./results/`  
Every profile has its own directory `./results/profile_id`

### Excel File
To generate the excel file:
  - Run `node ./excelizer.js`
  - Open `./data.xlsx`
  - Enjoy analytics