(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // desktop/clipboard.js
  var clipboard_exports = {};
  __export(clipboard_exports, {
    SetText: () => SetText,
    Text: () => Text
  });

  // desktop/runtime.js
  var runtimeURL = window.location.origin + "/wails/runtime";
  function runtimeCall(method, windowName, args) {
    let url = new URL(runtimeURL);
    url.searchParams.append("method", method);
    if (args) {
      url.searchParams.append("args", JSON.stringify(args));
    }
    let fetchOptions = {
      headers: {}
    };
    if (windowName) {
      fetchOptions.headers["x-wails-window-name"] = windowName;
    }
    return new Promise((resolve, reject) => {
      fetch(url, fetchOptions).then((response) => {
        if (response.ok) {
          if (response.headers.get("Content-Type") && response.headers.get("Content-Type").indexOf("application/json") !== -1) {
            return response.json();
          } else {
            return response.text();
          }
        }
        reject(Error(response.statusText));
      }).then((data) => resolve(data)).catch((error) => reject(error));
    });
  }
  function newRuntimeCaller(object, windowName) {
    return function(method, args = null) {
      return runtimeCall(object + "." + method, windowName, args);
    };
  }

  // desktop/clipboard.js
  var call = newRuntimeCaller("clipboard");
  function SetText(text) {
    void call("SetText", { text });
  }
  function Text() {
    return call("Text");
  }

  // desktop/application.js
  var application_exports = {};
  __export(application_exports, {
    Hide: () => Hide,
    Quit: () => Quit,
    Show: () => Show
  });
  var call2 = newRuntimeCaller("application");
  function Hide() {
    void call2("Hide");
  }
  function Show() {
    void call2("Show");
  }
  function Quit() {
    void call2("Quit");
  }

  // desktop/log.js
  var log_exports = {};
  __export(log_exports, {
    Log: () => Log
  });
  var call3 = newRuntimeCaller("log");
  function Log(message) {
    return call3("Log", message);
  }

  // desktop/screens.js
  var screens_exports = {};
  __export(screens_exports, {
    GetAll: () => GetAll,
    GetCurrent: () => GetCurrent,
    GetPrimary: () => GetPrimary
  });
  var call4 = newRuntimeCaller("screens");
  function GetAll() {
    return call4("GetAll");
  }
  function GetPrimary() {
    return call4("GetPrimary");
  }
  function GetCurrent() {
    return call4("GetCurrent");
  }

  // node_modules/nanoid/non-secure/index.js
  var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  var nanoid = (size = 21) => {
    let id = "";
    let i = size;
    while (i--) {
      id += urlAlphabet[Math.random() * 64 | 0];
    }
    return id;
  };

  // desktop/calls.js
  var call5 = newRuntimeCaller("call");
  var callResponses = /* @__PURE__ */ new Map();
  function generateID() {
    let result;
    do {
      result = nanoid();
    } while (callResponses.has(result));
    return result;
  }
  function callCallback(id, data, isJSON) {
    let p = callResponses.get(id);
    if (p) {
      if (isJSON) {
        p.resolve(JSON.parse(data));
      } else {
        p.resolve(data);
      }
      callResponses.delete(id);
    }
  }
  function callErrorCallback(id, message) {
    let p = callResponses.get(id);
    if (p) {
      p.reject(message);
      callResponses.delete(id);
    }
  }
  function callBinding(type, options) {
    return new Promise((resolve, reject) => {
      let id = generateID();
      options = options || {};
      options["call-id"] = id;
      callResponses.set(id, { resolve, reject });
      call5(type, options).catch((error) => {
        reject(error);
        callResponses.delete(id);
      });
    });
  }
  function Call(options) {
    return callBinding("Call", options);
  }
  function Plugin(pluginName, methodName, ...args) {
    return callBinding("Call", {
      packageName: "wails-plugins",
      structName: pluginName,
      methodName,
      args
    });
  }

  // desktop/window.js
  function newWindow(windowName) {
    let call9 = newRuntimeCaller("window", windowName);
    return {
      // Reload: () => call('WR'),
      // ReloadApp: () => call('WR'),
      // SetSystemDefaultTheme: () => call('WASDT'),
      // SetLightTheme: () => call('WALT'),
      // SetDarkTheme: () => call('WADT'),
      // IsFullscreen: () => call('WIF'),
      // IsMaximized: () => call('WIM'),
      // IsMinimized: () => call('WIMN'),
      // IsWindowed: () => call('WIF'),
      /**
       * Centers the window.
       */
      Center: () => void call9("Center"),
      /**
       * Set the window title.
       * @param title
       */
      SetTitle: (title) => void call9("SetTitle", { title }),
      /**
       * Makes the window fullscreen.
       */
      Fullscreen: () => void call9("Fullscreen"),
      /**
       * Unfullscreen the window.
       */
      UnFullscreen: () => void call9("UnFullscreen"),
      /**
       * Set the window size.
       * @param {number} width The window width
       * @param {number} height The window height
       */
      SetSize: (width, height) => call9("SetSize", { width, height }),
      /**
       * Get the window size.
       * @returns {Promise<Size>} The window size
       */
      Size: () => {
        return call9("Size");
      },
      /**
       * Set the window maximum size.
       * @param {number} width
       * @param {number} height
       */
      SetMaxSize: (width, height) => void call9("SetMaxSize", { width, height }),
      /**
       * Set the window minimum size.
       * @param {number} width
       * @param {number} height
       */
      SetMinSize: (width, height) => void call9("SetMinSize", { width, height }),
      /**
       * Set window to be always on top.
       * @param {boolean} onTop Whether the window should be always on top
       */
      SetAlwaysOnTop: (onTop) => void call9("SetAlwaysOnTop", { alwaysOnTop: onTop }),
      /**
       * Set the window position.
       * @param {number} x
       * @param {number} y
       */
      SetPosition: (x, y) => call9("SetPosition", { x, y }),
      /**
       * Get the window position.
       * @returns {Promise<Position>} The window position
       */
      Position: () => {
        return call9("Position");
      },
      /**
       * Get the screen the window is on.
       * @returns {Promise<Screen>}
       */
      Screen: () => {
        return call9("Screen");
      },
      /**
       * Hide the window
       */
      Hide: () => void call9("Hide"),
      /**
       * Maximise the window
       */
      Maximise: () => void call9("Maximise"),
      /**
       * Show the window
       */
      Show: () => void call9("Show"),
      /**
       * Close the window
       */
      Close: () => void call9("Close"),
      /**
       * Toggle the window maximise state
       */
      ToggleMaximise: () => void call9("ToggleMaximise"),
      /**
       * Unmaximise the window
       */
      UnMaximise: () => void call9("UnMaximise"),
      /**
       * Minimise the window
       */
      Minimise: () => void call9("Minimise"),
      /**
       * Unminimise the window
       */
      UnMinimise: () => void call9("UnMinimise"),
      /**
       * Restore the window
       */
      Restore: () => void call9("Restore"),
      /**
       * Set the background colour of the window.
       * @param {number} r - A value between 0 and 255
       * @param {number} g - A value between 0 and 255
       * @param {number} b - A value between 0 and 255
       * @param {number} a - A value between 0 and 255
       */
      SetBackgroundColour: (r, g, b, a) => void call9("SetBackgroundColour", { r, g, b, a })
    };
  }

  // desktop/events.js
  var call6 = newRuntimeCaller("events");
  var Listener = class {
    /**
     * Creates an instance of Listener.
     * @param {string} eventName
     * @param {function} callback
     * @param {number} maxCallbacks
     * @memberof Listener
     */
    constructor(eventName, callback, maxCallbacks) {
      this.eventName = eventName;
      this.maxCallbacks = maxCallbacks || -1;
      this.Callback = (data) => {
        callback(data);
        if (this.maxCallbacks === -1) {
          return false;
        }
        this.maxCallbacks -= 1;
        return this.maxCallbacks === 0;
      };
    }
  };
  var WailsEvent = class {
    /**
     * Creates an instance of WailsEvent.
     * @param {string} name - Name of the event
     * @param {any=null} data - Data associated with the event
     * @memberof WailsEvent
     */
    constructor(name, data = null) {
      this.name = name;
      this.data = data;
    }
  };
  var eventListeners = /* @__PURE__ */ new Map();
  function OnMultiple(eventName, callback, maxCallbacks) {
    let listeners = eventListeners.get(eventName) || [];
    const thisListener = new Listener(eventName, callback, maxCallbacks);
    listeners.push(thisListener);
    eventListeners.set(eventName, listeners);
    return () => listenerOff(thisListener);
  }
  function On(eventName, callback) {
    return OnMultiple(eventName, callback, -1);
  }
  function Once(eventName, callback) {
    return OnMultiple(eventName, callback, 1);
  }
  function listenerOff(listener) {
    const eventName = listener.eventName;
    let listeners = eventListeners.get(eventName).filter((l) => l !== listener);
    if (listeners.length === 0) {
      eventListeners.delete(eventName);
    } else {
      eventListeners.set(eventName, listeners);
    }
  }
  function dispatchWailsEvent(event) {
    console.log("dispatching event: ", { event });
    let listeners = eventListeners.get(event.name);
    if (listeners) {
      let toRemove = [];
      listeners.forEach((listener) => {
        let remove = listener.Callback(event);
        if (remove) {
          toRemove.push(listener);
        }
      });
      if (toRemove.length > 0) {
        listeners = listeners.filter((l) => !toRemove.includes(l));
        if (listeners.length === 0) {
          eventListeners.delete(event.name);
        } else {
          eventListeners.set(event.name, listeners);
        }
      }
    }
  }
  function Off(eventName, ...additionalEventNames) {
    let eventsToRemove = [eventName, ...additionalEventNames];
    eventsToRemove.forEach((eventName2) => {
      eventListeners.delete(eventName2);
    });
  }
  function OffAll() {
    eventListeners.clear();
  }
  function Emit(event) {
    void call6("Emit", event);
  }

  // desktop/dialogs.js
  var call7 = newRuntimeCaller("dialog");
  var dialogResponses = /* @__PURE__ */ new Map();
  function generateID2() {
    let result;
    do {
      result = nanoid();
    } while (dialogResponses.has(result));
    return result;
  }
  function dialogCallback(id, data, isJSON) {
    let p = dialogResponses.get(id);
    if (p) {
      if (isJSON) {
        p.resolve(JSON.parse(data));
      } else {
        p.resolve(data);
      }
      dialogResponses.delete(id);
    }
  }
  function dialogErrorCallback(id, message) {
    let p = dialogResponses.get(id);
    if (p) {
      p.reject(message);
      dialogResponses.delete(id);
    }
  }
  function dialog(type, options) {
    return new Promise((resolve, reject) => {
      let id = generateID2();
      options = options || {};
      options["dialog-id"] = id;
      dialogResponses.set(id, { resolve, reject });
      call7(type, options).catch((error) => {
        reject(error);
        dialogResponses.delete(id);
      });
    });
  }
  function Info(options) {
    return dialog("Info", options);
  }
  function Warning(options) {
    return dialog("Warning", options);
  }
  function Error2(options) {
    return dialog("Error", options);
  }
  function Question(options) {
    return dialog("Question", options);
  }
  function OpenFile(options) {
    return dialog("OpenFile", options);
  }
  function SaveFile(options) {
    return dialog("SaveFile", options);
  }

  // desktop/contextmenu.js
  var call8 = newRuntimeCaller("contextmenu");
  function openContextMenu(id, x, y, data) {
    void call8("OpenContextMenu", { id, x, y, data });
  }
  function setupContextMenus() {
    window.addEventListener("contextmenu", contextMenuHandler);
  }
  function contextMenuHandler(event) {
    let element = event.target;
    let customContextMenu = window.getComputedStyle(element).getPropertyValue("--custom-contextmenu");
    customContextMenu = customContextMenu ? customContextMenu.trim() : "";
    if (customContextMenu) {
      event.preventDefault();
      let customContextMenuData = window.getComputedStyle(element).getPropertyValue("--custom-contextmenu-data");
      openContextMenu(customContextMenu, event.clientX, event.clientY, customContextMenuData);
      return;
    }
    processDefaultContextMenu(event);
  }
  function processDefaultContextMenu(event) {
    let element = event.target;
    let defaultContextMenuAction = window.getComputedStyle(element).getPropertyValue("--default-contextmenu");
    defaultContextMenuAction = defaultContextMenuAction ? defaultContextMenuAction.trim() : "";
    switch (defaultContextMenuAction) {
      case "show":
        return;
      case "hide":
        event.preventDefault();
        return;
      default:
        let contentEditable = element.getAttribute("contentEditable");
        if (contentEditable && contentEditable.toLowerCase() === "true") {
          return;
        }
        let selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          return;
        }
        let tagName = element.tagName.toLowerCase();
        if (tagName === "input" || tagName === "textarea") {
          return;
        }
        event.preventDefault();
    }
  }

  // desktop/wml.js
  function sendEvent(eventName, data = null) {
    let event = new WailsEvent(eventName, data);
    Emit(event);
  }
  function addWMLEventListeners() {
    const elements = document.querySelectorAll("[data-wml-event]");
    elements.forEach(function(element) {
      const eventType = element.getAttribute("data-wml-event");
      const confirm = element.getAttribute("data-wml-confirm");
      const trigger = element.getAttribute("data-wml-trigger") || "click";
      let callback = function() {
        if (confirm) {
          Question({ Title: "Confirm", Message: confirm, Buttons: [{ Label: "Yes" }, { Label: "No", IsDefault: true }] }).then(function(result) {
            if (result !== "No") {
              sendEvent(eventType);
            }
          });
          return;
        }
        sendEvent(eventType);
      };
      element.removeEventListener(trigger, callback);
      element.addEventListener(trigger, callback);
    });
  }
  function callWindowMethod(method) {
    if (wails.Window[method] === void 0) {
      console.log("Window method " + method + " not found");
    }
    wails.Window[method]();
  }
  function addWMLWindowListeners() {
    const elements = document.querySelectorAll("[data-wml-window]");
    elements.forEach(function(element) {
      const windowMethod = element.getAttribute("data-wml-window");
      const confirm = element.getAttribute("data-wml-confirm");
      const trigger = element.getAttribute("data-wml-trigger") || "click";
      let callback = function() {
        if (confirm) {
          Question({ Title: "Confirm", Message: confirm, Buttons: [{ Label: "Yes" }, { Label: "No", IsDefault: true }] }).then(function(result) {
            if (result !== "No") {
              callWindowMethod(windowMethod);
            }
          });
          return;
        }
        callWindowMethod(windowMethod);
      };
      element.removeEventListener(trigger, callback);
      element.addEventListener(trigger, callback);
    });
  }
  function reloadWML() {
    addWMLEventListeners();
    addWMLWindowListeners();
  }

  // desktop/invoke.js
  var invoke = function(input) {
    if (false) {
      chrome.webview.postMessage(input);
    } else {
      webkit.messageHandlers.external.postMessage(input);
    }
  };

  // desktop/flags.js
  var flags = /* @__PURE__ */ new Map();
  function convertToMap(obj) {
    const map = /* @__PURE__ */ new Map();
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        map.set(key, convertToMap(value));
      } else {
        map.set(key, value);
      }
    }
    return map;
  }
  fetch("/wails/flags").then((response) => {
    response.json().then((data) => {
      flags = convertToMap(data);
    });
  });

  // desktop/drag.js
  var shouldDrag = false;
  function dragTest(e) {
    let val = window.getComputedStyle(e.target).getPropertyValue("--webkit-app-region");
    if (val) {
      val = val.trim();
    }
    if (val !== "drag") {
      return false;
    }
    if (e.buttons !== 1) {
      return false;
    }
    return e.detail === 1;
  }
  function setupDrag() {
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }
  function onMouseDown(e) {
    if (false) {
      if (testResize()) {
        return;
      }
    }
    if (dragTest(e)) {
      if (e.offsetX > e.target.clientWidth || e.offsetY > e.target.clientHeight) {
        return;
      }
      shouldDrag = true;
    } else {
      shouldDrag = false;
    }
  }
  function onMouseUp(e) {
    let mousePressed = e.buttons !== void 0 ? e.buttons : e.which;
    if (mousePressed > 0) {
      endDrag();
    }
  }
  function endDrag() {
    document.body.style.cursor = "default";
    shouldDrag = false;
  }
  function onMouseMove(e) {
    if (shouldDrag) {
      shouldDrag = false;
      let mousePressed = e.buttons !== void 0 ? e.buttons : e.which;
      if (mousePressed > 0) {
        invoke("drag");
      }
      return;
    }
    if (false) {
      handleResize(e);
    }
  }

  // desktop/main.js
  window.wails = {
    ...newRuntime(null),
    Capabilities: {}
  };
  fetch("/wails/capabilities").then((response) => {
    response.json().then((data) => {
      window.wails.Capabilities = data;
    });
  });
  window._wails = {
    dialogCallback,
    dialogErrorCallback,
    dispatchWailsEvent,
    callCallback,
    callErrorCallback,
    endDrag
  };
  function newRuntime(windowName) {
    return {
      Clipboard: {
        ...clipboard_exports
      },
      Application: {
        ...application_exports,
        GetWindowByName(windowName2) {
          return newRuntime(windowName2);
        }
      },
      Log: log_exports,
      Screens: screens_exports,
      Call,
      Plugin,
      WML: {
        Reload: reloadWML
      },
      Dialog: {
        Info,
        Warning,
        Error: Error2,
        Question,
        OpenFile,
        SaveFile
      },
      Events: {
        Emit,
        On,
        Once,
        OnMultiple,
        Off,
        OffAll
      },
      Window: newWindow(windowName)
    };
  }
  if (true) {
    console.log("Wails v3.0.0 Debug Mode Enabled");
  }
  setupContextMenus();
  setupDrag();
  document.addEventListener("DOMContentLoaded", function(event) {
    reloadWML();
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZGVza3RvcC9jbGlwYm9hcmQuanMiLCAiZGVza3RvcC9ydW50aW1lLmpzIiwgImRlc2t0b3AvYXBwbGljYXRpb24uanMiLCAiZGVza3RvcC9sb2cuanMiLCAiZGVza3RvcC9zY3JlZW5zLmpzIiwgIm5vZGVfbW9kdWxlcy9uYW5vaWQvbm9uLXNlY3VyZS9pbmRleC5qcyIsICJkZXNrdG9wL2NhbGxzLmpzIiwgImRlc2t0b3Avd2luZG93LmpzIiwgImRlc2t0b3AvZXZlbnRzLmpzIiwgImRlc2t0b3AvZGlhbG9ncy5qcyIsICJkZXNrdG9wL2NvbnRleHRtZW51LmpzIiwgImRlc2t0b3Avd21sLmpzIiwgImRlc2t0b3AvaW52b2tlLmpzIiwgImRlc2t0b3AvZmxhZ3MuanMiLCAiZGVza3RvcC9kcmFnLmpzIiwgImRlc2t0b3AvbWFpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLypcclxuIF9cdCAgIF9fXHQgIF8gX19cclxufCB8XHQgLyAvX19fIF8oXykgL19fX19cclxufCB8IC98IC8gLyBfXyBgLyAvIC8gX19fL1xyXG58IHwvIHwvIC8gL18vIC8gLyAoX18gIClcclxufF9fL3xfXy9cXF9fLF8vXy9fL19fX18vXHJcblRoZSBlbGVjdHJvbiBhbHRlcm5hdGl2ZSBmb3IgR29cclxuKGMpIExlYSBBbnRob255IDIwMTktcHJlc2VudFxyXG4qL1xyXG5cclxuLyoganNoaW50IGVzdmVyc2lvbjogOSAqL1xyXG5cclxuaW1wb3J0IHtuZXdSdW50aW1lQ2FsbGVyfSBmcm9tIFwiLi9ydW50aW1lXCI7XHJcblxyXG5sZXQgY2FsbCA9IG5ld1J1bnRpbWVDYWxsZXIoXCJjbGlwYm9hcmRcIik7XHJcblxyXG4vKipcclxuICogU2V0IHRoZSBDbGlwYm9hcmQgdGV4dFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIFNldFRleHQodGV4dCkge1xyXG4gICAgdm9pZCBjYWxsKFwiU2V0VGV4dFwiLCB7dGV4dH0pO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBDbGlwYm9hcmQgdGV4dFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIFRleHQoKSB7XHJcbiAgICByZXR1cm4gY2FsbChcIlRleHRcIik7XHJcbn0iLCAiLypcclxuIF9cdCAgIF9fXHQgIF8gX19cclxufCB8XHQgLyAvX19fIF8oXykgL19fX19cclxufCB8IC98IC8gLyBfXyBgLyAvIC8gX19fL1xyXG58IHwvIHwvIC8gL18vIC8gLyAoX18gIClcclxufF9fL3xfXy9cXF9fLF8vXy9fL19fX18vXHJcblRoZSBlbGVjdHJvbiBhbHRlcm5hdGl2ZSBmb3IgR29cclxuKGMpIExlYSBBbnRob255IDIwMTktcHJlc2VudFxyXG4qL1xyXG5cclxuLyoganNoaW50IGVzdmVyc2lvbjogOSAqL1xyXG5cclxuY29uc3QgcnVudGltZVVSTCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi93YWlscy9ydW50aW1lXCI7XHJcblxyXG5mdW5jdGlvbiBydW50aW1lQ2FsbChtZXRob2QsIHdpbmRvd05hbWUsIGFyZ3MpIHtcclxuICAgIGxldCB1cmwgPSBuZXcgVVJMKHJ1bnRpbWVVUkwpO1xyXG4gICAgdXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoXCJtZXRob2RcIiwgbWV0aG9kKTtcclxuICAgIGlmIChhcmdzKSB7XHJcbiAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoXCJhcmdzXCIsIEpTT04uc3RyaW5naWZ5KGFyZ3MpKTtcclxuICAgIH1cclxuICAgIGxldCBmZXRjaE9wdGlvbnMgPSB7XHJcbiAgICAgICAgaGVhZGVyczoge30sXHJcbiAgICB9O1xyXG4gICAgaWYgKHdpbmRvd05hbWUpIHtcclxuICAgICAgICBmZXRjaE9wdGlvbnMuaGVhZGVyc1tcIngtd2FpbHMtd2luZG93LW5hbWVcIl0gPSB3aW5kb3dOYW1lO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBmZXRjaCh1cmwsIGZldGNoT3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgY29udGVudCB0eXBlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiQ29udGVudC1UeXBlXCIpLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiByZXNvbHZlKGRhdGEpKVxyXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gcmVqZWN0KGVycm9yKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5ld1J1bnRpbWVDYWxsZXIob2JqZWN0LCB3aW5kb3dOYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKG1ldGhvZCwgYXJncz1udWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIHJ1bnRpbWVDYWxsKG9iamVjdCArIFwiLlwiICsgbWV0aG9kLCB3aW5kb3dOYW1lLCBhcmdzKTtcclxuICAgIH07XHJcbn0iLCAiLypcclxuIF9cdCAgIF9fXHQgIF8gX19cclxufCB8XHQgLyAvX19fIF8oXykgL19fX19cclxufCB8IC98IC8gLyBfXyBgLyAvIC8gX19fL1xyXG58IHwvIHwvIC8gL18vIC8gLyAoX18gIClcclxufF9fL3xfXy9cXF9fLF8vXy9fL19fX18vXHJcblRoZSBlbGVjdHJvbiBhbHRlcm5hdGl2ZSBmb3IgR29cclxuKGMpIExlYSBBbnRob255IDIwMTktcHJlc2VudFxyXG4qL1xyXG5cclxuLyoganNoaW50IGVzdmVyc2lvbjogOSAqL1xyXG5cclxuaW1wb3J0IHtuZXdSdW50aW1lQ2FsbGVyfSBmcm9tIFwiLi9ydW50aW1lXCI7XHJcblxyXG5sZXQgY2FsbCA9IG5ld1J1bnRpbWVDYWxsZXIoXCJhcHBsaWNhdGlvblwiKTtcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBhcHBsaWNhdGlvblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIEhpZGUoKSB7XHJcbiAgICB2b2lkIGNhbGwoXCJIaWRlXCIpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyB0aGUgYXBwbGljYXRpb25cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBTaG93KCkge1xyXG4gICAgdm9pZCBjYWxsKFwiU2hvd1wiKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBRdWl0IHRoZSBhcHBsaWNhdGlvblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIFF1aXQoKSB7XHJcbiAgICB2b2lkIGNhbGwoXCJRdWl0XCIpO1xyXG59IiwgIi8qXHJcbiBfXHQgICBfX1x0ICBfIF9fXHJcbnwgfFx0IC8gL19fXyBfKF8pIC9fX19fXHJcbnwgfCAvfCAvIC8gX18gYC8gLyAvIF9fXy9cclxufCB8LyB8LyAvIC9fLyAvIC8gKF9fICApXHJcbnxfXy98X18vXFxfXyxfL18vXy9fX19fL1xyXG5UaGUgZWxlY3Ryb24gYWx0ZXJuYXRpdmUgZm9yIEdvXHJcbihjKSBMZWEgQW50aG9ueSAyMDE5LXByZXNlbnRcclxuKi9cclxuXHJcbi8qIGpzaGludCBlc3ZlcnNpb246IDkgKi9cclxuXHJcbmltcG9ydCB7bmV3UnVudGltZUNhbGxlcn0gZnJvbSBcIi4vcnVudGltZVwiO1xyXG5cclxubGV0IGNhbGwgPSBuZXdSdW50aW1lQ2FsbGVyKFwibG9nXCIpO1xyXG5cclxuLyoqXHJcbiAqIExvZ3MgYSBtZXNzYWdlLlxyXG4gKiBAcGFyYW0ge21lc3NhZ2V9IE1lc3NhZ2UgdG8gbG9nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gTG9nKG1lc3NhZ2UpIHtcclxuICAgIHJldHVybiBjYWxsKFwiTG9nXCIsIG1lc3NhZ2UpO1xyXG59XHJcbiIsICIvKlxyXG4gX1x0ICAgX19cdCAgXyBfX1xyXG58IHxcdCAvIC9fX18gXyhfKSAvX19fX1xyXG58IHwgL3wgLyAvIF9fIGAvIC8gLyBfX18vXHJcbnwgfC8gfC8gLyAvXy8gLyAvIChfXyAgKVxyXG58X18vfF9fL1xcX18sXy9fL18vX19fXy9cclxuVGhlIGVsZWN0cm9uIGFsdGVybmF0aXZlIGZvciBHb1xyXG4oYykgTGVhIEFudGhvbnkgMjAxOS1wcmVzZW50XHJcbiovXHJcblxyXG4vKiBqc2hpbnQgZXN2ZXJzaW9uOiA5ICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge2ltcG9ydChcIi4vYXBpL3R5cGVzXCIpLlNjcmVlbn0gU2NyZWVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtuZXdSdW50aW1lQ2FsbGVyfSBmcm9tIFwiLi9ydW50aW1lXCI7XHJcblxyXG5sZXQgY2FsbCA9IG5ld1J1bnRpbWVDYWxsZXIoXCJzY3JlZW5zXCIpO1xyXG5cclxuLyoqXHJcbiAqIEdldHMgYWxsIHNjcmVlbnMuXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPFNjcmVlbltdPn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBHZXRBbGwoKSB7XHJcbiAgICByZXR1cm4gY2FsbChcIkdldEFsbFwiKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIHByaW1hcnkgc2NyZWVuLlxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxTY3JlZW4+fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIEdldFByaW1hcnkoKSB7XHJcbiAgICByZXR1cm4gY2FsbChcIkdldFByaW1hcnlcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBjdXJyZW50IGFjdGl2ZSBzY3JlZW4uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPFNjcmVlbj59XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIEdldEN1cnJlbnQoKSB7XHJcbiAgICByZXR1cm4gY2FsbChcIkdldEN1cnJlbnRcIik7XHJcbn0iLCAibGV0IHVybEFscGhhYmV0ID1cbiAgJ3VzZWFuZG9tLTI2VDE5ODM0MFBYNzVweEpBQ0tWRVJZTUlOREJVU0hXT0xGX0dRWmJmZ2hqa2xxdnd5enJpY3QnXG5leHBvcnQgbGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSA9IDIxKSA9PiB7XG4gIHJldHVybiAoc2l6ZSA9IGRlZmF1bHRTaXplKSA9PiB7XG4gICAgbGV0IGlkID0gJydcbiAgICBsZXQgaSA9IHNpemVcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZCArPSBhbHBoYWJldFsoTWF0aC5yYW5kb20oKSAqIGFscGhhYmV0Lmxlbmd0aCkgfCAwXVxuICAgIH1cbiAgICByZXR1cm4gaWRcbiAgfVxufVxuZXhwb3J0IGxldCBuYW5vaWQgPSAoc2l6ZSA9IDIxKSA9PiB7XG4gIGxldCBpZCA9ICcnXG4gIGxldCBpID0gc2l6ZVxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWQgKz0gdXJsQWxwaGFiZXRbKE1hdGgucmFuZG9tKCkgKiA2NCkgfCAwXVxuICB9XG4gIHJldHVybiBpZFxufVxuIiwgIi8qXHJcbiBfXHQgICBfX1x0ICBfIF9fXHJcbnwgfFx0IC8gL19fXyBfKF8pIC9fX19fXHJcbnwgfCAvfCAvIC8gX18gYC8gLyAvIF9fXy9cclxufCB8LyB8LyAvIC9fLyAvIC8gKF9fICApXHJcbnxfXy98X18vXFxfXyxfL18vXy9fX19fL1xyXG5UaGUgZWxlY3Ryb24gYWx0ZXJuYXRpdmUgZm9yIEdvXHJcbihjKSBMZWEgQW50aG9ueSAyMDE5LXByZXNlbnRcclxuKi9cclxuXHJcbi8qIGpzaGludCBlc3ZlcnNpb246IDkgKi9cclxuXHJcbmltcG9ydCB7bmV3UnVudGltZUNhbGxlcn0gZnJvbSBcIi4vcnVudGltZVwiO1xyXG5cclxuaW1wb3J0IHsgbmFub2lkIH0gZnJvbSAnbmFub2lkL25vbi1zZWN1cmUnO1xyXG5cclxubGV0IGNhbGwgPSBuZXdSdW50aW1lQ2FsbGVyKFwiY2FsbFwiKTtcclxuXHJcbmxldCBjYWxsUmVzcG9uc2VzID0gbmV3IE1hcCgpO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVJRCgpIHtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgcmVzdWx0ID0gbmFub2lkKCk7XHJcbiAgICB9IHdoaWxlIChjYWxsUmVzcG9uc2VzLmhhcyhyZXN1bHQpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjYWxsQ2FsbGJhY2soaWQsIGRhdGEsIGlzSlNPTikge1xyXG4gICAgbGV0IHAgPSBjYWxsUmVzcG9uc2VzLmdldChpZCk7XHJcbiAgICBpZiAocCkge1xyXG4gICAgICAgIGlmIChpc0pTT04pIHtcclxuICAgICAgICAgICAgcC5yZXNvbHZlKEpTT04ucGFyc2UoZGF0YSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHAucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbFJlc3BvbnNlcy5kZWxldGUoaWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2FsbEVycm9yQ2FsbGJhY2soaWQsIG1lc3NhZ2UpIHtcclxuICAgIGxldCBwID0gY2FsbFJlc3BvbnNlcy5nZXQoaWQpO1xyXG4gICAgaWYgKHApIHtcclxuICAgICAgICBwLnJlamVjdChtZXNzYWdlKTtcclxuICAgICAgICBjYWxsUmVzcG9uc2VzLmRlbGV0ZShpZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGxCaW5kaW5nKHR5cGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgbGV0IGlkID0gZ2VuZXJhdGVJRCgpO1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIG9wdGlvbnNbXCJjYWxsLWlkXCJdID0gaWQ7XHJcbiAgICAgICAgY2FsbFJlc3BvbnNlcy5zZXQoaWQsIHtyZXNvbHZlLCByZWplY3R9KTtcclxuICAgICAgICBjYWxsKHR5cGUsIG9wdGlvbnMpLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICBjYWxsUmVzcG9uc2VzLmRlbGV0ZShpZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENhbGwob3B0aW9ucykge1xyXG4gICAgcmV0dXJuIGNhbGxCaW5kaW5nKFwiQ2FsbFwiLCBvcHRpb25zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGwgYSBwbHVnaW4gbWV0aG9kXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwbHVnaW5OYW1lIC0gbmFtZSBvZiB0aGUgcGx1Z2luXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIC0gbmFtZSBvZiB0aGUgbWV0aG9kXHJcbiAqIEBwYXJhbSB7Li4uYW55fSBhcmdzIC0gYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIG1ldGhvZFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fSAtIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZXN1bHRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBQbHVnaW4ocGx1Z2luTmFtZSwgbWV0aG9kTmFtZSwgLi4uYXJncykge1xyXG4gICAgcmV0dXJuIGNhbGxCaW5kaW5nKFwiQ2FsbFwiLCB7XHJcbiAgICAgICAgcGFja2FnZU5hbWU6IFwid2FpbHMtcGx1Z2luc1wiLFxyXG4gICAgICAgIHN0cnVjdE5hbWU6IHBsdWdpbk5hbWUsXHJcbiAgICAgICAgbWV0aG9kTmFtZTogbWV0aG9kTmFtZSxcclxuICAgICAgICBhcmdzOiBhcmdzLFxyXG4gICAgfSk7XHJcbn0iLCAiLypcclxuIF9cdCAgIF9fXHQgIF8gX19cclxufCB8XHQgLyAvX19fIF8oXykgL19fX19cclxufCB8IC98IC8gLyBfXyBgLyAvIC8gX19fL1xyXG58IHwvIHwvIC8gL18vIC8gLyAoX18gIClcclxufF9fL3xfXy9cXF9fLF8vXy9fL19fX18vXHJcblRoZSBlbGVjdHJvbiBhbHRlcm5hdGl2ZSBmb3IgR29cclxuKGMpIExlYSBBbnRob255IDIwMTktcHJlc2VudFxyXG4qL1xyXG5cclxuLyoganNoaW50IGVzdmVyc2lvbjogOSAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi9hcGkvdHlwZXNcIikuU2l6ZX0gU2l6ZVxyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KFwiLi4vYXBpL3R5cGVzXCIpLlBvc2l0aW9ufSBQb3NpdGlvblxyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KFwiLi4vYXBpL3R5cGVzXCIpLlNjcmVlbn0gU2NyZWVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtuZXdSdW50aW1lQ2FsbGVyfSBmcm9tIFwiLi9ydW50aW1lXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmV3V2luZG93KHdpbmRvd05hbWUpIHtcclxuICAgIGxldCBjYWxsID0gbmV3UnVudGltZUNhbGxlcihcIndpbmRvd1wiLCB3aW5kb3dOYW1lKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gUmVsb2FkOiAoKSA9PiBjYWxsKCdXUicpLFxyXG4gICAgICAgIC8vIFJlbG9hZEFwcDogKCkgPT4gY2FsbCgnV1InKSxcclxuICAgICAgICAvLyBTZXRTeXN0ZW1EZWZhdWx0VGhlbWU6ICgpID0+IGNhbGwoJ1dBU0RUJyksXHJcbiAgICAgICAgLy8gU2V0TGlnaHRUaGVtZTogKCkgPT4gY2FsbCgnV0FMVCcpLFxyXG4gICAgICAgIC8vIFNldERhcmtUaGVtZTogKCkgPT4gY2FsbCgnV0FEVCcpLFxyXG4gICAgICAgIC8vIElzRnVsbHNjcmVlbjogKCkgPT4gY2FsbCgnV0lGJyksXHJcbiAgICAgICAgLy8gSXNNYXhpbWl6ZWQ6ICgpID0+IGNhbGwoJ1dJTScpLFxyXG4gICAgICAgIC8vIElzTWluaW1pemVkOiAoKSA9PiBjYWxsKCdXSU1OJyksXHJcbiAgICAgICAgLy8gSXNXaW5kb3dlZDogKCkgPT4gY2FsbCgnV0lGJyksXHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDZW50ZXJzIHRoZSB3aW5kb3cuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQ2VudGVyOiAoKSA9PiB2b2lkIGNhbGwoJ0NlbnRlcicpLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgdGhlIHdpbmRvdyB0aXRsZS5cclxuICAgICAgICAgKiBAcGFyYW0gdGl0bGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBTZXRUaXRsZTogKHRpdGxlKSA9PiB2b2lkIGNhbGwoJ1NldFRpdGxlJywge3RpdGxlfSksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1ha2VzIHRoZSB3aW5kb3cgZnVsbHNjcmVlbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBGdWxsc2NyZWVuOiAoKSA9PiB2b2lkIGNhbGwoJ0Z1bGxzY3JlZW4nKSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVW5mdWxsc2NyZWVuIHRoZSB3aW5kb3cuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVW5GdWxsc2NyZWVuOiAoKSA9PiB2b2lkIGNhbGwoJ1VuRnVsbHNjcmVlbicpLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgdGhlIHdpbmRvdyBzaXplLlxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBUaGUgd2luZG93IHdpZHRoXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBUaGUgd2luZG93IGhlaWdodFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFNldFNpemU6ICh3aWR0aCwgaGVpZ2h0KSA9PiBjYWxsKCdTZXRTaXplJywge3dpZHRoLGhlaWdodH0pLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIHdpbmRvdyBzaXplLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFNpemU+fSBUaGUgd2luZG93IHNpemVcclxuICAgICAgICAgKi9cclxuICAgICAgICBTaXplOiAoKSA9PiB7IHJldHVybiBjYWxsKCdTaXplJyk7IH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldCB0aGUgd2luZG93IG1heGltdW0gc2l6ZS5cclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgU2V0TWF4U2l6ZTogKHdpZHRoLCBoZWlnaHQpID0+IHZvaWQgY2FsbCgnU2V0TWF4U2l6ZScsIHt3aWR0aCxoZWlnaHR9KSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHRoZSB3aW5kb3cgbWluaW11bSBzaXplLlxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAgICAgKi9cclxuICAgICAgICBTZXRNaW5TaXplOiAod2lkdGgsIGhlaWdodCkgPT4gdm9pZCBjYWxsKCdTZXRNaW5TaXplJywge3dpZHRoLGhlaWdodH0pLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgd2luZG93IHRvIGJlIGFsd2F5cyBvbiB0b3AuXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBvblRvcCBXaGV0aGVyIHRoZSB3aW5kb3cgc2hvdWxkIGJlIGFsd2F5cyBvbiB0b3BcclxuICAgICAgICAgKi9cclxuICAgICAgICBTZXRBbHdheXNPblRvcDogKG9uVG9wKSA9PiB2b2lkIGNhbGwoJ1NldEFsd2F5c09uVG9wJywge2Fsd2F5c09uVG9wOm9uVG9wfSksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldCB0aGUgd2luZG93IHBvc2l0aW9uLlxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAgICAgKi9cclxuICAgICAgICBTZXRQb3NpdGlvbjogKHgsIHkpID0+IGNhbGwoJ1NldFBvc2l0aW9uJywge3gseX0pLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIHdpbmRvdyBwb3NpdGlvbi5cclxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQb3NpdGlvbj59IFRoZSB3aW5kb3cgcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBQb3NpdGlvbjogKCkgPT4geyByZXR1cm4gY2FsbCgnUG9zaXRpb24nKTsgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IHRoZSBzY3JlZW4gdGhlIHdpbmRvdyBpcyBvbi5cclxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTY3JlZW4+fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFNjcmVlbjogKCkgPT4geyByZXR1cm4gY2FsbCgnU2NyZWVuJyk7IH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhpZGUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEhpZGU6ICgpID0+IHZvaWQgY2FsbCgnSGlkZScpLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYXhpbWlzZSB0aGUgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWF4aW1pc2U6ICgpID0+IHZvaWQgY2FsbCgnTWF4aW1pc2UnKSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2hvdyB0aGUgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgU2hvdzogKCkgPT4gdm9pZCBjYWxsKCdTaG93JyksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENsb3NlIHRoZSB3aW5kb3dcclxuICAgICAgICAgKi9cclxuICAgICAgICBDbG9zZTogKCkgPT4gdm9pZCBjYWxsKCdDbG9zZScpLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUb2dnbGUgdGhlIHdpbmRvdyBtYXhpbWlzZSBzdGF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFRvZ2dsZU1heGltaXNlOiAoKSA9PiB2b2lkIGNhbGwoJ1RvZ2dsZU1heGltaXNlJyksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVubWF4aW1pc2UgdGhlIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFVuTWF4aW1pc2U6ICgpID0+IHZvaWQgY2FsbCgnVW5NYXhpbWlzZScpLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNaW5pbWlzZSB0aGUgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWluaW1pc2U6ICgpID0+IHZvaWQgY2FsbCgnTWluaW1pc2UnKSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVW5taW5pbWlzZSB0aGUgd2luZG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVW5NaW5pbWlzZTogKCkgPT4gdm9pZCBjYWxsKCdVbk1pbmltaXNlJyksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlc3RvcmUgdGhlIHdpbmRvd1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJlc3RvcmU6ICgpID0+IHZvaWQgY2FsbCgnUmVzdG9yZScpLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgdGhlIGJhY2tncm91bmQgY29sb3VyIG9mIHRoZSB3aW5kb3cuXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHIgLSBBIHZhbHVlIGJldHdlZW4gMCBhbmQgMjU1XHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGcgLSBBIHZhbHVlIGJldHdlZW4gMCBhbmQgMjU1XHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGIgLSBBIHZhbHVlIGJldHdlZW4gMCBhbmQgMjU1XHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGEgLSBBIHZhbHVlIGJldHdlZW4gMCBhbmQgMjU1XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgU2V0QmFja2dyb3VuZENvbG91cjogKHIsIGcsIGIsIGEpID0+IHZvaWQgY2FsbCgnU2V0QmFja2dyb3VuZENvbG91cicsIHtyLCBnLCBiLCBhfSksXHJcbiAgICB9O1xyXG59XHJcbiIsICIvKlxyXG4gX1x0ICAgX19cdCAgXyBfX1xyXG58IHxcdCAvIC9fX18gXyhfKSAvX19fX1xyXG58IHwgL3wgLyAvIF9fIGAvIC8gLyBfX18vXHJcbnwgfC8gfC8gLyAvXy8gLyAvIChfXyAgKVxyXG58X18vfF9fL1xcX18sXy9fL18vX19fXy9cclxuVGhlIGVsZWN0cm9uIGFsdGVybmF0aXZlIGZvciBHb1xyXG4oYykgTGVhIEFudGhvbnkgMjAxOS1wcmVzZW50XHJcbiovXHJcblxyXG4vKiBqc2hpbnQgZXN2ZXJzaW9uOiA5ICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge2ltcG9ydChcIi4vYXBpL3R5cGVzXCIpLldhaWxzRXZlbnR9IFdhaWxzRXZlbnRcclxuICovXHJcblxyXG5pbXBvcnQge25ld1J1bnRpbWVDYWxsZXJ9IGZyb20gXCIuL3J1bnRpbWVcIjtcclxuXHJcbmxldCBjYWxsID0gbmV3UnVudGltZUNhbGxlcihcImV2ZW50c1wiKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgTGlzdGVuZXIgY2xhc3MgZGVmaW5lcyBhIGxpc3RlbmVyISA6LSlcclxuICpcclxuICogQGNsYXNzIExpc3RlbmVyXHJcbiAqL1xyXG5jbGFzcyBMaXN0ZW5lciB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgTGlzdGVuZXIuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heENhbGxiYWNrc1xyXG4gICAgICogQG1lbWJlcm9mIExpc3RlbmVyXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG1heENhbGxiYWNrcykge1xyXG4gICAgICAgIHRoaXMuZXZlbnROYW1lID0gZXZlbnROYW1lO1xyXG4gICAgICAgIC8vIERlZmF1bHQgb2YgLTEgbWVhbnMgaW5maW5pdGVcclxuICAgICAgICB0aGlzLm1heENhbGxiYWNrcyA9IG1heENhbGxiYWNrcyB8fCAtMTtcclxuICAgICAgICAvLyBDYWxsYmFjayBpbnZva2VzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBnaXZlbiBkYXRhXHJcbiAgICAgICAgLy8gUmV0dXJucyB0cnVlIGlmIHRoaXMgbGlzdGVuZXIgc2hvdWxkIGJlIGRlc3Ryb3llZFxyXG4gICAgICAgIHRoaXMuQ2FsbGJhY2sgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgLy8gSWYgbWF4Q2FsbGJhY2tzIGlzIGluZmluaXRlLCByZXR1cm4gZmFsc2UgKGRvIG5vdCBkZXN0cm95KVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXhDYWxsYmFja3MgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gRGVjcmVtZW50IG1heENhbGxiYWNrcy4gUmV0dXJuIHRydWUgaWYgbm93IDAsIG90aGVyd2lzZSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLm1heENhbGxiYWNrcyAtPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXhDYWxsYmFja3MgPT09IDA7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBXYWlsc0V2ZW50IGRlZmluZXMgYSBjdXN0b20gZXZlbnQuIEl0IGlzIHBhc3NlZCB0byBldmVudCBsaXN0ZW5lcnMuXHJcbiAqXHJcbiAqIEBjbGFzcyBXYWlsc0V2ZW50XHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgZXZlbnRcclxuICogQHByb3BlcnR5IHthbnl9IGRhdGEgLSBEYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgZXZlbnRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBXYWlsc0V2ZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBXYWlsc0V2ZW50LlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICogQHBhcmFtIHthbnk9bnVsbH0gZGF0YSAtIERhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBldmVudFxyXG4gICAgICogQG1lbWJlcm9mIFdhaWxzRXZlbnRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSwgZGF0YSA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBldmVudExpc3RlbmVycyA9IG5ldyBNYXAoKTtcclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYG1heENhbGxiYWNrc2AgdGltZXMgYmVmb3JlIGJlaW5nIGRlc3Ryb3llZFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcclxuICogQHBhcmFtIHtmdW5jdGlvbihXYWlsc0V2ZW50KTogdm9pZH0gY2FsbGJhY2tcclxuICogQHBhcmFtIHtudW1iZXJ9IG1heENhbGxiYWNrc1xyXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IEEgZnVuY3Rpb24gdG8gY2FuY2VsIHRoZSBsaXN0ZW5lclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIE9uTXVsdGlwbGUoZXZlbnROYW1lLCBjYWxsYmFjaywgbWF4Q2FsbGJhY2tzKSB7XHJcbiAgICBsZXQgbGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuZ2V0KGV2ZW50TmFtZSkgfHwgW107XHJcbiAgICBjb25zdCB0aGlzTGlzdGVuZXIgPSBuZXcgTGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgbWF4Q2FsbGJhY2tzKTtcclxuICAgIGxpc3RlbmVycy5wdXNoKHRoaXNMaXN0ZW5lcik7XHJcbiAgICBldmVudExpc3RlbmVycy5zZXQoZXZlbnROYW1lLCBsaXN0ZW5lcnMpO1xyXG4gICAgcmV0dXJuICgpID0+IGxpc3RlbmVyT2ZmKHRoaXNMaXN0ZW5lcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgZXZlcnkgdGltZSB0aGUgZXZlbnQgaXMgZW1pdHRlZFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcclxuICogQHBhcmFtIHtmdW5jdGlvbihXYWlsc0V2ZW50KTogdm9pZH0gY2FsbGJhY2tcclxuICogQHJldHVybnMge2Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRvIGNhbmNlbCB0aGUgbGlzdGVuZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBPbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gT25NdWx0aXBsZShldmVudE5hbWUsIGNhbGxiYWNrLCAtMSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgb25jZSB0aGVuIGRlc3Ryb3llZFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcclxuICogQHBhcmFtIHtmdW5jdGlvbihXYWlsc0V2ZW50KTogdm9pZH0gY2FsbGJhY2tcclxuIEByZXR1cm5zIHtmdW5jdGlvbn0gQSBmdW5jdGlvbiB0byBjYW5jZWwgdGhlIGxpc3RlbmVyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gT25jZShldmVudE5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gT25NdWx0aXBsZShldmVudE5hbWUsIGNhbGxiYWNrLCAxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIGxpc3RlbmVyT2ZmIHVucmVnaXN0ZXJzIGEgbGlzdGVuZXIgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggT25cclxuICpcclxuICogQHBhcmFtIHtMaXN0ZW5lcn0gbGlzdGVuZXJcclxuICovXHJcbmZ1bmN0aW9uIGxpc3RlbmVyT2ZmKGxpc3RlbmVyKSB7XHJcbiAgICBjb25zdCBldmVudE5hbWUgPSBsaXN0ZW5lci5ldmVudE5hbWU7XHJcbiAgICAvLyBSZW1vdmUgbG9jYWwgbGlzdGVuZXJcclxuICAgIGxldCBsaXN0ZW5lcnMgPSBldmVudExpc3RlbmVycy5nZXQoZXZlbnROYW1lKS5maWx0ZXIobCA9PiBsICE9PSBsaXN0ZW5lcik7XHJcbiAgICBpZiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGV2ZW50TGlzdGVuZXJzLmRlbGV0ZShldmVudE5hbWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudExpc3RlbmVycy5zZXQoZXZlbnROYW1lLCBsaXN0ZW5lcnMpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogZGlzcGF0Y2hlcyBhbiBldmVudCB0byBhbGwgbGlzdGVuZXJzXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtXYWlsc0V2ZW50fSBldmVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoV2FpbHNFdmVudChldmVudCkge1xyXG4gICAgY29uc29sZS5sb2coXCJkaXNwYXRjaGluZyBldmVudDogXCIsIHtldmVudH0pO1xyXG4gICAgbGV0IGxpc3RlbmVycyA9IGV2ZW50TGlzdGVuZXJzLmdldChldmVudC5uYW1lKTtcclxuICAgIGlmIChsaXN0ZW5lcnMpIHtcclxuICAgICAgICAvLyBpdGVyYXRlIGxpc3RlbmVycyBhbmQgY2FsbCBjYWxsYmFjay4gSWYgY2FsbGJhY2sgcmV0dXJucyB0cnVlLCByZW1vdmUgbGlzdGVuZXJcclxuICAgICAgICBsZXQgdG9SZW1vdmUgPSBbXTtcclxuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZW1vdmUgPSBsaXN0ZW5lci5DYWxsYmFjayhldmVudCk7XHJcbiAgICAgICAgICAgIGlmIChyZW1vdmUpIHtcclxuICAgICAgICAgICAgICAgIHRvUmVtb3ZlLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyc1xyXG4gICAgICAgIGlmICh0b1JlbW92ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIobCA9PiAhdG9SZW1vdmUuaW5jbHVkZXMobCkpO1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lcnMuZGVsZXRlKGV2ZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lcnMuc2V0KGV2ZW50Lm5hbWUsIGxpc3RlbmVycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPZmYgdW5yZWdpc3RlcnMgYSBsaXN0ZW5lciBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCBPbixcclxuICogb3B0aW9uYWxseSBtdWx0aXBsZSBsaXN0ZW5lcnMgY2FuIGJlIHVucmVnaXN0ZXJlZCB2aWEgYGFkZGl0aW9uYWxFdmVudE5hbWVzYFxyXG4gKlxyXG4gW3YzIENIQU5HRV0gT2ZmIG9ubHkgdW5yZWdpc3RlcnMgbGlzdGVuZXJzIHdpdGhpbiB0aGUgY3VycmVudCB3aW5kb3dcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxyXG4gKiBAcGFyYW0gIHsuLi5zdHJpbmd9IGFkZGl0aW9uYWxFdmVudE5hbWVzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gT2ZmKGV2ZW50TmFtZSwgLi4uYWRkaXRpb25hbEV2ZW50TmFtZXMpIHtcclxuICAgIGxldCBldmVudHNUb1JlbW92ZSA9IFtldmVudE5hbWUsIC4uLmFkZGl0aW9uYWxFdmVudE5hbWVzXTtcclxuICAgIGV2ZW50c1RvUmVtb3ZlLmZvckVhY2goZXZlbnROYW1lID0+IHtcclxuICAgICAgICBldmVudExpc3RlbmVycy5kZWxldGUoZXZlbnROYW1lKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogT2ZmQWxsIHVucmVnaXN0ZXJzIGFsbCBsaXN0ZW5lcnNcclxuICogW3YzIENIQU5HRV0gT2ZmQWxsIG9ubHkgdW5yZWdpc3RlcnMgbGlzdGVuZXJzIHdpdGhpbiB0aGUgY3VycmVudCB3aW5kb3dcclxuICpcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBPZmZBbGwoKSB7XHJcbiAgICBldmVudExpc3RlbmVycy5jbGVhcigpO1xyXG59XHJcblxyXG4vKipcclxuICogRW1pdCBhbiBldmVudFxyXG4gKiBAcGFyYW0ge1dhaWxzRXZlbnR9IGV2ZW50IFRoZSBldmVudCB0byBlbWl0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gRW1pdChldmVudCkge1xyXG4gICAgdm9pZCBjYWxsKFwiRW1pdFwiLCBldmVudCk7XHJcbn0iLCAiLypcclxuIF9cdCAgIF9fXHQgIF8gX19cclxufCB8XHQgLyAvX19fIF8oXykgL19fX19cclxufCB8IC98IC8gLyBfXyBgLyAvIC8gX19fL1xyXG58IHwvIHwvIC8gL18vIC8gLyAoX18gIClcclxufF9fL3xfXy9cXF9fLF8vXy9fL19fX18vXHJcblRoZSBlbGVjdHJvbiBhbHRlcm5hdGl2ZSBmb3IgR29cclxuKGMpIExlYSBBbnRob255IDIwMTktcHJlc2VudFxyXG4qL1xyXG5cclxuLyoganNoaW50IGVzdmVyc2lvbjogOSAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtpbXBvcnQoXCIuL2FwaS90eXBlc1wiKS5NZXNzYWdlRGlhbG9nT3B0aW9uc30gTWVzc2FnZURpYWxvZ09wdGlvbnNcclxuICogQHR5cGVkZWYge2ltcG9ydChcIi4vYXBpL3R5cGVzXCIpLk9wZW5EaWFsb2dPcHRpb25zfSBPcGVuRGlhbG9nT3B0aW9uc1xyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KFwiLi9hcGkvdHlwZXNcIikuU2F2ZURpYWxvZ09wdGlvbnN9IFNhdmVEaWFsb2dPcHRpb25zXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtuZXdSdW50aW1lQ2FsbGVyfSBmcm9tIFwiLi9ydW50aW1lXCI7XHJcblxyXG5pbXBvcnQgeyBuYW5vaWQgfSBmcm9tICduYW5vaWQvbm9uLXNlY3VyZSc7XHJcblxyXG5sZXQgY2FsbCA9IG5ld1J1bnRpbWVDYWxsZXIoXCJkaWFsb2dcIik7XHJcblxyXG5sZXQgZGlhbG9nUmVzcG9uc2VzID0gbmV3IE1hcCgpO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVJRCgpIHtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgcmVzdWx0ID0gbmFub2lkKCk7XHJcbiAgICB9IHdoaWxlIChkaWFsb2dSZXNwb25zZXMuaGFzKHJlc3VsdCkpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpYWxvZ0NhbGxiYWNrKGlkLCBkYXRhLCBpc0pTT04pIHtcclxuICAgIGxldCBwID0gZGlhbG9nUmVzcG9uc2VzLmdldChpZCk7XHJcbiAgICBpZiAocCkge1xyXG4gICAgICAgIGlmIChpc0pTT04pIHtcclxuICAgICAgICAgICAgcC5yZXNvbHZlKEpTT04ucGFyc2UoZGF0YSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHAucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlhbG9nUmVzcG9uc2VzLmRlbGV0ZShpZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGRpYWxvZ0Vycm9yQ2FsbGJhY2soaWQsIG1lc3NhZ2UpIHtcclxuICAgIGxldCBwID0gZGlhbG9nUmVzcG9uc2VzLmdldChpZCk7XHJcbiAgICBpZiAocCkge1xyXG4gICAgICAgIHAucmVqZWN0KG1lc3NhZ2UpO1xyXG4gICAgICAgIGRpYWxvZ1Jlc3BvbnNlcy5kZWxldGUoaWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkaWFsb2codHlwZSwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBsZXQgaWQgPSBnZW5lcmF0ZUlEKCk7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgb3B0aW9uc1tcImRpYWxvZy1pZFwiXSA9IGlkO1xyXG4gICAgICAgIGRpYWxvZ1Jlc3BvbnNlcy5zZXQoaWQsIHtyZXNvbHZlLCByZWplY3R9KTtcclxuICAgICAgICBjYWxsKHR5cGUsIG9wdGlvbnMpLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICBkaWFsb2dSZXNwb25zZXMuZGVsZXRlKGlkKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFNob3dzIGFuIEluZm8gZGlhbG9nIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSB7TWVzc2FnZURpYWxvZ09wdGlvbnN9IG9wdGlvbnNcclxuICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gVGhlIGxhYmVsIG9mIHRoZSBidXR0b24gcHJlc3NlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIEluZm8ob3B0aW9ucykge1xyXG4gICAgcmV0dXJuIGRpYWxvZyhcIkluZm9cIiwgb3B0aW9ucyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG93cyBhbiBXYXJuaW5nIGRpYWxvZyB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxyXG4gKiBAcGFyYW0ge01lc3NhZ2VEaWFsb2dPcHRpb25zfSBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59IFRoZSBsYWJlbCBvZiB0aGUgYnV0dG9uIHByZXNzZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBXYXJuaW5nKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBkaWFsb2coXCJXYXJuaW5nXCIsIG9wdGlvbnMpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvd3MgYW4gRXJyb3IgZGlhbG9nIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSB7TWVzc2FnZURpYWxvZ09wdGlvbnN9IG9wdGlvbnNcclxuICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gVGhlIGxhYmVsIG9mIHRoZSBidXR0b24gcHJlc3NlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIEVycm9yKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBkaWFsb2coXCJFcnJvclwiLCBvcHRpb25zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3dzIGEgUXVlc3Rpb24gZGlhbG9nIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSB7TWVzc2FnZURpYWxvZ09wdGlvbnN9IG9wdGlvbnNcclxuICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gVGhlIGxhYmVsIG9mIHRoZSBidXR0b24gcHJlc3NlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIFF1ZXN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBkaWFsb2coXCJRdWVzdGlvblwiLCBvcHRpb25zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3dzIGFuIE9wZW4gZGlhbG9nIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSB7T3BlbkRpYWxvZ09wdGlvbnN9IG9wdGlvbnNcclxuICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nW118c3RyaW5nPn0gUmV0dXJucyB0aGUgc2VsZWN0ZWQgZmlsZSBvciBhbiBhcnJheSBvZiBzZWxlY3RlZCBmaWxlcyBpZiBBbGxvd3NNdWx0aXBsZVNlbGVjdGlvbiBpcyB0cnVlLiBBIGJsYW5rIHN0cmluZyBpcyByZXR1cm5lZCBpZiBubyBmaWxlIHdhcyBzZWxlY3RlZC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBPcGVuRmlsZShvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gZGlhbG9nKFwiT3BlbkZpbGVcIiwgb3B0aW9ucyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG93cyBhIFNhdmUgZGlhbG9nIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSB7T3BlbkRpYWxvZ09wdGlvbnN9IG9wdGlvbnNcclxuICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gUmV0dXJucyB0aGUgc2VsZWN0ZWQgZmlsZS4gQSBibGFuayBzdHJpbmcgaXMgcmV0dXJuZWQgaWYgbm8gZmlsZSB3YXMgc2VsZWN0ZWQuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gU2F2ZUZpbGUob3B0aW9ucykge1xyXG4gICAgcmV0dXJuIGRpYWxvZyhcIlNhdmVGaWxlXCIsIG9wdGlvbnMpO1xyXG59XHJcblxyXG4iLCAiaW1wb3J0IHtuZXdSdW50aW1lQ2FsbGVyfSBmcm9tIFwiLi9ydW50aW1lXCI7XHJcblxyXG5sZXQgY2FsbCA9IG5ld1J1bnRpbWVDYWxsZXIoXCJjb250ZXh0bWVudVwiKTtcclxuXHJcbmZ1bmN0aW9uIG9wZW5Db250ZXh0TWVudShpZCwgeCwgeSwgZGF0YSkge1xyXG4gICAgdm9pZCBjYWxsKFwiT3BlbkNvbnRleHRNZW51XCIsIHtpZCwgeCwgeSwgZGF0YX0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBDb250ZXh0TWVudXMoKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBjb250ZXh0TWVudUhhbmRsZXIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb250ZXh0TWVudUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIC8vIENoZWNrIGZvciBjdXN0b20gY29udGV4dCBtZW51XHJcbiAgICBsZXQgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGxldCBjdXN0b21Db250ZXh0TWVudSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoXCItLWN1c3RvbS1jb250ZXh0bWVudVwiKTtcclxuICAgIGN1c3RvbUNvbnRleHRNZW51ID0gY3VzdG9tQ29udGV4dE1lbnUgPyBjdXN0b21Db250ZXh0TWVudS50cmltKCkgOiBcIlwiO1xyXG4gICAgaWYgKGN1c3RvbUNvbnRleHRNZW51KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsZXQgY3VzdG9tQ29udGV4dE1lbnVEYXRhID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY3VzdG9tLWNvbnRleHRtZW51LWRhdGFcIik7XHJcbiAgICAgICAgb3BlbkNvbnRleHRNZW51KGN1c3RvbUNvbnRleHRNZW51LCBldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZLCBjdXN0b21Db250ZXh0TWVudURhdGEpO1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHByb2Nlc3NEZWZhdWx0Q29udGV4dE1lbnUoZXZlbnQpO1xyXG59XHJcblxyXG5cclxuLypcclxuRGVmYXVsdDogU2hvdyBkZWZhdWx0IGNvbnRleHQgbWVudSBpZiBjb250ZW50RWRpdGFibGU6IHRydWUgT1IgdGV4dCBoYXMgYmVlbiBzZWxlY3RlZCBPUiAtLWRlZmF1bHQtY29udGV4dG1lbnU6IHNob3cgT1IgdGFnbmFtZSBpcyBpbnB1dCBvciB0ZXh0YXJlYVxyXG4tLWRlZmF1bHQtY29udGV4dG1lbnU6IHNob3cgd2lsbCBhbHdheXMgc2hvdyB0aGUgY29udGV4dCBtZW51XHJcbi0tZGVmYXVsdC1jb250ZXh0bWVudTogaGlkZSB3aWxsIGFsd2F5cyBoaWRlIHRoZSBjb250ZXh0IG1lbnVcclxuICovXHJcbmZ1bmN0aW9uIHByb2Nlc3NEZWZhdWx0Q29udGV4dE1lbnUoZXZlbnQpIHtcclxuICAgIC8vIFByb2Nlc3MgZGVmYXVsdCBjb250ZXh0IG1lbnVcclxuICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgbGV0IGRlZmF1bHRDb250ZXh0TWVudUFjdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoXCItLWRlZmF1bHQtY29udGV4dG1lbnVcIik7XHJcbiAgICBkZWZhdWx0Q29udGV4dE1lbnVBY3Rpb24gPSBkZWZhdWx0Q29udGV4dE1lbnVBY3Rpb24gPyBkZWZhdWx0Q29udGV4dE1lbnVBY3Rpb24udHJpbSgpIDogXCJcIjtcclxuICAgIHN3aXRjaChkZWZhdWx0Q29udGV4dE1lbnVBY3Rpb24pIHtcclxuICAgICAgICBjYXNlIFwic2hvd1wiOlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY2FzZSBcImhpZGVcIjpcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGNvbnRlbnRFZGl0YWJsZSBpcyB0cnVlXHJcbiAgICAgICAgICAgIGxldCBjb250ZW50RWRpdGFibGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImNvbnRlbnRFZGl0YWJsZVwiKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRFZGl0YWJsZSAmJiBjb250ZW50RWRpdGFibGUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGV4dCBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uICYmIHNlbGVjdGlvbi50b1N0cmluZygpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGFnbmFtZSBpcyBpbnB1dCBvciB0ZXh0YXJlYVxyXG4gICAgICAgICAgICBsZXQgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAodGFnTmFtZSA9PT0gXCJpbnB1dFwiIHx8IHRhZ05hbWUgPT09IFwidGV4dGFyZWFcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBoaWRlIGRlZmF1bHQgY29udGV4dCBtZW51XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbn1cclxuIiwgIlxyXG5pbXBvcnQge0VtaXQsIFdhaWxzRXZlbnR9IGZyb20gXCIuL2V2ZW50c1wiO1xyXG5pbXBvcnQge1F1ZXN0aW9ufSBmcm9tIFwiLi9kaWFsb2dzXCI7XHJcblxyXG5mdW5jdGlvbiBzZW5kRXZlbnQoZXZlbnROYW1lLCBkYXRhPW51bGwpIHtcclxuICAgIGxldCBldmVudCA9IG5ldyBXYWlsc0V2ZW50KGV2ZW50TmFtZSwgZGF0YSk7XHJcbiAgICBFbWl0KGV2ZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkV01MRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXdtbC1ldmVudF0nKTtcclxuICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBldmVudFR5cGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS13bWwtZXZlbnQnKTtcclxuICAgICAgICBjb25zdCBjb25maXJtID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd21sLWNvbmZpcm0nKTtcclxuICAgICAgICBjb25zdCB0cmlnZ2VyID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd21sLXRyaWdnZXInKSB8fCBcImNsaWNrXCI7XHJcblxyXG4gICAgICAgIGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGNvbmZpcm0pIHtcclxuICAgICAgICAgICAgICAgIFF1ZXN0aW9uKHtUaXRsZTogXCJDb25maXJtXCIsIE1lc3NhZ2U6Y29uZmlybSwgQnV0dG9uczpbe0xhYmVsOlwiWWVzXCJ9LHtMYWJlbDpcIk5vXCIsIElzRGVmYXVsdDp0cnVlfV19KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9PSBcIk5vXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZEV2ZW50KGV2ZW50VHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VuZEV2ZW50KGV2ZW50VHlwZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBSZW1vdmUgZXhpc3RpbmcgbGlzdGVuZXJzXHJcblxyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmlnZ2VyLCBjYWxsYmFjayk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBuZXcgbGlzdGVuZXJcclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHJpZ2dlciwgY2FsbGJhY2spO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGxXaW5kb3dNZXRob2QobWV0aG9kKSB7XHJcbiAgICBpZiAod2FpbHMuV2luZG93W21ldGhvZF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2luZG93IG1ldGhvZCBcIiArIG1ldGhvZCArIFwiIG5vdCBmb3VuZFwiKTtcclxuICAgIH1cclxuICAgIHdhaWxzLldpbmRvd1ttZXRob2RdKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFdNTFdpbmRvd0xpc3RlbmVycygpIHtcclxuICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtd21sLXdpbmRvd10nKTtcclxuICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCB3aW5kb3dNZXRob2QgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS13bWwtd2luZG93Jyk7XHJcbiAgICAgICAgY29uc3QgY29uZmlybSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXdtbC1jb25maXJtJyk7XHJcbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXdtbC10cmlnZ2VyJykgfHwgXCJjbGlja1wiO1xyXG5cclxuICAgICAgICBsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChjb25maXJtKSB7XHJcbiAgICAgICAgICAgICAgICBRdWVzdGlvbih7VGl0bGU6IFwiQ29uZmlybVwiLCBNZXNzYWdlOmNvbmZpcm0sIEJ1dHRvbnM6W3tMYWJlbDpcIlllc1wifSx7TGFiZWw6XCJOb1wiLCBJc0RlZmF1bHQ6dHJ1ZX1dfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gXCJOb1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxXaW5kb3dNZXRob2Qod2luZG93TWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsV2luZG93TWV0aG9kKHdpbmRvd01ldGhvZCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGV4aXN0aW5nIGxpc3RlbmVyc1xyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmlnZ2VyLCBjYWxsYmFjayk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBuZXcgbGlzdGVuZXJcclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHJpZ2dlciwgY2FsbGJhY2spO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWxvYWRXTUwoKSB7XHJcbiAgICBhZGRXTUxFdmVudExpc3RlbmVycygpO1xyXG4gICAgYWRkV01MV2luZG93TGlzdGVuZXJzKCk7XHJcbn1cclxuIiwgIi8qXHJcbiBfXHQgICBfX1x0ICBfIF9fXHJcbnwgfFx0IC8gL19fXyBfKF8pIC9fX19fXHJcbnwgfCAvfCAvIC8gX18gYC8gLyAvIF9fXy9cclxufCB8LyB8LyAvIC9fLyAvIC8gKF9fICApXHJcbnxfXy98X18vXFxfXyxfL18vXy9fX19fL1xyXG5UaGUgZWxlY3Ryb24gYWx0ZXJuYXRpdmUgZm9yIEdvXHJcbihjKSBMZWEgQW50aG9ueSAyMDE5LXByZXNlbnRcclxuKi9cclxuXHJcbi8qIGpzaGludCBlc3ZlcnNpb246IDkgKi9cclxuXHJcbi8vIGRlZmluZWQgaW4gdGhlIFRhc2tmaWxlXHJcbmV4cG9ydCBsZXQgaW52b2tlID0gZnVuY3Rpb24oaW5wdXQpIHtcclxuICAgIGlmKFdJTkRPV1MpIHtcclxuICAgICAgICBjaHJvbWUud2Vidmlldy5wb3N0TWVzc2FnZShpbnB1dCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdlYmtpdC5tZXNzYWdlSGFuZGxlcnMuZXh0ZXJuYWwucG9zdE1lc3NhZ2UoaW5wdXQpO1xyXG4gICAgfVxyXG59XHJcbiIsICIvKlxyXG4gX1x0ICAgX19cdCAgXyBfX1xyXG58IHxcdCAvIC9fX18gXyhfKSAvX19fX1xyXG58IHwgL3wgLyAvIF9fIGAvIC8gLyBfX18vXHJcbnwgfC8gfC8gLyAvXy8gLyAvIChfXyAgKVxyXG58X18vfF9fL1xcX18sXy9fL18vX19fXy9cclxuVGhlIGVsZWN0cm9uIGFsdGVybmF0aXZlIGZvciBHb1xyXG4oYykgTGVhIEFudGhvbnkgMjAxOS1wcmVzZW50XHJcbiovXHJcblxyXG4vKiBqc2hpbnQgZXN2ZXJzaW9uOiA5ICovXHJcblxyXG5sZXQgZmxhZ3MgPSBuZXcgTWFwKCk7XHJcblxyXG5mdW5jdGlvbiBjb252ZXJ0VG9NYXAob2JqKSB7XHJcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqKSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG1hcC5zZXQoa2V5LCBjb252ZXJ0VG9NYXAodmFsdWUpKTsgLy8gUmVjdXJzaXZlbHkgY29udmVydCBuZXN0ZWQgb2JqZWN0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWFwLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcDtcclxufVxyXG5cclxuZmV0Y2goXCIvd2FpbHMvZmxhZ3NcIikudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgIHJlc3BvbnNlLmpzb24oKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgZmxhZ3MgPSBjb252ZXJ0VG9NYXAoZGF0YSk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tTWFwKGtleVN0cmluZykge1xyXG4gICAgY29uc3Qga2V5cyA9IGtleVN0cmluZy5zcGxpdCgnLicpO1xyXG4gICAgbGV0IHZhbHVlID0gZmxhZ3M7XHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE1hcCkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmdldChrZXkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVba2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBHZXRGbGFnKGtleVN0cmluZykge1xyXG4gICAgcmV0dXJuIGdldFZhbHVlRnJvbU1hcChrZXlTdHJpbmcpO1xyXG59XHJcbiIsICIvKlxyXG4gX1x0ICAgX19cdCAgXyBfX1xyXG58IHxcdCAvIC9fX18gXyhfKSAvX19fX1xyXG58IHwgL3wgLyAvIF9fIGAvIC8gLyBfX18vXHJcbnwgfC8gfC8gLyAvXy8gLyAvIChfXyAgKVxyXG58X18vfF9fL1xcX18sXy9fL18vX19fXy9cclxuVGhlIGVsZWN0cm9uIGFsdGVybmF0aXZlIGZvciBHb1xyXG4oYykgTGVhIEFudGhvbnkgMjAxOS1wcmVzZW50XHJcbiovXHJcblxyXG4vKiBqc2hpbnQgZXN2ZXJzaW9uOiA5ICovXHJcblxyXG5pbXBvcnQge2ludm9rZX0gZnJvbSBcIi4vaW52b2tlXCI7XHJcbmltcG9ydCB7R2V0RmxhZ30gZnJvbSBcIi4vZmxhZ3NcIjtcclxuXHJcbmxldCBzaG91bGREcmFnID0gZmFsc2U7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhZ1Rlc3QoZSkge1xyXG4gICAgbGV0IHZhbCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGUudGFyZ2V0KS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS13ZWJraXQtYXBwLXJlZ2lvblwiKTtcclxuICAgIGlmICh2YWwpIHtcclxuICAgICAgICB2YWwgPSB2YWwudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWwgIT09IFwiZHJhZ1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9ubHkgcHJvY2VzcyB0aGUgcHJpbWFyeSBidXR0b25cclxuICAgIGlmIChlLmJ1dHRvbnMgIT09IDEpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGUuZGV0YWlsID09PSAxO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBEcmFnKCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XHJcbn1cclxuXHJcbmxldCByZXNpemVFZGdlID0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIHRlc3RSZXNpemUoZSkge1xyXG4gICAgaWYoIHJlc2l6ZUVkZ2UgKSB7XHJcbiAgICAgICAgaW52b2tlKFwicmVzaXplOlwiICsgcmVzaXplRWRnZSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xyXG5cclxuICAgIC8vIENoZWNrIGZvciByZXNpemluZyBvbiBXaW5kb3dzXHJcbiAgICBpZiggV0lORE9XUyApIHtcclxuICAgICAgICBpZiAodGVzdFJlc2l6ZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoZHJhZ1Rlc3QoZSkpIHtcclxuICAgICAgICAvLyBJZ25vcmUgZHJhZyBvbiBzY3JvbGxiYXJzXHJcbiAgICAgICAgaWYgKGUub2Zmc2V0WCA+IGUudGFyZ2V0LmNsaWVudFdpZHRoIHx8IGUub2Zmc2V0WSA+IGUudGFyZ2V0LmNsaWVudEhlaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNob3VsZERyYWcgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzaG91bGREcmFnID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uTW91c2VVcChlKSB7XHJcbiAgICBsZXQgbW91c2VQcmVzc2VkID0gZS5idXR0b25zICE9PSB1bmRlZmluZWQgPyBlLmJ1dHRvbnMgOiBlLndoaWNoO1xyXG4gICAgaWYgKG1vdXNlUHJlc3NlZCA+IDApIHtcclxuICAgICAgICBlbmREcmFnKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlbmREcmFnKCkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XHJcbiAgICBzaG91bGREcmFnID0gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFJlc2l6ZShjdXJzb3IpIHtcclxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5jdXJzb3IgPSBjdXJzb3IgfHwgZGVmYXVsdEN1cnNvcjtcclxuICAgIHJlc2l6ZUVkZ2UgPSBjdXJzb3I7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGUpIHtcclxuICAgIGlmIChzaG91bGREcmFnKSB7XHJcbiAgICAgICAgc2hvdWxkRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBtb3VzZVByZXNzZWQgPSBlLmJ1dHRvbnMgIT09IHVuZGVmaW5lZCA/IGUuYnV0dG9ucyA6IGUud2hpY2g7XHJcbiAgICAgICAgaWYgKG1vdXNlUHJlc3NlZCA+IDApIHtcclxuICAgICAgICAgICAgaW52b2tlKFwiZHJhZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChXSU5ET1dTKSB7XHJcbiAgICAgICAgaGFuZGxlUmVzaXplKGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgZGVmYXVsdEN1cnNvciA9IFwiYXV0b1wiO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlUmVzaXplKGUpIHtcclxuICAgIGxldCByZXNpemVIYW5kbGVIZWlnaHQgPSBHZXRGbGFnKFwic3lzdGVtLnJlc2l6ZUhhbmRsZUhlaWdodFwiKSB8fCA1O1xyXG4gICAgbGV0IHJlc2l6ZUhhbmRsZVdpZHRoID0gR2V0RmxhZyhcInN5c3RlbS5yZXNpemVIYW5kbGVXaWR0aFwiKSB8fCA1O1xyXG5cclxuICAgIC8vIEV4dHJhIHBpeGVscyBmb3IgdGhlIGNvcm5lciBhcmVhc1xyXG4gICAgbGV0IGNvcm5lckV4dHJhID0gR2V0RmxhZyhcInJlc2l6ZUNvcm5lckV4dHJhXCIpIHx8IDM7XHJcblxyXG4gICAgbGV0IHJpZ2h0Qm9yZGVyID0gd2luZG93Lm91dGVyV2lkdGggLSBlLmNsaWVudFggPCByZXNpemVIYW5kbGVXaWR0aDtcclxuICAgIGxldCBsZWZ0Qm9yZGVyID0gZS5jbGllbnRYIDwgcmVzaXplSGFuZGxlV2lkdGg7XHJcbiAgICBsZXQgdG9wQm9yZGVyID0gZS5jbGllbnRZIDwgcmVzaXplSGFuZGxlSGVpZ2h0O1xyXG4gICAgbGV0IGJvdHRvbUJvcmRlciA9IHdpbmRvdy5vdXRlckhlaWdodCAtIGUuY2xpZW50WSA8IHJlc2l6ZUhhbmRsZUhlaWdodDtcclxuXHJcbiAgICAvLyBBZGp1c3QgZm9yIGNvcm5lcnNcclxuICAgIGxldCByaWdodENvcm5lciA9IHdpbmRvdy5vdXRlcldpZHRoIC0gZS5jbGllbnRYIDwgKHJlc2l6ZUhhbmRsZVdpZHRoICsgY29ybmVyRXh0cmEpO1xyXG4gICAgbGV0IGxlZnRDb3JuZXIgPSBlLmNsaWVudFggPCAocmVzaXplSGFuZGxlV2lkdGggKyBjb3JuZXJFeHRyYSk7XHJcbiAgICBsZXQgdG9wQ29ybmVyID0gZS5jbGllbnRZIDwgKHJlc2l6ZUhhbmRsZUhlaWdodCArIGNvcm5lckV4dHJhKTtcclxuICAgIGxldCBib3R0b21Db3JuZXIgPSB3aW5kb3cub3V0ZXJIZWlnaHQgLSBlLmNsaWVudFkgPCAocmVzaXplSGFuZGxlSGVpZ2h0ICsgY29ybmVyRXh0cmEpO1xyXG5cclxuICAgIC8vIElmIHdlIGFyZW4ndCBvbiBhbiBlZGdlLCBidXQgd2VyZSwgcmVzZXQgdGhlIGN1cnNvciB0byBkZWZhdWx0XHJcbiAgICBpZiAoIWxlZnRCb3JkZXIgJiYgIXJpZ2h0Qm9yZGVyICYmICF0b3BCb3JkZXIgJiYgIWJvdHRvbUJvcmRlciAmJiByZXNpemVFZGdlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBzZXRSZXNpemUoKTtcclxuICAgIH1cclxuICAgIC8vIEFkanVzdGVkIGZvciBjb3JuZXIgYXJlYXNcclxuICAgIGVsc2UgaWYgKHJpZ2h0Q29ybmVyICYmIGJvdHRvbUNvcm5lcikgc2V0UmVzaXplKFwic2UtcmVzaXplXCIpO1xyXG4gICAgZWxzZSBpZiAobGVmdENvcm5lciAmJiBib3R0b21Db3JuZXIpIHNldFJlc2l6ZShcInN3LXJlc2l6ZVwiKTtcclxuICAgIGVsc2UgaWYgKGxlZnRDb3JuZXIgJiYgdG9wQ29ybmVyKSBzZXRSZXNpemUoXCJudy1yZXNpemVcIik7XHJcbiAgICBlbHNlIGlmICh0b3BDb3JuZXIgJiYgcmlnaHRDb3JuZXIpIHNldFJlc2l6ZShcIm5lLXJlc2l6ZVwiKTtcclxuICAgIGVsc2UgaWYgKGxlZnRCb3JkZXIpIHNldFJlc2l6ZShcInctcmVzaXplXCIpO1xyXG4gICAgZWxzZSBpZiAodG9wQm9yZGVyKSBzZXRSZXNpemUoXCJuLXJlc2l6ZVwiKTtcclxuICAgIGVsc2UgaWYgKGJvdHRvbUJvcmRlcikgc2V0UmVzaXplKFwicy1yZXNpemVcIik7XHJcbiAgICBlbHNlIGlmIChyaWdodEJvcmRlcikgc2V0UmVzaXplKFwiZS1yZXNpemVcIik7XHJcbn1cclxuIiwgIi8qXHJcbiBfXHQgICBfX1x0ICBfIF9fXHJcbnwgfFx0IC8gL19fXyBfKF8pIC9fX19fXHJcbnwgfCAvfCAvIC8gX18gYC8gLyAvIF9fXy9cclxufCB8LyB8LyAvIC9fLyAvIC8gKF9fICApXHJcbnxfXy98X18vXFxfXyxfL18vXy9fX19fL1xyXG5UaGUgZWxlY3Ryb24gYWx0ZXJuYXRpdmUgZm9yIEdvXHJcbihjKSBMZWEgQW50aG9ueSAyMDE5LXByZXNlbnRcclxuKi9cclxuLyoganNoaW50IGVzdmVyc2lvbjogOSAqL1xyXG5cclxuXHJcbmltcG9ydCAqIGFzIENsaXBib2FyZCBmcm9tICcuL2NsaXBib2FyZCc7XHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uIGZyb20gJy4vYXBwbGljYXRpb24nO1xyXG5pbXBvcnQgKiBhcyBMb2cgZnJvbSAnLi9sb2cnO1xyXG5pbXBvcnQgKiBhcyBTY3JlZW5zIGZyb20gJy4vc2NyZWVucyc7XHJcbmltcG9ydCB7UGx1Z2luLCBDYWxsLCBjYWxsRXJyb3JDYWxsYmFjaywgY2FsbENhbGxiYWNrfSBmcm9tIFwiLi9jYWxsc1wiO1xyXG5pbXBvcnQge25ld1dpbmRvd30gZnJvbSBcIi4vd2luZG93XCI7XHJcbmltcG9ydCB7ZGlzcGF0Y2hXYWlsc0V2ZW50LCBFbWl0LCBPZmYsIE9mZkFsbCwgT24sIE9uY2UsIE9uTXVsdGlwbGV9IGZyb20gXCIuL2V2ZW50c1wiO1xyXG5pbXBvcnQge2RpYWxvZ0NhbGxiYWNrLCBkaWFsb2dFcnJvckNhbGxiYWNrLCBFcnJvciwgSW5mbywgT3BlbkZpbGUsIFF1ZXN0aW9uLCBTYXZlRmlsZSwgV2FybmluZyx9IGZyb20gXCIuL2RpYWxvZ3NcIjtcclxuaW1wb3J0IHtzZXR1cENvbnRleHRNZW51c30gZnJvbSBcIi4vY29udGV4dG1lbnVcIjtcclxuaW1wb3J0IHtyZWxvYWRXTUx9IGZyb20gXCIuL3dtbFwiO1xyXG5pbXBvcnQge3NldHVwRHJhZywgZW5kRHJhZ30gZnJvbSBcIi4vZHJhZ1wiO1xyXG5cclxud2luZG93LndhaWxzID0ge1xyXG4gICAgLi4ubmV3UnVudGltZShudWxsKSxcclxuICAgIENhcGFiaWxpdGllczoge30sXHJcbn07XHJcblxyXG5mZXRjaChcIi93YWlscy9jYXBhYmlsaXRpZXNcIikudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgIHJlc3BvbnNlLmpzb24oKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgd2luZG93LndhaWxzLkNhcGFiaWxpdGllcyA9IGRhdGE7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG4vLyBJbnRlcm5hbCB3YWlscyBlbmRwb2ludHNcclxud2luZG93Ll93YWlscyA9IHtcclxuICAgIGRpYWxvZ0NhbGxiYWNrLFxyXG4gICAgZGlhbG9nRXJyb3JDYWxsYmFjayxcclxuICAgIGRpc3BhdGNoV2FpbHNFdmVudCxcclxuICAgIGNhbGxDYWxsYmFjayxcclxuICAgIGNhbGxFcnJvckNhbGxiYWNrLFxyXG4gICAgZW5kRHJhZyxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZXdSdW50aW1lKHdpbmRvd05hbWUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgQ2xpcGJvYXJkOiB7XHJcbiAgICAgICAgICAgIC4uLkNsaXBib2FyZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgQXBwbGljYXRpb246IHtcclxuICAgICAgICAgICAgLi4uQXBwbGljYXRpb24sXHJcbiAgICAgICAgICAgIEdldFdpbmRvd0J5TmFtZSh3aW5kb3dOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3UnVudGltZSh3aW5kb3dOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgTG9nLFxyXG4gICAgICAgIFNjcmVlbnMsXHJcbiAgICAgICAgQ2FsbCxcclxuICAgICAgICBQbHVnaW4sXHJcbiAgICAgICAgV01MOiB7XHJcbiAgICAgICAgICAgIFJlbG9hZDogcmVsb2FkV01MLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRGlhbG9nOiB7XHJcbiAgICAgICAgICAgIEluZm8sXHJcbiAgICAgICAgICAgIFdhcm5pbmcsXHJcbiAgICAgICAgICAgIEVycm9yLFxyXG4gICAgICAgICAgICBRdWVzdGlvbixcclxuICAgICAgICAgICAgT3BlbkZpbGUsXHJcbiAgICAgICAgICAgIFNhdmVGaWxlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRXZlbnRzOiB7XHJcbiAgICAgICAgICAgIEVtaXQsXHJcbiAgICAgICAgICAgIE9uLFxyXG4gICAgICAgICAgICBPbmNlLFxyXG4gICAgICAgICAgICBPbk11bHRpcGxlLFxyXG4gICAgICAgICAgICBPZmYsXHJcbiAgICAgICAgICAgIE9mZkFsbCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFdpbmRvdzogbmV3V2luZG93KHdpbmRvd05hbWUpLFxyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKERFQlVHKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIldhaWxzIHYzLjAuMCBEZWJ1ZyBNb2RlIEVuYWJsZWRcIik7XHJcbn1cclxuXHJcbnNldHVwQ29udGV4dE1lbnVzKCk7XHJcbnNldHVwRHJhZygpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIHJlbG9hZFdNTCgpO1xyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ1lBLE1BQU0sYUFBYSxPQUFPLFNBQVMsU0FBUztBQUU1QyxXQUFTLFlBQVksUUFBUSxZQUFZLE1BQU07QUFDM0MsUUFBSSxNQUFNLElBQUksSUFBSSxVQUFVO0FBQzVCLFFBQUksYUFBYSxPQUFPLFVBQVUsTUFBTTtBQUN4QyxRQUFJLE1BQU07QUFDTixVQUFJLGFBQWEsT0FBTyxRQUFRLEtBQUssVUFBVSxJQUFJLENBQUM7QUFBQSxJQUN4RDtBQUNBLFFBQUksZUFBZTtBQUFBLE1BQ2YsU0FBUyxDQUFDO0FBQUEsSUFDZDtBQUNBLFFBQUksWUFBWTtBQUNaLG1CQUFhLFFBQVEscUJBQXFCLElBQUk7QUFBQSxJQUNsRDtBQUNBLFdBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3BDLFlBQU0sS0FBSyxZQUFZLEVBQ2xCLEtBQUssY0FBWTtBQUNkLFlBQUksU0FBUyxJQUFJO0FBRWIsY0FBSSxTQUFTLFFBQVEsSUFBSSxjQUFjLEtBQUssU0FBUyxRQUFRLElBQUksY0FBYyxFQUFFLFFBQVEsa0JBQWtCLE1BQU0sSUFBSTtBQUNqSCxtQkFBTyxTQUFTLEtBQUs7QUFBQSxVQUN6QixPQUFPO0FBQ0gsbUJBQU8sU0FBUyxLQUFLO0FBQUEsVUFDekI7QUFBQSxRQUNKO0FBQ0EsZUFBTyxNQUFNLFNBQVMsVUFBVSxDQUFDO0FBQUEsTUFDckMsQ0FBQyxFQUNBLEtBQUssVUFBUSxRQUFRLElBQUksQ0FBQyxFQUMxQixNQUFNLFdBQVMsT0FBTyxLQUFLLENBQUM7QUFBQSxJQUNyQyxDQUFDO0FBQUEsRUFDTDtBQUVPLFdBQVMsaUJBQWlCLFFBQVEsWUFBWTtBQUNqRCxXQUFPLFNBQVUsUUFBUSxPQUFLLE1BQU07QUFDaEMsYUFBTyxZQUFZLFNBQVMsTUFBTSxRQUFRLFlBQVksSUFBSTtBQUFBLElBQzlEO0FBQUEsRUFDSjs7O0FEbENBLE1BQUksT0FBTyxpQkFBaUIsV0FBVztBQUtoQyxXQUFTLFFBQVEsTUFBTTtBQUMxQixTQUFLLEtBQUssV0FBVyxFQUFDLEtBQUksQ0FBQztBQUFBLEVBQy9CO0FBTU8sV0FBUyxPQUFPO0FBQ25CLFdBQU8sS0FBSyxNQUFNO0FBQUEsRUFDdEI7OztBRTdCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFjQSxNQUFJQSxRQUFPLGlCQUFpQixhQUFhO0FBS2xDLFdBQVMsT0FBTztBQUNuQixTQUFLQSxNQUFLLE1BQU07QUFBQSxFQUNwQjtBQUtPLFdBQVMsT0FBTztBQUNuQixTQUFLQSxNQUFLLE1BQU07QUFBQSxFQUNwQjtBQU1PLFdBQVMsT0FBTztBQUNuQixTQUFLQSxNQUFLLE1BQU07QUFBQSxFQUNwQjs7O0FDcENBO0FBQUE7QUFBQTtBQUFBO0FBY0EsTUFBSUMsUUFBTyxpQkFBaUIsS0FBSztBQU0xQixXQUFTLElBQUksU0FBUztBQUN6QixXQUFPQSxNQUFLLE9BQU8sT0FBTztBQUFBLEVBQzlCOzs7QUN0QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0JBLE1BQUlDLFFBQU8saUJBQWlCLFNBQVM7QUFNOUIsV0FBUyxTQUFTO0FBQ3JCLFdBQU9BLE1BQUssUUFBUTtBQUFBLEVBQ3hCO0FBTU8sV0FBUyxhQUFhO0FBQ3pCLFdBQU9BLE1BQUssWUFBWTtBQUFBLEVBQzVCO0FBT08sV0FBUyxhQUFhO0FBQ3pCLFdBQU9BLE1BQUssWUFBWTtBQUFBLEVBQzVCOzs7QUMzQ0EsTUFBSSxjQUNGO0FBV0ssTUFBSSxTQUFTLENBQUMsT0FBTyxPQUFPO0FBQ2pDLFFBQUksS0FBSztBQUNULFFBQUksSUFBSTtBQUNSLFdBQU8sS0FBSztBQUNWLFlBQU0sWUFBYSxLQUFLLE9BQU8sSUFBSSxLQUFNLENBQUM7QUFBQSxJQUM1QztBQUNBLFdBQU87QUFBQSxFQUNUOzs7QUNIQSxNQUFJQyxRQUFPLGlCQUFpQixNQUFNO0FBRWxDLE1BQUksZ0JBQWdCLG9CQUFJLElBQUk7QUFFNUIsV0FBUyxhQUFhO0FBQ2xCLFFBQUk7QUFDSixPQUFHO0FBQ0MsZUFBUyxPQUFPO0FBQUEsSUFDcEIsU0FBUyxjQUFjLElBQUksTUFBTTtBQUNqQyxXQUFPO0FBQUEsRUFDWDtBQUVPLFdBQVMsYUFBYSxJQUFJLE1BQU0sUUFBUTtBQUMzQyxRQUFJLElBQUksY0FBYyxJQUFJLEVBQUU7QUFDNUIsUUFBSSxHQUFHO0FBQ0gsVUFBSSxRQUFRO0FBQ1IsVUFBRSxRQUFRLEtBQUssTUFBTSxJQUFJLENBQUM7QUFBQSxNQUM5QixPQUFPO0FBQ0gsVUFBRSxRQUFRLElBQUk7QUFBQSxNQUNsQjtBQUNBLG9CQUFjLE9BQU8sRUFBRTtBQUFBLElBQzNCO0FBQUEsRUFDSjtBQUVPLFdBQVMsa0JBQWtCLElBQUksU0FBUztBQUMzQyxRQUFJLElBQUksY0FBYyxJQUFJLEVBQUU7QUFDNUIsUUFBSSxHQUFHO0FBQ0gsUUFBRSxPQUFPLE9BQU87QUFDaEIsb0JBQWMsT0FBTyxFQUFFO0FBQUEsSUFDM0I7QUFBQSxFQUNKO0FBRUEsV0FBUyxZQUFZLE1BQU0sU0FBUztBQUNoQyxXQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUNwQyxVQUFJLEtBQUssV0FBVztBQUNwQixnQkFBVSxXQUFXLENBQUM7QUFDdEIsY0FBUSxTQUFTLElBQUk7QUFDckIsb0JBQWMsSUFBSSxJQUFJLEVBQUMsU0FBUyxPQUFNLENBQUM7QUFDdkMsTUFBQUEsTUFBSyxNQUFNLE9BQU8sRUFBRSxNQUFNLENBQUMsVUFBVTtBQUNqQyxlQUFPLEtBQUs7QUFDWixzQkFBYyxPQUFPLEVBQUU7QUFBQSxNQUMzQixDQUFDO0FBQUEsSUFDTCxDQUFDO0FBQUEsRUFDTDtBQUVPLFdBQVMsS0FBSyxTQUFTO0FBQzFCLFdBQU8sWUFBWSxRQUFRLE9BQU87QUFBQSxFQUN0QztBQVNPLFdBQVMsT0FBTyxZQUFZLGVBQWUsTUFBTTtBQUNwRCxXQUFPLFlBQVksUUFBUTtBQUFBLE1BQ3ZCLGFBQWE7QUFBQSxNQUNiLFlBQVk7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7OztBQzNETyxXQUFTLFVBQVUsWUFBWTtBQUNsQyxRQUFJQyxRQUFPLGlCQUFpQixVQUFVLFVBQVU7QUFDaEQsV0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BZUgsUUFBUSxNQUFNLEtBQUtBLE1BQUssUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFNaEMsVUFBVSxDQUFDLFVBQVUsS0FBS0EsTUFBSyxZQUFZLEVBQUMsTUFBSyxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLbEQsWUFBWSxNQUFNLEtBQUtBLE1BQUssWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS3hDLGNBQWMsTUFBTSxLQUFLQSxNQUFLLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFPNUMsU0FBUyxDQUFDLE9BQU8sV0FBV0EsTUFBSyxXQUFXLEVBQUMsT0FBTSxPQUFNLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTTFELE1BQU0sTUFBTTtBQUFFLGVBQU9BLE1BQUssTUFBTTtBQUFBLE1BQUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFPbkMsWUFBWSxDQUFDLE9BQU8sV0FBVyxLQUFLQSxNQUFLLGNBQWMsRUFBQyxPQUFNLE9BQU0sQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU9yRSxZQUFZLENBQUMsT0FBTyxXQUFXLEtBQUtBLE1BQUssY0FBYyxFQUFDLE9BQU0sT0FBTSxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1yRSxnQkFBZ0IsQ0FBQyxVQUFVLEtBQUtBLE1BQUssa0JBQWtCLEVBQUMsYUFBWSxNQUFLLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFPMUUsYUFBYSxDQUFDLEdBQUcsTUFBTUEsTUFBSyxlQUFlLEVBQUMsR0FBRSxFQUFDLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTWhELFVBQVUsTUFBTTtBQUFFLGVBQU9BLE1BQUssVUFBVTtBQUFBLE1BQUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTTNDLFFBQVEsTUFBTTtBQUFFLGVBQU9BLE1BQUssUUFBUTtBQUFBLE1BQUc7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUt2QyxNQUFNLE1BQU0sS0FBS0EsTUFBSyxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLNUIsVUFBVSxNQUFNLEtBQUtBLE1BQUssVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS3BDLE1BQU0sTUFBTSxLQUFLQSxNQUFLLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUs1QixPQUFPLE1BQU0sS0FBS0EsTUFBSyxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLOUIsZ0JBQWdCLE1BQU0sS0FBS0EsTUFBSyxnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtoRCxZQUFZLE1BQU0sS0FBS0EsTUFBSyxZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLeEMsVUFBVSxNQUFNLEtBQUtBLE1BQUssVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS3BDLFlBQVksTUFBTSxLQUFLQSxNQUFLLFlBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUt4QyxTQUFTLE1BQU0sS0FBS0EsTUFBSyxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVNsQyxxQkFBcUIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFNLEtBQUtBLE1BQUssdUJBQXVCLEVBQUMsR0FBRyxHQUFHLEdBQUcsRUFBQyxDQUFDO0FBQUEsSUFDdEY7QUFBQSxFQUNKOzs7QUMvSUEsTUFBSUMsUUFBTyxpQkFBaUIsUUFBUTtBQU9wQyxNQUFNLFdBQU4sTUFBZTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFRWCxZQUFZLFdBQVcsVUFBVSxjQUFjO0FBQzNDLFdBQUssWUFBWTtBQUVqQixXQUFLLGVBQWUsZ0JBQWdCO0FBR3BDLFdBQUssV0FBVyxDQUFDLFNBQVM7QUFDdEIsaUJBQVMsSUFBSTtBQUViLFlBQUksS0FBSyxpQkFBaUIsSUFBSTtBQUMxQixpQkFBTztBQUFBLFFBQ1g7QUFFQSxhQUFLLGdCQUFnQjtBQUNyQixlQUFPLEtBQUssaUJBQWlCO0FBQUEsTUFDakM7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQVVPLE1BQU0sYUFBTixNQUFpQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT3BCLFlBQVksTUFBTSxPQUFPLE1BQU07QUFDM0IsV0FBSyxPQUFPO0FBQ1osV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxFQUNKO0FBRU8sTUFBTSxpQkFBaUIsb0JBQUksSUFBSTtBQVcvQixXQUFTLFdBQVcsV0FBVyxVQUFVLGNBQWM7QUFDMUQsUUFBSSxZQUFZLGVBQWUsSUFBSSxTQUFTLEtBQUssQ0FBQztBQUNsRCxVQUFNLGVBQWUsSUFBSSxTQUFTLFdBQVcsVUFBVSxZQUFZO0FBQ25FLGNBQVUsS0FBSyxZQUFZO0FBQzNCLG1CQUFlLElBQUksV0FBVyxTQUFTO0FBQ3ZDLFdBQU8sTUFBTSxZQUFZLFlBQVk7QUFBQSxFQUN6QztBQVVPLFdBQVMsR0FBRyxXQUFXLFVBQVU7QUFDcEMsV0FBTyxXQUFXLFdBQVcsVUFBVSxFQUFFO0FBQUEsRUFDN0M7QUFVTyxXQUFTLEtBQUssV0FBVyxVQUFVO0FBQ3RDLFdBQU8sV0FBVyxXQUFXLFVBQVUsQ0FBQztBQUFBLEVBQzVDO0FBT0EsV0FBUyxZQUFZLFVBQVU7QUFDM0IsVUFBTSxZQUFZLFNBQVM7QUFFM0IsUUFBSSxZQUFZLGVBQWUsSUFBSSxTQUFTLEVBQUUsT0FBTyxPQUFLLE1BQU0sUUFBUTtBQUN4RSxRQUFJLFVBQVUsV0FBVyxHQUFHO0FBQ3hCLHFCQUFlLE9BQU8sU0FBUztBQUFBLElBQ25DLE9BQU87QUFDSCxxQkFBZSxJQUFJLFdBQVcsU0FBUztBQUFBLElBQzNDO0FBQUEsRUFDSjtBQVFPLFdBQVMsbUJBQW1CLE9BQU87QUFDdEMsWUFBUSxJQUFJLHVCQUF1QixFQUFDLE1BQUssQ0FBQztBQUMxQyxRQUFJLFlBQVksZUFBZSxJQUFJLE1BQU0sSUFBSTtBQUM3QyxRQUFJLFdBQVc7QUFFWCxVQUFJLFdBQVcsQ0FBQztBQUNoQixnQkFBVSxRQUFRLGNBQVk7QUFDMUIsWUFBSSxTQUFTLFNBQVMsU0FBUyxLQUFLO0FBQ3BDLFlBQUksUUFBUTtBQUNSLG1CQUFTLEtBQUssUUFBUTtBQUFBLFFBQzFCO0FBQUEsTUFDSixDQUFDO0FBRUQsVUFBSSxTQUFTLFNBQVMsR0FBRztBQUNyQixvQkFBWSxVQUFVLE9BQU8sT0FBSyxDQUFDLFNBQVMsU0FBUyxDQUFDLENBQUM7QUFDdkQsWUFBSSxVQUFVLFdBQVcsR0FBRztBQUN4Qix5QkFBZSxPQUFPLE1BQU0sSUFBSTtBQUFBLFFBQ3BDLE9BQU87QUFDSCx5QkFBZSxJQUFJLE1BQU0sTUFBTSxTQUFTO0FBQUEsUUFDNUM7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFXTyxXQUFTLElBQUksY0FBYyxzQkFBc0I7QUFDcEQsUUFBSSxpQkFBaUIsQ0FBQyxXQUFXLEdBQUcsb0JBQW9CO0FBQ3hELG1CQUFlLFFBQVEsQ0FBQUMsZUFBYTtBQUNoQyxxQkFBZSxPQUFPQSxVQUFTO0FBQUEsSUFDbkMsQ0FBQztBQUFBLEVBQ0w7QUFPTyxXQUFTLFNBQVM7QUFDckIsbUJBQWUsTUFBTTtBQUFBLEVBQ3pCO0FBTU8sV0FBUyxLQUFLLE9BQU87QUFDeEIsU0FBS0QsTUFBSyxRQUFRLEtBQUs7QUFBQSxFQUMzQjs7O0FDM0tBLE1BQUlFLFFBQU8saUJBQWlCLFFBQVE7QUFFcEMsTUFBSSxrQkFBa0Isb0JBQUksSUFBSTtBQUU5QixXQUFTQyxjQUFhO0FBQ2xCLFFBQUk7QUFDSixPQUFHO0FBQ0MsZUFBUyxPQUFPO0FBQUEsSUFDcEIsU0FBUyxnQkFBZ0IsSUFBSSxNQUFNO0FBQ25DLFdBQU87QUFBQSxFQUNYO0FBRU8sV0FBUyxlQUFlLElBQUksTUFBTSxRQUFRO0FBQzdDLFFBQUksSUFBSSxnQkFBZ0IsSUFBSSxFQUFFO0FBQzlCLFFBQUksR0FBRztBQUNILFVBQUksUUFBUTtBQUNSLFVBQUUsUUFBUSxLQUFLLE1BQU0sSUFBSSxDQUFDO0FBQUEsTUFDOUIsT0FBTztBQUNILFVBQUUsUUFBUSxJQUFJO0FBQUEsTUFDbEI7QUFDQSxzQkFBZ0IsT0FBTyxFQUFFO0FBQUEsSUFDN0I7QUFBQSxFQUNKO0FBQ08sV0FBUyxvQkFBb0IsSUFBSSxTQUFTO0FBQzdDLFFBQUksSUFBSSxnQkFBZ0IsSUFBSSxFQUFFO0FBQzlCLFFBQUksR0FBRztBQUNILFFBQUUsT0FBTyxPQUFPO0FBQ2hCLHNCQUFnQixPQUFPLEVBQUU7QUFBQSxJQUM3QjtBQUFBLEVBQ0o7QUFFQSxXQUFTLE9BQU8sTUFBTSxTQUFTO0FBQzNCLFdBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3BDLFVBQUksS0FBS0EsWUFBVztBQUNwQixnQkFBVSxXQUFXLENBQUM7QUFDdEIsY0FBUSxXQUFXLElBQUk7QUFDdkIsc0JBQWdCLElBQUksSUFBSSxFQUFDLFNBQVMsT0FBTSxDQUFDO0FBQ3pDLE1BQUFELE1BQUssTUFBTSxPQUFPLEVBQUUsTUFBTSxDQUFDLFVBQVU7QUFDakMsZUFBTyxLQUFLO0FBQ1osd0JBQWdCLE9BQU8sRUFBRTtBQUFBLE1BQzdCLENBQUM7QUFBQSxJQUNMLENBQUM7QUFBQSxFQUNMO0FBUU8sV0FBUyxLQUFLLFNBQVM7QUFDMUIsV0FBTyxPQUFPLFFBQVEsT0FBTztBQUFBLEVBQ2pDO0FBT08sV0FBUyxRQUFRLFNBQVM7QUFDN0IsV0FBTyxPQUFPLFdBQVcsT0FBTztBQUFBLEVBQ3BDO0FBT08sV0FBU0UsT0FBTSxTQUFTO0FBQzNCLFdBQU8sT0FBTyxTQUFTLE9BQU87QUFBQSxFQUNsQztBQU9PLFdBQVMsU0FBUyxTQUFTO0FBQzlCLFdBQU8sT0FBTyxZQUFZLE9BQU87QUFBQSxFQUNyQztBQU9PLFdBQVMsU0FBUyxTQUFTO0FBQzlCLFdBQU8sT0FBTyxZQUFZLE9BQU87QUFBQSxFQUNyQztBQU9PLFdBQVMsU0FBUyxTQUFTO0FBQzlCLFdBQU8sT0FBTyxZQUFZLE9BQU87QUFBQSxFQUNyQzs7O0FDckhBLE1BQUlDLFFBQU8saUJBQWlCLGFBQWE7QUFFekMsV0FBUyxnQkFBZ0IsSUFBSSxHQUFHLEdBQUcsTUFBTTtBQUNyQyxTQUFLQSxNQUFLLG1CQUFtQixFQUFDLElBQUksR0FBRyxHQUFHLEtBQUksQ0FBQztBQUFBLEVBQ2pEO0FBRU8sV0FBUyxvQkFBb0I7QUFDaEMsV0FBTyxpQkFBaUIsZUFBZSxrQkFBa0I7QUFBQSxFQUM3RDtBQUVBLFdBQVMsbUJBQW1CLE9BQU87QUFFL0IsUUFBSSxVQUFVLE1BQU07QUFDcEIsUUFBSSxvQkFBb0IsT0FBTyxpQkFBaUIsT0FBTyxFQUFFLGlCQUFpQixzQkFBc0I7QUFDaEcsd0JBQW9CLG9CQUFvQixrQkFBa0IsS0FBSyxJQUFJO0FBQ25FLFFBQUksbUJBQW1CO0FBQ25CLFlBQU0sZUFBZTtBQUNyQixVQUFJLHdCQUF3QixPQUFPLGlCQUFpQixPQUFPLEVBQUUsaUJBQWlCLDJCQUEyQjtBQUN6RyxzQkFBZ0IsbUJBQW1CLE1BQU0sU0FBUyxNQUFNLFNBQVMscUJBQXFCO0FBQ3RGO0FBQUEsSUFDSjtBQUVBLDhCQUEwQixLQUFLO0FBQUEsRUFDbkM7QUFRQSxXQUFTLDBCQUEwQixPQUFPO0FBRXRDLFFBQUksVUFBVSxNQUFNO0FBQ3BCLFFBQUksMkJBQTJCLE9BQU8saUJBQWlCLE9BQU8sRUFBRSxpQkFBaUIsdUJBQXVCO0FBQ3hHLCtCQUEyQiwyQkFBMkIseUJBQXlCLEtBQUssSUFBSTtBQUN4RixZQUFPLDBCQUEwQjtBQUFBLE1BQzdCLEtBQUs7QUFDRDtBQUFBLE1BQ0osS0FBSztBQUNELGNBQU0sZUFBZTtBQUNyQjtBQUFBLE1BQ0o7QUFFSSxZQUFJLGtCQUFrQixRQUFRLGFBQWEsaUJBQWlCO0FBQzVELFlBQUksbUJBQW1CLGdCQUFnQixZQUFZLE1BQU0sUUFBUTtBQUM3RDtBQUFBLFFBQ0o7QUFHQSxZQUFJLFlBQVksT0FBTyxhQUFhO0FBQ3BDLFlBQUksYUFBYSxVQUFVLFNBQVMsRUFBRSxTQUFTLEdBQUc7QUFDOUM7QUFBQSxRQUNKO0FBR0EsWUFBSSxVQUFVLFFBQVEsUUFBUSxZQUFZO0FBQzFDLFlBQUksWUFBWSxXQUFXLFlBQVksWUFBWTtBQUMvQztBQUFBLFFBQ0o7QUFHQSxjQUFNLGVBQWU7QUFBQSxJQUM3QjtBQUFBLEVBQ0o7OztBQzlEQSxXQUFTLFVBQVUsV0FBVyxPQUFLLE1BQU07QUFDckMsUUFBSSxRQUFRLElBQUksV0FBVyxXQUFXLElBQUk7QUFDMUMsU0FBSyxLQUFLO0FBQUEsRUFDZDtBQUVBLFdBQVMsdUJBQXVCO0FBQzVCLFVBQU0sV0FBVyxTQUFTLGlCQUFpQixrQkFBa0I7QUFDN0QsYUFBUyxRQUFRLFNBQVUsU0FBUztBQUNoQyxZQUFNLFlBQVksUUFBUSxhQUFhLGdCQUFnQjtBQUN2RCxZQUFNLFVBQVUsUUFBUSxhQUFhLGtCQUFrQjtBQUN2RCxZQUFNLFVBQVUsUUFBUSxhQUFhLGtCQUFrQixLQUFLO0FBRTVELFVBQUksV0FBVyxXQUFZO0FBQ3ZCLFlBQUksU0FBUztBQUNULG1CQUFTLEVBQUMsT0FBTyxXQUFXLFNBQVEsU0FBUyxTQUFRLENBQUMsRUFBQyxPQUFNLE1BQUssR0FBRSxFQUFDLE9BQU0sTUFBTSxXQUFVLEtBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxLQUFLLFNBQVUsUUFBUTtBQUN2SCxnQkFBSSxXQUFXLE1BQU07QUFDakIsd0JBQVUsU0FBUztBQUFBLFlBQ3ZCO0FBQUEsVUFDSixDQUFDO0FBQ0Q7QUFBQSxRQUNKO0FBQ0Esa0JBQVUsU0FBUztBQUFBLE1BQ3ZCO0FBR0EsY0FBUSxvQkFBb0IsU0FBUyxRQUFRO0FBRzdDLGNBQVEsaUJBQWlCLFNBQVMsUUFBUTtBQUFBLElBQzlDLENBQUM7QUFBQSxFQUNMO0FBRUEsV0FBUyxpQkFBaUIsUUFBUTtBQUM5QixRQUFJLE1BQU0sT0FBTyxNQUFNLE1BQU0sUUFBVztBQUNwQyxjQUFRLElBQUksbUJBQW1CLFNBQVMsWUFBWTtBQUFBLElBQ3hEO0FBQ0EsVUFBTSxPQUFPLE1BQU0sRUFBRTtBQUFBLEVBQ3pCO0FBRUEsV0FBUyx3QkFBd0I7QUFDN0IsVUFBTSxXQUFXLFNBQVMsaUJBQWlCLG1CQUFtQjtBQUM5RCxhQUFTLFFBQVEsU0FBVSxTQUFTO0FBQ2hDLFlBQU0sZUFBZSxRQUFRLGFBQWEsaUJBQWlCO0FBQzNELFlBQU0sVUFBVSxRQUFRLGFBQWEsa0JBQWtCO0FBQ3ZELFlBQU0sVUFBVSxRQUFRLGFBQWEsa0JBQWtCLEtBQUs7QUFFNUQsVUFBSSxXQUFXLFdBQVk7QUFDdkIsWUFBSSxTQUFTO0FBQ1QsbUJBQVMsRUFBQyxPQUFPLFdBQVcsU0FBUSxTQUFTLFNBQVEsQ0FBQyxFQUFDLE9BQU0sTUFBSyxHQUFFLEVBQUMsT0FBTSxNQUFNLFdBQVUsS0FBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssU0FBVSxRQUFRO0FBQ3ZILGdCQUFJLFdBQVcsTUFBTTtBQUNqQiwrQkFBaUIsWUFBWTtBQUFBLFlBQ2pDO0FBQUEsVUFDSixDQUFDO0FBQ0Q7QUFBQSxRQUNKO0FBQ0EseUJBQWlCLFlBQVk7QUFBQSxNQUNqQztBQUdBLGNBQVEsb0JBQW9CLFNBQVMsUUFBUTtBQUc3QyxjQUFRLGlCQUFpQixTQUFTLFFBQVE7QUFBQSxJQUM5QyxDQUFDO0FBQUEsRUFDTDtBQUVPLFdBQVMsWUFBWTtBQUN4Qix5QkFBcUI7QUFDckIsMEJBQXNCO0FBQUEsRUFDMUI7OztBQzVETyxNQUFJLFNBQVMsU0FBUyxPQUFPO0FBQ2hDLFFBQUcsT0FBUztBQUNSLGFBQU8sUUFBUSxZQUFZLEtBQUs7QUFBQSxJQUNwQyxPQUFPO0FBQ0gsYUFBTyxnQkFBZ0IsU0FBUyxZQUFZLEtBQUs7QUFBQSxJQUNyRDtBQUFBLEVBQ0o7OztBQ1BBLE1BQUksUUFBUSxvQkFBSSxJQUFJO0FBRXBCLFdBQVMsYUFBYSxLQUFLO0FBQ3ZCLFVBQU0sTUFBTSxvQkFBSSxJQUFJO0FBRXBCLGVBQVcsQ0FBQyxLQUFLLEtBQUssS0FBSyxPQUFPLFFBQVEsR0FBRyxHQUFHO0FBQzVDLFVBQUksT0FBTyxVQUFVLFlBQVksVUFBVSxNQUFNO0FBQzdDLFlBQUksSUFBSSxLQUFLLGFBQWEsS0FBSyxDQUFDO0FBQUEsTUFDcEMsT0FBTztBQUNILFlBQUksSUFBSSxLQUFLLEtBQUs7QUFBQSxNQUN0QjtBQUFBLElBQ0o7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUVBLFFBQU0sY0FBYyxFQUFFLEtBQUssQ0FBQyxhQUFhO0FBQ3JDLGFBQVMsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTO0FBQzNCLGNBQVEsYUFBYSxJQUFJO0FBQUEsSUFDN0IsQ0FBQztBQUFBLEVBQ0wsQ0FBQzs7O0FDakJELE1BQUksYUFBYTtBQUVWLFdBQVMsU0FBUyxHQUFHO0FBQ3hCLFFBQUksTUFBTSxPQUFPLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxpQkFBaUIscUJBQXFCO0FBQ2xGLFFBQUksS0FBSztBQUNMLFlBQU0sSUFBSSxLQUFLO0FBQUEsSUFDbkI7QUFFQSxRQUFJLFFBQVEsUUFBUTtBQUNoQixhQUFPO0FBQUEsSUFDWDtBQUdBLFFBQUksRUFBRSxZQUFZLEdBQUc7QUFDakIsYUFBTztBQUFBLElBQ1g7QUFFQSxXQUFPLEVBQUUsV0FBVztBQUFBLEVBQ3hCO0FBRU8sV0FBUyxZQUFZO0FBQ3hCLFdBQU8saUJBQWlCLGFBQWEsV0FBVztBQUNoRCxXQUFPLGlCQUFpQixhQUFhLFdBQVc7QUFDaEQsV0FBTyxpQkFBaUIsV0FBVyxTQUFTO0FBQUEsRUFDaEQ7QUFZQSxXQUFTLFlBQVksR0FBRztBQUdwQixRQUFJLE9BQVU7QUFDVixVQUFJLFdBQVcsR0FBRztBQUNkO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFDQSxRQUFJLFNBQVMsQ0FBQyxHQUFHO0FBRWIsVUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLGVBQWUsRUFBRSxVQUFVLEVBQUUsT0FBTyxjQUFjO0FBQ3ZFO0FBQUEsTUFDSjtBQUNBLG1CQUFhO0FBQUEsSUFDakIsT0FBTztBQUNILG1CQUFhO0FBQUEsSUFDakI7QUFBQSxFQUNKO0FBRUEsV0FBUyxVQUFVLEdBQUc7QUFDbEIsUUFBSSxlQUFlLEVBQUUsWUFBWSxTQUFZLEVBQUUsVUFBVSxFQUFFO0FBQzNELFFBQUksZUFBZSxHQUFHO0FBQ2xCLGNBQVE7QUFBQSxJQUNaO0FBQUEsRUFDSjtBQUVPLFdBQVMsVUFBVTtBQUN0QixhQUFTLEtBQUssTUFBTSxTQUFTO0FBQzdCLGlCQUFhO0FBQUEsRUFDakI7QUFPQSxXQUFTLFlBQVksR0FBRztBQUNwQixRQUFJLFlBQVk7QUFDWixtQkFBYTtBQUNiLFVBQUksZUFBZSxFQUFFLFlBQVksU0FBWSxFQUFFLFVBQVUsRUFBRTtBQUMzRCxVQUFJLGVBQWUsR0FBRztBQUNsQixlQUFPLE1BQU07QUFBQSxNQUNqQjtBQUNBO0FBQUEsSUFDSjtBQUVBLFFBQUksT0FBUztBQUNULG1CQUFhLENBQUM7QUFBQSxJQUNsQjtBQUFBLEVBQ0o7OztBQzVFQSxTQUFPLFFBQVE7QUFBQSxJQUNYLEdBQUcsV0FBVyxJQUFJO0FBQUEsSUFDbEIsY0FBYyxDQUFDO0FBQUEsRUFDbkI7QUFFQSxRQUFNLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxhQUFhO0FBQzVDLGFBQVMsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTO0FBQzNCLGFBQU8sTUFBTSxlQUFlO0FBQUEsSUFDaEMsQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUdELFNBQU8sU0FBUztBQUFBLElBQ1o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0o7QUFFTyxXQUFTLFdBQVcsWUFBWTtBQUNuQyxXQUFPO0FBQUEsTUFDSCxXQUFXO0FBQUEsUUFDUCxHQUFHO0FBQUEsTUFDUDtBQUFBLE1BQ0EsYUFBYTtBQUFBLFFBQ1QsR0FBRztBQUFBLFFBQ0gsZ0JBQWdCQyxhQUFZO0FBQ3hCLGlCQUFPLFdBQVdBLFdBQVU7QUFBQSxRQUNoQztBQUFBLE1BQ0o7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQSxLQUFLO0FBQUEsUUFDRCxRQUFRO0FBQUEsTUFDWjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsUUFDQSxPQUFBQztBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsTUFDQSxRQUFRLFVBQVUsVUFBVTtBQUFBLElBQ2hDO0FBQUEsRUFDSjtBQUVBLE1BQUksTUFBTztBQUNQLFlBQVEsSUFBSSxpQ0FBaUM7QUFBQSxFQUNqRDtBQUVBLG9CQUFrQjtBQUNsQixZQUFVO0FBRVYsV0FBUyxpQkFBaUIsb0JBQW9CLFNBQVMsT0FBTztBQUMxRCxjQUFVO0FBQUEsRUFDZCxDQUFDOyIsCiAgIm5hbWVzIjogWyJjYWxsIiwgImNhbGwiLCAiY2FsbCIsICJjYWxsIiwgImNhbGwiLCAiY2FsbCIsICJldmVudE5hbWUiLCAiY2FsbCIsICJnZW5lcmF0ZUlEIiwgIkVycm9yIiwgImNhbGwiLCAid2luZG93TmFtZSIsICJFcnJvciJdCn0K
