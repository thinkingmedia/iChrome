define(["lodash", "jquery", "widgets/views/main"], function (_, $, WidgetView) {

	var viewId = 0;

	return WidgetView.extend({
		events: {},

		initialize: function () {
			WidgetView.prototype.initialize.call(this);

			this.viewId = viewId++;

			$(window).on('resize.whatsmyip' + this.viewId, this.onRender.bind(this));

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
		},

		onRender: function() {
			var w = this.$el.width() / 125;

			this.$('.whatsmyip').css({
				'font-size': w +'em'
			});

			console.log(w);
		},

		onBeforeDestroy: function () {
			$(window).off('resize.whatsmyip' + this.viewId);
		}
	});
});