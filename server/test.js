const arr = [1, 2, 3, 4, 5, 6];
let sum = 0;
const total = arr.forEach((value) => {
    sum += value;
    return sum;
});
console.log(total);
