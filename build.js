// ==UserScript==
// @name         Better Generals.io Replay Analysis
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A better replay analysis system
// @author       Me
// @match        http://generals.io/replays/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

var mymain = (_=>{

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

    /*
    function decompressFromUint8Array(e) {
        if (null === e || void 0 === e)
            return i.decompress(e);
        for (var n = new Array(e.length / 2), r = 0, o = n.length; r < o; r++)
            n[r] = 256 * e[2 * r] + e[2 * r + 1];
        var a = [];
        return n.forEach(function(e) {
            a.push(t(e))
        }),
        i.decompress(a.join(""))
    },
    */


var COL = ["red", "blue"]
var arrow_where = ["right", "left", "top", "bottom"]
var arrows = ["&#8594;", "&#8592;", "&#8593;", "&#8595;"]
var arrow_class = ["center-vertical", "center-vertical", "center-horizontal", "center-horizontal"];

function get_dir(x) {
    var f = (x) => {
        return [(0|(x/WIDTH)),+(x%WIDTH)]
    }
    if (x === undefined) return ""
    var src = f(x[1]);
    var dst = f(x[2]);
    var dir = "";
    if (src[0] == dst[0]) {
        if (src[1] > dst[1]) {
            dir = "W";
        } else {
            dir = "E";
        }
    } else {
        if (src[0] > dst[0]) {
            dir = "N";
        } else {
            dir = "S"
        }
    }
    return [src, dir]
}

function make_display(WIDTH, HEIGHT, generals, cities, mountains, main, do_header) {
    var table = $('<table id="mymap" style="border-spacing: 0px; padding: .2em">')
    var tbody = $('<tbody>')
    table.append(tbody)

    var header = $("<div>")
    if (do_header) {
        main.append(header)
    }

    header.append($("<table style='position: relative' id='game-leaderboard'><tbody><tr><td>Player</td><td>Army</td><td>Land</td><td rowspan=3 id=turn>Turn: sdf</td></tr></tbody></table>"))

    for (var i = 0; i < 2; i++) {
        header.find("#game-leaderboard").append($("<tr>")
                                                .append($('<td class="leaderboard-name ' + COL[i] + '">').text("Player " + i))
                                                .append($("<td class='army'>").text("0"))
                                                .append($("<td class='land'>").text("0")));
    }
    
    var show = []
    
    for (var i = 0; i < HEIGHT; i++) {
        var tr = $("<tr>")
        for (var j = 0; j < WIDTH; j++) {
            var elt = $("<td id="+show.length+">");
            show.push(elt[0])
            tr.append(elt)
        }
        tbody.append(tr)
    }
    main.append(table)

    cities[0].map((id,n) => {
        show[id].className = "city"
    })

    generals.map((id,n) => {
        show[id].className = "general"
    })

    mountains.map((id,n) => {
        show[id].className = "mountain"
    })
    return [show, header];
}

class Map {
    constructor(W, H, generals, cities, mountains) {
        this.grid = new Array(H*W).fill(0);
        this.w = W;
        this.h = H;
        this.generals = generals;
        this.saved_cities = cities;
        this.mountains = mountains
    }

    setup() {
        this.grid.fill(0);
        this.turn = 0;
        this.owner = {}
        this.owner[this.generals[0]] = 0
        this.owner[this.generals[1]] = 1
        this.saved_cities[0].map((x,i) => this.grid[x] = this.saved_cities[1][i]);
        this.cities = [...this.saved_cities[0]]
        this.cities.push(...this.generals)
        this.tick()
        this.tick()
        this.turn = 0;

    }

    serialize() {
        return [this.w, this.h, this.generals, this.saved_cities, this.mountains]
    }
    
    
    count_army(who) {
        return Object.keys(this.owner).filter(x=>this.owner[x] == who).map(x=>this.grid[x]).reduce((a,b)=>a+b);
    }

    count_land(who) {
        return Object.keys(this.owner).filter(x=>this.owner[x] == who).length;
    }
    
    count_cities(who) {
        return Object.keys(this.owner).filter(x=>this.owner[x] == who).map(x=>this.cities.indexOf(x) >= 0).reduce((a,b)=>a+b);
    }
    
    make_move(src, dx, dy) {
        var dst = src-dx+dy*this.w;
        if (((src%this.w) == (dst%this.w) ||
             Math.floor(src/this.w) == Math.floor(dst/this.w)) &&
            this.mountains.indexOf(dst) === -1
           ) {
            var next_map = this.apply_move([this.owner[src], src, dst, 0, 0]);
            return [next_map, [this.owner[src], src, dst, 0, 0]]
        }
        return [null, null];
    }
    
    apply_move(action) {
        var [who, src, dst, half, _] = action;
        if (this.owner[src] != who) {
            // can't do that
            sdf
            return;
        }
        
        var next = this.copy()
        
        var amt = half ? Math.floor(next.grid[src]/2) : next.grid[src]-1;
        if (next.owner[src] == next.owner[dst]) {
            next.grid[dst] += amt;
            next.grid[src] -= amt;
        } else {
            next.grid[dst] -= amt;
            next.grid[src] -= amt;
            if (next.grid[dst] < 0) {
                next.grid[dst] *= -1;
                next.owner[dst] = who;
            }
        }
        return next;
    }

    tick() {
        //var next = this.copy()
        if (this.turn%2 == 1) {
            this.cities.map(x => this.grid[x] += (this.owner[x] !== undefined))
        }
        if (this.turn%50 == 49) {
            this.tick25();
        }
        this.turn += 1
    }

    copy() {
        var elts = JSON.parse(JSON.stringify(this));
        var nmap = new Map(this.w, this.h, [], [[], []], [], null, null);
        for (var x in elts) {
            nmap[x] = elts[x];
        }
        //var [show, header] = make_display(game, $("#history"), false);
        //$("#history td").addClass("tiny3")
        //map.show = show;
        //map.heaer = header;
        return nmap;
    }

    tick25() {
        Object.keys(this.owner).map(k => {
            var who = this.owner[k];
            if (who !== undefined) {
                this.grid[k] += 1
            }
        })
    }

    render(show, header) {
        show.map(x=> $(x).text(""))
        show.map(x=> $(x).removeClass("red"))
        show.map(x=> $(x).removeClass("blue"))
        
        for (var i = 0; i < 2; i++) {
            var land = Object.keys(this.owner).map(k => [k, this.owner[k]]).filter(x => x[1] == i).map(x=> x[0])
            var army = land.map(x=>this.grid[x]).reduce((a,b) => 0+a+b);
            $(".army")[i].innerText = army
            $(".land")[i].innerText = land.length;
            console.log("Set", land.map(x=>this.grid[x]), this.turn)
        }
        Object.keys(this.owner).map(k => {
            $(show[k]).addClass(COL[this.owner[k]]);
        })
        for (var sq = 0; sq < this.w*this.h; sq++) {
            if (this.grid[sq] > 0 || this.cities.indexOf(sq) > -1) {
                show[sq].innerText = this.grid[sq];
            }
        }
        header.find("#turn").text("Turn: " + (this.turn/2))        
    }

    arrow(idx) {
        var circ = $("<div class='arrow down' style='position: absolute;'></div>");
        circ.css('left', this.show[idx].offsetLeft + $(this.show[idx]).width()/2 - 5);
        circ.css('top', this.show[idx].offsetTop + $(this.show[idx]).height()/2 - 5);
        $("#game").append(circ);
    }
    circle(idx) {
        var circ = $("<div class='circle' style='position: absolute;'></div>");
        circ.css('left', this.show[idx].offsetLeft);
        circ.css('top', this.show[idx].offsetTop);
        $("#game").append(circ);
    }
}

class Replay {
    constructor(moves, map) {
        var prev = null;
        for (var turn = 0; turn < Math.max(...moves.map(x=>x[4]), -1)+1; turn++) {
            var newtr = $("<tr class=moverow>");
            $("#moves").append(newtr)
            var this_moves = moves.filter(x=> x[4] == turn);
            var next = new ReplayNode(this, turn, this_moves, prev, newtr);
            if (turn == 0) {
                this.root = next;
            }
            if (prev) {
                prev.children.push(next)
            }
            prev = next;
        }
        this.map = map;
        this.current = this.root;
    }

    forward() {
        if (this.current.children.length > 0) {
            this.set_current(this.current.children[this.current.which_child]);
        }
    }

    set_current(next_current) {
        this.current.set_annotation($("#annotation").val())
        this.current = next_current;
        $("#annotation").val(this.current.annotation)
        var turntr= this.current.tr;
        if (this.prev_turntr) {
            this.prev_turntr.css("background", "")
        }
        if (turntr) {
            //turntr[0].scrollIntoView();
            turntr.css("background", "#aaa")
            this.prev_turntr = turntr;
        }
    }

    render() {
        console.log("rendering")
        console.log(show, header);
        this.current.map.render(show, header);
        var next = this.current;
        var t = 0;
        //$(".my_arrow").remove()
        console.log(this.current.turn, t);
        /*
        while (t++ < 2) {
            this.moves.filter(move => move[4] == next.turn).map(move=> {
                console.log("Q");
                var d = get_dir(move);
                var i = "EWNS".indexOf(d[1]);
                $(this.map).find("#"+move[1]).append('<div class="my_arrow ' + arrow_class[i] + '" style="' + arrow_where[i] + ': 0px;">' + arrows[i] + "<div>");
            })
            if (next.children === undefined || next.children.length == 0) break;
            next = next.children[0];
        }
        */
    }
    
    make(src, dx, dy) {
        var has_alternate = this.current.ever_moves(this.current.map.owner[src]);
        var [next_map, move] = this.current.map.make_move(src, dx, dy);

        console.log("ALT", has_alternate, this.current.children);
        if (move) {
            if (has_alternate) {
                next_map.render(show, header);
                var newtr = $("<tr class=moverow>")
                this.current.tr.after(newtr)
                var next = new ReplayNode(this, this.current.turn+1, [move], this.current, newtr);
                this.current.children.push(next);
                this.set_current(next);
            } else {
                this.current.moves.push(move)
                this.current.set_map();
                this.current.map.render(show, header);
                if (this.current.children.length > 0) {
                    this.set_current(this.current.children[0]);
                }
            }
            if (ALTERNATING) {
                which[move[0]] = move[2]
                select(1-move[0], which[1-move[0]]);
                who = 1-move[0];
            } else {
                select(move[0], move[2]);
            }

        }
    }

    serialize() {
        return [this.root.map.serialize(), this.root.serialize()]
    }
}

var ALTERNATING = 0;

class ReplayNode {
    constructor(root, turn, moves, parent, tr) {
        this.root = root;
        this.moves = moves;
        this.turn = turn;
        this.children = [];
        this.which_child = 0;
        this.parent = parent;
        this.tr = tr;
        
        if (tr) {
            this.tr.click(_ => {
                replay.set_current(this)
                replay.render();
            })
        }

        this.set_map();
        this.annotation = ""
    }

    set_annotation(anno) {
        this.annotation = anno;
        this.tr.children()[6].innerHTML = "<div class=annoshort></div>"
        this.tr.children()[6].children[0].innerText = this.annotation;
    }

    ever_moves(who) {
        console.log("Ever?", this.moves);
        if (this.moves.filter(x=>x[0] == who).length > 0) return true;
        if (this.children.length == 0) return false;
        return this.children[this.which_child].ever_moves(who);
    }
    
    set_map() {
        this.map = (this.parent ? this.parent.map : base_map).copy();
        this.moves.map(x=> {
            this.map = this.map.apply_move(x)
        });
        this.map.tick();

        if (this.tr) {
            this.tr[0].innerHTML = "<td>"+this.turn/2+"</td><td>"+get_dir(this.moves.filter(x=>x[0]==0)[0])+"</td><td>"+get_dir(this.moves.filter(x=>x[0]==1)[0])+"</td><td class=army></td><td class=land></td><td class=cities></td><td class=annoshort></td></tr>";
            
            
            this.tr.find(".army").text(this.map.count_army(0) - this.map.count_army(1))
            //this.tr.find(".army").css("background", "#FFF")
            this.tr.find(".land").text(this.map.count_land(0) - this.map.count_land(1))
            this.tr.find(".cities").text(this.map.count_cities(0) - this.map.count_cities(1))
        }
        
        this.children.map(x=> x.set_map());
    }
    
    mark_path() {
        if (this.parent) {
            var path = this.parent.mark_path();
            this.parent.which_child = this.parent.children.indexOf(this);
            path.push(this);
            return path;
        }
        return [this];
    }
    
    get_path() {
        if (this.parent) {
            var path = this.parent.get_path();
            path.push(this);
            return path;
        }
        return [this];
    }

    show_splits(depth) {
        var node = this;
        while(node.children.length == 1) {
            node = node.children[0];
        }
        $("#history").append("<div style='color: #fff'>"+depth+"</div>")
        var [show2, header2] = make_display(game, $("#history"), false);
        show2[0].parentElement.parentElement.parentElement.onclick = e => {
            console.log("Set", node);
            replay.set_current(node);
            replay.render();
            e.preventDefault();
        }
        node.map.render(show2, header2);
        show2.map(x=>$(x).addClass("tiny3"));
        
        node.children.map(x=>x.show_splits(depth+1));
    }

    serialize() {
        return [this.turn, this.moves, this.children.map(x=>x.serialize())]
    }
}

function restore() {
    var main = $("#game");
    var [map_state, replay_state] = state;
    HEIGHT = game[3];
    WIDTH = game[2];
    [show, header] = make_display(...map_state, main, true);
    base_map = new Map(...map_state, show, header);
    base_map.setup();
    replay = new Replay([], map);
    
    var root = restore_replay(null, replay_state);
    replay.current = replay.root = root;
    
}

function restore_replay(parent, state) {
    var [turn, moves, next] = state;
    var newtr = $("<tr>")
    $("#moves").append(newtr);
    var node = new ReplayNode(replay, turn, moves, parent, newtr)
    if (parent) {
        parent.children.push(node);
    }
    next.reverse().map(x=> restore_replay(node, x))
    return node;
}

function select(who, where) {
    which[who] = where;
    $("#mymap td").removeClass("selected")
    $(show[where]).addClass("selected")
}


var who = 0;
var which = [0, 0];
    var base_map, replay, show, header;
var WIDTH, HEIGHT;
    function main() {


        $("#react-container").css({"display": "none"})
        document.body.innerHTML = `<head>
  <style>
.discord-button{background-image:url('/discord-white.png');background-size:cover;background-position:center;width:50px;height:50px;transition:all .2s ease-in-out}.discord-button:hover{cursor:pointer;background-image:url('/discord-color.png')}.main-menu-bottom-links{padding:2px;display:flex;flex-direction:column;position:fixed;right:0;bottom:0}.main-menu-bottom-links a{white-space:nowrap;text-align:right;margin:3px;font-size:13px}#main-menu-upsell-banner{bottom:0}#main-menu-padding{visibility:hidden;padding-top:50px}.option-button{background-image:url('/options-white.png');background-size:75% 75%;background-repeat:no-repeat;background-position:center;width:25px;height:25px;margin:3px;padding:5px;transition:all .2s ease-in-out}.option-button:hover{cursor:pointer;background-image:url('/options-color.png')}.main-title{font-family:Quicksand-Bold;font-size:72px;margin-top:0;margin-bottom:5px;text-align:center;text-shadow:2px 2px teal;transition:all .2s ease-in-out}.main-title:hover{text-shadow:3px 3px teal}.main-subtitle{font-size:16px;margin:0 0 35px 0}.queue-title{white-space:nowrap}.queue-gong-message{font-size:14px;margin:5px}.queue-cancel-map-button{background-color:teal;color:white;right:5px;padding:2px 5px;transition:background-color .2s ease-in-out}.queue-cancel-map-button:hover{cursor:pointer;background-color:rgba(255,255,255,0.25)}.custom-queue-page-container{background-color:#333;margin:10px;margin-top:0;padding:10px;min-width:600px}.custom-queue-page-container p{margin:5px 0;font-size:14px}.custom-queue-page-container h3{font-size:18px;margin:0 0 3px 0}.custom-team-container{display:inline-block;margin:5px !important;padding:10px;padding-top:5px;background-color:#222}.custom-team-container h4{margin:2px;font-family:Quicksand-Bold;border-bottom:1px solid white;padding:2px}.custom-team-container p{display:inline;margin:2px}.custom-map-message{font-size:14px;margin:0;padding:5px}.custom-host-message{padding:3px;font-size:12px;margin:10px 0}.custom-queue-slider-header{margin-top:15px !important}.custom-queue-slider-header.first{margin-top:0 !important}.main-menu-news-container{position:fixed;left:0;bottom:20%;background-color:#333;width:25%;padding:5px;border-radius:5px}.event-timer{position:fixed;right:0;bottom:30%;width:25%;padding:5px;border-radius:5px}.top-announcement{position:fixed;right:30%;top:25px;width:40%;padding:0 5px 5px}.more-io-games-link{float:left;font-size:12px}.main-menu-creator-link{float:left;color:darkgray;font-size:11px}.main-menu-news-container h4{margin:5px 0 10px 0}.main-menu-news-container a{text-decoration:underline !important}@media screen and (max-width:400px){.custom-queue-page-container{padding:5px;margin:0;overflow:scroll}.custom-queue-page-container p{font-size:11px}.custom-queue-page-container h3{font-size:14px}.custom-team-container{margin:3px;padding:5px;padding-top:3px}.queue-gong-message{font-size:11px}.custom-map-message{white-space:nowrap;font-size:11px;padding:2px}.custom-host-message{font-size:11px;margin:5px 0}.custom-queue-slider-header{margin-top:5px !important}}#custom-queue-ad{position:fixed;top:150;right:0}#custom-queue-ad-skyscraper{position:fixed;top:100;left:0}#custom-queue-content{margin-left:10%}#custom-queue-content.supporter{margin-left:0}#custom-queue-ad-top{position:fixed;top:0;left:50%;transform:translateX(-50%)}@media screen and (max-width:728px){#custom-queue-ad-top{display:none}#leaderboard-button img,#leaderboardhistory-button img,#profile-button img{width:28px;height:28px}}@media screen and (max-width:900px){#custom-queue-ad,#custom-queue-ad-skyscraper{display:none}#custom-queue-content{margin-left:0}.custom-queue-page-container{min-width:initial !important}.main-menu-news-container{width:30%;bottom:0}.event-timer{width:30%;right:10%;bottom:0}}#main-menu-alert{position:fixed;top:0;width:400px;text-align:center;left:50%;transform:translateX(-50%);font-size:12px;background:white;padding:5px}#main-menu-alert p{color:black}@media screen and (max-width:650px){#main-menu-alert{display:none}.main-menu-news-container{width:40%;bottom:0}.event-timer{display:none}.top-announcement{display:none}.more-io-games-link{display:none}}.main-menu p{margin:1px;font-size:16px}.main-menu p.small{font-size:14px}.main-menu p.tiny{font-size:12px}#main-menu-username-input{text-align:center;font-size:24px;display:block;margin:10px;padding:5px 30px;border:0}#set-username-modal p,#set-username-modal h3{color:black}#set-username-modal h3{margin:10px}#set-username-modal input{color:teal;text-align:center;font-size:20px;display:block;margin:10px;padding:5px 25px;background-color:#eee;border:0}.checkmark-green{color:green}#main-menu-reddit-button{position:fixed;top:5px;left:5px}#main-menu-discord-button{position:fixed;top:44px;left:8px}@media screen and (max-width:450px){#main-menu-discord-button{top:36px}.main-menu-news-container{width:50%}}#leaderboard-button,#profile-button{position:fixed;border-radius:30px;background:white;padding:10px;transition:all .2s ease-in-out;box-shadow:2px 2px teal}#leaderboard-button:hover,#profile-button:hover{cursor:pointer;background-color:#bbb;box-shadow:3px 3px teal}#leaderboardhistory-button{position:fixed;border-radius:30px;background:#333;padding:10px;transition:all .2s ease-in-out;box-shadow:2px 2px teal}#leaderboardhistory-button:hover{cursor:pointer;background-color:grey;box-shadow:3px 3px teal}#leaderboard-button{top:5px;right:7px}#leaderboardhistory-button{top:72px;right:7px}#profile-button{top:139px;right:7px}#leaderboard-button img,#leaderboardhistory-button img,#profile-button img{width:40px;height:40px}#leaderboard{width:640px;max-width:85%;height:85%;padding:10px;background:#bbb}#leaderboard-table tr.highlighted{background:teal;color:white}#leaderboard-table tr.qualifier{background:#b3e9ff}#leaderboard-table td{max-width:185px}#leaderboard h2{margin:5px}#public-customs{width:640px;max-width:85%;height:80%;padding:10px;background:#bbb}#public-customs-table td{max-width:185px}#public-customs-table tr{transition:all .2s ease-in-out}#public-customs-table tr:hover{cursor:pointer;background-color:#eee}#public-customs-table .public-custom-map{background-color:teal;color:white !important}#public-customs-table .public-custom-map-title{font-size:16px}#public-customs-table td{padding:3px 5px}#public-customs-table .custom-game-mod{font-size:12px;padding:3px;background-color:#eee;margin:2px;transition:all .2s ease-in-out}#public-customs-table tr:hover .custom-game-mod{background-color:white}#options a{color:black}#options{width:1000px;max-width:85%;height:80%;padding:10px;background:#bbb}@media screen and (max-width:450px){.main-title{font-size:48px;margin-bottom:2px}.main-subtitle{margin-bottom:25px;font-size:12px}.queue-title{font-size:28px}#main-menu-username-input{font-size:20px;padding:3px 25px}.main-menu p{font-size:12px}.main-menu p.small{font-size:11px}.main-menu p.tiny{font-size:10px}button{padding:8px 25px;font-size:20px}button.big{padding:12px 40px;font-size:26px}button.small{padding:5px 15px;font-size:16px}#leaderboard-button,#leaderboardhistory-button,#profile-button{border-radius:22px;padding:8px}#profile-button{top:140px}#leaderboard-button img,#leaderboardhistory-button img,#profile-button img{width:28px;height:28px}#leaderboard-table td{padding:4px 6px;font-size:16px}#game-modes p{font-size:12px}#public-customs-table td{padding:1px}}@media screen and (max-width:900px),screen and (max-height:650px){.main-menu-bottom-links a{margin:2px;font-size:11px}}#game-modes{min-width:240px;padding:15px}#game-modes p{color:black;font-size:14px}.inline-color-block{display:inline-block;width:10px;height:10px;margin:0 2px}
html,body{background-color:#222 !important}#game-leaderboard{position:fixed;top:0;right:0;z-index:25;background:black}#game-leaderboard:hover{cursor:pointer}#game-leaderboard tr.dead{opacity:.4}#game-leaderboard tr.afk{opacity:.7;background-color:red}#game-leaderboard td{background:white;padding:5px;color:black;text-align:center;font-size:16px}#game-leaderboard tr.afk td{background:rgba(255,255,255,0.75)}#game-leaderboard td.leaderboard-name{color:white;max-width:350px}#in-game-chat{z-index:25}#turn-counter{position:fixed;top:0;left:0;padding:5px;font-size:16px;background:white;color:black;border-right:2px solid teal;border-bottom:2px solid teal;text-align:center;min-width:84px;z-index:25}@media screen and (max-width:400px),screen and (max-height:600px){#turn-counter{padding:3px;font-size:14px;min-width:60px}#game-leaderboard td{padding:0 2px;font-size:12px}#game-leaderboard td.leaderboard-name{max-width:180px}}#replay-top-left{position:fixed;top:35px;left:-10px;z-index:25}#replay-top{top:5px}#replay-map-title{padding:8px;font-size:12px}#replay-turn-jump{font-size:14px;padding:5px 10px 5px 18px}#replay-turn-jump-input{display:inline-block;padding:3px;font-size:14px;width:40px;margin:0 5px}#replay-turn-jump-button{padding:5px;font-size:18px}@media screen and (max-width:450px){#replay-turn-jump{font-size:12px;padding:2px 8px 2px 15px}#replay-turn-jump-input{padding:2px;font-size:12px;width:32px;margin:0 3px}#replay-turn-jump-button{padding:3px;font-size:14px}}#gameplay-ad-skyscraper{position:fixed;top:70;left:0}#share-replay-button{position:fixed;top:0;left:50%;margin-left:-79px;z-index:25;font-family:Quicksand-Bold}#replay-bottom{bottom:0;padding:0;margin:0;z-index:25}#replay-bottom-bar{display:inline-block;margin:5px;margin-bottom:10px;white-space:nowrap}#replay-bottom-bar div{display:inline-block;text-align:center;padding:10px;font-size:18px;transition:.2s ease-in-out;background-color:white}#replay-bottom-bar div:hover{cursor:pointer;background-color:#eee}@media screen and (max-width:728px){#replay-ad-container{display:none}}#tutorial{position:fixed;top:120px;width:700px;max-width:90%;box-shadow:2px 2px teal;background-color:white;padding:6px 10px;z-index:25;left:50%;transform:translateX(-50%)}#tutorial p{margin:0;color:black;font-size:20px;text-align:center}.ping{text-shadow:0 1px 1px black}.tip{z-index:30;text-align:center;position:fixed !important;top:40px;padding:8px;font-size:16px}@media screen and (max-width:600px){#tutorial{max-width:100%;top:initial;bottom:0;left:0;right:0;box-shadow:none;padding:5px 0;transform:initial}#tutorial p{font-size:16px}#replay-bottom-bar div{padding:8px;font-size:16px}.tip{padding:5px;font-size:13px}}@media screen and (max-width:400px){#replay-bottom-bar div{padding:5px;font-size:14px}}
.red{background-color:red !important}.green{background-color:green !important}.blue{background-color:blue !important}.purple{background-color:purple !important}.teal{background-color:teal !important}.lightblue{background-color:#4363d8 !important}.orange{background-color:#f58231 !important}.maroon{background-color:#800000 !important}.yellow{background-color:#b09f30 !important}.pink{background-color:#f032e6 !important}.brown{background-color:#9a6324 !important}.lightgreen{background-color:#7ab78c !important}#mymap{table-layout:fixed}#mymap td{position:relative;border:1px solid black;width:50px;height:50px;max-width:50px;max-height:50px;min-width:50px;min-height:50px;background:#dcdcdc;text-align:center;color:white;text-shadow:0 0 2px black;opacity:1;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px;background-size:40px 40px}#mymap td.small{width:40px;height:40px;max-width:40px;max-height:40px;min-width:40px;min-height:40px;font-size:14px;background-size:32px 32px}#mymap td.large{width:60px;height:60px;max-width:60px;max-height:60px;min-width:60px;min-height:60px;font-size:18px;background-size:48px 48px}#mymap td.tiny{width:32px;height:32px;max-width:32px;max-height:32px;min-width:32px;min-height:32px;font-size:12px;background-size:25px 25px}#mymap td.tiny2{width:28px;height:28px;max-width:28px;max-height:28px;min-width:28px;min-height:28px;font-size:11px;background-size:20px 20px}#mymap td.selectable,#mymap td.attackable{position:relative;z-index:20}#mymap td.selectable:hover,#mymap td.attackable:hover{cursor:pointer}#mymap.pingmode td.selectable,#mymap.pingmode td.selectable:hover,#mymap.pingmode td.attackable:hover{cursor:crosshair}#mymap td.selected{border:1px solid white}#mymap td.selected50{text-shadow:1px 1px black}#mymap td.attackable{opacity:.4}#mymap td.city,#mymap td.general,#mymap td.mountain,#mymap td.obstacle,#mymap td.swamp{background-position:center;background-repeat:no-repeat}#mymap td.city{background-color:gray;background-image:url('/city.png')}#mymap td.neutral{background-color:gray}#mymap td.general{background-image:url('/crown.png')}#mymap td.mountain{background-image:url('/mountain.png');background-color:#bbb}#mymap td.obstacle{background-image:url('/obstacle.png')}#mymap td.swamp{background-image:url('/swamp.png');background-color:gray}#mymap td.fog{border:1px solid transparent;background-color:rgba(255,255,255,0.1)}#mymap td.fog.selected{border:1px solid white}.game-scroll{position:fixed;width:100%;height:100%;top:0;left:0}
#mymap td.tiny3{width:10px;height:10px;max-width:10px;max-height:10px;min-width:10px;min-height:10px;font-size:0px;background-size:8px 8px}
.chat-message{margin:5px;text-align:left;font-size:14px;word-wrap:break-word}.server-chat-message{font-family:Quicksand-Bold,serif}#in-game-chat,#custom-queue-chat{position:fixed;bottom:0;right:0;background:rgba(0,0,0,0.5)}#chatroom-input{width:100%;border:2px solid transparent}.chatroom-input-disabled{width:100%;border:2px solid transparent}.chatroom-input-disabled:disabled{background:white;color:black}#chatroom-input:focus{border:2px solid teal}.chat-messages-container{width:400px;max-height:240px;overflow-y:scroll;cursor:pointer;transition:all .2s ease-in-out}.minimized{opacity:.5}.chat-messages-container.minimized{width:280px;max-height:48px}@media screen and (max-width:1000px){.chat-messages-container{width:320px}}@media screen and (max-height:600px),screen and (max-width:600px){.chat-messages-container{max-height:180px}.chat-message{font-size:13px}}@media screen and (max-height:400px),screen and (max-width:375px){.chat-messages-container{max-height:100px}}.username{font-family:Quicksand-Bold,serif}.announcement-spacer{min-width:4px;background:#555;height:14px;display:inline-block;position:relative;top:2px;margin:0 1px 0 2px}
.options-controls-row{position:relative;height:50px}.options-controls-row p{color:black;display:inline-block;right:50%;margin-right:25px}.options-controls-row div{left:50%;white-space:nowrap}#account-options{padding:10px}#main-menu #account-options p,#main-menu #notif-options p{color:black;margin:5px;max-width:60%}#main-menu #account-options input{padding:5px 8px;font-size:16px;display:block;width:300px;max-width:90%;text-align:center}@media screen and (max-width:800px){#main-menu #account-options p,#main-menu #notif-options p{max-width:75%}}@media screen and (max-width:450px){#main-menu #account-options p,#main-menu #notif-options p{max-width:90%}}
.page-enter{opacity:0}.page-enter.page-enter-active{opacity:1;transition:opacity .2s ease-out .2s}.page-leave{opacity:1}.page-leave.page-leave-active{opacity:0;transition:opacity .2s ease-out}.tutorial-enter{opacity:0}.tutorial-enter.tutorial-enter-active{opacity:1;transition:opacity .4s ease-out .4s}.tutorial-leave{opacity:1}.tutorial-leave.tutorial-leave-active{opacity:0;transition:opacity .4s ease-out}
.slider-container{position:relative;background-color:#222;border:1px solid transparent;padding:28px 18px 20px 18px;width:50%;min-width:300px;border-radius:3px;transition:all .2s ease-in-out}.slider-container:hover{border:1px solid teal}.slider-container input[type='range']{margin:0;background-color:transparent;width:100%}.slider-container p{margin:0;font-size:13px}.slider-container .slider-value{top:5px;font-weight:600;font-size:18px}.slider-container .slider-min{position:absolute;left:5px;bottom:5px}.slider-container .slider-max{position:absolute;right:5px;bottom:5px}@media screen and (max-width:600px){.slider-container{min-width:200px;max-width:250px;padding:20px 15px 18px 15px}.slider-container .slider-value{font-weight:400;font-size:13px}.slider-container p{font-size:11px}}input[type=range]{-webkit-appearance:none;margin:10px 0;width:100%}input[type=range]:focus{outline:0}input[type=range]::-webkit-slider-runnable-track{width:100%;height:4px;cursor:pointer;animate:.2s;background:#ddd;border-radius:8px}input[type=range]::-webkit-slider-thumb{border:1px solid teal;height:18px;width:12px;border-radius:4px;background:#fff;cursor:pointer;-webkit-appearance:none;margin-top:-7.5px}input[type=range]:focus::-webkit-slider-runnable-track{background:#ddd}input[type=range]::-moz-range-track{width:100%;height:4px;cursor:pointer;animate:.2s;background:#ddd;border-radius:8px}input[type=range]::-moz-range-thumb{border:1px solid teal;height:18px;width:12px;border-radius:4px;background:#fff;cursor:pointer}input[type=range]::-ms-track{width:100%;height:4px;cursor:pointer;animate:.2s;background:transparent;border-color:transparent;color:transparent}input[type=range]::-ms-fill-lower{background:#ddd;border-radius:16px}input[type=range]::-ms-fill-upper{background:#ddd;border-radius:16px}input[type=range]::-ms-thumb{border:1px solid teal;height:18px;width:12px;border-radius:4px;background:#fff;cursor:pointer}input[type=range]:focus::-ms-fill-lower{background:#ddd}input[type=range]:focus::-ms-fill-upper{background:#ddd}.supporter-tag{display:inline-block;font-size:10px;color:white;background-color:teal;padding:2px 8px;margin:3px;transition:all .2s ease-in-out}.supporter-tag.inverted{color:teal;background-color:white}.supporter-tag:hover{cursor:pointer;background-color:#006e6e}.supporter-tag.inverted:hover{background-color:#eee}.supporter-tag.faded{opacity:.5}.supporter-tag.faded:hover{opacity:1}@media screen and (max-width:600px){.supporter-tag{font-size:9px;color:white;background-color:teal;padding:2px 6px}}.tabs{margin:5px;white-space:nowrap;display:inline-block}.tabs div{min-width:45px;font-size:16px}.tabs div.selected:hover{background-color:#006e6e}.tabs-short{display:flex;justify-content:center;width:50%;margin:3px}.tabs-short div{background-color:teal;color:white;flex-grow:1;padding:3px;font-size:16px;opacity:.25;transition:all .2s ease-in-out;max-width:180px}.tabs-short.wide div{min-width:88px}.tabs-short div.selected{opacity:1}.tabs-short div:hover{cursor:pointer}.tabs-short div:not(.selected):hover{opacity:.5}.tabs-short div.selected:hover{background-color:#006e6e}@media screen and (max-width:600px){.tabs div{min-width:30px;font-size:15px}.tabs-short div{font-size:14px}}@media screen and (max-width:400px){.tabs{margin:3px}.tabs div{min-width:15px;font-size:14px;padding:8px}.tabs-short div{font-size:13px}}.map-result{position:relative;background:white;width:450px;transition:background .2s ease-in-out;padding:2px 5px;margin:5px;overflow:hidden}.map-result:hover{cursor:pointer;background:#eee}.map-result p{font-size:12px;margin:2px}.map-result .rank{color:gray;position:absolute;top:3px;left:3px}.upvote-container{position:absolute;display:flex;flex-direction:row;justify-content:flex-end;align-items:center;top:3px;right:5px;padding:0 2px;transition:all .2s ease-in-out}.upvote-container:not(.upvoted):hover{cursor:pointer}.upvote-container:not(.upvoted):not(.white):hover{background-color:white}.upvote-container .upvote{margin:0;color:teal;opacity:.25;transition:opacity .2s ease-in-out}.upvote-container.upvoted .upvote{opacity:1}.upvote-container:not(.upvoted):hover .upvote{cursor:pointer;opacity:1}.upvote-container.white .upvote{color:white}.upvote-container .counter{color:gray;margin-right:1px}.upvote-container:not(.upvoted):hover .counter{cursor:pointer}.upvote-container.white .counter{color:white}.map-result .title{margin:5px 40px;color:teal;white-space:nowrap;font-size:20px;font-family:Quicksand-Bold;overflow:hidden}.map-result .description{color:black;white-space:pre-line;word-wrap:break-word;font-size:14px;margin:5px;max-height:120px;overflow-y:scroll}.map-result .preview{background-color:teal;margin:5px 20px;padding:5px;color:white;font-size:12px;transition:all .2s ease-in-out}.map-result .preview:hover{cursor:pointer;background-color:#006e6e;margin:5px 10px}.map-result .divider{background-color:lightgray;height:1px;margin:5px 0 2px 0}.map-result .footer{display:flex;flex-direction:row}.map-result .footer p{color:gray;flex-grow:1}.map-result .creator .username{font-family:Quicksand-Bold}.maps-browser-results-container{height:500px;overflow:scroll;background:#333;border:1px solid #333}.map-preview-container{padding:10px;overflow:hidden;background-color:black}input.map-search{border:0;background-color:#eee;text-align:center;width:100%;font-size:13px;padding:5px 10px;margin:0 0 5px 0}.scroll-modal-container{background:white;position:absolute;top:50px;left:0;right:0;bottom:48px;overflow:scroll}.scroll-modal-title{font-family:Quicksand-Bold;top:0;margin:5px;color:teal !important;text-shadow:1px 1px black;white-space:nowrap}.scroll-modal-button{bottom:0}.upsell-banner{display:inline-block;background-color:#333;padding:5px 10px;margin:0}.tips-banner{display:inline-block;background-color:#333;padding:3px 5px;margin:8px;transition:background-color .2s ease-in-out}.tips-banner:hover{cursor:pointer;background-color:#444}.tips-banner .tips-title{color:white;text-align:center}.tips-banner p{font-size:13px;color:#bbb;margin:1px}.tips-banner .highlight{color:white}@media screen and (max-height:600px){.maps-browser-results-container{height:360px}}@media screen and (max-width:450px){.map-result{background:white;width:280px}.map-result .title{margin:5px 30px;font-size:16px}.map-result .description{font-size:13px}.map-result p,.map-result .preview{font-size:11px}input.map-search{font-size:12px}.scroll-modal-container{bottom:38px}.upvote-container{top:0;right:2px}.upsell-banner{margin:3px;padding:3px 5px}.tips-banner{margin:5px}.tips-banner p{font-size:11px}}.store-badge{width:135px;min-height:40px;display:flex;justify-content:center;margin:0 5px !important}.store-badge-image{max-height:60px}.store-badge-container{display:inline-flex;flex-direction:row}
.mapprofile-render-container{margin:20px 50px;padding:15px;max-height:100%;overflow:hidden;border:solid 1px white;background-color:black}@media screen and (max-width:600px){.mapprofile-render-container{margin:20px 20px}}
@font-face{font-family:Quicksand;src:url('/Quicksand-Regular.otf')}@font-face{font-family:Quicksand-Light;src:url('/Quicksand-Light.otf')}@font-face{font-family:Quicksand-Bold;src:url('/Quicksand-Bold.otf')}*{font-family:Quicksand}.bold{font-family:Quicksand-Bold}.underline{text-decoration:underline}.text-left{text-align:left}html,body{background-color:#333;width:100%;height:100%;margin:0}.scrollable{overflow:scroll !important}h1,h2,h3,h4,p{color:white}@media screen and (max-width:450px){h4.responsive{font-size:14px}}.relative{position:relative}.hidden{visibility:hidden !important}.center-tag,.center-tag *{text-align:center;margin-left:auto;margin-right:auto}.center{position:absolute;top:50%;left:50%;transform:translateY(-50%) translateX(-50%)}.center-vertical{position:absolute;top:50%;transform:translateY(-50%)}.center-horizontal{position:absolute;left:50%;transform:translateX(-50%)}.fixed-center{position:fixed;top:50%;left:50%;transform:translateY(-50%) translateX(-50%)}.fixed-center-vertical{position:fixed;top:50%;transform:translateY(-50%)}.fixed-center-horizontal{position:fixed;left:50%;transform:translateX(-50%)}.absolute-fill{position:absolute;top:0;left:0;right:0;bottom:0}.background{background-color:white;box-shadow:2px 2px teal}.container-light{background-color:#eee;padding:5px;margin:5px 0}.divider{height:1px;width:75%;background-color:black;margin:5px}.break-word{word-wrap:break-word}a{color:white;text-decoration:none}a:hover,a.underline{text-decoration:underline}a:hover{cursor:pointer}a.dark{color:black;text-decoration:underline;transition:all .2s ease-in-out}a.dark:hover{background-color:rgba(0,0,0,0.1)}a.anim-white:hover{background-color:rgba(255,255,255,0.1)}button{background-color:white;box-shadow:2px 2px teal;color:teal;font-family:Quicksand;padding:10px 30px;margin:5px;font-size:24px;border:0;border-width:0 !important;outline:none !important;transition:all .2s ease-in-out;white-space:nowrap;border-radius:0}button:focus{outline:0 !important}button.big{padding:10px 50px;font-size:32px}button.small{padding:8px 20px;font-size:18px}button.inverted{background-color:teal;box-shadow:2px 2px black;color:white}button.disabled{opacity:.25}button:hover{cursor:pointer;background-color:#bbb;box-shadow:3px 3px teal}button.inverted:hover{background-color:#006e6e;box-shadow:3px 3px black}button.disabled:hover{cursor:default}button.simple{display:block;box-shadow:none}button.imagebutton{padding:3px 5px}button.imagebutton img{height:20px;width:20px;margin:0;padding:0;display:inline-block}button.imagebutton p{color:black;display:inline-block;font-size:13px;margin:3px;vertical-align:top}@media screen and (max-width:450px){button{padding:8px 25px;font-size:22px;margin:3px}button.big{padding:8px 40px;font-size:28px}button.small{padding:5px 15px;font-size:16px}button.imagebutton img{height:16px;width:16px}button.imagebutton p{font-size:11px;margin:2px}}table.list{font-size:18px;text-align:center;border-collapse:collapse;background-color:white}table.list th{font-family:Quicksand-Bold;border-bottom:2px solid black;padding:5px 25px}table.list td{border:1px solid #bbb;padding:5px 8px;overflow:hidden;max-width:250px}table.list tr{background-color:white}table.list.selectable tbody tr{transition:all .2s ease-in-out}table.list.selectable tbody tr:hover{background-color:#eee;cursor:pointer}.lightgray{color:lightgray !important}input{padding:8px;outline:0;color:teal}input[type=text]{border:1px solid lightgray;transition:.2s all ease-in-out}textarea{outline:0;border:1px solid lightgray;transition:.2s all ease-in-out;font-size:13px}input[type=text]:focus,textarea:focus{border:1px solid teal}.unselectable,td{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.popup-background{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5)}.fixed-fullscreen{position:fixed;top:0;left:0;right:0;bottom:0}.alert{background:white;box-shadow:2px 2px teal;padding:20px;z-index:50;min-width:200px}.alert h1,.alert h2,.alert h3,.alert h4,.alert p{color:black}.username-tag{background-color:teal;color:white;padding:0 3px}.username-tag.inverted{background-color:white;color:teal}.policy-body{margin-top:2em;margin-left:20%;width:60%;overflow:visible}.policy-body p{margin-top:0}.policy-body h3{margin-bottom:4px}.rank-list{display:inline-flex;max-width:450px;margin:0}.rank-item{flex:1;padding:5px 25px}.rank-item h3{font-size:18px}.rank-item h2{font-size:24px}.rank-item p{font-size:14px}@media screen and (max-width:450px){.rank-item h3{font-size:16px}.rank-item h2{font-size:20px}.rank-item p{font-size:12px}.alert{padding:15px}}.error-message{background-color:rgba(255,0,0,0.25);padding:5px}.game-link{white-space:nowrap;margin:0;color:teal;background:white;padding:5px 10px}.game-link.inverted{color:white;background:teal}.profile-header{background-color:teal;margin:20px;padding:10px;position:relative}.profile-header h1{margin:0}.profile-header p{margin:5px;font-size:14px}@media screen and (max-width:450px){.profile-header h1{font-size:24px}.profile-header p{margin:5px;font-size:12px}}.inline-button{display:inline-block;text-align:center;font-size:16px;padding:10px;color:black;background-color:transparent;transition:background-color .2s ease-in-out}.inline-button:hover{cursor:pointer;background-color:#bbb}.inline-button.inverted{background-color:teal;color:white}.inline-button.inverted:hover{background-color:#006e6e}.basic-header{width:100%;margin:0;padding:3px 0;background-color:white}.basic-header-logo{width:25px;height:25px}.basic-header-title{color:teal;margin:0 0 0 5px;font-size:18px;display:inline-block}.basic-header-clickable{padding:3px;display:inline-flex;transition:all .2s ease-in-out}.basic-header-clickable:hover{cursor:pointer;background-color:#eee}
    .circle {
    height: 22px;
    width: 22px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0);
    border: 5px solid #cc0;
    }
    .annoshort {
    max-width: 5em;
    max-height: 3.2em;
    overflow: hidden;
    text-overflow: ellipsis;
    }
    .moverow {
    }
    .arrow {
    border: solid #000;
    border-width: 0 5px 5px 0;
    display: inline-block;
    padding: 5px;
    }
    .down { transform: rotate(45deg); }
    .up { transform: rotate(225deg); }
    .left { transform: rotate(135deg); }
    .right { transform: rotate(315deg); }
  </style>
</head>
  <div id="game" style="float: left">
  </div>
  <div style="float: left; margin-top: 6em">
    <div style="overflow-y: scroll; max-height: 30em; background: #fff">
      <table id="moves" border="1">
        <tr>
          <td>Turn</td>
          <td>Red</td>
          <td>Blue</td>
          <td>Army</td>
          <td>Land</td>
          <td>Cities</td>
          <td>Commentary</td>
        </tr>
      </table>
             
    </div>
    <div>
      <textarea id="annotation" rows="30" cols="60">
      </textarea>
    </div>
  </div>
  <div id="history" style="position: absolute; top: 0px; right: 10px">
  </div>
`;
        

    var main = $("#game");
    if (true) {
        HEIGHT = game[3];
        WIDTH = game[2];
        
        [show, header] = make_display(WIDTH, HEIGHT, game[8], [game[6], game[7]], game[9], main, true);
        
        base_map = new Map(WIDTH, HEIGHT, game[8], [game[6], game[7]], game[9], show, header);
        base_map.setup();
        
        replay = new Replay(game[10], $("#mymap"));
    } else {
        restore()
    }
        
    $("#history td").addClass("tiny3");

    //for (var i = 0; i < 48; i++) {
    //    replay.forward(false);
    //}

    window.onclick = x => {
        //if (x.path[3].id == "map") {
            who = replay.current.map.owner[x.target.id];
            which[who] = x.target.id;
            select(who, which[who]);
        //} else if (x.path[3].id == "moves") {
        //    return;
        //}
    }

    $("#annotation").on('input', _ => {
        replay.current.set_annotation($("#annotation").val())
    })

        window.onkeydown = x=> {
            if (x.target.id == "annotation") return;
            if (x.key == "w") {
                replay.make(which[who], 0, -1);
            } else if (x.key == "s") {
                replay.make(which[who], 0, 1);
            } else if (x.key == "a") {
                replay.make(which[who], 1, 0);
            } else if (x.key == "d") {
                replay.make(which[who], -1, 0);
            } else if (x.key == "Enter") {
                replay.split();
            }
            if (x.key == "ArrowRight") {
                replay.forward(true);
                replay.render();
            } else if (x.key == "ArrowLeft") {
                if (replay.current.parent) {
                    replay.current.mark_path();
                    replay.set_current(replay.current.parent);
                    replay.render();
                }
            }
            console.log("GO");
            $("#history").empty();
            //replay.root.show_splits(0);
        }
        replay.render();
    }

    //var game, replay;
    var replay, game;

    function setup() {

        var id = window.setTimeout(function() {}, 0);

        while (id--) {
            window.clearTimeout(id);
        }

        var xhrOverride = new XMLHttpRequest();
        xhrOverride.responseType = 'arraybuffer';

        var h = location.href.split("/");
        h = h[h.length-1];
        $.ajax({
            url: "https://generalsio-replays-na.s3.amazonaws.com/"+h+".gior",
            method: "GET",
            
            xhr: function() {
                return xhrOverride;
            }
        }).then(resp => {
            
            game = JSON.parse(decompressFromUint8Array(new Uint8Array(resp)));
            console.log(game);

            main();
        });
    }
    return setup;
})();
mymain()
