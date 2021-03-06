// ============================================================================
// userInput.Keyboard.js keeps the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard	= new ECS.systems.userInput.Keyboard();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// NOTE: this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// ============================================================================
//

/** @namespace */
var Keyboard = {};

Keyboard = function Keyboard(domElement) {
  this.domElement = domElement || document;

  // to store the current state
  this.keyCodes = {};
  this.modifiers = {};

  // create callback to bind/unbind keyboard events
  var _this = this;
  this._onKeyDown = function(event) {
    _this._onKeyChange(event)
  }
  this._onKeyUp = function(event) {
    _this._onKeyChange(event)
  }

  // bind keyEvents
  this.domElement.addEventListener("keydown", this._onKeyDown, false);
  this.domElement.addEventListener("keyup", this._onKeyUp, false);

  // create callback to bind/unbind window blur event
  this._onBlur = function() {
    for (var prop in _this.keyCodes) _this.keyCodes[prop] = false;
    for (var prop in _this.modifiers) _this.modifiers[prop] = false;
  }

  // bind window blur
  window.addEventListener("blur", this._onBlur, false);
};

/**
 * To stop listening of the keyboard events
 */
Keyboard.prototype.destroy = function() {
  // unbind keyEvents
  this.domElement.removeEventListener("keydown", this._onKeyDown, false);
  this.domElement.removeEventListener("keyup", this._onKeyUp, false);

  // unbind window blur event
  window.removeEventListener("blur", this._onBlur, false);
}

Keyboard.MODIFIERS = ['shift', 'ctrl', 'alt', 'meta'];
Keyboard.ALIAS = {
  'tab': 9,
  'back': 8,
  'enter': 13,
  'pause': 19,
  'caps': 20,
  'escape': 27,
  'space': 32,
  'pageup': 33,
  'pagedown': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'F1': 112,
  'F2': 113,
  'F3': 114,
  'F4': 115,
  'F5': 116,
  'F6': 117,
  'F7': 118,
  'F8': 119,
  'F9': 120,
  'F10': 121,
  'F11': 122,
  'F12': 123,
  'semicolon': 186,
  'equalsign': 187,
  'comma': 188,
  'dash': 189,
  'period': 190,
  'forwardslash': 191,
  'graveaccent': 192,
  'openbracket': 219,
  'backslash': 220,
  'closebracket': 221,
  'singlequote': 222
};

/**
 * to process the keyboard dom event
 */
Keyboard.prototype._onKeyChange = function(event) {
  // log to debug
  //console.log("onKeyChange", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

  // update this.keyCodes
  var keyCode = event.keyCode
  var pressed = event.type === 'keydown' ? true : false
  this.keyCodes[keyCode] = pressed
    // update this.modifiers
  this.modifiers['shift'] = event.shiftKey
  this.modifiers['ctrl'] = event.ctrlKey
  this.modifiers['alt'] = event.altKey
  this.modifiers['meta'] = event.metaKey
}

/**
 * query keyboard state to know if a key is pressed of not
 *
 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
 * @returns {Boolean} true if the key is pressed, false otherwise
 */
Keyboard.prototype.pressed = function(keyDesc) {
  var keys = keyDesc.split("+");
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var pressed = false
    if (Keyboard.MODIFIERS.indexOf(key) !== -1) {
      pressed = this.modifiers[key];
    } else if (Object.keys(Keyboard.ALIAS).indexOf(key) != -1) {
      pressed = this.keyCodes[Keyboard.ALIAS[key]];
    } else {
      pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)]
    }
    if (!pressed) return false;
  };
  return true;
}

/**
 * return true if an event match a keyDesc
 * @param  {KeyboardEvent} event   keyboard event
 * @param  {String} keyDesc string description of the key
 * @return {Boolean}         true if the event match keyDesc, false otherwise
 */
Keyboard.prototype.eventMatches = function(event, keyDesc) {
  var aliases = Keyboard.ALIAS
  var aliasKeys = Object.keys(aliases)
  var keys = keyDesc.split("+")
    // log to debug
    // console.log("eventMatches", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var pressed = false;
    if (key === 'shift') {
      pressed = (event.shiftKey ? true : false)
    } else if (key === 'ctrl') {
      pressed = (event.ctrlKey ? true : false)
    } else if (key === 'alt') {
      pressed = (event.altKey ? true : false)
    } else if (key === 'meta') {
      pressed = (event.metaKey ? true : false)
    } else if (aliasKeys.indexOf(key) !== -1) {
      pressed = (event.keyCode === aliases[key] ? true : false);
    } else if (event.keyCode === key.toUpperCase().charCodeAt(0)) {
      pressed = true;
    }
    if (!pressed) return false;
  }
  return true;
}