# 3인 대결 테트리스 구현 
**23.01.13 ~23.04.26:**  

```1인테트리스 로직 구현(+타이머 기능) & 테트리스 화면 UI 제작> [oneUser_Tetris]```
`통신방법` : react(typescript), spring boot(kotlin)간  axios 비동기식 통신
`동작과정` : 
1. web에서 keyboard 이벤트 발생
2. json format에 key value 담아서 송신(front)
3. server(backend)에서 key value parsing 작업하여 입력받은 key 정보로  테트리스 로직 실행 및 게임판  업데이트
4. 2차원 배열 정보(보드판 전체) client(front)로 송신
5. 화면에 출력 (완료)

**23.04.29** 
```다인용 테트리스를 위해 websocket 공부시작```
`기존 방식 변형` : 데이터 송수신 간 복잡성을 줄이기 위해 client, server 각각 client 인원수별 테트리스 게임판 객체  생성하여 
userID, keyvalue 정보만 client들과 서버간 주고받고 각자 테트리스 로직진행. json format에 담길 데이터는 keyvalue와 ID 및 몇가지 flag를 담는것으로 구상중


### 튜토리얼 따라하기 [onlySpring(js,html)]
**< ~23.05.16: N명 입장할 수 있는 채팅방 구현(UI 제작X  CHROME확장 프로그램 이용) >**
`목적` : 채팅방의 기능으로 서버에서 접속해있는 모든 client에게 동일한 값을 일괄적으로 전송하는 방식에 대해서 공부하기 위해서 
1. N개 방 생성
2. 입장시 message type에 맞게 서버로 json format으로 server에게 전송하여 입장 확인
3. parrelstream 함수 이용해 같은 방 안의 유저들에게 동시에 메시지 송신 가능(수신 확인완료)
4. DB 제작 X (HASHMAP으로 일단 세션, 방 리스트  관리중)


### 대결 테트리스 초안[chat]
**~23.05.24 N명입장할 수 있는 하나의 방 + 테트리스 로직 구현**
1. 하나의 방에 N명 입장 가능
2. 콘솔에서 사용자별 테트리스 보드 객체 확인가능
3. 테트리스 보드판 3개 UI 미구현 상황
4. 테트리스 정상동작 확인완료
5. OnlyBoot 폴더 : spring boot에서 js, html로 화면 구성 -> REACT와 협업하여 연동 분할예정

~23.05.28: React login 화면 연동 완료, 3명의 테트리스 화면에 출력하면 끝. 

## 3인 제한 대결 테트리스 완성[FINAL_TETRIS]
**~23.07.01 : 최종 3인 대결 테트리스 구현 완료**
```사용한 프레임워크```:React, Spring boot
```통신방법```: Websocket 기반 STOMP protocol 활용 및 spring boot의 simple message broker 활용
```메시지 형식``` : json 기반
```동작 개요``` : 
1. 사용자 3명 모두 접속할 때까지 게임 진행 불가, 3명 접속시 알람 메시지와 함께 테트리스 대결 시작
2. 방향키는 'a','s','d'',w',' '로 이루어져있음. 추가로 'q' 입력시 강제 게임종료 기능도 구현된 상태
3. 사용자 3명 모두 게임 종료시, 3명 각각 게임시작 버튼 누르면 테트리스 게임판 초기화 및 재시작 

- 한계점: 타이머 미구현(React의 장점을 활용하며 타이머를 구현하기 어려웠다- 단순 하드코딩이 아닌 hook 기능활용하기에 완전한 react 활용지식이 부족함을 느낌)
	데이터베이스 미연결(테트리스 초기 구상 당시, 한줄 삭제 마다 점수를 부여하여 데이터베이스에 사용자명과 점수를 활용해 랭킹을 저장하고자 했다 - 타이머 기능이 구현되어 있지 않아 대결이 성립되지 않았고, 랭킹제도를 추가할 필요성이 없어져 데이터베이스활용을 하지 않음)


<img width="657" alt="tetris" src="https://github.com/hyeon-gyu/Tetris/assets/54972659/ddadcc93-d526-457c-acdc-f82b862ded49">


<img width="685" alt="tetris2" src="https://github.com/hyeon-gyu/Tetris/assets/54972659/dfce8351-3b08-4778-a44b-27b90a149d00">
