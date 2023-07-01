


class Matrix{
    private static nAlloc:number = 0;
    private static nFree:number = 0;
    private dy:number = 0;
    private dx:number = 0;
    private array:number[][] = []; 

    public get_nAlloc():number {
        return Matrix.nAlloc;
    }
    public get_nFree():number{
        return Matrix.nFree;
    }

    public get_dy():number{
        return this.dy;
    }
    public get_dx():number{
        return this.dx;
    }
    public get_array():number[][]{
        return this.array;
    }

    constructor();
    constructor(cy:number,cx:number);
    constructor(obj:Matrix);
    constructor(arr:number[][]);
    constructor(...args:any[]){
        if(args.length === 0){
            this.alloc(0,0)
        }
        else if(args.length === 2){
            this.alloc(args[0],args[1]) 
        }
        else if(args.length === 1 && Array.isArray(args[0])){
            let arr = args[0];
            this.alloc(arr.length, arr[0].length)
            for(let y = 0; y < this.dy; y++){
                for(let x = 0; x < this.dx; x++){
                    this.array[y][x] = arr[y][x];
                }
            }
        }
        else if(args.length === 1 && typeof args[0] === 'object'){
            let obj = args[0];
            this.alloc(obj.dy, obj.dx);
            for(let y = 0; y < this.dy; y++){
                for(let x = 0; x < this.dx; x++){
                    this.array[y][x] = obj.array[y][x];
                }
            }
        }else{
            throw new MatrixException("invalid constructor argument")
        }
    }
    private alloc(cy:number, cx:number){
        if(cy < 0 || cx < 0){
            console.log("wrong matrix size")
        }
        this.dy = cy;
        this.dx = cx;
        this.array = new Array(cy);
        for(var y = 0; y < cy; y++){
            this.array[y] = new Array(cx).fill(0);
        }
        Matrix.nAlloc++;
    }

    clip(top:number, left:number, bottom:number, right:number):Matrix{
        let cy:number = bottom - top;
        let cx:number = right - left
        var temp:Matrix = new Matrix(cy,cx)
        for(var y = 0; y < cy; y++){
            for(var x = 0; x < cx; x++){
                if(top + y >= 0 && left + x >= 0 && top + y < this.dy && left + x < this.dx) {
                    temp.array[y][x] = this.array[top + y][left + x];
                }else{
                    console.log("invalid matrix range");
                }
            }      
        }
        //console.log("clip done")
        return temp;
    }

    add(obj:Matrix):Matrix{
        if ((this.dy !== obj.dy) || (this.dx !== obj.dx))
            console.log("matrix size mismatch")
        var temp:Matrix = new Matrix(this.dy,this.dx);
        for(var y = 0; y < obj.dy; y++){
            for(var x = 0; x < obj.dx; x++){
              temp.array[y][x] = this.array[y][x] + obj.array[y][x] ; 
            }
        }
        //console.log("add done")
        return temp;    
    }   
    paste(obj:Matrix, top:number, left:number){
        //var cy = obj.dy;
        //var cx = obj.dx;
        for(var y = 0; y < obj.dy; y++){
            for(var x = 0; x < obj.dx; x++){
                if(top + y >= 0 && left + x >= 0 && top + y < this.dy && left + x < this.dx) 
                    this.array[y+top][x+left] = obj.array[y][x];
                else
                    console.log("invalid matrix range");
            }
        }
        //console.log("paste done")
    }
    sum():number{
        var total = 0;
        for(var y = 0; y < this.dy; y++){
            for(var x = 0; x < this.dx; x++){
                total += this.array[y][x];
            }
        }
        return total;
    }
    int2bool():Matrix{
        var dupli = new Matrix(this.dy,this.dx);
        var arr = dupli.get_array();
        for(var y = 0; y < this.dy; y++){
            for(var x = 0; x < this.dx; x++){
                arr[y][x] = (this.array[y][x] !== 0 ? 1 : 0)
            }
        }
        return dupli;
    }
    public anyGreaterThan(val: number): boolean {
        for (var y = 0; y < this.array.length; y++) {
            for (var x = 0; x < this.array[0].length; x++) {
                if (this.array[y][x] > val) {
                    return true;
                }
            }
        }
        return false;
    }
    public print(): void {
        console.log(`shape of Matrix ${this.dy}x${this.dx}`);
        for (var y = 0; y < this.dy; y++) {
            for (var x = 0; x < this.dx; x++) {
                console.log(this.array[y][x]+" ");
            }
        }
    }

}

export default Matrix;

class MatrixException extends Error{
    constructor(msg?:string){
        super(msg || "Matrix Exception")
    }
}

