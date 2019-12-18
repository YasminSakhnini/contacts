const [listen, unlisten] = (() => {

  let listeningOnType = {};
  let listeners = [];

  function listen(eventType, cssSelector, func) {
    // Register a "listener"
    let listener = { eventType, cssSelector, func };
    listeners.push(listener);
    // If no listener on window[eventType] register a 
    // a real/raw js-listener
    if (!listeningOnType[eventType]) {
      // add event listener for this type on the whole window
      window.addEventListener(eventType, e => {
        listeners
          .filter(x => x.eventType === eventType)
          .forEach(listener => {
            if (e.target.closest(listener.cssSelector)) {
              listener.func(e);
            }
          });
      });
      listeningOnType[eventType] = true;
    }
    return listener;
  }

  function unlisten(listener) {
    listeners.splice(listeners.indexOf(listener), 1);
  }

  return [listen, unlisten];

})();

// We can listen
// let listener1 = listen('click', '.info-text', e => {
//   console.log('You clicked an .info-text');
// });
// let listener2 = listen('click', 'button', e => {
//   console.log('You clicked a button');
// });

// We can unlisten - try commenting in these lines:
// unlisten(listener1);
// unlisten(listener2);