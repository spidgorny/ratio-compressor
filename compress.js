import * as fs from "fs";
import sleep from "es7-sleep";

let convertToHex =  (ratio) => {
	let decimal = String(ratio).split('.')[1];
	// console.log(ratio, '=>', decimal)
	let hex = BigInt(decimal).toString(16)
	// console.log(ratio, '=>', decimal, '=>', hex)
	return hex;
}

// console.log(convertToHex(0), convertToHex(16), convertToHex(255), convertToHex(256))

let input = 0.25006251562890724;
input = String(input).split('.')[1];
console.log(input);
console.log(BigInt(input))
console.log(BigInt(input).toString(16))

let bytes = fs.readFileSync('package.json');
console.log(bytes);

let numerator = 500; // Number.MAX_VALUE / 2;
let denominator = 1000; // Number.MAX_VALUE;
console.log(numerator, '/', denominator, '=', numerator / denominator);

let mustBe = bytes[0];
let mustBeHex = convertToHex('0.'+mustBe);
console.log({char0: Buffer.from(new Uint8Array([mustBe]).buffer, 'binary').toString(), mustBe, mustBeHex})

let ok;
let high = denominator * 2;
let low = 1;
do {
	let ratio = numerator / denominator;
	let currentHex = convertToHex(ratio);
	console.log('[', String(low).padStart(16, ' '), '-', String(high).padStart(16, ' '), ']',
		numerator, '/', denominator, '=', ratio, 'hex', currentHex, '?=', mustBeHex);
	ok = currentHex.startsWith(mustBeHex);
	if (ok) {
		break;
	}
	if (currentHex < mustBeHex) {
		let denominatorBefore = denominator;
		let avgPlus = (high - low) / 2
		denominator -= avgPlus;
		console.log('too low', denominatorBefore, 'minus', avgPlus, '=', denominator, 'low=', denominatorBefore)
		low = denominatorBefore
	} else {
		let denominatorBefore = denominator;
		let avgMinus = (high - low) / 2;
		denominator += avgMinus;
		console.log('too high', denominatorBefore, 'add', avgMinus, '=', denominator)
		high = denominatorBefore
	}
	await sleep(1000);
} while (!ok);
