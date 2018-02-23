let cardset = ['S2', 'H2', 'C2', 'D2', 'S3', 'H3', 'C3', 'D3', 'S4', 'H4', 'C4', 'D4', 'S5', 'H5', 'C5', 'D5', 'S6', 'H6', 'C6', 'D6', 'S7', 'H7', 'C7', 'D7', 'S8', 'H8', 'C8', 'D8', 'S9', 'H9', 'C9', 'D9', 'ST', 'HT', 'CT', 'DT', 'SJ', 'HJ', 'CJ', 'DJ', 'SQ', 'HQ', 'CQ', 'DQ', 'SK', 'HK', 'CK', 'DK', 'SA', 'HA', 'CA', 'DA']
let cards = []
let log = ''
//player = {
//  id = ''
//  name = ''
//  cards = ''
//  next = ''
//  waiting = ''
//}
let turn = 0
let rummy = -1
let currentCard = 0
let players = []


for (var i = 0; i < cardset.length; i++) {
  cards.push(i)
}
for (var i = cards.length - 1; i >= 0; i--) {
  var randomIndex = Math.floor(Math.random() * (i + 1))
  var itemAtIndex = cards[randomIndex]
  cards[randomIndex] = cards[i]
  cards[i] = itemAtIndex
}
console.log(`Start card set : ${print(cards)}`)
start(cards)
for (var i = 0; i < 3; i++) {
  console.log(`Player ${players[i].name} has card set : ${print(players[i].cards)} `)
}
play(cards)

function start () {
  for (var i = 0; i < 3; i++) {
    var cardOfPlayer = []
    for (var j = 0; j < 8; j++) {
      cardOfPlayer.push(cards[j * 3 + i])
    }
    cardOfPlayer.sort(function (a,b) {
                        return a - b
                      })
    var player = {id: i, name: i, cards: cardOfPlayer, next: (i + 1 == 3 ? 0 : i + 1), waiting: null}
    players.push(player)
  }
}

function play () {
  currentCard = 24
  while (rummy == -1) {
    deal(cards[currentCard], players[turn])
  }
  if (rummy > 2) {
    console.log(`Game finished! No player wins!`)
  } else {
    console.log(`Game finished! Player ${players[rummy].name} wins!`)
  }
  for (var i = 0; i < 3; i++) {
    console.log(`Player ${players[i].name} has card set : ${print(players[i].cards)} `)
  }
}

function deal (card, player) {
  console.log(`Parent: dealing card ${cardset[card]} to player ${player.name}`)
  var dis = judge(card, player)
  if (rummy != -1) {
    return
  }
  if (dis == card) {
    console.log(`Player ${player.name}: skip card ${cardset[card]}`)
    turn = player.next
    player = players[turn]
    currentCard++
    if (currentCard == 52) {
      rummy = 3
      return
    }
    deal(cards[currentCard], players[turn])
  } else {
    console.log(`Player ${player.name}: take card ${cardset[card]}`)
    console.log(`Player ${player.name}: discard card ${cardset[dis]}`)
    discard(dis, player)
  }
}

function discard (card, player) {
  console.log(`Parent: player ${player.name} discard card ${cardset[card]}`)
  turn = player.next
  player = players[turn]
  var dis = judge(card, player)
  if (rummy != -1) {
    return
  }
  if (dis == card) {
    console.log(`Player ${player.name}: skip card ${cardset[card]}`)
    currentCard++
    if (currentCard == 52) {
      rummy = 3
      return
    }
    deal(cards[currentCard], players[turn])
  } else {
    console.log(`Player ${player.name}: take card ${cardset[card]}`)
    console.log(`Player ${player.name}: discard card ${cardset[dis]}`)
    discard(dis, player)
  }
  
}

function judge (card, player) {
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
    rummy = player.id
    return null
  } else {
    var dis = parseInt(Math.random() * tempCards.length, 10)
    if (player.cards.includes(tempCards[dis])) {
      player.cards.splice(player.cards.indexOf(tempCards[dis]), 1)
      player.cards.push(card)
    }
    return tempCards[dis]
  }
}

function print (cSet) {
  var string = ""
  for (var i = 0; i < cSet.length; i++) {
    string += cardset[cSet[i]] + " "
  }
  return string
}
