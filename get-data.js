var request = require('request')
  , cheerio = require('cheerio')
  , fs = require('fs')
  , outfilePrefix = 'app/'
  , sources = [ 'http://hartapoliticii.ro/?c=camera+deputatilor+2009&cid=11&sid=1',
  		'http://hartapoliticii.ro/?c=senat+2009&cid=12&sid=1'
  	];


sources.forEach(function (source) {
	request({ uri : source }, function (error, response, body) {
		var $ = cheerio.load(body)
		  , $table;

		var title = $('title').text().indexOf("Senat") !== -1 ? 'senate' : 'deputies';
		$('table').each(function (idx, table) {
			// cheerio doesn't support selecting immediate
			// descendants, neither by '>' or by '.children()'
			// https://github.com/MatthewMueller/cheerio/issues/17
			// a workaround is to check for nested tables and skip

			// it actually seems that cheerio is crap
			// each -> return false doesn't work
			// find also matches the current element

			// hardcoding the index, TODO: report the bugs
			if (idx === 3) {
				$table = $(table);
				return false;
			}
		});

		if (!$table) {
			throw new Error("The list of politicians could not be found.");
		}

		var everybody = [];
		$table.find('tr').each(function (idx, row) {
			var entry = {};
			$(row).find('td').each(function (idx, cell) {
				switch (idx) {
					case 0:
						return true;
					case 1:
						entry.name = $(cell).find('a').text();
						break;
					case 2:
						entry.circumscription = $(cell).text();
					case 3:
						entry.group = $(cell).find('span a').text();
						break;
					case 4:
						entry.attendance = $(cell).text().split('%')[0].trim();
						break;
					case 5:
						entry.rebel = $(cell).text().slice(0, -1);
						break;
					default:
						return true;
				}
			});
			everybody.push(entry);
		});
		fs.writeFile(outfilePrefix + title + ".json", JSON.stringify(everybody), function (err) {});
	});	
});