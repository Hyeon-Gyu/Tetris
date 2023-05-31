import React, { ChangeEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import Matrix from "./Matrix"
import { Tetris, TetrisState, } from "./Tetris"
import CTetris from './CTetris';
import { useState, useEffect } from 'react';
import { paste } from '@testing-library/user-event/dist/paste';
import { Script } from 'vm';

import Display from './Display'
import { BlockList } from 'net';


import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Client, Message, Stomp } from '@stomp/stompjs';

export var randnum: number|undefined
// var m1:Matrix = new Matrix(4,4)
// m1.print()

// var arr1:number[][]= [[1,0,0,0],[1,1,0,0],[1,1,1,0],[1,1,1,1]]
// var m2:Matrix = new Matrix(0,0,null,arr1)
// m2.print()

let setOfBlockArrays: number[][][][] = [
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
                ]
        ],
        [
                [
                        [0, 1, 0],
                        [1, 1, 1],
                        [0, 0, 0],
                ],
                [
                        [0, 1, 0],
                        [0, 1, 1],
                        [0, 1, 0],
                ],
                [
                        [0, 0, 0],
                        [1, 1, 1],
                        [0, 1, 0],
                ],
                [
                        [0, 1, 0],
                        [1, 1, 0],
                        [0, 1, 0],
                ],
        ],
        [
                [
                        [1, 0, 0],
                        [1, 1, 1],
                        [0, 0, 0],
                ],
                [
                        [0, 1, 1],
                        [0, 1, 0],
                        [0, 1, 0],
                ],
                [
                        [0, 0, 0],
                        [1, 1, 1],
                        [0, 0, 1],
                ],
                [
                        [0, 1, 0],
                        [0, 1, 0],
                        [1, 1, 0],
                ],
        ],
        [
                [
                        [0, 0, 1],
                        [1, 1, 1],
                        [0, 0, 0],
                ],
                [
                        [0, 1, 0],
                        [0, 1, 0],
                        [0, 1, 1],
                ],
                [
                        [0, 0, 0],
                        [1, 1, 1],
                        [1, 0, 0],
                ],
                [
                        [1, 1, 0],
                        [0, 1, 0],
                        [0, 1, 0],
                ],
        ],
        [
                [
                        [0, 1, 0],
                        [1, 1, 0],
                        [1, 0, 0],
                ],
                [
                        [1, 1, 0],
                        [0, 1, 1],
                        [0, 0, 0],
                ],
                [
                        [0, 1, 0],
                        [1, 1, 0],
                        [1, 0, 0],
                ],
                [
                        [1, 1, 0],
                        [0, 1, 1],
                        [0, 0, 0],
                ],
        ],
        [
                [
                        [0, 1, 0],
                        [0, 1, 1],
                        [0, 0, 1],
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
                ],
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
                ],
        ],
]

let setOfColorBlockArrays: number[][][][] = [ // [7][4][?][?]
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
Tetris.init(setOfBlockArrays);
CTetris.init(setOfColorBlockArrays);
console.log("rendered")

var stompClient: StompJs.CompatClient | null = null;
// var socket = new SockJS('/websocket')

// var let cBoard: CTetris = new CTetris(15, 10);
var state!: TetrisState;

var cBoard :CTetris | undefined ;
var state!: TetrisState;


const map = new Map<string, CTetris>();

// state = TetrisState.NewBlock

function App() {

        
        ///


        const [userkey, setKey] = useState('');
        const [incoming, setIncoming] = useState(0)
        const detectIncoming = () => setIncoming(incoming + 1);
        const [username, setName] = useState('');

        var userkey2:string|undefined;
        enum MessageType {
                CHAT, LEAVE, JOIN
        }

        const onChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
                console.log("nownow",cBoard!.idxBlockType!)
                // console.log(e.target.value)

                console.log("keyIn:" + e.target.value[e.target.value.length - 1])
                username2=e.target.value[e.target.value.length - 1]
                if (e.target.value[e.target.value.length - 1] == " ") {

                

                        setKey("_")//스페이스바는 백에서 _로 매핑되어 동작
                        detectIncoming()
                }
                else {

                        setKey(e.target.value[e.target.value.length - 1])
                        detectIncoming()
                }
        
                e.preventDefault();

                

                // return () => {
                //         if (socket.readyState === 1) { // <-- This is important
                //             socket.close();
                //         }
                //     };
               
        };


        
        /////////////////////////////////////////
        let blkList: any = [[]]
        useEffect(() => {
                if (userkey != "q" && typeof cBoard != 'undefined') {

                        state = cBoard.accept(userkey)

                        console.log("cBoard.oScreen ;")
                        cBoard.drawMatrix(cBoard.oScreen)
                        // cBoard.oScreen.print()
                        if(state == TetrisState.NewBlock){

                                

                                console.log("cBoard.oScreen ;")
                                cBoard.drawMatrix(cBoard.oScreen)
        
                                randnum = Math.floor(Math.random() * 8);
                                state = cBoard.accept(randnum.toString())

                                
                                console.log("key to send:", userkey)
                                console.log("idxBT to send:",randnum)
                                var chatMessage2 = {
                                        sender: username,
                                        content: userkey,
                                        key : userkey,
                                        idxBT : randnum,
                        
                                };
                                
                                stompClient!.send("/app/chat.send", {},JSON.stringify(chatMessage2))
                        }
                        else if (state == TetrisState.Running){
                                console.log("key to send:", userkey)

                                var chatMessage = {
                                        sender: username,
                                        content: userkey2,
                                        key : userkey,
                       
                                };
                                
                                stompClient!.send("/app/chat.send", {},JSON.stringify(chatMessage))
                        }

                        // state = cBoard.accept(userkey)

                        // console.log("cBoard.oScreen ;")
                        // cBoard.drawMatrix(cBoard.oScreen)

                        // randnum=0;
                        // console.log("key to send:", userkey)
                        // console.log("idxBT to send:",randnum)
                        // var chatMessage2 = {
                        //         sender: username,
                        //         content: userkey,
                        //         key : userkey,
                        //         idxBT : randnum,
                
                        // };
                        
                        // stompClient!.send("/app/chat.send", {},JSON.stringify(chatMessage2))

                }

        }, [incoming])//incoming 변화 감지해서 동기적으로 fetch



        if(typeof cBoard != 'undefined'){
                const outputDisplay = cBoard.oScreen.get_array()

                //blkList = outputDisplay[0].map((blk)=>(<Display blk={blk}/>))

                for (var i = 0; i < 19; i++) {
                 blkList[i] = outputDisplay[i].map((blk) => (<Display blk={blk} />))
                }
        }
        // console.log("here!!!!!!!")
        // console.log(outputDisplay)
        // console.log(blkList)

        var username2:string|undefined;
        const getUserName = (e: any) => {
                e.preventDefault() 
                console.log('getusernamecalled')
                console.log("username:",e.target.namefield.value)

                setName(e.target.namefield.value)
                username2 = e.target.namefield.value
                // console.log(username.value)
                // cBoard= new CTetris(15, 10);
                
                // var state!: TetrisState;
                
                // state = cBoard.accept("asdf")
                console.log("state:",state)//
                console.log("randInt:",randnum)

                console.log("cBoard.oScreen ;")
                // cBoard.drawMatrix(cBoard.oScreen)

                
                // console.log(username)
                // const payload = {
                //         sender: username,
                //         key: userkey,
                //         type:"JOIN",
        
                // };

                var socket = new SockJS('/websocket')
                console.log("sock:",socket)
                // stompClient = Stomp.over(() => new SockJS('/websocket'));
                stompClient = Stomp.over(socket)
                stompClient.activate()
                e.preventDefault();
                stompClient.connect({}, onConnected);
                return () => {
                        if (socket.readyState === 1) { // <-- This is important
                            socket.close();
                        }
                    };

                

        };
        function onConnected(){
                console.log("inside onConnected()")
                console.log("username to be send:",username2)
                stompClient!.subscribe('/topic/public',onMessageReceived);
                randnum = Math.floor(Math.random() * 8);
                console.log(randnum)

                cBoard= new CTetris(15, 10);
                map.set(username2!!,cBoard) //추가

                var state!: TetrisState;
                
                state = cBoard.accept(randnum.toString())


                // Tell your username to the server
                stompClient!.send("/app/chat.register",
                        {},
                        JSON.stringify({sender: username2, key:randnum, idxBT:randnum, type: 'JOIN'})
                )
        }


        
        
            
            
        function onMessageReceived(payload: { body: string; }) {
        var message = JSON.parse(payload.body);
        //console.log("hellllllllllllllllllllllllllllllllllllllllllll")
        //이름 따오고, 키 따와서 map에서 객체 꺼내와서 돌리기.
        if(username2 == message.sender){
                console.log("username",username2);
                console.log(message.sender);
                return;
        }
        console.log("username:",username2);
        
        var user = message.sender;
        console.log("message sender",user);
        var key = message.key;
        var board = map.get(user)
        /*if(!!board.valid){
                console.log("already game over")
                exit();
        }
        */
        var state = board?.state;
        switch(state){
                case TetrisState.Finished:
                        console.log(board);
                        map.set(user,board!!);
                        break;
                case TetrisState.Running:
                        if(key == 'q'){
                                console.log(board);
                                board!!.state = TetrisState.Finished;
                                //board.valid = 0 
                                map.set(user,board!!);
                                break;
                                //exit() 어캐 종료시키누..
                        }
                        board!!.state = board!!.accept(key);
                        console.log(board);

                        if(message.idxBT != null && board!!.state == TetrisState.NewBlock){
                                board!!.state = board!!.accept(message.idxBT);
                                console.log(board);
                                if(board!!.state == TetrisState.Finished){
                                        map.set(user,board!!);
                                        //exit() 끝내는거 모름
                                        break;
                                }
                        }
                        break;
                        //곧장 newblock 케이스로 내려와서 로직 시작
                        //(state가 newblock이 아니면 조건문 안거치고 exit하면 됨)
                case TetrisState.NewBlock:
                        if(message.idxBT != null && board!!.state == TetrisState.NewBlock){
                                board!!.state = board!!.accept(message.idxBT);
                                console.log(board);
                                if(board!!.state == TetrisState.Finished){
                                        map.set(user,board!!);
                                        //exit() 끝내는거 모름
                                        break;
                                }
                        }
                        break;
                default:
                        console.log("wrong key");
                        //exit();
                        break;



        }


        // if(message.playerBoard){
        //         var Board = message.playerBoard;
        //         console.log(Board);
        // }
        // var messageElement = document.createElement('li');
        
        // if(message.type === 'JOIN') {
        //         messageElement.classList.add('event-message');
        //         message.content = message.sender + ' joined!';
        // } else if (message.type === 'LEAVE') {
        //         messageElement.classList.add('event-message');
        //         message.content = message.sender + ' left!';
        // } else {
        //         messageElement.classList.add('chat-message');
        
        //         var avatarElement = document.createElement('i');
        //         var avatarText = document.createTextNode(message.sender[0]);
        //         avatarElement.appendChild(avatarText);

        
        //         messageElement.appendChild(avatarElement);
        
        //         var usernameElement = document.createElement('span');
        //         var usernameText = document.createTextNode(message.sender);
        //         usernameElement.appendChild(usernameText);
        //         messageElement.appendChild(usernameElement);
        // }
        
        // var textElement = document.createElement('p');
        // var messageText = document.createTextNode(message.content);
        // textElement.appendChild(messageText);
        
        // messageElement.appendChild(textElement);

        }
        //username으로 useeffect?

        return (
                <>      
                        <form onSubmit={getUserName}>
                                <label>
                                Name:
                                <input type="text" name='namefield' />
                                </label>
                                <input type="submit" value="Submit" />
                        </form>
                        


                        <input onChange={onChangeKey}></input>
                       
                        <br></br>
                        userName:{username}

                        keyIn:{userkey}

                        <p>Display 불리는곳</p>
                        <div>{blkList[0]}</div>
                        <div>{blkList[1]}</div>
                        <div>{blkList[2]}</div>
                        <div>{blkList[3]}</div>
                        <div>{blkList[4]}</div>
                        <div>{blkList[5]}</div>
                        <div>{blkList[6]}</div>
                        <div>{blkList[7]}</div>
                        <div>{blkList[8]}</div>
                        <div>{blkList[9]}</div>
                        <div>{blkList[10]}</div>
                        <div>{blkList[11]}</div>
                        <div>{blkList[12]}</div>
                        <div>{blkList[13]}</div>
                        <div>{blkList[14]}</div>
                        <div>{blkList[15]}</div>
                        <div>{blkList[16]}</div>
                        <div>{blkList[17]}</div>
                        <div>{blkList[18]}</div>



                </>
        );
}

export default App;
