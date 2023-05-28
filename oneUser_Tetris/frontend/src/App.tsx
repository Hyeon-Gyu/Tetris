
//import React from 'react';
//import React, {Component, useState, useEffect} from 'react';
//import logo from './logo.svg';
import './App.css';
import "./screen.css";
import axios from 'axios';

//import { resolveTypeReferenceDirective } from 'typescript';

import React , {useState, useEffect} from 'react';



function Name(props: any): JSX.Element {
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

function printColor(value:number){
    switch(value){
        case 1:
            return 'black';
        case 0:
            return 'white';
        case 10:
            return 'pink';
        case 20:
            return 'green';
        case 30:
            return 'yellow';
        case 40:
            return 'red';
        case 50:
            return 'blue';
        case 60:
            return 'purple';
        case 70:
            return 'brown';
        }
}


function App() {
    const [showInput, setShowInput] = useState(true)
    const [keyPressed, setKeyPressed] = useState(true)
    const [screen, setScreen] = useState<number[][]>()


    const HandleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // if(event.key ==='a' || event.key === 's' || event.key === 'd' || event.key === 'w' || event.key === ' '){
        //     setBigger(true)
        // }
  
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
                console.log(data.playerBoard)
                if(data.msg === "game end" || data.msg === "game quit" || data.msg ==="error"){
                    alert(data.msg)
                    setShowInput(false)
                }
                setKeyPressed(false)
                // setBigger(false)
            })
    };
  
    useEffect(() => {
        if(!keyPressed){
            const interval = setInterval(() => {
            const data = { key: "s" };
            const url = "http://localhost:8080/tetris";
            axios
                .post(url, data, {
                headers: { "Content-type": "application/json" },
                })
                .then((response) => response.data)
                .then((data) => {
                setScreen(data.playerBoard);
                console.log(data.playerBoard);
                if (
                    data.msg === "game end" ||
                    data.msg === "game quit" ||
                    data.msg === "error"
                ) {
                    alert(data.msg);
                    setShowInput(false);
                }
                setKeyPressed(false);
                });
            }, 2000);
            
        return () => clearInterval(interval)};
      }, [keyPressed]);

    return (
        <>
            <h1><Name /></h1>
            {keyPressed && <h1>Press any key to start</h1>}
            <div className='gamescreen'>
                <div className='myScreen'>
                    {screen?.map((row, rowIndex) => (
                        <div key={rowIndex} style={ {display:'flex'}}>
                            {row.map( (col,colIndex) =>( 
                                <div key = {`${colIndex}-${rowIndex}`}
                                    className='block' 
                                    style={ {backgroundColor: printColor(col)}}
                            />
                            ))}    
                        </div>
                    ))}   
                </div>
                <div className='inputbox'>
                    {showInput && <input className='typing' type="text" onKeyDown={(event) => HandleKeyDown(event)} />}
                </div>
                <div>
                    <OppositeScreen />
                </div>
            </div>
        </>
    )

}

export default App;
