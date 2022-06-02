import React, {useState, useEffect} from 'react'
// import { Player } from 'video-react';
import {Button} from  'react-bootstrap';
import Header from '../Header';
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
const TIMEZONE = "Asia/Ho_Chi_Minh"
const ADA_KEY = "aio_ivOa26esimegQ6vCHcXcl8EP1giL"
// const ADA_KEY = "aio_ygFe607ZEonhHKyeY6r63p2wCHIC"
// const DOOR = 
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
    const [colorAC, setColorAC] = useState('danger')
    const [colorBulb, setColorBulb] = useState('danger')
    const [lightRecords, setLightRecords] = useState([])
    const [tempRecords, setTempRecords] = useState([])

    useEffect(() => {

        axios.get(URL_BACKEND).then(res => {setMessage(res.data)}).catch(err => {console.log(err)})

        axios.get("https://io.adafruit.com/api/v2/DucLe/feeds/ducle-test-led").then(res => {
                console.log(res.data)
            }).catch(err => {console.log(err)})
    },[message.length])

    useEffect(() => {
        let interval = null;
        let data_device;
        interval = setInterval(() => {
            axios.get(`https://io.adafruit.com/api/v2/DucLe/feeds?x-aio-key=` + ADA_KEY).then(res => {
                console.log(res)
                data_device = res.data
                let newAC = data_device.filter(item => item.key === 'ducle-ac')[0].last_value
                let newBulb = data_device.filter(item => item.key === 'ducle-test-led')[0].last_value
                setAC(newAC)
                setBulb(newBulb)
                
                setColorAC(newAC === 1 ? 'success' : 'danger')
                setColorBulb(newBulb === 1 ? 'success' : 'danger')
            }).catch(err => {console.log(err)})
            axios.get(URL_BACKEND_FETCH_LIGHT_RECORDS).then(res => {
                let light = res.data
                if (light)
                    setLightRecords(light)
            }).catch(err => {console.log(err)})
            axios.get(URL_BACKEND_FETCH_TEMP_RECORDS).then(res => {
                let temp = res.data
                if (temp)
                    setTempRecords(temp)
            }).catch(err => {console.log(err)})
        }, 5000); 
        
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
        axios.post("https://io.adafruit.com/api/v2/DucLe/feeds/ducle-ac/data", {"value": newAC}, 
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
        await axios.post("https://io.adafruit.com/api/v2/DucLe/feeds/ducle-test-led/data", {"value": newBulb},
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
            <Header />
            <div className='main'>
                <div className='main-container'>
                    {/* <div className='video'> */}
                    {/* <Player
                        playsInline
                        poster="/assets/poster.png"
                        // src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                        src = "https://9be4-115-78-8-83.ngrok.io/video"
                    />    */}
                    {/* </div> */}
                    <AreaChart records={lightRecords} title="Light records"/>
                    <AreaChart records={tempRecords} title="Temp records"/>
                    <div className='current-state'>
                        <div className='door'>Current ac:  <AC option={parseInt(ac)} /></div>
                        <div className='bulb'>Current bulb:  <Bulb option={parseInt(bulb)} /></div>
                    </div>
                    <div className='info'>
                        <div className='door'>State of ac:  <AC option={parseInt(ac)} /></div>
                        <div className='bulb'>State of bulb:  <Bulb option={parseInt(bulb)} /></div>
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
