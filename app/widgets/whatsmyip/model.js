define(["lodash", "jquery", "widgets/model"], function(_, $, WidgetModel) {
	return WidgetModel.extend({
		defaults: {
			config: {
				title: "Whats My IP",
				link: "",
				number: 5,
				view: "default",
				images: "true",
				desc: "true",
				size: "variable",
				url: "http://feeds.gawker.com/lifehacker/full"
			}
		},

		/**
		 * Initialize
		 */
		initialize: function() {

            console.log('my model');

			if (this.config.view) {
				delete this.config.view;
			}

            this.saveData({
                title: 'Whats My IP',
                address: '129.168.12.32',
                loading: false
            });

			//this.set("activeTab", 0);
			//this.on("change", function(model, options) {
			//}, this);
		}
	});
});