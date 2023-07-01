import {Tetris} from './Tetris';
import Matrix from './Matrix';
import { TetrisState } from './Tetris';
export class CTetris extends Tetris{
    constructor(cy:number,cx:number){
        super(cy,cx);
    }
    private inboard = new Tetris(15,10)
    private back = new Tetris(15,10)

    deleteFullLines(screen: Matrix, blk: Matrix, top: number, dy: number, dx: number, dw: number): Matrix {
        var line:Matrix; var zero:Matrix; var temp:Matrix
        if(blk == null) return screen
        var cy:number; var y:number; var nDeleted:number = 0; var nScanned:number = blk.get_dy()
        if(top + blk.get_dy() - 1 >= dy)
            nScanned -= (top + blk.get_dy() - dy)
        zero = new Matrix(1,dx)
        for(y = nScanned-1; y >= 0; y--){
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

    override printScreen(){
        var screen:Matrix = this.get_oScreen()
        var dy = screen.get_dy()
        var dx = screen.get_dx()
        var arr:number[][]= screen.get_array()
        let farray:string[][] = [];
        let y:number
        let x:number
        for(y = 0; y < dy-this.get_iScreenDw()+1;y++){
            let parray:string[] = [];
            for(x = this.get_iScreenDw()-1; x <dx - this.get_iScreenDw() + 1;x++){
                if (arr[y][x] === 0){
                    parray.push("□  ")}
                else if (arr[y][x] === 1){
                    parray.push("■  ")}
                else if (arr[y][x] === 10){
                    parray.push("●  ")}
                else if (arr[y][x] === 20){
                    parray.push("♠  ")}
                else if (arr[y][x] === 30){
                    parray.push("▲  ")}
                else if (arr[y][x] === 40){
                    parray.push("▼  ")}
                else if (arr[y][x] === 50){
                    parray.push("♣  ")}
                else if (arr[y][x] === 60){
                    parray.push("◐  ")}
                else if (arr[y][x] === 70){
                    parray.push("♥  ")}
            }
            parray.join(' ')
            farray.push(parray)
        }
        console.log(farray)
    }
    override accept(key: string): TetrisState {
        this.inboard.state = this.inboard.accept(key)
        var tmpblk = this.back.oScreen.clip(this.inboard.top, this.inboard.left,this.inboard.top+ this.inboard.currBlk.get_dy(), this.inboard.left+this.inboard.currBlk.get_dx())
        var type = this.inboard.idxBlockType+1
        var ncurrBlk = new Matrix(this.inboard.currBlk)
        for(let y = 0; y < this.inboard.currBlk.get_dy(); y++){
            for(let x =0 ; x < this.inboard.currBlk.get_dx();x++){
                if (ncurrBlk.get_array()!![y]!![x] == 1)
                    ncurrBlk.get_array()!![y]!![x] = 10 * type
            }
        }
        this.oScreen = new Matrix(this.back.oScreen) //배경화면에서 oscreen 따오기
        tmpblk = tmpblk.add(ncurrBlk) //tmpblk 생성
        this.oScreen.paste(tmpblk,this.inboard.top,this.inboard.left) // inboard연산 결과랑 동일한 위치에 tmpblk를 oscreen에 붙이기
        if(this.inboard.state == TetrisState.NewBlock){ //inboard state에서 새로운 블록이 필요하다면 oscreen에서도 deleteline 검사를 해줘야한다.
            this.oScreen = this.deleteFullLines(this.oScreen, ncurrBlk, this.inboard.top, this.inboard.iScreenDy,this.inboard.iScreenDx, this.inboard.get_iScreenDw())
            this.back.oScreen = new Matrix(this.oScreen) //줄이 지워진다면 배경 정보 업데이트 해줘야함. 줄이 안지워져도 업데이트는 이루어져야한다.
        }
        this.state = this.inboard.state
        this.top = this.inboard.top
        this.left = this.inboard.left
        this.idxBlockType = this.inboard.idxBlockType
        this.idxBlockDegree = this.inboard.idxBlockDegree
        return this.state
    }
}