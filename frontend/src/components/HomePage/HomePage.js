import React from "react";
import "./homepage.css";


const HomePage = () => {
    return (
    
        <div>
        <div className="list">
                    <a style={{"float":"left",'marginLeft':"60vw"}} href="homepage"><h1 className="font2 font3">HOME</h1></a>
                    <a style={{"float":"left",'marginLeft':"3vw"}} href="#"><h1 className="font2 font3">ABOUT US</h1></a>
                    <a style={{"float":"left",'marginLeft':"4vw"}} href="#"><h1 className="font2 font3">DASHBOARD</h1></a>
                    <a style={{"float":"left",'marginLeft':"5.5vw"}} href="login"><h1 className="font2 font3">LOGIN</h1></a>
            </div>
        
        <div style={{"marginTop":"10vw","marginLeft":"10vw"}}>
            <h1 className="font">SmartHome<br/>BK2022</h1>
        </div>
        <div style={{"marginTop":"8vw","marginLeft":"10vw"}}>
            <h1 className="font1">Thực tập đồ án đa ngành</h1>
        </div>
        <div style={{"marginTop":"3vw"}}>
            <div style={{"marginLeft":"10vw","float":"left"}}>
                <a style={{"textDecoration":"none"}} href="#" className="button"><h1 className="font2">Our Project</h1></a>
                </div >
            <div style={{"marginLeft":"20vw"}}>
                <a style={{"textDecoration":"none"}} href="#" className="button button1"><h1 className="font2 font3">Contact us</h1></a>
                </div >
        </div>
    </div>
   


        );
    };
    
export default HomePage;