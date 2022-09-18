import { table } from 'table';

// Input
const instancePricing = 0.0552;

const weekdayHours = 6.5;
const weekendHours = 12;

// Calculation
const weekdayPricing = weekdayHours * instancePricing;
const weekdaysPricing = weekdayPricing * 5;

const weekendDayPricing = weekendHours * instancePricing;
const weekendPricing = weekendDayPricing * 2;

const weeklyPricing = weekendPricing + weekdayPricing;

const monthlyPricing = (weeklyPricing * 4) + 0.10;

const yearlyPricing = monthlyPricing * 12;

// Output
let data = [
    ['Scope', 'Pricing (USD)'],
    ['1 Hour', instancePricing],
    ['Weekday', weekdayPricing],
    ['Mon-Fri', weekdaysPricing],
    ['Weekend Day', weekendDayPricing],
    ['Weekend', weekendPricing],
    ['Week', weeklyPricing],
    ['Month', monthlyPricing],
    ['Year', yearlyPricing],
];

const round = (float) => (Math.round(float * 100) / 100).toFixed(2);

for (let i = 1; i < data.length; i++) {
    const [text, float] = data[i];
    data[i][1] = '$' + round(float);
}

console.clear();

console.log(`  ${weekdayHours} hours per weekday\n  ${weekendHours} hours per weekend day\n`)

console.log(
    table(data)
);
