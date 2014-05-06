class Deck
  constructor: (@raw) ->
    @cards = []
    preCards = @raw.split '\n'
    for line in preCards when line.trim().charAt(0) isnt ':'
      console.log line.trim().charAt(0) isnt ":"
      @addCard line
  addCard:(line)->
    prospect = line.split ','
    if prospect.length is 5
      @cards.push new Card prospect


class Card
  constructor: (@raw) ->
    sp = {} # Inicializamos para poderle agregar datos despues
    # Sacamos los parametros que vamos a usar
    if typeof(@raw) is 'object'
      [sp.personal,sp.objeto,sp.accion,sp.dificil,sp.todos] = @raw
    else
      [sp.personal,sp.objeto,sp.accion,sp.dificil,sp.todos] = @raw.split ','
    for k, v of sp
      @[k] = @parseElement v
  parseElement:(el)->
    el = el.trim()
    if el[0] is ">"
      return {
        content:(el.slice 1).trim()
        playAll:true
      }
    else
      return {
        content:el.trim()
        playAll:false
      }

  



  
window.Deck = Deck
window.Card = Card