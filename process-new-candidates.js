var data = require('./app/data/new-candidates.json')
  , fs = require('fs');

var capitalize = function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

var capitalizeName = function (name) {
    if (name.indexOf('-') !== -1) {
        var parts = name.split('-');
        parts = parts.map(function (part) {
            return capitalize(part);
        });
        name = parts.join('-');
    } else {
        name = capitalize(name);
    }
    return name;
}

data.forEach(function (candidate) {
    var parts = candidate.name.split(' ');
    parts = parts.map(capitalizeName);
    candidate.name = parts.reverse().join(' ');
});

fs.writeFile('./app/data/candidates.json', JSON.stringify(data), function (err) {});
