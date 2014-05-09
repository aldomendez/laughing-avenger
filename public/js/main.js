(function() {
  var Err, Material, Plasma, Process, ProgressBar, Step, User, plasma, r, step;

  Material = (function() {
    function Material(type, side, lot, qty) {
      this.type = type;
      this.side = side;
      this.lot = lot;
      this.qty = qty;
    }

    return Material;

  })();

  Plasma = (function() {
    function Plasma() {
      this.list = [];
    }

    return Plasma;

  })();

  Process = (function() {
    function Process() {}

    return Process;

  })();

  User = (function() {
    function User() {}

    return User;

  })();

  Step = (function() {
    function Step() {
      var elements;
      this.steps = ['Seleccion', 'Materiales', 'Horneado', 'Descarga'];
      this.actualStep = 1;
      this.states = [['active', 'disabled', 'disabled', 'disabled'], ['', 'active', 'disabled', 'disabled'], ['disabled', 'disabled', 'active', 'disabled'], ['', 'disabled', 'disabled', 'active']];
      elements = {};
    }

    Step.prototype.next = function() {};

    Step.prototype.restart = function() {};

    Step.prototype.goto = function(stepId) {};

    return Step;

  })();

  ProgressBar = (function() {
    function ProgressBar() {}

    return ProgressBar;

  })();

  Err = (function() {
    function Err() {}

    return Err;

  })();

  step = new Step;

  plasma = new Plasma;

  plasma.list.push(new Material('Glass', 'up', 'T135461', '200'));

  r = new Ractive({
    el: 'main',
    template: '#template',
    data: {
      process: step,
      plasma: plasma,
      materialEnHorno: [],
      ingresarMateriales: [
        {
          type: 'PLC',
          qty: 10,
          lote: 'P545465',
          lado: 'arriba'
        }, {
          type: 'ALPS',
          qty: 10,
          lote: 20,
          lado: 'arriba'
        }
      ]
    }
  });

  plasma.list.push(new Material('Glass', 'up', 'T135461', '200'));

  plasma.list.push(new Material('Glass', 'up', 'T135461', '200'));

  plasma.list.push(new Material('Glass', 'up', 'T135461', '200'));

  window.r = r;

  r.on('test', function(event) {
    return console.log(event);
  });

}).call(this);
