//import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {Tetris, TetrisState} from './Tetris';
//import Matrix from './Matrix';
import React, {  useState } from 'react';
import { CTetris } from './CTetris';
//입력 받는 getkey는 여기에 있어야 실행이 된다.
//프론트에는 input 박스 하나만 만들어놓고 콘솔에 찍자.

let setOfBlockArrays:number[][][][] = [
  [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
  ],
  [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ],
  [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ]
  ],
  [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ]
  ],
  [
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  ],
  [
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ]  
  ],
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ]
  ]
]


let state:TetrisState = TetrisState.BeforeStart;
Tetris.init(setOfBlockArrays);
let board:Tetris = new CTetris(15,10);
let random:number= Math.floor(Math.random() * 7);
state = board.accept(random.toString());
board.printScreen();

function App() {
  const [showInput, setShowInput] = useState(true);
  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    let key = event.key;
    if(key === "q"){
      console.log("game quit");
      alert("game quit")
      setShowInput(false);
    }
    state = board.accept(key);
    board.printScreen();
    if(state === TetrisState.NewBlock){
      key = (Math.floor(Math.random() * 7)).toString();
      state = board.accept(key);
      board.printScreen();
      if(state === TetrisState.Finished){
        console.log("game over");
        alert("game over")
        setShowInput(false);    
      }
    }  
  }
  return (
    <div>
      <h1>tetris</h1>
      {showInput && <input type = "text" onKeyDown={handleKeyDown}></input>}
    </div>
  )
}


export default App;
