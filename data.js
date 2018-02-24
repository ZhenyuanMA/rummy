cardset = ['S2', 'H2', 'C2', 'D2', 'S3', 'H3', 'C3', 'D3', 'S4', 'H4', 'C4', 'D4', 'S5', 'H5', 'C5', 'D5', 'S6', 'H6', 'C6', 'D6', 'S7', 'H7', 'C7', 'D7', 'S8', 'H8', 'C8', 'D8', 'S9', 'H9', 'C9', 'D9', 'ST', 'HT', 'CT', 'DT', 'SJ', 'HJ', 'CJ', 'DJ', 'SQ', 'HQ', 'CQ', 'DQ', 'SK', 'HK', 'CK', 'DK', 'SA', 'HA', 'CA', 'DA']

var app = new Vue({
	el: '#app',
  data () {
  	return {
      //player: {
      //  id: ''
      //  name: ''
      //  cards: ''
      //  next: ''
      //},
      log: [],
      cards: [],
      turn: 0,
      rummy: -1,
      currentCard: 0,
      waiting: '',
      players: [],
      name: '',
      parent: '',
      player1: '',
      player2: ''
    }
  },
  mounted () {
    for (var i = 0; i < cardset.length; i++) {
      this.cards.push(i)
    }
    for (var i = this.cards.length - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1))
      var itemAtIndex = this.cards[randomIndex]
      this.cards[randomIndex] = this.cards[i]
      this.cards[i] = itemAtIndex
    }
  },
  methods: {
    start: function () {
      var cardOfPlayer = []
      for (var j = 0; j < 8; j++) {
        cardOfPlayer.push(this.cards[j * 3])
      }
      cardOfPlayer.sort(function (a,b) {
                          return a - b
                        })
      var player = {id: 0, name: this.name, cards: cardOfPlayer, next: 1}
      this.players.push(player)

      for (var i = 1; i < 3; i++) {
        var cardOfPlayer = []
        for (var j = 0; j < 8; j++) {
          cardOfPlayer.push(this.cards[j * 3 + i])
        }
        cardOfPlayer.sort(function (a,b) {
                            return a - b
                          })
        var player = {id: i, name: i, cards: cardOfPlayer, next: (i + 1 == 3 ? 0 : i + 1)}
        this.players.push(player)
      }
      for (var i = 0; i < 3; i++) {
        this.log.push(`Player ${this.players[i].name} has card set : ${print(this.players[i].cards)} `)
      }
      this.play()
    },
    play: function () {
      this.currentCard = 24
      while (this.rummy == -1) {
        this.deal(this.cards[this.currentCard], this.players[this.turn])
      }
      if (this.rummy > 2) {
        this.log.push(`Game finished! No player wins!`)
      } else {
        this.log.push(`Game finished! Player ${this.players[this.rummy].name} wins!`)
      }
      for (var i = 0; i < 3; i++) {
        this.log.push(`Player ${this.players[i].name} has card set : ${print(this.players[i].cards)} `)
      }
    },

    deal: async function (card, player) {
      this.log.push(`Parent: dealing card ${cardset[card]} to player ${player.name}`)
      await sleep(1000)
      var dis = this.judge(card, player)
      if (this.rummy != -1) {
        return
      }
      if (dis == card) {
        this.log.push(`Player ${player.name}: skip card ${cardset[card]}`)
        //await sleep(1000)
        turn = player.next
        player = this.players[this.turn]
        this.currentCard++
        if (this.currentCard == 52) {
          this.rummy = 3
          return
        }
        this.deal(this.cards[this.currentCard], this.players[this.turn])
      } else {
        this.log.push(`Player ${player.name}: take card ${cardset[card]}`)
        this.log.push(`Player ${player.name}: discard card ${cardset[dis]}`)
        this.discard(dis, player)
      }
    },
    
    discard: async function (card, player) {
      this.log.push(`Parent: player ${player.name} discard card ${cardset[card]}`)
      //await sleep(1000)
      this.turn = player.next
      player = this.players[this.turn]
      var dis = this.judge(card, player)
      if (this.rummy != -1) {
        return
      }
      if (dis == card) {
        this.log.push(`Player ${player.name}: skip card ${cardset[card]}`)
        //await sleep(1000)
        this.currentCard++
        if (this.currentCard == 52) {
          this.rummy = 3
          return
        }
        this.deal(this.cards[this.currentCard], this.players[this.turn])
      } else {
        this.log.push(`Player ${player.name}: take card ${cardset[card]}`)
        //await sleep(1000)
        this.log.push(`Player ${player.name}: discard card ${cardset[dis]}`)
        //await sleep(1000)
        this.discard(dis, player)
      }
    },

    judge: function (card, player) {
      var tempCards = [].concat(player.cards);
      tempCards.push(card)
      tempCards.sort(function (a,b) {
        return (a - b)
      })
    
      // set judge
      for (var i = 0; i < tempCards.length - 2; i++) {
        if ((parseInt(tempCards[i] / 4, 10) == parseInt(tempCards[i + 1] / 4, 10)) && (parseInt(tempCards[i + 1] / 4, 10) == parseInt(tempCards[i + 2] / 4, 10))) {
          tempCards.splice(i, 3)
        }
      }
    
      // run judge
      var array = []
      for (var i = 0; i < 13; i++) {
        var n = new Array(4).fill(-1)
        array.push(n)
      }
      var num = new Array(13).fill(0)
      for (var i = 0; i < tempCards.length; i++) {
        array[parseInt(tempCards[i] / 4, 10)][tempCards[i] % 4] = i
      }
      for (var i = 0; i < array.length; i++) {
        var count = 0
        for (var j = 0; j < array[i].length; j++) {
          if (array[i][j] >= 0) {
            count++
          }
        }
        num[i] = count
      }
      for (var i = 0; i < num.length - 2; i++) {
        if (num[i] > 0 && num[i + 1] > 0 && num[i + 2] > 0) {
          for (var j = 0; j < array[i].length; j++) {
            if (array[i][j] != -1) {
              delete tempCards[array[i][j]]
              array[i][j] = -1
              num[i]--
              break
            }
          }
          for (var j = 0; j < array[i + 1].length; j++) {
            if (array[i + 1][j] != -1) {
              delete tempCards[array[i + 1][j]]
              array[i + 1][j] = -1
              num[i + 1]--
              break
            }
          }
          for (var j = 0; j < array[i + 2].length; j++) {
            if (array[i + 2][j] != -1) {
              delete tempCards[array[i + 2][j]]
              array[i + 2][j] = -1
              num[i + 2]--
              break
            }
          }
        }
      }
    
      var temp = []
      for (var i = 0; i < tempCards.length; i++) {
        if (tempCards[i] != undefined) {
          temp.push(tempCards[i])
        }
      }
      tempCards = [].concat(temp)
    
      if (tempCards.length == 0) {
        this.rummy = player.id
        return card
      } else {
        var dis = parseInt(Math.random() * tempCards.length, 10)
        if (player.cards.includes(tempCards[dis])) {
          player.cards.splice(player.cards.indexOf(tempCards[dis]), 1)
          player.cards.push(card)
          player.cards.sort(function (a,b) {
            return (a - b)
          })
        }
        return tempCards[dis]
      }
    }
  }
})

function print (cSet) {
  var string = ""
  for (var i = 0; i < cSet.length; i++) {
    string += cardset[cSet[i]] + " "
  }
  return string
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

Vue.filter('cardname', (id) => {
  return cardset[id]
})