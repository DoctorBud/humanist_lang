import {tests} from './util.js'


tests('parsing 42 in different formats', [
    ['42',42],
    ['4.2',4.2],
    // ['0x42',0x42],
    // ['4.2e2',420],
    // ['42e2',4200],
    // ['42_000_000',42*1000*1000],
    // ['42%',0.42],
    // ['66.6%',0.666]
    // ['4.2 ft',[42,'ft']]
    [`"fortytwo"`,"fortytwo"],
    [`'fortytwo'`,"fortytwo"],
    [`[4,2,42]`,[4,2,42]],
]);

//- simple math + - * / using functions
// - math on lists directly

tests('arithmetic',[
    ['42',42],
    ['42+42',42+42],
    ['42-42',42-42],
    ['42*42',42*42],
    ['42/42',42/42],
//     ['[1,2,3]+[1,2,3]',[2,4,6]],
//     ['!4',2*3*4],
//     ['4**2',16],
//     ['-42',-42],
//     ['4 mod 2',4%2],
])

// tests("functions",[
//     ['42',42],
//     ['add(42,42)',84],
//     ['sub(42,42)',0],
//     ['sum([1,2,3])',6],
//     ['length([1,2,3])',3],
//     ['range(5)',[0,1,2,3,4]],
//     ['take(range(5),2)',[0,1]],
//     ['take(range(5),-2)',[3,4]],
//     [`join([1,2,3], [4,5,6])`,[1,2,3,4,5,6]],
//     [`range(0,20,5)`,[0,5,10,15]],
//     ['range(start:0, end:20, step:5)',[0,5,10,15]],
//     [`reverse(range(0,11))`,[10,9,8,7,6,5,4,3,2,1]],
//     [`range(0,11) >> reverse()`,[10,9,8,7,6,5,4,3,2,1]]
// ])