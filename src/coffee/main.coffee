class Material
  constructor: (@type,@side,@lot,@qty) ->

class Plasma
  constructor: () ->
    @list = []
    @get()
    # Al instanciar este elemento, se debe de cargar del servidor
    # los elementos que actualmente esten cargados en alguna otra instancia
  get:()->
    plasma = $.getJSON 'plasma.php'
    .done (data)->
      console.log data
    .fail (error)->
      console.log error.statusText

  set:()->
    # Antes de ejecutarse, se debe de cargar la informacion de la base de datos
    # para saber si ya hay alguna otra instancia ejecutandose en otra maquina,
    # tambien debera de existir la siguiente informacion:
    #   * Hora de inicio
    #   * Hora de finalizacion
    #   * Programa cargado


class Materiales
  constructor: () ->
    @materiales = 
      '1':[{
        type:'Glass Rail'
        qty:''
        lote:''
        lado:''
      },{
        type:'ALPS'
        qty:''
        lote:''
        lado:''
      },{
        type:'PLC/ PMQPSK/ ICRX2'
        qty:''
        lote:''
        lado:'abajo'
      },{
        type:'Shim (Abajo)'
        qty:''
        lote:''
        lado:'abajo'
      }],
      '3':[{
        type:'Shim (Arriba)'
        qty:''
        lote:''
        lado:'arriba'
      }],
      '5':[{
        type:'PLC (Abajo)'
        qty:''
        lote:''
        lado:'abajo'
      }]
  list:(id)->
    # Retorna: arreglo de objetos
    # De acuerdo a el numero de programa, contruye una lista
    # de los materiales que se pueden ingresar al horno
    @materiales[id]

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
    if @actualStep >= 0 and @actualStep < 4
      app.set 'process.actualStep', @actualStep + 1
      app.set 'process.elements', @elementsVisivility[@actualStep]
  restart:()->
    # Reinicializa los hornos hasta la seleccion del programa
    app.set
      'process.actualStep':0
      'process.elements':@elementsVisivility[0]
  goto:(stepId)-> 
    # Si la lista de materieles en el horno esta vacia
    # el proceso no puede cambiar de materiales a horneado

    # Se puede regresar hasta el principio.
class ProgressBar
    constructor: () ->
      @percent = 0
    start:()->
      clearInterval @tickerId
      program = app.get 'plasma.program'
      switch program
        when 1 then @minutes = 15
        when 3 then @minutes = 2.5
        when 5 then @minutes = 15
      @inicio = new Date()
      @final = new Date()
      @final = new Date @final.setSeconds @final.getSeconds() + @minutes*60
      @tickCounter = 0
      @tickerId = setInterval @tick, 1600
    tick:()=>
      @tickCounter++
      now = new Date()
      if now > @final
        @cancel()
        step.next()
      @percent = Math.floor ((now - @inicio) / (@final - @inicio))*100
      console.log @percent
      app.set 'pBar.percent', @percent
    cancel:()->
      clearInterval @tickerId
      app.set 'pBar.percent', ''



# Muestra la lista de errores que deberan de ser mostrados al usuario
# 
class Err
  constructor: () ->
    @list = []
  add:(text)->
    @list.push text
  clear:()->
    @list.splice 0,@list.length

  
materialList = new Materiales
step = new Step
plasma = new Plasma
progress = new ProgressBar

app = new Ractive {
  el: 'main'
  template:'#template'
  data:
    process: step
    plasma:plasma
    materialEnHorno:[]
    ingresarMateriales:[]
    pBar:progress
}

setMaterialListByProgramId = (id)->
  app.data.ingresarMateriales.splice 0, 100
  for material in materialList.list(id)
    
    app.data.ingresarMateriales.push material
  

app.on 
  'test': (event)->
    
  'selectProgram_1':()->
    app.set
      'plasma.program':1
    setMaterialListByProgramId 1
    step.next()
  'selectProgram_3':()->
    app.set
      'plasma.program':3
    setMaterialListByProgramId 3
    step.next()
  'selectProgram_5':()->
    app.set
      'plasma.program':5
    setMaterialListByProgramId 5
    step.next()
  'startPlasma':(event)->
    if event.context.plasma.list.length > 0
      step.next()
      progress.start()
    else
      alert "No hay materiales cargados para ingresar al horno."
  'cancelPlasma':(e)->
    app.set 'plasma.program',''
    step.restart()
    plasma.list.splice 0,1000
  'addMaterialToList':(event)->
    # 
    m = event.context
    # if m.type = '' then 
    plasma.list.push new Material m.type, m.lado, m.lote, m.qty
  'deleteMaterialFromList':(e)->
    e.original.preventDefault()
    plasma.list.shift e.index.i
  'cancelOvenProgress':(event)->
    app.set 'plasma.program',''
    step.restart()
    plasma.list.splice 0,1000
    progress.cancel()

############################################
# Cargar los datos de estado del server de manera que no se activen dos instancias del mismo servidor al mismo tiempo.

############################################

# app.observe 'plasma.program', (actual,old)->
  # console.log actual
window.progress = progress
window.materialList = materialList
window.plasma = plasma
window.step = step
window.app = app
window.Material = Material