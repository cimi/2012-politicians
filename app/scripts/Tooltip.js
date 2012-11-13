define([], function () {
    var Tooltip = function (template) {
        this.template = template;
    };

    Tooltip.prototype.show = function (data) {
        var rendered = this.template(data);
        $(rendered).appendTo('body');
        // TODO: set position
        // $(this.el).show();

    };
    Tooltip.prototype.hide = function () {
        // $(this.el).hide();
    };
    return Tooltip;
});