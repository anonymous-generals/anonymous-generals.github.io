const fs = require('fs');

var t = String.fromCharCode;

var decompress = function(e) {
    return null == e ? "" : "" == e ? null : _decompress(e.length, 32768, function(t) {
        return e.charCodeAt(t)
    })
};
var _decompress = function(e, n, r) {
    var o, i, a, s, u, l, c, p = [],
        f = 4,
        h = 4,
        d = 3,
        m = "",
        y = [],
        g = {
            val: r(0),
            position: n,
            index: 1
        };
    for (o = 0; o < 3; o += 1) p[o] = o;
    for (a = 0, u = Math.pow(2, 2), l = 1; l != u;) s = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = r(g.index++)), a |= (s > 0 ? 1 : 0) * l, l <<= 1;
    switch (a) {
    case 0:
        for (a = 0, u = Math.pow(2, 8), l = 1; l != u;) s = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = r(g.index++)), a |= (s > 0 ? 1 : 0) * l, l <<= 1;
        c = t(a);
        break;
    case 1:
        for (a = 0, u = Math.pow(2, 16), l = 1; l != u;) s = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = r(g.index++)), a |= (s > 0 ? 1 : 0) * l, l <<= 1;
        c = t(a);
        break;
    case 2:
        return ""
    }
    for (p[3] = c, i = c, y.push(c);;) {
        if (g.index > e) return "";
        for (a = 0, u = Math.pow(2, d), l = 1; l != u;) s = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = r(g.index++)), a |= (s > 0 ? 1 : 0) * l, l <<= 1;
        switch (c = a) {
        case 0:
            for (a = 0, u = Math.pow(2, 8), l = 1; l != u;) s = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = r(g.index++)), a |= (s > 0 ? 1 : 0) * l, l <<= 1;
            p[h++] = t(a), c = h - 1, f--;
            break;
        case 1:
            for (a = 0, u = Math.pow(2, 16), l = 1; l != u;) s = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = r(g.index++)), a |= (s > 0 ? 1 : 0) * l, l <<= 1;
            p[h++] = t(a), c = h - 1, f--;
            break;
        case 2:
            return y.join("")
        }
        if (0 == f && (f = Math.pow(2, d), d++), p[c]) m = p[c];
        else {
            if (c !== h) return null;
            m = i + i.charAt(0)
        }
        y.push(m), p[h++] = i + m.charAt(0), f--, i = m, 0 == f && (f = Math.pow(2, d), d++)
    }
}


var decompressFromUint8Array = function(e) {
    if (null === e || void 0 === e) return i.decompress(e);
    for (var n = new Array(e.length / 2), r = 0, o = n.length; r < o; r++) n[r] = 256 * e[2 * r] + e[2 * r + 1];
    var a = [];
    return n.forEach(function(e) {
        a.push(t(e))
    }), decompress(a.join(""))
}


var game = JSON.parse(decompressFromUint8Array(fs.readFileSync(process.argv[2])));
console.log(JSON.stringify(game))
return
