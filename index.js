
/**
 * Module dependencies.
 */

var _ = require("underscore"),
    o = require("zepto-component"),
    inherit = require("inherit"),
    Emitter = require("emitter"),
    overlay = require("zepto-overlay");

exports = module.exports = confirmation;

exports.Confirmation = Confirmation;

function confirmation(title, message, fn) {
  return new Confirmation(title, message, fn);
}

function Confirmation(title, message, fn) {
  Emitter.call(this);
  this.fn = fn;
  this.$el = $(this.template({ title: title, message: message }));
  this.overlay = overlay();
  this.ok("ok");
  this.cancel("cancel");
  _.bindAll(this, "onok", "oncancel");
  this.$el.on("click", ".button.ok", this.onok);
  this.$el.on("click", ".button.cancel", this.oncancel);
  this.$el.appendTo("body");
}

inherit(Confirmation, Emitter);

Confirmation.prototype.show = function() {
  var win = $(window);
  this.overlay.show();
  this.$el.removeClass("hide");
  this.$el.css({
    top: win.height() / 2 - this.$el.height() / 2,
    left: win.width() / 2 - this.$el.width() / 2
  });
  return this;
};

Confirmation.prototype.template = _.template(require("./template"));

Confirmation.prototype.onok = function() {
  this.fn();
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