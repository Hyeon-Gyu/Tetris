### 3인 대결 테트리스 구현
23.01.13 ~23.04.26 1인테트리스 로직 구현(+타이머 기능) & 테트리스 화면 UI 제작
react - spring boot  통신 방법: axios
web에서 keyboard 이벤트 발생-> json에 key value 담아서 송신 -> backend에서 key value parse해서 테트리스 보드 업데이트 -> 2차원 배열 정보 web단으로 송신 -> 화면에 출력 (완료)
23.04.29 다인용 테트리스를 위해 websocket 공부시작
데이터 송수신 간 복잡성을 줄이기 위해 client, server 각각 여러개의 보트판 준비해놓고 userID, keyvalue만 가지고 각자 연산시작. 주고받는 데이터는 keyvalue와 ID 뿐.

