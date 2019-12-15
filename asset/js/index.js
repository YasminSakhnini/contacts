// Just a helper function
function $(selector) {
  return document.querySelectorAll(selector)[0]
}
function create(element) {
  return document.createElement(element)
}
function getParentID(e) {
  // Each el has a wrapping parent and the data-id is kept there for 
  // simplicity. In doing so, we can identify all actions to a given ID
  let parentId = e.target.closest('.parent')
  return parentId = parseInt(parentId.getAttribute('data-id'))
}
function getParentKey(e) {
  let parentID = $(`div[data-id="${getParentID(e)}"]`);
  let parentKey = parseInt(parentID.getAttribute('data-id'));
  return [parentID, parentKey];
}
function deepCopy(srcObj) {
  // Determine what wrapper is sent in. {} || [] and set the copy to be that.
  let copyObj;
  typeof srcObj === 'object' && Array.isArray(srcObj) ? copyObj = [] : copyObj = {};
  // Loop the src and identify content and populate copy with spreads so no reference to srcObj is kept.
  // This only goes one level deep which will do fine for my purposes. Recursive variant could
  // go deeper and cover a few more usecases.
  if (Array.isArray(copyObj)) {
    // Not passing in any arrays for now so who cares? :D
  }

  if (!Array.isArray(copyObj)) {
    // console.log("IS A OBJ SO DOING THIS")
    for (const key in srcObj) {
      // Do not loop down the prototype
      if (srcObj.hasOwnProperty(key)) {
        const element = srcObj[key];
        // IS ARRAY
        if (typeof element === 'object' && Array.isArray(element)) {
          copyObj[key] = [...element]
          continue;
        }
        // IS OBJ
        if (typeof element === 'object' && !Array.isArray(element)) {
          // copyObj[key] = { ...element }
          continue;
        }
        // If not Array or Object, it is a string
        copyObj[key] = element;
      }
    }
  }

  return copyObj
}
function getDataAndKeyFromDatabase(id) {
  let indexKeyInDatabase;
  let thisDataRecord = store.contacts.filter((dbRecord, index) => {
    if (dbRecord.id == id) {
      indexKeyInDatabase = index;
      return true;
    }
  })
  return [indexKeyInDatabase, thisDataRecord[0]]
}
// end of helpers



class baseHTML {
  constructor() {
    // Reset ROOT to empty
    let root = $('#root');
    root.innerHTML = "";

    // MAIN wrapper
    let mainWrapper = create('section')
    mainWrapper.setAttribute('class', 'main-wrapper flex column')

    // LOGO
    let logo = create('div')
    logo.setAttribute('class', 'logo')
    logo.innerHTML = 'Contactbook'

    // NEW CONTACT FORM
    let newContactForm = create('section')
    newContactForm.setAttribute('class', 'flex-parent newContactForm')

    // CONTACTS LIST SECTION
    let contacts = create('section')
    contacts.setAttribute('class', 'contacts flex-parent')

    // HISTORY BUTTONS SECTION
    let history = create('section')
    history.setAttribute('class', 'historyWrapper flex-parent')

    // APPEND STUFF TO MAIN WRAPPER
    mainWrapper.appendChild(logo)
    mainWrapper.appendChild(newContactForm)
    mainWrapper.appendChild(contacts)
    mainWrapper.appendChild(history)

    // APPEND MAINWRAPPER TO ROOT
    root.append(mainWrapper)
  }
}
// CREATE BASE HTML IN #ROOT 
new baseHTML();

// NEW CONTACT FORM CLASS AREA
class newContactForm {
  constructor(htmlSelector) {
    this.rootelement = htmlSelector
    this.state = {
      name: 'Yasmine',
      phone: ["0765-848484"],
      email: ["hamidjade@gmail.com"]
    }

    this.render()
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
  read() {
    return this.state
  }
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
        // WE MUST RETURN SOMETHING
      })
      return html
    }
    let root = $(this.rootelement);
    let newContactTemplate =
      `
        <div class="flex-children">
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
            <button type="button" class="newContactAddPhone">+ phone</button>
            <button class="newContactAddEmail">+ email</button>
            <button class="newContactSave">Save</button>
          </div>
        </div>
      `
    root.innerHTML = newContactTemplate
  }
}
let newForm = new newContactForm('.newContactForm');
// EVENT LISTENERS FOR newContactForm
listen('click', '.newContactCancel', e => {
  newForm.clear()
})
listen('click', '.newContactAddPhone', e => {
  let number = prompt('Please insert number')
  let currentState = newForm.read()
  if (number) {
    currentState.phone.push(number)
    newForm.update(currentState)
  }
})
listen('click', '.newContactAddEmail', e => {
  let email = prompt('Please insert email');
  let currentState = newForm.read()
  if (email) {
    currentState.email.push(email)
    newForm.update(currentState)
  }
})
listen('click', '.deleteListItem', e => {
  // console.warn("Here we use ONE eventlistener to listen to two types of items (both phone and email")
  let type = e.target.getAttribute('data-type')
  let key = e.target.getAttribute('data-key')

  let currentState = newForm.read()
  currentState[type].splice(key, 1)
  newForm.update(currentState)
})
listen('click', '.newContactSave', e => {
  let newContactNameInput = $('.newContactName');
  let name = newContactNameInput.value

  if (name) {
    let currentState = newForm.read()
    currentState.save = true;
    currentState.name = name;
    newForm.update(currentState)
    let New = new Contact(currentState)
    newForm.clear()
  }
})
listen('input', '.newContactName', e => {
  let currentState = newForm.read()
  currentState.name = e.target.value;
  // We STOP THIS update from re-rendering to NOT lose focus of the input
  newForm.update(currentState, 'send-in-string-to-NOT-render')
})
// END OF NEW CONTACT FORM CLASS AREA
















// CONTACT CLASS AREA
class Contact {
  constructor(contactData = {}) {
    if (contactData.id) {
      // THIS IS ALREADY A Contact, SO DO THIS:
      let [index, contactFromDB] = getDataAndKeyFromDatabase(contactData.id)
      this.contactData = Object.assign(contactData, deepCopy(contactFromDB))
      if (contactData.readOnly) {
        // When passing in readOnly on instatiation, the state will be restored to itself
        contactFromDB.state = contactFromDB.state
      } else {
        // reset state to last chosen version in contactbook
        contactFromDB.state = deepCopy(this.contactData.history[this.contactData.position])
      }
      store.save()
      // Put stored state data into instance so it can be read from all instances
      this.state = contactFromDB.state
      // store.save()
      return this;
    }
    if (contactData.save) {
      // THIS IS A NEW Contact, SO DO THIS:
      // Assign minimal schema to input data (so maps don't break)
      let contactSchema = {
        phone: [],
        email: []
      }
      contactData = Object.assign(contactSchema, contactData)
      // Now assign this user data + schema to the instance 
      this.contactData = contactData
      // Check for name
      if (!this.contactData.name) {
        return;
      }
      // Create ID and base Structure 
      let newContact = {
        id: Date.now(),
        history: [this.contactData],
        position: 0
      }
      newContact.state = deepCopy(this.contactData)
      this.contactData = newContact;
      store.contacts.push(newContact)
      store.save()
      this.render()
      return this
    }
  }

  render(action = "new", data) {
    let thisPosition = this.contactData.history[this.contactData.position]
    let position = this.contactData.position
    if (action == "update") {
      thisPosition = data
      position = data.position || "upd"
    }

    if (action == "new-version") {
      this.position = data.history[data.position]
      position = data.position
    }

    let createListItems = (type) => {
      let html = '';
      thisPosition[type].map((item, i) => {
        html += `
        <li>
          <div class="flex-row">
            ${item}<button class="contactDeleteListItem" data-type="${type}" data-key="${i}">x</button>
          </div>
        </li>  
      `
      })
      return html
    }
    let html =
      `
      <div class="flex-children contact">
        <h3>Pos: ${position}</h3>
        <div class="inputs">
          <div>
            Name
            <input type="text" class="contactName" value="${thisPosition.name}">
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
          <button class="contactAddPhone">+ phone</button>
          <button class="contactShowHistory" data-key="${this.contactData.id}">History</button>
          <button class="contactAddEmail">+ email</button>
          <button class="contactSaveChanges" data-key="${this.contactData.id}">Save</button>
        </div>
      </div>
    `
    if (action == "new") {
      let root = $('.contacts')
      let div = create('div')
      div.setAttribute('data-id', this.contactData.id);
      div.setAttribute('class', 'parent')
      div.innerHTML = html;
      root.appendChild(div)
    }
    if (action == "update" || action == "new-version") {
      let root = $(`div[data-id="${this.contactData.id}"]`)
      let div = create('div')
      div.setAttribute('class', 'flex-children contact');
      root.innerHTML = html;
    }
  }
  renderAll() {
    $('.contacts').innerHTML = "";
    store.contacts.map(contact => {
      new Contact(contact).render()

    })
  }
  read() {
    return this;
  }
  update(newData, render = false) {
    let [index, contactFromDB] = getDataAndKeyFromDatabase(this.contactData.id)
    contactFromDB.state = newData.state
    store.save()
    if (render) {
      this.render("update", contactFromDB.state)
    }
  }
  save() {
    let [index, contactFromDB] = getDataAndKeyFromDatabase(this.contactData.id)
    // push last state (state updates with eventhandlers and the update method)
    contactFromDB.history.push(deepCopy(contactFromDB.state))
    contactFromDB.position = contactFromDB.position + 1
    store.save()
    this.contactData = contactFromDB
    this.render("new-version", contactFromDB)
  }
}

class HistoryButtons {

  render(parentKey, history) {

    let showHistoryContents = () => {
      let str = ``
      history.map((x, i) => {
        str += `
        <button class="restoreHistoryBtn" type="button" data-key="${parentKey}" data-db-key="${i}">
          <h3>${x.name}</h3>
          <p>Phone:</p>
          ${x.phone.map(phone => {
          return `<p>${phone}</p>`
        }).join('')}
        <p>Email:</p>
          ${x.email.map(email => {
          return `<p>${email}</p>`
        }).join('')}
        `
        str += '</button><hr>'
      })

      return str
    }

    let html = `
      <div class="historyBtnWrapper">
        ${parentKey}
        ${showHistoryContents()}
      </div>
    `


    let targetElement = $('.historyWrapper')
    targetElement.innerHTML = ""
    let historyButton = create('div')
    historyButton.innerHTML = html
    targetElement.appendChild(historyButton)
  }

}

// LISTENERS FOR Contact CLASS
listen('input', '.contactName', e => {
  let [parentEl, parentKey] = getParentKey(e);
  // Get state, update it and send entire obj to update
  let actualState = new Contact({ id: parentKey, readOnly: true })
  // Modify state and update name, then send it back for re-save to stored state
  actualState.state.name = e.target.value
  actualState.update(actualState)
})
listen('click', '.contactDelete', e => {
  let thisId = e.target.getAttribute('data-key')
  // let [parentEl, parentKey] = getParentKey(e);
  $('.historyWrapper').innerHTML = ''

  store.contacts.splice(key, 1)
  store.save()

  let deleteThisContact = document.querySelector(`div[data-id="${thisId}"]`)
  deleteThisContact.remove()
})
listen('click', '.contactAddPhone', e => {
  let number = prompt("Please submit a number")
  if (number) {
    let [parentEl, parentKey] = getParentKey(e);
    // Get state, update it and send entire obj to update
    let actualState = new Contact({ id: parentKey, readOnly: true })
    actualState.state.phone.push(number)
    actualState.update(actualState, "render")
  }
})
listen('click', '.contactDeleteListItem', e => {
  let type = e.target.getAttribute('data-type')
  let key = e.target.getAttribute('data-key')

  let [parentEl, parentKey] = getParentKey(e);
  // Get state, update it and send entire obj to update
  let actualState = new Contact({ id: parentKey, readOnly: true })
  actualState.state[type].splice(key, 1)
  actualState.update(actualState, "render")
})
listen('click', '.contactAddEmail', e => {
  let email = prompt("Please submit an email")
  if (email) {
    let [parentEl, parentKey] = getParentKey(e);
    // Get state, update it and send entire obj to update
    let actualState = new Contact({ id: parentKey, readOnly: true })
    actualState.state.email.push(email)
    actualState.update(actualState, "render")
  }
})

listen('click', '.contactShowHistory', e => {
  let [parentEl, parentKey] = getParentKey(e);
  let actualState = new Contact({ id: parentKey })
  let historyPositions = actualState.contactData.history
  new HistoryButtons().render(parentKey, historyPositions)
})
listen('click', '.contactSaveChanges', e => {
  let [parentEl, parentKey] = getParentKey(e);
  let actualState = new Contact({ id: parentKey, readOnly: true })
  actualState.save()
})
listen('click', '.restoreHistoryBtn', e => {
  let id = e.target.getAttribute('data-key')
  let position = e.target.getAttribute('data-db-key')
  // console.log('id', id, 'pos', position)
  let historyPositionFromDB = store.contacts.filter(contact => {
    if (contact.id == id) {
      return true
    }
  })
  let newData = historyPositionFromDB[0];
  newData.position = parseInt(position)
  store.save()
  let tmp = new Contact({ id })
  tmp.render("new-version", tmp.contactData)
  // console.log(tmp.contactData);
})
// END OF LISTENERS FOR CONTACT
// END OF CONTACT CLASS AREA



// Render all contacts at pageload
new Contact({}).renderAll()






























// THE STRUCTURE OF DATA IN DATABASE WHEN IT COMES TO:

// THIS DATA COMES FROM NEW FORM
// let contactData = {
//   name: '',
//   phone: [],
//   email: []
// }

// THIS SHOULD BE THE CONTACT DATA STRUCTURE (for versions)

// let Contact = {
//   id: '1572623313856',
//   history: [contactData, contactData, contactData],
//   position: 2
// }


// DATABASE: [Contact, Contact, Contact, Contact]

