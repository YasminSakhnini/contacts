let NEWCONTACT = 1;
// helper functions
function $(selector) {
  return document.querySelectorAll(selector)[0]
}
function create(element) {
  return document.createElement(element)
}


class BaseHTML {
  constructor() {
    // reset root to empty
    let root = $('#root')
    root.innerHTML = ''

    // main wrapper
    let mainWrapper = create('section')
    mainWrapper.setAttribute('class', 'main-wrapper flex colum')

    // logo
    let logo = create('div')
    logo.setAttribute('class', 'logo')
    logo.innerHTML = 'Contact Book'

    //add new contact form
    let newContactForm = create('section')
    newContactForm.setAttribute('class', 'flex-parent newContactForm')


    //contact list section
    let contacts = create('section')
    contacts.setAttribute('class', 'contacts flex-parent')

    //append stuff
    mainWrapper.append(logo)
    mainWrapper.append(newContactForm)
    mainWrapper.append(contacts)
    root.append(mainWrapper)
  }
}
//create base HTML in #root
new BaseHTML()

//Add new contact form 
if (NEWCONTACT) {
  class newContactForm {
    constructor(htmlSelector) {
      this.rootElement = htmlSelector
      this.state = {
        name: 'JAZ',
        phone: ['0728363933'],
        email: ['siko@fireBird.se']
      }
      this.render()
    }
    read() {
      return this.state
    }

    update(newObject, action = '') {
      // console.warn("I will update my instance state with whatever data you sent in")
      Object.assign(this.state, newObject)
      if (!action) {
        this.render()
      }
      return;
    }

    clear() {
      this.state = {
        name: '',
        phone: [],
        email: []
      }
      this.render()
    }
    // let flexChildrenWeapper = create('div')
    render() {
      let createListItems = (type) => {
        let html = '';

        this.state[type].map((item, i) => {
          html += `
          <li> 
            <div class="flex-row">
                ${item}<button class="deleteListItem" data-type="${type}" data-key="${i}">x</button>
            </div>
          </li>
          `
        })
        //we must return something
        return html
      }
      let root = $(this.rootElement);
      let newContactTemplate =
        `
          <div class="flex-children newContactForm">
            <div class="inputs">
              <div>
              Name
              <input type="text" class="newContactName" value="${this.state.name}">
            </div>
            <div class="newContactPhoneList w-100">
              <ul>
                ${createListItems('phone')}
              </ul>
            </div>
            <div class="newContactEmailList w-100">
              <ul>
                ${createListItems('email')}
              </ul>
            </div>
          </div>
          <div class="buttons">
        <button class="newContactCancel">Cancel</button>
        <button type="numbeewer" class="newContactAddPhone">+ phone</button>
        <button type="email" class="newContactAddEmail">+ email</button>
        <button class="newContactSave">Save</button>
      </div>
    </div>
    `
      root.innerHTML = newContactTemplate
    }
  }
  //''''''''''''''''''Y we sent the class .newContactForm here!
  let newForm = new newContactForm('.newContactForm');
  // Even Listener for Add new contact form
  listen('click', '.newContactCancel', e => {
    newForm.clear()
  });

  listen('click', '.newContactAddPhone', e => {
    let number = prompt('please insert your number!')
    let currentState = newForm.read()
    if (number) {
      currentState.phone.push(number)
      newForm.update(currentState)
    }
  })

  listen('click', '.newContactAddEmail', e => {
    let email = prompt('Bliz insert your email!')
    let currentState = newForm.read()
    if (email) {
      currentState.email.push(email)
      newForm.update(currentState)
    }
  })

  listen('click', '.deleteListItem', e => {
    let type = e.target.getAttribute('data-type')
    let key = e.target.getAttribute('data-key')
    let currenState = newForm.read()
    currenState[type].splice(key, 1)
    newForm.update(currenState)
  })

  listen('click', '.newContactSave', e => {
    let newContactNameInput = $('.newContactName')
    let name = newContactNameInput.value
    if (name) {
      let currentState = newForm.read()
      currentState.name = name
      newForm.update(currentState)
      let New = new Contact(currentState)
      store.contacts.push(New.contactData)
      store.save()
      newForm.clear()
    }
  })
  listen('input', '.newContactName', e => {
    let currentState = newForm.read()
    currentState.name = e.target.value;
    // We STOP THIS update from re-rendering to NOT lose focus of the input
    newForm.update(currentState, 'send-in-string-to-NOT-render')
  })
}

// End of the even Listener for Add new contact form

// END OF NEW CONTACT FORM CLASS AREA

// NEW CONTACT CLASS AREA
class Contact {
  constructor(contactData = {}) {
    // we need to check if it is a new contact or old one
    if (contactData.id) {
      this.contactData = contactData
      this.render()
      return
    } else {
      // This is a new contact so do this
      // Assign minimal schema to input data (so maps don't break)
      let contactSchema = {
        phone: [],
        email: []
      }
      contactData = Object.assign(contactSchema, contactData)
      //''''''''''''''''''''
      //this.contactData = newContact
      //so contactData is an empty object from the beginig, we object assigned
      // it to contactSchema object with validation: 
      //added *id, *history which is the same object contactData and *position 
      // and when we said ----- this.contactData = newContact
      //we saved it with this to be able to used in others scoop in the class
      // also the newContact is a schema object || essential data we declarate
      // it to avoid breaking map() 

      this.contactData = contactData
      this.saveNewContact()
    }
  }
  saveNewContact() {
    if (!this.contactData.name) {
      return;
    }
    //A little validation
    let newContact = {
      id: Date.now(),
      history: [this.contactData],
      position: 0
    }
    //This contact will be saved to DB in the eventhanler that called this
    //''''''''''''''
    this.contactData = newContact
    this.render()
  }
  render() {
    let thisPosition = this.contactData.history[this.contactData.position]
    let createListItems = (type) => {
      let html = ''
      thisPosition[type].map((item, i) => {
        html += `
        <li>
          <div class="flex-row">
            ${item}  
          </div>
        </li>      
        `
        //we must return smothing
      })
      return html
    }
    let html =
      `
          <div class="flex-children contacts">
          <div class="inputs">
          <div>
            Name
            <input type="text" class="ContactName" disabled value="${thisPosition.name}">
          </div>
          <div class="newContactPhoneList w-100">
            <ul>
              ${createListItems('phone')}
            </ul>
          </div>
          <div class="newContactEmailList w-100">
            <ul>
              ${createListItems('email')}
            </ul>
          </div>
        </div>
        <div class="buttons">
          <button class="contactDelete" data-key="${this.contactData.id}">Delete</button>
          <button class="contactShowHistory" data-key="${this.contactData.id}">History</button>
        </div>
      </div>
    `
    let root = $('.contacts')
    let div = create('div')
    div.setAttribute('id', this.contactData.id)
    div.innerHTML = html
    root.appendChild(div)
  }
}

// LISTENERS FOR Contact CLASS
function getDataAndKeyFormDatabase(id) {
  let indexKeyInDatabase
  let thisDataRecord = store.contacts.filter((dbRecord, index) => {
    if (dbRecord.id == id) {
      indexKeyInDatabase = index
      return true
    }
  })
  return [indexKeyInDatabase, thisDataRecord[0]]
}
listen('click', '.contactDelete', e => {
  let thisId = e.target.getAttribute('data-key')
  let [key, data] = getDataAndKeyFormDatabase(thisId)
  store.contacts.splice(key, 1)
  store.save()

  let deleteThisContact = document.getElementById(thisId)
  deleteThisContact.remove()
})
listen('click', '.contactShowHistory', e => {
  let thisId = e.target.getAttribute('data-key')
  console.log(thisId);
})
//End of Contact class

//At page load: map contact(if there is any) and send them to Contact class
store.contacts.map(contact => {
  new Contact(contact)
})

//The structure of data in database with it comes to:

// let contactData = {
//   name: '',
//   phone: [],
//   email: []
// }

//This should be the contact data structure (for versions)

// let Contact = {
//   id: '828587569',
//   history: [contactData, contactData, contactData],
//   position: 2
// }

// DATABASE: [Contact, Contact, Contact, Contact]

