package trial.spring.controller
import org.springframework.stereotype.Controller
import java.util.Random


import org.springframework.web.bind.annotation.*
import trial.spring.model.*
import trial.spring.model.blockarray.setOfBlockArrays
//import trial.spring.repository.UserRepository


@RestController
class ApiExampleController
//(private var userRepository: UserRepository)
{
    companion object{
        var state:TetrisState = TetrisState.BeforeStart
        var key:Char = '0'
        var board = Tetris(15,10)
        //var board = CTetris(15,10)
        var random = Random()
    }

    @RequestMapping(path = ["/tetris"], produces = ["application/json;charset=UTF-8"])
    fun receivingKey(@RequestBody paramMap: Map<String, Char>):Ttetris_screen {
        var key = paramMap.values.single()
        if (state == TetrisState.Finished){
            return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "game end")
        }
        if (state == TetrisState.BeforeStart) {
            //한번만 수행되는 구간, 시작하자마자 출력되야하므로 출력기능 추가
            //웹에서 아무 키를 누르면 게임이 시작하는 것처럼 구현
            Tetris.init(setOfBlockArrays)
            board = Tetris(15,10)
            //board = CTetris(15,10)
            state = TetrisState.NewBlock
            var sKey = '0' + random.nextInt(7)
            state = board.accept(sKey)
            board.printScreen()
            println()
            return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "start")
        }
        if (key == 'q') {
            board.printScreen()
            state == TetrisState.Finished
            return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "game quit")
        }
        if (state == TetrisState.Running) {
            state = board.accept(key)
            board.printScreen()
            println()
        }
        if (state == TetrisState.NewBlock) {
            key = ('0' + random.nextInt(7))
            state = board.accept(key)
            board.printScreen()
            println()
            if (state == TetrisState.Finished) {

                return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "game over")
            }
        }
        return Ttetris_screen(playerBoard = board.oScreen.get_array(), msg = "keep going")
    }
        
}





