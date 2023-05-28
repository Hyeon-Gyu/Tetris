package com.example.chat.model


object blockarray {
    var Finished = TetrisState.Finished
    var NewBlock = TetrisState.NewBlock
    var Running = TetrisState.Running

    val arrayA_1 = arrayOf(intArrayOf(1,1), intArrayOf(1,1))
    val arrayA_2 = arrayOf(intArrayOf(1,1), intArrayOf(1,1))
    val arrayA_3 = arrayOf(intArrayOf(1,1), intArrayOf(1,1))
    val arrayA_4 = arrayOf(intArrayOf(1,1), intArrayOf(1,1))

    val arrayB_1 = arrayOf(intArrayOf(0,1,0), intArrayOf(1,1,1), intArrayOf(0,0,0))
    val arrayB_2 = arrayOf(intArrayOf(0,1,0), intArrayOf(0,1,1), intArrayOf(0,1,0))
    val arrayB_3 = arrayOf(intArrayOf(0,0,0), intArrayOf(1,1,1), intArrayOf(0,1,0))
    val arrayB_4 = arrayOf(intArrayOf(0,1,0), intArrayOf(1,1,0), intArrayOf(0,1,0))

    val arrayC_1 = arrayOf(intArrayOf(1,0,0), intArrayOf(1,1,1), intArrayOf(0,0,0))
    val arrayC_2 = arrayOf(intArrayOf(0,1,1), intArrayOf(0,1,0), intArrayOf(0,1,0))
    val arrayC_3 = arrayOf(intArrayOf(0,0,0), intArrayOf(1,1,1), intArrayOf(0,0,1))
    val arrayC_4 = arrayOf(intArrayOf(0,1,0), intArrayOf(0,1,0), intArrayOf(1,1,0))

    val arrayD_1 = arrayOf(intArrayOf(0,0,1), intArrayOf(1,1,1), intArrayOf(0,0,0))
    val arrayD_2 = arrayOf(intArrayOf(0,1,0), intArrayOf(0,1,0), intArrayOf(0,1,1))
    val arrayD_3 = arrayOf(intArrayOf(0,0,0), intArrayOf(1,1,1), intArrayOf(1,0,0))
    val arrayD_4 = arrayOf(intArrayOf(1,1,0), intArrayOf(0,1,0), intArrayOf(0,1,0))

    val arrayE_1 = arrayOf(intArrayOf(0,1,0), intArrayOf(1,1,0), intArrayOf(1,0,0))
    val arrayE_2 = arrayOf(intArrayOf(1,1,0), intArrayOf(0,1,1), intArrayOf(0,0,0))
    val arrayE_3 = arrayOf(intArrayOf(0,1,0), intArrayOf(1,1,0), intArrayOf(1,0,0))
    val arrayE_4 = arrayOf(intArrayOf(1,1,0), intArrayOf(0,1,1), intArrayOf(0,0,0))

    val arrayF_1 = arrayOf(intArrayOf(0,1,0), intArrayOf(0,1,1), intArrayOf(0,0,1))
    val arrayF_2 = arrayOf(intArrayOf(0,0,0), intArrayOf(0,1,1), intArrayOf(1,1,0))
    val arrayF_3 = arrayOf(intArrayOf(0,1,0), intArrayOf(0,1,1), intArrayOf(0,0,1))
    val arrayF_4 = arrayOf(intArrayOf(0,0,0), intArrayOf(0,1,1), intArrayOf(1,1,0))

    val arrayG_1 = arrayOf(intArrayOf(0,0,0,0), intArrayOf(1,1,1,1), intArrayOf(0,0,0,0), intArrayOf(0,0,0,0))
    val arrayG_2 = arrayOf(intArrayOf(0,1,0,0), intArrayOf(0,1,0,0), intArrayOf(0,1,0,0), intArrayOf(0,1,0,0))
    val arrayG_3 = arrayOf(intArrayOf(0,0,0,0), intArrayOf(1,1,1,1), intArrayOf(0,0,0,0), intArrayOf(0,0,0,0))
    val arrayG_4 = arrayOf(intArrayOf(0,1,0,0), intArrayOf(0,1,0,0), intArrayOf(0,1,0,0), intArrayOf(0,1,0,0))

    val arrayBigA = arrayOf(arrayA_1, arrayA_2, arrayA_3, arrayA_4)
    val arrayBigB = arrayOf(arrayB_1, arrayB_2, arrayB_3, arrayB_4)
    val arrayBigC = arrayOf(arrayC_1, arrayC_2, arrayC_3, arrayC_4)
    val arrayBigD = arrayOf(arrayD_1, arrayD_2, arrayD_3, arrayD_4)
    val arrayBigE = arrayOf(arrayE_1, arrayE_2, arrayE_3, arrayE_4)
    val arrayBigF = arrayOf(arrayF_1, arrayF_2, arrayF_3, arrayF_4)
    val arrayBigG = arrayOf(arrayG_1, arrayG_2, arrayG_3, arrayG_4)

    val setOfBlockArrays:Array<Array<Array<IntArray>>> = arrayOf(
        arrayBigA, arrayBigB, arrayBigC, arrayBigD, arrayBigE, arrayBigF, arrayBigG
    )
}