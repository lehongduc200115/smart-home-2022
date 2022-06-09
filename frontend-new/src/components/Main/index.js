// import React, { useState, useEffect } from 'react';
// import { Button } from 'react-bootstrap';
// import axios from 'axios';
// // import moment from 'moment';
// import moment from 'moment-timezone';
// import AreaChart from '../AreaChart';

// function Message(props) {
//   const s = props.message;
//   const action = props.message.requestType;
//   const subject = props.message.createdBy;

//   // Hệ thống AI đã yêu cầu mở cửa
//   console.log(typeof s.createdAt);
//   return (
//     <>
//       <div className="message">
//         {subject} đã yêu cầu {action}
//         <div className="time">{convertDate(s.createdAt)}</div>
//       </div>
//     </>
//   );
// }

// function Threshold(props) {
//   if (props.option === -1) {
//     return <span style={{ color: 'blue' }}>Not set</span>;
//   }
//   if (props.option <= props.cur) {
//     return (
//       <span style={{ color: 'red' }}>
//         Alert! Above threshold {props.option}, current: {props.cur}
//       </span>
//     );
//   }
//   return (
//     <span style={{ color: 'green' }}>
//       Normal: {props.option}, current: {props.cur}
//     </span>
//   );
// }

// function AC(props) {
//   switch (props.option) {
//     case 0:
//       return <span style={{ color: 'red' }}>OFF</span>;
//     case 1:
//       return <span style={{ color: 'green' }}>ON</span>;
//     default:
//       return <span style={{ color: 'blue' }}>SOMETHING WRONG??</span>;
//   }
// }

// function Bulb(props) {
//   switch (props.option) {
//     case 0:
//       return <span style={{ color: 'red' }}>OFF</span>;
//     case 1:
//       return <span style={{ color: 'green' }}>ON</span>;
//     default:
//       return <span style={{ color: 'blue' }}>SOMETHING WRONG??</span>;
//   }
// }

// const URL_BACKEND = 'http://localhost:8080/api/requests';
// const URL_BACKEND_POST = 'http://localhost:8080/api/request';
// const URL_BACKEND_FETCH_LIGHT_RECORDS = 'http://localhost:8080/api/lights';
// const URL_BACKEND_FETCH_TEMP_RECORDS = 'http://localhost:8080/api/temps';
// const URL_BACKEND_FETCH_THRESHOLD_TEMP = 'http://localhost:8080/api/thresholds/temp';
// const URL_BACKEND_FETCH_THRESHOLD_LIGHT = 'http://localhost:8080/api/thresholds/light';
// const TIMEZONE = 'Asia/Ho_Chi_Minh';

// // const ADA_KEY = "aio_ivOa26esimegQ6vCHcXcl8EP1giL"
// const ADA_USERNAME = 'duyvu1109';
// // const ADA_USERNAME = "DucLe"
// const ADA_KEY = 'aio_DkoA93OPoHwO5xR5Debh8fvEmO0i';
// const BTN_FAN = 'btt-fan';
// // const BTN_FAN = 'ducle-ac'
// const BTN_LED = 'btt-led';
// // const BTN_LED = 'ducle-test-led'
// const LIGHT_SENSOR = 'bbc-light';
// const TEMP_SENSOR = 'bbc-temp';

// function convertDate(s) {
//   // s: string
//   const date = moment(s);
//   return date.tz(TIMEZONE).format('h:mm:ss A, DD/MM/YYYY');
// }

// export default function Main() {
//   // Object + timestamp
//   const [message, setMessage] = useState([]);
//   const [ac, setAC] = useState(0);
//   const [bulb, setBulb] = useState(0);
//   const [thresholdTemp, setThresholdTemp] = useState(-1);
//   const [thresholdLight, setThresholdLight] = useState(-1);
//   const [curLight, setCurLight] = useState(-1);
//   const [curTemp, setCurTemp] = useState(-1);
//   const [colorAC, setColorAC] = useState('danger');
//   const [colorBulb, setColorBulb] = useState('danger');
//   const [lightRecords, setLightRecords] = useState([]);
//   const [tempRecords, setTempRecords] = useState([]);

//   useEffect(() => {
//     axios
//       .get(URL_BACKEND)
//       .then((res) => {
//         setMessage(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     axios
//       .get(`https://io.adafruit.com/api/v2/${ADA_USERNAME}/feeds/${BTN_LED}?x-aio-key=${ADA_KEY}`)
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [message.length]);

//   useEffect(() => {
//     let interval = null;
//     let dataDevice;
//     interval = setInterval(() => {
//       axios
//         .get(`https://io.adafruit.com/api/v2/${ADA_USERNAME}/feeds?x-aio-key=${ADA_KEY}`)
//         .then((res) => {
//           console.log(res);
//           dataDevice = res.data;
//           const newAC = dataDevice.filter((item) => item.key === BTN_FAN)[0].last_value;
//           const newBulb = dataDevice.filter((item) => item.key === BTN_LED)[0].last_value;
//           setAC(newAC);
//           setBulb(newBulb);

//           setColorAC(newAC === 1 ? 'success' : 'danger');
//           setColorBulb(newBulb === 1 ? 'success' : 'danger');
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//       axios
//         .get(URL_BACKEND_FETCH_LIGHT_RECORDS)
//         .then((res) => {
//           const light = res.data;
//           if (light) {
//             setLightRecords(light);
//             setCurLight(light[0].value);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//       axios
//         .get(URL_BACKEND_FETCH_TEMP_RECORDS)
//         .then((res) => {
//           const temp = res.data;
//           if (temp) {
//             setTempRecords(temp);
//             setCurTemp(temp[0].value);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//       axios
//         .get(URL_BACKEND_FETCH_THRESHOLD_TEMP)
//         .then((res) => {
//           const temp = res.data;
//           if (temp && temp.length) setThresholdTemp(temp[0].value);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//       axios
//         .get(URL_BACKEND_FETCH_THRESHOLD_LIGHT)
//         .then((res) => {
//           const temp = res.data;
//           if (temp && temp.length) setThresholdLight(temp[0].value);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   const messageItem = message.map((item) => {
//     return <Message key={item._id} message={item} />;
//   });

//   async function handleAC() {
//     const newAC = ac === 1 ? 0 : 1;
//     const obj = {
//       requestType: newAC === 1 ? 'AC_ON' : 'AC_OFF',
//       requestStatus: 'SUCCESS',
//       status: 'ACTIVE',
//     };
//     axios
//       .post(URL_BACKEND_POST, obj)
//       .then(console.log('inserted ac'))
//       .catch((err) => {
//         console.log(err);
//       });
//     axios
//       .post(
//         `https://io.adafruit.com/api/v2/${ADA_USERNAME}/feeds/${BTN_FAN}/data`,
//         { "value": newAC },
//         {
//           headers: {
//             'X-AIO-Key': ADA_KEY,
//           },
//         }
//       )
//       .catch((err) => {
//         console.log(err);
//       });

//     axios
//       .get(URL_BACKEND)
//       .then((res) => {
//         setMessage(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   async function handleBulb() {
//     const newBulb = bulb === 0 ? 1 : 0;
//     const obj = {
//       requestType: newBulb === 1 ? 'LIGHT_ON' : 'LIGHT_OFF',
//       requestStatus: 'SUCCESS',
//       status: 'ACTIVE',
//     };
//     await axios
//       .post(URL_BACKEND_POST, obj)
//       .then(console.log('inserted light'))
//       .catch((err) => {
//         console.log(err);
//       });
//     await axios
//       .post(
//         `https://io.adafruit.com/api/v2/${ADA_USERNAME}/feeds/${BTN_LED}/data`,
//         { "value": newBulb },
//         {
//           headers: {
//             'X-AIO-Key': ADA_KEY,
//           },
//         }
//       )
//       .catch((err) => {
//         console.log(err);
//       });

//     axios
//       .get(URL_BACKEND)
//       .then((res) => {
//         setMessage(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   return (
//     <>
//       {/* <Header /> */}
//       <div className="main">
//         <div className="main-container">
//           <div className="video">
//             <div>
//               Threshold temp: <Threshold option={parseInt(thresholdTemp, 10)} cur={parseInt(curTemp, 10)} />
//             </div>
//             <div>
//               Threshold light: <Threshold option={parseInt(thresholdLight, 10)} cur={parseInt(curLight, 10)} />
//             </div>
//           </div>
//           <div className="chatbox input">
//             <div className="title">HISTORY REQUEST</div>
//             <div className="scroll-bar">{messageItem}</div>
//           </div>
//           <div className="info">
//             <div className="door">
//               State of fan: <AC option={parseInt(ac, 10)} />
//             </div>
//             <div className="bulb">
//               State of bulb: <Bulb option={parseInt(bulb, 10)} />
//             </div>
//           </div>
//           <div className="control">
//             <div>
//               <Button variant={colorAC} className="btn-1" onClick={() => handleAC()}>
//                 AC Toggle
//               </Button>
//             </div>

//             <div>
//               <Button variant={colorBulb} className="btn-1" onClick={() => handleBulb()}>
//                 Bulb Toggle
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


//----
import React, {useState, useEffect} from 'react'
// import { Player } from 'video-react';
import {Button} from  'react-bootstrap';
import axios from 'axios';
// import moment from 'moment';
import moment from 'moment-timezone';
import AreaChart from '../AreaChart';

function Message(props){
    var s = props.message, subject, action;
    action = props.message.requestType
    subject = props.message.createdBy

    // Hệ thống AI đã yêu cầu mở cửa
    console.log(typeof(s.createdAt))
    return(
        <>
            <div className="message">
                {subject} đã yêu cầu {action} 
                <div className="time">{convertDate(s.createdAt)}</div>
            </div>
            
        </>
        
    )
}

function Threshold(props) {
    if (props.option === -1) {
        return <span style={{color: "blue"}}>Not set</span>
    } else if (props.option <= props.cur) {
        return <span style={{color: "red"}}>Alert! Above threshold {props.option}, current: {props.cur}</span>
    } else {
        return <span style={{color: "green"}}>Normal: {props.option}, current: {props.cur}</span>
    }
}

function AC(props){
    switch(props.option){
        case 0:
            return <span style={{color: "red"}}>Close</span>
        case 1:
            return <span style={{color: "green"}}>OPEN</span>
        default:
            return <span style={{color: "blue"}}>SOMETHING WRONG??</span>
    }
}

function Bulb(props){
    if(props.option === 0){
        return <span style={{color: "red"}}>Off</span>
    }else if(props.option === 1){
        return <span style={{color: "green"}}>On</span>
    } else {
        return <span style={{color: "blue"}}>abc</span>
    }
}

const URL_BACKEND = 'http://localhost:8080/api/requests'
const URL_BACKEND_POST = 'http://localhost:8080/api/request'
const URL_BACKEND_FETCH_LIGHT_RECORDS = 'http://localhost:8080/api/lights'
const URL_BACKEND_FETCH_TEMP_RECORDS = 'http://localhost:8080/api/temps'
const URL_BACKEND_FETCH_THRESHOLD_TEMP = 'http://localhost:8080/api/thresholds/temp'
const URL_BACKEND_FETCH_THRESHOLD_LIGHT = 'http://localhost:8080/api/thresholds/light'
const TIMEZONE = "Asia/Ho_Chi_Minh"

// const ADA_KEY = "aio_ivOa26esimegQ6vCHcXcl8EP1giL"
const ADA_USERNAME = "duyvu1109"
// const ADA_USERNAME = "DucLe"
const ADA_KEY = "aio_DkoA93OPoHwO5xR5Debh8fvEmO0i"
const BTN_FAN = 'btt-fan'
// const BTN_FAN = 'ducle-ac'
const BTN_LED = 'btt-led'
// const BTN_LED = 'ducle-test-led'
const LIGHT_SENSOR = 'bbc-light'
const TEMP_SENSOR = 'bbc-temp'

function convertDate(s){
    // s: string
    let date = moment(s)
    return date.tz(TIMEZONE).format('h:mm:ss A, DD/MM/YYYY')
}

export default function Main() {
    // Object + timestamp
    const [message, setMessage] = useState([])
    const [ac, setAC] = useState(0)
    const [bulb, setBulb] = useState(0)
    const [thresholdTemp, setThresholdTemp] = useState(-1)
    const [thresholdLight, setThresholdLight] = useState(-1)
    const [curLight, setCurLight] = useState(-1)
    const [curTemp, setCurTemp] = useState(-1)
    const [colorAC, setColorAC] = useState('danger')
    const [colorBulb, setColorBulb] = useState('danger')
    const [lightRecords, setLightRecords] = useState([])
    const [tempRecords, setTempRecords] = useState([])

    useEffect(() => {

        axios.get(URL_BACKEND).then(res => {setMessage(res.data)}).catch(err => {console.log(err)})

        axios.get(`https://io.adafruit.com/api/v2/${ADA_USERNAME}/feeds/${BTN_LED}`).then(res => {
                console.log(res.data)
            }).catch(err => {console.log(err)})
    },[message.length])

    useEffect(() => {
    let interval = null;
        let data_device;
        interval = setInterval(() => {
            axios.get(`https://io.adafruit.com/api/v2/${ADA_USERNAME}/feeds?x-aio-key=` + ADA_KEY).then(res => {
                console.log(res)
                data_device = res.data
                let newAC = data_device.filter(item => item.key === BTN_FAN)[0].last_value
                let newBulb = data_device.filter(item => item.key === BTN_LED)[0].last_value
                setAC(newAC)
                setBulb(newBulb)
                
                setColorAC(newAC === 1 ? 'success' : 'danger')
                setColorBulb(newBulb === 1 ? 'success' : 'danger')
            }).catch(err => {console.log(err)})
            axios.get(URL_BACKEND_FETCH_LIGHT_RECORDS).then(res => {
                let light = res.data
                if (light) {
                    setLightRecords(light)
                    setCurLight(light[0].value)
                }
            }).catch(err => {console.log(err)})
            axios.get(URL_BACKEND_FETCH_TEMP_RECORDS).then(res => {
                let temp = res.data
                if (temp) {
                    setTempRecords(temp)
                    setCurTemp(temp[0].value)
                }
            }).catch(err => {console.log(err)})
            axios.get(URL_BACKEND_FETCH_THRESHOLD_TEMP).then(res => {
                let temp = res.data
                if (temp && temp.length)
                    setThresholdTemp(temp[0].value)
            }).catch(err => {console.log(err)})
            axios.get(URL_BACKEND_FETCH_THRESHOLD_LIGHT).then(res => {
                let temp = res.data
                if (temp && temp.length)
                    setThresholdLight(temp[0].value)
            }).catch(err => {console.log(err)})
        }, 2500); 
        
        return () => clearInterval(interval);
      }, []);
    

    const message_item = message.map((item) => {
        return <Message key={item._id} message={item} />

    })

    async function handleAC(){
        let newAC = (ac == 1) ? 0 : 1
        let obj = {
            requestType: newAC == 1 ? "AC_ON" : "AC_OFF",
            requestStatus: "SUCCESS",
            status: "ACTIVE"
        }
        axios.post(URL_BACKEND_POST, obj).then(console.log('inserted ac')).catch(err => {console.log(err)})
        axios.post(`https://io.adafruit.com/api/v2/${ADA_USERNAME}/feeds/${BTN_FAN}/data`, {"value": newAC}, 
        {
            headers: {
                'X-AIO-Key': ADA_KEY
            }
        }
        ).catch(err => {console.log(err)})

        axios.get(URL_BACKEND).then(res => {setMessage(res.data)}).catch(err => {console.log(err)})
    }

    async function handleBulb(){
        let newBulb = (bulb == 0) ? 1 : 0
        let obj = {
            requestType: newBulb == 1 ? "LIGHT_ON" : "LIGHT_OFF",
            requestStatus: "SUCCESS",
            status: "ACTIVE"
        }
        await axios.post(URL_BACKEND_POST, obj).then(console.log('inserted light')).catch(err => {console.log(err)})
        await axios.post(`https://io.adafruit.com/api/v2/${ADA_USERNAME}/feeds/${BTN_LED}/data`, {"value": newBulb},
        {
            headers: {
                'X-AIO-Key': ADA_KEY
            }
        }
        ).catch(err => {console.log(err)})

        axios.get(URL_BACKEND).then(res => {setMessage(res.data)}).catch(err => {console.log(err)})

    }
    return (
        <>
            <div className='main'>
                <div className='main-container'>
                    {/* <AreaChart records={lightRecords} title="Light records"/>
                    <AreaChart records={tempRecords} title="Temp records"/> */}
                    <div className='info'>
                        <div className='door'>State of ac:  <AC option={parseInt(ac)} /></div>
                        <div className='bulb'>State of bulb:  <Bulb option={parseInt(bulb)}/></div>
                    </div>
                    <div>
                        <div>Threshold temp:  <Threshold option={parseInt(thresholdTemp)} cur={parseInt(curTemp)}/></div>
                        <div>Threshold light:  <Threshold option={parseInt(thresholdLight)} cur={parseInt(curLight)} /></div>
                    </div>
                    <div className='control'>
                        <Button variant={colorAC} className="btn-1" onClick={() => handleAC()}>AC Switcher</Button> 
                        <Button variant={colorBulb} className="btn-1" onClick={() => handleBulb()}>Bulb Switcher</Button>
                    </div>
                    <div className='chatbox input'>
                        <div className="title">
                            HISTORY REQUEST
                        </div>
                        <div className='scroll-bar'>
                            {message_item}
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}
