chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('app.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});
