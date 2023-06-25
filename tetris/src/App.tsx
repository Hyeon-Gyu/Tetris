import { TetrisState } from './Tetris';
import React, { useState, useEffect ,useLayoutEffect} from 'react';
import { CTetris } from './CTetris';
import { setOfBlockArrays } from './setOfBlockArrays';
import "./screen.css";

import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Client, Message, Stomp } from '@stomp/stompjs';
import Matrix from './Matrix';

import Display from './Display'
import { displayPartsToString } from 'typescript';


function Title(props: any) {
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


function printColor(value: number) {
    switch (value) {
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



var map: Map<string, CTetris> = new Map();
var stompClient: StompJs.CompatClient | null = null;
var myName: string;



function DisplayBLK (props:any) {
    var myboard = map.get(props.name)
    var blkList:any=[[]]

    if(myboard != undefined){
        const outputDisplay = myboard!.oScreen!.get_array()
        for (var i = 0; i < myboard!.oScreen.get_dy(); i++) {
        blkList[i] = outputDisplay[i].map((blk) => (<Display blk={blk} />))
        }
    }
   

    return (
        <div className='myBoard'>
            {blkList.map((line:any)=> (<div>{line}</div>) )}
        </div>
    );

}



function App() {
    

    
    const [keyPressedCnt, setKeyPressed] = useState(0)
    const [drawScreen, setDrawScreen] = useState<number[][]>()
    const [userkey, setKey] = useState('');

    const getUserName = (e: any) => {
        e.preventDefault()
        console.log('get user name called')
        console.log("username:", e.target.namefield.value)
        //setName(e.target.namefield.value)
        myName = e.target.namefield.value
        console.log("전역변수 설정 myname: ", myName)
        var socket = new SockJS('/websocket')
        console.log("sock:", socket)
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


    const onConnected = () => {
        console.log("inside onConnected()")
        console.log("username to be send:", myName)//state로 초기화하는 변수인 username썼더니 null exception떠서 새로만든변수
        stompClient!.subscribe('/topic/public', onMessageReceived);//메시지를 받으면 onMessageReceived호출
        stompClient!.subscribe('/topic/prevuser', getPrevUsers);
        var randnum = Math.floor(Math.random() * 7);//클라이언트에서 랜덤넘버 생성
        console.log(randnum)
        stompClient!.send("/app/chat.register",//서버에서 (유저-보드) 객체 생성하는 컨트롤러 주소
            {},
            JSON.stringify({ sender: myName, key: randnum, idxBT: randnum, type: 'JOIN' })
            // 서버로 랜덤 넘버 포함해서 전송
        )
        console.log("처음 onConnected함수에서 보내는 message format", JSON.stringify({ sender: myName, key: randnum, idxBT: randnum, type: 'JOIN' }))
    }

    const onChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(myName)
        console.log("keyIn:" + e.target.value[e.target.value.length - 1])

        if (e.target.value[e.target.value.length - 1] == " ") {
            setKey("_")//스페이스바는 백에서 _로 매핑되어 동작
            setKeyPressed(keyPressedCnt+1)
        }
        else {
            setKey(e.target.value[e.target.value.length - 1])
            setKeyPressed(keyPressedCnt+1)
        }
    }


    useLayoutEffect( () => {//useLayoutEffect()를 활용하여 컴포넌트 렌더링 - useLayoutEffect 실행 - 화면 업데이트 순으로 effect를 실행시킬 수 있다.


        var myboard = map.get(myName)

        if (typeof myboard === "undefined") {
            console.log("myboard undefined");
            return;
        }
        if (userkey == 'q') {
            myboard.state = TetrisState.Finished
            var chatMessageQuit = {//서버에게 보낼 메시지
                sender: myName,
                content: userkey,
                key: userkey,
            };
            stompClient!.send("/app/chat.send", {}, JSON.stringify(chatMessageQuit))
        }
        console.log("here")
        myboard.state = myboard.accept(userkey)
        switch (myboard.state) {
            case TetrisState.NewBlock:
                var randnum = Math.floor(Math.random() * 7);//클라이언트가 랜덤넘버 생성
                myboard.state = myboard.accept(randnum.toString())//클라이언트의 로직 실행
                console.log("key to send:", userkey)
                console.log("idxBT to send:", randnum)
                var chatMessage = {//서버에게 보낼 메시지
                    sender: myName,//서버가 유저 판단하는 데 사용
                    content: userkey,
                    key: userkey,
                    idxBT: randnum,//클라이언트가 생성한 랜덤넘버 보냄
                };
                console.log(myboard.oScreen)
                stompClient!.send("/app/chat.send", {}, JSON.stringify(chatMessage))//컨트롤러의 chat.send로 매핑
                break;
            case TetrisState.Running:
                console.log("key to send:", userkey)
                var chatMessage2 = {//서버에게 보낼 메시지
                    sender: myName,
                    content: userkey,
                    key: userkey,
                };
                stompClient!.send("/app/chat.send", {}, JSON.stringify(chatMessage2))
                console.log(myboard.oScreen)
                break;
            case TetrisState.Finished:
                console.log("이미 종료된 보드")
    
                break;
            default:
                console.log("wrong state----")
                return;
        }
        //
        // DisplayBLK(myName)

        

    },[userkey,keyPressedCnt])
    
   


    const getPrevUsers = (payload: { body: string; }) => {
        //먼저 온 사람의 존재를 모르기 때문에 서버로부터 map으로 먼저 온 사람들의 randnum으로 보드 객체 생성
        var message = JSON.parse(payload.body);
        const mapIterator2 = Array.from(Object.keys(message.oneTimeUseMap)) // 서버에 저장되어있는 키 값들을 추출
        const mapIterator = Array.from(map.keys())
        mapIterator2.filter(
            function (x) {
                return !mapIterator.includes(x)
            }
        ).forEach(
            function (x) {
                console.log("hello")
                CTetris.init(setOfBlockArrays);
                var board = new CTetris(15, 10)
                board.state = TetrisState.NewBlock
                var randidx = message.oneTimeUseMap[x]
                board.state = board.accept(randidx.toString())
                console.log("user: ", x)
                console.log("randnum:", message.oneTimeUseMap[x])
                console.log(board)
                //setDrawScreen(board.oScreen.get_array())
                map.set(x, board)
                
                // if(x != myName){
                //     setOpposit(x)
                // }

            }
        )


        // DisplayBLK(myName)//내 게임 시작화면(배경+뉴블록) 출력

        // console.log("msg sender :" ,message.sender)
        // console.log(map.get(message.sender))
    }

    const onMessageReceived = (payload: { body: string; }) => {
        var message = JSON.parse(payload.body);
        console.log(message)
        var user = message.sender;
        var key = message.key;
        if (myName == user) { //본인은 서버에서 온 message를 수신할 필요가 없음 (이미 useeffect로 로직은 돌아간 상태)
            console.log("내가 보낸 메시지는 나는 다시 수신할 필요가 없지요");
            
            return;
        }
        var board: CTetris | undefined = map.get(user);
        //console.log(board?.oScreen.get_array())
        if (typeof board === "undefined") {
            console.log("Board not found for user:", user);
            return;
        }
        switch (board.state) {
            case TetrisState.Finished:
                console.log(board.oScreen);
                map.set(user, board!!);
                setDrawScreen(board.oScreen.get_array())
                break;
            case TetrisState.Running:
                if (key == 'q') {
                    board.state = TetrisState.Finished;
                    map.set(user, board!!);
                    console.log(board.oScreen)
                    setDrawScreen(board.oScreen.get_array())
                    //setShowInput(false)
                    break;
                }
                board.state = board.accept(key);
                console.log(board.oScreen.get_array())
                map.set(user, board);
                if (message.idxBT != null && board!!.state == TetrisState.NewBlock) {
                    console.log("여기는 running이다가 newblock일때만 실행되는곳");
                    board.state = board.accept(message.idxBT);
                    console.log(board.oScreen)
                    if (board.state == TetrisState.Finished) {
                        map.set(user, board);
                        setDrawScreen(board.oScreen.get_array())
                        //setShowInput(false)
                        break;
                    }
                    setDrawScreen(board.oScreen.get_array())
                    map.set(user, board);
                }
                setDrawScreen(board.oScreen.get_array())
                break;
            case TetrisState.NewBlock:
                if (message.idxBT != null && board.state == TetrisState.NewBlock) {
                    board.state = board.accept(message.idxBT);
                    console.log("state in NEWBLOCK", board.state)
                    if (board!!.state == TetrisState.Finished) {
                        map.set(user, board);
                        break;
                    }
                }
                setDrawScreen(board.oScreen.get_array())
                map.set(user, board);
                console.log(board.oScreen.get_array())
                break;
            default:
                setDrawScreen(board.oScreen.get_array())
                console.log(board.oScreen)
                console.log("wrong key");
                break;
        }
    }


    return (
        <>
            <h1><Title /></h1>
            <h1>Press any key to start</h1>
            <form onSubmit={getUserName}>
                <label>
                    Name: <input type="text" name='namefield' />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <input onChange={onChangeKey}></input>

            <div className='gamescreen'>
                <div>
                    <OppositeScreen />
                </div>

            </div>


            <DisplayBLK name={myName} />
            {/* blkList[i] = outputDisplay[i].map((blk) => (<Display blk={blk} />)) */}
            
            { Array.from(map.keys()).map((name) => (<DisplayBLK name={name}/>))}

        </>
    )

}



export default App;
