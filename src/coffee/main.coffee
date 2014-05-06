class Material
  constructor: (@type,@side,@lot,@qty) ->

class Plasma
  constructor: () ->

class Process
  constructor: () ->

class User
  constructor: ()->
  
class Step
  constructor: () ->
    @steps = [
      'Proceso'
      'Materiales'
      'Horneado'
      'Descarga'
    ]
    @actualStep = 0
  goto:(stepId)->

class ProgressBar
    constructor: () ->
    
r = new Ractive {
  el: 'main'
  template:'#template'
  data:
    processSelection:false
    Plasma:[]
    materialEnHorno:[
      {status:'hola', element:'otro element'}
      {status:'hola', element:'otro element'}
      {status:'hola', element:'otro element'}
    ]
    ingresarMateriales:[
      {
        type:'PLC'
        qty:10
        lote:'P545465'
        lado:'arriba'
      },
      {
        type:'ALPS'
        qty:10
        lote:20
        lado:'arriba'
      }
    ]
}

r.on 'selectProcess', (event)->
  console.log event