import pug from "pug";
const pugOut = pug.compile("h1 hello");
console.log(pugOut());