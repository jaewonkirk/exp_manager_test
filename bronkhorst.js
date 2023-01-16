/*translate bronkhorst serial string
    data format
    {
        port: serial port (string)
        node: node number (number)
        function: function to execute (string)
        value: input/output value (number)
    }

    supported functions
    read: measure, fmeasure, setpoint, fsetpoint, control mode, slave factor, fluid number, fluidname, valve output, temperature, actual density, capacity100%, capacity unit,
        alarm info, alarm mode, alarm maximum limit, alarm minimum limit, alarm setpoint mode, alarm new setpoint, alarm delay time, reset alarm enable,
        counter value, counter mode, counter setpoint mode, counter limit, counter unit index, counter unit, reset counter enable, counter controller overrun correction, counter controller gain,
        serial number, bhtmodel number, firmware version, usertag, customer model, device type,
        initreset, iostatus, 
        calibration mode

    write: setpoint, fsetpoint, control mode, slave factor, fluid number,
        alarm mode, alarm maximum limit, alarm minimum limit, alarm setpoint mode, alarm new setpoint, alarm delay time, reset alarm enable,
        counter mode, counter setpoint mode, counter new setpoint, counter limit, counter unit index, counter unit, reset counter enbale, counter controller overrun correction, counter controller gain,
        reset, initreset, wink, iostatus
        calibration mode
*/

export const bronkhorstFunctions = [
    "readMeasure",
    "readFmeasure",
    "readSetpoint",
    "writeSetpoint",
    "readFsetpoint",
    "writeFsetpoint",
    "readControlmode",
    "writeControlmode",
    "readSlavefactor",
    "writeSlavefactor",
    "readFluidnumber",
    "writeFluidnumber",
    "readFluidname",
    "readValueoutput",
    "readTemperature",
    "readActualdensity",
    "readCapacitymax",
    "readCapacityunit",
    "readAlarminfo",
    "readAlarmmode",
    "writeAlarmmode",
    "readAlarmmaximumlimit",
    "writeAlarmmaximumlimit",
    "readAlarmminimumlimit",
    "writeAlarmminimumlimit",
    "readAlarmsetpointmode",
    "writeAlarmsetpointmode",
    "readAlarmnewsetpoint",
    "writeAlarmnewsetpoint",
    "readAlarmdelaytime",
    "writeAlarmdelaytime",
    "readResetalarmenable",
    "writeResetalarmenable",
    "readCountervalue",
    "readCountermode",
    "writeCountermode",
    "readCountersetpointmode",
    "writeCountersetpointmode",
    "writeCounternewsetpoint",
    "readCounterlimit",
    "writeCounterlimit",
    "readCounterunitindex",
    "writeCounterunitindex",
    "readCounterunit",
    "writeCounterunit",
    "readResetcounterenbale",
    "writeResetcounterenable",
    "readCountercontrolleroverruncorrection",
    "writeCountercontrolleroverruncorrection",
    "readCountercontrollergain",
    "writeCountercontrollergain",
    "readSerialnumber",
    "readBhtmodelnumber",
    "readFirmwareversion",
    "readUsertag",
    "readCustomermodel",
    "readDevicetype",
    "writeReset",
    "readInitreset",
    "writeInitreset",
    "writeWink",
    "readIostatus",
    "writeIostatus",
    "readCalibrationmode",
    "writeCalibrationmode",
];

const PARAMTABLE = { //bronkhorst 917.027 manual 참고
    ARBITRAGE: {//DDE PARAMETER NUMBER: 6
        TEMPORARY_BUSMASTER: "1",   //temporary busmaster
        ALWATS_BUSMASTER: "2",   //always busmaster
        AUTOMATIC_BUSMASTER: "3",   //automatic busmaster
        AUTO_OPTIMIZATION: "67",   // auto busmaster and auto bus optimalization (fast token ring)
    },
    CONTROL_MODE: {//DDE PARAMETER NUMBER: 12
        SETPOINT_BUS: "0",                 //setpoint = BUS setpoint
        SETPOINT_ANALOG: "1",              //setpoint = analog input
        SETPOINT_FLOWBUS_FLOWBUS: "2",     //setpoint = master output(FLOW-BUS) * slave factor(FLOW-BUS)
        CLOSE_VALVE: "3",                  //close valve
        CONTROLLER_IDLE: "4",              //controller idle (no reaction on changes in sensor signal)
        TESTMODE_ENABLE: "5",              //testmode enable (select subject with par 70)
        TUNINGMODE_ENABLE: "6",            //tuningmode enable (select subtject with par 79)
        SETPOINT_MAX: "7",                 //setpoint = 100%
        PURGE_VALVE: "8",                  //purge valve (fully open)
        CALIBRATIONMODE_ENABLE: "9",       //calibration mode enable (select subject with par 58)
        SETPOINT_ANALOG_FLOWBUS: "10",      //setpoint = master output(analog in) * slave factor(FLOW-BUS)
        SETPOINT_KEYBOARD: "11",            //setpoint = keyboard OR FLOW-BUS setpoint
        SETPOINT_MIN: "12",                 //setpoint = 0%
        SETPOINT_FLOWBUS_ANALOG: "13",      //setpoint = master output(FLOW-BUS) * slave factor(analog in)
        RANGESELECTMODE: "14",              //(FPP) Range select mode
        SENSOR_MANUAL_AUTO: "15",           //(FPP) Manual start sensor select, automatic end sensor
        SENSOR_AUTO_MANUAL: "16",           //(FPP) Automatic start sensor select, manual end sensor
        SENSOR_AUTO_AUTO: "17",             //(FPP) Automatic start and end sensor
        SETPOINT_SERIAL: "18",              //setpoint = RS232 setpoint
        BROADCASTMODE: "19",                //RS232 broadcast mode
        SETPOINT_VALVE: "20",               //valve stearing (valve = setpoint)
        SETPOINT_ANALOG_VALVE: "21",        //analog valve stearing (valve = analog setpoint)
        VALVE_SAFE: "22",                   //valve safe state
    },
    SENSOR_TYPE: {//DDE PARAMETER NUMBER: 22
        CONTROLLER_PRESSURE: "0",  //pressure (controller)
        CONTROLLER_LIQUID_VOLUME: "1",  //liquid volume (controller)
        CONTROLLER_MASS: "2",  //liquid/gas mass (controller)
        CONTROLLER_GAS_VOLUME: "3",  //gas volume (controller)
        CONTROLLER_OTHER: "4",  //other sensor type (controller)
        SENSOR_PRESSURE: "128",  //pressure (sensor)
        SENSOR_LIQUID_VOLUME: "129",  //liquid volume (sensor)
        SENSOR_MASS: "130",  //liquid/gas mass (sensor)
        SENSOR_GAS_VOLUME: "131",  //gas volume (sensor)
        SENSOR_OTHER: "132",  //other sensor type (sensor)
    },
    ALARM_INFO: {/*
        28 Alarm info &H01 0 no error message in alarm error status register
        28 Alarm info &H01 1 at least 1 error message in alarm error status register
        28 Alarm info &H02 0 no warning message in alarm warning status register
        28 Alarm info &H02 1 at least 1 warning message in alarm warning status register
        28 Alarm info &H04 0 no minimum alarm message (measure>minimum limit)
        28 Alarm info &H04 1 minimum alarm message for measured signal
        28 Alarm info &H08 0 no maximum alarm message (measure<maximum limit)
        28 Alarm info &H08 1 maximum alarm message for measured signal
        28 Alarm info &H10 0 batch counter has not reached its limit
        28 Alarm info &H10 1 batch counter has reached its limit
        28 Alarm info &H20 0 response O.K. (setpoint-measure within limit)
        28 Alarm info &H20 1 response alarm message: setpoint-measure is too high
        28 Alarm info &H40 0 master output signal O.K. (or not used)
        28 Alarm info &H40 1 master output signal not received: check master instrument
        28 Alarm info &H80 0 hardware O.K.
        28 Alarm info &H80 1 hardware error message: check your hardware*/
    },
    OPERATION_MODE: {/*
        44 Operation mode T/A 0 OFF
        44 Operation mode T/A 1 A: MAX & RESP AUTO; T: UP TO LIMIT
        44 Operation mode T/A 2 A: MIN & RESP AUTO; T: UP AND REPEAT
        44 Operation mode T/A 3 A: MAX & RESP; T: DOWN FROM LIMIT
        44 Operation mode T/A 4 A: MIN & RESP; T: DOWN AND REPEAT
        44 Operation mode T/A 5 A: MAXIMUM ALARM; T: ALWAYS UP
        44 Operation mode T/A 6 A: MINIMUM ALARM
        44 Operation mode T/A 7 A: RESPONSE ALARM*/
    },
    ANALOG_MODE: {/*
        53 Analog mode &H3F 0 0...5 Vdc operation
        53 Analog mode &H3F 1 0...10 Vdc operation
        53 Analog mode &H3F 2 0...20 mA operation
        53 Analog mode &H3F 3 4...20 mA operation
        53 Analog mode &H3F 4 15...20 mA operation
        53 Analog mode &H40 0 Analog input enabled
        53 Analog mode &H40 1 Analog input disabled
        53 Analog mode &H80 0 Analog output enabled
        53 Analog mode &H80 1 Analog output disabled*/
    },
    CALIBRATION_MODE: {/*
        58 Calibration mode 0 idle: no action
        58 Calibration mode 1 adc self calibration
        58 Calibration mode 2 dmfc
        58 Calibration mode 3 dmfc
        58 Calibration mode 4 dmfc
        58 Calibration mode 5 dmfc
        58 Calibration mode 6 dmfc
        58 Calibration mode 7 dmfc
        58 Calibration mode 8 dmfc
        58 Calibration mode 9 customer zero
        58 Calibration mode 10 adjust Vref output by connecting it to analog in
        58 Calibration mode 11 adjust analog out by connecting it to analog in
        58 Calibration mode 12 adjust valveoutput by connecting it to analog in
        58 Calibration mode 13 dmfc
        58 Calibration mode 14 dmfc
        58 Calibration mode 15 analog output = 0 %
        58 Calibration mode 16 analog output = 100 %
        58 Calibration mode 17 analog output = 50 %
        58 Calibration mode 18 factory zero
        58 Calibration mode 19 sensor differentiator (setpoint steps are needed!)
        58 Calibration mode 20 automatic sensor configuration
        58 Calibration mode 21 sensor temperature calibration
        58 Calibration mode 22 customer zero (no control mode 9 needed)
        58 Calibration mode 255 Error mode (result of previous cal mode)*/
    },
    MONITOR_MODE: {/*
        60 Monitor mode 0 (filtered) setpoint
        60 Monitor mode 1 controller error input signal / raw sensor signal
        60 Monitor mode 2 controller output signal to valve
        60 Monitor mode 3 sensor signal slow
        60 Monitor mode 4 sensor signal slow filtered
        60 Monitor mode 5 linearization output
        60 Monitor mode 6 differentiator output
        60 Monitor mode 7 differentiator output filtered
        60 Monitor mode 8 normal sensor signal (Output)
        60 Monitor mode 9 analog input signal
        60 Monitor mode 10 power supply voltage
        60 Monitor mode 11 mass flow in display unit (normally ln/min)
        60 Monitor mode 12 volume flow in l/min
        60 Monitor mode 13 temperature in °C
        60 Monitor mode 14 pressure absolute in mbara
        60 Monitor mode 15 time in msec/frequency in Hz.
        60 Monitor mode 16 calibrated volume at actual sensor in ml
        60 Monitor mode 17 delta-P pressure in mbarg
        60 Monitor mode 18 atmospheric (barometer) pressure in mbara
        60 Monitor mode 19 mass flow in kg/min*/
    },
    ALARM_REGISTER: {/*
        61 Alarm register1 &H8000000000000000 0 No diagnostics available in warning register
        61 Alarm register1 &H8000000000000000 1 Diagnostics available in warning register
        62 Alarm register2 &H8000000000000000 0 No diagnostics available in error register
        62 Alarm register2 &H8000000000000000 1 Diagnostics available in error register*/
    },
    ADC_CONTROL_REGISTER: {/*
        67 ADC control register &H001000 0 ADC bipolar mode
        67 ADC control register &H001000 1 ADC unipolar mode
        67 ADC control register &H1000000 0 Disable zero measure threshold
        67 ADC control register &H1000000 1 Enable zero measure threshold
        67 ADC control register &H1C0000 0 ADC gain = 1x
        67 ADC control register &H1C0000 1 ADC gain = 2x
        67 ADC control register &H1C0000 2 ADC gain = 4x
        67 ADC control register &H1C0000 3 ADC gain = 8x
        67 ADC control register &H1C0000 4 ADC gain = 16x
        67 ADC control register &H1C0000 5 ADC gain = 32x
        67 ADC control register &H1C0000 6 ADC gain = 64x
        67 ADC control register &H1C0000 7 ADC gain = 128x*/
    },
    ALARM_ENABLE: {//DDE PARAMETER NUMBER: 69
        DISABLE: "0",                       
        ENABLE: "1",                       
    },
    TEST_MODE: {/*
        70 Test mode 0 idle; no action
        70 Test mode 1 uProcessor
        70 Test mode 2 IO
        70 Test mode 3 RAM
        70 Test mode 4 FRAM
        70 Test mode 5 ADC
        70 Test mode 6 DAC
        70 Test mode 7 sensor
        70 Test mode 8 valve drive circuit
        70 Test mode 9 Vref
        70 Test mode 10 FLOW-BUS
        70 Test mode 11 calibration
        70 Test mode 12 keyboard*/
    },
    ADC_CHANNEL_SELECT: {//DDE PARAMETER NUMBER: 71
        ADC_CHANNEL_1: "1",
        ADC_CHANNEL_2: "2",
    },
    TUNING_MODE: {/*
        79 Tuning mode 0 idle; no action
        79 Tuning mode 1 sensor
        79 Tuning mode 2 valve
        79 Tuning mode 3 Fuzzy controller normal operation
        79 Tuning mode 4 Fuzzy controller open at zero
        79 Tuning mode 5 PID controller*/
    },
    VALVE_DEFAULT: {/*
        80 Valve default 0 normally closed
        80 Valve default 1 normally opened
        80 Valve default 2 normally closed inverse controlled
        80 Valve default 3 normally opened inverse controlled
        80 Valve default 4 remain position*/
    },
    IO_STATUS: {/*
        86 IO status &H01 1 read diagnostic jumper (no diagnostics, read/write)
        86 IO status &H02 1 not used
        86 IO status &H04 1 read analog jumper (use cntrlmode, read/write)
        86 IO status &H08 1 read micro switch (read/write)
        86 IO status &H10 1 diagnostic jumper set (read only)
        86 IO status &H20 1 initialization jumper set (read only)
        86 IO status &H40 1 analog jumper set (read only)
        86 IO status &H80 1 micro switch pressed (read only)*/
    },
    PRESSURE_SENSOR_TYPE: {/*
        106 Pressure sensor type 0 delta-P 0..5" W.C.
        106 Pressure sensor type 1 delta-P 0...10" W.C.
        106 Pressure sensor type 2 absolute pressure 800-1200 mbar
        106 Pressure sensor type 3 absolute pressure 800-1100 mbar
        106 Pressure sensor type 4 delta-P -5...0 "W.C.
        106 Pressure sensor type 5 delta-P -10...0 "W.C.
        106 Pressure sensor type 6 delta-P -10...+10 "W.C.
        106 Pressure sensor type 7 delta-P 0...1 PSI
        106 Pressure sensor type 8 delta-P -1...0 PSI
        106 Pressure sensor type 10 absolute pressure 0-10 bar*/
    },
    RESET: {/*
        114 Reset 0 no reset
        114 Reset 1 reset counter value (no mode change) or common reset
        114 Reset 2 reset alarm
        114 Reset 3 restart batch counter
        114 Reset 4 reset counter value (counter off)
        114 Reset 5 Reset module (soft reset)*/
    },
    ALARM_MODE: {/*
        118 Alarm mode 0 off
        118 Alarm mode 1 alarm on absolute limits
        118 Alarm mode 2 alarm on limits related to setpoint (response alarm)
        118 Alarm mode 3 alarm when instrument powers-up (eg. after power-down)*/
    },
    ALARM_OUTPUT_MODE: {/*
        119 Alarm output mode 0 no relais activity at alarm
        119 Alarm output mode 1 relais pulses until reset
        119 Alarm output mode 2 relais activated until reset*/
    },
    ALARM_SETPOINT_MODE: {/*
        120 Alarm setpoint mode 0 no setpoint change at alarm
        120 Alarm setpoint mode 1 new/safe setpoint at alarm enabled (set at par 121)*/
    },
    COUNTER_OUTPUT_MODE: {/*
        125 Counter output mode 0 no relais activity at batch limit
        125 Counter output mode 1 relais pulses after reaching batch limit until reset
        125 Counter output mode 2 relais activated after reaching batch limit until reset*/
    },
    COUNTER_SETPOINT_MODE: {/*
        126 Counter setpoint mode 0 setpoint change at batch limit disabled
        126 Counter setpoint mode 1 setpoint change at batch limit enabled        */
    },
    COUNTER_MODE: {/*
        130 Counter mode 0 off
        130 Counter mode 1 counting upwards continuously
        130 Counter mode 2 counting up to limit (batchcounter)*/        
    },
    RANGE_SELECT: {/*
        147 Range select 0 calibration ready/stop
        147 Range select 1 run calibration until stopsensor 1/select range 1
        147 Range select 2 run calibration until stopsensor 2/select range 2
        147 Range select 3 run calibration until stopsensor 3/select range 3
        147 Range select 4 run calibration until stopsensor 4/select range 4
        147 Range select 5 run calibration and select range 5
        147 Range select 9 run calibration with automatic range selection
        147 Range select 19 run until stopsensor 1 until 3 values between limit
        147 Range select 29 run until stopsensor 2 until 3 values between limit
        147 Range select 39 run until stopsensor 3 until 3 values between limit
        147 Range select 49 run until stopsensor 4 until 3 values between limit
        147 Range select 59 run and select range 5 until 3 values between limit
        147 Range select 99 run with auto-select + 3 values between limit*/        
    },
    RESET_ALARM_ENABLE: {/*
        156 Reset alarm enable 0 no reset possible
        156 Reset alarm enable 1 reset: keyboard
        156 Reset alarm enable 2 reset: external
        156 Reset alarm enable 3 reset: keyboard or external
        156 Reset alarm enable 4 reset: FLOW-BUS
        156 Reset alarm enable 5 reset: FLOW-BUS or keyboard
        156 Reset alarm enable 6 reset: FLOW-BUS or external
        156 Reset alarm enable 7 reset: FLOW-BUS or keyboard or external
        156 Reset alarm enable 8 reset: automatic
        156 Reset alarm enable 9 reset: automatic or keyboard
        156 Reset alarm enable 10 reset: automatic or external
        156 Reset alarm enable 11 reset: automatic or keyboard or external
        156 Reset alarm enable 12 reset: automatic or FLOW-BUS
        156 Reset alarm enable 13 reset: automatic or FLOW-BUS or keyboard
        156 Reset alarm enable 14 reset: automatic or FLOW-BUS or external
        156 Reset alarm enable 15 reset: automatic or FLOW-BUS or keyboard or external    */    
    },
    RESET_COUNTER_ENABLE: {/*
        157 Reset counter enable 0 no reset possible
        157 Reset counter enable 1 reset: keyboard
        157 Reset counter enable 2 reset: external
        157 Reset counter enable 3 reset: keyboard or external
        157 Reset counter enable 4 reset: FLOW-BUS
        157 Reset counter enable 5 reset: FLOW-BUS or keyboard
        157 Reset counter enable 6 reset: FLOW-BUS or external
        157 Reset counter enable 7 reset: FLOW-BUS or keyboard or external
        157 Reset counter enable 8 reset: automatic
        157 Reset counter enable 9 reset: automatic or keyboard
        157 Reset counter enable 10 reset: automatic or external
        157 Reset counter enable 11 reset: automatic or keyboard or external
        157 Reset counter enable 12 reset: automatic or FLOW-BUS
        157 Reset counter enable 13 reset: automatic or FLOW-BUS or keyboard
        157 Reset counter enable 14 reset: automatic or FLOW-BUS or external
        157 Reset counter enable 15 reset: automatic or FLOW-BUS or keyboard or external     */   
    },
    CONTROLLER_FEATURES: {/*
        166 Controller features &H01 0 valve in normal position after startup
        166 Controller features &H01 1 valve in safe position after startup
        166 Controller features &H02 0 open from zero with PID output to valve
        166 Controller features &H02 1 open from zero with ramp output to valve        
        166 Controller features &H04 0 fixed monitor output signal
        166 Controller features &H04 1 monitor output changed at setpoint steps
        166 Controller features &H08 0 voltage drift compensation for valve output turned on
        166 Controller features &H08 1 voltage drift compensation for valve output turned off
        166 Controller features &H10 0 auto slope disabled
        166 Controller features &H10 1 auto slope enabled for pilot valves
        166 Controller features &H20 0 automatic correction for valve open turned on
        166 Controller features &H20 1 automatic correction for valve open turned off
        166 Controller features &H40 0 controller special mode (valve output steps) turned off
        166 Controller features &H40 1 controller special mode (valve output steps) turned on
        166 Controller features &H80 0 valve overshoot protection turned off
        166 Controller features &H80 1 valve overshoot protection turned on*/
    },
    IDENTIFICATION_NUMBER: {/*
        175 Identification number 0 UFO?: Unidentified FLOW-BUS Object
        175 Identification number 1 RS232/FLOW-BUS interface
        175 Identification number 2 PC(ISA) interface
        175 Identification number 3 ADDA4 (4 channels)
        175 Identification number 4 R/C-module, 32 channels
        175 Identification number 5 T/A-module
        175 Identification number 6 ADDA1: 1 channel ADDA converter module
        175 Identification number 7 DMFC: digital mass flow controller
        175 Identification number 8 DMFM: digital mass flow meter
        175 Identification number 9 DEPC: digital electronic pressure controller
        175 Identification number 10 DEPM: digital electronic pressure meter
        175 Identification number 11 ACT: single actuator
        175 Identification number 12 DLFC: digital liquid flow controller
        175 Identification number 13 DLFM: digital liquid flow meter
        175 Identification number 14 DSCM-A: digital single channel module for analog instruments
        175 Identification number 15 DSCM-D: digital single channel module for digital instr.
        175 Identification number 16 FRM: FLOW-BUS rotor meter (calibration-instrument)
        175 Identification number 17 FTM: FLOW-BUS turbine meter (calibration-instrument)
        175 Identification number 18 FPP: FLOW-BUS piston prover/tube (calibration-instrument)
        175 Identification number 19 F/A-module: special version of T/A-module
        175 Identification number 20 DSCM-E: evaporator controller module (single channel)
        175 Identification number 21 DSCM-C: digital single channel module for calibrators
        175 Identification number 22 DDCM-A: digital dual channel module for analog instruments
        175 Identification number 23 DMCM-D: digital multi channel module for digital instruments
        175 Identification number 24 Profibus-DP/FLOW-BUS interface module
        175 Identification number 25 FLOW-BUS Coriolis Meter
        175 Identification number 26 FBI: FLOW-BUS Balance Interface
        175 Identification number 27 CORIFC: CoriFlow Controller
        175 Identification number 28 CORIFM: CoriFlow Meter
        175 Identification number 29 FICC: FLOW-BUS Interface Climate Control
        175 Identification number 30 IFI: Instrument FLOW-BUS Interface
        175 Identification number 31 KFI: Keithley FLOW-BUS Interface
        175 Identification number 32 FSI: FLOW-BUS Switch Interface
        175 Identification number 33 MSCI: Multi-Sensor/Confroller Interface
        175 Identification number 34 APP-D: Active Piston Prover
        175 Identification number 35 LFI: Leaktester FLOW-BUS Interface        */
    },
    DEVICE_FUNCTION: {/*
        185 Device function 0 Unknown
        185 Device function 1 Interface
        185 Device function 2 ADDA
        185 Device function 3 Operator
        185 Device function 4 Supervisor (totalizer/alarm)
        185 Device function 5 Controller
        185 Device function 6 Meter
        185 Device function 7 Special
        185 Device function 8 (Protocol) converter     */   
    },
    CALIBRATIONS_OPTIONS: {/*
        197 Calibrations options &H01 0 Automatic capacity setting for optimal resolution
        197 Calibrations options &H01 1 Manual capacity setting for optimal resolution
        197 Calibrations options &H02 0 Barometer value input via parameter 107: BaroPress
        197 Calibrations options &H02 1 Barometer is master; input automatically from master*/        
    },
    INTERFACE_CONFIG: {/*
        200 Interface configuration 0 Configuration A: 14 ch. Standard parms. with network scan
        200 Interface configuration 1 Configuration B: 14 ch. Standard parms with fixed chan list
        200 Interface configuration 2 Configuration C: 7 ch. Extended parms with fixed chan list
        200 Interface configuration 3 Configuration D: 11 ch. Extended parms with network scan   */     
    },
    MANUFACTURER_STATUS_REGISTER: {/*
        208 Manufacturer status regi &H800000 0 No diagnostics available in manufacturer status register
        208 Manufacturer status regi &H800000 1 Diagnostics available in manufacturer status register*/        
    },
    MANUFACTURER_WARNING_REGISTER: {/*
        209 Manufacturer warning re &H800000 0 No diagnostics available in manufacturer warning register
        209 Manufacturer warning re &H800000 1 Diagnostics available in manufacturer warning register*/        
    },
    MANUFACTURER_ERROR_REGISTER: {/*
        210 Manufacturer error regis &H800000 0 No diagnostics available in manufacturer error register
        210 Manufacturer error regis &H800000 1 Diagnostics available in manufacturer error register*/        
    },
    DIAGNOSTIC_MODE: {/*
        212 Diagnostic mode 0 Debug mode off
        212 Diagnostic mode 1 Debug mode on        */
    },
    MANUFACTURER_STATUS_ENABLE: {/*
        213 Manufacturer status ena 0 set status bit (range 0…127)
        213 Manufacturer status ena 127 set status bit (range 0…127)
        213 Manufacturer status ena 254 clear all status bits
        213 Manufacturer status ena 255 set all status bits*/        
    },
    VALVE_MODE: {/*
        232 Valve mode 0 voltage drive mode
        232 Valve mode 1 current drive mode*/
    },
    FLUIDSET_PROPERTIES: {/*
        238 Fluidset properties &H01 0 Fluidset is disabled
        238 Fluidset properties &H01 1 Fluidset is enabled
        238 Fluidset properties &H02 0 Fluidset is not set by Bronkhorst High-Tech
        238 Fluidset properties &H02 2 Fluidset is set by Bronkhorst High-Tech
        238 Fluidset properties &H04 0 Fluidset is not calibrated on actual gas      
        238 Fluidset properties &H04 4 Fluidset is calibrated on actual gas*/  
    },
    SENSOR_BRIDGE_SETTINGS: {/*
        295 Sensor bridge settings &H01 1 Bridge on
        295 Sensor bridge settings &H02 1 3 windings C
        295 Sensor bridge settings &H04 1 3 windings D
        295 Sensor bridge settings &H100 1 Automatic sensor configuration on
        295 Sensor bridge settings &H200 1 Sensor protection enabled*/        
    },
    VALVE_SAFE_STATE: {/*
        301 Valve safe state 0 0 mA
        301 Valve safe state 1 max mA
        301 Valve safe state 2 Close
        301 Valve safe state 3 Open
        301 Valve safe state 4 Idle
        301 Valve safe state 5 Value (for DeviceNet only)*/        
    },
    BUS1_SELECTION: {/*
        305 Bus1 selection 0 FLOW-BUS
        305 Bus1 selection 1 Modbus
        305 Bus1 selection 2 ProPar
        305 Bus1 selection 10 DeviceNet
        305 Bus1 selection 13 Profibus-DP
        305 Bus1 selection 255 NoBus        */
    },
    BUS1_MEDIUM: {/*
        306 Bus1 medium 0 RS232
        306 Bus1 medium 1 RS485        */
    },
    BUS2_MODE: {/*
        307 Bus2 mode 0 Normal
        307 Bus2 mode 1 Config mode*/        
    },
    BUS2_SELECTION: {/*
        308 Bus2 selection 0 FLOW-BUS
        308 Bus2 selection 1 Modbus
        308 Bus2 selection 2 ProPar*/
    },
    BUS2_MEDIUM: {/*
        311 Bus2 medium 0 RS232
        311 Bus2 medium 1 RS485*/        
    },
    PIO_CHANNEL_SELECTION: {/*
        314 PIO channel selection 0 Analog input
        314 PIO channel selection 1 Analog output
        314 PIO channel selection 2 General purpose in-/output*/        
    },
    PIO_CONFIG_SELECTION: {/*
        319 PIO configuration selecti 0 Voltage output (0..10 V)
        319 PIO configuration selecti 1 Current output (0..20 mA)
        319 PIO configuration selecti 2 Digital output
        319 PIO configuration selecti 3 Frequency output
        319 PIO configuration selecti 4 Duty cycle output (20 kHz)
        319 PIO configuration selecti 5 Digital pulse output
        319 PIO configuration selecti 6 Voltage input (0..10 V)
        319 PIO configuration selecti 7 Current input (0..20 mA)
        319 PIO configuration selecti 8 Digital input
        319 PIO configuration selecti 255 Disabled*/        
    },
    SETPOINT_MONITOR_MODE: {/*
        329 Setpoint monitor mode 0 Setpoint
        329 Setpoint monitor mode 1 Filtered setpoint
        329 Setpoint monitor mode 2 Setpoint after linear slope        */
    },
    BUS1_PARITY: {/*
        335 Bus1 parity 0 None
        335 Bus1 parity 1 Odd
        335 Bus1 parity 2 Even*/        
    },
    BUS2_PARITY: {/*
        336 Bus2 parity 0 None
        336 Bus2 parity 1 Odd
        336 Bus2 parity 2 Even      */  
    },
};

const num_to_float32 = (int) => {
    let exponent = 127;
    let fraction = Math.abs(int);
    if(fraction == 0){
        return "00000000";
    }
    while( fraction < 1 ) {
        fraction = fraction * 2;
        exponent = exponent - 1;
    };
    while( fraction > 2 ) {
        fraction = fraction / 2;
        exponent = exponent + 1;
    };
    //console.log(`exponent: ${exponent-127}, fraction: ${fraction} (${fraction.toString(2)})`);
    if( int > 0 ){
        return parseInt(("0" + exponent.toString(2).padStart(8,"0") + fraction.toString(2).slice(2,25).padEnd(23,"0")), 2).toString(16);
    } else {
        return parseInt(("1" + exponent.toString(2).padStart(8,"0") + fraction.toString(2).slice(2,25).padEnd(23,"0")), 2).toString(16);
    }
};

const float32_to_num = (str) => {
    if(str.length != 8){
        error("float32_to_num needs input of 8 hex characters");
    } else if(str == "00000000"){
        return 0;
    }
    const bitstr = parseInt(str,16).toString(2).padStart(32,"0");
    const sign = bitstr.slice(0,1);
    const exponent = bitstr.slice(1,9);
    const fraction = bitstr.slice(9,32);
    //console.log(`sign: ${sign}, exponent: ${exponent}, fraction: ${fraction} [${fraction.length}]`);
    //console.log(`exponent: ${parseInt(exponent,2)-127}, fraction: ${parseInt(fraction,2)*Math.pow(2,-150)+1}`);
    if(sign=="1"){
        return -(parseInt(fraction,2)*Math.pow(2,-23)+1)*Math.pow(2,parseInt(exponent,2)-127);
    } else {
        return (parseInt(fraction,2)*Math.pow(2,-23)+1)*Math.pow(2,parseInt(exponent,2)-127);
    }
};

export const toBronkhorst = (data) => {
    const node = String(data.node).padStart(2,"0");
    switch(data.function){
        case "readMeasure":
            return `:06${node}0401210120\r\n`;
        case "readFmeasure":
            return `:06${node}0421402140\r\n`;
        case "readSetpoint":
            return `:06${node}0401210121\r\n`;
        case "writeSetpoint": // 0 - 32000 = 0 - 100% 범위
            return `:06${node}010121${(data.value*320).toString(16).padStart(4,"0")}\r\n`;
        case "readFsetpoint":
            return `:06${node}0421412143\r\n`;
        case "writeFsetpoint":
            return `:08${node}012143${num_to_float32(data.value)}\r\n`
        case "readControlmode":
            return `:06${node}0401040104\r\n`;
        case "writeControlmode":
            //return `:05${node}010104"00"\r\n`;
        case "readSlavefactor":
            return `:06${node}0421412141\r\n`;
        case "writeSlavefactor":
            //return `:08${node}012141"42C80000"\r\n`;
        case "readFluidnumber":
            return `:06${node}0401100110\r\n`;
        case "writeFluidnumber":
            //return `:05${node}010110"00"\r\n`;
        case "readFluidname":
            return `:07${node}04017101710A\r\n`;
        case "readValueoutput":
            return `:06${node}0472417241\r\n`;
        case "readTemperature":
            return `:06${node}0421472147\r\n`;
        case "readActualdensity":
            return `:06${node}04744F744F\r\n`;
        case "readCapacitymax":
            return `:06${node}04014D014D\r\n`;
        case "readCapacityunit":
            return `:07${node}04017F017F07\r\n`;
        case "readAlarminfo":
            return `:06${node}0401140114\r\n`;
        case "readAlarmmode":
            return `:06${node}0461036103\r\n`;
        case "writeAlarmmode":
            return `:05${node}016103"00"\r\n`;
        case "readAlarmmaximumlimit":
            return `:06${node}0461216121\r\n`;
        case "writeAlarmmaximumlimit": // 0 - 32000 = 0 - 100% 범위
            return `:06${node}016121${(data.value*320).toString(16).padStart(4,"0")}\r\n`;
        case "readAlarmminimumlimit":
            return `:06${node}0461226122\r\n`;
        case "writeAlarmminimumlimit": // 0 - 32000 = 0 - 100% 범위
            return `:06${node}016121${(data.value*320).toString(16).padStart(4,"0")}\r\n`;
        case "readAlarmsetpointmode":
            return `:06${node}0461056105\r\n`;
        case "writeAlarmsetpointmode":
            //return `:05${node}016105"00"\r\n`;
        case "readAlarmnewsetpoint":
            return `:06${node}0461266126\r\n`;
        case "writeAlarmnewsetpoint": // 0-32000 인지 0-3200 인지 확인 필요
            return `:06${node}016126${(data.value*320).toString(16).padStart(4,"0")}\r\n`;
        case "readAlarmdelaytime":
            return `:06${node}0461076107\r\n`;
        case "writeAlarmdelaytime": // data.value = delaytime in second
            return `:05${node}016107${String(data.value).padStart(2,"0")}\r\n`;
        case "readResetalarmenable":
            return `:06${node}0461096109\r\n`;
        case "writeResetalarmenable": // input: 0-15
            return `:05${node}0161090${data.value.toString(16)}\r\n`;
        case "readCountervalue":
            return `:06${node}0468416841\r\n`;
        case "readCountermode":
            return `:06${node}0468086808\r\n`;
        case "writeCountermode":
            //return `:05${node}016808"00"\r\n`;
        case "readCountersetpointmode":
            return `:06${node}0468056805\r\n`;
        case "writeCountersetpointmode":
            //return `:05${node}016805"01"\r\n`;
        case "writeCounternewsetpoint": // 0-32000 인지 0-3200 인지 확인 필요
            return `:06${node}016826${(data.value*320).toString(16).padStart(4,"0")}\r\n`;
        case "readCounterlimit":
            return `:06${node}0468436843\r\n`;
        case "writeCounterlimit":
            return `:08${node}016843${num_to_float32(data.value)}\r\n`;
        case "readCounterunitindex":
            return `:06${node}0468026802\r\n`;
        case "writeCounterunitindex":
            //return `:05${node}016805"00"\r\n`;
        case "readCounterunit":
            return `:07${node}046867686704\r\n`;
        case "writeCounterunit": //asciitext
            //return `:09${node}01686704"6D6C6E20"\r\n`;
        case "readResetcounterenbale":
            return `:06${node}0468096809\r\n`;
        case "writeResetcounterenable": // input: 0-15
            return `:05${node}016809${data.value.toString(16)}\r\n`;
        case "readCountercontrolleroverruncorrection":
            return `:06${node}04684A684A\r\n`;
        case "writeCountercontrolleroverruncorrection":
            return `:08${node}01684A${num_to_float32(data.value)}\r\n`;
        case "readCountercontrollergain":
            return `:06${node}04684B684B\r\n`;
        case "writeCountercontrollergain":
            return `:08${node}01684B${num_to_float32(data.value)}\r\n`;
        case "readSerialnumber":
            return `:07${node}047163716300\r\n`;
        case "readBhtmodelnumber":
            return `:07${node}047162716200\r\n`;
        case "readFirmwareversion":
            return `:07${node}047165716506\r\n`;
        case "readUsertag":
            return `:07${node}047166716600\r\n`;
        case "readCustomermodel":
            return `:07${node}047164716400\r\n`;
        case "readDevicetype":
            return `:07${node}047161716106\r\n`;
        case "writeReset":
            //return `:05${node}017308"00"\r\n`;
        case "readInitreset":
            return `:06${node}04000A000A\r\n`;
        case "writeInitreset":
            //return `:05${node}01000A"40"\r\n`;
        case "writeWink":
            //return `:06${node}01006001"39"\r\n`;
        case "readIostatus":
            return `:06${node}04720B720B\r\n`;
        case "writeIostatus":
            //return `:05${node}01720B"0F"\r\n`;
        case "readCalibrationmode":
            return `:06${node}0473017301\r\n`;
        case "writeCalibrationmode":
            return `:05${node}017301"FF"\r\n`;
        default:
            error("Check function name");
    }
    
}

export const fromBronkhorst = (str) => {
    const result = {
        type: "bronkhorst",
        dataLength: parseInt(str.slice(1,3), 16),
        node: str.slice(3,5),
        command: Number(str.slice(5,7)),
    };
    result.data = str.slice(7,3+2*result.dataLength);
    if(result.command==0){
        result.status = translateStatus(result.data.slice(0,2));
    } else if(result.command==2){
        switch(result.data.slice(0,4)) {
            case "0121":
                result.status = "measure or setpoint"; //wtf....
                result.value = parseInt(result.data.slice(4,8),16)/320;
                break;
            case "2140":
                result.status = "fmeasure";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "2141":
                result.status = "fsetpoint or slave factor";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "0104":
                result.status = "control mode or calibration mode";
                result.value = result.data.slice(4,6);
                break;
            case "0110":
                result.status = "fluid number";
                result.value = result.data.slice(4,6);
                break;
            case "0171":
                result.status = "fluid name";
                result.value = hexToAscii(result.data.slice(6,26)).trim();
                break;
            case "7241":
                result.status = "valve output";
                result.value = parseInt(result.data.slice(4,12),16)/103459.49;
                break;
            case "2147":
                result.status = "temperature";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "744F":
                result.status = "actual density";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "014D":
                result.status = "capacity max";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "017F":
                result.status = "capacity unit";
                result.value = hexToAscii(result.data.slice(6,20)).trim();
                break;
            case "0114":
                result.status = "alarm info";
                result.value = result.data.slice(4,6);
                break;
            case "6103":
                result.status = "alarm mode";
                result.value = result.data.slice(4,6);
                break;
            case "6121":
                result.status = "alarm maximum or minimum limit";
                result.value = parseInt(result.data.slice(4,8),16)/320;
                break;
            case "6122":
                result.status = "alarm minimum limit";
                result.value = parseInt(result.data.slice(4,8),16)/320;
                break;
            case "6105":
                result.status = "alarm setpoint mode";
                result.value = result.data.slice(4,6);
                break;
            case "6126":
                result.status = "alarm new setpoint";
                result.value = parseInt(result.data.slice(4,8),16)/320;
                break;
            case "6107":
                result.status = "alarm delay time";
                result.value = result.data.slice(4,6);
                break;
            case "6109":
                result.status = "reset alarm enable";
                result.value = result.data.slice(4,6);
                break;
            case "6841":
                result.status = "counter value";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "6808":
                result.status = "counter mode";
                result.value = result.data.slice(4,6);
                break;
            case "6805":
                result.status = "counter setpoint mode or counter unit index";
                result.value = result.data.slice(4,6);
                break;
            case "6843":
                result.status = "counter limit";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "6802":
                result.status = "counter unit index";
                result.value = result.data.slice(4,6);
                break;
            case "6867":
                result.status = "counter unit";
                result.value = hexToAscii(result.data.slice(6,14)).trim();
                break;
            case "6809":
                result.status = "reset counter enable";
                result.value = result.data.slice(4,6);
                break;
            case "684A":
                result.status = "counter controller overrun correction";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "684B":
                result.status = "counter controller gain";
                result.value = float32_to_num(result.data.slice(4,12));
                break;
            case "7163":
                result.status = "serial number";
                result.value = hexToAscii(result.data.slice(6,result.data.length)).trim();
                break;
            case "7162":
                result.status = "bhtmodel number";
                result.value = hexToAscii(result.data.slice(6,result.data.length)).trim();
                break;
            case "7165":
                result.status = "firmware version";
                result.value = hexToAscii(result.data.slice(6,result.data.length)).trim();
                break;
            case "7166":
                result.status = "usertag";
                result.value = hexToAscii(result.data.slice(6,result.data.length)).trim();
                break;
            case "7164":
                result.status = "customer model";
                result.value = hexToAscii(result.data.slice(6,result.data.length)).trim();
                break;
            case "7161":
                result.status = "device type";
                result.value = hexToAscii(result.data.slice(6,result.data.length)).trim();
                break;
            case "000A":
                result.status = "initreset";
                result.value = result.data.slice(4,6);
                break;
            case "720B":
                result.status = "iostatus";
                result.value = result.data.slice(4,6);
                break;
            case "7301":
                result.status = "calibration mode";
                result.value = result.data.slice(4,6);
                break;
            default:
                result.status = "unknown status";
                result.value = result.data.slice(4,result.data.length);
        }
        return result;
    }
}

const translateStatus = (str) => {
    switch(str) {
        case "00":
            return "No error";
        case "01":
            return "Process claimed";
        case "02":
            return "Command error";
        case "03":
            return "Process error";
        case "04":
            return "Parameter error";
        case "05":
            return "Parameter type error";
        case "06":
            return "Parameter value error";
        case "07":
            return "Network not active";
        case "08":
            return "Time-out start character";
        case "09":
            return "Time-out serial line";
        case "0A":
            return "Hardware memory error";
        case "0B":
            return "Node number error";
        case "0C":
            return "General communication error";
        case "0D":
            return "Read only parameter";
        case "0E":
            return "Error PC-communication";
        case "0F":
            return "No RS232 connection";
        case "10":
            return "PC out of memory";
        case "11":
            return "Write only parameter";
        case "12":
            return "System configuration unknown";
        case "13":
            return "No free node address";
        case "14":
            return "Wrong interface type";
        case "15":
            return "Error serial port connection";
        case "16":
            return "Error opening communication";
        case "17":
            return "Communication error";
        case "18":
            return "Error interface bus master";
        case "19":
            return "Timeout answer";
        case "1A":
            return "No start character";
        case "1B":
            return "Error first digit";
        case "1C":
            return "Buffer overflow in host";
        case "1D":
            return "Buffer overflow";
        case "1E":
            return "No answer found";
        case "1F":
            return "Error closing communication";
        case "20":
            return "Synchronisation error";
        case "21":
            return "Send error";
        case "22":
            return "Protocol error";
        case "23":
            return "Buffer overflow in module";
    }
}

const hexToAscii = (str) => {
    const hexString = str;
    let strOut = '';
        let x = 0;
        for (x = 0; x < hexString.length; x += 2) {
            strOut += String.fromCharCode(parseInt(hexString.substr(x, 2), 16));
        }
    return strOut;
}