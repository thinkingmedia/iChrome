define(["lodash", "widgets/views/main"], function (_, WidgetView) {
    return WidgetView.extend({
        events: {},

        initialize: function () {
            WidgetView.prototype.initialize.call(this);

            this.listenTo(this.model, "refresh:start", function () {
                this.render(_.extend({state: 'loading'}, this.model.data));
            });
            this.listenTo(this.model, "refresh:finish", function () {
                this.render();
            });
            this.listenTo(this.model, "refresh:failed", function () {
                this.render(_.extend({state: 'error'}, this.model.data));
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