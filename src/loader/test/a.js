define('a', ['/Marmoset/src/loader/test/b', './test/c'], function (b, c) {
   return {name: 'a', deps: [b.name, c.name]}
});
