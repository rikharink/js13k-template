/* FROM: https://github.com/herebefrogs/gamejam-boilerplate/blob/master/scripts/zipSize.js
MIT License

Copyright (c) 2017 Jerome Lecomte

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const fs = require("fs");
// report zip size and remaining bytes
const size = fs.statSync("release/game.zip").size;
const limit = 1024 * 13;
const remaining = limit - size;
const percentage = Math.round((remaining / limit) * 100 * 100) / 100;
console.log("\n-------------");
console.log(`USED: ${size} BYTES`);
console.log(`REMAINING: ${remaining} BYTES (${percentage}% of 13k budget)`);
console.log("-------------\n");
