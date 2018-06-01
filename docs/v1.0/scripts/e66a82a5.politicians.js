define('politicians', ['jquery'], function ($) {
	var Politicians = function (rawData) {
        this._data = rawData;
    }

    // TODO: refactor this, it's ugly
    Politicians.prototype.getByParty = function (chamber, party, runningAgain) {
        if (!chamber) chamber = 'all';
        if (party == 'all') party = null;
        var result = { 'name' : chamber, 'children' : []}
          , populateResult = $.proxy(function (chamber, result) {
            $.each(this._data[chamber], function (idx, politician) {
                var present = false;
                $.each(result.children, function (idx, party) {
                    if (party.name === politician.group) {
                        party.children.push(politician);
                        present = true;
                    }
                });
                if (!present) {
                    var party = { name : politician.group, children : []};
                    party.children.push(politician);
                    result.children.push(party);
                }
            });
            result.children.sort(function (a, b) { return a.children.length < b.children.length; });
            return result;
        }, this);
        if (chamber != 'senate' && chamber != 'deputies') {
            populateResult('senate', result);
            populateResult('deputies', result);
        } else {
            populateResult(chamber, result);
        }

        if (party) {
            $.each(result.children, function () {
                if (this.name === party) {
                    result = this;
                    return false;
                }
            });
        }

        var runningAgainFilter = function (politician) {
          return politician.runningAgain;
        };

        if (runningAgain && party) {
          result.children = result.children.filter(runningAgainFilter);
        } else if (runningAgain && !party) {
          $.each(result.children, function (idx, party) {
            party.children = party.children.filter(runningAgainFilter);
          });
        }
        return result;
    };

    Politicians.prototype.getList = function (chamber, party, runningAgain) {
      var result = [];
      if (chamber != 'senate' && chamber != 'deputies') {
        return this.getList('senate', party, runningAgain).concat(this.getList('deputies', party, runningAgain));
      }
      $.each(this._data[chamber], function (idx, politician) {
        // just get the leaf nodes
        if (!politician.children) {
          if ((!party || politician.group === party) && (!runningAgain || politician.runningAgain)) {
            result.push(politician);  
          }
        }
      });
      return result;
    };

    var COLORS = { 
        'PD-L' : ['#fa720e', '#040b9a', 'white'],
        'PNL' : ['#fcdb00', '#015972', 'white'],
        'PSD' : ['#ce0013', '#fefefe', 'blue'],
        'UDMR' : ['#067622', '#fe0000', 'white'],
        'Independent' : ['#f0f0f0', 'brown', 'red'],
        'Minoritati' : ['#f0f0f0', 'brown', 'red'],
        'senate' : ['white', 'pink', 'white'],
        'deputies' : ['white', 'pink', 'white'],
        'all' : ['white', 'pink', 'white']
    }

    Politicians.getPrimaryColor = function (obj) {
        return obj.group ? COLORS[obj.group][0] : COLORS[obj.name][1];
    }

    Politicians.getSecondaryColor = function (obj) {
        return obj.group ? COLORS[obj.group][0] : COLORS[obj.name][1];   
    }

    Politicians.getTertiaryColor = function (obj) {
        return obj.group ? COLORS[obj.group][2] : COLORS[obj.name][2];
    }

    Politicians.checkSimilarNames = function (a, b) {
        var checkFirstNames = function (name1, name2) {
            var getLetters = function (name) {
              return name.toLowerCase().split("").sort();
            };
            var shortest = function (a, b, inverted) {
              if (a.length < b.length) {
                if (!!inverted) {
                  return b;
                } else {
                  return a;
                } 
              } else {
                if (!!inverted) {
                  return a;
                } else {
                  return b;
                }
              }
            };

            var letters1 = getLetters(name1)
              , letters2 = getLetters(name2),
              s = shortest(letters1, letters2), l, valid = true;
            while (s.length > 0) {
              if (letters1[0] === letters2[0]) {
                letters1.shift();
                letters2.shift();
              } else {
                if (letters1[0] > letters2[0]) {
                  letters2.shift();
                } else {
                  letters1.shift();
                }
              }
              s = shortest(letters1, letters2);
              l = shortest(letters1, letters2, true);
              if (s.length > 0 && s[0] < l[0]) {
                valid = false;
                break;
              }
            }
            return valid;
        };

        var extractFirstNames = function (name) {
            var parts = name.split(" ");
            return parts.slice(0, parts.length - 1).join(" ");
        }

        var extractLastName = function (name) {
            var parts = name.split(" ");
            return parts[parts.length - 1];
        }
        return extractLastName(a.name) == extractLastName(b.name) && checkFirstNames(extractFirstNames(a.name), extractFirstNames(b.name));
    }

    return Politicians;
});
