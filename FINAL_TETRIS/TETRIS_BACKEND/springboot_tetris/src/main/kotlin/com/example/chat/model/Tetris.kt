package com.example.chat.model


enum class TetrisState {
    Running, NewBlock, Finished, BeforeStarting;
}

open class Tetris {
    companion object {
        private var iScreenDw: Int = 4
        private var nBlockTypes: Int = 0
        private var nBlockDegrees: Int = 0
        var setOfBlockObjects: Array<Array<Matrix?>>? = null

        @Throws(TetrisException::class)
        private fun createSetOfBlocks(setOfArrays: Array<Array<Array<IntArray>>>): Array<Array<Matrix?>> {
            var ntypes: Int = setOfArrays.size
            var ndegrees: Int = setOfArrays[0].size
            val setOfObjects = Array(nBlockTypes) { arrayOfNulls<Matrix>(nBlockDegrees) }
            for (t in 0 until nBlockTypes) {
                for (d in 0 until nBlockDegrees) {
                    setOfObjects[t][d] = Matrix(setOfArrays[t][d])
                }
            }
            return setOfObjects
        }

        private fun max(a: Int, b: Int): Int {
            if (a > b) return a
            else return b
        }

        private fun findLargestBlockSize(setOfArrays: Array<Array<Array<IntArray>>>): Int {
            var size: Int = 0
            var max_size: Int = 0
            for (t in 0 until nBlockTypes) {
                for (d in 0 until nBlockDegrees) {
                    size = setOfArrays[t][d].size
                    max_size = max(max_size, size)
                }
            }
            return max_size
        }
        @Throws(TetrisException::class)
        @JvmStatic
        fun init(setOfBlockArrays: Array<Array<Array<IntArray>>>) {
            nBlockTypes = setOfBlockArrays.size
            nBlockDegrees = setOfBlockArrays[0].size
            setOfBlockObjects = createSetOfBlocks(setOfBlockArrays)
            //iScreenDw = findLargestBlockSize(setOfBlockArrays)
        }
    }

    open var iScreenDy: Int = 0
    open var iScreenDx: Int = 0
    var state: TetrisState = TetrisState.NewBlock
    var top: Int = 0
    var left: Int = 0
    var iScreen: Matrix
    var oScreen: Matrix

    fun get_oScreen(): Matrix {
        return oScreen
    }

    fun get_iScreenDw():Int{
        return iScreenDw
    }

    open var currBlk: Matrix? = null
    open var idxBlockType: Int = 0
    open var idxBlockDegree: Int = 0
    private fun createArrayScreen(dy: Int, dx: Int, dw: Int): Array<IntArray> {
        var y: Int
        var x: Int
        var array: Array<IntArray> = Array(dy + dw) { IntArray(dx + 2 * dw) }
        for (y in 0 until array.size) {
            //for(element in array){
            for (x in 0 until dw) {
                array[y][x] = 1
            }
        }
        for (y in 0 until array.size) {
            for (x in dw + dx until array[0].size) {
                array[y][x] = 1
            }
        }
        for (y in dy until array.size) {
            for (x in 0 until array[0].size) {
                array[y][x] = 1
            }
        }
        return array
    }

    private fun printMatrix(blk: Matrix) {
        var dy: Int = blk.get_dy()
        var dx: Int = blk.get_dx()
        var array = blk.get_array()
        for (y in 0 until dy) {
            for (x in 0 until dx) {
                if (array!![y]!![x] == 0)
                    print("□ ")
                else if (array!![y]!![x] == 1)
                    print("■ ")
                else print("XX ")
            }
            println()
        }
    }

    @Throws(TetrisException::class)
    open fun deleteFullLines(screen: Matrix, blk: Matrix?, top:Int, dy:Int, dx:Int, dw:Int): Matrix {
        var line: Matrix
        var zero: Matrix
        var temp: Matrix?
        if (blk == null) return screen
        var cy:Int
        var y:Int
        var nDeleted:Int = 0
        var nScanned:Int = blk.get_dy()
        if(top + blk.get_dy() - 1 >= dy)
            nScanned -= (top + blk.get_dy() - dy)
        zero = Matrix(1,dx)
        for(y in nScanned-1 downTo 0){
            cy = top + y + nDeleted
            line = screen.clip(cy,0,cy+1,screen.get_dx())
            if(line.sum() == screen.get_dx()){
                temp = screen.clip(0,0,cy,screen.get_dx())
                screen.paste(temp,1,0)
                screen.paste(zero,0,dw)
                nDeleted++
            }
        }
        return screen
    }


    open fun printScreen(){
        var screen: Matrix? = oScreen
        var dy:Int = screen!!.get_dy()
        var dx:Int = screen!!.get_dx()
        var dw:Int = iScreenDw
        var array: Array<IntArray?>? = screen.get_array()
        for(y in 0 until dy-dw+1){
            for(x in dw-1 until dx-dw+1){
                if (array!![y]!![x] == 0) print("□ ");
                else if (array!![y]!![x] == 1) print("■ ");
                else print("XX ");
            }
            println()
        }
    }
    @Throws(TetrisException::class)
    constructor(cy:Int, cx:Int){
        if(cy < iScreenDw || cx < iScreenDw)
            print("too small screen")
        iScreenDy = cy
        iScreenDx = cx
        var arrayScreen:Array<IntArray> = createArrayScreen(iScreenDy,iScreenDx, iScreenDw)
        state = TetrisState.NewBlock
        iScreen = Matrix(arrayScreen)
        oScreen = Matrix(iScreen!!)
    }
    //key type char->string?
    @Throws(TetrisException::class)
    open fun accept(key:String): TetrisState {
        var tempBlk: Matrix
        if(state == TetrisState.NewBlock){
            print("new block needed in BE")
            oScreen = deleteFullLines(oScreen, currBlk, top, iScreenDy,iScreenDx, iScreenDw)
            iScreen.paste(oScreen,0,0)
            state = TetrisState.Running
            idxBlockType = key.first() - '0'
            idxBlockDegree = 0
            currBlk = setOfBlockObjects!![idxBlockType][idxBlockDegree]!!
            top = 0
            left = iScreenDw + iScreenDx / 2 - (currBlk!!.get_dx()+1) / 2
            tempBlk = iScreen.clip(top,left,top+currBlk!!.get_dy(),left+currBlk!!.get_dx())
            tempBlk = tempBlk.add(currBlk!!)
            oScreen.paste(iScreen,0,0)
            oScreen.paste(tempBlk,top,left)
            println()
            if(tempBlk.anyGreaterThan(1)){
                state = TetrisState.Finished
                return state
            }
            return state
        }

        when (key) {
            "a" -> left--
            "d" -> left++
            "s" -> {
                top++
                tempBlk = iScreen.clip(top+1,left,top+1+currBlk!!.get_dy(), left+currBlk!!.get_dx())
                //여기서 top1 더해준건 when 끝나면 어차피 다시 원래대로 돌아옴
                tempBlk = tempBlk.add(currBlk!!)
                if(tempBlk.anyGreaterThan(1)){
                    tempBlk = iScreen.clip(top,left,top+currBlk!!.get_dy(), left+currBlk!!.get_dx())
                    tempBlk = tempBlk.add(currBlk!!)
                    state = TetrisState.NewBlock;
                    oScreen.paste(iScreen,0,0)
                    oScreen.paste(tempBlk,top,left)
                    return state
                }
            }
            "w" -> {
                idxBlockDegree = (idxBlockDegree + 1) % nBlockDegrees
                currBlk = setOfBlockObjects!![idxBlockType][idxBlockDegree]
            }

            "_" -> {
                do {
                    top++
                    tempBlk = iScreen.clip(top, left, top + currBlk!!.get_dy(), left + currBlk!!.get_dx())
                    tempBlk = tempBlk.add(currBlk!!)
                } while (!tempBlk.anyGreaterThan(1))
            }

            else -> {
                //println("state in accept:$state")
                println("unknown key")
                println()
            }
        }

        tempBlk = iScreen.clip(top,left,top+currBlk!!.get_dy(), left+currBlk!!.get_dx())
        tempBlk = tempBlk.add(currBlk!!)
        if(tempBlk.anyGreaterThan(1)){
            when(key){
                "a" -> left++
                "d" -> left--
//                "s" -> {
//                    state = TetrisState.NewBlock;
//                    top--;
//                }
                "w" ->{
                    idxBlockDegree = (idxBlockDegree+ nBlockDegrees -1)% nBlockDegrees;
                    currBlk = setOfBlockObjects!![idxBlockType][idxBlockDegree]!!;
                }
                "_"  -> {
                    top--
                    state = TetrisState.NewBlock
                }
            }
            tempBlk = iScreen.clip(top,left,top+currBlk!!.get_dy(), left+currBlk!!.get_dx())
            tempBlk = tempBlk.add(currBlk!!)
        }
        oScreen.paste(iScreen,0,0)
        oScreen.paste(tempBlk,top,left)
        return state
    }
}

class TetrisException : Exception {
    constructor() : super("Tetris Exception")
    public constructor(msg:String) : super(msg)
}
