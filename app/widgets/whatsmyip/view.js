define(["lodash", "widgets/views/main"], function(_, WidgetView) {
	return WidgetView.extend({
		events: {
		},

        onBeforeRender: function(data, demo) {
            //data.title = 'Hello World';
            return data;
        }

        /*
                initialize: function() {
                    console.log('my view');
                    console.log(this);
                    this.listenTo(this.model, "change", this.render);
                    this.render();
                },


                onBeforeRender: function(data, demo) {
                    //data.title = 'Hello World';
                    return data;
                },

                onRender: function(data) {
                    return WidgetView.prototype.render.call(this, data || this.model.data, partials);
                }
        */
	});
});