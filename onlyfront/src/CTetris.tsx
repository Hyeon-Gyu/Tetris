//export{}
import {Tetris} from './Tetris';
import Matrix from './Matrix';
import { TetrisState } from './Tetris';
export class CTetris extends Tetris{
    constructor(cy:number,cx:number){
        super(cy,cx);
    }
    private static inboard = new Tetris(15,10)

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
        CTetris.inboard.state = CTetris.inboard.accept(key)
        var tmpblk = CTetris.inboard.iScreen.clip(CTetris.inboard.top, CTetris.inboard.left,CTetris.inboard.top+ CTetris.inboard.currBlk.get_dy(), CTetris.inboard.left+CTetris.inboard.currBlk.get_dx())
        var type = CTetris.inboard.idxBlockType+1
        var ncurrBlk = new Matrix(CTetris.inboard.currBlk)
        let y:number
        let x:number
        for(y = 0; y < CTetris.inboard.currBlk.get_dy();y++){
            for(x =0; x < CTetris.inboard.currBlk.get_dx();x++){
                if (ncurrBlk.get_array()[y][x] === 1)
                    ncurrBlk.get_array()[y][x] = 10 * type
            }
        }
        tmpblk = tmpblk.add(ncurrBlk)
        this.oScreen = new Matrix(CTetris.inboard.oScreen)
        this.oScreen.paste(tmpblk,CTetris.inboard.top,CTetris.inboard.left)
        this.state = CTetris.inboard.state
        return this.state
    }
}