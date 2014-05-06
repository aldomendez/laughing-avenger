(function() {
  var NewElement, Priorities, User, el, pr, r, req, srvr, us;

  NProgress.configure({
    showSpinner: false
  });

  Priorities = (function() {
    function Priorities() {}

    return Priorities;

  })();

  User = (function() {
    function User() {
      this.srvr = new Cenny({
        url: './server/cenny.php'
      });
    }

    User.prototype.login = function(user, password) {
      this.user = user;
      return this.srvr.user.signin({
        user: [this.user, password]
      }, (function(_this) {
        return function(data) {
          if (data) {
            r.set('logged', true);
          }
          return r.set('user', _this.user);
        };
      })(this));
    };

    User.prototype.logout = function() {
      return this.srvr.user.signout();
    };

    User.prototype.setPassword = function(newPassword) {
      return this.srvr.user.password(newPassword);
    };

    User.prototype.info = function() {
      return this.srvr.user.info();
    };

    User.prototype.create = function(user, password) {
      return this.srvr.user.create({
        user: [user, password]
      }, (function(_this) {
        return function(data) {
          return console.log(data);
        };
      })(this));
    };

    return User;

  })();

  NewElement = (function() {
    function NewElement() {
      this.patrn = /^(\d+)-(\w{0,2}\d+) (\d+) (\d+)/;
      this.el = $('#output', '#newCode');
    }

    NewElement.prototype.test = function(newData) {
      var ans;
      ans = this.patrn.exec(newData);
      this.proceed = false;
      if (ans != null) {
        this.match = ans[0], this.producto = ans[1], this.codigo = ans[2], this.cantidad = ans[3], this.prioridad = ans[4];
        if ((this.producto != null) && this.codigo && this.cantidad && this.prioridad) {
          this.proceed = true;
        }
        return r.set('code', {
          match: this.match,
          producto: this.producto,
          codigo: this.codigo,
          cantidad: this.cantidad,
          prioridad: this.prioridad,
          proceed: this.proceed
        });
      } else {
        return r.set('code', {});
      }
    };

    return NewElement;

  })();

  srvr = new Cenny({
    url: './server/cenny.php'
  });

  us = new User();

  r = new Ractive({
    el: '#output',
    template: "#template",
    data: {
      priorities: ''
    }
  });

  r.on('validateUser', function() {
    us.login(r.data.user.user, r.data.user.password);
    return r.set('user.password', '');
  });

  el = new NewElement();

  r.observe('newCode', function(code) {
    return el.test(code);
  });

  pr = new Priorities();

  req = $.getJSON('php/getPriorities.php');

  req.done(function(data) {
    return r.set('priorities', data);
  });

}).call(this);
