(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{553:function(e,n,t){!function(e){"use strict";e.registerHelper("fold","markdown",function(n,t){var i=100;function r(t){var i=n.getTokenTypeAt(e.Pos(t,0));return i&&/\bheader\b/.test(i)}function o(e,n,t){var o=n&&n.match(/^#+/);return o&&r(e)?o[0].length:(o=t&&t.match(/^[=\-]+\s*$/))&&r(e+1)?"="==t[0]?1:2:i}var a=n.getLine(t.line),s=n.getLine(t.line+1),l=o(t.line,a,s);if(l!==i){for(var c=n.lastLine(),g=t.line,u=n.getLine(g+2);g<c&&!(o(g+1,s,u)<=l);)++g,s=u,u=n.getLine(g+2);return{from:e.Pos(t.line,a.length),to:e.Pos(g,n.getLine(g).length)}}})}(t(163))}}]);
//# sourceMappingURL=11-37af23b2a3cf79f8186b.js.map