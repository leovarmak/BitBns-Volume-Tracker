# BitBns Volume Tracker

----
## What is this all about:
There were a lot of rumours lately [BitBns](http://en.wikipedia.org/wiki/Markdown), an Indian cryptocurrency exchange was faking it trade volumes. So I have decide to make this project to find out is its true.
 I have written a detailed medium post here - https://medium.com/@karthikvarma/the-dirty-and-cheap-tricks-used-by-bitbns-to-fight-competition-5ad07712a179

----
## Prerequisites:
* Node.js
* MySQL 5.6
* pm2

----
## Install:
    git clone https://github.com/leovarmak/BitBns-Volume-Tracker.git
    cd BitBns-Volume-Tracker/
    npm install
* Setup your MySQL and fill your details inside 
    `app.js`, `create_db.js`, `create_table.js`

* Run `node create_db.js` to create the DB.
* Run `node create_table.js` to create your table scheme.

* Check out the video below:
[![Video Thumbnail](https://lh3.googleusercontent.com/dwz3N8undfjUp2oOhH0Xr0X6ZGrCooVHSJfCvhno2JA_JMMAC_Pp85Nurkx1llM63Ni0ssDhSJ5YDw=w2880-h1418-rw "Video Thumbnail")](https://www.youtube.com/watch?v=kJMwJT0AEY0)


* Fill all the details such as URL to get SID and then the trade history URL, TradeHistoryBook Size, Email IDs




----
## Run:
    pm2 start app.js

User will get the timestamp on the email incase he forgets at what time her started the program

User will also get the 24 Hour Volume on the email he provided incase he forgets to stop the server exactly after 24 Hours.
 

----
## Issues:
 * You might notice a lot of "There seems to be an error getting Trade History. Retrying ...." after the like 4 Hours but you don't need to work as the program is still working and all the trades are counted.
 * You need to stop, reset the DB and the start the program again after 24 hours but since you get the total volume on email after 24 Hours, you don't need to worry.

----
## Changelog:
* Improved Performance

----
## Thanks:
* [MCD-50](https://github.com/MCD-50)
