import { playerTwo } from "../logic/PlayerTwo";


export const checkWinCon = (grid, setGrid, playerMove, whosTurn, isOnePlayer) => {

    const tempGrid = {...grid, [playerMove]:whosTurn}

    function winner(tempGrid){
        const boardState = [
            (tempGrid["one"] === tempGrid["two"] && tempGrid["one"] === tempGrid["three"] && tempGrid["one"] != ""),
            (tempGrid["four"] === tempGrid["five"] && tempGrid["four"] === tempGrid["six"] && tempGrid["four"] != ""),
            (tempGrid["seven"] === tempGrid["eight"] && tempGrid["seven"] === tempGrid["nine"] && tempGrid["seven"] != ""),
            (tempGrid["one"] === tempGrid["four"] && tempGrid["one"] === tempGrid["seven"] && tempGrid["one"] != ""),
            (tempGrid["two"] === tempGrid["five"] && tempGrid["two"] === tempGrid["eight"] && tempGrid["two"] != ""),
            (tempGrid["three"] === tempGrid["six"] && tempGrid["three"] === tempGrid["nine"] && tempGrid["three"] != ""),
            (tempGrid["one"] === tempGrid["five"] && tempGrid["one"] === tempGrid["nine"] && tempGrid["one"] != ""),
            (tempGrid["three"] === tempGrid["five"] && tempGrid["three"] === tempGrid["seven"] && tempGrid["three"] != "")
        ]

        return boardState.find(winCon => winCon == true)
    }



    if(winner(tempGrid)){
        setGrid({...tempGrid})
        return whosTurn
    }

    if(isOnePlayer){
        const pcMove = playerTwo(tempGrid)

        tempGrid = {...tempGrid, [pcMove]:"O"}

        if(winner(tempGrid)){
            setGrid({...tempGrid})
            return "The PC"
        }
    }

    setGrid({...tempGrid})

    return ""

}