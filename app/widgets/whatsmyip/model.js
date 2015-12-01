define(["lodash", "jquery", "widgets/model"], function (_, $, WidgetModel) {

    var matchIPV4 = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/gi;

    return WidgetModel.extend({

        defaults: {
            config: {
                size: "variable",
                provider: "http://checkip.dyndns.org/",
                title: "Whats My IP"
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            /*
             if (this.config.view) {
             delete this.config.view;
             }
             */
            this.saveData({
                title: this.config.title || this.defaults.config.title,
                address: '###.###.###.###',
                loading: false,
                error: false
            });

            WidgetModel.prototype.initialize.call(this);
        },

        refresh: function () {
            var self = this;

            this.data.loading = true;
            this.saveData();

            $.ajax({
                url: this.config.provider,
                method: "GET",
                cache: false,
                dataType: "text",
                success: function (data, textStatus, jqHXR) {
                    if (jqHXR.status != 200) {
                        self.failIP();
                    }
                    var matches = data.match(matchIPV4);
                    if (!_.isArray(matches) || matches.length == 0) {
                        self.failIP();
                    }
                    self.data.address = _.first(matches);
                    self.saveData();
                    console.log(matches);
                },
                error: function () {
                    self.failIP();
                },
                complete: function () {
                    self.data.loading = true;
                    self.saveData();
                }
            });
        },

        failIP: function () {

        }
    });
});