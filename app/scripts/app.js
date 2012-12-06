define(['jquery', 'politicians', 'pack', 'typeahead'], 
  function($, Politicians, PackChart, typeahead) {
  "use strict"
  // read senate and chamber of deputies data

  // TODO: remove this crap when the data is cleaned up
  function toTitleCase(txt) {
    var parts = txt.split(' ');
    if (parts.length > 1) {
      var result = '';
      parts = parts.map(function (val) {
        return toTitleCase(val);
      });
      return parts.join('-');
    }
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }

  function getLastName(name) {
    var parts = name.split(' ');
    return parts[parts.length - 1];
  }

  return {
  	loadPoliticians : function () {
      var prefix = 'data/'
        , sources = ['senate', 'deputies']
        , politicians = {};
      sources.forEach(function (source) {
        $.ajax({
            url : prefix + source + '.json', 
            success : function (data) {
                politicians[source] = data;
            }, 
            async : false,
            dataType : "json"
        });
      });

      // mark the ones who are running for office again
      $.ajax({
        url : prefix + 'candidates.json',
        success : function (data) {
          $.each(data, function (idx, currentCandidate) {
            sources.forEach(function (source) {
              var matches = politicians[source].filter(function (politician) {
                return Politicians.checkSimilarNames(politician, currentCandidate);
              });
              if (matches.length == 1) {
                var match = matches[0];
                match.runningAgain = true;
                match.newGroup = currentCandidate.party;
                match.newCircumscription = currentCandidate.room 
                    + currentCandidate.college + " " + toTitleCase(currentCandidate.county);
              } else if (matches.length > 1) { 
                // TODO: debug candidates who get more than one match, there are about 9 
                // console.log(matches, currentCandidate);
              } 
            });
          });
        },
        async : false,
        dataType : "json"
      });
      this.politicians = new Politicians(politicians);
      return this.politicians;
    },
    initTypeahead : function (flatData) {
      // create a typeahead search box to hilight
      // certain candidates
      if (!flatData) flatData = this.politicians.getList();
      var labels, mapped, that = this;
      var typeaheadOptions = {
        source : function (query, process) {
          labels = []; mapped = {};
          $.each(flatData, function (idx, politician) {
            if (politician.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              labels.push(politician.name);
              mapped[politician.name] = politician;
            }
          });
          process(labels);
        },
        updater : function (name) {
          var politician = mapped[name];
          that.chart.unhilight();
          that.chart.hilight(politician);
          return name;
        }
      };
      // clear the element and re-add it again
      // couldn't find a way just to update the data for the typeahead in Bootstrap
      $('#typeaheadSearch').remove();
      $('<input id="typeaheadSearch" />').appendTo('#search').typeahead(typeaheadOptions);
    },
    initToolbar : function (data) {
      // create buttons to update the chart
      // and fill with members from only one
      // party
      if (!data) data = this.politicians.getByParty()
      var $chambersBtnGroup = $('#chambersBtnGroup')
        , $runningAgain = $('#runningAgainBtnGroup')
        , politicians = this.politicians, that = this;


      var updatePage = function (e) {
        $(e.target).siblings().removeClass('active');
        $(e.target).addClass('active');
        var list = getData(true)
          , data = getData(false);
        if (!$(e.target).parent('#partyBtnGroup').length) {
          // re-initialize the party buttons when changing the views
          initPartyBtnGroup();
        }
        this.chart.update(data);
        this.initTypeahead(list);
      }

      var getData = function (isList) {
        var selectedChamber = $chambersBtnGroup.find('.active').data('chamber');
        var selectedParty = $('#partyBtnGroup .active').attr('id');
        var runningAgain = $runningAgain.find('.active').data('value');
        if (isList) {
          return politicians.getList(selectedChamber, selectedParty, runningAgain);
        } else {
          return politicians.getByParty(selectedChamber, selectedParty, runningAgain);
        }
      }

      var initPartyBtnGroup = function () {
        var prev = $('#partyBtnGroup .active').attr('id')
          , $btnGroup = $('#partyBtnGroup').empty()
          , data = getData(false);

        $btnGroup.append('<a href="#" class="btn" id="all">Orice partid</a>');
        $.each(data.children, function (idx, party) {
          var $btn = $('<a href="#" class="btn" id="' + party.name + '">' + party.name + ' (' + party.children.length + ')</a>');
          if (prev == party.name) {
            $btn.addClass('active');
          }
          $btnGroup.append($btn);
        });
        if (!$btnGroup.find('.active').length) $btnGroup.find('#all').addClass('active');
        $btnGroup.on('click', 'a', $.proxy(updatePage, that));
      };

      $chambersBtnGroup.on('click', 'a', $.proxy(updatePage, this));
      $runningAgain.on('click', 'a', $.proxy(updatePage, this));

      initPartyBtnGroup(data);
    },
    initChart : function () {
      this.chart = new PackChart(this.politicians.getByParty());
    }
  }
});
