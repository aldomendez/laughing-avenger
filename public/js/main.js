(function() {
  var Err, Material, Materiales, Plasma, ProgressBar, Step, User, app, materialList, plasma, progress, setMaterialListByProgramId, step,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
      this.get();
    }

    Plasma.prototype.get = function() {
      var plasma;
      return plasma = $.getJSON('plasma.php').done(function(data) {
        return console.log(data);
      }).fail(function(error) {
        return console.log(error.statusText);
      });
    };

    Plasma.prototype.set = function() {};

    return Plasma;

  })();

  Materiales = (function() {
    function Materiales() {
      this.materiales = {
        '1': [
          {
            type: 'Glass Rail',
            qty: '',
            lote: '',
            lado: ''
          }, {
            type: 'ALPS',
            qty: '',
            lote: '',
            lado: ''
          }, {
            type: 'PLC/ PMQPSK/ ICRX2',
            qty: '',
            lote: '',
            lado: 'abajo'
          }, {
            type: 'Shim (Abajo)',
            qty: '',
            lote: '',
            lado: 'abajo'
          }
        ],
        '3': [
          {
            type: 'Shim (Arriba)',
            qty: '',
            lote: '',
            lado: 'arriba'
          }
        ],
        '5': [
          {
            type: 'PLC (Abajo)',
            qty: '',
            lote: '',
            lado: 'abajo'
          }
        ]
      };
    }

    Materiales.prototype.list = function(id) {
      return this.materiales[id];
    };

    return Materiales;

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
      if (this.actualStep >= 0 && this.actualStep < 4) {
        app.set('process.actualStep', this.actualStep + 1);
        return app.set('process.elements', this.elementsVisivility[this.actualStep]);
      }
    };

    Step.prototype.restart = function() {
      return app.set({
        'process.actualStep': 0,
        'process.elements': this.elementsVisivility[0]
      });
    };

    Step.prototype.goto = function(stepId) {};

    return Step;

  })();

  ProgressBar = (function() {
    function ProgressBar() {
      this.tick = __bind(this.tick, this);
      this.percent = 0;
    }

    ProgressBar.prototype.start = function() {
      var program;
      clearInterval(this.tickerId);
      program = app.get('plasma.program');
      switch (program) {
        case 1:
          this.minutes = 15;
          break;
        case 3:
          this.minutes = 2.5;
          break;
        case 5:
          this.minutes = 15;
      }
      this.inicio = new Date();
      this.final = new Date();
      this.final = new Date(this.final.setSeconds(this.final.getSeconds() + this.minutes * 60));
      this.tickCounter = 0;
      return this.tickerId = setInterval(this.tick, 1600);
    };

    ProgressBar.prototype.tick = function() {
      var now;
      this.tickCounter++;
      now = new Date();
      if (now > this.final) {
        this.cancel();
        step.next();
      }
      this.percent = Math.floor(((now - this.inicio) / (this.final - this.inicio)) * 100);
      console.log(this.percent);
      return app.set('pBar.percent', this.percent);
    };

    ProgressBar.prototype.cancel = function() {
      clearInterval(this.tickerId);
      return app.set('pBar.percent', '');
    };

    return ProgressBar;

  })();

  Err = (function() {
    function Err() {
      this.list = [];
    }

    Err.prototype.add = function(text) {
      return this.list.push(text);
    };

    Err.prototype.clear = function() {
      return this.list.splice(0, this.list.length);
    };

    return Err;

  })();

  materialList = new Materiales;

  step = new Step;

  plasma = new Plasma;

  progress = new ProgressBar;

  app = new Ractive({
    el: 'main',
    template: '#template',
    data: {
      process: step,
      plasma: plasma,
      materialEnHorno: [],
      ingresarMateriales: [],
      pBar: progress
    }
  });

  setMaterialListByProgramId = function(id) {
    var material, _i, _len, _ref, _results;
    app.data.ingresarMateriales.splice(0, 100);
    _ref = materialList.list(id);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      material = _ref[_i];
      _results.push(app.data.ingresarMateriales.push(material));
    }
    return _results;
  };

  app.on({
    'test': function(event) {},
    'selectProgram_1': function() {
      app.set({
        'plasma.program': 1
      });
      setMaterialListByProgramId(1);
      return step.next();
    },
    'selectProgram_3': function() {
      app.set({
        'plasma.program': 3
      });
      setMaterialListByProgramId(3);
      return step.next();
    },
    'selectProgram_5': function() {
      app.set({
        'plasma.program': 5
      });
      setMaterialListByProgramId(5);
      return step.next();
    },
    'startPlasma': function(event) {
      if (event.context.plasma.list.length > 0) {
        step.next();
        return progress.start();
      } else {
        return alert("No hay materiales cargados para ingresar al horno.");
      }
    },
    'cancelPlasma': function(e) {
      app.set('plasma.program', '');
      step.restart();
      return plasma.list.splice(0, 1000);
    },
    'addMaterialToList': function(event) {
      var m;
      m = event.context;
      return plasma.list.push(new Material(m.type, m.lado, m.lote, m.qty));
    },
    'deleteMaterialFromList': function(e) {
      e.original.preventDefault();
      return plasma.list.shift(e.index.i);
    },
    'cancelOvenProgress': function(event) {
      app.set('plasma.program', '');
      step.restart();
      plasma.list.splice(0, 1000);
      return progress.cancel();
    }
  });

  window.progress = progress;

  window.materialList = materialList;

  window.plasma = plasma;

  window.step = step;

  window.app = app;

  window.Material = Material;

}).call(this);
