define('a', ['b', 'c'], function (b, c) {
   return {name: 'a', deps: [b.name, c.name]}
});
