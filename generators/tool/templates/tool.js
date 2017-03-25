(function (grow) {
  grow = grow || {};
  grow.ui = grow.ui || {};
  grow.ui.tools = grow.ui.tools || [];

  // Your tool code goes here...

  var triggerTool = function () {
    // The Grow UI button was clicked to toggle the tool.
    // This happens each time the button is clicked.
    console.log('Triggered the tool!');
  };

  var init = function (config) {
    // The Grow UI has loaded and any configuration has been sent.
    // This happens once.
    console.log('config', config);
  };

  grow.ui.tools.push({
    kind: '<%= nameShort %>',
    name: '<%= nameLong %>',
    button: {
      events: {
        click: triggerTool
      }
    },
    init: init
  });
})(window.grow);
