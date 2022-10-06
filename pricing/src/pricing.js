import { table } from 'table';

// Input
const instancePricing = 0.0992;

const weekdayHours = 4.5;
const weekendHours = 11;

// Calculation
const weekdayPricing = weekdayHours * instancePricing;
const weekdaysPricing = weekdayPricing * 5;

const weekendDayPricing = weekendHours * instancePricing;
const weekendPricing = weekendDayPricing * 2;

const weeklyPricing = weekendPricing + weekdayPricing;

const monthlyPricing = (weeklyPricing * 4);

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
    data[i][1] = '$' + float;
}

console.clear();

console.log(`  ${weekdayHours} hours per weekday\n  ${weekendHours} hours per weekend day\n`)

console.log(
    table(data)
);
