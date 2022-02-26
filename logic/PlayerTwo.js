

export const playerTwo = (grid, player) => {

    const gridState = [
        ['one',   'two',    'three'],
        ['four',  'five',   'six'],
        ['seven', 'eight',  'nine'],
        ['one',   'four',  'seven'],
        ['two',   'five',   'eight'],
        ['three', 'six',    'nine'],
        ['one',   'five',   'nine'],
        ['three', 'five',   'seven']
    ]

    let blockPlays = new Set()
    let winPlays = new Set()
    let plays = new Set()
 
    for(let play of gridState){
        let X = 0
        let O = 0
        let E = []
        for(let square of play){
            let move = grid[square]
            move == "X" ? X++ : move == "O" ? O++ : E.push(square)
        }

        if(X == 2 && E.length == 1){ 
            E.map(e => blockPlays.add(e))
        }else if(O == 2 && E.length == 1){
            E.map(e => winPlays.add(e))
        }else {
            E.map(e => plays.add(e))
        }   
    }

    let nextPlays = [] 

    winPlays.size == 0 ? 
        blockPlays.size == 0 ? 
            plays.forEach((value)=> nextPlays.push(value)) : 
            blockPlays.forEach((value)=> nextPlays.push(value)) :
            winPlays.forEach((value)=> nextPlays.push(value))

    const PCplay = Math.floor(Math.random()*nextPlays.length)

    console.log(nextPlays[PCplay])
    return nextPlays[PCplay]

}

