import React from "react";
import Phaser from "phaser";
import TopBar from "./TopBar";

var config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
var fruit;
var appleText, orangeText, peachText, moneyText, saveText, workerText;
var appleSell, orangeSell, peachSell;
var plusApple, plusOrange, plusPeach, minusApple, minusOrange, minusPeach;
var addAll, addAllButton;
var appleSellNum = 0;
var peachSellNum = 0;
var orangeSellNum = 0;
var moneyEarned = 0;
var moneyEarnedText;
var appleNum = 0;
var orangeNum = 0;
var peachNum = 0;
var moneyNum = 0;
var upgradeText;
var sell;
var currCost = 1;
var nextFruit;
var upgradeMessage;
var worker;
var workerNum = 0;
var workerOwned;
var fertilizerApple, fertilizerOrange, fertilizerPeach;
var fertilizerAppleOwned, fertilizerOrangeOwned, fertilizerPeachOwned;
var pBest = 0; //mongo good maybe
var pBestText;
var workersText;
var fertText;
var username;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("tree", "assets/tree.png");
  this.load.image("apple", "assets/apple.png");
  this.load.image("orange", "assets/orange.png");
  this.load.image("peach", "assets/peach.png");
  this.load.image("plus", "assets/plus.png");
  this.load.image("minus", "assets/minus.png");
  this.load.image("save", "assets/save.png");
  this.load.image("store", "assets/store.png");
  this.load.image("bench", "assets/bench.png");
  this.load.image("upgrade", "assets/upgrade.png");
  this.load.image("sell", "assets/sell.png");
  this.load.image("worker", "assets/worker.png");
  this.load.image("fertilizerApple", "assets/fertilizerApple.png");
  this.load.image("fertilizerOrange", "assets/fertilizerOrange.png");
  this.load.image("fertilizerPeach", "assets/fertilizerPeach.png");
}

async function create() {
  //  A simple background for our game
  this.add.image(400, 300, "sky");
  //this.add.image(400, 400, 'tree');
  this.add.image(400, 300, "tree");
  saveText = this.add.image(750, 20, "save").setInteractive(); //Click to save

  //upgrade farm
  upgradeText = this.add.image(50, 568, "upgrade").setInteractive();
  if (currCost === 1) {
    nextFruit = "oranges.\nPrice: $10";
  } else {
    nextFruit = "peaches.\nPrice: $20";
  }
  upgradeMessage = this.add.text(110, 552, "Upgrade to " + nextFruit, {
    fontSize: "20px",
    fill: "#000",
  });
  upgradeText.on("pointerdown", function (pointer) {
    if (moneyNum >= 10 * currCost && currCost < 3) {
      moneyNum -= 10 * currCost;
      currCost++;
      moneyText.setText("$" + moneyNum);
      if (currCost === 1) {
        nextFruit = "oranges.\nPrice: $10";
        upgradeMessage.setText("Upgrade to " + nextFruit);
        fertText.setText("Fertilzer: $100\n Every click\npicks 2 fruits");
      } else if (currCost === 2) {
        nextFruit = "peaches.\nPrice: $20";
        upgradeMessage.setText("Upgrade to " + nextFruit);
        fertText.setText("Fertilzer: $100\n Every click\npicks 2 fruits");
      } else {
        upgradeMessage.setText("No more upgrades");
        fertText.setText("Fertilzer: $100\n Every click\npicks 2 fruits");
      }
    }
  });

  //  The scores
  appleText = this.add.text(10, 16, "Apples: " + appleNum, {
    fontSize: "32px",
    fill: "#000",
  });
  orangeText = this.add.text(10, 48, "Oranges: " + orangeNum, {
    fontSize: "32px",
    fill: "#000",
  });
  peachText = this.add.text(10, 80, "Peaches: " + peachNum, {
    fontSize: "32px",
    fill: "#000",
  });
  workersText = this.add.text(10, 112, "Workers:" + workerNum, {
    fontSize: "32px",
    fill: "#000",
  });
  moneyText = this.add.text(10, 144, "$" + moneyNum, {
    fontSize: "32px",
    fill: "#000",
  });

  //Selling fruits for money
  this.add.text(10, 374, "Fruit to Sell", { fontSize: "32px", fill: "#000" });
  //apples
  appleSell = this.add.text(10, 400, "Apples($1): " + appleSellNum, {
    fontSize: "24px",
    fill: "#000",
  });
  minusApple = this.add.image(290, 408, "minus").setInteractive();
  plusApple = this.add.image(320, 408, "plus").setInteractive();
  minusApple.on("pointerdown", function (pointer) {
    if (appleSellNum > 0) {
      appleSellNum--;
      moneyEarned--;
      appleSell.setText("Apples($1): " + appleSellNum);
      moneyEarnedText.setText("Money Earned: " + moneyEarned);
    }
  });
  plusApple.on("pointerdown", function (pointer) {
    if (appleSellNum < appleNum) {
      appleSellNum++;
      moneyEarned++;
      appleSell.setText("Apples($1): " + appleSellNum);
      moneyEarnedText.setText("Money Earned: " + moneyEarned);
    }
  });
  //Oranges
  orangeSell = this.add.text(10, 424, "Oranges($2): " + orangeSellNum, {
    fontSize: "24px",
    fill: "#000",
  });
  minusOrange = this.add.image(290, 434, "minus").setInteractive();
  plusOrange = this.add.image(320, 434, "plus").setInteractive();
  minusOrange.on("pointerdown", function (pointer) {
    if (orangeSellNum > 0) {
      orangeSellNum--;
      moneyEarned -= 2;
      orangeSell.setText("Oranges($2): " + orangeSellNum);
      moneyEarnedText.setText("Money Earned: " + moneyEarned);
    }
  });
  plusOrange.on("pointerdown", function (pointer) {
    if (orangeSellNum < orangeNum) {
      orangeSellNum++;
      moneyEarned += 2;
      orangeSell.setText("Oranges($2): " + orangeSellNum);
      moneyEarnedText.setText("Money Earned: " + moneyEarned);
    }
  });
  //Peaches
  peachSell = this.add.text(10, 448, "Peaches($5): " + peachSellNum, {
    fontSize: "24px",
    fill: "#000",
  });
  minusPeach = this.add.image(290, 460, "minus").setInteractive();
  plusPeach = this.add.image(320, 460, "plus").setInteractive();
  minusPeach.on("pointerdown", function (pointer) {
    if (peachSellNum > 0) {
      peachSellNum--;
      moneyEarned -= 5;
      peachSell.setText("Peaches($5): " + peachSellNum);
      moneyEarnedText.setText("Money Earned: " + moneyEarned);
    }
  });
  plusPeach.on("pointerdown", function (pointer) {
    if (peachSellNum < peachNum) {
      peachSellNum++;
      moneyEarned += 5;
      peachSell.setText("Peaches($5): " + peachSellNum);
      moneyEarnedText.setText("Money Earned: " + moneyEarned);
    }
  });
  moneyEarnedText = this.add.text(10, 472, "Money Earned: " + moneyEarned, {
    fontSize: "24px",
    fill: "#000",
  });


  addAll = this.add.text(120,510, "Sell all fruits",{
    fontSize: "24px",
    fill: "#000",
  })
  addAllButton = this.add.image(365,517, "plus").setInteractive();
  addAllButton.on("pointerdown",function(pointer){
     appleSellNum = appleNum
     orangeSellNum = orangeNum
     peachSellNum = peachNum
     appleSell.setText("Apples($1): " + appleSellNum);
     orangeSell.setText("Oranges($2): " + orangeSellNum);
     peachSell.setText("Peaches($5): " + peachSellNum);
     moneyEarned = appleSellNum + (2 * orangeSellNum) + (5 * peachSellNum)
     moneyEarnedText.setText("Money Earned: " + moneyEarned);
  })



  //sell fruit button
  sell = this.add.image(50, 520, "sell").setInteractive();
  sell.on("pointerdown", function (pointer) {
    appleNum -= appleSellNum;
    orangeNum -= orangeSellNum;
    peachNum -= peachSellNum;
    moneyNum += moneyEarned;
    appleSellNum = 0;
    orangeSellNum = 0;
    peachSellNum = 0;
    moneyEarned = 0;
    appleSell.setText("Apples($1): " + appleSellNum);
    orangeSell.setText("Oranges($2): " + orangeSellNum);
    peachSell.setText("Peaches($5): " + peachSellNum);
    moneyEarnedText.setText("Money Earned: " + moneyEarned);
    appleText.setText("Apples: " + appleNum);
    orangeText.setText("Oranges: " + orangeNum);
    peachText.setText("Peaches: " + peachNum);
    moneyText.setText("$" + moneyNum);
  });

  //Shop for fertilizer or pickers(add display)
  this.add.text(610, 400, "Shop", { fontSize: "32px", fill: "#000" });
  //Worker
  worker = this.add.image(720, 500, "worker").setInteractive();
  workerText = this.add.text(
    665,
    550,
    "Worker: $10\n Will pick\nfruit for you",
    { fontSize: "16px", fill: "#000" }
  );
  worker.on("pointerdown", function (pointer) {
    if (moneyNum >= 10) {
      workerOwned = true;
      workerNum++;
      moneyNum -= 10;
      moneyText.setText("$" + moneyNum);
      workersText.setText("Workers: " + workerNum);
    }
  });

  //Fertilizers
  fertText = this.add.text(
    500,
    550,
    "Fertilzer: $100\n Every click\npicks 2 fruits",
    { fontSize: "16px", fill: "#000" }
  );

  //If worker is owned, add 1 fruit every 2 seconds
  this.time.addEvent({
    delay: 2000,
    callback: onEvent,
    callbackScope: this,
    loop: true,
  });

  pBestText = this.add.text(600, 50, "Personal Best:\n$" + pBest, {
    fontSize: "24px",
    fill: "#000",
  });
  saveText.on("pointerdown", function (pointer) {
    //Database stuff goes here
    //Save, store stuff in db
    //Change personal best if it's a new high
    if (moneyNum > pBest) {
      updateScore();
    }
  });
}

async function updateScore() {
  if (moneyNum > pBest) {
    pBest = moneyNum;
    pBestText.setText("Personal Best:\n$" + pBest);
    console.log("test");

    let bod = { username: username, score: pBest };
    const response = await fetch("http://localhost:3001/api/updateScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bod),
    });
    //pBestText.setText(""+bod);
    const updatedUser = await response.json();
    console.log(bod);
  }
}

function update() {
  if (currCost === 1) {
    fertilizerApple = this.add
      .image(570, 495, "fertilizerApple")
      .setInteractive();
    fertilizerApple.on("pointerdown", function (pointer) {
      if (moneyNum >= 100) {
        fertilizerAppleOwned = true;
        moneyNum -= 100;
        moneyText.setText("$" + moneyNum);
        fertText.setText("Fertilzer: BOUGHT\n Every click\npicks 2 fruits");
      }
    });
  } else if (currCost === 2) {
    fertilizerOrange = this.add
      .image(570, 495, "fertilizerOrange")
      .setInteractive();
    fertilizerOrange.on("pointerdown", function (pointer) {
      if (moneyNum >= 100) {
        fertilizerOrangeOwned = true;
        moneyNum -= 100;
        moneyText.setText("$" + moneyNum);
        fertText.setText("Fertilzer: BOUGHT\n Every click\npicks 2 fruits");
      }
    });
  } else {
    fertilizerPeach = this.add
      .image(570, 495, "fertilizerPeach")
      .setInteractive();
    fertilizerPeach.on("pointerdown", function (pointer) {
      if (moneyNum >= 100) {
        fertilizerPeachOwned = true;
        moneyNum -= 100;
        moneyText.setText("$" + moneyNum);
        fertText.setText("Fertilzer: BOUGHT\n Every click\npicks 2 fruits");
      }
    });
  }

  //Apple, orange, or peach
  if (currCost >= 1) {
    fruit = this.add.image(400, 200, "apple").setInteractive();
    fruit.on("pointerdown", function (pointer) {
      //Increment apples with every touch
      if (fertilizerAppleOwned) {
        appleNum += 2;
      } else {
        appleNum++;
      }
      appleText.setText("Apples: " + appleNum);
    });
    //fruit.setActive(false).setVisible(false);
  }
  if (currCost >= 2) {
    //fruit.setActive(false).setVisible(false);
    fruit = this.add.image(200, 250, "orange").setInteractive();
    fruit.on("pointerdown", function (pointer) {
      //Increment oranges with every touch
      if (fertilizerOrangeOwned) {
        orangeNum += 2;
      } else {
        orangeNum++;
      }
      orangeText.setText("Oranges: " + orangeNum);
    });
  } 
   if (currCost >= 3) {
    fruit = this.add.image(620, 270, "peach").setInteractive();
    fruit.on("pointerdown", function (pointer) {
      //Increment peaches with every touch
      if (fertilizerPeachOwned) {
        peachNum += 2;
      } else {
        peachNum++;
      }
      peachText.setText("Peaches: " + peachNum);
    });
  }
}
//worker picking
function onEvent() {
  if (workerOwned) {
    if (currCost == 1) {
      appleNum = appleNum + workerNum * 1;
      appleText.setText("Apples: " + appleNum);
    } else if (currCost == 2) {
      orangeNum = orangeNum + workerNum * 1;
      orangeText.setText("Oranges: " + orangeNum);
    } else {
      peachNum = peachNum + workerNum * 1;
      peachText.setText("Peaches: " + peachNum);
    }
  }
}

function start(score, user) {
  pBest = score;
  username = user;
  new Phaser.Game(config);
}
function GameDev(props) {
 
  return <div>
      <TopBar></TopBar>
      {start(props.user.score, props.user.username)}
    </div>;
}
export default GameDev;
