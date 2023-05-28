import { createYield } from "typescript";

class Matrix{
    private dy: number = 0;
    private dx: number = 0;
    public array: number[][] = [[]];
    get_dy(){return this.dy;}
    get_dx(){return this.dx;}

    get_array(){return this.array;}

    constructor();
    constructor(cy: number, cx: number);

    constructor(cy: number, cx: number, obj:any, a:any);

    constructor(cy?: number, cx?: number,obj?:any,  a?:any){
        if (cy && cx) {
            this.dy=cy;
            this.dx=cx;
            this.array = [[]];
            for (var i = 0; i < cy; i++) {
            this.array[i] = new Array<number>();
            for (var j = 0; j < cx; j++) {
                this.array[i][j] = 0;
            }
            }
        }

        if (obj != null) {
            this.dy=obj.dy;
            this.dx=obj.dx;
            this.array = [[]];

            for (var i = 0; i < obj.dy; i++) {
                this.array[i] = new Array<number>();
                for (var j = 0; j < obj.dx; j++) {
                this.array[i][j] = obj.array[i][j];
                }
            }


        }

        if(a!=null){
            this.dy=a.length;
            this.dx=a[0].length;
            this.array = [[]];
            for (var i = 0; i < this.dy; i++) {
                this.array[i] = new Array<number>();
                for (var j = 0; j < this.dx; j++) {
                    this.array[i][j] = a[i][j];
                }
            }
        }
    }


    clip(top:number, left:number, bottom:number, right:number){
        var cy = bottom - top;
        var cx = right - left;
        var temp:Matrix = new Matrix(cy,cx);
        // console.log("in clip, top"+top+"left"+left)

        for(var y=0; y<cy; y++){
            for(var x=0; x<cx; x++){
                if((top+y >= 0) && (left+x >= 0) &&	(top+y < this.dy) && (left+x < this.dx))
                    temp.array[y][x] = this.array[top+y][left+x];
                //else throw MatrixException("invalid matrix range")
            }
        }
        return temp
    }

    paste(obj:Matrix, top:number, left:number){
        // console.log("paste called. top:"+top+"left:"+left)
        for(var y = 0; y < obj.dy; y++)
            for(var x = 0; x < obj.dx; x++) {
                if((top+y >= 0) && (left+x >= 0) &&	(top+y < this.dy) && (left+x < this.dx))
                    this.array[y + top][x + left] = obj.array[y][x];

        }
    }

    add(obj: Matrix) {
        // console.log("add called")
        // if ((dx != obj.dx) || (dy != obj.dy))
        //     throw new MismatchedMatrixException("matrix sizes mismatch");
        var temp = new Matrix(this.dy, this.dx);
        for (var y = 0; y < obj.dy; y++)
            for (var x = 0; x < obj.dx; x++)
                temp.array[y][x] = Number(this.array[y][x]) + Number(obj.array[y][x]);


        return temp
    }

    sum(){
        var total:number = 0;
        for(var y=0; y<this.dy; y++){
            for(var x=0; x<this.dx; x++){
                total += Number(this.array[y][x]);
            }
        }
        return total
    }

    public anyGreaterThan(thold:number){
        for(var y=0; y<this.array.length; y++){
            for(var x = 0; x<this.array[0].length; x++){
                if(Number(this.array[y][x])>thold) return true;
            }
        }
        return false;
    }

    int2bool(){
        var temp:Matrix = new Matrix(this.dy, this.dx);
        var t_array:Array<Array<number>> = temp.get_array();
        for(var y=0; y<this.dy; y++){
            for(var x=0; x<this.dx; x++){
                t_array[y][x] = (this.array[y][x]!=0 ? 1:0);
            }
        }
        return temp
    }

    print(){
        for(var y=0; y<this.dy; y++){
            console.log(this.array[y]+"\n")

        }
    }

}

export default Matrix;