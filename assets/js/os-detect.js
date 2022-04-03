'use strict';

var osId;
var osCount = -1;
var osFirstHide = true;
const urlParams = new URLSearchParams(window.location.search);
const osParam = urlParams.get('os');
var osAll = false;
var osKnownOs = ["macos", "windows", "linux", "unix"];
const osNames = {
  "macos" : "macOS",
  "windows" : "Windows",
  "linux" : "Linux",
  "unix" : "Unix",
  "" : "undetected",
  null : "not detected"
};
if (osParam !== null) {
  osAll = (osParam === "all");
  if (osKnownOs.includes(osParam)) {
    osId = osParam;
  }
} else {
  // modified from:
  // https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript
  // NOTE: Firefox on Linux now has navigator.appVersion "... (X11)" so need to use other markers.

  // First found takes precedence except for "unix"
  const tests = [navigator.platform, navigator.userAgent, navigator.oscpu, navigator.appVersion];
  for (let i = 0; i < tests.length; i++) {
    let test = tests[i];
    if (test == null || test === "") {
      continue;
    }
    if (test.indexOf("Win")!=-1) osId = "windows";
    if (test.indexOf("Mac")!=-1) osId = "macos";
    if (test.indexOf("Linux")!=-1) osId = "linux";
    if (osId != null && osId !== "" && osId !== "unix") break;
    if (test.indexOf("X11")!=-1) osId = "unix";
  }
}
var osName = osNames[osId];

var osDelay = 1000;
var osTimeouts = [];
function osClearTimeouts() {
  for (let i = 0; i < osTimeouts.length; i++) {
    clearTimeout(osTimeouts[i]);
  }
  osTimeouts = [];
}

function osHide(e, instant) {
  if (e.classList.contains("os_detect_ignore")) {
    return;
  }
  let thisInstant = instant;
  if (e.classList.contains("os_detect_instant")) {
    thisInstant = true;
  }
  if (e.classList.contains("os_detect_transition")) {
    if (thisInstant) {
      e.classList.add("os_detect_hidden");
      e.classList.add("os_detect_hiding");
      e.classList.remove("os_detect_visible");
      e.classList.remove("os_detect_unhiding");
    } else {
      e.classList.add("os_detect_hiding");
      e.classList.remove("os_detect_unhiding");
      let children = e.getElementsByClassName("os_detect_count_view");
      for (let i = 0; i < children.length; i++) {
        let c = children[i];
        c.classList.add("os_detect_ignore");
      }
      osTimeouts.push(
        setTimeout(function() {
          e.classList.add("os_detect_hidden");
          e.classList.remove("os_detect_visible");
          for (let i = 0; i < children.length; i++) {
            let c = children[i];
            c.classList.remove("os_detect_ignore");
          }
        }, osDelay)
      );
    }
  } else if (e.classList.contains("os_detect_visible_toggle")) {
    e.classList.add("os_detect_toggle_all");
    e.classList.remove("os_detect_toggle_not_all");
  } else {
    if (thisInstant) {
      e.classList.add("os_detect_hidden");
      e.classList.remove("os_detect_visible");
    } else {
      osTimeouts.push(
        setTimeout(function() {
          e.classList.add("os_detect_hidden");
          e.classList.remove("os_detect_visible");
        }, osDelay)
      );
    }
  }
}

function osShow(e, instant) {
  if (e.classList.contains("os_detect_ignore")) {
    return;
  }
  let thisInstant = instant;
  if (e.classList.contains("os_detect_instant")) {
    thisInstant = true;
  }
  if (e.classList.contains("os_detect_transition")) {
    if (thisInstant) {
      e.classList.add("os_detect_visible");
      e.classList.add("os_detect_unhiding");
      e.classList.remove("os_detect_hidden");
      e.classList.remove("os_detect_hiding");
    } else {
      e.classList.add("os_detect_visible");
      e.classList.remove("os_detect_hidden");
      let children = e.getElementsByClassName("os_detect_count_view");
      for (let i = 0; i < children.length; i++) {
        let c = children[i];
        c.classList.add("os_detect_ignore");
      }
      osTimeouts.push(
        setTimeout(function() {
          e.classList.add("os_detect_unhiding");
          e.classList.remove("os_detect_hiding");
          for (let i = 0; i < children.length; i++) {
            let c = children[i];
            c.classList.remove("os_detect_ignore");
          }
        }, 10)
      );
    }
  } else if (e.classList.contains("os_detect_visible_toggle")) {
    e.classList.add("os_detect_toggle_not_all");
    e.classList.remove("os_detect_toggle_all");
  } else {
    if (thisInstant) {
      e.classList.add("os_detect_visible");
      e.classList.remove("os_detect_hidden");
    } else {
      osTimeouts.push(
        setTimeout(function() {
          e.classList.add("os_detect_visible");
          e.classList.remove("os_detect_hidden");
        }, osDelay)
      );
    }
  }
}

function osCountView(instant) {
  if (osCount >= 0) {
    let plural = osCount != 1;
    let elems = document.getElementsByClassName("os_detect_count_view");
    for (let k = 0; k < elems.length; k++) {
      let elem = elems[k];
      let thisInstant = instant;
      if (elem.classList.contains("os_detect_instant")) {
        thisInstant = true;
      }
      if (plural) {
        if (elem.classList.contains("os_detect_plural")) {
          osShow(elem, thisInstant);
        } else if (elem.classList.contains("os_detect_singular")) {
          osHide(elem, thisInstant);
        }
      } else {
        if (elem.classList.contains("os_detect_plural")) {
          osHide(elem, thisInstant);
        } else if (elem.classList.contains("os_detect_singular")) {
          osShow(elem, thisInstant);
        }
      }
      if (elem.classList.contains("os_detect_osCount")) elem.textContent = osCount;
    }
  }
}

function osHideElements(thisAll) {
  let all = (typeof(thisAll) === "undefined") ? osAll : thisAll;
  if (osKnownOs.includes(osId) || all) {
    let elems = document.getElementsByClassName("os_detect");
    osCount = 0;
    for (let i = 0; i < elems.length; i++) {
      let elem = elems[i];
      if (all && elem.classList.contains("os_detect_not_all")) {
        osHide(elem, osFirstHide);
      } else {
        let isKnown = false;
        for (let j = 0; j < osKnownOs.length; j++) {
          if (elem.classList.contains("os_detect_"+osKnownOs[j])) {
            isKnown = true;
            break;
          }
        }
        if (
            elem.classList.contains("os_detect_"+osId)
            || (osId !== undefined && elem.classList.contains("os_detect_any"))
            || (all && (isKnown || elem.classList.contains("os_detect_all")))
            ) {
          osShow(elem, osFirstHide);
          if (elem.classList.contains("os_detect_count")) {
            osCount++;
          }
        } else if (elem.classList.contains("os_detect_alltoggle")) {
          if (all) {
            osShow(elem, osFirstHide);
          } else {
            osHide(elem, osFirstHide);
          }
        } else {
          osHide(elem, osFirstHide);
        }
      }
      // change content of e.g. <span class="os_detect os_detect_osName">unknown</span>
      if (elem.classList.contains("os_detect_osId")) elem.textContent = osId;
      if (elem.classList.contains("os_detect_osName")) elem.textContent = osName;
    }
  }
  // now plurals
  osCountView(osFirstHide);

  osFirstHide = false;
}

function osSetAll() {
  osAll = true;
  osHideElements();
}

function osUnsetAll() {
  osAll = false;
  osHideElements();
}

function osToggleAll() {
  osAll = !osAll;
  osClearTimeouts();
  osHideElements();
}
