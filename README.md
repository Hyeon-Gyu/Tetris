### 3인 대결 테트리스 구현
23.01.13 ~23.04.26 1인테트리스 로직 구현(+타이머 기능) & 테트리스 화면 UI 제작
react - spring boot  통신 방법: axios
web에서 keyboard 이벤트 발생-> json에 key value 담아서 송신 -> backend에서 key value parse해서 테트리스 보드 업데이트 -> 2차원 배열 정보 web단으로 송신 -> 화면에 출력 (완료)
23.04.29 다인용 테트리스를 위해 websocket 공부시작
데이터 송수신 간 복잡성을 줄이기 위해 client, server 각각 여러개의 보트판 준비해놓고 userID, keyvalue만 가지고 각자 연산시작. 주고받는 데이터는 keyvalue와 ID 뿐.

~23.05.16 N명 입장할 수 있는 채팅방 구현(UI 제작X  CHROME확장 프로그램 이용) 
1. N개 방 생성
2. 입장시 message type에 맞게 서버로 json보내면 입장 가능
3. parrelstream 함수 이용해 같은 방 안의 유저들에게 동시에 메시지 송신 가능(수신 확인완료)
4. DB 제작 X (HASHMAP으로 일단 세션, 방 리스트  관리중)

