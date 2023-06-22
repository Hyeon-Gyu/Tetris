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

// var state!: TetrisState;

var map: Map<string, CTetris> = new Map();
var cBoard :CTetris | undefined ;

function App() {
       
        const [userkey, setKey] = useState('');
        const [incoming, setIncoming] = useState(0)
        const [username, setName] = useState('');
        const [screen, setScreen] = useState<Matrix>();

        const detectIncoming = () => setIncoming(incoming + 1);

        var userkey2:string|undefined;
        enum MessageType {
                CHAT, LEAVE, JOIN
        }

        const onChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
                console.log("nownow",cBoard!.idxBlockType!)
                console.log("keyIn:" + e.target.value[e.target.value.length - 1])

                if (e.target.value[e.target.value.length - 1] == " ") {
                        setKey("_")//스페이스바는 백에서 _로 매핑되어 동작
                        detectIncoming()
                }
                else {
                        setKey(e.target.value[e.target.value.length - 1])
                        detectIncoming()
                }
                e.preventDefault();
        };



        let blkList: any = [[]]
        useEffect(() => {
                if (userkey != "q" && typeof cBoard != 'undefined' && cBoard.state != TetrisState.Finished) {

                        cBoard.state = cBoard.accept(userkey)//클라이언트의 로직 실행
                        setScreen(cBoard.oScreen);//
                        console.log("cBoard.oScreen ;")
                        cBoard.drawMatrix(cBoard.oScreen)

                        if(cBoard.state == TetrisState.NewBlock){//새로운 블록 생성시
   
                                var randnum = Math.floor(Math.random() * 8);//클라이언트가 랜덤넘버 생성
                                cBoard.state = cBoard.accept(randnum.toString())//클라이언트의 로직 실행
                                cBoard.drawMatrix(cBoard.oScreen)
                                setScreen(cBoard.oScreen);

                                console.log("key to send:", userkey)
                                console.log("idxBT to send:",randnum)
                                var chatMessage2 = {//서버에게 보낼 메시지
                                        sender: username,//서버가 유저 판단하는 데 사용
                                        content: userkey,
                                        key : userkey,
                                        idxBT : randnum,//클라이언트가 생성한 랜덤넘버 보냄
                        
                                };
                                console.log(cBoard)
                                stompClient!.send("/app/chat.send", {},JSON.stringify(chatMessage2))//컨트롤러의 chat.send로 매핑
                        }
                        else if (cBoard.state == TetrisState.Running){//이름과 키만 보내면 되는 상황
                                console.log("key to send:", userkey)
                                setScreen(cBoard.oScreen);
                                //accept 로직은 조건문 바깥에서 실행되었습니다.

                                var chatMessage = {//서버에게 보낼 메시지
                                        sender: username,
                                        content: userkey2,
                                        key : userkey,
                                };
                                stompClient!.send("/app/chat.send", {},JSON.stringify(chatMessage))
                        }
                }
                if (userkey == 'q'){
                        cBoard!.state = TetrisState.Finished
                        var chatMessageQuit = {//서버에게 보낼 메시지
                                sender: username,
                                content: userkey,
                                key : userkey,
                        };
                        stompClient!.send("/app/chat.send", {},JSON.stringify(chatMessageQuit))
                }
        }, [incoming])//incoming 변화 감지해서 동기적으로 fetch



        if(typeof cBoard != 'undefined'){
                const outputDisplay = screen!.get_array()
                for (var i = 0; i < 19; i++) {
                 blkList[i] = outputDisplay[i].map((blk) => (<Display blk={blk} />))
                }
        }

        var username2:string|undefined;
        const getUserName = (e: any) => {
                e.preventDefault() 
                console.log('getusernamecalled')
                console.log("username:",e.target.namefield.value)

                setName(e.target.namefield.value)
                username2 = e.target.namefield.value


                var socket = new SockJS('/websocket')
                console.log("sock:",socket)
                stompClient = Stomp.over(socket)
                stompClient.activate()//소켓 연결 활성화

                e.preventDefault();

                stompClient.connect({}, onConnected); // onConnected 함수 호출
                return () => {
                        if (socket.readyState === 1) { // 소켓이 바로 닫히는 문제 해결
                            socket.close();
                        }
                    };

                

        };
        function onConnected(){
                console.log("inside onConnected()")
                console.log("username to be send:",username2)//state로 초기화하는 변수인 username썼더니 null exception떠서 새로만든변수
                stompClient!.subscribe('/topic/public',onMessageReceived);//메시지를 받으면 onMessageReceived호출
                stompClient!.subscribe('/topic/prevuser',getPrevUsers);
                var randnum = Math.floor(Math.random() * 7);//클라이언트에서 랜덤넘버 생성
                console.log(randnum)

                cBoard= new CTetris(15, 10);//클라이언트의 보드 생성 //전역변수로 설정되어있음 //본인 보드는 map 구조로 관리하는게 아니라 그냥 따로 존재한다
                console.log("state(Newblock,1):",cBoard.state)


                cBoard.state = cBoard.accept(randnum.toString())//클라이언트의 로직 시행
                console.log("state(Running,0)", cBoard.state)

                map.set(username2!,cBoard) //클라이언트의 (유저-보드) 저장소
                console.log("----this is",username2,"'s board");
                console.log(cBoard.oScreen); // 이게 빈보드야 왜
                console.log(map.get(username2!))// 이게 왜 빈보드냐고
                setScreen(cBoard.oScreen);
                
                // Tell your username to the server
                stompClient!.send("/app/chat.register",//서버에서 (유저-보드) 객체 생성하는 컨트롤러 주소
                        {},
                        JSON.stringify({sender: username2, key:randnum, idxBT:randnum, type: 'JOIN'})
                        // 서버로 랜덤 넘버 포함해서 전송
                )
        }


        
        function getPrevUsers(payload: { body: string; }){

                var message = JSON.parse(payload.body);
                
                //b가 a를 얻는 코드
                const mapIterator2 = Array.from(Object.keys(message.oneTimeUseMap)) // 서버에 저장되어있는 키 값들을 추출
                const mapIterator = Array.from(map.keys())
                mapIterator2.filter(
                        function(x) {
                                return !mapIterator.includes(x)
                        }
                ).forEach(
                        function(x) {
                                var board:CTetris = new CTetris(15,10)
                               
                                board.state = board.accept(message.oneTimeUseMap[x])

                                console.log("user: ",x)
                                console.log("randnum:",message.oneTimeUseMap[x])
                                map.set(x,board)
                                console.log("=============    +++++++++++++")
                                console.log(map.get(x))
                                console.log(board.oScreen)
                        }
                )
                
                console.log("msg sender :" ,message.sender)
                console.log(map.get(message.sender))
                
               
        }
            
            
        function onMessageReceived(payload: { body: string; }) {
                var message = JSON.parse(payload.body);
                console.log(message)
                var user:string = message.sender;
                var key = message.key;
                if(username2 == message.sender){ //본인은 서버에서 온 message를 수신할 필요가 없음 (이미 useeffect로 로직은 돌아간 상태)
                        console.log("username",username2);
                        console.log("message.sender:",message.sender);
                        console.log("message sender's board")
                        console.log(map.get(message.sender))
                        return;
                }
                console.log("username:",username2);
                console.log("message sender",user);
                console.log("+++++++++++++++++++++++++++")
                var board: CTetris | undefined = map.get(user);
                console.log(board)
                if (typeof board === "undefined") {
                        console.log("Board not found for user:", user);
                        return;
                      }
                console.log((board.state)) //문자열 Running이야.
                    
        

                switch(board.state){
                        case TetrisState.Finished:
                                console.log(board);
                                map.set(user,board!!);
                                console.log(map.get(message.sender))
                                break;
                        case TetrisState.Running:
                                if(key == 'q'){
                                        console.log(board);
                                        board.state = TetrisState.Finished;
                                        map.set(user,board!!);
                                        console.log(map.get(message.sender))
                                        break;
                                }
                                board.state = board.accept(key);
                                console.log(board);
                                map.set(user,board);

                                console.log(map.get(message.sender))
                                if(message.idxBT != null && board!!.state == TetrisState.NewBlock){
                                        console.log("여기는 newblock일때만 실행되는곳");
                                        board!!.state = board!!.accept(message.idxBT);
                                        console.log(board);
                                        if(board.state == TetrisState.Finished){
                                                map.set(user,board!!);
                                                console.log(map.get(message.sender))
                                                break;
                                        }
                                        map.set(user,board);
                                }
                                break;
                        case TetrisState.NewBlock:
                                if(message.idxBT != null && board.state == TetrisState.NewBlock){
                                        board.state = board.accept(message.idxBT);
                                        console.log("state in NEWBLOCK", board.state)
                                        map.set(user,board);
                                        console.log(board);
                                        if(board!!.state == TetrisState.Finished){
                                                map.set(user,board);
                                                break;
                                        }
                                }
                                break;
                        default:
                                console.log(cBoard!.state)
                                console.log("wrong key");
                                break;
                }
        }
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
