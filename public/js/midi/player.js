"undefined" === typeof MIDI && (MIDI = {});
"undefined" === typeof MIDI.Player && (MIDI.Player = {});
(function() {
    var b = MIDI.Player;
    b.callback = void 0;
    b.currentTime = 0;
    b.endTime = 0;
    b.restart = 0;
    b.playing = !1;
    b.timeWarp = 1;
    b.start = b.resume = function() {
      -1 > b.currentTime && (b.currentTime = -1);
      l(b.currentTime)
    }
    ;
    b.pause = function() {
      var a = b.restart;
      n();
      b.restart = a
    }
    ;
    b.stop = function() {
      n();
      b.restart = 0;
      b.currentTime = 0
    }
    ;
    b.addListener = function(a) {
      k = a
    }
    ;
    b.removeListener = function() {
      k = void 0
    }
    ;
    b.clearAnimation = function() {
      b.interval && window.clearInterval(b.interval)
    }
    ;
    b.setAnimation = function(a) {
      var c = "function" === typeof a ? a : a.callback;
      a = a.interval || 30;
      var e = 0
        , k = 0
        , f = 0;
      b.clearAnimation();
      b.interval = window.setInterval(function() {
        if (0 !== b.endTime) {
          b.playing ? (e = f === b.currentTime ? k - (new Date).getTime() : 0,
            e = 0 === b.currentTime ? 0 : b.currentTime - e,
          f !== b.currentTime && (k = (new Date).getTime(),
            f = b.currentTime)) : e = b.currentTime;
          var a = e / 1E3
            , l = a / 60
            , a = 60 * l + (a - 60 * l)
            , l = b.endTime / 1E3;
          -1 > l - a || c({
            now: a,
            end: l,
            events: d
          })
        }
      }, a)
    }
    ;
    b.loadMidiFile = function() {
      b.replayer = new Replayer(MidiFile(b.currentData),b.timeWarp);
      b.data = b.replayer.getData();
      b.endTime = f()
    }
    ;
    b.loadFile = function(a, d) {
      b.stop();
      if (-1 !== a.indexOf("base64,")) {
        var c = window.atob(a.split(",")[1]);
        b.currentData = c;
        b.loadMidiFile();
        d && d(c)
      } else
        c = new XMLHttpRequest,
          c.open("GET", a),
          c.overrideMimeType("text/plain; charset=x-user-defined"),
          c.onreadystatechange = function() {
            if (4 === this.readyState && 200 === this.status) {
              for (var a = this.responseText || "", c = [], e = a.length, k = String.fromCharCode, f = 0; f < e; f++)
                c[f] = k(a.charCodeAt(f) & 255);
              a = c.join("");
              b.currentData = a;
              b.loadMidiFile();
              d && d(a)
            }
          }
          ,
          c.send()
    }
    ;
    var a = [], c, e = 0, d = {}, k = void 0, m = function(a, e, f, n, g, m) {
      return window.setTimeout(function() {
        var n = {
          channel: a,
          note: e,
          now: f,
          end: b.endTime,
          message: g,
          velocity: m
        };
        128 === g ? delete d[e] : d[e] = n;
        k && k(n);
        b.currentTime = f;
        b.currentTime === c && c < b.endTime && l(c, !0)
      }, f - n)
    }, g = function() {
      if ("WebAudioAPI" === MIDI.lang)
        return MIDI.Player.ctx;
      b.ctx || (b.ctx = {
        currentTime: 0
      });
      return b.ctx
    }, f = function() {
      for (var a = b.data, d = a.length, c = 0.5, e = 0; e < d; e++)
        c += a[e][1];
      return c
    }, l = function(d, k) {
      if (b.replayer) {
        k || ("undefined" === typeof d && (d = b.restart),
        b.playing && n(),
          b.playing = !0,
          b.data = b.replayer.getData(),
          b.endTime = f());
        var l, s = 0, t = 0, v = b.data, w = g(), F = v.length;
        c = 0.5;
        e = w.currentTime;
        for (var B = 0; B < F; B++)
          if (l = v[B],
            l = l[1] || 1E-11,
          c + l <= d)
            s = c += l;
          else
            break;
        for (; B < F && 100 > t; B++) {
          l = v[B];
          c += l[1] || 1E-11;
          d = c - s;
          var x = l[0].event;
          if ("channel" === x.type) {
            var u = x.channel;
            switch (x.subtype) {
              case "noteOn":
                if (MIDI.channels[u].mute)
                  break;
                l = x.noteNumber - (b.MIDIOffset || 0);
                a.push({
                  event: x,
                  source: MIDI.noteOn(u, x.noteNumber, x.velocity, d / 1E3 + w.currentTime),
                  interval: m(u, l, c, s, 144, x.velocity)
                });
                t++;
                break;
              case "noteOff":
                if (MIDI.channels[u].mute)
                  break;
                l = x.noteNumber - (b.MIDIOffset || 0);
                a.push({
                  event: x,
                  source: MIDI.noteOff(u, x.noteNumber, d / 1E3 + w.currentTime),
                  interval: m(u, l, c, s, 128)
                })
            }
          }
        }
      }
    }, n = function() {
      var c = g();
      b.playing = !1;
      for (b.restart += 1E3 * (c.currentTime - e); a.length; )
        c = a.pop(),
          window.clearInterval(c.interval),
        c.source && ("number" === typeof c.source ? window.clearTimeout(c.source) : c.source.disconnect(0));
      for (var f in d)
        c = d[f],
        144 === d[f].message && k && k({
          channel: c.channel,
          note: c.note,
          now: c.now,
          end: c.end,
          message: 128,
          velocity: c.velocity
        });
      d = {}
    }
  }
)();