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
    let NewContactForm = create('section')
    NewContactForm.setAttribute('class', 'flex-parent NewContactForm')


    //contact list section
    let contacts = create('section')
    contacts.setAttribute('class', 'contacts flex-parent')

    //append stuff
    mainWrapper.append(logo)
    mainWrapper.append(NewContactForm)
    root.append(mainWrapper)
  }
}
//create base HTML in #root
new BaseHTML()

//Add new contact form 
if (NEWCONTACT) {
  class NewContactForm {
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

    update(newObject) {

      console.warn("I will update my instance state with whatever data you sent in")


    }

    delete() {

    }

    save() {

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
          <div class="flex-children NewContactForm">
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

  let newForm = new NewContactForm('.NewContactForm');
}