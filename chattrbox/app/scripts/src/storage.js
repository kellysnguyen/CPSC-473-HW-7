//remembers the result of promptForUsername()

//pass in which storage API to use (either localStorage or sessioStorage) when instantiating a Store
//localStorage remembers username after browser window is closed
//session only remembers while browser is open
//note that there are references to key property,
//but key is not defined here, so Store must be used with a subclass.
class Store {
  constructor(storageApi) {
    this.api = storageApi;
  }
  get() {
    return this.api.getItem(this.key);
  }
  set(value) {
    this.api.setItem(this.key, value);
  }
}

//UserStore is a subclass of Store
export class UserStore extends Store {
  constructor(key) {
    //super() invokes the Store constructor, passing a reference to sessionStorage
    super(sessionStorage);
    //set the value of this.key
    this.key = key;
  }
}
