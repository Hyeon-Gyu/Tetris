import { start } from "repl";
import Matrix from "./Matrix"
export enum TetrisState{
    Running, NewBlock, Finished
}
export class Tetris{
        static idxBlockType(idxBlockType: any) {
                throw new Error('Method not implemented.');
        }

    protected static iScreenDw: number = 4;
    protected static nBlockTypes: number;
    protected static nBlockDegrees: number;
    public static setOfBlockObjects: Matrix[][];



    protected static createSetOfBlocks(setOfArrays:number[][][][]){
        var ntypes: number = setOfArrays.length;
        var ndegrees: number = setOfArrays[0].length;
        var setOfObjects: Matrix[][] = [
            [new Matrix(0,0),new Matrix(0,0),new Matrix(0,0),new Matrix(0,0)],
            [new Matrix(0,0),new Matrix(0,0),new Matrix(0,0),new Matrix(0,0)],
            [new Matrix(0,0),new Matrix(0,0),new Matrix(0,0),new Matrix(0,0)],
            [new Matrix(0,0),new Matrix(0,0),new Matrix(0,0),new Matrix(0,0)],
            [new Matrix(0,0),new Matrix(0,0),new Matrix(0,0),new Matrix(0,0)],
            [new Matrix(0,0),new Matrix(0,0),new Matrix(0,0),new Matrix(0,0)],
            [new Matrix(0,0),new Matrix(0,0),new Matrix(0,0),new Matrix(0,0)]
        ];
        for(var t:number=0; t<ntypes; t++)
            for(var d:number=0; d<ndegrees; d++){
                setOfObjects[t][d] = new Matrix(0,0,null,setOfArrays[t][d])
            }

        return setOfObjects;
    }

    protected static max(a:number, b:number){
        return (a>b? a:b);
    }

    protected static findLargestBlockSize(setOfArrays:number[][][][]){
        var size:number=0;
        var max_size:number=0;
        for(var t=0; t<this.nBlockTypes; t++)
            for(var d=0; d<this.nBlockDegrees; d++){
                size = setOfArrays[t][d].length;
                max_size = Tetris.max(max_size, size);
            }
        return max_size;
    }

    static init(setOfBlockArrays: number[][][][]){
        Tetris.nBlockTypes=setOfBlockArrays.length;
        Tetris.nBlockDegrees=setOfBlockArrays[0].length;
        Tetris.setOfBlockObjects=Tetris.createSetOfBlocks(setOfBlockArrays);
        // console.log(Tetris.setOfBlockObjects[0][0])
        // var cb:Matrix = this.setOfBlockObjects[0][0];
        // console.log(cb.print())
        Tetris.iScreenDw=Tetris.findLargestBlockSize(setOfBlockArrays);
    }

    protected iScreenDy: number = 0;
    protected iScreenDx: number =0;
    public state: TetrisState;
    public top!: number;
    protected left!:number;
    get_top(){ return this.top};
    get_left(){return this.left};

    public iScreen:Matrix = new Matrix(0,0);
    public oScreen:Matrix = new Matrix(0,0);

    get_oScreen(){return this.oScreen;}

    // protected currBlk:Matrix = new Matrix(0,0,null,null);
    public currBlk!: Matrix;
    public idxBlockType: number|undefined;
    public idxBlockDegree: number|undefined;

    protected createArrayScreen(dy:number, dx:number, dw:number){
        var y:number; var x:number;
        // var array:number[][] = [
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        // ];
        var array= new Matrix(dy+dw,dx+2*dw).get_array()

        for (y=0; y<dy+dw; y++)
            for (x=0; x<dw; x++)
                array[y][x] = 1;

        for (y=0; y<dy+dw; y++)
            for (x=dw+dx; x<dx+2*dw; x++)
                array[y][x] = 1;

        for (y=dy; y<dy+dw; y++)
            for (x=0; x<dx+2*dw; x++)
                array[y][x] = 1;

        return array
    }

    protected printMatrix(blk:Matrix){
        var dy:number = blk.get_dy();
        var dx:number = blk.get_dx();
        var array:number[][] = blk.get_array();
        for(var y=0; y<dy; y++){
            for(var x=0; x<dx; x++){
                if(array[y][x]==0) console.log("□ ");
                else if (array[y][x]==1) console.log("■ ");
                else console.log(array[y][x]);
            }
            console.log("\n")
        }
    }

    deleteFullLines(screen:Matrix, blk:Matrix, top:number, dy:number, dx:number, dw:number){
        // console.log("dfl")
        var line:Matrix; var zero:Matrix; var temp:Matrix;
        if(blk==null) return screen;
        var cy:number=0; var y:number=0; var nDeleted:number = 0;
        var nScanned:number = blk.get_dy();

        if(top+blk.get_dy()-1 >= dy)
            nScanned -= (top+blk.get_dy()-dy);
        zero=new Matrix(1,dx);
        for(y = nScanned-1; y>=0; y--){
            cy = top+y+nDeleted;
            line = screen.clip(cy,0,cy+1,screen.get_dx());
            // if(line.sum()==screen.get_dx()){
            if(line.sum()==18){
                temp = screen.clip(0,0,cy,screen.get_dx());
                screen.paste(temp,1,0);
                screen.paste(zero,0,dw);
                nDeleted++;
            }
        }
        return screen;
    }

    constructor (cy:number, cx:number){
        // if (cy < iScreenDw || cx < iScreenDw)
        //     throw new TetrisException("too small screen");
        this.iScreenDy = cy;
        this.iScreenDx = cx;
        var arrayScreen:number[][] = this.createArrayScreen(this.iScreenDy,this.iScreenDx,Tetris.iScreenDw)
        this.state = TetrisState.NewBlock;
        this.iScreen = new Matrix(0,0,null,arrayScreen);
        this.oScreen = new Matrix(0,0,this.iScreen,null);
    }

    detectCollision(tempBlk:Matrix, currBlk:Matrix){
        tempBlk = tempBlk.add(currBlk);
        return tempBlk.anyGreaterThan(1);
    }

    accept(key:string){
        console.log("accept called in collBoard")
        var anyCollision:boolean = false;
        var tempBlk:Matrix = new Matrix(0,0);

        if(this.state == TetrisState.NewBlock){
            this.oScreen = this.deleteFullLines(this.oScreen,this.currBlk,this.top,this.iScreenDy,this.iScreenDx,Tetris.iScreenDw);
            this.iScreen.paste(this.oScreen,0,0);
            this.state=TetrisState.Running;

            const randInt = Math.floor(Math.random() * 8);
            this.idxBlockType = randInt.toString().charCodeAt(0) - "0".charCodeAt(0);
            this.idxBlockDegree = 0;
            this.currBlk = Tetris.setOfBlockObjects[this.idxBlockType][this.idxBlockDegree];
            this.top=0;
            this.left = Math.floor(Tetris.iScreenDw+this.iScreenDx/2 - (this.currBlk.get_dx()+1)/2);

            tempBlk = this.iScreen.clip(this.top,this.left,this.top+this.currBlk.get_dy(),this.left+this.currBlk.get_dx());
            anyCollision = tempBlk.anyGreaterThan(1)
            tempBlk=tempBlk.add(this.currBlk);

            this.oScreen.paste(this.iScreen,0,0);
            this.oScreen.paste(tempBlk,this.top,this.left); console.log("\n");
            if(anyCollision){
                this.state = TetrisState.Finished;
                return this.state;
            }
            return this.state;
        }

        switch(key){
            case "a": this.left--; break;
            case "d": this.left++; break;
            case "s": this.top++; console.log("increased top:"+this.top);break;
            case "w":
                this.idxBlockDegree = (this.idxBlockDegree!+1)%Tetris.nBlockDegrees;
                this.currBlk = Tetris.setOfBlockObjects[this.idxBlockType!][this.idxBlockDegree];
                break;
            case "_":
                do{
                    this.top++;
                    tempBlk = this.iScreen.clip(this.top,this.left,this.top+this.currBlk.get_dy(), this.left+this.currBlk.get_dx());
                    tempBlk = tempBlk.add(this.currBlk);
                    anyCollision = tempBlk.anyGreaterThan(1)
                }while(anyCollision==false);
                break;
            default: console.log("unknown key!");

        }
        tempBlk = this.iScreen.clip(this.top,this.left,this.top+this.currBlk.get_dy(), this.left+this.currBlk.get_dx());
        // Tetris.drawMatrix(tempBlk)
        tempBlk = tempBlk.add(this.currBlk);
        //
        // Tetris.drawMatrix(tempBlk)
        //
        console.log("\n\n")
        // Tetris.drawMatrix(tempBlk)
        // Tetris.drawMatrix(this.currBlk)
        console.log("end")
        anyCollision = tempBlk.anyGreaterThan(1)

        if(anyCollision){
            switch(key){
                case "a": this.left++; break;
                case "d": this.left--; break;
                case "s": this.top--; this.state = TetrisState.NewBlock; break;
                case "w":
                    this.idxBlockDegree = (this.idxBlockDegree!-1)%Tetris.nBlockDegrees;
                    this.currBlk = Tetris.setOfBlockObjects[this.idxBlockType!][this.idxBlockDegree];
                    break;
                case "_":
                    this.top--; this.state = TetrisState.NewBlock; console.log("new block needed \n\n"); break;
            }
            tempBlk = this.iScreen.clip(this.top,this.left,this.top+this.currBlk.get_dy(), this.left+this.currBlk.get_dx());
            tempBlk = tempBlk.add(this.currBlk);

        }
        this.oScreen.paste(this.iScreen,0,0);

        console.log("paste block into oScreen. top:"+this.top+"left:"+this.left)
        this.oScreen.paste(tempBlk, this.top, this.left); console.log("\n");

        // Tetris.drawMatrix(this.oScreen)



        return this.state;
    }

    drawMatrix(oScreen:Matrix){
        var dy:number = oScreen.get_dy();
        var dx:number = oScreen.get_dx();
        var array:any[][] = oScreen.get_array();



        for(var y=0; y<dy; y++){
            var oArray:string[]=[];
            for(var x=0; x<dx; x++){
                // if(array[y][x]==0) console.log("□ ")
                // else if (array[y][x]==1) console.log("■ ")
                // if(array[y][x]==0) array[y][x]="□";
                // else if (array[y][x]==1) array[y][x]="■"
                if(array[y][x]==0) oArray.push("□ ")
                else if (array[y][x]==1)  oArray.push("■ ")
            }
            //console.log("\n");
            // console.log(array[y]);
            console.log(oArray);
        }

    }

}//end of Tetris class


