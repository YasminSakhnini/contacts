// FIRST we check database
let store
try {
  store = JSON.parse(localStorage.store)
}
catch (e) {
  store = {}
}

store.save = function () {
  localStorage.store = JSON.stringify(this)
}

store.contacts = store.contacts || []
store.save()
// end of database check

let DBcontacts = store.contacts;
