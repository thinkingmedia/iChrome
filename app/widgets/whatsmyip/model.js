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
            WidgetModel.prototype.initialize.call(this);

            this.saveData({
                title: this.config.title || this.defaults.config.title,
                address: '###.###.###.###'
            });
        },

        refresh: function () {
            var self = this;

            console.log('refreshing');

            if(!this.config.provider) {
                return;
            }

            this.set('loading', true);
            this.set('error', false);

            $.ajax({
                url: this.config.provider,
                method: "GET",
                cache: false,
                dataType: "text",
                success: function (data, textStatus, jqHXR) {
                    var matches = (data || "").match(matchIPV4);
                    if (jqHXR.status != 200 || !_.isArray(matches) || matches.length == 0) {
                        self.set('error', true);
                        return;
                    }

                    self.data.address = _.first(matches);
                    //self.saveData();

                    console.log(matches);
                },
                error: function () {
                    self.set('error', true);
                },
                complete: function () {
                    self.set('loading', false);
                }
            });
        }
    });
});