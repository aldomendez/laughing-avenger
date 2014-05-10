(function() {
  var Err, Material, Plasma, Process, ProgressBar, Step, User, app, plasma, step;

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
      this.actualStep = 0;
      this.steps = ['Seleccion', 'Materiales', 'Horneado', 'Descarga'];
      this.states = [['active', '', '', ''], ['', 'active', '', ''], ['', '', 'active', ''], ['', '', '', 'active']];

      /*
          [
            ['active','disabled','disabled','disabled']
            ['disabled','active','disabled','disabled']
            ['disabled','disabled','active','disabled']
            ['disabled','disabled','disabled','active']
          ]
       */
      this.elements = {
        table: false,
        startButton: false,
        progressBar: false,
        processSelector: true,
        elementsForm: false
      };
      this.elementsVisivility = [
        {
          table: false,
          startButton: false,
          progressBar: false,
          processSelector: true,
          elementsForm: false
        }, {
          table: true,
          startButton: true,
          progressBar: false,
          processSelector: false,
          elementsForm: true
        }, {
          table: true,
          startButton: false,
          progressBar: true,
          processSelector: false,
          elementsForm: false
        }, {
          table: true,
          startButton: false,
          progressBar: false,
          processSelector: false,
          elementsForm: false
        }
      ];
    }

    Step.prototype.next = function() {
      console.log("next " + this.actualStep);
      if (this.actualStep <= 0 && this.actualStep < 4) {
        console.log("next if " + this.actualStep);
        app.set('process.actualStep', this.actualStep + 1);
        return app.set('process.elements', this.elementsVisivility[this.actualStep]);
      }
    };

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

  plasma.list.push(new Material('Glass', 'up', 'T135461', '200'));

  app = new Ractive({
    el: 'main',
    template: '#template',
    data: {
      process: step,
      plasma: plasma,
      materialEnHorno: [],
      ingresarMateriales: [
        {
          type: 'Glass',
          qty: 10,
          lote: 'P545465',
          lado: ''
        }, {
          type: 'ALPS',
          qty: 10,
          lote: 20,
          lado: ''
        }
      ]
    }
  });

  app.on({
    'test': function(event) {
      return console.log(event);
    },
    'selectProgram_1': function() {
      app.set({
        'plasma.program': 1
      });
      return step.next();
    },
    'selectProgram_3': function() {
      app.set({
        'plasma.program': 3
      });
      return step.next();
    },
    'selectProgram_5': function() {
      app.set({
        'plasma.program': 5
      });
      return step.next();
    },
    'startPlasma': function(event) {
      if (event.context.plasma.list.length > 0) {
        return step.next();
      }
    },
    'addMaterialToList': function(event) {
      var m;
      m = event.context;
      return plasma.list.push(new Material(m.type, m.lado, m.lote, m.qty));
    }
  });

  window.step = step;

  window.app = app;

  window.Material = Material;

}).call(this);
