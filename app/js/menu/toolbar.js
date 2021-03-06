/**
 * This generates the toolbar and its submodules
 */
define(
	["lodash", "jquery", "backbone", "browser/api", "core/analytics", "storage/storage", "storage/syncapi", "storage/defaults", "search/search", "menu/menu", "core/announcements", "core/render"],
	function(_, $, Backbone, Browser, Track, Storage, SyncAPI, Defaults, Search, Menu, Announcements, render) {
		var Model = Backbone.Model.extend({
				init: function() {
					Storage.on("done updated", function(storage) {
						var set = _.clone(storage.settings);

						var d = SyncAPI.getInfo();

						set.name = d.user.fname || Defaults.user.fname;

						set.profileimage = d.user.image ? d.user.image + "?sz=72" : Defaults.user.image;

						Announcements.off("countchange", null, this).on("countchange", function(count) {
							this.set("announcements", count);
						}, this);

						set.announcements = Announcements.count;

						this.set(set);
					}, this);
				}
			}),
			View = Backbone.View.extend({
				tagName: "header",
				className: "toolbar",

				events: {
					"click .apps-toggle": "toggleApps",
					"click .menu-toggle": Menu.toggle.bind(Menu),

					"click .announcements": function(e) {
						Announcements.show();
					},
					"click .apps a.icon": function(e) {
						e.preventDefault();
					},
					"click a.custom-link": function(e) {
						var href = e.currentTarget.getAttribute("href");

						if (href.indexOf("chrome") === 0) { // chrome:// links can't be opened directly for security reasons, this bypasses that feature.
							e.preventDefault();

							Browser.tabs.getCurrent(function(d) {
								if (e.which == 2 || $("base").attr("target") == "_blank") {
									Browser.tabs.create({
										url: href,
										index: d.index + 1
									});
								}
								else {
									Browser.tabs.update(d.id, {
										url: href
									});
								}
							});

							Track.event("Toolbar", "Link Click", "Chrome");
						}
						else {
							Track.event("Toolbar", "Link Click");
						}
					}
				},


				/**
				 * Shows and hides the apps panel
				 *
				 * @api    private
				 * @param  {Event} e The event
				 */
				toggleApps: function(e) {
					var elm = $(e.currentTarget);

					if (!elm.hasClass("active")) {
						if (!this.appsLoaded) {
							elm.find("img[data-src]").each(function(e, i) {
								this.setAttribute("src", this.getAttribute("data-src"));

								this.removeAttribute("data-src");
							});

							this.appsLoaded = true;
						}

						var elms = elm.find("*").add(elm);

						$(document.body).on("click.apps", function(e) {
							if (!elms.is(e.target)) {
								elm.removeClass("active");

								$(document.body).off("click.apps");
							}
						});

						elm.addClass("active");

						Track.event("Toolbar", "Apps Menu", "Open");
					}
					else {
						$(document.body).off("click.apps");

						elm.removeClass("active");

						Track.event("Toolbar", "Apps Menu", "Close");
					}
				},


				initialize: function() {
					this.model = new Model();

					this.Menu = Menu;

					this.Search = new Search();

					// init() needs to be called after the listener is attached to prevent a race condition when storage is already loaded.
					// It also needs to be here instead of attached directly to new Model() otherwise this.model might not be set yet.
					this.model.on("change", this.render, this).init();
				},


				render: function() {
					var toolbar = this.model.get("toolbar") == "full" || this.model.get("toolbar") === true;

					if (toolbar) {
						this.Menu.$el.detach();
					}

					// The app icons attributes get reset on render
					this.appsLoaded = false;

					this.Search.$el.detach();

					this.$el.html(render("toolbar", this.model.toJSON()));

					this.$(".search").replaceWith(this.Search.el);

					if (toolbar) {
						this.$("nav.menu").replaceWith(this.Menu.el);

						this.Menu.delegateEvents();
					}

					return this;
				}
			});

		return View;
	}
);
