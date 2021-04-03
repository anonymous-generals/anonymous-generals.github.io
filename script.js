//var main = (_=>{

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
    var table = $('<table id="map" style="border-spacing: 0px; padding: .2em">')
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
            turntr[0].scrollIntoViewIfNeeded();
            turntr.css("background", "#aaa")
            this.prev_turntr = turntr;
        }
    }

    render() {
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
    $("#map td").removeClass("selected")
    $(show[where]).addClass("selected")
}


var who = 0;
var which = [0, 0];
var base_map, replay, show, header;
var WIDTH, HEIGHT;
function main() {
    var main = $("#game");

    if (true) {
        HEIGHT = game[3];
        WIDTH = game[2];
        
        [show, header] = make_display(WIDTH, HEIGHT, game[8], [game[6], game[7]], game[9], main, true);
        
        base_map = new Map(WIDTH, HEIGHT, game[8], [game[6], game[7]], game[9], show, header);
        base_map.setup();
        
        replay = new Replay(game[10], map);
    } else {
        restore()
    }
    
    $("#history td").addClass("tiny3");

    //for (var i = 0; i < 48; i++) {
    //    replay.forward(false);
    //}

    window.onclick = x => {
        if (x.path[3].id == "map") {
            who = replay.current.map.owner[x.target.id];
            which[who] = x.target.id;
            select(who, which[who]);
        } else if (x.path[3].id == "moves") {
            return;
        }
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
//    return main;
//})();
