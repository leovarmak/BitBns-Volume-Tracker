# BitBns Volume Tracker

----
## What is this all about:
There were a lot of rumours lately [BitBns](http://en.wikipedia.org/wiki/Markdown), an Indian cryptocurrency exchange was faking it trade volumes. So I have decide to make this project to find out is its true.
 I have written a detailed medium post here - 

----
## Prerequisites:
* Node.js
* MySQL 5.6

----
## Install:
    git clone https://github.com/leovarmak/BitBns-Volume-Tracker.git
    cd BitBns-Volume-Tracker/
    npm install
* Setup your MySQL and fill your details inside 
    `btc.js`, `create_db.js`, `create_table.js`, `xrp.js`

* Run `node create_db.js` to create the DB.
* Run `create_table.js` to create your table scheme.

----
## Run:
    npm start
If you want you can run it with `pm2`. 

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
