(function() {
  var Card, Deck;

  Deck = (function() {
    function Deck(raw) {
      var line, preCards, _i, _len;
      this.raw = raw;
      this.cards = [];
      preCards = this.raw.split('\n');
      for (_i = 0, _len = preCards.length; _i < _len; _i++) {
        line = preCards[_i];
        if (!(line.trim().charAt(0) !== ':')) {
          continue;
        }
        console.log(line.trim().charAt(0) !== ":");
        this.addCard(line);
      }
    }

    Deck.prototype.addCard = function(line) {
      var prospect;
      prospect = line.split(',');
      if (prospect.length === 5) {
        return this.cards.push(new Card(prospect));
      }
    };

    return Deck;

  })();

  Card = (function() {
    function Card(raw) {
      var k, sp, v, _ref, _ref1;
      this.raw = raw;
      sp = {};
      if (typeof this.raw === 'object') {
        _ref = this.raw, sp.personal = _ref[0], sp.objeto = _ref[1], sp.accion = _ref[2], sp.dificil = _ref[3], sp.todos = _ref[4];
      } else {
        _ref1 = this.raw.split(','), sp.personal = _ref1[0], sp.objeto = _ref1[1], sp.accion = _ref1[2], sp.dificil = _ref1[3], sp.todos = _ref1[4];
      }
      for (k in sp) {
        v = sp[k];
        this[k] = this.parseElement(v);
      }
    }

    Card.prototype.parseElement = function(el) {
      el = el.trim();
      if (el[0] === ">") {
        return {
          content: (el.slice(1)).trim(),
          playAll: true
        };
      } else {
        return {
          content: el.trim(),
          playAll: false
        };
      }
    };

    return Card;

  })();

  window.Deck = Deck;

  window.Card = Card;

}).call(this);
