Attendance for Romanian Members of Parliament (2008-2012)
=======================

## Overview

This is an interactive graph of the Romanian members of parliament for the 2008-2012 mandate. It uses data pulled from [Harta Politicii](http://hartapoliticii.ro/), which has their attendance percentage, the percentage in which they voted against their party and if they're running for another term.

#### See a demo [here](http://improve.ro/sandbox/politicians/).

It was done as an excercise for learning [d3.js](http://d3js.org/) and currently uses [Circle Packing](http://bl.ocks.org/4063530) as the representation model for politicians. The bigger a politician's circle is, the more he went to work. :)

The JavaScript is organized with [require.js](http://requirejs.org/), jQuery is also used accross the board. The box with politician information is rendered with a [handlebars](http://handlebarsjs.com/) template.

[Bootstrap](http://twitter.github.com/bootstrap/) was used for styling; the [typeahead](http://twitter.github.com/bootstrap/javascript.html#typeahead) is also used from the bootstrap toolkit.

The project was generated with [Yeoman](http://yeoman.io/) and has no server-side component. The data is stored statically as JSON files - it can be deployed anywhere.

## Installing on your machine

If you don't already have yeoman installed, do it:

````
$ curl -L get.yeoman.io | bash
````

It will check all of its dependencies and give you step by step instructions to get it working. Now do the following:

````
$ git clone git://github.com/cimi/infographic-politicians.git
$ cd infographic-politicians
$ yeoman install d3
$ yeoman install handlebars
$ yeoman server
````

This should open a web server on port 3501 with the project. You'll be able to see changes you make to the files without a page reload.


## How the data was obtained

The data for the 2008-2012 term was extracted by scraping this [senate list](http://hartapoliticii.ro/?c=senat+2009&cid=12&sid=1) and this [chamber of deputies list](http://hartapoliticii.ro/?c=camera+deputatilor+2009&cid=11&sid=1). It was parsed using node.js - [code here](https://github.com/cimi/infographic-politicians/blob/master/get-data.js). To update the data, just run the script again. If the page structure of the source changes, the script will need to be updated.

The data for the 2012 candidates was pulled from [here](https://github.com/pistruiatul/hartapoliticii/blob/master/www/hp-scripts/candidates_2012_bec.json) and was processed using [this code](https://github.com/cimi/infographic-politicians/blob/master/process-new-candidates.js), to make it more compatible with the current one.

The matching between new candidates and current members of parliament is not entirely accurate. It's done by name and their names do not entirely match - e.g. _Victor Ponta_ vs _Victor-Viorel Ponta_. A naive algorithm is used to extract the first names (everything before the 1st space) and check that all the letters from the one are present in the other. The code is in the _checkSimilarNames_ method of the [Politicians module](https://github.com/cimi/infographic-politicians/blob/master/app/scripts/politicians.js#L99).

## TODO:
* add tests!
* improve the accuracy of the new candidates script
* consider refactoring using CoffeeScript and classes
* find a better color palette for the representation
* highlight current running candidates that have switched parties
* when the elections are done, do a stat of the ones who were re-elected
* add a loader for when the JSON is retrieved (it's more than 60% of the total size of the page)
* interpret the data - i.e. politicians with lower attendance tend to run again more than ones with high attendance
