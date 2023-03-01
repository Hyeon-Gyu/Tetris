package trial.spring.model

class CTetris
(cy:Int, cx:Int):Tetris(cy,cx){

    override fun printScreen(){
        var screen:Matrix = get_oScreen()
        var dy = screen.get_dy()
        println(dy)
        var dx = screen.get_dx()
        println(dx)
        var dw = get_iScreenDw()
        println(dw)
        var arr: Array<IntArray> = screen.get_array()
        var y:Int
        var x:Int
        for(y in 0 until dy-dw+1){
            for(x in dw-1 until dx-dw+1){
                if (arr!![y]!![x] == 0)
                    print("□  ")
                else if (arr[y]!![x] == 1)
                    print("■  ")
                else if (arr[y]!![x] == 10)
                    print("●  ")
                else if (arr[y]!![x] == 20)
                    print("♠  ")
                else if (arr[y]!![x] == 30)
                    print("▲  ")
                else if (arr[y]!![x] == 40)
                    print("▼  ")
                else if (arr[y]!![x] == 50)
                    print("♣  ")
                else if (arr[y]!![x] == 60)
                    print("◐  ")
                else if (arr[y]!![x] == 70)
                    print("♥  ")
            }
            println()
        }
    }

    companion object{
        private var inboard = Tetris(15,10)
    }

    override fun accept(key: Char): TetrisState {
        inboard.state = inboard.accept(key)
        var tmpblk = inboard.iScreen.clip(inboard.top, inboard.left,inboard.top+ inboard.currBlk!!.get_dy(), inboard.left+inboard.currBlk!!.get_dx())
        var type = inboard.idxBlockType+1
        //var ncurrBlk = inboard.currBlk
        var ncurrBlk = Matrix(inboard.currBlk!!)
        for(y in 0 until inboard.currBlk!!.get_dy()){
            for(x in 0 until inboard.currBlk!!.get_dx()){
                if (ncurrBlk.get_array()!![y]!![x] == 1)
                    ncurrBlk.get_array()!![y]!![x] = 10 * type
            }
        }
        tmpblk = tmpblk.add(ncurrBlk)
        oScreen = Matrix(inboard.oScreen)
        oScreen.paste(tmpblk,inboard.top,inboard.left)
        state = inboard.state
        return state
    }
}