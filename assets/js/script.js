
// ________________________________
// variables and initialisations...
// ________________________________

// scoreTotal records each click, manual and automatic click
let scoreTotal = 0;
let scoreDisplay = document.getElementById("scoreTotal");
scoreDisplay.innerHTML = `${scoreTotal} Cookie`;

let nbAutoClickDisplay = document.getElementById("nb_cursor");

let isAutoClickTriggered = false;
let isSteelCoolDownTime = false;  //the bonus is not yet triggered!
let isBonus30 = false;

let timeLeftHandler; //for bonus of 30 seconds
let seconds; //for bonus of 30 seconds

let cooldownTimeLeft; //for the cooldown of 2 min
let cooldownTimeLeftHandler; //for the cooldown of 2 min

// _________________
// Class declaration
// _________________
class PowerUp {
  constructor(price, button, value) {
    this.price = price;
    this.button = button;
    this.value = value;
  }
}

// __________________________________________________
// Object instanciation from class and initialisation
// __________________________________________________
let multiplier = new PowerUp(10, document.getElementById("runMultiplier"), 1);
let autoClick = new PowerUp(15, document.getElementById("runAutoClick"), 0);
let bonus = new PowerUp(200, document.getElementById("runBonus"), 0);

let powerUps = [multiplier, bonus, autoClick];

checkPowerUp(); // init button allowed or not

document.getElementById("multiplierClickValue").innerText = `Value Click: ${multiplier.value}`;
nbAutoClickDisplay.innerText = `NB Cursor: ${autoClick.value}`;

// _________
// Events...
// _________

// Manual click listener
// ---------------------
document.getElementById("runClick").addEventListener("click", () => {
  scoreTotal = scoreTotal + multiplier.value;  
  document.getElementById("scoreTotal").innerHTML = scoreTotal;
  Display();

  // call checkPowerUp() every manual and automatic click
  // to disable or not the buttons
  checkPowerUp();
});

// Automatic click listener
// ------------------------
document.getElementById("runAutoClick").addEventListener("click",() =>{
  
  scoreTotal-= autoClick.price;
  Display(); // put Display() every time the scoreTotal is changed

  if(isBonus30){
    autoClick.value = autoClick.value + 2;
  } else {
    autoClick.value = autoClick.value + 1;
  }
  
  nbAutoClickDisplay.innerText = `NB Cursor: ${autoClick.value}`;
    
  autoClick.price = autoClick.price + Math.floor((autoClick.price * 35)/100);
  autoClick.button.innerText = `Cursor Auto Click Price: ${autoClick.price}`;
   
  if(!isAutoClickTriggered){    
    setInterval(automaticClick, 1000);
  }  
  isAutoClickTriggered = true;
  checkPowerUp();
});

// Multiplier click listener
// -------------------------
document.getElementById("runMultiplier").addEventListener("click",() =>{
  scoreTotal-= multiplier.price;
  Display(); // put Display() every time the scoreTotal is changed


  if(isBonus30){
    multiplier.value = multiplier.value + 2;
  } else {
    multiplier.value = multiplier.value + 1;
  }

  document.getElementById("multiplierClickValue").innerText = `Value Click: ${multiplier.value}`;

  multiplier.price = multiplier.price + Math.floor((multiplier.price * 15)/100);
  multiplier.button.innerText = `Multiplier price: ${multiplier.price}`;
  checkPowerUp();

});

// Bonus click listener
// --------------------
document.getElementById("runBonus").addEventListener("click",() =>{
  document.getElementById("runBonus").disabled = false;
  isSteelCoolDownTime = true;  

  isBonus30 = true;

  // new price during bonus period
  multiplier.value = multiplier.value * 2;  
  document.getElementById("multiplierClickValue").innerText = `Value Click: ${multiplier.value}`;

  autoClick.value = autoClick.value * 2;
  nbAutoClickDisplay.innerText = `NB Cursor: ${autoClick.value}`;
  

  setTimeout(endCoolDownTime, 120000);
  seconds = 30;
  document.getElementById("bonus_time_left").hidden = false;
  document.getElementById("bonus_time_left").innerText = `Time left Bonus: ${seconds--} second(s)`

  scoreTotal-= bonus.price;
  Display(); // put Display() every time the scoreTotal is changed
  bonus.price = bonus.price + Math.floor((bonus.price * 50)/100);
  bonus.button.innerText = `Bonus price: ${bonus.price}`;
  
  timeLeftHandler = setInterval(refreshBonusTimeLeft, 1000);
  document.getElementById("bonus_time_left").style.color = "green";

  document.getElementById("multiplierClickValue").style.color = "green";
  nbAutoClickDisplay.style.color = "green";
  multiplier.button.style.color = "green";
  autoClick.button.style.color = "green";
  
  //cooldown
  cooldownTimeLeft = 120; // 120 sec
  document.getElementById("bonus_cooldown_time_left").hidden = false;
  document.getElementById("bonus_cooldown_time_left").innerText = `Time left CoolDown: ${cooldownTimeLeft--} second(s)`
  cooldownTimeLeftHandler = setInterval(refreshBonusCoolDownTimeLeft, 1000);
 
  checkPowerUp();  

});


// ____________
// Functions...
// ____________

function Display() {  
  scoreDisplay.innerHTML = `${scoreTotal} Cookies`;
}

function checkPowerUp(){
  powerUps.forEach(btn =>{   
    
    if (scoreTotal - btn.price >= 0) { 
      //console.log("(scoreTotal - btn.price > 0)");
      if(isSteelCoolDownTime && (btn.button.getAttribute("id") == "runBonus")){
        
        btn.button.disabled = true;    
        
      } else {
        btn.button.disabled = false;
      }        
    } else {
      btn.button.disabled = true;
    }

  });  
}

function automaticClick(){  
  scoreTotal = scoreTotal + (1 * autoClick.value);
  Display();
  // call checkPowerUp() every manual and automatic click
  // to disable or not the buttons
  checkPowerUp();  
  
}

function endCoolDownTime(){
  isSteelCoolDownTime = false;
  checkPowerUp(); 
}

function refreshBonusTimeLeft(){
  if(seconds == 0){
    clearInterval(timeLeftHandler);
    document.getElementById("bonus_time_left").innerText = `Time left Bonus: ${seconds} second(s)`
    document.getElementById("bonus_time_left").style.color = "black";

    document.getElementById("multiplierClickValue").style.color = "black";
    nbAutoClickDisplay.style.color = "black";

    multiplier.button.style.color = "white";
    autoClick.button.style.color = "white";

    multiplier.value = multiplier.value / 2;
    autoClick.value = autoClick.value / 2;

    document.getElementById("multiplierClickValue").innerText = `Value Click: ${multiplier.value}`;
    nbAutoClickDisplay.innerText = `NB Cursor: ${autoClick.value}`;
    
    isBonus30 = false;
   
  } else {
    document.getElementById("bonus_time_left").innerText = `Time left Bonus: ${seconds--} second(s)`
  } 
} 

function refreshBonusCoolDownTimeLeft(){
  if(cooldownTimeLeft == 0){
    clearInterval(cooldownTimeLeftHandler);
    document.getElementById("bonus_cooldown_time_left").innerText = `Time left CoolDown: ${cooldownTimeLeft} second(s)`

    setTimeout(() =>{
      document.getElementById("bonus_time_left").hidden = true;
      document.getElementById("bonus_cooldown_time_left").hidden = true;
    }, 2000);

  } else {
    document.getElementById("bonus_cooldown_time_left").innerText = `Time left CoolDown: ${cooldownTimeLeft--} second(s)`
  }  
}