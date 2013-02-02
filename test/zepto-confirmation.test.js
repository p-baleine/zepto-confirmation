
describe("zepto-confirmation", function() {
  var confirm = require("zepto-confirmation"),
      Emitter = require("component-emitter"),
      $ = require("p-baleine-zepto");

  beforeEach(function() {
    this.showSpy = sinon.spy(confirm.Confirmation.prototype, "show");
  });

  afterEach(function() {
    $("#overlay").remove();
    confirm.Confirmation.prototype.show.restore();
  });

  it("should be a function", function() {
    expect(confirm).to.be.a(Function);
  });

  it("should export Confirmation constructor", function() {
    expect(confirm.Confirmation).to.be.a(Function);
  });

  it("should return an instance of Confirmation", function() {
    expect(confirm()).to.be.a(confirm.Confirmation);
  });

  it("should call show on confirmation", function() {
    confirm();
    expect(this.showSpy.called).to.be.ok();
  });

  describe("Confirmation", function() {
    beforeEach(function() {
      this.title = "mytitle";
      this.message = "mymessage";
      this.cb = sinon.spy();
      this.confirmation = new confirm.Confirmation({
        title: this.title,
        message: this.message
      });
    });

    afterEach(function() {
      this.confirmation.$el.remove();
    });

    it("should be an instance of Emitter", function() {
      expect(this.confirmation).to.be.a(Emitter);
    });

    it("should attach confirmation element on body", function() {
      expect(this.confirmation.$el.closest('html')).to.not.empty();
    });

    it("should not display the element on init", function() {
      expect(this.confirmation.$el.css("display")).to.eql("none");
    });

    describe("#show()", function() {
      it("should have `show` method", function() {
        expect(this.confirmation.show).to.be.a(Function);
      });

      it("should make el visible", function() {
        this.confirmation.show();
        expect(this.confirmation.$el.css("display")).to.equal("block");
      });

      it("should have OK button", function() {
        expect(this.confirmation.$el.find(".button.ok")).to.not.be.empty();
      });

      it("should have cancel button", function() {
        expect(this.confirmation.$el.find(".button.cancel")).to.not.be.empty();
      });

      it("should render message", function() {
        expect(this.confirmation.$el.html()).to.contain(this.message);
      });

      it("should fire cb on click OK button", function() {
        this.confirmation.show(this.cb);
        click(this.confirmation.$el.find(".button.ok"));
        expect(this.cb.called).to.be.ok();
      });

      it("should emit `ok` on click OK button", function() {
        var spy = sinon.spy();
        this.confirmation.show();
        this.confirmation.on("ok", spy);
        click(this.confirmation.$el.find(".button.ok"));
        expect(spy.called).to.be.ok();
      });

      it("should hide dialog on click cancel button", function() {
        this.confirmation.show();
        expect(this.confirmation.$el.css("display")).to.equal("block");
        click(this.confirmation.$el.find(".button.cancel"));
        expect(this.confirmation.$el.css("display")).to.equal("none");
      });

      it("should emit `cancel` on click cancel button", function() {
        var spy = sinon.spy();
        this.confirmation.on("cancel", spy);
        click(this.confirmation.$el.find(".button.cancel"));
        expect(spy.called).to.be.ok();
      });

      it("should emit `hide` on hide", function() {
        var spy = sinon.spy();
        this.confirmation.on("hide", spy);
        this.confirmation.hide();
        expect(spy.called).to.be.ok();
      });

      it("should display modal on show", function() {
        this.confirmation.show();
        expect($("#overlay")).to.have.length(1);
        expect($("#overlay").css("display")).to.equal("block");
      });
    });

    describe("#hide()", function() {
      it("should hide modal", function() {
        this.confirmation.show();
        expect($("#overlay").css("display")).to.equal("block");
        this.confirmation.hide();
        expect($("#overlay").hasClass("hide")).to.be.ok();
      });
    });

    describe("#ok()", function() {
      it("should have `ok` method", function() {
        expect(this.confirmation.ok).to.be.a(Function);
      });

      it("should render ok button text with supplied text", function() {
        this.confirmation.ok("オーケー");
        expect(this.confirmation.$el.find(".button.ok").text()).to.contain("オーケー");
      });
    });

    describe("#cancel()", function() {
      it("should have `cancel` method", function() {
        expect(this.confirmation.cancel).to.be.a(Function);
      });

      it("should render cancel button text with supplied text", function() {
        this.confirmation.cancel("no");
        expect(this.confirmation.$el.find(".button.cancel").text()).to.contain("no");
      });
    });

    describe("singleton", function() {
      it("should display ony one dialog", function() {
        var first = (new confirm.Confirmation()).show(),
            second = (new confirm.Confirmation()).show();
        expect(first.$el.hasClass("hide")).to.be.ok();
        second.hide();
      });
    });
  });
});

function click(el){
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  $(el).get(0).dispatchEvent(event);
}
