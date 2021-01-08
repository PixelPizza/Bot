<img align="left" width="50px" src="https://user-images.githubusercontent.com/60853956/97776540-4c446980-1b69-11eb-9fdc-98b4ab65be6b.png"> Pixel Pizza by jaronetje
===

[![](https://img.shields.io/github/issues/PixelPizza/PixelPizza-js?color=green&style=plastic)](https://github.com/PixelPizza/PixelPizza-js/issues?q=is%3Aopen+is%3Aissue)
[![](https://img.shields.io/github/issues-closed/PixelPizza/PixelPizza-js?color=red&style=plastic)](https://github.com/PixelPizza/PixelPizza-js/issues?q=is%3Aissue+is%3Aclosed) 
[![](https://img.shields.io/github/languages/top/PixelPizza/PixelPizza-js?color=yellow&style=plastic)](https://github.com/PixelPizza/PixelPizza-js/search?l=javascript) 
![](https://img.shields.io/github/package-json/v/PixelPizza/PixelPizza-js/PixelPizzaAlternate?label=version&style=plastic) 
![](https://img.shields.io/github/contributors/PixelPizza/PixelPizza-js?style=plastic) 
![](https://img.shields.io/github/last-commit/PixelPizza/PixelPizza-js/PixelPizzaAlternate?style=plastic) 
![](https://img.shields.io/github/package-json/keywords/PixelPizza/PixelPizza-js?style=plastic) 
![](https://img.shields.io/github/package-json/author/PixelPizza/PixelPizza-js?style=plastic&color=red) 
![](https://img.shields.io/github/v/release/PixelPizza/PixelPizza-js?include_prereleases&style=plastic)

<br />

[![](https://img.shields.io/discord/709698572035162143?label=Discord%20Chat)](https://discord.gg/AW7z9qu)

Description
---
An alternate version of the pixel pizza bot for if the website is down

Requirements
---
If you want to host your own version you will need to make your own secrets.json file
```json
{
  "token": "BOT_TOKEN",
  "dbltoken": "DBL_TOKEN", // Optional
  "twitchtoken": "TWITCH_TOKEN", // Optional
  "database": {
    "host": "HOST",
    "user": "USER",
    "password": "PASSWORD",
    "database": "DATABASE"
  }
}
```
Or you can use environment variables  
The environment variables used in this bot are
* BOT_TOKEN
* DBL_TOKEN (optional)
* TWITCH_TOKEN (optional)
* DATABASE_HOST
* DATABASE_USER
* DATABASE_PASS
* DATABASE_DB

You will also have to set up a database  
Here is the mysql code for making the full database (extensions excluded)
```sql
START TRANSACTION;

CREATE DATABASE IF NOT EXISTS `pixelpizza` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `pixelpizza`;

CREATE TABLE `application` (
  `applicationId` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `applicationType` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(16) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'none',
  `answers` json NOT NULL,
  `appliedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `staffId` varchar(18) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `blacklisted` (
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `reason` varchar(535) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no reason specified'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `bug` (
  `bugId` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `bug` text COLLATE utf8_unicode_ci NOT NULL,
  `handled` tinyint(1) NOT NULL DEFAULT '0',
  `staffId` varchar(18) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `bugNote` (
  `bugId` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `note` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `complaint` (
  `complaintId` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `complaint` text COLLATE utf8_unicode_ci NOT NULL,
  `handled` tinyint(1) NOT NULL DEFAULT '0',
  `staffId` varchar(18) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `complaintNote` (
  `complaintId` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `note` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `item` (
  `itemId` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `price` bigint(20) NOT NULL DEFAULT '0',
  `description` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `endTime` date DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT '-1',
  `requiredRole` varchar(18) COLLATE utf8_unicode_ci DEFAULT NULL,
  `givenRole` varchar(18) COLLATE utf8_unicode_ci DEFAULT NULL,
  `removedRole` varchar(18) COLLATE utf8_unicode_ci DEFAULT NULL,
  `requiredBalance` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

CREATE TABLE `order` (
  `orderId` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `guildId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `channelId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `cookId` varchar(18) COLLATE utf8_unicode_ci DEFAULT NULL,
  `delivererId` varchar(18) COLLATE utf8_unicode_ci DEFAULT NULL,
  `imageUrl` mediumtext COLLATE utf8_unicode_ci,
  `status` varchar(16) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'not claimed',
  `order` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `orderedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cookedAt` timestamp NULL DEFAULT NULL,
  `deliveredAt` timestamp NULL DEFAULT NULL,
  `deliveryMethod` enum('dm','personal','bot','none','unknown') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'none'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `string` (
  `key` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `string` (`key`, `value`) VALUES
('anarchyDay', '');

CREATE TABLE `suggestion` (
  `suggestionId` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `suggestion` varchar(2048) COLLATE utf8_unicode_ci NOT NULL,
  `handled` tinyint(1) NOT NULL DEFAULT '0',
  `staffId` varchar(18) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `suggestionNote` (
  `suggestionId` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `note` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `toggle` (
  `key` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `value` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `toggle` (`key`, `value`) VALUES
('addExp', 1),
('cookOwnOrder', 0),
('cooldowns', 1),
('deliverOwnOrder', 0),
('developerApplications', 1),
('pponlyChecks', 1),
('staffApplications', 1),
('teacherApplications', 1),
('workerApplications', 1);

CREATE TABLE `user` (
  `userId` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `exp` bigint(20) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT '0',
  `balance` bigint(20) NOT NULL DEFAULT '0',
  `lastVote` timestamp NULL DEFAULT NULL,
  `styleBack` varchar(9) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `styleFront` varchar(9) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `styleExpBack` varchar(9) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `styleExpFront` varchar(9) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `application`
  ADD PRIMARY KEY (`applicationId`);

ALTER TABLE `blacklisted`
  ADD PRIMARY KEY (`userId`);

ALTER TABLE `bug`
  ADD PRIMARY KEY (`bugId`);

ALTER TABLE `bugNote`
  ADD PRIMARY KEY (`bugId`,`userId`);

ALTER TABLE `complaint`
  ADD PRIMARY KEY (`complaintId`);

ALTER TABLE `complaintNote`
  ADD PRIMARY KEY (`complaintId`,`userId`);

ALTER TABLE `item`
  ADD PRIMARY KEY (`itemId`),
  ADD UNIQUE KEY `UNIQUE_name` (`name`);

ALTER TABLE `order`
  ADD PRIMARY KEY (`orderId`);

ALTER TABLE `string`
  ADD PRIMARY KEY (`key`);

ALTER TABLE `suggestion`
  ADD PRIMARY KEY (`suggestionId`);

ALTER TABLE `suggestionNote`
  ADD PRIMARY KEY (`suggestionId`,`userId`);

ALTER TABLE `toggle`
  ADD PRIMARY KEY (`key`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`);

ALTER TABLE `userItem`
  ADD PRIMARY KEY (`userId`);

ALTER TABLE `worker`
  ADD PRIMARY KEY (`workerId`);

ALTER TABLE `bugNote`
  ADD CONSTRAINT `bugNote_ibfk_1` FOREIGN KEY (`bugId`) REFERENCES `bug` (`bugid`);

ALTER TABLE `complaintNote`
  ADD CONSTRAINT `complaintNote_ibfk_1` FOREIGN KEY (`complaintId`) REFERENCES `complaint` (`complaintid`);

ALTER TABLE `suggestionNote`
  ADD CONSTRAINT `suggestionNote_ibfk_1` FOREIGN KEY (`suggestionId`) REFERENCES `suggestion` (`suggestionid`);
COMMIT;
```

Commands
---
<details>
  <summary>Director Commands</summary>
  
  * blacklist
    * blacklist a user from using pixel pizza commands
  * expadd
    * add exp to a user
  * expremove
    * remove exp from a user
  * expset
    * set the exp of a user
  * leveladd
    * add levels to a user
  * levelremove
    * remove levels from a user
  * levelset
    * set the level of a user
  * unblacklist
    * unblacklist a user from using pixel pizza commands
</details>

<details>
  <summary>Staff Commands</summary>
  
  * accept
    * accept an application
  * application
    * look at an application by application id
  * applications
    * show all applications
  * backdoor
    * get invite link of a guild (this is used for if the invite is lost or has been expired)
  * complaint
    * show a single complaint
  * complaints
    * show all complaints
  * handle 
    * handle a suggestion or complaint
  * reject
    * reject an application
  * suggestion
    * show a single suggestion
  * suggestions
    * show all suggestions
  * toggle
    * toggle a setting on or off
  * toggles
    * shows all toggles
  * unhandle
    * unahndle a handled complaint or suggestion
  * user
    * get a users info with the users id
  * worker
    * get info on a pixel pizza worker with the user id
  * workers
    * show all Pixel Pizza workers
</details>

<details>
  <summary>Teacher Commands</summary>

  None
</details>

<details>
  <summary>Worker Commands</summary>
  
  * change
    * change the image of a cooking or cooked order
  * claim
    * claim an order as cook
  * cook
    * cook an order
  * deliver
    * deliver an order
  * deliverdm
    * deliver an order straigt to the dm of the orderer
  * deliverpersonal
    * deliver an order personally (can be done once a day)
  * deliverset
    * set your delivery message
  * images
    * search for images
  * look
    * look at an order by order id
  * orders
    * show all orders
  * remove
    * remove an order if it doesn't follow the rules
  * servers
    * show all servers the Pixel Pizza is in
  * unclaim
    * unclaim a claimed order
</details>

<details>
  <summary>Vip Commands</summary>
  
  None
</details>

<details>
  <summary>Other Commands</summary>
  
  * anarchy
    * show info on anarchy day
  * applicationtypes
    * show all application types and if they are opened
  * apply
    * apply in pixel pizza for worker, developer, staff or teacher
  * balance
    * show your balance
  * balancetop
    * look at the balance leaderboard
  * cancel
    * cancel your order
  * complain
    * make a complaint
  * edit
    * edit your order if it has not been claimed yet
  * help
    * list of all executable commands
  * invite
    * invite the bot
  * leaderboard
    * see the pixel pizza ranking leaderboard
  * menu
    * show a menu of pizzas to choose from
  * myorder
    * see your current order
  * order
    * order a pizza
  * pay
    * pay someone money
  * ping
    * ping the bot
  * pizza
    * show a random delivered pizza
  * rank
    * see your or someone elses rank
  * rules
    * show the rules of pixel pizza
  * suggest
    * suggest a feature
  * support
    * get the invite link to pixel pizza
  * vote
    * vote for Pixel Pizza
  * work
    * earn money by working
</details>

Visual Studio Code Extension
---
I have made a [visual studio code extension](https://marketplace.visualstudio.com/items?itemName=PixelPizza.pixel-pizza-snippets) for Pixel Pizza developers which currently has many snippets for JavaScript, TypeScript and Java

[Github Project](https://github.com/PixelPizza/pixel-pizza-snippets)
