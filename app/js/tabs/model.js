/**
 * The tab model, this creates columns
 */
define(["lodash", "backbone", "backbone.viewcollection", "widgets/registry"], function(_, Backbone, ViewCollection, Registry) {
	var WidgetCollection = ViewCollection.extend({
		view: function(options) {
			if (options && options.model) {
				return Registry.createInstance(options.model);
			}
		},
		model: Backbone.Model.extend({
			idAttribute: "cid",

			validate: function(attrs) {
				return !attrs.id || !Registry.get(attrs.id);
			}
		})
	});

	var Tab = Backbone.Model.extend({
		columns: [],

		initialize: function() {
			var that = this;

			this.columnCollection = WidgetCollection.extend({
				initialize: function() {
					this.on("all", that.onColumnEvent, that);
				}
			});


			this.columns = _.map(this.get("columns"), function(e) {
				return new this.columnCollection(e, {
					validate: true
				});
			}, this);

			this.on("columns:change", this.serializeColumns, this);

			this.on("change:columns", this.updateColumns, this);
		},


		/**
		 * Bubbles column events
		 */
		onColumnEvent: function(event) {
			var args = [].slice.call(arguments);

			// Colons actually have no significance in Backbone events, they're
			// just a style. So, we can namespace all bubbled events.
			args[0] = "columns:" + event;

			this.trigger.apply(this, args);
		},


		/**
		 * Serializes the columns collections to JSON, updating the columns attribute
		 *
		 * @param  {Boolean}  [silent]  If the update should be silent
		 */
		serializeColumns: function(silent) {
			this.set("columns", _.invoke(this.columns, "toJSON"), {
				silent: silent === true
			});
		},


		/**
		 * Updates the nested column collections when the column data changes.
		 *
		 * Since there's no way to identify a unique widget, we need to reset
		 * the collections every time a column changes.
		 */
		updateColumns: function() {
			// We use this to destroy any remaining columns in the event of a
			// change in the number of columns
			var tempColumns = this.columns.slice();


			this.columns = _.map(this.get("columns"), function(e) {
				// Get the old column and data, shifting so we can easily
				// destroy remaining columns later
				var column = tempColumns.shift();

				// Although we have to reset if the data's changed, we can
				// still reuse old columns
				if (column) {
					if (JSON.stringify(column.toJSON()) !== JSON.stringify(e)) {
						column.reset(e);
					}

					return column;
				}

				return new this.columnCollection(e, {
					validate: true
				});
			}, this);


			// Destroy any remaining columns. Since collections don't have a destroy
			// method, we're actually just emptying them, destroying nested
			// widget instances and allowing them to be GC'd
			_.each(tempColumns, function(e) {
				e.off("all", this.onColumnEvent, this);

				e.reset();
			});
		}
	});

	return Tab;
});