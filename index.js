
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    o = require("zepto-component"),
    inherit = require("inherit"),
    Emitter = require("emitter"),
    overlay = require("zepto-overlay");

exports = module.exports = confirm;

confirm.Confirmation = Confirmation;

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

function Confirmation(options) {
  options = _.extend({ title: "", message: "" }, options);
  Emitter.call(this);
  this.$el = $(this.template(options));
  this.overlay = overlay();
  this.ok("ok");
  this.cancel("cancel");
  _.bindAll(this, "onok", "oncancel");
  this.$el.on("click", ".button.ok", this.onok);
  this.$el.on("click", ".button.cancel", this.oncancel);
  this.$el.appendTo("body");
}

inherit(Confirmation, Emitter);

Confirmation.prototype.show = function(callback) {
  this.callback = callback || function() {};
  this.overlay.show();
  this.$el.removeClass("hide");
  this.$el.css(this.offset());
  return this;
};

Confirmation.prototype.offset = function() {
  var win = $(window);
  return {
    top: win.height() / 2 - this.$el.height() / 2,
    left: win.width() / 2 - this.$el.width() / 2
  };
};

Confirmation.prototype.template = _.template(require("./template"));

Confirmation.prototype.onok = function() {
  this.callback();
  this.emit("ok");
};

Confirmation.prototype.oncancel = function() {
  this.hide();
  this.emit("cancel");
};

Confirmation.prototype.hide = function() {
  this.$el.addClass("hide");
  this.overlay.hide();
  this.emit("hide");
  return this;
};

Confirmation.prototype.$ = function(selector) {
  return $(selector, this.$el);
};

Confirmation.prototype.ok = function(text) {
  this.$(".button.ok").text(text);
  return this;
};

Confirmation.prototype.cancel = function(text) {
  this.$(".button.cancel").text(text);
  return this;
};