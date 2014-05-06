# Hide loading spinner
NProgress.configure({ showSpinner: false })

class Priorities
  constructor: () ->

class User
  constructor: () ->
    @srvr = new Cenny({url:'./server/cenny.php'})
  login:(@user,password)->
    @srvr.user.signin {user:[@user,password]},(data)=>
      if data then r.set 'logged',true
      r.set 'user', @user
  logout:()->
    @srvr.user.signout()
  setPassword:(newPassword)->
    @srvr.user.password(newPassword)
  info:()->
    @srvr.user.info()
  create:(user,password)->
    @srvr.user.create {user:[user,password]},(data)=>
      console.log data
  

  
class NewElement
  constructor: () ->
    @patrn = /^(\d+)-(\w{0,2}\d+) (\d+) (\d+)/
    @el = $('#output', '#newCode')
  test:(newData)->
    ans = @patrn.exec newData
    @proceed = false
    if ans?
      [@match, @producto, @codigo, @cantidad, @prioridad] = ans
      if @producto? and @codigo and @cantidad and @prioridad
        @proceed = true
      r.set 'code', {
        match:(@match)
        producto:(@producto)
        codigo:(@codigo)
        cantidad:(@cantidad)
        prioridad:(@prioridad)
        proceed:@proceed
      }
    else
      r.set 'code', {}
  
srvr = new Cenny({url:'./server/cenny.php'})
us = new User()
r = new Ractive {
  el: '#output',
  template: "#template",
  data: { 
    priorities:''
  }
}

r.on 'validateUser', ()->
  us.login r.data.user.user, r.data.user.password
  r.set('user.password','')

el = new NewElement()

r.observe 'newCode', (code) ->
  el.test code

pr = new Priorities()

req = $.getJSON 'php/getPriorities.php'

req.done (data)->
  r.set 'priorities', data