define(["lodash", "jquery", "widgets/model"], function (_, $, WidgetModel) {

    var matchIPV4 = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/gi;

    return WidgetModel.extend({

        /**
         * Once per hour.
         */
        refreshInterval: 3600000,

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
                title: this.config.title || this.defaults.config.title
            });

			if(!this.data.external) {
				this.data.external = '0.0.0.0';
				this.data.internal = '0.0.0.0';
			}
        },

		// @todo - this should be done as a service encase there are multiple widgets
        refresh: function () {
            var self = this;

            if(!this.config.provider) {
                return;
            }

            this.trigger('refresh:start', this, { widgetChange: true });

            $.ajax({
                url: this.config.provider,
                method: "GET",
                cache: false,
                dataType: "text",
                success: function (data, textStatus, jqHXR) {
                    var matches = (data || "").match(matchIPV4);
                    if (jqHXR.status != 200 || !_.isArray(matches) || matches.length == 0) {
                        self.trigger('refresh:failed', self, { widgetChange: true });
                        return;
                    }

                    self.data.external = matches[0];
                    self.saveData();

                    console.log(matches);

                    self.trigger('refresh:finish', self, { widgetChange: true });
                },
                error: function () {
                    self.trigger('refresh:failed', self, { widgetChange: true });
                }
            });
        }
    });
});