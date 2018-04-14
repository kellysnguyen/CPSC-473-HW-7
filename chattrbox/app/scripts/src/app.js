/*import modules*/
//syntax: import {constructor1, constructor2, function1} from "./filename";
import socket from "./ws-client";
import {UserStore} from "./storage";
import {ChatForm, ChatList, promptForUsername} from "./dom";

/*declare constants*/

//constants for ChatForm, the message input + sending module
//selects the form
const FORM_SELECTOR = "[data-chat=\"chat-form\"]";
//selects the submit button
const INPUT_SELECTOR = "[data-chat=\"message-input\"]";

//constants for ChatList, the incoming message displayin module
//selects where to append the new DOM elements i.e. new messages
const LIST_SELECTOR = "[data-chat=\"message-list\"]";

/*retain value of username returned by promptForUsername*/
let userStore = new UserStore("x-chattrbox/u");
let username = userStore.get();
if(!username) {
  username = promptForUsername();
  userStore.set(username);
}

//handles displaying incoming messages and packaging and sending outgoing messages submitted via form.
class ChatApp {
  constructor() {
    /*handle outgoing messages*/
    //create instance of ChatForm called chatForm
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    //create instance of ChatList called ChatList
    this.chatList = new ChatList(LIST_SELECTOR, username);

    //open socket connection to server
    socket.init("ws://localhost:3001");

    socket.registerOpenHandler(() => {

      /*the text input collected from instance of ChatForm is
      passed into the arrow function (form submission callback),
      which is passed into init() method,
      which is used to created the JSON-format message.
      The JSON message is then sent to the WebSockets server*/
      this.chatForm.init((text) => {
        //create instance of ChatMessage
        let message = new ChatMessage({ message: text });
        //send the JSON message to WebSockets server
        socket.sendMessage(message.serialize());
      });
      this.chatList.init();
    });

    /*handle incoming messages, i.e. display new messages from server*/
    socket.registerMessageHandler((data) => {
      console.log(data);
      //make a new ChatMessage with incoming data
      let message = new ChatMessage(data);
      //serialize strips away extra metadata, drawMessage() adds new message into browser
      this.chatList.drawMessage(message.serialize());
    });
  }
}

//class representing individual chat messages
class ChatMessage {
  constructor({
    message: m,
    user: u = username,
    timestamp: t = (new Date()).getTime()
  }) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
  }

  serialize() {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}
export default ChatApp;
