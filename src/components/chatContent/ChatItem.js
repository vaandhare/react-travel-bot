import React, { Component } from "react";

export default class ChatItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        <div className="chat__item__content">
          <div className="chat__msg">
            {
             (this.props.user === "image") ?           
              <img src={this.props.msg} alt="#" style={{maxHeight: '250px', maxWidth: '100%', borderRadius: "10px"}} />
              : this.props.msg
            }</div>
        </div>
        {
          (this.props.user === "bot") ?
          <img src="/bot.jpg" alt="#" style={{maxHeight: '40px', maxWidth: '40px', marginRight: "10px", borderRadius: "30px"}} />
          : ""
         }
      </div>
    );
  }
}