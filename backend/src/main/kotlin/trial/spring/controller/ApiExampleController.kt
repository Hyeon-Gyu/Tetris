package trial.spring.controller


import org.springframework.web.bind.annotation.*
import trial.spring.model.*
import trial.spring.model.blockarray.setOfBlockArrays
//import trial.spring.repository.UserRepository
import trial.spring.model.TetrisState
import java.util.*

@RestController
class ApiExampleController
//(private var userRepository: UserRepository)
{
    companion object {
        var state: TetrisState = TetrisState.BeforeStarting
        var key: Char = '0'
        //var board = Tetris(15,10)
        var board = CTetris(15, 10)
        var random = Random()
    }



    @RequestMapping(path = ["/tetris"], produces = ["application/json;charset=UTF-8"])
    fun receivingKey(@RequestBody paramMap: Map<String, Char>): Ttetris_screen {
        var key = paramMap.values.single()
        when (state) {
            TetrisState.Finished -> {
                return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "game end")
            }
            TetrisState.BeforeStarting -> {
                Tetris.init(setOfBlockArrays)
                //board = Tetris(15,10)
                board = CTetris(15, 10)
                state = TetrisState.NewBlock
                var sKey = '0' + random.nextInt(7)
                state = board.accept(sKey)
                board.printScreen()
                println()
                return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "start")
            }
            TetrisState.Running -> {
                if (key == 'q') {
                    board.printScreen()
                    state = TetrisState.Finished
                    return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "game quit")
                }
                state = board.accept(key)
                board.printScreen()
                println()
            }
            TetrisState.NewBlock -> {
                key = ('0' + random.nextInt(7))
                state = board.accept(key)
                board.printScreen()
                println()
                if (state == TetrisState.Finished) {
                    return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "game over")
                }
            }
        }
        return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "keep going")
    }
}
