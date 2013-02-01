
describe("zepto-confirmation", function() {
  var confirmation = require("zepto-confirmation"),
      Emitter = require("component-emitter"),
      $ = require("p-baleine-zepto");

  it("should be a function", function() {
    expect(confirmation).to.be.a(Function);
  });

  it("should export Confirmation constructor", function() {
    expect(confirmation.Confirmation).to.be.a(Function);
  });

  it("should return an instance of Confirmation", function() {
    expect(confirmation()).to.be.a(confirmation.Confirmation);
  });

  describe("Confirmation", function() {
    beforeEach(function() {
      this.title = "mytitle";
      this.message = "mymessage";
      this.cb = sinon.spy(function() { console.log("clicked"); });
      this.confirmation = new confirmation.Confirmation(
        this.title, this.message, this.cb
      );
    });

    afterEach(function() {
      $("#confirmation").remove();
      $("#overlay").remove();
    });

    it("should be an instance of Emitter", function() {
      expect(this.confirmation).to.be.a(Emitter);
    });

    it("should attach confirmation element on body", function() {
      expect($("#confirmation")).to.have.length(1);
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
        click(this.confirmation.$el.find(".button.ok"));
        expect(this.cb.called).to.be.ok();
      });

      it("should emit `ok` on click OK button", function() {
        var spy = sinon.spy();
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
      // it("should hide modal", function(done) {
      //   this.confirmation.show();
      //   expect($("#overlay").css("display")).to.equal("block");
      //   this.confirmation.hide();
      //   expect($("#overlay").hasClass("hide")).to.be.ok();
      // });
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
  });
});

function click(el){
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  $(el).get(0).dispatchEvent(event);
}
