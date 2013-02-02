
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    o = require("zepto-component"),
    inherit = require("inherit"),
    Emitter = require("emitter"),
    overlay = require("zepto-overlay");

/**
 * Export `confirm`.
 */

exports = module.exports = confirm;

/**
 * Export `Confirmation`.
 */

confirm.Confirmation = Confirmation;

/**
 * Export `defaults`
 */

confirm.defaults = {
  ok: "ok",
  cancel: "cancel"
};

/**
 * Return a new `Confirmation` with the given 
 * (optional) `title` and `msg`. Either combination
 * may pass a callback.
 *
 * @param {String} title or msg
 * @param {Function} msg or callback
 * @param {Function} callback
 * @return {Confirmation}
 * @api public
 */

function confirm(title, message, callback) {
  if ('string' === typeof message) {
    return new Confirmation({ title: title, message: message })
      .show(callback);
  } else {
    return new Confirmation({ message: title })
      .show(message);
  }
}

/**
 * Active dialog.
 */

var active;

/**
 * Initialize a new `Confirmation`.
 * 
 * Options:
 * 
 *   - `title` dialog title
 *   - `message` a message to display
 * 
 * @param {Object} options
 * @api public
 */

function Confirmation(options) {
  options = _.extend({ title: "", message: "" }, options);
  Emitter.call(this);
  this.$el = $(this.template(options));
  this.overlay = overlay();
  this.ok(confirm.defaults.ok);
  this.cancel(confirm.defaults.cancel);
  _.bindAll(this, "onok", "oncancel");
  this.$el.on("click", ".button.ok", this.onok);
  this.$el.on("click", ".button.cancel", this.oncancel);
  this.$el.appendTo("body");
  if (active && !active.hiding) { active.hide(); }
  active = this;
}

/**
 * Inherit from `Emitter.prototype`.
 */

inherit(Confirmation, Emitter);

/**
 * Compiled template function
 * 
 * @see http://underscorejs.org/#template
 */

Confirmation.prototype.template = _.template(require("./template"));

/**
 * Handle ok click.
 * 
 * Emits "ok".
 * 
 * @param {Event} e
 * @api private
 */

Confirmation.prototype.onok = function(e) {
  e.preventDefault();
  this.callback();
  this.emit("ok");
};

/**
 * Handle cancel click.
 * 
 * Emits "cancel".
 * 
 * @param {Event} e
 * @api private
 */

Confirmation.prototype.oncancel = function(e) {
  e.preventDefault();
  this.hide();
  this.emit("cancel");
};

/**
 * Hide the dialog.
 * 
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.hide = function() {
  this.$el.addClass("hide");
  this.overlay.hide();
  this.$el.remove();
  this.emit("hide");
  this.hiding = true;
  return this;
};

/**
 * Query element from `this.$el` context.
 * 
 * @param {String} selector
 * @return {ZeptoObject}
 * @api private
 */

Confirmation.prototype.$ = function(selector) {
  return $(selector, this.$el);
};

/**
 * Change "ok" button `text`.
 * @param {String} text
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.ok = function(text) {
  this.$(".button.ok").text(text);
  return this;
};

/**
 * Change "cancel" button `text`.
 * @param {String} text
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.cancel = function(text) {
  this.$(".button.cancel").text(text);
  return this;
};

/**
 * Show the notification and invoke `fn()`
 * 
 * @param {Function} fn
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.show = function(fn) {
  this.callback = fn || function() {};
  this.overlay.show();
  this.$el.removeClass("hide");
  this.$el.css(this.offset());
  this.$(".button.ok").focus();
  return this;
};

/**
 * Calculate middle position offset.
 * 
 * @return {Object} top and left
 * @api private
 */

Confirmation.prototype.offset = function() {
  var win = $(window);
  return {
    top: win.height() / 2 - this.$el.height() / 2,
    left: win.width() / 2 - this.$el.width() / 2
  };
};
