import $ from "jquery";
//import crypto-js library to create hash
import md5 from "crypto-js/md5";
//import moment library for timestamp formatting
import moment from "moment";

/*gravatar stuff*/
//create and associate the hash with user
function createGravatarUrl(username) {
  let userhash = md5(username);
  return `http://www.gravatar.com/avatar/${userhash.toString()}`;
}

/*promt for current user*/
export function promptForUsername() {
  //prompt function is built into browser and returns a string
  let username = prompt("Enter a username");
  return username.toLowerCase();
}

/*handle outgoing messages*/
//add keyword export before class ChatForm
export class ChatForm {
  constructor(formSel, inputSel) {
    this.$form = $(formSel);
    this.$input = $(inputSel);
  }


  //ChatForm's init method accepts a callback, used to handle form submissions
  init(submitCallback) {
    //use arrow function for submit handler
    this.$form.submit((event) => {
      //contents of arrow function
      event.preventDefault();
      //val holds the data from the input field
      let val = this.$input.val();
      //pass the contents of input field to the callback passed in
      submitCallback(val);
      //reset the value of the input field
      this.$input.val("");
    });
    //single expression form of arrow function allows omission of curly braces.
    //submit the form when button is clicked
    this.$form.find("button").on("click", () => this.$form.submit());
  }
}

/*creat new DOM elements for message and append i.e. display incoming messages*/
export class ChatList {
  constructor(listSel, username) {
    this.$list = $(listSel);
    this.username = username;
  }

  //create a DOM element with username, timestamp, message.

  //appends message to ChatList's listSel
  drawMessage({user: u, timestamp: t, message: m}) {
    let $messageRow = $("<li>", {
      "class": "message-row"
    });

    //if you are the sender, add exra CSS class for styling.
    if (this.username === u) {
      $messageRow.addClass("me");
    }

    let $message = $("<p>");

    //append the username
    $message.append($("<span>", {
      "class": "message-username",
      text: u
    }));

    //append the current time
    $message.append($("<span>", {
      "class": "timestamp",
      "data-time": t,
      text: moment(t).fromNow()
    }));

    //append the actual message
    $message.append($("<span>", {
      "class": "message-message",
      text: m
    }));

    /*gravatar stuff*/
    //create the gravatar element
    let $img = $("<img>", {
      src: createGravatarUrl(u),
      title: u
    });
    //append the gravatar to messageRow
    $messageRow.append($img);

    /*back to appending the other stuff*/
    //append message to messageRow
    $messageRow.append($message);
    //append messageRow to ChatList's listSel
    this.$list.append($messageRow);
    //scrolls to new message
    $messageRow.get(0).scrollIntoView();
  }

  //timestamp formatting
  init() {
    this.timer = setInterval(() => {
      $("[dat-time]").each((idx, element) => {
        let $element = $(element);
        let timestamp = new Date().setTime($element.attr("date-time"));
        let ago = moment(timestamp).fromNow();
        $element.html(ago);
      });
    }, 1000);
  }
}
