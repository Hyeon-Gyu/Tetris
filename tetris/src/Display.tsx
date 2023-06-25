import React from 'react';

// 브라우저 창에 게임판을 출력하는 사용자 인터페이스입니다.



const Display = (props:any) => {
    let color:any = 'red';

    // if (props.blk==10){
    //     color = 'red'
    // }
    switch(props.blk){
        case 10: color="red"; break;
        case 20: color = "blue"; break;
        case 30: color = "orange"; break;
        case 40: color = "yellow"; break;
        case 50: color = "green"; break;
        case 60: color = "purple"; break;
        case 70: color = "pink"; break;
        case 0: color="white"; break;
        case 1: color = "black"; break;
        default : color= "black"; break;
    }

    

    return (
        <>
        
        <svg style={
            {width:"24",
            height:"24",
            marginRight:"5px",
             backgroundColor:color}
            }>
|       </svg>

        </>
    );

};

export default Display