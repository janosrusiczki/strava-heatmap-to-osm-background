function getCookieValue(name, callback) {
  chrome.cookies.get({ 'url': 'https://www.strava.com', 'name': name }, function(cookie) {
    callback(name, cookie.value);
  });
}

var cookieNames = ['CloudFront-Key-Pair-Id', 'CloudFront-Policy', 'CloudFront-Signature'];

function getCookies(callback) {
  var cookieValues = {};
  for (var i = 0; i < cookieNames.length; ++i) {
    getCookieValue(cookieNames[i], function(name, value) {
      cookieValues[name] = value;
      var cookieCount = 0;
      for (var j = 0; j < cookieNames.length; ++j) {
        if(cookieValues[cookieNames[j]] != undefined) cookieCount++;
      }
      if(cookieCount == 3) {
        callback(cookieValues);
      }
    });
  }
}

function copyURLToClipboard(cookieValues) {
  console.log('beep');
  var url = 'https://heatmap-external-{switch:a,b,c}.strava.com/tiles-auth/both/bluered/{zoom}/{x}/{y}.png?Key-Pair-Id=CloudFront-Key-Pair-Id&Policy=CloudFront-Policy&Signature=CloudFront-Signature';
  for(var i = 0; i < cookieNames.length; ++i) {
    url = url.replace(cookieNames[i], cookieValues[cookieNames[i]]);
  }
  copyTextToClipboard(url);
}

function copyTextToClipboard(value) {
  document.addEventListener('copy', function(e){
    e.clipboardData.setData('text/plain', value);
    e.preventDefault(); // default behaviour is to copy any selected text
  });
  document.execCommand('copy');
}

chrome.browserAction.onClicked.addListener(function(tab) { getCookies(copyURLToClipboard) });

// chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
//   console.log("Received %o from %o, frame", msg, sender.tab, sender.frameId);
//   getCookies("https://www.strava.com", "CloudFront-Key-Pair-Id", function(value) {
//     sendResponse(value);
//   });
// });