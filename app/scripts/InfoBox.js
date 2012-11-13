define([], function () {
    var InfoBox = function ($el, template) {
        this.$el = $el;
        this.template = template;
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
    return InfoBox;
});