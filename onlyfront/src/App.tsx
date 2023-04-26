import {TetrisState} from './Tetris';
import React, {  useState, useEffect } from 'react';
import { CTetris } from './CTetris';
import { setOfBlockArrays } from './setOfBlockArrays';
import "./screen.css";



function Name(props: any) {
  return (
      <div className="name">
          <h1>2인용 컬러 테트리스</h1>
      </div>
  )
}

function OppositeScreen(props: any) {
  return (
      <div className="OppositeScreen">
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

let state:TetrisState = TetrisState.BeforeStart;
CTetris.init(setOfBlockArrays);
let board:CTetris= new CTetris(15,10);
let random:number= Math.floor(Math.random() * 7);
state = board.accept(random.toString());
board.printScreen()


function App() {
    const [showInput, setShowInput] = useState(true)
    const [keyPressed, setKeyPressed] = useState(true)
    const [screen, setScreen] = useState<number[][]>();

    //setScreen(board.oScreen.get_array)

    const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
        setKeyPressed(false)
        let key = event.key
        console.log(event.key)
        if(key === "q"){
          console.log("game quit")
          alert("game quit")
          setShowInput(false)
        }
        state = board.accept(key)
        board.printScreen();
        setScreen(board.oScreen.get_array())
        if(state === TetrisState.NewBlock){
          key = (Math.floor(Math.random() * 7)).toString();
          state = board.accept(key)
          board.printScreen()
          setScreen(board.oScreen.get_array())
          if(state === TetrisState.Finished){
            console.log("game over")
            alert("game over")
            setShowInput(false)  
          }
        }
    }
    
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
                    {showInput && <input className='typing' type="text" onKeyDown={(event) => handleKeyDown(event)} />}
                </div>
                <div>
                    <OppositeScreen />
                </div>
            </div>
        </>
    )

}


export default App;
