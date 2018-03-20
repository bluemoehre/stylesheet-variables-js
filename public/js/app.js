var CSS_VARS_SUPPORT = window.CSS && window.CSS.supports && window.CSS.supports('(--foo: red)');

var COLORSETS = {
  a: 'css/colorset-a.css',
  b: 'css/colorset-b.css',
  c: 'css/colorset-c.css',
};

var stylesheets = [];

function registerStylesheet(element) {
  console.log('Stylesheet registered: "' + element.href + '"');

  stylesheets.push(element.href);
  reportStylesheetCount();
}

function reportStylesheetCount() {
  console.log('Stylesheets in DOM: ' + document.styleSheets.length);
}

function fetchCss(url, success) {
  console.log('Fetching "' + url + '"');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (!xhr.responseType === 'text/css') throw 'Unexpected content type: "' + xhr.responseType + '"';
    success && success.apply(this, [xhr.responseText]);
  };
  xhr.send();
}

function fetchColorset(colorSetId, success) {
  var url = COLORSETS[colorSetId] || undefined;

  if (!url) throw 'Unknown colorset: "' + colorSetId + '"';

  fetchCss(url, success);
}

function parseCssColors(source) {
  var colorSets = source.match(/(--[a-z][0-9a-z-]+)\s*:\s*(.*?)(?=;)/g);
  var colorMatch;
  var colors = [];

  for (var i = 0; i < colorSets.length; i++) {
    colorMatch = colorSets[i].match(/(--[a-z][0-9a-z-]+)\s*:\s*(.*)/);
    if (colorMatch) {
      colors[colorMatch[1]] = colorMatch[2];
    }
  }

  return colors;
}

// other approach
// function applyColorset(colorSet) {
//   var timer = new Date();
//
//   for (var i = 0; i < document.styleSheets.length; i++) {
//     for (var ii = 0; ii < document.styleSheets[i].cssRules.length; ii++) {
//       var cssRule = document.styleSheets[i].cssRules[i];
//
//       if (!(cssRule instanceof CSSStyleRule)) continue;
//
//       var style = cssRule.style;
//
//       for (var iii = 0; iii < style.length; iii++) {
//         var property = style[iii];
//         // TODO: filter indexes which wont contain variables here
//         for (var variable in colorSet) {
//           if (colorSet.hasOwnProperty(variable)) {
//             style[property] = style[property].replace(variable, colorSet[variable]);
//           }
//         }
//       }
//     }
//   }
//
//   console.log('Duration: ' + (new Date().getTime() - timer.getTime()) + 'ms');
// }


console.info('App init');
console.info('CSS Variables ' + (CSS_VARS_SUPPORT ? 'supported =D' : 'not supported =\'('));


window.addEventListener('load', function(event) {
  reportStylesheetCount();
});

document.addEventListener('click', function(event) {
  if (event.target.tagName !== 'BUTTON' || event.target.name !== 'switch-colorset') return;

  var timer = new Date();
  var mainStylesheet;

  for (var i = 0; i < document.styleSheets.length; i++) {
    var href = document.styleSheets[i].href || '';
    if (href.match(/main\.css$/)) {
      mainStylesheet = document.styleSheets[i];
    }
  }

  fetchColorset(event.target.value, function(rule) {
    if (CSS_VARS_SUPPORT) {
      console.log('Writing new variables');

      mainStylesheet.insertRule(rule, mainStylesheet.cssRules.length);

      console.log('Duration: ' + (new Date().getTime() - timer.getTime()) + 'ms');
    }

    else {
      var colors = parseCssColors(rule);
      fetchCss(mainStylesheet.href, function(css) {
        console.log('Re-writing current stylesheet');

        for (var variable in colors) {
          if (colors.hasOwnProperty(variable)) {
            css = css.replace(new RegExp('var\\(' + variable + '\\)', 'gm'), colors[variable]);
          }
        }

        newStylesheet = document.createElement('style');
        newStylesheet.type = 'text/css';
        newStylesheet.appendChild(document.createTextNode(css));
        document.head.appendChild(newStylesheet);

        console.log('Duration: ' + (new Date().getTime() - timer.getTime()) + 'ms');
      });
    }
  });
});
