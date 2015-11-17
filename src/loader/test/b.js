define('b', ['./test/d'], function (d) {
    return {name: 'b', deps: [d.name]}
});
