/*translate mdrobot motor driver serial string
packet structure
|  Header       |  ID   | Param | Data# | Data  |Checksum|
| RMID  | TMID  |  ID   |  PID  | Data# | Data  |  CHK  |
| 1byte | 1byte | 1byte | 1byte | 1byte |nbytes | 1byte |

MID List (RMID, TMID 적용)
128: MID_MAIN_CTR (메인제어기)
133: MID_REMOCON (RF 리모콘, MDJS)
172: MID_MMI (MAN_MACHINE_INTERFACE, PC 등)
183: MID_BLDC_CTR (BLDC/DC 모터제어기, MD, MDT, DMD, DMDT series)
184: MID_BRIDGE_CTR (MDUI, TD 등)
186: MID_PDIST (POWER DISTRIBUTER, 전원보드)

PID 에 따른 DATA LENGTH
0 - 95 : 1 byte
101 - 191 : 2 bytes
192 - 253 : n bytes

Checksum
TX: 256 - ( Sum of all data bytes % 256 )
RX: ( Sum of all data bytes inclueind CHK ) % 256 == 0
*/

//생략 PID: 7, 10, 11
export const mdrobotFunctions = [
    "read firmware version",        // PID_VER 펌웨어 버전 리턴, PID 1
    "factory reset",                // PID_DEFAULT_SET 공장 초기화, PID 3, Data 0x55
    "read PID data",                // PID_REQ_PID_DATA 요청한 PID 의 data 리턴 (PID 4, DATA = 요청 PID)
    "passive stop",                 // PID_TQ_OFF 모터를 자연적으로 정지, PID 5
    "brake stop",                   // PID_BRAKE 모터를 전기적으로 급제동, PID 6
    "reset alarm",                  // PID_ALARM_RESET 제어기의 알람상태 해제, PID 12
    "reset motor position",         // PID_POSI_RESET 모터 위치를 0으로 리셋, PID 13
    "broadcast main data",          // PID_MAIN_BC_STATE 메인 데이터 (PID 193) 연속 수신, PID 14, DATA: 1 - 수신, 0 - 수신 해제
    "broadcast monitor data",       // PID_MONITOR_BC_STATE 모니터 데이터 (PID 196) 연속 수신, PID 15, DATA: 1 - 수신, 0 - 수신 해제
    
];

export const toMdrobot = (data) => { //data needs id, function, value
    const TMID = "B7"; // destination : 모터제어기
    const RMID = "AC"; // This program
    const ID = data.id.toString(16).padStart(2,"0");
    const PID = getPID(data.function);
    const DATA_NUM = getDataNum(PID);
    const DATA = getData(data.function, DATA_NUM, data.value);
    
    let i = 0;
    let checksum = parseInt(TMID, 16) + parseInt(RMID, 16) + parseInt(ID, 16) + parseInt(PID, 16) + parseInt(DATA_NUM, 16);
    for( i = 0; i < DATA.length; i += 2 ) {
        checksum += parseInt(DATA.slice(i, i+2), 16);
    }
    
    const CHK = ( 256 - ( checksum % 256 ) ).toString(16).padStart(2,"0");

    return TMID + RMID + ID + PID + DATA_NUM + DATA + CHK;
    
}

export const fromMdrobot = (str) => {
    // Checksum
    let i = 0;
    let checksum = 0;
    for( i = 0; i < str.length; i += 2 ) {
        checksum += parseInt(str.slice(i, i+2), 16);
    };

    // Interpret
    const result = {
        type: "mdrobot",
        deviceType: parseInt(str.slice(0,2),16),
        deviceId: parseInt(str.slice(4,6), 16),
        parameter: parseInt(str.slice(6,8), 16),
        data: parseInt(str.slice(10, str.length-2), 16),
        checksum: (checksum%256 == 0),
        status: `PID ${parseInt(str.slice(6,8), 16)} was returned.`,
        value: `${parseInt(str.slice(10, str.length-2), 16)}`,
    };

    return result;
}

const getPID = (str) => {
    switch(str){
        case "read firmware version":        
            return "01";
        case "factory reset":
            return "03";                
        case "read PID data":
            return "04";
        case "passive stop":
            return "05";
        case "brake stop":
            return "06";
        case "reset alarm":
            return "0C";
        case "reset motor position":
            return "0D";
        case "broadcast main data":
            return "0E";
        case "broadcast monitor data":
            return "0F";
    }
};

const getDataNum = (pid) => {
    const dPID = parseInt(pid,16);
    if( dPID < 100 ) {
        return "01";
    } else if ( dPID < 192 ) {
        return "02";
    } else {
        return "FF";
    }
};

const getData = (str, dataLength, value) => {
    const strLength = 2 * parseInt(dataLength, 16);
    return Number(value).toString(16).padStart(strLength,"0");
}