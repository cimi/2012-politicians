define([], function () {
    var Tooltip = function (el, template) {
        this.el = el;
        this.template = template;
    };

    Tooltip.prototype.show = function (data) {
        this.template.render(data);
        // TODO: set position
        // $(this.el).show();

    };
    Tooltip.prototype.hide = function () {
        // $(this.el).hide();
    };
});