//import React from 'react';
//import React, {Component, useState, useEffect} from 'react';
//import logo from './logo.svg';
import './App.css';
import "./screen.css";
import axios from 'axios';
import { resolveTypeReferenceDirective } from 'typescript';

import React , { useEffect, useState } from 'react';

function Name(props: any) {
    return (
        <div className="name">
            <h1>2인용 컬러 테트리스</h1>
        </div>
    )
}

function OppositeScreen(props: any) {
    return (
        <div className="oppositeScreen">
            <h1>상대 테트리스</h1>
        </div>
    )
}


function App() {
    const [showInput, setShowInput] = useState(true)
    const [screen, setScreen] = useState<number[][]>()
    const HandleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        //const updateKey = () => setKey(event.key)
        console.log(event.key); //f12 콘솔창에 띄우기
        const data = { 'key': event.key }; //json타입
        const url = "http://localhost:8080/tetris";
        console.log(data)
        axios.post(url, data, {
            headers: { 'Content-type': 'application/json' }
        })
            .then((response) => response.data)
            .then((data) => {
                setScreen(data.playerBoard)
                console.log(data.msg)
                if(data.msg === "game end" || data.msg === "game quit"){
                    alert(data.msg)
                    setShowInput(false)
                }
            })
    };
    return (
        <>
            <h1><Name /></h1>
            <div className='game-screen'>
                <div className='myScreen'>
                    {screen?.map((column, i) => {
                        return <div key={i}>{
                            column.map( (cell,j) => {
                                const color = cell === 1? 'black' : 'white'
                                return <div key = {`${i}-${j}`}className='block' style={ {backgroundColor: color}}/>
                            })
                        }</div>
                    })}   
                </div>
                {showInput && <input className='typing' type="text" onKeyDown={(event) => HandleKeyDown(event)} />}
                <OppositeScreen />
            </div>
        </>
    )

}

export default App;

