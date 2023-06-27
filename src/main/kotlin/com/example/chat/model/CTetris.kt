package com.example.chat.model


class CTetris
    (cy:Int, cx:Int):Tetris(cy,cx){

    private var inboard = Tetris(15,10) // inboard에서 가져올 정보, top,left, currblk 모양
    private var back = Tetris(15,10)//배경정보(벽, 컬러블록 tmp제외)
    var valid:Boolean = true

    override fun deleteFullLines(screen: Matrix, blk: Matrix?, top: Int, dy: Int, dx: Int, dw: Int): Matrix {
        var line:Matrix; var zero:Matrix; var temp:Matrix?
        if(blk == null) return screen
        var cy:Int; var y:Int; var nDeleted:Int = 0; var nScanned:Int = blk.get_dy()
        if(top + blk.get_dy() - 1 >= dy)
            nScanned -= (top + blk.get_dy() - dy)
        zero = Matrix(1,dx)
        for(y in nScanned-1 downTo 0){
            cy = top + y + nDeleted
            line = screen.clip(cy,0,cy+1,screen.get_dx())
            if(line.int2bool().sum() == screen.get_dx()){
                temp = screen.clip(0,0,cy,screen.get_dx())
                screen.paste(temp,1,0)
                screen.paste(zero,0,dw)
                nDeleted++
            }
        }
        return screen
    }
    override fun printScreen(){
        var screen:Matrix = get_oScreen()
        var dy = screen.get_dy()
        println(dy)
        var dx = screen.get_dx()
        println(dx)
        var dw = get_iScreenDw()
        println(dw)
        var arr: Array<IntArray?>? = screen.get_array()
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

//    companion object{ //static과 유사한 역할
//        private var inboard = Tetris(15,10) // inboard에서 가져올 정보, top,left, currblk 모양
//        private var back = Tetris(15,10)//배경정보(벽, 컬러블록 tmp제외)
//    }
//<<<<<<< HEAD
//
//    private var inboard = Tetris(15,10) // inboard에서 가져올 정보, top,left, currblk 모양
//    private var back = Tetris(15,10)//배경정보(벽, 컬러블록 tmp제외)
//
//=======
//>>>>>>> 02980de91523e07d4bd571db2273721e414c51e0

    override fun accept(key: String): TetrisState {
        inboard.state = inboard.accept(key)
        var tmpblk = back.oScreen.clip(inboard.top, inboard.left,inboard.top+ inboard.currBlk!!.get_dy(), inboard.left+inboard.currBlk!!.get_dx())
        var type = inboard.idxBlockType+1
        var ncurrBlk = Matrix(inboard.currBlk!!)
        for(y in 0 until inboard.currBlk!!.get_dy()){
            for(x in 0 until inboard.currBlk!!.get_dx()){
                if (ncurrBlk.get_array()!![y]!![x] == 1)
                    ncurrBlk.get_array()!![y]!![x] = 10 * type
            }
        }
        oScreen = Matrix(back.oScreen) //배경화면에서 oscreen 따오기
        tmpblk = tmpblk.add(ncurrBlk) //tmpblk 생성
        oScreen.paste(tmpblk,inboard.top,inboard.left) // inboard연산 결과랑 동일한 위치에 tmpblk를 oscreen에 붙이기
        if(inboard.state == TetrisState.NewBlock){ //inboard state에서 새로운 블록이 필요하다면 oscreen에서도 deleteline 검사를 해줘야한다.
            oScreen = deleteFullLines(oScreen, ncurrBlk, inboard.top, inboard.iScreenDy,inboard.iScreenDx, inboard.get_iScreenDw())
            back.oScreen = Matrix(oScreen) //줄이 지워진다면 배경 정보 업데이트 해줘야함. 줄이 안지워져도 업데이트는 이루어져야한다.
        }
        state = inboard.state
        top = inboard.top
        left = inboard.left
        idxBlockType = inboard.idxBlockType
        idxBlockDegree = inboard.idxBlockDegree

        return state
    }
}