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
		},

		isCached: function () {
			return !!this.data.values;
		},

		refresh: function () {
			var self = this;

			if (!this.config.provider) {
				return;
			}

			this.trigger('refresh:start', this, {widgetChange: true});

			$.ajax({
				url: this.config.provider,
				method: "GET",
				cache: false,
				dataType: "text",
				success: function (data, textStatus, jqHXR) {
					var matches = (data || "").match(matchIPV4);
					if (jqHXR.status != 200 || !_.isArray(matches) || matches.length == 0) {
						self.trigger('refresh:failed', self, {widgetChange: true});
						return;
					}

					self.saveData({
						values: {
							external: matches[0],
							internal: '0.0.0.0',
							next: new Date()
						}
					});

					self.trigger('refresh:finish', self, {widgetChange: true});
				},
				error: function () {
					self.trigger('refresh:failed', self, {widgetChange: true});
				}
			});
		}
	});
});