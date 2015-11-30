define(["lodash", "jquery", "widgets/model"], function(_, $, WidgetModel) {
	return WidgetModel.extend({
		defaults: {
			config: {
				title: "Lifehacker",
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

            this.set('title','Amazing');
			//this.set("activeTab", 0);
			//this.on("change", function(model, options) {
			//}, this);
		}
	});
});