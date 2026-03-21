// Step 0: initialise stuff
const shopItems = [
    {
        name: "Automator",
        description: "This bot will click once every second",
        cost: 10,
        startingCost: 10,
    },
    {
        name: "Orpheus",
        description: "Orpheus will click once for every 3 clicks",
        cost: 30,
        startingCost: 50,
    }
];

let totalClickCount = 0;
let userClicks = 0; // for orpheus
let itemsOwned = [];

// Step 1: Make the thing know the html elements
const button = document.getElementById("click-button");
const count = document.getElementById("click-count");
const shopContainer = document.getElementById("shop-container");

// Step 2: Define what the thing should do

function updateUI() {
    count.textContent = totalClickCount;
}

// the code to buy the thing
function buyItem(itemName) {
    const item = shopItems.find((i) => i.name === itemName);

    if (totalClickCount >= item.cost) {
        // if you arent broke
        totalClickCount -= item.cost;
        // get rid of the money you spent
        updateUI();

        let amount = 1;

        // check if we already own the item
        const itemInArray = itemsOwned.find((obj) => obj.name === item.name);
        if (itemInArray) {
            itemInArray.amount++;
            console.log(`Found ${item.name}, added 1 !`);
            amount = itemInArray.amount;
        } else {
            itemsOwned.push({ name: item.name, amount: 1 });
            console.log(`Added ${item.name} to items owned!`);
        }

        // make 10% more each time (or 1.1x)
        item.cost = Math.ceil(item.cost * 1.1);
        createShopItems(); // added ceil to not make it decimals

        console.log(`Bought ${itemName}!`);
    } else {
        console.log(`Not enough clicks! Needs ${item.cost - totalClickCount} more!`);
        alert(`Not enough clicks! Needs ${item.cost - totalClickCount} more!`);
    }
}

function buttonClick() {
    totalClickCount++;
    userClicks++; // again for orph

    // orpheus logic: let orph be o, let human be h
    // for every 3h, add amount of o
    // if h/3 is multiple of 3, add amount of o
    const orpheus = itemsOwned.find(i => i.name === "Orpheus");
    if (orpheus && orpheus.amount > 0 && userClicks % 3 === 0) {
        // if user has more orpheus than 0 and modulo h is 0
        totalClickCount += orpheus.amount;
        // add the orpheuses
    }

    updateUI();
}

function createShopItems() {
    
    shopContainer.innerHTML = "";

    shopItems.forEach((item) => {
        const shopItem = document.createElement("div");
        shopItem.className = "shop-item";
        
        // find how many we own for the display
        const ownedData = itemsOwned.find(i => i.name === item.name);
        const countOwned = ownedData ? ownedData.amount : 0;

        shopItem.innerHTML = `
        <div>
            <h3>${item.name} (${countOwned})</h3>
            <p>${item.description}</p>
        </div>
        <div class="buy-display">
            Buy $${item.cost}
        </div>
        `;

        // make the ENTIRE tile clickable
        shopItem.addEventListener("click", () => {
            buyItem(item.name);
        });

        shopContainer.appendChild(shopItem);
    });
}


//automated clicking logic
setInterval(() => {
    const auto = itemsOwned.find(i => i.name === "Automator");
    if (auto && auto.amount > 0) {
        totalClickCount += auto.amount;
        updateUI();
    }
}, 1000);

// Step 3: Run the actula thing
createShopItems();

button.addEventListener("click", function () {
    buttonClick();
});
