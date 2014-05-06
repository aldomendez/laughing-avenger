(function() {
  var Material, Plasma, Process, ProgressBar, Step, User, r;

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
    function Plasma() {}

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
      this.steps = ['Proceso', 'Materiales', 'Horneado', 'Descarga'];
      this.actualStep = 0;
    }

    Step.prototype.goto = function(stepId) {};

    return Step;

  })();

  ProgressBar = (function() {
    function ProgressBar() {}

    return ProgressBar;

  })();

  r = new Ractive({
    el: 'main',
    template: '#template',
    data: {
      processSelection: false,
      Plasma: [],
      materialEnHorno: [
        {
          status: 'hola',
          element: 'otro element'
        }, {
          status: 'hola',
          element: 'otro element'
        }, {
          status: 'hola',
          element: 'otro element'
        }
      ],
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

  r.on('selectProcess', function(event) {
    return console.log(event);
  });

}).call(this);
