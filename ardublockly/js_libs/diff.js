/* See LICENSE file for terms of use */
/*
 * Text diff implementation.
 *
 * This library supports the following APIS:
 * JsDiff.diffChars: Character by character diff
 * JsDiff.diffWords: Word (as defined by \b regex) diff which ignores whitespace
 * JsDiff.diffLines: Line based diff
 *
 * JsDiff.diffCss: Diff targeted at CSS content
 *
 * These methods are based on the implementation proposed in
 * "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
 */
! function(e, n) {
    function t(e, n, t) {
        if (Array.prototype.map) return Array.prototype.map.call(e, n, t);
        for (var r = new Array(e.length), o = 0, i = e.length; i > o; o++) r[o] = n.call(t, e[o], o, e);
        return r
    }

    function r(e) {
        return {
            newPos: e.newPos,
            components: e.components.slice(0)
        }
    }

    function o(e) {
        for (var n = [], t = 0; t < e.length; t++) e[t] && n.push(e[t]);
        return n
    }

    function i(e) {
        var n = e;
        return n = n.replace(/&/g, "&amp;"), n = n.replace(/</g, "&lt;"), n = n.replace(/>/g, "&gt;"), n = n.replace(/"/g, "&quot;")
    }

    function u(e, n, t) {
        n = n || [], t = t || [];
        var r;
        for (r = 0; r < n.length; r += 1)
            if (n[r] === e) return t[r];
        var o;
        if ("[object Array]" === a.call(e)) {
            for (n.push(e), o = new Array(e.length), t.push(o), r = 0; r < e.length; r += 1) o[r] = u(e[r], n, t);
            n.pop(), t.pop()
        } else if ("object" == typeof e && null !== e) {
            n.push(e), o = {}, t.push(o);
            var i, s = [];
            for (i in e) s.push(i);
            for (s.sort(), r = 0; r < s.length; r += 1) i = s[r], o[i] = u(e[i], n, t);
            n.pop(), t.pop()
        } else o = e;
        return o
    }

    function s(e, n, r, o) {
        for (var i = 0, u = e.length, s = 0, f = 0; u > i; i++) {
            var a = e[i];
            if (a.removed) {
                if (a.value = r.slice(f, f + a.count).join(""), f += a.count, i && e[i - 1].added) {
                    var l = e[i - 1];
                    e[i - 1] = e[i], e[i] = l
                }
            } else {
                if (!a.added && o) {
                    var d = n.slice(s, s + a.count);
                    d = t(d, function(e, n) {
                        var t = r[f + n];
                        return t.length > e.length ? t : e
                    }), a.value = d.join("")
                } else a.value = n.slice(s, s + a.count).join("");
                s += a.count, a.added || (f += a.count)
            }
        }
        return e
    }

    function f(e) {
        this.ignoreWhitespace = e
    }
    var a = Object.prototype.toString;
    f.prototype = {
        diff: function(e, t, o) {
            function i(e) {
                return o ? (setTimeout(function() {
                    o(n, e)
                }, 0), !0) : e
            }

            function u() {
                for (var o = -1 * d; d >= o; o += 2) {
                    var u, p = h[o - 1],
                        c = h[o + 1],
                        v = (c ? c.newPos : 0) - o;
                    p && (h[o - 1] = n);
                    var g = p && p.newPos + 1 < a,
                        m = c && v >= 0 && l > v;
                    if (g || m) {
                        if (!g || m && p.newPos < c.newPos ? (u = r(c), f.pushComponent(u.components, n, !0)) : (u = p, u.newPos++, f.pushComponent(u.components, !0, n)), v = f.extractCommon(u, t, e, o), u.newPos + 1 >= a && v + 1 >= l) return i(s(u.components, t, e, f.useLongestToken));
                        h[o] = u
                    } else h[o] = n
                }
                d++
            }
            var f = this;
            if (t === e) return i([{
                value: t
            }]);
            if (!t) return i([{
                value: e,
                removed: !0
            }]);
            if (!e) return i([{
                value: t,
                added: !0
            }]);
            t = this.tokenize(t), e = this.tokenize(e);
            var a = t.length,
                l = e.length,
                d = 1,
                p = a + l,
                h = [{
                    newPos: -1,
                    components: []
                }],
                c = this.extractCommon(h[0], t, e, 0);
            if (h[0].newPos + 1 >= a && c + 1 >= l) return i([{
                value: t.join("")
            }]);
            if (o) ! function g() {
                setTimeout(function() {
                    return d > p ? o() : void(u() || g())
                }, 0)
            }();
            else
                for (; p >= d;) {
                    var v = u();
                    if (v) return v
                }
        },
        pushComponent: function(e, n, t) {
            var r = e[e.length - 1];
            r && r.added === n && r.removed === t ? e[e.length - 1] = {
                count: r.count + 1,
                added: n,
                removed: t
            } : e.push({
                count: 1,
                added: n,
                removed: t
            })
        },
        extractCommon: function(e, n, t, r) {
            for (var o = n.length, i = t.length, u = e.newPos, s = u - r, f = 0; o > u + 1 && i > s + 1 && this.equals(n[u + 1], t[s + 1]);) u++, s++, f++;
            return f && e.components.push({
                count: f
            }), e.newPos = u, s
        },
        equals: function(e, n) {
            var t = /\S/;
            return e === n || this.ignoreWhitespace && !t.test(e) && !t.test(n)
        },
        tokenize: function(e) {
            return e.split("")
        }
    };
    var l = new f,
        d = new f(!0),
        p = new f;
    d.tokenize = p.tokenize = function(e) {
        return o(e.split(/(\s+|\b)/))
    };
    var h = new f(!0);
    h.tokenize = function(e) {
        return o(e.split(/([{}:;,]|\s+)/))
    };
    var c = new f,
        v = new f;
    v.ignoreTrim = !0, c.tokenize = v.tokenize = function(e) {
        for (var n = [], t = e.split(/^/m), r = 0; r < t.length; r++) {
            var o = t[r],
                i = t[r - 1],
                u = i && i[i.length - 1];
            "\n" === o && "\r" === u ? n[n.length - 1] = n[n.length - 1].slice(0, -1) + "\r\n" : (this.ignoreTrim && (o = o.trim(), r < t.length - 1 && (o += "\n")), n.push(o))
        }
        return n
    };
    var g = new f;
    g.tokenize = function(e) {
        var n = [],
            t = e.split(/(\n|\r\n)/);
        t[t.length - 1] || t.pop();
        for (var r = 0; r < t.length; r++) {
            var o = t[r];
            r % 2 ? n[n.length - 1] += o : n.push(o)
        }
        return n
    };
    var m = new f;
    m.tokenize = function(e) {
        return o(e.split(/(\S.+?[.!?])(?=\s+|$)/))
    };
    var w = new f;
    w.useLongestToken = !0, w.tokenize = c.tokenize, w.equals = function(e, n) {
        return c.equals(e.replace(/,([\r\n])/g, "$1"), n.replace(/,([\r\n])/g, "$1"))
    };
    var y = {
        Diff: f,
        diffChars: function(e, n, t) {
            return l.diff(e, n, t)
        },
        diffWords: function(e, n, t) {
            return d.diff(e, n, t)
        },
        diffWordsWithSpace: function(e, n, t) {
            return p.diff(e, n, t)
        },
        diffLines: function(e, n, t) {
            return c.diff(e, n, t)
        },
        diffTrimmedLines: function(e, n, t) {
            return v.diff(e, n, t)
        },
        diffSentences: function(e, n, t) {
            return m.diff(e, n, t)
        },
        diffCss: function(e, n, t) {
            return h.diff(e, n, t)
        },
        diffJson: function(e, t, r) {
            return w.diff("string" == typeof e ? e : JSON.stringify(u(e), n, "  "), "string" == typeof t ? t : JSON.stringify(u(t), n, "  "), r)
        },
        createTwoFilesPatch: function(e, n, r, o, i, u) {
            function s(e) {
                return t(e, function(e) {
                    return " " + e
                })
            }

            function f(e, n, t) {
                var r = l[l.length - 2],
                    o = n === l.length - 2,
                    i = n === l.length - 3 && t.added !== r.added;
                /\n$/.test(t.value) || !o && !i || e.push("\\ No newline at end of file")
            }
            var a = [];
            e == n && a.push("Index: " + e), a.push("==================================================================="), a.push("--- " + e + ("undefined" == typeof i ? "" : "  " + i)), a.push("+++ " + n + ("undefined" == typeof u ? "" : " " + u));
            var l = g.diff(r, o);
            l.push({
                value: "",
                lines: []
            });
            for (var d = 0, p = 0, h = [], c = 1, v = 1, m = 0; m < l.length; m++) {
                var w = l[m],
                    y = w.lines || w.value.replace(/\n$/, "").split("\n");
                if (w.lines = y, w.added || w.removed) {
                    if (!d) {
                        var P = l[m - 1];
                        d = c, p = v, P && (h = s(P.lines.slice(-4)), d -= h.length, p -= h.length)
                    }
                    h.push.apply(h, t(y, function(e) {
                        return (w.added ? "+" : "-") + e
                    })), f(h, m, w), w.added ? v += y.length : c += y.length
                } else {
                    if (d)
                        if (y.length <= 8 && m < l.length - 2) h.push.apply(h, s(y));
                        else {
                            var k = Math.min(y.length, 4);
                            a.push("@@ -" + d + "," + (c - d + k) + " +" + p + "," + (v - p + k) + " @@"), a.push.apply(a, h), a.push.apply(a, s(y.slice(0, k))), y.length <= 4 && f(a, m, w), d = 0, p = 0, h = []
                        }
                    c += y.length, v += y.length
                }
            }
            return a.join("\n") + "\n"
        },
        createPatch: function(e, n, t, r, o) {
            return y.createTwoFilesPatch(e, e, n, t, r, o)
        },
        applyPatch: function(e, n) {
            for (var t = n.split("\n"), r = [], o = 0, i = !1, u = !1; o < t.length && !/^@@/.test(t[o]);) o++;
            for (; o < t.length; o++)
                if ("@" === t[o][0]) {
                    var s = t[o].split(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
                    r.unshift({
                        start: s[3],
                        oldlength: +s[2],
                        removed: [],
                        newlength: s[4],
                        added: []
                    })
                } else "+" === t[o][0] ? r[0].added.push(t[o].substr(1)) : "-" === t[o][0] ? r[0].removed.push(t[o].substr(1)) : " " === t[o][0] ? (r[0].added.push(t[o].substr(1)), r[0].removed.push(t[o].substr(1))) : "\\" === t[o][0] && ("+" === t[o - 1][0] ? i = !0 : "-" === t[o - 1][0] && (u = !0));
            var f = e.split("\n");
            for (o = r.length - 1; o >= 0; o--) {
                for (var a = r[o], l = 0; l < a.oldlength; l++)
                    if (f[a.start - 1 + l] !== a.removed[l]) return !1;
                Array.prototype.splice.apply(f, [a.start - 1, a.oldlength].concat(a.added))
            }
            if (i)
                for (; !f[f.length - 1];) f.pop();
            else u && f.push("");
            return f.join("\n")
        },
        convertChangesToXML: function(e) {
            for (var n = [], t = 0; t < e.length; t++) {
                var r = e[t];
                r.added ? n.push("<ins>") : r.removed && n.push("<del>"), n.push(i(r.value)), r.added ? n.push("</ins>") : r.removed && n.push("</del>")
            }
            return n.join("")
        },
        convertChangesToDMP: function(e) {
            for (var n, t, r = [], o = 0; o < e.length; o++) n = e[o], t = n.added ? 1 : n.removed ? -1 : 0, r.push([t, n.value]);
            return r
        },
        canonicalize: u
    };
    "undefined" != typeof module && module.exports ? module.exports = y : "function" == typeof define && define.amd ? define([], function() {
        return y
    }) : "undefined" == typeof e.JsDiff && (e.JsDiff = y)
}(this);