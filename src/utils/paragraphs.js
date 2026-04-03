export const paragraphs = [
  // section 1
  "animateToOverview: function(animationType) {\n" +
  "for (let w = 0; w < this._workspaces.length; w++) {\n" +
  "if (animationType == AnimationType.ZOOM)\n" +
  "this._workspaces[w].zoomToOverview();\n" +
  "else\n" +
  "this._workspaces[w].fadeToOverview();\n" +
  "}\n" +
  "this._updateWorkspaceActors(false);\n" +
  "}",
  // section 2
  "animateFromOverview: function(animationType) {\n" +
  "this.actor.remove_clip();\n" +
  "for (let w = 0; w < this._workspaces.length; w++) {\n" +
  "if (animationType == AnimationType.ZOOM)\n" +
  "this._workspaces[w].zoomFromOverview();\n" +
  "else\n" +
  "this._workspaces[w].fadeFromOverview();\n" +
  "}\n" +
  "}",
  // section 3 (JavaScript): commonly used debounce utility
  "function debounce(fn, wait, immediate) {\n" +
  "let timeout;\n" +
  "return function(...args) {\n" +
  "const callNow = immediate && !timeout;\n" +
  "clearTimeout(timeout);\n" +
  "timeout = setTimeout(() => {\n" +
  "timeout = null;\n" +
  "if (!immediate) fn.apply(this, args);\n" +
  "}, wait);\n" +
  "if (callNow) fn.apply(this, args);\n" +
  "}\n" +
  "}",
  // section 4 (JavaScript): memoize utility with optional resolver
  "function memoize(fn, resolver) {\n" +
  "const cache = new Map();\n" +
  "return function(...args) {\n" +
  "const key = resolver ? resolver.apply(this, args) : args[0];\n" +
  "if (cache.has(key)) return cache.get(key);\n" +
  "const result = fn.apply(this, args);\n" +
  "cache.set(key, result);\n" +
  "return result;\n" +
  "};\n" +
  "}",
]
