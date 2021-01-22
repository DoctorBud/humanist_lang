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
