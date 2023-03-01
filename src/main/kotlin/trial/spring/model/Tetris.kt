package trial.spring.model

import kotlin.jvm.Throws

enum class TetrisState(var value:Int){
    Running(0), NewBlock(1), Finished(2), BeforeStart(3);
}

interface ActionHandler{
    @Throws(Exception::class)
    fun run(t:Tetris, key: Char):Boolean
}

class OnLeft :ActionHandler{
    override fun run(t:Tetris, key: Char):Boolean{
        t.left = t.left - 1
        return t.anyConflict(true)
    }
}

class OnRight :ActionHandler{
    override fun run(t:Tetris, key: Char):Boolean{
        t.left = t.left + 1
        return t.anyConflict(true)
    }
}

class OnDown :ActionHandler{
    override fun run(t:Tetris, key: Char):Boolean{
        t.top = t.top + 1
        return t.anyConflict(true)
    }
}
class OnUp :ActionHandler{
    override fun run(t:Tetris, key: Char):Boolean{
        t.top = t.top - 1
        return t.anyConflict(true)
    }
}

class OnDrop :ActionHandler{
    override fun run(t:Tetris, key: Char):Boolean{
        do {
            t.top = t.top + 1
        }while (!t.anyConflict(false))
        return t.anyConflict(true)
    }
}

class OnCw :ActionHandler{
    override fun run(t:Tetris, key: Char):Boolean{
        t.idxBlockDegree = (t.idxBlockDegree + 1) % Tetris.nBlockDegrees
        t.currBlk = Tetris.setOfBlockObjects!![t.idxBlockType][t.idxBlockDegree]
        return t.anyConflict(true)
    }
}

class OnCcw :ActionHandler{
    override fun run(t:Tetris, key: Char):Boolean{
        t.idxBlockDegree = (t.idxBlockDegree - 1) % Tetris.nBlockDegrees
        t.currBlk = Tetris.setOfBlockObjects!![t.idxBlockType][t.idxBlockDegree]
        return t.anyConflict(true)
    }
}

class OnNewBlock:ActionHandler {
    override fun run(t: Tetris, key:Char): Boolean {
        t.oScreen = deleteFullLines(t.oScreen, t.currBlk, t.top, t.iScreenDy, t.iScreenDx, Tetris.iScreenDw)
        t.iScreen = Matrix(t.oScreen)
        t.idxBlockType = (key - '0')
        t.idxBlockDegree = 0;
        t.currBlk = Tetris.setOfBlockObjects!![t.idxBlockType][t.idxBlockDegree]
        t.top = 0
        t.left = Tetris.iScreenDw + t.iScreenDx / 2 - (t.currBlk!!.get_dx() + 1) / 2
        return t.anyConflict(true)
    }
    @Throws(Exception::class)
    private fun deleteFullLines(screen: Matrix, blk: Matrix?, top: Int, dy: Int, dx: Int, dw: Int): Matrix {
        var line: Matrix
        val zero: Matrix
        var temp: Matrix
        if (blk == null) return screen
        var cy: Int
        var y: Int
        var nDeleted: Int = 0
        var nScanned: Int = blk.get_dy()
        if (top + blk.get_dy() - 1 >= dy)
            nScanned -= (top + blk.get_dy() - dy)
        zero = Matrix(1, dx)
        for (y in nScanned - 1 downTo 0) {
            cy = top + y + nDeleted
            line = screen.clip(cy, 0, cy + 1, screen.get_dx())
            if (line.sum() == screen.get_dx()) {
                temp = screen.clip(0, 0, cy, screen.get_dx())
                screen.paste(temp, 1, 0)
                screen.paste(zero, 0, dw)
                nDeleted++
            }
        }
        return screen
    }
}

class OnFinished :ActionHandler{
    @Throws(Exception::class)
    override fun run(t:Tetris, key: Char):Boolean{
        println("OnFinised.run() called")
        return false
    }
}


open class Tetris {
    companion object {
        var Finished = TetrisState.Finished
        var NewBlock = TetrisState.NewBlock
        var Running = TetrisState.Running
        var iScreenDw: Int = 0
        var nBlockTypes: Int = 0
        var nBlockDegrees: Int = 0
        var setOfBlockObjects: Array<Array<Matrix?>>? = null

        @Throws(TetrisException::class)
        fun createSetOfBlocks(setOfArrays: Array<Array<Array<IntArray>>>): Array<Array<Matrix?>> {

            var ntypes: Int = setOfArrays.size
            var ndegrees: Int = setOfArrays[0].size
            var setOfObjects = Array(nBlockTypes) { arrayOfNulls<Matrix>(nBlockDegrees) }
            for (t in 0 until ntypes) {
                for (d in 0 until ndegrees) {
                    setOfObjects[t][d] = Matrix(setOfArrays[t][d])
                }
            }
            return setOfObjects
        }

        private fun max(a: Int, b: Int): Int {
            if (a > b) return a
            else return b
        }

        internal fun findLargestBlockSize(setOfArrays: Array<Array<Array<IntArray>>>): Int {
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
            //println("nBlockType:$nBlockTypes")
            nBlockDegrees = setOfBlockArrays[0].size
            //println("nBlockDegrees:$nBlockDegrees")
            setOfBlockObjects = createSetOfBlocks(setOfBlockArrays)
            iScreenDw = findLargestBlockSize(setOfBlockArrays)
            setDefaultOperations()
        }

        private const val MAX_TET_OPS:Int = 100
        private var nops:Int = 0
        private var operations = arrayOfNulls<TetrisOperation>(MAX_TET_OPS)

        class TetrisOperation{
            var key:Char? = null
            var hDo:ActionHandler
            var hUndo:ActionHandler
            var preState:TetrisState
            var postStateWDo:TetrisState
            var postStateWUndo:TetrisState
            constructor(ch:Char, s0:TetrisState, h1:ActionHandler, s1:TetrisState, h2:ActionHandler, s2:TetrisState){
                key = ch
                hDo = h1
                hUndo = h2
                preState = s0
                postStateWDo = s1
                postStateWUndo = s2
            }
        }

        private fun findOperationByKey(key: Char):Int{
            var id:Int = 0
            while(operations[id]!= null){
                if(operations[id]!!.key == key) {
                    return id
                }
                id++
            }
            return 0
        }

        fun setOperation(key:Char, prestate:TetrisState, hDo:ActionHandler, postStateWDo:TetrisState,
                         hUndo:ActionHandler, postStateWUndo:TetrisState){
            var idx:Int = findOperationByKey(key)
            if(idx > 0) {
                operations[idx] = TetrisOperation(key, prestate, hDo, postStateWDo, hUndo, postStateWUndo)
            }
            else{
                if(nops == MAX_TET_OPS){
                    println("Tetris.operations[] is full")
                    return
                }
                operations[nops] = TetrisOperation(key,prestate,hDo, postStateWDo,hUndo,postStateWUndo)
                nops++
            }
        }

        fun setDefaultOperations(){
            var myOnLeft:OnLeft = OnLeft()
            var myOnRight:OnRight = OnRight()
            var myOnDown:OnDown = OnDown()
            var myOnUp:OnUp = OnUp()
            var myOnDrop:OnDrop = OnDrop()
            var myOnCw:OnCw = OnCw()
            var myOnCcw:OnCcw = OnCcw()
            var myOnNewBlock:OnNewBlock = OnNewBlock()
            var myOnFinished:OnFinished = OnFinished()

            setOperation('a', TetrisState.Running, myOnLeft, TetrisState.Running, myOnRight, TetrisState.Running);
            setOperation('d', TetrisState.Running, myOnRight, TetrisState.Running, myOnLeft, TetrisState.Running);
            setOperation('s', TetrisState.Running, myOnDown, TetrisState.Running, myOnUp, TetrisState.NewBlock);
            setOperation('w', TetrisState.Running, myOnCw, TetrisState.Running, myOnCcw, TetrisState.Running);
            setOperation(' ', TetrisState.Running, myOnDrop, TetrisState.Running, myOnUp, TetrisState.NewBlock);
            setOperation('0', TetrisState.NewBlock, myOnNewBlock, TetrisState.Running, myOnFinished, TetrisState.Finished);
            setOperation('1', TetrisState.NewBlock, myOnNewBlock, TetrisState.Running, myOnFinished, TetrisState.Finished);
            setOperation('2', TetrisState.NewBlock, myOnNewBlock, TetrisState.Running, myOnFinished, TetrisState.Finished);
            setOperation('3', TetrisState.NewBlock, myOnNewBlock, TetrisState.Running, myOnFinished, TetrisState.Finished);
            setOperation('4', TetrisState.NewBlock, myOnNewBlock, TetrisState.Running, myOnFinished, TetrisState.Finished);
            setOperation('5', TetrisState.NewBlock, myOnNewBlock, TetrisState.Running, myOnFinished, TetrisState.Finished);
            setOperation('6', TetrisState.NewBlock, myOnNewBlock, TetrisState.Running, myOnFinished, TetrisState.Finished);
        }
    }

    var iScreenDy: Int
    var iScreenDx: Int
    var state: TetrisState
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
    var currBlk: Matrix? = null
    var idxBlockType: Int = 0
    var idxBlockDegree: Int = 0
    private fun createArrayScreen(dy: Int, dx: Int, dw: Int): Array<IntArray> {
        var y: Int
        var x: Int
        var array: Array<IntArray> = Array(dy + dw) { IntArray(dx + 2 * dw) }
        for (y in 0 until array.size) {
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
/*
    fun printFront_Screen():Array<CharArray> {
        var screen: Matrix? = oScreen
        var dy: Int = screen!!.get_dy()
        println("dy:$dy")
        var dx: Int = screen!!.get_dx()
        println("dx:$dx")
        var dw: Int = iScreenDw
        println("dw: $dw")
        var array: Array<IntArray?>? = screen.get_array()
        var farray = Array(19) { CharArray(18) { '□' } }
        for (y in 0 until dy - dw + 1) {
            for (x in dw - 1 until dx - dw + 1) {
                if (array!![y]!![x] == 0){
                    farray[y][x] = '□'
                }
                else if (array!![y]!![x] == 1) {
                    farray[y][x] = '■'
                    print("■ ")
                }
                else print("XX ");
            }
            println()
        }
        return farray
    }*/
open fun printScreen(){
        var screen: Matrix? = oScreen
        var dy: Int = screen!!.get_dy()
        //println("dy:$dy")
        var dx: Int = screen!!.get_dx()
        //println("dx:$dx")
        var dw: Int = iScreenDw
        //println("dw: $dw")
        var array: Array<IntArray> = screen.get_array()
        for (y in 0 until dy - dw + 1) {
            for (x in dw - 1 until dx - dw + 1) {
                if (array!![y]!![x] == 0){
                    print("□ ")
                }
                else if (array!![y]!![x] == 1) {
                    print("■ ")
                }
                else print("XX ");
            }
            println()
        }
    }

    @Throws(TetrisException::class)
    constructor(cy: Int, cx: Int) {
        if (cy < iScreenDw || cx < iScreenDw)
            print("too small screen")
        iScreenDy = cy
        iScreenDx = cx
        var arrayScreen: Array<IntArray> = createArrayScreen(iScreenDy, iScreenDx, iScreenDw)
        state = TetrisState.NewBlock
        iScreen = Matrix(arrayScreen)
        oScreen = Matrix(iScreen!!)
    }

    @Throws(TetrisException::class)
    fun anyConflict(updateNeeded: Boolean): Boolean {
        var anyConflict: Boolean
        var tempBlk: Matrix
        tempBlk = iScreen.clip(top, left, top + currBlk!!.get_dy(), left + currBlk!!.get_dx())
        tempBlk = tempBlk.add(currBlk!!)
        if (updateNeeded) {
            oScreen.paste(iScreen, 0, 0)
            oScreen.paste(tempBlk, top, left)
        }
        anyConflict = tempBlk.anyGreaterThan(1)
        return anyConflict
    }

    @Throws(TetrisException::class)
    open fun accept(key:Char): TetrisState {
        var idx:Int = findOperationByKey(key)
        if(idx == -1){
            println("unKnown key")
            return state
        }

        var hop:TetrisOperation = operations[idx]!!
        //println("state: $state")
        //println("hop.prestate: ${hop.preState}")
        if(state != hop.preState)
            throw TetrisException("state != hop.prestate")
        if (!hop.hDo.run(this, key))
            state = hop.postStateWDo
        else{
            hop.hUndo.run(this,key)
            state = hop.postStateWUndo
        }
        return state
    }
}

class TetrisException : Exception {
    constructor() : super("Tetris Exception")
    public constructor(msg: String) : super(msg)
}