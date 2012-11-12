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

    return Politicians;
});