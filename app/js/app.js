/**
 * Configure requireJS.
 */
require.config({
	baseUrl: "js",
	paths: {
		"w": "../widgets",

		// bower dependencies
		"text": "bower/text/text",
		"json": "bower/requirejs-plugins/src/json",
		"hogan": "bower/hogan.js/web/builds/3.0.2/hogan-3.0.2.min",
		"lodash": "bower/lodash/lodash.min",
		"moment": "bower/moment/min/moment.min",
		"jquery": "bower/jquery/dist/jquery.min",
		"backbone": "bower/backbone/backbone-min",
		"jquery.serializejson": "bower/jquery.serializeJSON/jquery.serializejson.min",

		"oauth": "lib/oauth",
		"oauth2": "../oauth2/oauth2",
		"widgetTemplate": "widgets/registry/template",
		"backbone.viewcollection": "lib/backbone.viewcollection"
	},
	map: {
		"*": {
			"underscore": "lodash" // a Lodash Underscore build is not required for Backbone
		}
	},
	shim: {
		"lib/jquery.sortable": ["jquery"]
	}
});


// Make require synchronous. We do this to avoid delays with the two-tiered
// widget system (load the manifest, then the actual code). Without it calls to
// require wait at least 4ms before resolving, even if the module has been
// registered (but not initialized). The difference is difficult to measure but
// this saves approximately 200ms until the first full widget paint.
require.s.contexts._.nextTick = function(fn) {
	return fn();
};


/**
 * Init.  This requires storage to start loading as early as possible.
 */
require(["core/render", "storage/storage", "modals/getting-started", "core/init"], function(render, storage, guide, app) {
	window.App = app;
});