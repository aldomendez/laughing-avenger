(function() {
  var Err, Material, Materiales, Plasma, ProgressBar, Step, User, app, materialList, plasma, setMaterialListByProgramId, step;

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
    function ProgressBar() {}

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

  app = new Ractive({
    el: 'main',
    template: '#template',
    data: {
      process: step,
      plasma: plasma,
      materialEnHorno: [],
      ingresarMateriales: [
        {
          type: 'PLC (Abajo)',
          qty: '',
          lote: '',
          lado: ''
        }
      ]
    }
  });

  setMaterialListByProgramId = function(id) {
    var material, _i, _len, _ref, _results;
    app.data.ingresarMateriales.splice(0, 100);
    _ref = materialList.list(id);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      material = _ref[_i];
      console.log(material);
      _results.push(app.data.ingresarMateriales.push(material));
    }
    return _results;
  };

  app.on({
    'test': function(event) {
      return console.log(event);
    },
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
        return step.next();
      } else {
        return alert("No hay materiales cargados para ingresar al horno.");
      }
    },
    'cancelPlasma': function(e) {
      app.set('plasma.program', '');
      return step.restart();
    },
    'addMaterialToList': function(event) {
      var m;
      m = event.context;
      return plasma.list.push(new Material(m.type, m.lado, m.lote, m.qty));
    },
    'deleteMaterialFromList': function(e) {
      e.original.preventDefault();
      return plasma.list.shift(e.index.i);
    }
  });

  window.materialList = materialList;

  window.plasma = plasma;

  window.step = step;

  window.app = app;

  window.Material = Material;

}).call(this);
