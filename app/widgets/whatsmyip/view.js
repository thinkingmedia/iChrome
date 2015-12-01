define(["lodash", "widgets/views/main"], function (_, WidgetView) {
    return WidgetView.extend({
        events: {},

        initialize: function () {
            WidgetView.prototype.initialize.call(this);

            this.listenTo(this.model, "refresh:failed", function () {
                this.render({state: 'error'});
            });
        },

        onBeforeRender: function (data, demo) {
            if (demo) {
                data.address = '192.168.1.1'
            }
            return data;
        }
    });
});