infographic-politicians
=======================

This is an interactive graph of the Romanian members of parliament for the 2008-2012 mandate. It uses data pulled from [Harta Politicii](http://hartapoliticii.ro/), which has their attendance percentage, the percentage in which they voted against their party and if they're running for another term.

#### See a demo [here](http://improve.ro/sandbox/politicians/).

It was done as an excercise for learning [d3.js](http://d3js.org/) and currently uses [Circle Packing](http://bl.ocks.org/4063530) as the representation model for politicians. The bigger a politician's circle is, the more he went to work. :)

The JavaScript is organized with [require.js](http://requirejs.org/), jQuery is also used accross the board. The box with politician information is rendered with a [handlebars](http://handlebarsjs.com/) template.

[Bootstrap](http://twitter.github.com/bootstrap/) was used for styling; the [typeahead](http://twitter.github.com/bootstrap/javascript.html#typeahead) is also used from the bootstrap toolkit.

The project was generated with [Yeoman](http://yeoman.io/) and has no server-side component. The data is stored statically as JSON files - it can be deployed anywhere.

TODO: 
* add installation steps for people who want to build from it
* add tests, at least for the model code (politicians.js)
* consider refactoring using CoffeeScript and classes
* find a better color palette for the representation
* highlight current running candidates that have switched parties
* when the elections are done, do a stat of the ones who were re-elected
* add a loader for when the JSON is retrieved (it's more than 60% of the total size of the page)
* interpret the data - i.e. politicians with lower attendance tend to run again more than ones with high attendance