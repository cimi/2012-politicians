define([], function () {
    var InfoBox = function ($el, $template) {
        this.$el = $el;
        this.template = Handlebars.compile($template.html());
    };

    InfoBox.prototype.show = function (data) {
        var rendered = this.template(data);
        this.$el.html(rendered);
        // TODO: set position
        this.$el.show();

    };
    InfoBox.prototype.hide = function () {
        this.$el.hide();
    };

    // helper function that returns the appropriate Bootstrap
    // class name based on the perceived level
    // i.e.: if below 20% return red (important) because he sucks
    Handlebars.registerHelper('level', function (percentage) {
        if (percentage < 20) return 'important';
        if (percentage < 60) return 'warning';
        if (percentage < 80) return 'info';
        return 'success';
    });

    Handlebars.registerHelper('runningAgain', function () {
        var output = 'Nu';
        if (this.runningAgain) {
            output = this.newGroup + ", colegiul " + this.newCircumscription;
        }
        return output;
    });

    return InfoBox;
});