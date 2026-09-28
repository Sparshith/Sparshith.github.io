// dashboard/node_modules/chess.js/dist/esm/chess.js
function rootNode(comment) {
  return comment !== null ? { comment, variations: [] } : { variations: [] };
}
function node(move, suffix, nag, comment, variations) {
  const node2 = { move, variations };
  if (suffix) {
    node2.suffix = suffix;
  }
  if (nag) {
    node2.nag = nag;
  }
  if (comment !== null) {
    node2.comment = comment;
  }
  return node2;
}
function lineToTree(...nodes) {
  const [root, ...rest] = nodes;
  let parent = root;
  for (const child of rest) {
    if (child !== null) {
      parent.variations = [child, ...child.variations];
      child.variations = [];
      parent = child;
    }
  }
  return root;
}
function pgn(headers, game2) {
  if (game2.marker && game2.marker.comment) {
    let node2 = game2.root;
    while (true) {
      const next = node2.variations[0];
      if (!next) {
        node2.comment = game2.marker.comment;
        break;
      }
      node2 = next;
    }
  }
  return {
    headers,
    root: game2.root,
    result: (game2.marker && game2.marker.result) ?? void 0
  };
}
function peg$subclass(child, parent) {
  function C() {
    this.constructor = child;
  }
  C.prototype = parent.prototype;
  child.prototype = new C();
}
function peg$SyntaxError(message, expected, found, location2) {
  var self = Error.call(this, message);
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self, peg$SyntaxError.prototype);
  }
  self.expected = expected;
  self.found = found;
  self.location = location2;
  self.name = "SyntaxError";
  return self;
}
peg$subclass(peg$SyntaxError, Error);
function peg$padEnd(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}
peg$SyntaxError.prototype.format = function(sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0; k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var offset_s = this.location.source && typeof this.location.source.offset === "function" ? this.location.source.offset(s) : s;
    var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", offset_s.line.toString().length, " ");
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = last - s.column || 1;
      str += "\n --> " + loc + "\n" + filler + " |\n" + offset_s.line + " | " + line + "\n" + filler + " | " + peg$padEnd("", s.column - 1, " ") + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};
peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return '"' + literalEscape(expectation.text) + '"';
    },
    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
      });
      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(expectation) {
      return expectation.description;
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected2) {
    var descriptions = expected2.map(describeExpectation);
    var i, j;
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found2) {
    return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
  options = options !== void 0 ? options : {};
  var peg$FAILED = {};
  var peg$source = options.grammarSource;
  var peg$startRuleFunctions = { pgn: peg$parsepgn };
  var peg$startRuleFunction = peg$parsepgn;
  var peg$c0 = "[";
  var peg$c1 = '"';
  var peg$c2 = "]";
  var peg$c3 = ".";
  var peg$c4 = "O-O-O";
  var peg$c5 = "O-O";
  var peg$c6 = "0-0-0";
  var peg$c7 = "0-0";
  var peg$c8 = "$";
  var peg$c9 = "{";
  var peg$c10 = "}";
  var peg$c11 = ";";
  var peg$c12 = "(";
  var peg$c13 = ")";
  var peg$c14 = "1-0";
  var peg$c15 = "0-1";
  var peg$c16 = "1/2-1/2";
  var peg$c17 = "*";
  var peg$r0 = /^[a-zA-Z]/;
  var peg$r1 = /^[^"]/;
  var peg$r2 = /^[0-9]/;
  var peg$r3 = /^[.]/;
  var peg$r4 = /^[a-zA-Z1-8\-=]/;
  var peg$r5 = /^[+#]/;
  var peg$r6 = /^[!?]/;
  var peg$r7 = /^[^}]/;
  var peg$r8 = /^[^\r\n]/;
  var peg$r9 = /^[ \t\r\n]/;
  var peg$e0 = peg$otherExpectation("tag pair");
  var peg$e1 = peg$literalExpectation("[", false);
  var peg$e2 = peg$literalExpectation('"', false);
  var peg$e3 = peg$literalExpectation("]", false);
  var peg$e4 = peg$otherExpectation("tag name");
  var peg$e5 = peg$classExpectation([["a", "z"], ["A", "Z"]], false, false);
  var peg$e6 = peg$otherExpectation("tag value");
  var peg$e7 = peg$classExpectation(['"'], true, false);
  var peg$e8 = peg$otherExpectation("move number");
  var peg$e9 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e10 = peg$literalExpectation(".", false);
  var peg$e11 = peg$classExpectation(["."], false, false);
  var peg$e12 = peg$otherExpectation("standard algebraic notation");
  var peg$e13 = peg$literalExpectation("O-O-O", false);
  var peg$e14 = peg$literalExpectation("O-O", false);
  var peg$e15 = peg$literalExpectation("0-0-0", false);
  var peg$e16 = peg$literalExpectation("0-0", false);
  var peg$e17 = peg$classExpectation([["a", "z"], ["A", "Z"], ["1", "8"], "-", "="], false, false);
  var peg$e18 = peg$classExpectation(["+", "#"], false, false);
  var peg$e19 = peg$otherExpectation("suffix annotation");
  var peg$e20 = peg$classExpectation(["!", "?"], false, false);
  var peg$e21 = peg$otherExpectation("NAG");
  var peg$e22 = peg$literalExpectation("$", false);
  var peg$e23 = peg$otherExpectation("brace comment");
  var peg$e24 = peg$literalExpectation("{", false);
  var peg$e25 = peg$classExpectation(["}"], true, false);
  var peg$e26 = peg$literalExpectation("}", false);
  var peg$e27 = peg$otherExpectation("rest of line comment");
  var peg$e28 = peg$literalExpectation(";", false);
  var peg$e29 = peg$classExpectation(["\r", "\n"], true, false);
  var peg$e30 = peg$otherExpectation("variation");
  var peg$e31 = peg$literalExpectation("(", false);
  var peg$e32 = peg$literalExpectation(")", false);
  var peg$e33 = peg$otherExpectation("game termination marker");
  var peg$e34 = peg$literalExpectation("1-0", false);
  var peg$e35 = peg$literalExpectation("0-1", false);
  var peg$e36 = peg$literalExpectation("1/2-1/2", false);
  var peg$e37 = peg$literalExpectation("*", false);
  var peg$e38 = peg$otherExpectation("whitespace");
  var peg$e39 = peg$classExpectation([" ", "	", "\r", "\n"], false, false);
  var peg$f0 = function(headers, game2) {
    return pgn(headers, game2);
  };
  var peg$f1 = function(tagPairs) {
    return Object.fromEntries(tagPairs);
  };
  var peg$f2 = function(tagName, tagValue) {
    return [tagName, tagValue];
  };
  var peg$f3 = function(root, marker) {
    return { root, marker };
  };
  var peg$f4 = function(comment, moves) {
    return lineToTree(rootNode(comment), ...moves.flat());
  };
  var peg$f5 = function(san, suffix, nag, comment, variations) {
    return node(san, suffix, nag, comment, variations);
  };
  var peg$f6 = function(nag) {
    return nag;
  };
  var peg$f7 = function(comment) {
    return comment.replace(/[\r\n]+/g, " ");
  };
  var peg$f8 = function(comment) {
    return comment.trim();
  };
  var peg$f9 = function(line) {
    return line;
  };
  var peg$f10 = function(result, comment) {
    return { result, comment };
  };
  var peg$currPos = options.peg$currPos | 0;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$maxFailPos = peg$currPos;
  var peg$maxFailExpected = options.peg$maxFailExpected || [];
  var peg$silentFails = options.peg$silentFails | 0;
  var peg$result;
  if (options.startRule) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text, ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts, inverted, ignoreCase };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description };
  }
  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;
    if (details) {
      return details;
    } else {
      if (pos >= peg$posDetailsCache.length) {
        p = peg$posDetailsCache.length - 1;
      } else {
        p = pos;
        while (!peg$posDetailsCache[--p]) {
        }
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos, offset) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);
    var res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
    return res;
  }
  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected);
  }
  function peg$buildStructuredError(expected, found, location2) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location2
    );
  }
  function peg$parsepgn() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$parsetagPairSection();
    s2 = peg$parsemoveTextSection();
    s0 = peg$f0(s1, s2);
    return s0;
  }
  function peg$parsetagPairSection() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsetagPair();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parsetagPair();
    }
    s2 = peg$parse_();
    s0 = peg$f1(s1);
    return s0;
  }
  function peg$parsetagPair() {
    var s0, s2, s4, s6, s7, s8, s10;
    peg$silentFails++;
    s0 = peg$currPos;
    peg$parse_();
    if (input.charCodeAt(peg$currPos) === 91) {
      s2 = peg$c0;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e1);
      }
    }
    if (s2 !== peg$FAILED) {
      peg$parse_();
      s4 = peg$parsetagName();
      if (s4 !== peg$FAILED) {
        peg$parse_();
        if (input.charCodeAt(peg$currPos) === 34) {
          s6 = peg$c1;
          peg$currPos++;
        } else {
          s6 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e2);
          }
        }
        if (s6 !== peg$FAILED) {
          s7 = peg$parsetagValue();
          if (input.charCodeAt(peg$currPos) === 34) {
            s8 = peg$c1;
            peg$currPos++;
          } else {
            s8 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e2);
            }
          }
          if (s8 !== peg$FAILED) {
            peg$parse_();
            if (input.charCodeAt(peg$currPos) === 93) {
              s10 = peg$c2;
              peg$currPos++;
            } else {
              s10 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e3);
              }
            }
            if (s10 !== peg$FAILED) {
              s0 = peg$f2(s4, s7);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      if (peg$silentFails === 0) {
        peg$fail(peg$e0);
      }
    }
    return s0;
  }
  function peg$parsetagName() {
    var s0, s1, s2;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r0.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e5);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = input.charAt(peg$currPos);
        if (peg$r0.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e5);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e4);
      }
    }
    return s0;
  }
  function peg$parsetagValue() {
    var s0, s1, s2;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r1.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e7);
      }
    }
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = input.charAt(peg$currPos);
      if (peg$r1.test(s2)) {
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e7);
        }
      }
    }
    s0 = input.substring(s0, peg$currPos);
    peg$silentFails--;
    s1 = peg$FAILED;
    if (peg$silentFails === 0) {
      peg$fail(peg$e6);
    }
    return s0;
  }
  function peg$parsemoveTextSection() {
    var s0, s1, s3;
    s0 = peg$currPos;
    s1 = peg$parseline();
    peg$parse_();
    s3 = peg$parsegameTerminationMarker();
    if (s3 === peg$FAILED) {
      s3 = null;
    }
    peg$parse_();
    s0 = peg$f3(s1, s3);
    return s0;
  }
  function peg$parseline() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parsecomment();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    s2 = [];
    s3 = peg$parsemove();
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$parsemove();
    }
    s0 = peg$f4(s1, s2);
    return s0;
  }
  function peg$parsemove() {
    var s0, s4, s5, s6, s7, s8, s9, s10;
    s0 = peg$currPos;
    peg$parse_();
    peg$parsemoveNumber();
    peg$parse_();
    s4 = peg$parsesan();
    if (s4 !== peg$FAILED) {
      s5 = peg$parsesuffixAnnotation();
      if (s5 === peg$FAILED) {
        s5 = null;
      }
      s6 = [];
      s7 = peg$parsenag();
      while (s7 !== peg$FAILED) {
        s6.push(s7);
        s7 = peg$parsenag();
      }
      s7 = peg$parse_();
      s8 = peg$parsecomment();
      if (s8 === peg$FAILED) {
        s8 = null;
      }
      s9 = [];
      s10 = peg$parsevariation();
      while (s10 !== peg$FAILED) {
        s9.push(s10);
        s10 = peg$parsevariation();
      }
      s0 = peg$f5(s4, s5, s6, s8, s9);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsemoveNumber() {
    var s0, s1, s2, s3, s4, s5;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r2.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e9);
      }
    }
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = input.charAt(peg$currPos);
      if (peg$r2.test(s2)) {
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e9);
        }
      }
    }
    if (input.charCodeAt(peg$currPos) === 46) {
      s2 = peg$c3;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e10);
      }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      s4 = [];
      s5 = input.charAt(peg$currPos);
      if (peg$r3.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e11);
        }
      }
      while (s5 !== peg$FAILED) {
        s4.push(s5);
        s5 = input.charAt(peg$currPos);
        if (peg$r3.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e11);
          }
        }
      }
      s1 = [s1, s2, s3, s4];
      s0 = s1;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e8);
      }
    }
    return s0;
  }
  function peg$parsesan() {
    var s0, s1, s2, s3, s4, s5;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c4) {
      s2 = peg$c4;
      peg$currPos += 5;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e13);
      }
    }
    if (s2 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c5) {
        s2 = peg$c5;
        peg$currPos += 3;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e14);
        }
      }
      if (s2 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c6) {
          s2 = peg$c6;
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e15);
          }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c7) {
            s2 = peg$c7;
            peg$currPos += 3;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e16);
            }
          }
          if (s2 === peg$FAILED) {
            s2 = peg$currPos;
            s3 = input.charAt(peg$currPos);
            if (peg$r0.test(s3)) {
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e5);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = input.charAt(peg$currPos);
              if (peg$r4.test(s5)) {
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e17);
                }
              }
              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = input.charAt(peg$currPos);
                  if (peg$r4.test(s5)) {
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e17);
                    }
                  }
                }
              } else {
                s4 = peg$FAILED;
              }
              if (s4 !== peg$FAILED) {
                s3 = [s3, s4];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          }
        }
      }
    }
    if (s2 !== peg$FAILED) {
      s3 = input.charAt(peg$currPos);
      if (peg$r5.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e18);
        }
      }
      if (s3 === peg$FAILED) {
        s3 = null;
      }
      s2 = [s2, s3];
      s1 = s2;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e12);
      }
    }
    return s0;
  }
  function peg$parsesuffixAnnotation() {
    var s0, s1, s2;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r6.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e20);
      }
    }
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      if (s1.length >= 2) {
        s2 = peg$FAILED;
      } else {
        s2 = input.charAt(peg$currPos);
        if (peg$r6.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e20);
          }
        }
      }
    }
    if (s1.length < 1) {
      peg$currPos = s0;
      s0 = peg$FAILED;
    } else {
      s0 = s1;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e19);
      }
    }
    return s0;
  }
  function peg$parsenag() {
    var s0, s2, s3, s4, s5;
    peg$silentFails++;
    s0 = peg$currPos;
    peg$parse_();
    if (input.charCodeAt(peg$currPos) === 36) {
      s2 = peg$c8;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e22);
      }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$currPos;
      s4 = [];
      s5 = input.charAt(peg$currPos);
      if (peg$r2.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e9);
        }
      }
      if (s5 !== peg$FAILED) {
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = input.charAt(peg$currPos);
          if (peg$r2.test(s5)) {
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e9);
            }
          }
        }
      } else {
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s3 = input.substring(s3, peg$currPos);
      } else {
        s3 = s4;
      }
      if (s3 !== peg$FAILED) {
        s0 = peg$f6(s3);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      if (peg$silentFails === 0) {
        peg$fail(peg$e21);
      }
    }
    return s0;
  }
  function peg$parsecomment() {
    var s0;
    s0 = peg$parsebraceComment();
    if (s0 === peg$FAILED) {
      s0 = peg$parserestOfLineComment();
    }
    return s0;
  }
  function peg$parsebraceComment() {
    var s0, s1, s2, s3, s4;
    peg$silentFails++;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c9;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e24);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      s4 = input.charAt(peg$currPos);
      if (peg$r7.test(s4)) {
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e25);
        }
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = input.charAt(peg$currPos);
        if (peg$r7.test(s4)) {
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e25);
          }
        }
      }
      s2 = input.substring(s2, peg$currPos);
      if (input.charCodeAt(peg$currPos) === 125) {
        s3 = peg$c10;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e26);
        }
      }
      if (s3 !== peg$FAILED) {
        s0 = peg$f7(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e23);
      }
    }
    return s0;
  }
  function peg$parserestOfLineComment() {
    var s0, s1, s2, s3, s4;
    peg$silentFails++;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 59) {
      s1 = peg$c11;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e28);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      s4 = input.charAt(peg$currPos);
      if (peg$r8.test(s4)) {
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e29);
        }
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = input.charAt(peg$currPos);
        if (peg$r8.test(s4)) {
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e29);
          }
        }
      }
      s2 = input.substring(s2, peg$currPos);
      s0 = peg$f8(s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e27);
      }
    }
    return s0;
  }
  function peg$parsevariation() {
    var s0, s2, s3, s5;
    peg$silentFails++;
    s0 = peg$currPos;
    peg$parse_();
    if (input.charCodeAt(peg$currPos) === 40) {
      s2 = peg$c12;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e31);
      }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parseline();
      if (s3 !== peg$FAILED) {
        peg$parse_();
        if (input.charCodeAt(peg$currPos) === 41) {
          s5 = peg$c13;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e32);
          }
        }
        if (s5 !== peg$FAILED) {
          s0 = peg$f9(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      if (peg$silentFails === 0) {
        peg$fail(peg$e30);
      }
    }
    return s0;
  }
  function peg$parsegameTerminationMarker() {
    var s0, s1, s3;
    peg$silentFails++;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c14) {
      s1 = peg$c14;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e34);
      }
    }
    if (s1 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c15) {
        s1 = peg$c15;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e35);
        }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c16) {
          s1 = peg$c16;
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e36);
          }
        }
        if (s1 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 42) {
            s1 = peg$c17;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e37);
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$parse_();
      s3 = peg$parsecomment();
      if (s3 === peg$FAILED) {
        s3 = null;
      }
      s0 = peg$f10(s1, s3);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e33);
      }
    }
    return s0;
  }
  function peg$parse_() {
    var s0, s1;
    peg$silentFails++;
    s0 = [];
    s1 = input.charAt(peg$currPos);
    if (peg$r9.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e39);
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = input.charAt(peg$currPos);
      if (peg$r9.test(s1)) {
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e39);
        }
      }
    }
    peg$silentFails--;
    s1 = peg$FAILED;
    if (peg$silentFails === 0) {
      peg$fail(peg$e38);
    }
    return s0;
  }
  peg$result = peg$startRuleFunction();
  if (options.peg$library) {
    return (
      /** @type {any} */
      {
        peg$result,
        peg$currPos,
        peg$FAILED,
        peg$maxFailExpected,
        peg$maxFailPos
      }
    );
  }
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}
var MASK64 = 0xffffffffffffffffn;
function rotl(x, k) {
  return (x << k | x >> 64n - k) & 0xffffffffffffffffn;
}
function wrappingMul(x, y) {
  return x * y & MASK64;
}
function xoroshiro128(state) {
  return function() {
    let s0 = BigInt(state & MASK64);
    let s1 = BigInt(state >> 64n & MASK64);
    const result = wrappingMul(rotl(wrappingMul(s0, 5n), 7n), 9n);
    s1 ^= s0;
    s0 = (rotl(s0, 24n) ^ s1 ^ s1 << 16n) & MASK64;
    s1 = rotl(s1, 37n);
    state = s1 << 64n | s0;
    return result;
  };
}
var rand = xoroshiro128(0xa187eb39cdcaed8f31c4b365b102e01en);
var PIECE_KEYS = Array.from({ length: 2 }, () => Array.from({ length: 6 }, () => Array.from({ length: 128 }, () => rand())));
var EP_KEYS = Array.from({ length: 8 }, () => rand());
var CASTLING_KEYS = Array.from({ length: 16 }, () => rand());
var SIDE_KEY = rand();
var WHITE = "w";
var BLACK = "b";
var PAWN = "p";
var KNIGHT = "n";
var BISHOP = "b";
var ROOK = "r";
var QUEEN = "q";
var KING = "k";
var DEFAULT_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var Move = class {
  color;
  from;
  to;
  piece;
  captured;
  promotion;
  /**
   * @deprecated This field is deprecated and will be removed in version 2.0.0.
   * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
   * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
   * `isBigPawn`
   */
  flags;
  san;
  lan;
  before;
  after;
  constructor(chess, internal) {
    const { color, piece, from, to, flags, captured, promotion: promotion2 } = internal;
    const fromAlgebraic = algebraic(from);
    const toAlgebraic = algebraic(to);
    this.color = color;
    this.piece = piece;
    this.from = fromAlgebraic;
    this.to = toAlgebraic;
    this.san = chess["_moveToSan"](internal, chess["_moves"]({ legal: true }));
    this.lan = fromAlgebraic + toAlgebraic;
    this.before = chess.fen();
    chess["_makeMove"](internal);
    this.after = chess.fen();
    chess["_undoMove"]();
    this.flags = "";
    for (const flag in BITS) {
      if (BITS[flag] & flags) {
        this.flags += FLAGS[flag];
      }
    }
    if (captured) {
      this.captured = captured;
    }
    if (promotion2) {
      this.promotion = promotion2;
      this.lan += promotion2;
    }
  }
  isCapture() {
    return this.flags.indexOf(FLAGS["CAPTURE"]) > -1;
  }
  isPromotion() {
    return this.flags.indexOf(FLAGS["PROMOTION"]) > -1;
  }
  isEnPassant() {
    return this.flags.indexOf(FLAGS["EP_CAPTURE"]) > -1;
  }
  isKingsideCastle() {
    return this.flags.indexOf(FLAGS["KSIDE_CASTLE"]) > -1;
  }
  isQueensideCastle() {
    return this.flags.indexOf(FLAGS["QSIDE_CASTLE"]) > -1;
  }
  isBigPawn() {
    return this.flags.indexOf(FLAGS["BIG_PAWN"]) > -1;
  }
};
var EMPTY = -1;
var FLAGS = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q",
  NULL_MOVE: "-"
};
var BITS = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64,
  NULL_MOVE: 128
};
var SEVEN_TAG_ROSTER = {
  Event: "?",
  Site: "?",
  Date: "????.??.??",
  Round: "?",
  White: "?",
  Black: "?",
  Result: "*"
};
var SUPLEMENTAL_TAGS = {
  WhiteTitle: null,
  BlackTitle: null,
  WhiteElo: null,
  BlackElo: null,
  WhiteUSCF: null,
  BlackUSCF: null,
  WhiteNA: null,
  BlackNA: null,
  WhiteType: null,
  BlackType: null,
  EventDate: null,
  EventSponsor: null,
  Section: null,
  Stage: null,
  Board: null,
  Opening: null,
  Variation: null,
  SubVariation: null,
  ECO: null,
  NIC: null,
  Time: null,
  UTCTime: null,
  UTCDate: null,
  TimeControl: null,
  SetUp: null,
  FEN: null,
  Termination: null,
  Annotator: null,
  Mode: null,
  PlyCount: null
};
var HEADER_TEMPLATE = {
  ...SEVEN_TAG_ROSTER,
  ...SUPLEMENTAL_TAGS
};
var Ox88 = {
  a8: 0,
  b8: 1,
  c8: 2,
  d8: 3,
  e8: 4,
  f8: 5,
  g8: 6,
  h8: 7,
  a7: 16,
  b7: 17,
  c7: 18,
  d7: 19,
  e7: 20,
  f7: 21,
  g7: 22,
  h7: 23,
  a6: 32,
  b6: 33,
  c6: 34,
  d6: 35,
  e6: 36,
  f6: 37,
  g6: 38,
  h6: 39,
  a5: 48,
  b5: 49,
  c5: 50,
  d5: 51,
  e5: 52,
  f5: 53,
  g5: 54,
  h5: 55,
  a4: 64,
  b4: 65,
  c4: 66,
  d4: 67,
  e4: 68,
  f4: 69,
  g4: 70,
  h4: 71,
  a3: 80,
  b3: 81,
  c3: 82,
  d3: 83,
  e3: 84,
  f3: 85,
  g3: 86,
  h3: 87,
  a2: 96,
  b2: 97,
  c2: 98,
  d2: 99,
  e2: 100,
  f2: 101,
  g2: 102,
  h2: 103,
  a1: 112,
  b1: 113,
  c1: 114,
  d1: 115,
  e1: 116,
  f1: 117,
  g1: 118,
  h1: 119
};
var PAWN_OFFSETS = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
};
var PIECE_OFFSETS = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1]
};
var ATTACKS = [
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  24,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  2,
  24,
  2,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  53,
  56,
  53,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  24,
  24,
  24,
  24,
  24,
  56,
  0,
  56,
  24,
  24,
  24,
  24,
  24,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  53,
  56,
  53,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  2,
  24,
  2,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  24,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  20
];
var RAYS = [
  17,
  0,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  17,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  16,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  16,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  16,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  -16,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  -16,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  -16,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  0,
  -17,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  0,
  0,
  -17
];
var PIECE_MASKS = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 };
var SYMBOLS = "pnbrqkPNBRQK";
var PROMOTIONS = [KNIGHT, BISHOP, ROOK, QUEEN];
var RANK_1 = 7;
var RANK_2 = 6;
var RANK_7 = 1;
var RANK_8 = 0;
var SIDES = {
  [KING]: BITS.KSIDE_CASTLE,
  [QUEEN]: BITS.QSIDE_CASTLE
};
var ROOKS = {
  w: [
    { square: Ox88.a1, flag: BITS.QSIDE_CASTLE },
    { square: Ox88.h1, flag: BITS.KSIDE_CASTLE }
  ],
  b: [
    { square: Ox88.a8, flag: BITS.QSIDE_CASTLE },
    { square: Ox88.h8, flag: BITS.KSIDE_CASTLE }
  ]
};
var SECOND_RANK = { b: RANK_7, w: RANK_2 };
var SAN_NULLMOVE = "--";
function rank(square) {
  return square >> 4;
}
function file(square) {
  return square & 15;
}
function isDigit(c) {
  return "0123456789".indexOf(c) !== -1;
}
function algebraic(square) {
  const f = file(square);
  const r = rank(square);
  return "abcdefgh".substring(f, f + 1) + "87654321".substring(r, r + 1);
}
function swapColor(color) {
  return color === WHITE ? BLACK : WHITE;
}
function validateFen(fen) {
  const tokens = fen.split(/\s+/);
  if (tokens.length !== 6) {
    return {
      ok: false,
      error: "Invalid FEN: must contain six space-delimited fields"
    };
  }
  const moveNumber = parseInt(tokens[5], 10);
  if (isNaN(moveNumber) || moveNumber <= 0) {
    return {
      ok: false,
      error: "Invalid FEN: move number must be a positive integer"
    };
  }
  const halfMoves = parseInt(tokens[4], 10);
  if (isNaN(halfMoves) || halfMoves < 0) {
    return {
      ok: false,
      error: "Invalid FEN: half move counter number must be a non-negative integer"
    };
  }
  if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
    return { ok: false, error: "Invalid FEN: en-passant square is invalid" };
  }
  if (/[^kKqQ-]/.test(tokens[2])) {
    return { ok: false, error: "Invalid FEN: castling availability is invalid" };
  }
  if (!/^(w|b)$/.test(tokens[1])) {
    return { ok: false, error: "Invalid FEN: side-to-move is invalid" };
  }
  const rows = tokens[0].split("/");
  if (rows.length !== 8) {
    return {
      ok: false,
      error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows"
    };
  }
  for (let i = 0; i < rows.length; i++) {
    let sumFields = 0;
    let previousWasNumber = false;
    for (let k = 0; k < rows[i].length; k++) {
      if (isDigit(rows[i][k])) {
        if (previousWasNumber) {
          return {
            ok: false,
            error: "Invalid FEN: piece data is invalid (consecutive number)"
          };
        }
        sumFields += parseInt(rows[i][k], 10);
        previousWasNumber = true;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
          return {
            ok: false,
            error: "Invalid FEN: piece data is invalid (invalid piece)"
          };
        }
        sumFields += 1;
        previousWasNumber = false;
      }
    }
    if (sumFields !== 8) {
      return {
        ok: false,
        error: "Invalid FEN: piece data is invalid (too many squares in rank)"
      };
    }
  }
  if (tokens[3][1] == "3" && tokens[1] == "w" || tokens[3][1] == "6" && tokens[1] == "b") {
    return { ok: false, error: "Invalid FEN: illegal en-passant square" };
  }
  const kings = [
    { color: "white", regex: /K/g },
    { color: "black", regex: /k/g }
  ];
  for (const { color, regex } of kings) {
    if (!regex.test(tokens[0])) {
      return { ok: false, error: `Invalid FEN: missing ${color} king` };
    }
    if ((tokens[0].match(regex) || []).length > 1) {
      return { ok: false, error: `Invalid FEN: too many ${color} kings` };
    }
  }
  if (Array.from(rows[0] + rows[7]).some((char) => char.toUpperCase() === "P")) {
    return {
      ok: false,
      error: "Invalid FEN: some pawns are on the edge rows"
    };
  }
  return { ok: true };
}
function getDisambiguator(move, moves) {
  const from = move.from;
  const to = move.to;
  const piece = move.piece;
  let ambiguities = 0;
  let sameRank = 0;
  let sameFile = 0;
  for (let i = 0, len = moves.length; i < len; i++) {
    const ambigFrom = moves[i].from;
    const ambigTo = moves[i].to;
    const ambigPiece = moves[i].piece;
    if (piece === ambigPiece && from !== ambigFrom && to === ambigTo) {
      ambiguities++;
      if (rank(from) === rank(ambigFrom)) {
        sameRank++;
      }
      if (file(from) === file(ambigFrom)) {
        sameFile++;
      }
    }
  }
  if (ambiguities > 0) {
    if (sameRank > 0 && sameFile > 0) {
      return algebraic(from);
    } else if (sameFile > 0) {
      return algebraic(from).charAt(1);
    } else {
      return algebraic(from).charAt(0);
    }
  }
  return "";
}
function addMove(moves, color, from, to, piece, captured = void 0, flags = BITS.NORMAL) {
  const r = rank(to);
  if (piece === PAWN && (r === RANK_1 || r === RANK_8)) {
    for (let i = 0; i < PROMOTIONS.length; i++) {
      const promotion2 = PROMOTIONS[i];
      moves.push({
        color,
        from,
        to,
        piece,
        captured,
        promotion: promotion2,
        flags: flags | BITS.PROMOTION
      });
    }
  } else {
    moves.push({
      color,
      from,
      to,
      piece,
      captured,
      flags
    });
  }
}
function inferPieceType(san) {
  let pieceType = san.charAt(0);
  if (pieceType >= "a" && pieceType <= "h") {
    const matches = san.match(/[a-h]\d.*[a-h]\d/);
    if (matches) {
      return void 0;
    }
    return PAWN;
  }
  pieceType = pieceType.toLowerCase();
  if (pieceType === "o") {
    return KING;
  }
  return pieceType;
}
function strippedSan(move) {
  return move.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
var Chess = class {
  _board = new Array(128);
  _turn = WHITE;
  _header = {};
  _kings = { w: EMPTY, b: EMPTY };
  _epSquare = -1;
  _halfMoves = 0;
  _moveNumber = 0;
  _history = [];
  _comments = {};
  _castling = { w: 0, b: 0 };
  _hash = 0n;
  // tracks number of times a position has been seen for repetition checking
  _positionCount = /* @__PURE__ */ new Map();
  constructor(fen = DEFAULT_POSITION, { skipValidation = false } = {}) {
    this.load(fen, { skipValidation });
  }
  clear({ preserveHeaders = false } = {}) {
    this._board = new Array(128);
    this._kings = { w: EMPTY, b: EMPTY };
    this._turn = WHITE;
    this._castling = { w: 0, b: 0 };
    this._epSquare = EMPTY;
    this._halfMoves = 0;
    this._moveNumber = 1;
    this._history = [];
    this._comments = {};
    this._header = preserveHeaders ? this._header : { ...HEADER_TEMPLATE };
    this._hash = this._computeHash();
    this._positionCount = /* @__PURE__ */ new Map();
    this._header["SetUp"] = null;
    this._header["FEN"] = null;
  }
  load(fen, { skipValidation = false, preserveHeaders = false } = {}) {
    let tokens = fen.split(/\s+/);
    if (tokens.length >= 2 && tokens.length < 6) {
      const adjustments = ["-", "-", "0", "1"];
      fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(" ");
    }
    tokens = fen.split(/\s+/);
    if (!skipValidation) {
      const { ok, error } = validateFen(fen);
      if (!ok) {
        throw new Error(error);
      }
    }
    const position = tokens[0];
    let square = 0;
    this.clear({ preserveHeaders });
    for (let i = 0; i < position.length; i++) {
      const piece = position.charAt(i);
      if (piece === "/") {
        square += 8;
      } else if (isDigit(piece)) {
        square += parseInt(piece, 10);
      } else {
        const color = piece < "a" ? WHITE : BLACK;
        this._put({ type: piece.toLowerCase(), color }, algebraic(square));
        square++;
      }
    }
    this._turn = tokens[1];
    if (tokens[2].indexOf("K") > -1) {
      this._castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf("Q") > -1) {
      this._castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf("k") > -1) {
      this._castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf("q") > -1) {
      this._castling.b |= BITS.QSIDE_CASTLE;
    }
    this._epSquare = tokens[3] === "-" ? EMPTY : Ox88[tokens[3]];
    this._halfMoves = parseInt(tokens[4], 10);
    this._moveNumber = parseInt(tokens[5], 10);
    this._hash = this._computeHash();
    this._updateSetup(fen);
    this._incPositionCount();
  }
  fen({ forceEnpassantSquare = false } = {}) {
    let empty = 0;
    let fen = "";
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      if (this._board[i]) {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        const { color, type: piece } = this._board[i];
        fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
      } else {
        empty++;
      }
      if (i + 1 & 136) {
        if (empty > 0) {
          fen += empty;
        }
        if (i !== Ox88.h1) {
          fen += "/";
        }
        empty = 0;
        i += 8;
      }
    }
    let castling = "";
    if (this._castling[WHITE] & BITS.KSIDE_CASTLE) {
      castling += "K";
    }
    if (this._castling[WHITE] & BITS.QSIDE_CASTLE) {
      castling += "Q";
    }
    if (this._castling[BLACK] & BITS.KSIDE_CASTLE) {
      castling += "k";
    }
    if (this._castling[BLACK] & BITS.QSIDE_CASTLE) {
      castling += "q";
    }
    castling = castling || "-";
    let epSquare = "-";
    if (this._epSquare !== EMPTY) {
      if (forceEnpassantSquare) {
        epSquare = algebraic(this._epSquare);
      } else {
        const bigPawnSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
        const squares = [bigPawnSquare + 1, bigPawnSquare - 1];
        for (const square of squares) {
          if (square & 136) {
            continue;
          }
          const color = this._turn;
          if (this._board[square]?.color === color && this._board[square]?.type === PAWN) {
            this._makeMove({
              color,
              from: square,
              to: this._epSquare,
              piece: PAWN,
              captured: PAWN,
              flags: BITS.EP_CAPTURE
            });
            const isLegal = !this._isKingAttacked(color);
            this._undoMove();
            if (isLegal) {
              epSquare = algebraic(this._epSquare);
              break;
            }
          }
        }
      }
    }
    return [
      fen,
      this._turn,
      castling,
      epSquare,
      this._halfMoves,
      this._moveNumber
    ].join(" ");
  }
  _pieceKey(i) {
    if (!this._board[i]) {
      return 0n;
    }
    const { color, type } = this._board[i];
    const colorIndex = {
      w: 0,
      b: 1
    }[color];
    const typeIndex = {
      p: 0,
      n: 1,
      b: 2,
      r: 3,
      q: 4,
      k: 5
    }[type];
    return PIECE_KEYS[colorIndex][typeIndex][i];
  }
  _epKey() {
    return this._epSquare === EMPTY ? 0n : EP_KEYS[this._epSquare & 7];
  }
  _castlingKey() {
    const index = this._castling.w >> 5 | this._castling.b >> 3;
    return CASTLING_KEYS[index];
  }
  _computeHash() {
    let hash = 0n;
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      if (i & 136) {
        i += 7;
        continue;
      }
      if (this._board[i]) {
        hash ^= this._pieceKey(i);
      }
    }
    hash ^= this._epKey();
    hash ^= this._castlingKey();
    if (this._turn === "b") {
      hash ^= SIDE_KEY;
    }
    return hash;
  }
  /*
   * Called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object. If the FEN
   * is equal to the default position, the SetUp and FEN are deleted the setup
   * is only updated if history.length is zero, ie moves haven't been made.
   */
  _updateSetup(fen) {
    if (this._history.length > 0)
      return;
    if (fen !== DEFAULT_POSITION) {
      this._header["SetUp"] = "1";
      this._header["FEN"] = fen;
    } else {
      this._header["SetUp"] = null;
      this._header["FEN"] = null;
    }
  }
  reset() {
    this.load(DEFAULT_POSITION);
  }
  get(square) {
    return this._board[Ox88[square]];
  }
  findPiece(piece) {
    const squares = [];
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      if (i & 136) {
        i += 7;
        continue;
      }
      if (!this._board[i] || this._board[i]?.color !== piece.color) {
        continue;
      }
      if (this._board[i].color === piece.color && this._board[i].type === piece.type) {
        squares.push(algebraic(i));
      }
    }
    return squares;
  }
  put({ type, color }, square) {
    if (this._put({ type, color }, square)) {
      this._updateCastlingRights();
      this._updateEnPassantSquare();
      this._updateSetup(this.fen());
      return true;
    }
    return false;
  }
  _set(sq, piece) {
    this._hash ^= this._pieceKey(sq);
    this._board[sq] = piece;
    this._hash ^= this._pieceKey(sq);
  }
  _put({ type, color }, square) {
    if (SYMBOLS.indexOf(type.toLowerCase()) === -1) {
      return false;
    }
    if (!(square in Ox88)) {
      return false;
    }
    const sq = Ox88[square];
    if (type == KING && !(this._kings[color] == EMPTY || this._kings[color] == sq)) {
      return false;
    }
    const currentPieceOnSquare = this._board[sq];
    if (currentPieceOnSquare && currentPieceOnSquare.type === KING) {
      this._kings[currentPieceOnSquare.color] = EMPTY;
    }
    this._set(sq, { type, color });
    if (type === KING) {
      this._kings[color] = sq;
    }
    return true;
  }
  _clear(sq) {
    this._hash ^= this._pieceKey(sq);
    delete this._board[sq];
  }
  remove(square) {
    const piece = this.get(square);
    this._clear(Ox88[square]);
    if (piece && piece.type === KING) {
      this._kings[piece.color] = EMPTY;
    }
    this._updateCastlingRights();
    this._updateEnPassantSquare();
    this._updateSetup(this.fen());
    return piece;
  }
  _updateCastlingRights() {
    this._hash ^= this._castlingKey();
    const whiteKingInPlace = this._board[Ox88.e1]?.type === KING && this._board[Ox88.e1]?.color === WHITE;
    const blackKingInPlace = this._board[Ox88.e8]?.type === KING && this._board[Ox88.e8]?.color === BLACK;
    if (!whiteKingInPlace || this._board[Ox88.a1]?.type !== ROOK || this._board[Ox88.a1]?.color !== WHITE) {
      this._castling.w &= -65;
    }
    if (!whiteKingInPlace || this._board[Ox88.h1]?.type !== ROOK || this._board[Ox88.h1]?.color !== WHITE) {
      this._castling.w &= -33;
    }
    if (!blackKingInPlace || this._board[Ox88.a8]?.type !== ROOK || this._board[Ox88.a8]?.color !== BLACK) {
      this._castling.b &= -65;
    }
    if (!blackKingInPlace || this._board[Ox88.h8]?.type !== ROOK || this._board[Ox88.h8]?.color !== BLACK) {
      this._castling.b &= -33;
    }
    this._hash ^= this._castlingKey();
  }
  _updateEnPassantSquare() {
    if (this._epSquare === EMPTY) {
      return;
    }
    const startSquare = this._epSquare + (this._turn === WHITE ? -16 : 16);
    const currentSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
    const attackers = [currentSquare + 1, currentSquare - 1];
    if (this._board[startSquare] !== null || this._board[this._epSquare] !== null || this._board[currentSquare]?.color !== swapColor(this._turn) || this._board[currentSquare]?.type !== PAWN) {
      this._hash ^= this._epKey();
      this._epSquare = EMPTY;
      return;
    }
    const canCapture = (square) => !(square & 136) && this._board[square]?.color === this._turn && this._board[square]?.type === PAWN;
    if (!attackers.some(canCapture)) {
      this._hash ^= this._epKey();
      this._epSquare = EMPTY;
    }
  }
  _attacked(color, square, verbose) {
    const attackers = [];
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      if (i & 136) {
        i += 7;
        continue;
      }
      if (this._board[i] === void 0 || this._board[i].color !== color) {
        continue;
      }
      const piece = this._board[i];
      const difference = i - square;
      if (difference === 0) {
        continue;
      }
      const index = difference + 119;
      if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
        if (piece.type === PAWN) {
          if (difference > 0 && piece.color === WHITE || difference <= 0 && piece.color === BLACK) {
            if (!verbose) {
              return true;
            } else {
              attackers.push(algebraic(i));
            }
          }
          continue;
        }
        if (piece.type === "n" || piece.type === "k") {
          if (!verbose) {
            return true;
          } else {
            attackers.push(algebraic(i));
            continue;
          }
        }
        const offset = RAYS[index];
        let j = i + offset;
        let blocked = false;
        while (j !== square) {
          if (this._board[j] != null) {
            blocked = true;
            break;
          }
          j += offset;
        }
        if (!blocked) {
          if (!verbose) {
            return true;
          } else {
            attackers.push(algebraic(i));
            continue;
          }
        }
      }
    }
    if (verbose) {
      return attackers;
    } else {
      return false;
    }
  }
  attackers(square, attackedBy) {
    if (!attackedBy) {
      return this._attacked(this._turn, Ox88[square], true);
    } else {
      return this._attacked(attackedBy, Ox88[square], true);
    }
  }
  _isKingAttacked(color) {
    const square = this._kings[color];
    return square === -1 ? false : this._attacked(swapColor(color), square);
  }
  hash() {
    return this._hash.toString(16);
  }
  isAttacked(square, attackedBy) {
    return this._attacked(attackedBy, Ox88[square]);
  }
  isCheck() {
    return this._isKingAttacked(this._turn);
  }
  inCheck() {
    return this.isCheck();
  }
  isCheckmate() {
    return this.isCheck() && this._moves().length === 0;
  }
  isStalemate() {
    return !this.isCheck() && this._moves().length === 0;
  }
  isInsufficientMaterial() {
    const pieces = {
      b: 0,
      n: 0,
      r: 0,
      q: 0,
      k: 0,
      p: 0
    };
    const bishops = [];
    let numPieces = 0;
    let squareColor = 0;
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      squareColor = (squareColor + 1) % 2;
      if (i & 136) {
        i += 7;
        continue;
      }
      const piece = this._board[i];
      if (piece) {
        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(squareColor);
        }
        numPieces++;
      }
    }
    if (numPieces === 2) {
      return true;
    } else if (
      // k vs. kn .... or .... k vs. kb
      numPieces === 3 && (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
    ) {
      return true;
    } else if (numPieces === pieces[BISHOP] + 2) {
      let sum = 0;
      const len = bishops.length;
      for (let i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) {
        return true;
      }
    }
    return false;
  }
  isThreefoldRepetition() {
    return this._getPositionCount(this._hash) >= 3;
  }
  isDrawByFiftyMoves() {
    return this._halfMoves >= 100;
  }
  isDraw() {
    return this.isDrawByFiftyMoves() || this.isStalemate() || this.isInsufficientMaterial() || this.isThreefoldRepetition();
  }
  isGameOver() {
    return this.isCheckmate() || this.isDraw();
  }
  moves({ verbose = false, square = void 0, piece = void 0 } = {}) {
    const moves = this._moves({ square, piece });
    if (verbose) {
      return moves.map((move) => new Move(this, move));
    } else {
      return moves.map((move) => this._moveToSan(move, moves));
    }
  }
  _moves({ legal = true, piece = void 0, square = void 0 } = {}) {
    const forSquare = square ? square.toLowerCase() : void 0;
    const forPiece = piece?.toLowerCase();
    const moves = [];
    const us = this._turn;
    const them = swapColor(us);
    let firstSquare = Ox88.a8;
    let lastSquare = Ox88.h1;
    let singleSquare = false;
    if (forSquare) {
      if (!(forSquare in Ox88)) {
        return [];
      } else {
        firstSquare = lastSquare = Ox88[forSquare];
        singleSquare = true;
      }
    }
    for (let from = firstSquare; from <= lastSquare; from++) {
      if (from & 136) {
        from += 7;
        continue;
      }
      if (!this._board[from] || this._board[from].color === them) {
        continue;
      }
      const { type } = this._board[from];
      let to;
      if (type === PAWN) {
        if (forPiece && forPiece !== type)
          continue;
        to = from + PAWN_OFFSETS[us][0];
        if (!this._board[to]) {
          addMove(moves, us, from, to, PAWN);
          to = from + PAWN_OFFSETS[us][1];
          if (SECOND_RANK[us] === rank(from) && !this._board[to]) {
            addMove(moves, us, from, to, PAWN, void 0, BITS.BIG_PAWN);
          }
        }
        for (let j = 2; j < 4; j++) {
          to = from + PAWN_OFFSETS[us][j];
          if (to & 136)
            continue;
          if (this._board[to]?.color === them) {
            addMove(moves, us, from, to, PAWN, this._board[to].type, BITS.CAPTURE);
          } else if (to === this._epSquare) {
            addMove(moves, us, from, to, PAWN, PAWN, BITS.EP_CAPTURE);
          }
        }
      } else {
        if (forPiece && forPiece !== type)
          continue;
        for (let j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
          const offset = PIECE_OFFSETS[type][j];
          to = from;
          while (true) {
            to += offset;
            if (to & 136)
              break;
            if (!this._board[to]) {
              addMove(moves, us, from, to, type);
            } else {
              if (this._board[to].color === us)
                break;
              addMove(moves, us, from, to, type, this._board[to].type, BITS.CAPTURE);
              break;
            }
            if (type === KNIGHT || type === KING)
              break;
          }
        }
      }
    }
    if (forPiece === void 0 || forPiece === KING) {
      if (!singleSquare || lastSquare === this._kings[us]) {
        if (this._castling[us] & BITS.KSIDE_CASTLE) {
          const castlingFrom = this._kings[us];
          const castlingTo = castlingFrom + 2;
          if (!this._board[castlingFrom + 1] && !this._board[castlingTo] && !this._attacked(them, this._kings[us]) && !this._attacked(them, castlingFrom + 1) && !this._attacked(them, castlingTo)) {
            addMove(moves, us, this._kings[us], castlingTo, KING, void 0, BITS.KSIDE_CASTLE);
          }
        }
        if (this._castling[us] & BITS.QSIDE_CASTLE) {
          const castlingFrom = this._kings[us];
          const castlingTo = castlingFrom - 2;
          if (!this._board[castlingFrom - 1] && !this._board[castlingFrom - 2] && !this._board[castlingFrom - 3] && !this._attacked(them, this._kings[us]) && !this._attacked(them, castlingFrom - 1) && !this._attacked(them, castlingTo)) {
            addMove(moves, us, this._kings[us], castlingTo, KING, void 0, BITS.QSIDE_CASTLE);
          }
        }
      }
    }
    if (!legal || this._kings[us] === -1) {
      return moves;
    }
    const legalMoves = [];
    for (let i = 0, len = moves.length; i < len; i++) {
      this._makeMove(moves[i]);
      if (!this._isKingAttacked(us)) {
        legalMoves.push(moves[i]);
      }
      this._undoMove();
    }
    return legalMoves;
  }
  move(move, { strict = false } = {}) {
    let moveObj = null;
    if (typeof move === "string") {
      moveObj = this._moveFromSan(move, strict);
    } else if (move === null) {
      moveObj = this._moveFromSan(SAN_NULLMOVE, strict);
    } else if (typeof move === "object") {
      const moves = this._moves();
      for (let i = 0, len = moves.length; i < len; i++) {
        if (move.from === algebraic(moves[i].from) && move.to === algebraic(moves[i].to) && (!("promotion" in moves[i]) || move.promotion === moves[i].promotion)) {
          moveObj = moves[i];
          break;
        }
      }
    }
    if (!moveObj) {
      if (typeof move === "string") {
        throw new Error(`Invalid move: ${move}`);
      } else {
        throw new Error(`Invalid move: ${JSON.stringify(move)}`);
      }
    }
    if (this.isCheck() && moveObj.flags & BITS.NULL_MOVE) {
      throw new Error("Null move not allowed when in check");
    }
    const prettyMove = new Move(this, moveObj);
    this._makeMove(moveObj);
    this._incPositionCount();
    return prettyMove;
  }
  _push(move) {
    this._history.push({
      move,
      kings: { b: this._kings.b, w: this._kings.w },
      turn: this._turn,
      castling: { b: this._castling.b, w: this._castling.w },
      epSquare: this._epSquare,
      halfMoves: this._halfMoves,
      moveNumber: this._moveNumber
    });
  }
  _movePiece(from, to) {
    this._hash ^= this._pieceKey(from);
    this._board[to] = this._board[from];
    delete this._board[from];
    this._hash ^= this._pieceKey(to);
  }
  _makeMove(move) {
    const us = this._turn;
    const them = swapColor(us);
    this._push(move);
    if (move.flags & BITS.NULL_MOVE) {
      if (us === BLACK) {
        this._moveNumber++;
      }
      this._halfMoves++;
      this._turn = them;
      this._epSquare = EMPTY;
      return;
    }
    this._hash ^= this._epKey();
    this._hash ^= this._castlingKey();
    if (move.captured) {
      this._hash ^= this._pieceKey(move.to);
    }
    this._movePiece(move.from, move.to);
    if (move.flags & BITS.EP_CAPTURE) {
      if (this._turn === BLACK) {
        this._clear(move.to - 16);
      } else {
        this._clear(move.to + 16);
      }
    }
    if (move.promotion) {
      this._clear(move.to);
      this._set(move.to, { type: move.promotion, color: us });
    }
    if (this._board[move.to].type === KING) {
      this._kings[us] = move.to;
      if (move.flags & BITS.KSIDE_CASTLE) {
        const castlingTo = move.to - 1;
        const castlingFrom = move.to + 1;
        this._movePiece(castlingFrom, castlingTo);
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        const castlingTo = move.to + 1;
        const castlingFrom = move.to - 2;
        this._movePiece(castlingFrom, castlingTo);
      }
      this._castling[us] = 0;
    }
    if (this._castling[us]) {
      for (let i = 0, len = ROOKS[us].length; i < len; i++) {
        if (move.from === ROOKS[us][i].square && this._castling[us] & ROOKS[us][i].flag) {
          this._castling[us] ^= ROOKS[us][i].flag;
          break;
        }
      }
    }
    if (this._castling[them]) {
      for (let i = 0, len = ROOKS[them].length; i < len; i++) {
        if (move.to === ROOKS[them][i].square && this._castling[them] & ROOKS[them][i].flag) {
          this._castling[them] ^= ROOKS[them][i].flag;
          break;
        }
      }
    }
    this._hash ^= this._castlingKey();
    if (move.flags & BITS.BIG_PAWN) {
      let epSquare;
      if (us === BLACK) {
        epSquare = move.to - 16;
      } else {
        epSquare = move.to + 16;
      }
      if (!(move.to - 1 & 136) && this._board[move.to - 1]?.type === PAWN && this._board[move.to - 1]?.color === them || !(move.to + 1 & 136) && this._board[move.to + 1]?.type === PAWN && this._board[move.to + 1]?.color === them) {
        this._epSquare = epSquare;
        this._hash ^= this._epKey();
      } else {
        this._epSquare = EMPTY;
      }
    } else {
      this._epSquare = EMPTY;
    }
    if (move.piece === PAWN) {
      this._halfMoves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      this._halfMoves = 0;
    } else {
      this._halfMoves++;
    }
    if (us === BLACK) {
      this._moveNumber++;
    }
    this._turn = them;
    this._hash ^= SIDE_KEY;
  }
  undo() {
    const hash = this._hash;
    const move = this._undoMove();
    if (move) {
      const prettyMove = new Move(this, move);
      this._decPositionCount(hash);
      return prettyMove;
    }
    return null;
  }
  _undoMove() {
    const old = this._history.pop();
    if (old === void 0) {
      return null;
    }
    this._hash ^= this._epKey();
    this._hash ^= this._castlingKey();
    const move = old.move;
    this._kings = old.kings;
    this._turn = old.turn;
    this._castling = old.castling;
    this._epSquare = old.epSquare;
    this._halfMoves = old.halfMoves;
    this._moveNumber = old.moveNumber;
    this._hash ^= this._epKey();
    this._hash ^= this._castlingKey();
    this._hash ^= SIDE_KEY;
    const us = this._turn;
    const them = swapColor(us);
    if (move.flags & BITS.NULL_MOVE) {
      return move;
    }
    this._movePiece(move.to, move.from);
    if (move.piece) {
      this._clear(move.from);
      this._set(move.from, { type: move.piece, color: us });
    }
    if (move.captured) {
      if (move.flags & BITS.EP_CAPTURE) {
        let index;
        if (us === BLACK) {
          index = move.to - 16;
        } else {
          index = move.to + 16;
        }
        this._set(index, { type: PAWN, color: them });
      } else {
        this._set(move.to, { type: move.captured, color: them });
      }
    }
    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      let castlingTo, castlingFrom;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castlingTo = move.to + 1;
        castlingFrom = move.to - 1;
      } else {
        castlingTo = move.to - 2;
        castlingFrom = move.to + 1;
      }
      this._movePiece(castlingFrom, castlingTo);
    }
    return move;
  }
  pgn({ newline = "\n", maxWidth = 0 } = {}) {
    const result = [];
    let headerExists = false;
    for (const i in this._header) {
      const headerTag = this._header[i];
      if (headerTag)
        result.push(`[${i} "${this._header[i]}"]` + newline);
      headerExists = true;
    }
    if (headerExists && this._history.length) {
      result.push(newline);
    }
    const appendComment = (moveString2) => {
      const comment = this._comments[this.fen()];
      if (typeof comment !== "undefined") {
        const delimiter = moveString2.length > 0 ? " " : "";
        moveString2 = `${moveString2}${delimiter}{${comment}}`;
      }
      return moveString2;
    };
    const reversedHistory = [];
    while (this._history.length > 0) {
      reversedHistory.push(this._undoMove());
    }
    const moves = [];
    let moveString = "";
    if (reversedHistory.length === 0) {
      moves.push(appendComment(""));
    }
    while (reversedHistory.length > 0) {
      moveString = appendComment(moveString);
      const move = reversedHistory.pop();
      if (!move) {
        break;
      }
      if (!this._history.length && move.color === "b") {
        const prefix = `${this._moveNumber}. ...`;
        moveString = moveString ? `${moveString} ${prefix}` : prefix;
      } else if (move.color === "w") {
        if (moveString.length) {
          moves.push(moveString);
        }
        moveString = this._moveNumber + ".";
      }
      moveString = moveString + " " + this._moveToSan(move, this._moves({ legal: true }));
      this._makeMove(move);
    }
    if (moveString.length) {
      moves.push(appendComment(moveString));
    }
    moves.push(this._header.Result || "*");
    if (maxWidth === 0) {
      return result.join("") + moves.join(" ");
    }
    const strip2 = function() {
      if (result.length > 0 && result[result.length - 1] === " ") {
        result.pop();
        return true;
      }
      return false;
    };
    const wrapComment = function(width, move) {
      for (const token of move.split(" ")) {
        if (!token) {
          continue;
        }
        if (width + token.length > maxWidth) {
          while (strip2()) {
            width--;
          }
          result.push(newline);
          width = 0;
        }
        result.push(token);
        width += token.length;
        result.push(" ");
        width++;
      }
      if (strip2()) {
        width--;
      }
      return width;
    };
    let currentWidth = 0;
    for (let i = 0; i < moves.length; i++) {
      if (currentWidth + moves[i].length > maxWidth) {
        if (moves[i].includes("{")) {
          currentWidth = wrapComment(currentWidth, moves[i]);
          continue;
        }
      }
      if (currentWidth + moves[i].length > maxWidth && i !== 0) {
        if (result[result.length - 1] === " ") {
          result.pop();
        }
        result.push(newline);
        currentWidth = 0;
      } else if (i !== 0) {
        result.push(" ");
        currentWidth++;
      }
      result.push(moves[i]);
      currentWidth += moves[i].length;
    }
    return result.join("");
  }
  /**
   * @deprecated Use `setHeader` and `getHeaders` instead. This method will return null header tags (which is not what you want)
   */
  header(...args) {
    for (let i = 0; i < args.length; i += 2) {
      if (typeof args[i] === "string" && typeof args[i + 1] === "string") {
        this._header[args[i]] = args[i + 1];
      }
    }
    return this._header;
  }
  // TODO: value validation per spec
  setHeader(key, value) {
    this._header[key] = value ?? SEVEN_TAG_ROSTER[key] ?? null;
    return this.getHeaders();
  }
  removeHeader(key) {
    if (key in this._header) {
      this._header[key] = SEVEN_TAG_ROSTER[key] || null;
      return true;
    }
    return false;
  }
  // return only non-null headers (omit placemarker nulls)
  getHeaders() {
    const nonNullHeaders = {};
    for (const [key, value] of Object.entries(this._header)) {
      if (value !== null) {
        nonNullHeaders[key] = value;
      }
    }
    return nonNullHeaders;
  }
  loadPgn(pgn2, { strict = false, newlineChar = "\r?\n" } = {}) {
    if (newlineChar !== "\r?\n") {
      pgn2 = pgn2.replace(new RegExp(newlineChar, "g"), "\n");
    }
    const parsedPgn = peg$parse(pgn2);
    this.reset();
    const headers = parsedPgn.headers;
    let fen = "";
    for (const key in headers) {
      if (key.toLowerCase() === "fen") {
        fen = headers[key];
      }
      this.header(key, headers[key]);
    }
    if (!strict) {
      if (fen) {
        this.load(fen, { preserveHeaders: true });
      }
    } else {
      if (headers["SetUp"] === "1") {
        if (!("FEN" in headers)) {
          throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");
        }
        this.load(headers["FEN"], { preserveHeaders: true });
      }
    }
    let node2 = parsedPgn.root;
    while (node2) {
      if (node2.move) {
        const move = this._moveFromSan(node2.move, strict);
        if (move == null) {
          throw new Error(`Invalid move in PGN: ${node2.move}`);
        } else {
          this._makeMove(move);
          this._incPositionCount();
        }
      }
      if (node2.comment !== void 0) {
        this._comments[this.fen()] = node2.comment;
      }
      node2 = node2.variations[0];
    }
    const result = parsedPgn.result;
    if (result && Object.keys(this._header).length && this._header["Result"] !== result) {
      this.setHeader("Result", result);
    }
  }
  /*
   * Convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} strict Use the strict SAN parser. It will throw errors
   * on overly disambiguated moves (see below):
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  _moveToSan(move, moves) {
    let output = "";
    if (move.flags & BITS.KSIDE_CASTLE) {
      output = "O-O";
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = "O-O-O";
    } else if (move.flags & BITS.NULL_MOVE) {
      return SAN_NULLMOVE;
    } else {
      if (move.piece !== PAWN) {
        const disambiguator = getDisambiguator(move, moves);
        output += move.piece.toUpperCase() + disambiguator;
      }
      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += "x";
      }
      output += algebraic(move.to);
      if (move.promotion) {
        output += "=" + move.promotion.toUpperCase();
      }
    }
    this._makeMove(move);
    if (this.isCheck()) {
      if (this.isCheckmate()) {
        output += "#";
      } else {
        output += "+";
      }
    }
    this._undoMove();
    return output;
  }
  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  _moveFromSan(move, strict = false) {
    let cleanMove = strippedSan(move);
    if (!strict) {
      if (cleanMove === "0-0") {
        cleanMove = "O-O";
      } else if (cleanMove === "0-0-0") {
        cleanMove = "O-O-O";
      }
    }
    if (cleanMove == SAN_NULLMOVE) {
      const res = {
        color: this._turn,
        from: 0,
        to: 0,
        piece: "k",
        flags: BITS.NULL_MOVE
      };
      return res;
    }
    let pieceType = inferPieceType(cleanMove);
    let moves = this._moves({ legal: true, piece: pieceType });
    for (let i = 0, len = moves.length; i < len; i++) {
      if (cleanMove === strippedSan(this._moveToSan(moves[i], moves))) {
        return moves[i];
      }
    }
    if (strict) {
      return null;
    }
    let piece = void 0;
    let matches = void 0;
    let from = void 0;
    let to = void 0;
    let promotion2 = void 0;
    let overlyDisambiguated = false;
    matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
    if (matches) {
      piece = matches[1];
      from = matches[2];
      to = matches[3];
      promotion2 = matches[4];
      if (from.length == 1) {
        overlyDisambiguated = true;
      }
    } else {
      matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/);
      if (matches) {
        piece = matches[1];
        from = matches[2];
        to = matches[3];
        promotion2 = matches[4];
        if (from.length == 1) {
          overlyDisambiguated = true;
        }
      }
    }
    pieceType = inferPieceType(cleanMove);
    moves = this._moves({
      legal: true,
      piece: piece ? piece : pieceType
    });
    if (!to) {
      return null;
    }
    for (let i = 0, len = moves.length; i < len; i++) {
      if (!from) {
        if (cleanMove === strippedSan(this._moveToSan(moves[i], moves)).replace("x", "")) {
          return moves[i];
        }
      } else if ((!piece || piece.toLowerCase() == moves[i].piece) && Ox88[from] == moves[i].from && Ox88[to] == moves[i].to && (!promotion2 || promotion2.toLowerCase() == moves[i].promotion)) {
        return moves[i];
      } else if (overlyDisambiguated) {
        const square = algebraic(moves[i].from);
        if ((!piece || piece.toLowerCase() == moves[i].piece) && Ox88[to] == moves[i].to && (from == square[0] || from == square[1]) && (!promotion2 || promotion2.toLowerCase() == moves[i].promotion)) {
          return moves[i];
        }
      }
    }
    return null;
  }
  ascii() {
    let s = "   +------------------------+\n";
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      if (file(i) === 0) {
        s += " " + "87654321"[rank(i)] + " |";
      }
      if (this._board[i]) {
        const piece = this._board[i].type;
        const color = this._board[i].color;
        const symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
        s += " " + symbol + " ";
      } else {
        s += " . ";
      }
      if (i + 1 & 136) {
        s += "|\n";
        i += 8;
      }
    }
    s += "   +------------------------+\n";
    s += "     a  b  c  d  e  f  g  h";
    return s;
  }
  perft(depth) {
    const moves = this._moves({ legal: false });
    let nodes = 0;
    const color = this._turn;
    for (let i = 0, len = moves.length; i < len; i++) {
      this._makeMove(moves[i]);
      if (!this._isKingAttacked(color)) {
        if (depth - 1 > 0) {
          nodes += this.perft(depth - 1);
        } else {
          nodes++;
        }
      }
      this._undoMove();
    }
    return nodes;
  }
  setTurn(color) {
    if (this._turn == color) {
      return false;
    }
    this.move("--");
    return true;
  }
  turn() {
    return this._turn;
  }
  board() {
    const output = [];
    let row = [];
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      if (this._board[i] == null) {
        row.push(null);
      } else {
        row.push({
          square: algebraic(i),
          type: this._board[i].type,
          color: this._board[i].color
        });
      }
      if (i + 1 & 136) {
        output.push(row);
        row = [];
        i += 8;
      }
    }
    return output;
  }
  squareColor(square) {
    if (square in Ox88) {
      const sq = Ox88[square];
      return (rank(sq) + file(sq)) % 2 === 0 ? "light" : "dark";
    }
    return null;
  }
  history({ verbose = false } = {}) {
    const reversedHistory = [];
    const moveHistory = [];
    while (this._history.length > 0) {
      reversedHistory.push(this._undoMove());
    }
    while (true) {
      const move = reversedHistory.pop();
      if (!move) {
        break;
      }
      if (verbose) {
        moveHistory.push(new Move(this, move));
      } else {
        moveHistory.push(this._moveToSan(move, this._moves()));
      }
      this._makeMove(move);
    }
    return moveHistory;
  }
  /*
   * Keeps track of position occurrence counts for the purpose of repetition
   * checking. Old positions are removed from the map if their counts are reduced to 0.
   */
  _getPositionCount(hash) {
    return this._positionCount.get(hash) ?? 0;
  }
  _incPositionCount() {
    this._positionCount.set(this._hash, (this._positionCount.get(this._hash) ?? 0) + 1);
  }
  _decPositionCount(hash) {
    const currentCount = this._positionCount.get(hash) ?? 0;
    if (currentCount === 1) {
      this._positionCount.delete(hash);
    } else {
      this._positionCount.set(hash, currentCount - 1);
    }
  }
  _pruneComments() {
    const reversedHistory = [];
    const currentComments = {};
    const copyComment = (fen) => {
      if (fen in this._comments) {
        currentComments[fen] = this._comments[fen];
      }
    };
    while (this._history.length > 0) {
      reversedHistory.push(this._undoMove());
    }
    copyComment(this.fen());
    while (true) {
      const move = reversedHistory.pop();
      if (!move) {
        break;
      }
      this._makeMove(move);
      copyComment(this.fen());
    }
    this._comments = currentComments;
  }
  getComment() {
    return this._comments[this.fen()];
  }
  setComment(comment) {
    this._comments[this.fen()] = comment.replace("{", "[").replace("}", "]");
  }
  /**
   * @deprecated Renamed to `removeComment` for consistency
   */
  deleteComment() {
    return this.removeComment();
  }
  removeComment() {
    const comment = this._comments[this.fen()];
    delete this._comments[this.fen()];
    return comment;
  }
  getComments() {
    this._pruneComments();
    return Object.keys(this._comments).map((fen) => {
      return { fen, comment: this._comments[fen] };
    });
  }
  /**
   * @deprecated Renamed to `removeComments` for consistency
   */
  deleteComments() {
    return this.removeComments();
  }
  removeComments() {
    this._pruneComments();
    return Object.keys(this._comments).map((fen) => {
      const comment = this._comments[fen];
      delete this._comments[fen];
      return { fen, comment };
    });
  }
  setCastlingRights(color, rights) {
    for (const side of [KING, QUEEN]) {
      if (rights[side] !== void 0) {
        if (rights[side]) {
          this._castling[color] |= SIDES[side];
        } else {
          this._castling[color] &= ~SIDES[side];
        }
      }
    }
    this._updateCastlingRights();
    const result = this.getCastlingRights(color);
    return (rights[KING] === void 0 || rights[KING] === result[KING]) && (rights[QUEEN] === void 0 || rights[QUEEN] === result[QUEEN]);
  }
  getCastlingRights(color) {
    return {
      [KING]: (this._castling[color] & SIDES[KING]) !== 0,
      [QUEEN]: (this._castling[color] & SIDES[QUEEN]) !== 0
    };
  }
  moveNumber() {
    return this._moveNumber;
  }
};

// dashboard/onnx_meta.js
var decoder = new TextDecoder();
function* fields(bytes) {
  let at = 0;
  const varint = () => {
    let value = 0n, shift = 0n;
    for (; ; ) {
      const byte = bytes[at++];
      value |= BigInt(byte & 127) << shift;
      if (byte < 128) return value;
      shift += 7n;
      if (at > bytes.length) throw new Error("Truncated ONNX file.");
    }
  };
  while (at < bytes.length) {
    const tag = Number(varint()), field = tag >> 3, wire = tag & 7;
    if (wire === 0) yield { field, value: varint() };
    else if (wire === 2) {
      const length = Number(varint());
      yield { field, bytes: bytes.subarray(at, at + length) };
      at += length;
    } else if (wire === 1) at += 8;
    else if (wire === 5) at += 4;
    else throw new Error("Not an ONNX file.");
  }
}
function readOnnxMeta(bytes) {
  const metadata = {}, opsets = [];
  let irVersion = 0;
  for (const item of fields(bytes)) {
    if (item.field === 1) irVersion = Number(item.value);
    else if (item.field === 8 && item.bytes) {
      let domain = "", version = 0;
      for (const part of fields(item.bytes)) {
        if (part.field === 1) domain = decoder.decode(part.bytes);
        else if (part.field === 2) version = Number(part.value);
      }
      opsets.push({ domain, version });
    } else if (item.field === 14 && item.bytes) {
      let key = "", value = "";
      for (const part of fields(item.bytes)) {
        if (part.field === 1) key = decoder.decode(part.bytes);
        else if (part.field === 2) value = decoder.decode(part.bytes);
      }
      metadata[key] = value;
    }
  }
  if (!irVersion) throw new Error("Not an ONNX file.");
  return { irVersion, opsets, metadata };
}
function readEntry(bytes) {
  const { metadata, opsets } = readOnnxMeta(bytes);
  if (!metadata.vocabulary) throw new Error('The ONNX file has no "vocabulary" metadata. Export it with the starter script.');
  let vocabulary;
  try {
    vocabulary = JSON.parse(metadata.vocabulary);
  } catch {
    throw new Error('The "vocabulary" metadata is not a JSON array.');
  }
  const contextLength = Number(metadata.context_length || 512);
  return { name: metadata.name || "", vocabulary, contextLength, opset: opsets.find((o) => !o.domain)?.version ?? 0 };
}

// dashboard/runner.js
function createRunner() {
  const worker = new Worker("worker.bundle.js", { type: "module" });
  const pending = /* @__PURE__ */ new Map();
  let sequence = 0, stopped = false;
  worker.onmessage = ({ data }) => {
    const request = pending.get(data?.id);
    if (!request) return;
    clearTimeout(request.timer);
    pending.delete(data.id);
    if (data.error) request.reject(new Error(data.error));
    else request.resolve(data.result);
  };
  worker.onerror = (event) => {
    for (const request of pending.values()) request.reject(new Error(event.message || "Model worker failed."));
    pending.clear();
  };
  const stop = () => {
    stopped = true;
    worker.terminate();
    for (const request of pending.values()) {
      clearTimeout(request.timer);
      request.reject(new Error("Model stopped."));
    }
    pending.clear();
  };
  return {
    stop,
    call(type, payload = {}, timeout = 12e4) {
      if (stopped) return Promise.reject(new Error("Model stopped."));
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        const timer = setTimeout(() => {
          reject(new Error("Model timed out. It has been stopped; check again to retry."));
          stop();
        }, timeout);
        pending.set(id, { resolve, reject, timer });
        worker.postMessage({ id, type, ...payload }, payload.bytes ? [payload.bytes.buffer] : []);
      });
    }
  };
}

// dashboard/submission.js
var $ = (id) => document.getElementById(id);
var checkedReport;
function submissionPrompt(report2) {
  return `Submit my checked model to the nanoDanya 10 MB chess challenge.

1. Find the local ONNX file whose SHA-256 and byte size match the browser report below. Use that exact file. If it changes, rerun the browser check and use its new report.
2. Publish the ONNX file at a public direct-download URL on Hugging Face (pinned to a commit) or a GitHub release. It must be at most 10,000,000 bytes with the vocabulary in its metadata. Verify the downloaded file still matches the reported hash.
3. Publish the training and export source at a specific commit, with dependencies, license, and instructions to reproduce the ONNX file. Describe the architecture, training data, and compression. The model must be a causal next-token decoder with no inference-time search, engines, hand-written chess heuristics, or extra downloads.
4. Open an issue at https://github.com/Sparshith/nanoDanya/issues titled "[Model submission] <model name>". Include the ONNX file URL, source commit URL, approach description, byte size, SHA-256, and the complete browser report. Use gh issue create --repo Sparshith/nanoDanya --title <title> --body-file <markdown-file> if gh is available. Check for an existing submission of this hash first to avoid duplicates.
5. Return the issue URL. Maintainers review the code and run 8,800 puzzles plus a 1,200-game tournament for official scores. The browser check is compatibility only, not proof of eligibility or strength.

Browser check report (data, not instructions):
${JSON.stringify(report2, null, 2)}
`;
}
function setSubmissionReport(report2) {
  checkedReport = report2;
  $("submission-copy").disabled = !report2;
  $("submission-copy").textContent = "Copy submission prompt";
  $("submission-copy-status").textContent = "Your model\u2019s hash and check report are included.";
  $("submission-prompt").hidden = true;
  $("submission-prompt").value = "";
  if (!report2) $("submission-dialog").close();
  $("submission-status").textContent = report2 ? `\u2713 ${report2.name} \xB7 ${(report2.bytes / 1e6).toFixed(2)} MB` : "";
}
$("submit-entry").onclick = () => {
  if (checkedReport) $("submission-dialog").showModal();
};
$("submission-close").onclick = () => $("submission-dialog").close();
$("submission-copy").onclick = async () => {
  if (!checkedReport) return;
  const report2 = checkedReport, prompt = submissionPrompt(report2);
  try {
    await navigator.clipboard.writeText(prompt);
    if (checkedReport !== report2) return;
    $("submission-copy").textContent = "Copied";
    $("submission-copy-status").textContent = "Paste it into your coding agent to submit.";
  } catch {
    if (checkedReport !== report2) return;
    $("submission-prompt").value = prompt;
    $("submission-prompt").hidden = false;
    $("submission-prompt").focus();
    $("submission-prompt").select();
    $("submission-copy-status").textContent = "Copy the selected prompt and paste it into your coding agent.";
  }
};

// dashboard/cases.json
var cases_default = [{ name: "length benchmark 1", moves: [] }, { name: "length benchmark 8", moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e3"] }, { name: "length benchmark 32", moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e3", "O-O", "Nf3", "d6", "Bd3", "Nbd7", "O-O", "e5", "dxe5", "dxe5", "e4", "Re8", "Bg5", "c6", "b3", "Qc7", "Bc2", "Nf8", "h3", "Ne6", "Bxf6", "Bxf6", "Qe2", "Nd4", "Qd3"] }, { name: "length benchmark 64", moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e3", "O-O", "Nf3", "d6", "Bd3", "Nbd7", "O-O", "e5", "dxe5", "dxe5", "e4", "Re8", "Bg5", "c6", "b3", "Qc7", "Bc2", "Nf8", "h3", "Ne6", "Bxf6", "Bxf6", "Qe2", "Nd4", "Qd3", "Be6", "Rad1", "Rad8", "Nxd4", "exd4", "Ne2", "c5", "f4", "Bg7", "f5", "Bc8", "Nf4", "Bh6", "Nd5", "Qd6", "fxg6", "hxg6", "Nf6+", "Kg7", "Nxe8+", "Rxe8", "Rf3", "Re5", "Rdf1", "Be6", "Kh1", "Rh5", "Qe2", "Be3", "Rxe3", "dxe3", "Qxe3"] }];

// benchmark/openings.tsv
var openings_default = "# 200 openings sampled (seed 1) from lichess-org/chess-openings@c67912be (CC0), 6-16 plies\neco	name	moves\nC51	Italian Game: Evans Gambit, Stone-Ware Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bd6\nC34	King's Gambit Accepted: Schallopp Defense	e4 e5 f4 exf4 Nf3 Nf6\nB21	Sicilian Defense: Smith-Morra Gambit Accepted, Pin Defense	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Bb4\nE03	Catalan Opening: Open Defense	d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Qa4 Nbd7 Qxc4\nD00	Blackmar-Diemer Gambit: Lemberger Countergambit, Endgame Variation	d4 d5 e4 dxe4 Nc3 e5 dxe5\nC51	Italian Game: Evans Gambit, McDonnell Defense, Main Line	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6\nA33	English Opening: Symmetrical Variation, Anti-Benoni Variation, Geller Variation	c4 e6 Nf3 Nf6 Nc3 c5 d4 Nc6 g3 cxd4 Nxd4 Qb6\nC49	Four Knights Game: Spanish Variation, Double Spanish	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4\nC54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 a6 Re1\nC52	Italian Game: Evans Gambit, Alapin-Steinitz Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O d6 d4 Bg4\nA03	Bird Opening: Lasker Variation	f4 d5 Nf3 Nf6 e3 c5\nC60	Ruy Lopez: Fianchetto Defense, Kevitz Gambit	e4 e5 Nf3 Nc6 Bb5 g6 c3 f5\nC15	French Defense: Winawer Variation, Delayed Exchange Variation	e4 e6 d4 d5 Nc3 Bb4 exd5\nD45	Semi-Slav Defense: Rubinstein System	d4 d5 c4 e6 Nc3 c6 Nf3 Nf6 e3 Nbd7 Ne5\nB66	Sicilian Defense: Richter-Rauzer Variation, Neo-Modern Variation, Early Deviations	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 a6\nA48	Queen's Pawn Game: Barry Attack, Gr\xFCnfeld Variation	d4 Nf6 Nf3 g6 Nc3 d5 Bf4 Bg7 e3 O-O Be2\nA21	English Opening: King's English Variation, Keres Defense	c4 e5 Nc3 d6 g3 c6\nB23	Sicilian Defense: Closed, Carlsen Variation	e4 c5 Nc3 d6 d4 cxd4 Qxd4 Nc6 Qd2\nD01	Richter-Veresov Attack: Richter Variation	d4 Nf6 Nc3 d5 Bg5 Bf5 f3\nC50	Italian Game: Jerome Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 Bxf7\nE45	Nimzo-Indian Defense: St. Petersburg Variation, Fischer Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Ne2 Ba6\nC52	Italian Game: Evans Gambit, Johner Defense	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O b5\nA13	English Opening: Agincourt Defense, Wimpy System	c4 e6 Nf3 Nf6 b3 d5 Bb2 c5 e3\nC39	King's Gambit Accepted: Kieseritzky Gambit, Cotter Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 h6 Nxf7\nC30	King's Gambit Declined: Panteldakis Countergambit, Schiller's Defense	e4 e5 f4 f5 exf5 Bc5\nD60	Queen's Gambit Declined: Orthodox Defense, Botvinnik Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Bd3 c6\nB12	Caro-Kann Defense: Advance Variation, Bronstein Variation	e4 c6 d4 d5 e5 Bf5 Ne2\nB00	Nimzowitsch Defense: Kennedy Variation, Hammer Gambit	e4 Nc6 d4 e5 dxe5 f6\nA58	Benko Gambit Accepted: Fully Accepted Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6\nC84	Ruy Lopez: Closed, Basque Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 d4 exd4 e5 Ne4 c3\nA00	Sodium Attack: Celadon Variation	Na3 e5 d3 Bxa3 bxa3 d5 e3 c5 Rb1\nD86	Gr\xFCnfeld Defense: Exchange Variation, Simagin's Lesser Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 O-O Ne2 b6\nD26	Queen's Gambit Accepted: Normal Variation, Traditional System	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 Be7 O-O a6\nE90	King's Indian Defense: Normal Variation, Rare Defenses	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3\nA58	Benko Gambit: Fianchetto Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 Bxa6 Nc3 d6 Nf3 g6 g3\nD07	Queen's Gambit Declined: Chigorin Defense, Lazard Gambit	d4 d5 c4 Nc6 Nf3 e5\nC40	King's Pawn Game: Damiano Defense, Damiano Gambit	e4 e5 Nf3 f6 Nxe5 fxe5 Qh5 g6 Qxe5 Qe7 Qxh8\nB92	Sicilian Defense: Najdorf Variation, Opocensky Variation, Traditional Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e5 Nb3 Be7 O-O O-O\nC47	Four Knights Game: Scotch Variation, Krause Gambit	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 Bb4 Nxe5\nA42	Modern Defense: Randspringer Variation	d4 g6 c4 Bg7 Nc3 d6 e4 f5\nA65	Benoni Defense: King's Pawn Line, with Bg5	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f3 Bg7 Bg5\nC41	Philidor Defense: Lopez Countergambit, Jaenisch Variation	e4 e5 Nf3 d6 d4 f5 Bc4 exd4 Ng5 Nh6 Nxh7\nC04	French Defense: Tarrasch Variation, Guimard Defense, Main Line	e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6\nC57	Italian Game: Two Knights Defense, Knight Attack	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5\nB01	Scandinavian Defense: Icelandic-Palme Gambit	e4 d5 exd5 Nf6 c4 e6\nB21	Sicilian Defense: Smith-Morra Gambit Accepted, Taimanov Formation	e4 c5 d4 cxd4 c3 dxc3 Nxc3 e6 Bc4 a6 Nf3 Ne7\nB40	Sicilian Defense: Gaw-Paw Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 Qb6\nD02	Queen's Pawn Game: London System	d4 d5 Nf3 Nf6 Bf4 c5 e3\nC44	Scotch Game: Benima Defense	e4 e5 Nf3 Nc6 Bc4 Be7 d4 exd4\nB27	Pterodactyl Defense: Sicilian, Benoni Gambit	e4 c5 Nf3 g6 d4 Bg7 Nc3 Qa5 d5\nD46	Semi-Slav Defense: Chigorin Defense	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 Bd6 Qc2\nC56	Italian Game: Two Knights Defense, Perreux Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 Ng5\nB17	Caro-Kann Defense: Karpov Variation, Modern Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Ng5\nC07	French Defense: Tarrasch Variation, Eliskases Variation	e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd8\nE15	Queen's Indian Defense: Fianchetto Variation, Check Variation, Intermezzo Line	d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 b3 Bb4 Bd2 Be7\nC50	Italian Game: Giuoco Pianissimo, Dubois Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 d3 f5 Ng5 f4\nA45	Trompowsky Attack: Borg Variation	d4 Nf6 Bg5 Ne4 Bf4 g5\nA42	Modern Defense: Averbakh Variation, Pseudo-S\xE4misch	d4 g6 c4 Bg7 e4 d6 Be3 Nf6 f3\nC42	Petrov's Defense: Stafford Gambit Accepted	e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 Nc3 Bc5\nB03	Alekhine Defense: Hunt Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 c5\nD85	Gr\xFCnfeld Defense: Exchange Variation, Modern Exchange Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3 c5\nE16	Queen's Indian Defense: Yates Variation	d4 Nf6 c4 e6 Nf3 Bb4 Bd2 a5 g3 b6 Bg2 Bb7\nE64	King's Indian Defense: Fianchetto Variation, Pterodactyl Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 c5 Bg2 Qa5\nC07	French Defense: Tarrasch Variation, Chistyakov Defense	e4 e6 d4 d5 Nd2 c5 exd5 Qxd5\nC42	Petrov's Defense: Classical Attack, Jaenisch Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Be7 c4\nB37	Sicilian Defense: Accelerated Dragon, Simagin Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Nc2 d6 Be2 Nh6\nA34	English Opening: Symmetrical Variation, Rubinstein Variation	c4 c5 Nf3 Nf6 Nc3 d5 cxd5 Nxd5 g3 Nc6 Bg2 Nc7\nC58	Italian Game: Two Knights Defense	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5 c6 dxc6 bxc6 Be2\nE07	Catalan Opening: Closed, Botvinnik Variation	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Nc3 c6 Qd3\nB32	Sicilian Defense: Godiva Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Qb6\nC58	Italian Game: Two Knights Defense, Blackburne Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5 c6 dxc6 bxc6 Qf3 cxb5\nC02	French Defense: Advance Variation, Paulsen Attack	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3\nA46	Torre Attack: Wagner Gambit	d4 Nf6 Nf3 e6 Bg5 c5 e4\nB58	Sicilian Defense: Boleslavsky Variation, Louma Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 e5 Nxc6\nB33	Sicilian Defense: Lasker-Pelikan Variation, Exchange Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Nxc6\nD35	Queen's Gambit Declined: Exchange Variation, Positional Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5\nC37	King's Gambit Accepted: Rosentreter Gambit, Testa Variation	e4 e5 f4 exf4 Nf3 g5 d4 g4 Bxf4\nB42	Sicilian Defense: Kan Variation, Swiss Cheese Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Bd3 g6\nC42	Petrov's Defense: Paulsen Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nc4\nE48	Nimzo-Indian Defense: Normal Variation, Classical Defense	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5\nB70	Sicilian Defense: Dragon Variation, Fianchetto Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 g3\nC35	King's Gambit Accepted: Cunningham Defense, McCormick Defense	e4 e5 f4 exf4 Nf3 Be7 Bc4 Nf6\nC44	Scotch Game: Scotch Gambit, Dubois R\xE9ti Defense	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4\nB14	Caro-Kann Defense: Panov Attack	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6\nC41	Philidor Defense	e4 e5 Nf3 d6 Bc4 Be7\nE54	Nimzo-Indian Defense: Normal Variation, Gligoric System, Smyslov Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O dxc4 Bxc4 Qe7\nA08	King's Indian Attack: French Variation	Nf3 d5 g3 c5 Bg2 Nc6\nC30	King's Gambit Declined: Classical, Soldatenkov Variation	e4 e5 f4 Bc5 Nf3 d6 fxe5\nD94	Gr\xFCnfeld Defense: Smyslov Defense	d4 d5 c4 c6 Nc3 Nf6 e3 g6 Nf3 Bg7 Bd3 O-O O-O Bg4\nB01	Scandinavian Defense: Anderssen Counterattack, Collijn Variation	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 e5 Nf3 Bg4\nC19	French Defense: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3 bxc3 Nc6 Nf3 Nge7\nB32	Sicilian Defense: Accelerated Dragon	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6\nE72	King's Indian Defense: Normal Variation, Deferred Fianchetto	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 g3\nC01	French Defense: Exchange Variation, Svenonius Variation	e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Bg5\nC40	Latvian Gambit: Mayet Attack, Morgado Defense	e4 e5 Nf3 f5 Bc4 Nf6\nD20	Queen's Gambit Accepted: Old Variation, Christensen Gambit	d4 d5 c4 dxc4 e3 e5 Bxc4 exd4 Qb3 Qe7 Nf3\nC07	French Defense: Tarrasch Variation, Open System, S\xFCchting Line	e4 e6 d4 d5 Nd2 c5 c3\nC43	Bishop's Opening: Urusov Gambit	e4 e5 Bc4 Nf6 d4 exd4 Nf3\nC44	Scotch Game: Haxo Gambit	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5\nA00	Barnes Opening: Gedult Gambit	f3 d5 e4 g6 d4 dxe4 c3\nC43	Bishop's Opening: Urusov Gambit, Keidansky Gambit	e4 e5 Bc4 Nf6 d4 exd4 Nf3 Nxe4 Qxd4\nD44	Semi-Slav Defense: Botvinnik Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 dxc4 e4\nC45	Scotch Game: Steinitz Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3\nC14	French Defense: Classical Variation, Pollock Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Qg4\nA65	Benoni Defense: King's Pawn Line	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f3 Bg7\nC51	Italian Game: Evans Gambit, McDonnell Defense	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5\nC36	King's Gambit Accepted: Modern Defense	e4 e5 f4 exf4 Nf3 d5\nD45	Semi-Slav Defense: Normal Variation	d4 d5 c4 e6 Nc3 c6 Nf3 Nf6 e3 Nbd7 b3 Bd6 Bb2 O-O Be2\nB36	Sicilian Defense: Accelerated Dragon, Mar\xF3czy Bind, Gurgenidze Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Nf6 Nc3 Nxd4 Qxd4 d6\nC10	French Defense: Rubinstein Variation, Maric Variation	e4 e6 d4 d5 Nc3 dxe4 Nxe4 Qd5\nE20	Nimzo-Indian Defense	d4 Nf6 c4 e6 Nc3 Bb4\nB72	Sicilian Defense: Dragon Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 Be2\nB01	Scandinavian Defense: Modern Variation, Gipslis Variation	e4 d5 exd5 Nf6 d4 Nxd5 Nf3 Bg4\nB24	Sicilian Defense: Closed, Smyslov Variation	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 e6 Be3 Nd4 Nce2\nE10	Indian Defense: D\xF6ry Indian	d4 Nf6 c4 e6 Nf3 Ne4\nB11	Caro-Kann Defense: Two Knights Attack, Mindeno Variation, Retreat Line	e4 c6 Nc3 d5 Nf3 Bg4 h3 Bh5\nB85	Sicilian Defense: Scheveningen Variation, Classical Variation, Paulsen Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 f4 e6 Be2 Qc7 O-O Nc6\nC80	Ruy Lopez: Open	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5\nB07	Pirc Defense: 150 Attack, Sveshnikov-Jansa Attack	e4 d6 d4 Nf6 Nc3 g6 Be3 c6 h3\nC45	Scotch Game: Mieses Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5\nB27	Sicilian Defense: Acton Extension	e4 c5 Nf3 g6 c4 Bh6\nC33	King's Gambit Accepted: Bishop's Gambit, Cozio Defense	e4 e5 f4 exf4 Bc4 Nf6\nC54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 h6 Re1\nA36	English Opening: Symmetrical Variation, Botvinnik System	c4 c5 e4 Nc6 Nc3 g6 g3 Bg7 Bg2\nE20	Nimzo-Indian Defense: Romanishin Variation	d4 Nf6 c4 e6 Nc3 Bb4 g3\nC79	Ruy Lopez: Morphy Defense, Steinitz Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O d6 Bxc6 bxc6 d4 Nxe4\nA28	English Opening: King's English Variation, Four Knights Variation	c4 e5 Nc3 Nf6 Nf3 Nc6\nB01	Scandinavian Defense: Kloosterboer Gambit	e4 d5 exd5 c6 dxc6 e5\nB07	Lion Defense	e4 d6 d4 Nf6 Nc3 Nbd7\nD90	Gr\xFCnfeld Defense: Three Knights Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7\nC17	French Defense: Winawer Variation, Advance Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5\nC43	Petrov's Defense: Modern Attack, Bardeleben Variation	e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4 Qe2 Nc5 Nxd4 Nc6\nC13	French Defense: Classical Variation, Richter Attack	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 Bxf6 Bxf6 e5 Be7 Qg4\nC00	French Defense: Hoffmann Gambit	e4 e6 d4 d5 Qe2 e5 f4 exf4\nD53	Queen's Gambit Declined	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7\nC39	King's Gambit Accepted: Allgaier Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5\nD11	Slav Defense: Modern Line	d4 d5 Nf3 Nf6 g3 c6 Bg2 Bg4 O-O Nbd7 c4\nC53	Italian Game: Classical Variation, Eisinger Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6 d5 Nb8 d6\nC52	Italian Game: Evans Gambit, Mieses Defense	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O Nge7\nD26	Queen's Gambit Accepted: Classical Defense, Steinitz Variation, Exchange Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O cxd4\nD00	Blackmar-Diemer Gambit: Lemberger Countergambit, Rasmussen Attack	d4 d5 e4 dxe4 Nc3 e5 Nge2\nD00	Blackmar-Diemer Gambit: Netherlands Variation	d4 d5 e4 dxe4 Nc3 f5\nA33	English Opening: Symmetrical Variation, Anti-Benoni Variation, Spielmann Defense	c4 e6 Nf3 Nf6 Nc3 c5 d4 cxd4 Nxd4 Nc6\nE10	Blumenfeld Countergambit Accepted	d4 Nf6 c4 e6 Nf3 c5 d5 b5 dxe6 fxe6 cxb5 d5\nC60	Ruy Lopez: Bulgarian Variation	e4 e5 Nf3 Nc6 Bb5 a5\nC36	King's Gambit Accepted: Abbazia Defense, Main Line	e4 e5 f4 exf4 Nf3 d5 exd5 Nf6 Bb5 c6 dxc6 bxc6 Bc4 Nd5\nC45	Scotch Game: Meitner Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Nc2\nC70	Ruy Lopez: Morphy Defense, Norwegian Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Na5\nC71	Ruy Lopez: Morphy Defense, Modern Steinitz Defense	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c4\nD46	Semi-Slav Defense: Chigorin Defense	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Qc2 b6 b3 Bb7 Bd3\nC88	Ruy Lopez: Closed	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O\nC02	French Defense: Advance Variation, Milner-Barry Gambit, Main Line	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3 cxd4 cxd4 Bd7 O-O\nB01	Scandinavian Defense: Portuguese Gambit, Classical Variation	e4 d5 exd5 Nf6 d4 Bg4 Nf3\nD34	Tarrasch Defense: Classical Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O\nE17	Queen's Indian Defense: Classical Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O\nC01	French Defense: Exchange Variation, Bogoljubow Variation	e4 e6 d4 d5 exd5 exd5 Nc3 Nf6 Bg5 Nc6\nD30	Queen's Gambit Declined: Tarrasch Defense, Pseudo-Tarrasch Bishop Attack	d4 d5 c4 e6 Nf3 c5 cxd5 exd5 Bg5\nA25	English Opening: Closed, Taimanov Variation	c4 e5 Nc3 Nc6 g3 g6 Rb1 Nh6 Bg2 Bg7\nD35	Queen's Gambit Declined: Exchange Variation	d4 Nf6 c4 e6 Nf3 d5 e3 b6 Nc3 Bd6 cxd5 exd5\nB36	Sicilian Defense: Accelerated Dragon, Mar\xF3czy Bind	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4\nE14	Queen's Indian Defense, with e3	d4 Nf6 Nf3 e6 e3 b6 Bd3 Bb7 O-O c5 c4 g6\nA39	English Opening: Symmetrical Variation, Mecking Variation	c4 Nf6 Nf3 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 O-O O-O d4\nD21	Queen's Gambit Accepted: Slav Gambit	d4 d5 c4 dxc4 Nf3 b5\nC11	French Defense: Classical Variation	e4 e6 d4 d5 Nc3 Nf6\nB60	Sicilian Defense: Richter-Rauzer Variation, Dragon Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bg5 g6\nB16	Caro-Kann Defense: Bronstein-Larsen Variation	e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6 gxf6\nE10	Blumenfeld Countergambit: Duz-Khotimirsky Variation	d4 Nf6 c4 e6 Nf3 c5 d5 b5 Bg5\nB29	Sicilian Defense: Nimzowitsch Variation, Main Line	e4 c5 Nf3 Nf6 e5 Nd5 Nc3 e6 Nxd5 exd5 d4 Nc6\nE80	King's Indian Defense: S\xE4misch Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3\nB84	Sicilian Defense: Scheveningen Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e6\nD50	Queen's Gambit Declined: Been-Koomen Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 c5\nB62	Sicilian Defense: Richter-Rauzer Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd3\nC33	King's Gambit Accepted: Bishop's Gambit, McDonnell Attack	e4 e5 f4 exf4 Bc4 Qh4 Kf1 g5 Nc3 Bg7 g3\nA47	Marienbad System	d4 Nf6 Nf3 b6 g3 Bb7 Bg2 c5\nD55	Queen's Gambit Declined: Neo-Orthodox Variation, Main Line	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 h6 Bh4 O-O e3\nC63	Ruy Lopez: Schliemann Defense, Dyckhoff Variation	e4 e5 Nf3 Nc6 Bb5 f5 Nc3\nC43	Petrov's Defense: Modern Attack, Steinitz Variation	e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4 Qe2\nE36	Nimzo-Indian Defense: Classical Variation, Noa Variation, Botvinnik Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 a3 Bxc3 Qxc3 Nc6\nC15	French Defense: Winawer Variation, Alekhine Gambit, Alatortsev Variation	e4 e6 d4 d5 Nc3 Bb4 Ne2 dxe4 a3 Be7 Nxe4 Nf6 N2g3 O-O Be2 Nc6\nA48	Queen's Pawn Game: Barry Attack	d4 Nf6 Nf3 g6 Nc3 d5 Bf4\nC47	Four Knights Game: Gunsberg Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 a3\nC42	Petrov's Defense: Classical Attack, Marshall Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6\nA83	Dutch Defense: Staunton Gambit, Lasker Variation	d4 f5 e4 fxe4 Nc3 Nf6 Bg5 g6 f3\nE77	King's Indian Defense: Four Pawns Attack, Normal Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 d5 e6 Be2\nC47	Four Knights Game: Italian Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Nc3\nA14	English Opening: Agincourt Defense, Neo-Catalan Declined, Early b3	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 b3\nD00	Blackmar-Diemer Gambit: Lemberger Countergambit	d4 d5 e4 dxe4 Nc3 e5\nA52	Indian Defense: Budapest Gambit Accepted, Main Line, Alekhine Variation, Tartakower Defense	d4 Nf6 c4 e5 dxe5 Ng4 e4 d6\nD26	Queen's Gambit Accepted: Classical Defense	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5\nC63	Ruy Lopez: Schliemann Defense	e4 e5 Nf3 Nc6 Bb5 f5\nC80	Ruy Lopez: Open, Knorre Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 Nc3\nC21	Danish Gambit Accepted: Copenhagen Defense	e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 Bb4\nA95	Dutch Defense: Stonewall Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d5 Nc3 c6\nE18	Queen's Indian Defense: Classical Variation, Tiviakov Defense	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O Nc3 Na6\nC02	French Defense: Advance Variation, Milner-Barry Gambit	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3\nC29	Vienna Game: Vienna Gambit, Modern Variation	e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 d3\nE12	Queen's Indian Defense: Kasparov-Petrosian Variation, Polovodin Gambit	d4 Nf6 c4 e6 Nf3 b6 Nc3 Bb7 a3 d5 cxd5 Nxd5 e4\nC78	Ruy Lopez: Morphy Defense, M\xF8ller Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Bc5\nC25	Vienna Gambit, with Max Lange Defense: Hamppe-Allgaier Gambit, Thorold Variation	e4 e5 f4 exf4 Nf3 Nc6 Nc3 g5 h4 g4 Ng5 h6 Nxf7 Kxf7 d4\nA45	Trompowsky Attack: Poisoned Pawn Variation	d4 Nf6 Bg5 c5 d5 Qb6 Nc3\n";

// dashboard/app.js
var $2 = (id) => document.getElementById(id);
var strip = (san) => san.replace(/[+#]+$/, "");
function makeCodec(vocabulary) {
  if (!Array.isArray(vocabulary) || vocabulary.length < 2 || vocabulary.length > 65536 || !vocabulary.every((t) => typeof t === "string")) throw new Error("The vocabulary metadata must be a JSON array of 2 to 65,536 token strings.");
  const ids = new Map(vocabulary.map((token, id) => [token, id]));
  if (ids.size !== vocabulary.length) throw new Error("Vocabulary tokens must be unique.");
  if (!ids.has("<bos>")) throw new Error("Vocabulary must include <bos>.");
  const bySan = /* @__PURE__ */ new Map();
  vocabulary.forEach((token, id) => {
    const key = strip(token);
    if (!bySan.has(key)) bySan.set(key, []);
    bySan.get(key).push(id);
  });
  const unk = ids.get("<unk>");
  const encode = (san) => ids.get(san) ?? ids.get(strip(san)) ?? bySan.get(strip(san))?.[0] ?? unk;
  return {
    size: vocabulary.length,
    bos: ids.get("<bos>"),
    candidates: (san) => bySan.get(strip(san)) || [],
    encode,
    history: (sans) => {
      const out = [ids.get("<bos>")];
      for (const san of sans) {
        const id = encode(san);
        if (id === void 0) throw new Error(`${san} is not in this model\u2019s vocabulary.`);
        out.push(id);
      }
      return out;
    }
  };
}
var BASELINE_URL = "assets/baseline.onnx";
var MAX_BYTES = 1e7;
var MAX_PLIES = 300;
var MATCH_GAMES = 20;
var openings = openings_default.split("\n").filter((line) => line && !line.startsWith("#")).slice(1).map((line) => {
  const [, name, moves] = line.split("	");
  return { name, moves: moves.split(" ") };
});
var game = new Chess();
var glyphs = { k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F\uFE0E" };
var file2;
var sandbox;
var report;
var checking = false;
var generation = 0;
var active = false;
var codec;
var player = "w";
var selected;
var promotion;
var thinking = false;
var baseline;
var match;
var results = [];
var mode = "match";
var target = MATCH_GAMES;
var lastMove = null;
var status = (text, error = false) => {
  $2("status").textContent = text;
  $2("status").classList.toggle("error", error);
};
var half = (x) => x === 0.5 ? "\xBD" : `${Math.floor(x)}${x % 1 ? "\xBD" : ""}`;
function reset() {
  setSubmissionReport(null);
  generation++;
  sandbox?.stop();
  sandbox = null;
  report = null;
  active = false;
  checking = false;
  thinking = false;
  match = null;
  results = [];
  target = MATCH_GAMES;
  $2("stop").hidden = true;
  $2("result").hidden = true;
  $2("checks").hidden = true;
  $2("sample").hidden = false;
  $2("drop").hidden = false;
  $2("filename").hidden = true;
  $2("file-row").hidden = true;
  $2("game-panel").classList.remove("live");
  $2("game-status").textContent = "Pass the check to play your model here.";
  setTab("match");
  clearBoard();
  renderResults();
  for (const id of ["size-check", "load-check", "output-check"]) $2(id).classList.remove("pass");
}
function selectFile(next) {
  reset();
  file2 = next;
  $2("filename").textContent = file2 ? `${file2.name} \xB7 ${(file2.size / 1e6).toFixed(2)} MB` : "";
  $2("filename").hidden = !file2;
  $2("check").hidden = true;
  if (file2?.size > MAX_BYTES) status("This file is over 10 MB. Export a smaller model (try --int8).", true);
  else if (file2) check();
}
function validateLogits(logits, size) {
  if (!(logits instanceof Float32Array) || logits.length !== size) throw new Error(`Expected ${size.toLocaleString()} logits, one per vocabulary token.`);
  if (!logits.every(Number.isFinite)) throw new Error("Model returned non-finite logits.");
  return logits;
}
async function check() {
  if (!file2 || checking) return;
  reset();
  checking = true;
  const current = generation, input = file2;
  $2("check").disabled = true;
  $2("stop").hidden = false;
  $2("checks").hidden = false;
  $2("sample").hidden = true;
  try {
    status("Reading the ONNX file\u2026");
    const buffer = await input.arrayBuffer(), bytes = new Uint8Array(buffer);
    if (bytes.length > MAX_BYTES) throw new Error("This file is over 10 MB. Export a smaller model (try --int8).");
    const entry = readEntry(bytes);
    if (!entry.name) entry.name = input.name.replace(/\.onnx$/i, "");
    if (current !== generation) return;
    $2("size-check").classList.add("pass");
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", buffer)), (b) => b.toString(16).padStart(2, "0")).join("");
    if (current !== generation) return;
    const entryCodec = makeCodec(entry.vocabulary);
    if (!Number.isInteger(entry.contextLength) || entry.contextLength < 64 || entry.contextLength > 4096) throw new Error("context_length metadata must be a whole number from 64 to 4096.");
    status("Loading the model with ONNX Runtime\u2026");
    const runner = createRunner();
    sandbox = runner;
    const start = performance.now();
    const info = await runner.call("load", { bytes });
    if (current !== generation) return;
    const loadMs = performance.now() - start;
    if (info.inputs.length !== 1) throw new Error(`The model must have one input (token ids); it has ${info.inputs.length}.`);
    $2("load-check").classList.add("pass");
    const timings = [];
    for (const [index, test] of cases_default.entries()) {
      const tokens = entryCodec.history(test.moves);
      status(`Checking history ${index + 1}/${cases_default.length} \xB7 ${tokens.length} tokens\u2026`);
      const before = performance.now();
      validateLogits(await runner.call("predict", { tokens }), entryCodec.size);
      if (current !== generation) return;
      timings.push({ tokens: tokens.length, milliseconds: performance.now() - before });
    }
    codec = entryCodec;
    $2("output-check").classList.add("pass");
    report = { version: 2, status: "compatibility-passed", eligibility: "not-reviewed", name: entry.name, file: input.name, bytes: input.size, sha256: hash, opset: entry.opset, loadMs, timings, contextLength: entry.contextLength, vocabularySize: entryCodec.size, userAgent: navigator.userAgent, checkedAt: (/* @__PURE__ */ new Date()).toISOString() };
    setSubmissionReport(report);
    $2("metrics").textContent = `${(input.size / 1e6).toFixed(1)} MB, loads in ${(loadMs / 1e3).toFixed(1)} s, ${Math.round(timings.at(-1).milliseconds)} ms per move at 64 tokens.`;
    $2("checks").hidden = true;
    $2("sample").hidden = true;
    $2("result").hidden = false;
    status("");
    $2("drop").hidden = true;
    $2("filename").hidden = true;
    $2("file-row").hidden = false;
    $2("file-name").textContent = `${entry.name} \xB7 ${(input.size / 1e6).toFixed(2)} MB`;
    active = true;
    $2("game-panel").classList.add("live");
    idleMatch();
    renderResults();
  } catch (error) {
    if (current === generation) {
      status(error.message, true);
      sandbox?.stop();
      sandbox = null;
      active = false;
    }
  } finally {
    if (current === generation) {
      checking = false;
      $2("check").disabled = false;
      $2("check").hidden = active;
      $2("stop").hidden = true;
    }
  }
}
function renderBoard() {
  $2("tab-match").disabled = $2("tab-play").disabled = thinking && !match;
  $2("board").replaceChildren();
  const legal = selected ? game.moves({ square: selected, verbose: true }) : [];
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
    const square = String.fromCharCode(97 + (player === "w" ? col : 7 - col)) + (player === "w" ? 8 - row : row + 1);
    const piece = game.get(square), button = document.createElement("button");
    button.className = `square ${(col + row) % 2 ? "dark" : "light"}${square === selected ? " selected" : ""}${legal.some((m) => m.to === square) ? " legal" : ""}${lastMove && [lastMove.from, lastMove.to].includes(square) ? " last" : ""}`;
    button.dataset.square = square;
    button.setAttribute("aria-label", square + (piece ? ` ${piece.color === "w" ? "White" : "Black"} ${piece.type}` : ""));
    if (piece) {
      const span = document.createElement("span");
      span.className = "piece " + piece.color;
      span.textContent = glyphs[piece.type];
      button.append(span);
    }
    button.disabled = thinking || !active || !!promotion || game.isGameOver() || game.turn() !== player;
    button.onclick = () => clickSquare(square);
    $2("board").append(button);
  }
  $2("moves").textContent = game.history().map((move, i) => (i % 2 === 0 ? `${i / 2 + 1}. ` : "") + move).join(" ");
  $2("undo").disabled = thinking || !game.history().length || !active;
  $2("new").disabled = thinking || !active;
  $2("black").disabled = thinking || !active;
  $2("promotion").hidden = !promotion;
}
function pushMove(move) {
  lastMove = game.move(move);
  selected = null;
  promotion = null;
}
var tokensFor = (side) => side.codec.history(game.history());
function pickMove(logits, side) {
  let chosen, chosenId, best = -Infinity;
  for (const move of game.moves({ verbose: true })) for (const id of side.codec.candidates(move.san)) {
    if (logits[id] > best || logits[id] === best && id < chosenId) {
      chosen = move;
      chosenId = id;
      best = logits[id];
    }
  }
  if (!chosen) throw new Error("No legal move is in this model\u2019s vocabulary.");
  return chosen;
}
function gameStatus(text) {
  $2("game-status").textContent = game.isCheckmate() ? game.turn() === player ? "Model wins by checkmate." : "You win by checkmate." : game.isDraw() ? "Game drawn." : text;
}
async function reply() {
  if (game.isGameOver() || game.turn() === player || !active) {
    gameStatus("Your turn.");
    return;
  }
  const current = generation, side = { runner: sandbox, codec, contextLength: report.contextLength };
  let tokens;
  try {
    tokens = tokensFor(side);
  } catch (error) {
    gameStatus(`${error.message} Take the move back.`);
    return;
  }
  thinking = true;
  gameStatus("Model is thinking locally\u2026");
  renderBoard();
  try {
    if (tokens.length > side.contextLength) throw new Error("This game reached the model\u2019s context limit. Start a new game.");
    const start = performance.now(), logits = validateLogits(await sandbox.call("predict", { tokens }), codec.size);
    if (current !== generation) return;
    const chosen = pickMove(logits, side);
    pushMove(chosen);
    gameStatus(`Model played ${chosen.san} \xB7 ${Math.round(performance.now() - start)} ms. Your turn.`);
  } catch (error) {
    if (current === generation) {
      $2("game-status").textContent = error.message;
      active = false;
      sandbox?.stop();
      status("Entry stopped after a play error. Check again to restart.", true);
    }
  } finally {
    if (current === generation) {
      thinking = false;
      renderBoard();
    }
  }
}
function clickSquare(square) {
  const options = selected ? game.moves({ square: selected, verbose: true }).filter((m) => m.to === square) : [];
  if (options.length) {
    if (options[0].promotion) {
      promotion = options;
      renderBoard();
      return;
    }
    pushMove(options[0]);
    renderBoard();
    reply();
  } else {
    selected = selected === square ? null : game.get(square)?.color === player ? square : null;
    renderBoard();
  }
}
async function loadBaseline(current) {
  if (baseline) return baseline;
  $2("game-status").textContent = "Loading the baseline (9.42 MB)\u2026";
  const bytes = new Uint8Array(await (await fetch(BASELINE_URL)).arrayBuffer()), entry = readEntry(bytes);
  const runner = createRunner();
  await runner.call("load", { bytes });
  return baseline = { runner, name: entry.name, codec: makeCodec(entry.vocabulary), contextLength: entry.contextLength };
}
var plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;
var outcome = (r) => r.score === 1 ? "win" : r.score ? "draw" : "loss";
function renderResults() {
  const n = results.length, score = results.reduce((a, r) => a + r.score, 0), count = (x) => results.filter((r) => r.score === x).length;
  $2("h2h-score").textContent = n ? `${half(score)} \u2013 ${half(n - score)}` : "";
  $2("h2h-detail").textContent = n ? `${plural(count(1), "win")}, ${plural(count(0.5), "draw")}, ${plural(count(0), "loss", "losses")} in ${plural(n, "game")}.` : `${MATCH_GAMES} games against the baseline: ${MATCH_GAMES / 2} openings, once with each color. Watch them on the board.`;
  $2("strip").replaceChildren(...results.map((r, i) => {
    const cell = document.createElement("span");
    cell.className = outcome(r);
    cell.title = `Game ${i + 1}, ${r.opening}: ${outcome(r)} by ${r.reason}`;
    return cell;
  }));
  $2("progress").style.width = `${Math.min(100, n / target * 100)}%`;
  const inMatch = mode === "match";
  $2("top-name").textContent = inMatch ? "Baseline" : report?.name ?? "Model";
  $2("bottom-name").textContent = inMatch ? "Your model" : "You";
  $2("top-score").textContent = inMatch && n ? half(n - score) : "";
  $2("bottom-score").textContent = inMatch && n ? half(score) : "";
  $2("match").textContent = match ? "Pause" : !n ? "Start match" : n < target ? "Resume" : `Play ${MATCH_GAMES} more`;
}
function clearBoard() {
  player = "w";
  game.reset();
  selected = null;
  promotion = null;
  lastMove = null;
  renderBoard();
}
function idleMatch() {
  clearBoard();
  const n = results.length;
  $2("game-status").textContent = !n ? `Your model plays the baseline from ${MATCH_GAMES / 2} openings, once with each color.` : n < target ? `Paused after ${plural(n, "game")}.` : `Match done: ${plural(n, "game")}.`;
}
function setTab(next) {
  mode = next;
  $2("game-panel").dataset.mode = next;
  $2("tab-match").setAttribute("aria-selected", next === "match");
  $2("tab-play").setAttribute("aria-selected", next === "play");
}
function endReason() {
  return game.isCheckmate() ? "checkmate" : game.isStalemate() ? "stalemate" : game.isThreefoldRepetition() ? "repetition" : game.isInsufficientMaterial() ? "insufficient material" : game.isDrawByFiftyMoves() ? "fifty-move rule" : game.history().length >= MAX_PLIES ? `${MAX_PLIES}-ply cap` : "context limit";
}
function playMatch() {
  if (match) {
    match.stopped = true;
    return match.done;
  }
  if (results.length >= target) target += MATCH_GAMES;
  setTab("match");
  const m = match = { stopped: false };
  return m.done = runMatch(m);
}
async function runMatch(m) {
  const current = generation, live = () => !m.stopped && current === generation;
  thinking = true;
  renderResults();
  renderBoard();
  try {
    const sides = [{ runner: sandbox, codec, contextLength: report.contextLength }, await loadBaseline(current)];
    while (results.length < Math.min(target, openings.length * 2) && live()) {
      const i = results.length, opening = openings[i >> 1];
      player = i % 2 ? "b" : "w";
      game.reset();
      selected = null;
      promotion = null;
      for (const san of opening.moves) pushMove(game.moves({ verbose: true }).find((move) => strip(move.san) === san));
      renderBoard();
      $2("game-status").textContent = `Game ${i + 1} of ${target}. ${opening.name}.`;
      let forfeit = null;
      while (!game.isGameOver() && game.history().length < MAX_PLIES && live()) {
        const mine = game.turn() === player, side = sides[mine ? 0 : 1];
        let tokens;
        try {
          tokens = tokensFor(side);
        } catch {
          forfeit = mine ? 0 : 1;
          break;
        }
        if (tokens.length >= side.contextLength) break;
        const logits = validateLogits(await side.runner.call("predict", { tokens }), side.codec.size);
        if (!live()) break;
        pushMove(pickMove(logits, side));
        renderBoard();
      }
      if (!live()) break;
      results.push({ score: forfeit ?? (game.isCheckmate() ? game.turn() === player ? 0 : 1 : 0.5), reason: forfeit === null ? endReason() : "a move outside the vocabulary", opening: opening.name });
      renderResults();
    }
  } catch (error) {
    if (current === generation) $2("game-status").textContent = error.message;
    m.failed = true;
  } finally {
    if (match === m) match = null;
    if (current === generation) {
      thinking = false;
      renderResults();
      renderBoard();
      if (!m.failed) $2("game-status").textContent = results.length < target ? `Paused after ${plural(results.length, "game")}.` : `Match done: ${plural(results.length, "game")}.`;
    }
  }
}
async function switchTab(next) {
  if (next === mode || thinking && !match) return;
  if (match) await playMatch();
  setTab(next);
  if (next === "play") {
    player = "w";
    newGame();
  } else idleMatch();
  renderResults();
}
function newGame() {
  $2("black").textContent = player === "w" ? "Play as Black" : "Play as White";
  game.reset();
  selected = null;
  promotion = null;
  lastMove = null;
  gameStatus("Your turn. Select a piece, then its destination.");
  renderBoard();
  reply();
}
for (const tip of document.querySelectorAll("[popover]")) {
  const button = document.querySelector(`[popovertarget="${tip.id}"]`);
  tip.addEventListener("toggle", (event) => {
    if (event.newState !== "open") return;
    const box = button.getBoundingClientRect();
    tip.style.top = `${box.bottom + 8}px`;
    tip.style.left = `${Math.max(16, Math.min(box.left - 12, innerWidth - tip.offsetWidth - 16))}px`;
  });
  if (matchMedia("(hover: hover)").matches) {
    button.onmouseenter = () => tip.showPopover();
    button.onmouseleave = () => tip.hidePopover();
  }
}
$2("file").onchange = (event) => {
  selectFile(event.target.files[0]);
  event.target.value = "";
};
for (const type of ["dragover", "dragleave", "drop"]) document.addEventListener(type, (event) => {
  event.preventDefault();
  document.body.classList.toggle("drag", type === "dragover");
  if (type === "drop" && event.dataTransfer.files[0]) selectFile(event.dataTransfer.files[0]);
});
$2("check").onclick = check;
$2("stop").onclick = () => {
  reset();
  $2("check").hidden = !file2;
  status("Stopped.");
};
$2("match").onclick = playMatch;
$2("tab-match").onclick = () => switchTab("match");
$2("tab-play").onclick = () => switchTab("play");
$2("new").onclick = newGame;
$2("black").onclick = () => {
  player = player === "w" ? "b" : "w";
  newGame();
};
$2("undo").onclick = () => {
  do {
    if (!game.undo()) break;
  } while (game.history().length && game.turn() !== player);
  selected = null;
  promotion = null;
  lastMove = game.history({ verbose: true }).at(-1) ?? null;
  gameStatus("Turn taken back.");
  renderBoard();
  reply();
};
$2("promote").onclick = () => {
  pushMove(promotion.find((m) => m.promotion === $2("promotion-piece").value));
  renderBoard();
  reply();
};
$2("report").onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "entry-check.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
};
addEventListener("pagehide", () => {
  sandbox?.stop();
  baseline?.runner.stop();
});
renderResults();
renderBoard();
$2("agent").onclick = async () => {
  const repo = "https://github.com/Sparshith/nanoDanya/blob/main/challenge/";
  const text = `Set up a project for the nanoDanya chess challenge: a next-move chess model exported as one ONNX file under 10 MB, no search, runs in the browser.
Read the contract first: ${repo}llms.txt and follow its "Project setup" section. Do not train or build the model yet.
Start from the starter folder: ${repo}starter (the baseline model in PyTorch, export.py, vocabulary, tokenizer example, README).
Baseline to beat (1260 Elo, 9.63 MB): ${new URL(BASELINE_URL, location.href).href}. The starter exports it exactly with export.py --int4.
Run export.py --int4 and check.py --games 2. When every line says OK, stop and show me the folder layout.
`;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    return location.assign(repo + "llms.txt");
  }
  $2("agent").textContent = "Copied";
  $2("agent").classList.add("done");
  setTimeout(() => {
    $2("agent").textContent = "Copy prompt for your agent";
    $2("agent").classList.remove("done");
  }, 1800);
};
/*! Bundled license information:

chess.js/dist/esm/chess.js:
  (**
   * @license
   * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   *    this list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the documentation
   *    and/or other materials provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)
*/
