

export const playerTwo = (grid, player) => {

    const priorGird = Object.keys(grid).filter(square => grid[square] === "")

    const currentGrid = priorGird.filter(square => square != player )

    const play = Math.floor(Math.random()*currentGrid.length)

    return currentGrid[play]

}

