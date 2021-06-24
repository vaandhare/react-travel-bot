import React, { Component,  createRef } from "react";

import "./chatContent.css";
import ChatItem from "./ChatItem";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


export default class ChatContent extends Component {
  messagesEndRef = createRef(null);

  userID = uuidv4();

  chatItms = [
    {
      type: "bot",
      msg: "Hey buddy, How are you?",
      payload: ""
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      chat: this.chatItms,
      msg: "",
    };
  }

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  addMsgToList = (user, message, payload) => {
    this.chatItms.push({
      type: user,
      msg: message,
      payload: payload ? payload : "",
    });
    if(user === ""){
      this.callAPI(message);
    }
    this.setState({ chat: [...this.chatItms] });
    this.scrollToBottom();
    this.setState({ msg: "" });
  }
  // https://eritodypimrnlu.herokuapp.com/webhooks/rest/webhook
  callAPI(msg){
    axios.post(`https://6e8b08983ec4.ngrok.io/webhooks/rest/webhook`, { sender: this.userID, message: msg })
    .then(res => {
      console.log(res);
      console.log(msg);
      if(res.data != ""){
        res.data.map(msgs =>{
          if(msgs.text !== "" || !msgs.text.isEmpty())
          this.addMsgToList("bot", msgs.text, "");
          if(msgs.buttons){
            msgs.buttons.map(btn =>{
              this.addMsgToList("option", btn.title, btn.payload);
            })
          }
          if(msgs.image){
            this.addMsgToList("image", msgs.image, "");
          }
        }) 
      }
    })
  }


  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) {
        if (this.state.msg != "") {
          var message = this.state.msg;
            this.addMsgToList("",message , "");
            }
          }
    });
    this.scrollToBottom();
  }
  
  onStateChange = (e) => {
    this.setState({ msg: e.target.value });
  };

  render() {
    return (
      <div className="main__chatcontent">
        <div className="content__header">
          <div className="blocks">
              <p><b style={{fontSize: '18px'}}>TravelBot</b> - <i>Your personal travel assistant.</i></p>
          </div>
        </div>
        <div className="content__body">
          <div className="chat__items">
            {this.state.chat.map((itm, index) => {
              return (
                <div onClick={() => (itm.type === "option") ?  this.addMsgToList("", itm.payload, "") : ""}>
                  <ChatItem
                    animationDelay={index + 2}
                    key={itm.key}
                    user={itm.type ? itm.type : "me"}
                    msg={itm.msg}
                    payload={itm.payload}
                  />
                </div>
              );
            })}
            <div ref={this.messagesEndRef} />
          </div>
        </div>
        <div className="content__footer">
          <div className="sendNewMessage">
            <input
              type="text"
              placeholder="Ask travel bot here...."
              onChange={this.onStateChange}
              value={this.state.msg}
            />
          </div>
        </div>
      </div>
    );
  }
}