define(['jquery'], function ($) {
	var Politicians = function (rawData) {
        this._data = rawData;
    }

    Politicians.prototype.getSenateByParty = function () {
        var result = { 'name' : 'senate', 'children' : []};
        $.each(this._data.senate, function (idx, senator) {
            var present = false;
            $.each(result.children, function (idx, party) {
                if (party.name === senator.group) {
                    party.children.push(senator);
                    present = true;
                }
            });
            if (!present) {
                var party = { name : senator.group, children : []};
                party.children.push(senator);
                result.children.push(party);
            }
        });
        return result;
    }

    var COLORS = { 
        'PD-L' : ['#fa720e', '#040b9a', 'white'],
        'PNL' : ['#fcdb00', '#015972', 'white'],
        'PSD' : ['#ce0013', '#fefefe', 'blue'],
        'UDMR' : ['#067622', '#fe0000', 'white'],
        'Independent' : ['#fefefe', 'brown', 'red'],
        'senate' : ['white', 'pink', 'white']
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

    return Politicians;
});