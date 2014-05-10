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
    @actualStep = 0
    @steps = [
      'Seleccion'
      'Materiales'
      'Horneado'
      'Descarga'
    ]
    @states = [
      ['active','','','']
      ['','active','','']
      ['','','active','']
      ['','','','active']
    ]
    ###
        [
          ['active','disabled','disabled','disabled']
          ['disabled','active','disabled','disabled']
          ['disabled','disabled','active','disabled']
          ['disabled','disabled','disabled','active']
        ]
    ###

    @elements = {
      table: false
      startButton: false
      progressBar: false
      processSelector: true
      elementsForm: false
    }

    @elementsVisivility = [
      {
        table: false
        startButton: false
        progressBar: false
        processSelector: true
        elementsForm: false
      },{
        table: true
        startButton: true
        progressBar: false
        processSelector: false
        elementsForm: true
      },{
        table: true
        startButton: false
        progressBar: true
        processSelector: false
        elementsForm: false
      },{
        table: true
        startButton: false
        progressBar: false
        processSelector: false
        elementsForm: false
      }
    ]
  next:()->
    console.log "next #{@actualStep}"
    if @actualStep <= 0 and @actualStep < 4
      console.log "next if #{@actualStep}"
      app.set 'process.actualStep', @actualStep + 1
      app.set 'process.elements', @elementsVisivility[@actualStep]
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

app = new Ractive {
  el: 'main'
  template:'#template'
  data:
    process: step
    plasma:plasma
    materialEnHorno:[]
    ingresarMateriales:[
      {
        type:'Glass'
        qty:10
        lote:'P545465'
        lado:''
      },
      {
        type:'ALPS'
        qty:10
        lote:20
        lado:''
      }
    ]
}

app.on 
  'test': (event)->
    console.log event
  'selectProgram_1':()->
    app.set
      'plasma.program':1
    step.next()
  'selectProgram_3':()->
    app.set
      'plasma.program':3
    step.next()
  'selectProgram_5':()->
    app.set
      'plasma.program':5
    step.next()
  'startPlasma':(event)->
    if event.context.plasma.list.length > 0
      step.next()
  'addMaterialToList':(event)->
    m = event.context
    plasma.list.push new Material m.type, m.lado, m.lote, m.qty

# app.observe 'plasma.program', (actual,old)->
#   console.log actual


window.step = step
window.app = app
window.Material = Material