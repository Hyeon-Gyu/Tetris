package com.example.chat.model


import kotlin.Exception
import kotlin.IllegalArgumentException
import kotlin.jvm.Throws

class Matrix{
    fun get_nAlloc():Int{
        return nAlloc
    }
    fun get_nFree():Int{
        return nFree
    }

    private var dy = 0
    private var dx = 0
    private var array: Array<IntArray?>? = null
    fun get_dy():Int {return dy}
    fun get_dx():Int {return dx}
    fun get_array():Array<IntArray?>?{return array}
    companion object{
        var nAlloc : Int = 0
        var nFree : Int = 0
    }

    @Throws(MatrixException::class)
    private fun alloc(cy:Int, cx:Int) {
        if( cy<0 || cx<0)
            throw MatrixException("wrong matrix size")
        dy = cy
        dx = cx
        //print("dy = $dx dx = $dx")
        array = Array(dy) { IntArray(dx) }
        nAlloc++
    }
    @Throws(MatrixException::class)
    constructor(){
        alloc(0,0)
    }
    @Throws(MatrixException::class)
    constructor(cy:Int, cx:Int){
        alloc(cy,cx)
        for(y in 0 until dy)
            for(x in 0 until dx)
                array!![y]!![x] = 0
    }
    @Throws(MatrixException::class)
    constructor(obj:Matrix){
        alloc(obj.dy, obj.dx)
        for(y in 0 until dy)
            for(x in 0 until  dx)
                array!![y]!![x] = obj.array!![y]!![x]
    }
    @Throws(MatrixException::class)
    constructor(arr:Array<IntArray>){
        alloc(arr.size, arr[0].size)
        for(y in 0 until dy)
            for(x in 0 until  dx)
                array!![y]!![x] = arr!![y]!![x]
    }
    @Throws(MatrixException::class)
    fun clip(top:Int, left:Int, bottom:Int, right:Int):Matrix{
        var cy:Int = bottom - top
        var cx:Int = right - left
        var temp:Matrix = Matrix(cy,cx)
        for(y in 0 until cy)
            for(x in 0 until  cx)
                if( (top+y >= 0) && (left+x >= 0) && (top+y < dy) && (left+x < dx))
                    temp.array!![y]!![x] = array!![top+y]!![left+x]
                else
                    throw MatrixException("invalid matrix range")
        return temp
    }

    fun paste(obj:Matrix, top:Int, left:Int){
        for(y in 0 until  obj.get_dy())
            for(x in 0 until  obj.get_dx())
                if( (top+y >= 0) && (left+x >= 0) && (top+y < dy) && (left+x < dx))
                    array!![y+top]!![x+left] = obj.array!![y]!![x]
                else
                    throw MatrixException("invalid matrix range")
    }
    fun add(obj:Matrix) : Matrix{
        if( (dx != obj.dx) || (dy != obj.dy))
            throw MismatchedMatrixException("matrix size mismatch")
        var temp:Matrix = Matrix(dy,dx)
        for(y in 0 until  obj.dy)
            for(x in 0 until  obj.dx)
                temp.array!![y]!![x] = array!![y]!![x] + obj.array!![y]!![x]
        return temp;
    }
    fun sum():Int{
        var total:Int = 0
        for(y:Int in 0 until  dy)
            for(x:Int in 0 until  dx)
                total += array!![y]!![x]
        return total
    }

    fun mulc(coef:Int){
        for(y:Int in 0 until  dy)
            for(x:Int in 0 until  dx)
                array!![y]!![x] = coef * array!![y]!![x]
    }
    open fun int2bool():Matrix{
        var temp:Matrix = Matrix(dy,dx)
        var t_array: Array<IntArray?>? = temp.get_array()
        for(y:Int in 0 until  dy)
            for(x:Int in 0 until  dx)
                if(array!![y]!![x] == 0)
                    t_array!![y]!![x] = 0
                else
                    t_array!![y]!![x] = 1
        return temp
    }

    fun anyGreaterThan(value:Int) :Boolean{
        for(y in 0 until  array!!.size)
            for(x in 0 until array!![0]!!.size)
                if(array!![y]!![x] > value)
                    return true
        return false
    }
    fun print(){
        //print("Matrix( $dy , $dx)")
        for(y in 0 until dy) {
            for (x in 0 until dx) {
                print(array!![y]!![x].toString() + " ")
            }
            println()
        }
    }

}

//예외처리 그대로
open class MatrixException : Exception {
    constructor() : super("Matrix Exception")
    constructor(msg:String?) : super(msg)
}

class MismatchedMatrixException : MatrixException {
    constructor() : super("Mismatched Matrix Exception")
    constructor(msg:String?) : super(msg)
}