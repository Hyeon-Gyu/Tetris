import Matrix from "./Matrix";
import {Tetris, TetrisState} from "./Tetris";
let setOfColorBlockArrays:number[][][][] =[ // [7][4][?][?]
        [
                        [
                                        [10, 10],
                                        [10, 10]
                        ],
                        [
                                        [10, 10],
                                        [10, 10]
                        ],
                        [
                                        [10, 10],
                                        [10, 10]
                        ],
                        [
                                        [10, 10],
                                        [10, 10]
                        ]
        ],
        [
                        [
                                        [0, 20, 0],
                                        [20, 20, 20],
                                        [0, 0, 0],
                        ],
                        [
                                        [0, 20, 0],
                                        [0, 20, 20],
                                        [0, 20, 0],
                        ],
                        [
                                        [0, 0, 0],
                                        [20, 20, 20],
                                        [0, 20, 0],
                        ],
                        [
                                        [0, 20, 0],
                                        [20, 20, 0],
                                        [0, 20, 0],
                        ],
        ],
        [
                        [
                                        [30, 0, 0],
                                        [30, 30, 30],
                                        [0, 0, 0],
                        ],
                        [
                                        [0, 30, 30],
                                        [0, 30, 0],
                                        [0, 30, 0],
                        ],
                        [
                                        [0, 0, 0],
                                        [30, 30, 30],
                                        [0, 0, 30],
                        ],
                        [
                                        [0, 30, 0],
                                        [0, 30, 0],
                                        [30, 30, 0],
                        ],
        ],
        [
                        [
                                        [0, 0, 40],
                                        [40, 40, 40],
                                        [0, 0, 0],
                        ],
                        [
                                        [0, 40, 0],
                                        [0, 40, 0],
                                        [0, 40, 40],
                        ],
                        [
                                        [0, 0, 0],
                                        [40, 40, 40],
                                        [40, 0, 0],
                        ],
                        [
                                        [40, 40, 0],
                                        [0, 40, 0],
                                        [0, 40, 0],
                        ],
        ],
        [
                        [
                                        [0, 50, 0],
                                        [50, 50, 0],
                                        [50, 0, 0],
                        ],
                        [
                                        [50, 50, 0],
                                        [0, 50, 50],
                                        [0, 0, 0],
                        ],
                        [
                                        [0, 50, 0],
                                        [50, 50, 0],
                                        [50, 0, 0],
                        ],
                        [
                                        [50, 50, 0],
                                        [0, 50, 50],
                                        [0, 0, 0],
                        ],
        ],
        [
                        [
                                        [0, 60, 0],
                                        [0, 60, 60],
                                        [0, 0, 60],
                        ],
                        [
                                        [0, 0, 0],
                                        [0, 60, 60],
                                        [60, 60, 0],
                        ],
                        [
                                        [0, 60, 0],
                                        [0, 60, 60],
                                        [0, 0, 60],
                        ],
                        [
                                        [0, 0, 0],
                                        [0, 60, 60],
                                        [60, 60, 0],
                        ],
        ],
        [
                        [
                                        [0, 0, 0, 0],
                                        [70, 70, 70, 70],
                                        [0, 0, 0, 0],
                                        [0, 0, 0, 0],
                        ],
                        [
                                        [0, 70, 0, 0],
                                        [0, 70, 0, 0],
                                        [0, 70, 0, 0],
                                        [0, 70, 0, 0],
                        ],
                        [
                                        [0, 0, 0, 0],
                                        [70, 70, 70, 70],
                                        [0, 0, 0, 0],
                                        [0, 0, 0, 0],
                        ],
                        [
                                        [0, 70, 0, 0],
                                        [0, 70, 0, 0],
                                        [0, 70, 0, 0],
                                        [0, 70, 0, 0],
                        ],
        ],
];


let collBoard:Tetris = new Tetris(15,10);

class CTetris extends Tetris{



    constructor(cy:number, cx:number){
        // var bBlk = super(cy,cx);
        // var cBlk = super(cy,cx);

        super(cy,cx);
    }
    static init(setOfBlockArrays: number[][][][]){
        CTetris.nBlockTypes=setOfBlockArrays.length;
        CTetris.nBlockDegrees=setOfBlockArrays[0].length;
        CTetris.setOfBlockObjects=CTetris.createSetOfBlocks(setOfBlockArrays);
        // console.log(Tetris.setOfBlockObjects[0][0])
        // var cb:Matrix = this.setOfBlockObjects[0][0];
        // console.log(cb.print())
        CTetris.iScreenDw=CTetris.findLargestBlockSize(setOfBlockArrays);
    }

    deleteFullLines(screen:Matrix, blk:Matrix, top:number, dy:number, dx:number, dw:number){
        var line:Matrix; var zero:Matrix; var temp:Matrix;
        if(blk==null) {
            console.log("null blk")
            return screen;
        }
        var cy:number=0; var y:number=0; var nDeleted:number = 0;
        var nScanned:number = blk.get_dy();

        console.log("dfl in ct called")
        if(top+blk.get_dy()-1 >= dy)
            nScanned -= (top+blk.get_dy()-dy);
        zero=new Matrix(1,dx);
        for(y = nScanned-1; y>=0; y--){
            cy = top+y+nDeleted;
            line = screen.clip(cy,0,cy+1,screen.get_dx()).int2bool();
            line.print()


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
    accept(key:string){
        // this.state = super.accept(key)
        // collBoard.accept(key)



        // console.log("collboard state: "+this.state)
        // console.log("collBoard.oScreen ; ")
        // collBoard.drawMatrix(collBoard.get_oScreen())

        var tempBlk:Matrix = new Matrix(0,0);
        // console.log("collboard state: "+collBoard.state)
        if(collBoard.get_oScreen().anyGreaterThan(1) == true){
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
            this.oScreen.paste(this.iScreen,0,0);
        }

        //

        if(this.state==TetrisState.Running){

            this.state = collBoard.accept(key)
            // super.accept(key)
            if(collBoard.get_oScreen().anyGreaterThan(1) != true ){
                // this.iScreen.paste(this.oScreen,0,0)
                var tmp:Matrix = this.iScreen.clip(collBoard.get_top(),collBoard.get_left(),collBoard.get_top()+collBoard.currBlk.get_dy(),collBoard.get_left()+collBoard.currBlk.get_dx())


                tmp = tmp.add(CTetris.setOfBlockObjects[collBoard.idxBlockType!][collBoard.idxBlockDegree!])

                this.oScreen.paste(this.iScreen,0,0)
                this.oScreen.paste(tmp, collBoard.get_top(),collBoard.get_left())

                // console.log("test")
                // this.drawMatrix(this.get_oScreen())
            }
        }
        else if(this.state==TetrisState.NewBlock){
                console.log("=============")

                // collBoard.accept(key)
                this.oScreen = this.deleteFullLines(this.oScreen, collBoard.currBlk, collBoard.top, this.iScreenDy,this.iScreenDx,Tetris.iScreenDw)
                // console.log("dfTest")
                // this.drawMatrix(this.oScreen)
                // this.oScreen = this.deleteFullLines(this.oScreen, collBoard.currBlk, collBoard.top, this.iScreenDy,this.iScreenDx,Tetris.iScreenDw)
                this.state= collBoard.accept(key);console.log("bBlock this.state:"+this.state)

                // if(collBoard.get_oScreen().anyGreaterThan(1) != true ){
                //         this.accept(key)
                // }
                // this.drawMatrix(this.get_oScreen());
                if(collBoard.get_oScreen().anyGreaterThan(1) != true ){

                        this.iScreen.paste(this.oScreen,0,0)
                        console.log("this.iScreen:")
                        this.iScreen.print()
                        if(key=="s"||key=="_"){
                            var tmp:Matrix = this.iScreen.clip(collBoard.get_top(),collBoard.get_left(),collBoard.get_top()+collBoard.currBlk.get_dy(),collBoard.get_left()+collBoard.currBlk.get_dx())
                            tmp = tmp.add(CTetris.setOfBlockObjects[collBoard.idxBlockType!][collBoard.idxBlockDegree!])

                            this.oScreen.paste(this.iScreen,0,0)
                            this.oScreen.paste(tmp, collBoard.get_top(),collBoard.get_left())
                            
                            

                        }



                        // console.log("test")
                        // this.drawMatrix(this.get_oScreen())
                }

        }


        // this.drawMatrix(this.oScreen)
        // this.oScreen.print()
        console.log("collBoard oScreen:")
        collBoard.oScreen.print()
        // console.log("here+++++++++++")
        // this.oScreen.print()
  

        return this.state;
    }
   

    drawMatrix(oScreen: Matrix): void {
        var dy:number = oScreen.get_dy();
        var dx:number = oScreen.get_dx();
        var array:any[][] = oScreen.get_array();

        for(var y=0; y<dy; y++){
            var oArray:string[]=[];
            for(var x=0; x<dx; x++){

                // if(array[y][x]==0) oArray.push("□ ")
                // else if (array[y][x]==1)  oArray.push("■ ")
                switch(array[y][x]){
                    case 0: oArray.push("□ "); break;
                    case 1: oArray.push("■ ");break;
                    case 10: oArray.push("♠ ");break;
                    case 20: oArray.push("★ ");break;
                    case 30: oArray.push("● ");break;
                    case 40: oArray.push("◆ ");break;
                    case 50: oArray.push("▲ ");break;
                    case 60: oArray.push("♣ ");break;
                    case 70: oArray.push("♥ ");break;
                    default: oArray.push("■ ");break;

                }
            }
            //console.log("\n");
            // console.log(array[y]);
            console.log(oArray);


            //230327


        }
    }


}//end of CTetris


export default CTetris;