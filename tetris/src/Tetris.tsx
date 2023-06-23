
import Matrix from './Matrix';


export enum TetrisState {
    Running = 0,
    NewBlock = 1,
    Finished = 2,
    BeforeStart = 3
}

export class Tetris {
    static iScreenDw:number = 4;
    static nBlockTypes = 0;
    static nBlockDegrees = 0;
    static setOfBlockObjects: Array<Array<Matrix>>;
    iScreenDy: number;
    iScreenDx: number;
    state: TetrisState;
    top: number = 0;
    left: number = 0;
    iScreen: Matrix;
    oScreen: Matrix;
    currBlk: Matrix = new Matrix(0,0) ;
    idxBlockType: number = 0;
    idxBlockDegree: number = 0;

    constructor(cy: number, cx: number) {
        if (cy < Tetris.iScreenDw || cx < Tetris.iScreenDw)
            console.log("too small screen");
        this.iScreenDy = cy;
        this.iScreenDx = cx;
        let arrayScreen: number[][] = this.createArrayScreen(this.iScreenDy, this.iScreenDx, Tetris.iScreenDw);
        this.state = TetrisState.NewBlock;
        this.iScreen = new Matrix(arrayScreen);
        this.oScreen = new Matrix(this.iScreen);
    }

    static createSetOfBlocks(setOfArrays: Array<Array<Array<number[]>>>): Array<Array<Matrix>> {
        let ntypes = setOfArrays.length;
        let ndegrees = setOfArrays[0].length;
        let setOfObjects = new Array(Tetris.nBlockTypes);
        for (var t = 0; t < ntypes; t++) {
            setOfObjects[t] = new Array(Tetris.nBlockDegrees);
            for (var d = 0; d < ndegrees; d++) {
                setOfObjects[t][d] = new Matrix(setOfArrays[t][d]);
            }
        }
        return setOfObjects;
    }

    private static max(a: number, b: number): number {
        return a > b ? a : b;
    }

    static findLargestBlockSize(setOfArrays: Array<Array<Array<number[]>>>): number {
        let size = 0;
        let max_size = 0;
        for (let t = 0; t < Tetris.nBlockTypes; t++) {
            for (let d = 0; d < Tetris.nBlockDegrees; d++) {
                size = setOfArrays[t][d].length;
                max_size = Tetris.max(max_size, size);
            }
        }
        return max_size;
    }

    static init(setOfBlockArrays: Array<Array<Array<number[]>>>) {
        Tetris.nBlockTypes = setOfBlockArrays.length;
        Tetris.nBlockDegrees = setOfBlockArrays[0].length;
        Tetris.setOfBlockObjects = Tetris.createSetOfBlocks(setOfBlockArrays);
        Tetris.iScreenDw = Tetris.findLargestBlockSize(setOfBlockArrays);
    }
    

    get_iScreenDw(){
        return Tetris.iScreenDw
    }
    get_oScreen():Matrix{
        return this.oScreen
    }

    
    createArrayScreen(dy:number, dx:number, dw:number):number[][]{
        let y:number;
        let x:number;
        let array:number[][] = new Array(dy+dw)
        for(let i = 0; i < dy + dw; i++){
            array[i] = new Array(dx + 2*dw).fill(0);
        }
        //let array: number[][] = Array(dy + dw).fill(0).map(() => Array(dx + 2 * dw).fill(0));
        for (y = 0; y < array.length; y++) {
            for (x = 0; x < dw; x++) {
                array[y][x] = 1;
            }
        }    
        for (y = 0; y < array.length; y++) {
            for (x = dw + dx; x < array[0].length; x++) {
                array[y][x] = 1;
            }
        }
        for (y = dy; y < array.length; y++) {
            for (x = 0; x < array[0].length; x++) {
                array[y][x] = 1;
            }
        }
        return array;
    }


    deleteFullLines(screen:Matrix, blk:Matrix, top:number, dy:number, dx:number, dw:number){
        let line:Matrix, zero:Matrix, temp:Matrix;
        if(blk === null) return screen;
        let cy, nDeleted = 0, nScanned = blk.get_dy();
        if(top + blk.get_dy() - 1 >= dy)
            nScanned -= (top + blk.get_dy() - dy);
        zero = new Matrix(1,dx);
        for(let y = nScanned - 1; y >= 0; y--){
            cy = top + y + nDeleted;
            line = screen.clip(cy,0,cy+1,screen.get_dx());
            if (line.sum() === screen.get_dx()) {
                temp = screen.clip(0, 0, cy, screen.get_dx());
                screen.paste(temp, 1, 0); 
                screen.paste(zero, 0, dw);
                nDeleted++;
            }
        }
        return screen;
    }
    anyConflict(updateNeeded: boolean): boolean {
        let anyConflict: boolean;
        let tempBlk: Matrix;
        tempBlk =this.iScreen.clip(this.top,this.left, this.top + this.currBlk.get_dy(),this.left + this.currBlk.get_dx());
        tempBlk =tempBlk.add(this.currBlk);
        if (updateNeeded) {
            this.oScreen.paste(this.iScreen, 0, 0);
            this.oScreen.paste(tempBlk, this.top, this.left);
        }
        anyConflict = tempBlk.anyGreaterThan(1);
        return anyConflict;
    }

    printScreen(){
        let screen: Matrix = this.oScreen;
        let dy: number = screen.get_dy();
        let dx: number = screen.get_dx();
        //let dw: number = Tetris.iScreenDw;
        let array: number[][] = screen.get_array();
        let farray:string[][] = [];
        for (let y = 0; y < dy; y++) {
            let parray:string[] = [];
            for (let x = 0; x < dx; x++) {
                if (array[y][x] === 0){
                    parray.push('□');  
                }
                else if (array[y][x] === 1) {
                    parray.push("■");
                }
                else parray.push("XX");
            }
            parray.join('');
            farray.push(parray)
        }

        console.log(farray);
        
    }
  
    printMatrix(blk: Matrix) {
        let dy: number = blk.get_dy();
        console.log("dy:"+dy);
        let dx: number = blk.get_dx();
        console.log("dx:"+dx);
        let array = blk.get_array();
        let farray:string[][] = [];
        
        for (let y = 0; y < dy; y++) {
            let parray:string[] = [];
            for (let x = 0; x < dx; x++) {
                if (array[y][x] === 0)
                    parray.push("□ ");
                else if (array[y][x] === 1)
                    parray.push("■ ");
                else parray.push("XX ");
            }
            parray.join(' ');
            farray.push(parray);
        }
        console.log(farray)
    }
/*
    public drawMatrix(m:Matrix){
        let dy = m.get_dy();
        let dx = m.get_dx();
        let array = m.get_array();
        for(let y = 0; y < dy; y++){
            for(let x = 0; x < dx; x++){
                if(array[y][x] === 0){
                    console.log('□ ');}
                else if(array[y][x] === 1){
                    console.log('■ ');}
                else{
                    console.log('X ');
                }    
            }
        }
    }*/

    accept(key: string): TetrisState {
        
        let tempBlk:Matrix;
        if(this.state === TetrisState.NewBlock){
            this.oScreen = this.deleteFullLines(this.oScreen, this.currBlk, this.top, this.iScreenDy, this.iScreenDx, Tetris.iScreenDw);
            this.iScreen.paste(this.oScreen, 0, 0);
            this.state = TetrisState.Running;
            this.idxBlockType = parseInt(key);
            this.idxBlockDegree = 0;
            this.currBlk = Tetris.setOfBlockObjects[this.idxBlockType][this.idxBlockDegree];
            this.top = 0;
            this.left = Tetris.iScreenDw + this.iScreenDx / 2 - (this.currBlk.get_dx()+1) / 2;
            this.left = Math.floor(this.left);
            tempBlk = this.iScreen.clip(this.top, this.left, this.top+this.currBlk.get_dy(), this.left+this.currBlk.get_dx());
            tempBlk = tempBlk.add(this.currBlk);
            this.oScreen.paste(this.iScreen, 0, 0);
            this.oScreen.paste(tempBlk, this.top, this.left); 
            if(tempBlk.anyGreaterThan(1)){
                this.state = TetrisState.Finished;
                return this.state;
            }
            return this.state;
        }
        switch(key){
            case 'a': this.left--; break;
            case 'd': this.left++; break;
            case 's': this.top++; break;
            case 'w':
                this.idxBlockDegree = (this.idxBlockDegree+1) % Tetris.nBlockDegrees;
                this.currBlk = Tetris.setOfBlockObjects[this.idxBlockType][this.idxBlockDegree];
                break;
            case '_':
                do{
                    this.top++;
                    tempBlk = this.iScreen.clip(this.top, this.left, this.top+this.currBlk.get_dy(), this.left+this.currBlk.get_dx());
                    tempBlk = tempBlk.add(this.currBlk);
                } while (tempBlk.anyGreaterThan(1) === false);
                break;
            default:
                console.log("unknown key");    
        }
        tempBlk = this.iScreen.clip(this.top, this.left, this.top+this.currBlk.get_dy(), this.left+this.currBlk.get_dx());
        tempBlk = tempBlk.add(this.currBlk);
        if (tempBlk.anyGreaterThan(1)) {
            switch(key) {
                case 'a': this.left++; break; // undo: move right
                case 'd': this.left--; break; // undo: move left
                case 's': this.top--; this.state = TetrisState.NewBlock; break; // undo: move up
                case 'w': // undo: rotateCCW
                this.idxBlockDegree = (this.idxBlockDegree+Tetris.nBlockDegrees-1)%Tetris.nBlockDegrees;
                this.currBlk = Tetris.setOfBlockObjects[this.idxBlockType][this.idxBlockDegree];
                    break;
                case '_': this.top--; this.state = TetrisState.NewBlock; break; // undo: move up
            }
            tempBlk = this.iScreen.clip(this.top, this.left, this.top+this.currBlk.get_dy(), this.left+this.currBlk.get_dx());
            tempBlk = tempBlk.add(this.currBlk);
        }
        this.oScreen.paste(this.iScreen,0,0);
        this.oScreen.paste(tempBlk,this.top,this.left);
        return this.state;
    }
}


//export default {Tetris,TetrisState};
