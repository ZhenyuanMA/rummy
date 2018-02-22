var app = new Vue({
	el: '#app',
  data () {
  	return {
      cardset: ['S2', 'H2', 'C2', 'D2', 'S3', 'H3', 'C3', 'D3', 'S4', 'H4', 'C4', 'D4', 'S5', 'H5', 'C5', 'D5', 'S6', 'H6', 'C6', 'D6', 'S7', 'H7', 'C7', 'D7', 'S8', 'H8', 'C8', 'D8', 'S9', 'H9', 'C9', 'D9', 'ST', 'HT', 'CT', 'DT', 'SJ', 'HJ', 'CJ', 'DJ', 'SQ', 'HQ', 'CQ', 'DQ', 'SK', 'HK', 'CK', 'DK', 'SA', 'HA', 'CA', 'DA'],
      cards: '',
      log: '',
      //player: {
      //  id: '',
      //  name: '',
      //  cards: '',
      //  next: '',
      //  waiting: ''
      //},
      turn: 0,
      rummy: -1,
      currentCard: 0,
      players: [

      ]
    }
  },
  mounted () {
    this.cards = this.cardset
    for (var i = this.cards.length - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = this.cards[randomIndex];
        this.cards[randomIndex] = this.cards[i];
        this.cards[i] = itemAtIndex;
    }
    console.log(`Start card set : ${this.cards}`)
    this.start(this.cards)
    for (var i = 0; i < 3; i++) {
      console.log(`Player ${this.players[i].name} has card set : ${this.players[i].cards} `)
    }
    this.play(this.cards)
  },
  methods: {
    start (cards) {
      for (var i = 0; i < 3; i++) {
        var cardOfPlayer = []
        for (var j = 0; j < 8; j++) {
          cardOfPlayer.push(cards[j * 3 + i])
        }
        var player = {id: i, name: i, cards: cardOfPlayer, next: (i + 1 == 3 ? 0 : i + 1), waiting: null}
        this.players.push(player)
      }
    },
    play (cards) {
      this.currentCard = 24
      while (this.rummy == -1) {
        this.deal(this.cards[this.currentCard], this.players[this.turn])
      }
      console.log(`Game finished!`)
    },
    deal (card, player) {
      console.log(`Parent: dealing card ${card} to player ${player.name}`)
      console.log(`Player ${player.name}: discard card ${card}`)
      this.discard(card, player)
    },
    discard (card, player) {
      console.log(`Parent: player ${player.name} discard card ${card}`)
      this.turn = player.next
      player = this.players[this.turn]
      console.log(`Player ${player.name}: skip card ${card}`)
      this.currentCard++
      if (this.currentCard == 52) {
        this.rummy = 3
        return
      }
      this.deal(this.cards[this.currentCard], this.players[this.turn])
    }
  }
})
