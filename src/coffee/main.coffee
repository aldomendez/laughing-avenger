class Material
  constructor: (@type,@side,@lot,@qty) ->

class Plasma
  constructor: () ->
    @list = []

class Process
  constructor: () ->

class User
  constructor: ()->
  
class Step
  constructor: () ->
    @steps = [
      'Seleccion'
      'Materiales'
      'Horneado'
      'Descarga'
    ]
    @actualStep = 1
    @states = [
      ['active','disabled','disabled','disabled']
      ['','active','disabled','disabled']
      ['disabled','disabled','active','disabled']
      ['','disabled','disabled','active']
    ]
    elements={

    }
  next:->
    # debera de haber varios candados al moverse
    # de un paso a otro
  restart:()->
    # Reinicializa los pasos para un horno en particular
  goto:(stepId)-> 
    # Si la lista de materieles en el horno esta vacia
    # el proceso no puede cambiar de materiales a horneado

    # Se puede regresar hasta el principio.
class ProgressBar
    constructor: () ->


# Muestra la lista de errores que deberan de ser mostrados al usuario
# 
class Err
  constructor: () ->
    # ...
  

step = new Step
plasma = new Plasma
plasma.list.push new Material 'Glass','up','T135461','200'
plasma.list.push new Material 'Glass','up','T135461','200'
plasma.list.push new Material 'Glass','up','T135461','200'
plasma.list.push new Material 'Glass','up','T135461','200'

r = new Ractive {
  el: 'main'
  template:'#template'
  data:
    process: step
    plasma:plasma
    materialEnHorno:[]
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

window.r = r



r.on 'test', (event)->
  console.log event