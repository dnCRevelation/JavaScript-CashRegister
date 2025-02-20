// Units of currency available
const currencyUnits = [
    ["PENNY", 0.01],
    ["NICKEL", 0.05],
    ["DIME", 0.10],
    ["QUARTER", 0.25],
    ["ONE", 1],
    ["FIVE", 5],
    ["TEN", 10],
    ["TWENTY", 20],
    ["ONE HUNDRED", 100],
];

// Variables for testing
let price = 19.5;
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
];

// Main function to calculate 
const checkCashRegister = (price, cash, cid) => {
    let changeDue = cash - price;
    let totalCID = cid.reduce((sum, curr) => sum + curr[1], 0);
    totalCID = Number(totalCID.toFixed(2));

    if (cash < price) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    if (totalCID === changeDue) {
        return { status: "CLOSED", change: cid }; 
    }

    if (totalCID < changeDue) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    let changeArr = [];
    let remainingChange = changeDue;
    for (let i = currencyUnits.length - 1; i >= 0; i--) {
        let currencyName = currencyUnits[i][0];
        let currencyValue = currencyUnits[i][1];
        let currencyAvailable = cid[i][1];

        if (remainingChange >= currencyValue && currencyAvailable > 0) {
            let amount = 0;
            while (remainingChange >= currencyValue && currencyAvailable >= currencyValue) {
                amount += currencyValue;
                remainingChange -= currencyValue;
                currencyAvailable -= currencyValue;
                remainingChange = Number(remainingChange.toFixed(2));
            }
            if (amount > 0) {
                changeArr.push([currencyName, amount]);
            }
        }
    }

    if (remainingChange > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    return { status: "OPEN", change: changeArr };
};

// Wait for page to load
document.addEventListener("DOMContentLoaded", () => {
    const cashInput = document.getElementById('cash');
    const purchaseBtn = document.getElementById('purchase-btn');
    const changeDisplay = document.getElementById('change-due');
    const priceDisplay = document.getElementById('price');

    priceDisplay.textContent = price.toFixed(2);

    purchaseBtn.addEventListener('click', () => {
        const cash = Number(cashInput.value);
        const result = checkCashRegister(price, cash, cid);

        changeDisplay.textContent = ''; // Clear previous display

        if (!cashInput.value) {
            changeDisplay.textContent = 'Please enter a cash amount';
            return;
        }

        if (cash < price) {
            alert("Customer does not have enough money to purchase the item"); // Fix #7 & #8
            return;
        }

        if (cash === price) {
            changeDisplay.textContent = 'No change due - customer paid with exact cash';
            return;
        }


        let output = `Status: ${result.status}`;
        if (result.status === "CLOSED") {
            
            result.change.forEach(([currency, amount]) => {
                if (amount > 0) { 
                    output += ` ${currency}: $${amount.toFixed(2)}`;
                }
            });
        } else if (result.status === "OPEN" && result.change.length > 0) {
            
            output += " Change: ";
            result.change.forEach(([currency, amount]) => {
                output += `${currency}: $${amount.toFixed(2)} `;
            });
        }
        changeDisplay.textContent = output;
    });
});