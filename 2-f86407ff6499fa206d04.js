(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{335:function(n,o,e){!function(n){"use strict";function o(o,e,i,t){if(i&&i.call){var l=i;i=null}else var l=r(o,i,"rangeFinder");"number"==typeof e&&(e=n.Pos(e,0));var f=r(o,i,"minFoldSize");function d(n){var r=l(o,e);if(!r||r.to.line-r.from.line<f)return null;for(var i=o.findMarksAt(r.from),d=0;d<i.length;++d)if(i[d].__isFold&&"fold"!==t){if(!n)return null;r.cleared=!0,i[d].clear()}return r}var a=d(!0);if(r(o,i,"scanUp"))for(;!a&&e.line>o.firstLine();)e=n.Pos(e.line-1,0),a=d(!1);if(a&&!a.cleared&&"unfold"!==t){var u=function(n,o){var e=r(n,o,"widget");if("string"==typeof e){var i=document.createTextNode(e);(e=document.createElement("span")).appendChild(i),e.className="CodeMirror-foldmarker"}else e&&(e=e.cloneNode(!0));return e}(o,i);n.on(u,"mousedown",function(o){c.clear(),n.e_preventDefault(o)});var c=o.markText(a.from,a.to,{replacedWith:u,clearOnEnter:r(o,i,"clearOnEnter"),__isFold:!0});c.on("clear",function(e,r){n.signal(o,"unfold",o,e,r)}),n.signal(o,"fold",o,a.from,a.to)}}n.newFoldFunction=function(n,e){return function(r,i){o(r,i,{rangeFinder:n,widget:e})}},n.defineExtension("foldCode",function(n,e,r){o(this,n,e,r)}),n.defineExtension("isFolded",function(n){for(var o=this.findMarksAt(n),e=0;e<o.length;++e)if(o[e].__isFold)return!0}),n.commands.toggleFold=function(n){n.foldCode(n.getCursor())},n.commands.fold=function(n){n.foldCode(n.getCursor(),null,"fold")},n.commands.unfold=function(n){n.foldCode(n.getCursor(),null,"unfold")},n.commands.foldAll=function(o){o.operation(function(){for(var e=o.firstLine(),r=o.lastLine();e<=r;e++)o.foldCode(n.Pos(e,0),null,"fold")})},n.commands.unfoldAll=function(o){o.operation(function(){for(var e=o.firstLine(),r=o.lastLine();e<=r;e++)o.foldCode(n.Pos(e,0),null,"unfold")})},n.registerHelper("fold","combine",function(){var n=Array.prototype.slice.call(arguments,0);return function(o,e){for(var r=0;r<n.length;++r){var i=n[r](o,e);if(i)return i}}}),n.registerHelper("fold","auto",function(n,o){for(var e=n.getHelpers(o,"fold"),r=0;r<e.length;r++){var i=e[r](n,o);if(i)return i}});var e={rangeFinder:n.fold.auto,widget:"↔",minFoldSize:0,scanUp:!1,clearOnEnter:!0};function r(n,o,r){if(o&&void 0!==o[r])return o[r];var i=n.options.foldOptions;return i&&void 0!==i[r]?i[r]:e[r]}n.defineOption("foldOptions",null),n.defineExtension("foldOption",function(n,o){return r(this,n,o)})}(e(163))}}]);
//# sourceMappingURL=2-f86407ff6499fa206d04.js.map