const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const transactions = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const output = [];

const computeChange = (amount) => {
	let coin;
	let i = 0;
	const coins = [100, 25, 10, 5, 1];
	const result = [];
  while (amount && (coin = coins[i++])) {
    if (amount >= coin) {
    	for (let x = 0; x < ~~(amount / coin); x++) {
    		result.unshift(coin);
    	}
      amount %= coin;
    }
  }
  return result;
}

transactions.forEach(transaction => {
	const totalFundsCents = transaction.funds.reduce((a, b) => { return a + b; }, 0);
	const totalFundsDollars = totalFundsCents/100;
	const item = transaction.name;
	if (inventory[item] && inventory[item].quantity > 0 && totalFundsDollars >= inventory[item].price) {
		const returnedAmmount = ((totalFundsDollars - inventory[item].price).toFixed(2)) * 100;
		const change = computeChange(returnedAmmount);
		inventory[item].quantity -= 1;
		output.push({
    	"product_delivered": true,
    	change,
  	})
	} else {
		const change = computeChange(totalFundsCents);
		output.push({
    	"product_delivered": false,
    	change,
  	})
	}
});
process.stdout.write(JSON.stringify(output, null, '\t'));