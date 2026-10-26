/**
 * bonhomme.js
 * ---------------------------------------------------------------------
 * Donne vie au technicien de la page d'accueil (assets/images/bonhomme-ordi.svg).
 *
 * CE QU'IL FAIT :
 *   - il tape de vraies commandes (ping, ipconfig, apt, Get-ADUser…) dans
 *     son terminal, lettre par lettre, avec un rythme irrégulier et parfois
 *     une faute de frappe qu'il corrige ;
 *   - chaque touche fait bouger la bonne main et s'allume sur le clavier ;
 *   - ses yeux suivent le curseur du terminal, lisent les résultats,
 *     suivent ta souris et clignent au hasard ;
 *   - son visage change selon ce qui se passe (concentré, content, perplexe) ;
 *   - si tu cliques dessus, il te salue.
 *
 * COMMENT ÇA MARCHE :
 *   1. L'image est d'abord affichée avec une balise <img> (elle marche même
 *      sans JavaScript). Le script télécharge le fichier SVG avec fetch() et
 *      remplace l'<img> par le SVG lui-même : on peut alors modifier ses
 *      éléments (getElementById, setAttribute…) comme n'importe quel HTML.
 *   2. Deux « moteurs » tournent en parallèle :
 *      - le SCÉNARIO (fonction run) : une suite d'étapes avec des pauses,
 *        écrite avec async / await pour se lire de haut en bas ;
 *      - l'ANIMATION (fonction frame) : appelée ~60 fois par seconde par
 *        requestAnimationFrame, elle rapproche doucement les yeux, la tête
 *        et les paupières de leur position cible.
 * ---------------------------------------------------------------------
 */

(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ------------------------------------------------------------------
  // Petits outils
  // ------------------------------------------------------------------
  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
    }
    return copy;
  }

  // « await sleep(500) » met le scénario en pause 500 ms.
  // Si l'onglet est caché, on attend en plus qu'il redevienne visible.
  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); }).then(function () {
      if (!document.hidden) return;
      return new Promise(function (resolve) {
        document.addEventListener("visibilitychange", function onVisible() {
          if (document.hidden) return;
          document.removeEventListener("visibilitychange", onVisible);
          resolve();
        });
      });
    });
  }

  // ------------------------------------------------------------------
  // Ce qu'il tape : chaque scénario est une liste de commandes
  // ------------------------------------------------------------------
  var SHELLS = {
    bash: { prompt: "tech@srv:~$ ", color: "#34d399" },
    ps: { prompt: "PS C:\\> ", color: "#60a5fa" },
  };

  var COLORS = {
    cmd: "#e2e8f0",   // ce qu'il tape
    out: "#94a3b8",   // sortie normale
    head: "#f8fafc",  // titres de colonnes
    ok: "#22d3ee",    // succès
    err: "#f472b6",   // erreur
  };

  var SCENARIOS = [
    [{
      shell: "bash", cmd: "ping -c 3 192.168.1.1",
      out: [
        ["PING 192.168.1.1 56(84) octets de données.", "out"],
        ["64 octets de 192.168.1.1 : icmp_seq=1 ttl=64 temps=0.41 ms", "out"],
        ["64 octets de 192.168.1.1 : icmp_seq=2 ttl=64 temps=0.38 ms", "out"],
        ["64 octets de 192.168.1.1 : icmp_seq=3 ttl=64 temps=0.40 ms", "out"],
        ["3 transmis, 3 reçus, 0 % perdus", "ok"],
      ],
      mood: "happy", say: "ça marche ! 🎉",
    }],
    [{
      shell: "ps", cmd: "ipconfig",
      out: [
        ["Carte Ethernet Ethernet0 :", "head"],
        ["   Adresse IPv4. . : 192.168.1.42", "out"],
        ["   Masque . . . . : 255.255.255.0", "out"],
        ["   Passerelle . . : 192.168.1.254", "out"],
      ],
    }],
    [{
      shell: "bash", cmd: "sudo apt update",
      out: [["[sudo] Mot de passe de tech : ", "out"]],
      password: true,
      out2: [
        ["Atteint :1 http://deb.debian.org/debian", "out"],
        ["Lecture des listes de paquets... Fait", "out"],
        ["Tous les paquets sont à jour.", "ok"],
      ],
      mood: "happy", say: "sawfè !",
    }],
    [{
      shell: "bash", cmd: "ping -c 2 10.0.0.99",
      out: [
        ["PING 10.0.0.99 56(84) octets de données.", "out"],
        ["De 10.0.0.1 icmp_seq=1 Hôte injoignable", "err"],
        ["De 10.0.0.1 icmp_seq=2 Hôte injoignable", "err"],
      ],
      mood: "hmm", say: "hmm… 🤔",
    }, {
      shell: "bash", cmd: "ping -c 1 10.0.0.1",
      out: [
        ["64 octets de 10.0.0.1 : icmp_seq=1 ttl=63", "out"],
        ["1 transmis, 1 reçu, 0 % perdu", "ok"],
      ],
      mood: "happy", say: "le PC est éteint 💡",
    }],
    [{
      shell: "ps", cmd: "Get-ADUser -Filter * | select Name",
      out: [
        ["Name", "head"],
        ["----", "head"],
        ["Administrateur", "out"],
        ["Alice Martin", "out"],
        ["Bruno Durand", "out"],
        ["Chloé Petit", "out"],
      ],
      mood: "happy", say: "AD ok ✔",
    }],
    [{
      shell: "bash", cmd: "systemctl status apache2",
      out: [
        ["● apache2.service - Apache HTTP Server", "ok"],
        ["   Loaded: loaded (/lib/systemd/system/apache2)", "out"],
        ["   Active: active (running) depuis 08:12", "ok"],
      ],
      say: "Apache tourne ✔",
    }],
    [{
      shell: "bash", cmd: "df -h /",
      out: [
        ["Sys. de fichiers Taille Util. Dispo Uti%", "head"],
        ["/dev/sda1           30G   12G   17G  42%", "out"],
      ],
    }],
    [{
      shell: "ps", cmd: "Test-Connection srv-dc01 -Count 2",
      out: [
        ["Ping Source Address    Latency", "head"],
        ["   1 PC01   10.0.0.10  1 ms", "out"],
        ["   2 PC01   10.0.0.10  1 ms", "out"],
      ],
    }],
  ];

  var GREETINGS = ["Salut ! 👋", "Bon courage ! 💪", "On révise ? 📚", "Un petit quiz ? 😉"];

  // ------------------------------------------------------------------
  // Les humeurs : forme de la bouche, hauteur des sourcils, paupières
  // ------------------------------------------------------------------
  var MOODS = {
    focus: { mouth: "M254 178 Q265 182 276 178", fill: "none", dimple: 0, brow: 0.5, lid: 5 },
    happy: { mouth: "M252 176 Q265 187 278 176", fill: "none", dimple: 1, brow: -2.5, lid: 2 },
    hmm: { mouth: "M255 180 Q262 176 275 179", fill: "none", dimple: 0, brow: 1.8, lid: 6 },
    surprised: { mouth: "M260 179 Q265 172 270 179 Q265 187 260 179 Z", fill: "#5b1d1d", dimple: 0, brow: -4.5, lid: 0 },
  };

  // ------------------------------------------------------------------
  // Le clavier AZERTY : quelle touche, quelle main
  // ------------------------------------------------------------------
  var KEY_ROWS = ["azertyuiop^", "qsdfghjklmù", "<wxcvbn,;:!"];
  var DIGITS = "1234567890";

  // Le terminal à l'écran
  var TERM = { x: 34, top: 139, lineHeight: 9.5, maxLines: 11 };

  function start(svg) {
    var el = function (id) { return svg.querySelector("#" + id); };
    var term = el("bo-term");
    var cursor = el("bo-cursor");
    var parts = {
      body: el("bo-body"), head: el("bo-head"), pupils: el("bo-pupils"), lids: el("bo-lids"),
      brows: el("bo-brows"), mouth: el("bo-mouth"), dimple: el("bo-dimple"),
      handL: el("bo-handL"), handR: el("bo-handR"),
      glow: el("bo-glow"), faceLight: el("bo-facelight"),
      bubble: el("bo-bubble"), bubbleBg: el("bo-bubble-bg"), bubbleText: el("bo-bubble-text"),
    };
    var keys = {
      row0: el("bo-row0").querySelectorAll("rect"),
      row1: el("bo-row1").querySelectorAll("rect"),
      space: el("bo-space"),
    };

    // Tout ce qui change avec le temps est rangé dans « state »
    var state = {
      mood: "focus",
      moodOverride: null,             // { name, until } : humeur temporaire (clic)
      gaze: { x: 110, y: 186 },       // point regardé (coordonnées du SVG)
      viewerUntil: 0,                 // il te regarde jusqu'à cet instant
      pointer: null,                  // { x, y, until } : position de ta souris
      eyes: { dx: -3.5, dy: 1 },      // position actuelle des iris
      headX: 0, headRot: 0,
      lastKey: 0, keyCount: 0, lastHand: "R",
      glow: 0,
      blinkStart: 0, blinkDouble: false,
      appliedMood: "",
    };

    // L'animation CSS et le texte de secours sont remplacés par le JavaScript
    parts.lids.classList.remove("bo-blink");
    term.textContent = "";
    svg.classList.add("is-live");
    svg.style.cursor = "pointer";

    // ----------------------------------------------------------------
    // Le terminal
    // ----------------------------------------------------------------
    var lines = [];

    function clearScreen() {
      lines.forEach(function (l) { l.remove(); });
      lines = [];
    }

    // Ajoute une ligne : segments = [{ text, color }, …]
    function newLine(segments) {
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", TERM.x);
      text.style.whiteSpace = "pre";   // garde les espaces (alignement des colonnes)
      segments.forEach(function (s) { addSpan(text, s.text, s.color); });
      term.appendChild(text);
      lines.push(text);
      if (lines.length > TERM.maxLines) lines.shift().remove();   // l'écran défile
      lines.forEach(function (l, i) { l.setAttribute("y", TERM.top + i * TERM.lineHeight); });
      placeCursor();
      return text;
    }

    function addSpan(text, content, color) {
      var span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      span.setAttribute("fill", color);
      span.textContent = content;
      text.appendChild(span);
      return span;
    }

    function appendChar(text, ch, color) {
      var last = text.lastChild;
      if (last && last.getAttribute("fill") === color) last.textContent += ch;
      else addSpan(text, ch, color);
      placeCursor();
    }

    function removeChar(text) {
      var last = text.lastChild;
      last.textContent = last.textContent.slice(0, -1);
      if (!last.textContent) last.remove();
      placeCursor();
    }

    function lastLine() { return lines[lines.length - 1]; }

    // Le curseur se place juste après le dernier caractère de la dernière ligne
    function placeCursor() {
      var line = lastLine();
      if (!line) return;
      var width = line.getComputedTextLength ? line.getComputedTextLength() : 0;
      var y = Number(line.getAttribute("y"));
      cursor.setAttribute("x", TERM.x + width + 0.5);
      cursor.setAttribute("y", y - 6.5);
      state.cursorPos = { x: TERM.x + width, y: y - 3 };
    }

    function ensurePrompt(shell) {
      var line = lastLine();
      if (line && line.dataset.prompt === shell && line.textContent === SHELLS[shell].prompt) return line;
      if (line && line.dataset.prompt && line.dataset.prompt !== shell) clearScreen();   // nouvelle fenêtre
      return newPrompt(shell);
    }

    function newPrompt(shell) {
      var line = newLine([{ text: SHELLS[shell].prompt, color: SHELLS[shell].color }]);
      line.dataset.prompt = shell;
      return line;
    }

    // ----------------------------------------------------------------
    // Le clavier et les mains
    // ----------------------------------------------------------------
    function keyInfo(ch) {
      var c = ch.toLowerCase();
      if (ch === " ") return { key: keys.space, hand: state.lastHand === "L" ? "R" : "L", depth: 2.5 };
      if (ch === "\n") return { key: keys.row1[10], hand: "R", depth: 4 };
      if (ch === "\b") return { key: keys.row0[10], hand: "R", depth: 3 };
      for (var r = 0; r < KEY_ROWS.length; r++) {
        var i = KEY_ROWS[r].indexOf(c);
        if (i !== -1) {
          var row = r === 0 ? keys.row0 : keys.row1;
          return { key: row[Math.min(i + (r === 2 ? 1 : 0), 10)], hand: i <= 4 ? "L" : "R", depth: r === 0 ? 2.5 : 3.5 };
        }
      }
      var d = DIGITS.indexOf(c);
      if (d !== -1) return { key: keys.row0[d], hand: d <= 4 ? "L" : "R", depth: 2.5 };
      return { key: keys.row0[Math.floor(rand(7, 11))], hand: "R", depth: 2.5 };   // symboles
    }

    function pressKey(ch) {
      var info = keyInfo(ch);
      var hand = info.hand === "L" ? parts.handL : parts.handR;
      var restX = info.hand === "L" ? 212 : 304;
      var keyX = Number(info.key.getAttribute("x")) + Number(info.key.getAttribute("width")) / 2;
      var shift = clamp((keyX - restX) / 5, -5, 5);   // la main glisse vers la touche

      hand.style.transform = "translate(" + shift + "px," + info.depth + "px)";
      info.key.setAttribute("fill", "#67e8f9");
      var count = ++state.keyCount;
      setTimeout(function () {
        hand.style.transform = "translate(" + shift * 0.4 + "px,0px)";
        info.key.removeAttribute("fill");
      }, 90);
      setTimeout(function () {
        if (state.keyCount === count) { parts.handL.style.transform = ""; parts.handR.style.transform = ""; }
      }, 500);

      state.lastHand = info.hand;
      state.lastKey = performance.now();
    }

    // Délai avant la touche suivante : jamais deux fois le même
    function keyDelay(ch) {
      var d = rand(55, 140);
      if (ch === " ") d += rand(30, 120);
      if (/[^a-z0-9 ]/i.test(ch)) d += rand(60, 160);       // symbole : il cherche la touche
      if (Math.random() < 0.06) d += rand(250, 700);        // petite hésitation
      return d;
    }

    // Une touche voisine sur la même rangée (pour les fautes de frappe)
    function neighbourKey(ch) {
      for (var r = 0; r < KEY_ROWS.length; r++) {
        var i = KEY_ROWS[r].indexOf(ch.toLowerCase());
        if (i !== -1) return KEY_ROWS[r][i === 0 ? 1 : i + pick([-1, 1])] || KEY_ROWS[r][i - 1];
      }
      return null;
    }

    async function typeChar(line, ch, secret) {
      pressKey(ch);
      if (!secret) appendChar(line, ch, COLORS.cmd);
      await sleep(keyDelay(ch));
    }

    async function typeCommand(line, text) {
      // 1 fois sur 3, une faute de frappe quelque part dans la commande
      var typoAt = text.length > 4 && Math.random() < 0.35 ? Math.floor(rand(2, text.length - 1)) : -1;
      for (var i = 0; i < text.length; i++) {
        if (i === typoAt) await makeTypo(line, text, i);
        await typeChar(line, text[i]);
      }
    }

    async function makeTypo(line, text, i) {
      var wrong = neighbourKey(text[i]);
      if (!wrong) return;
      var extra = text.slice(i + 1, i + 1 + Math.floor(rand(0, 3)));   // il continue un peu avant de voir l'erreur
      await typeChar(line, wrong);
      for (var k = 0; k < extra.length; k++) await typeChar(line, extra[k]);
      state.mood = "hmm";
      await sleep(rand(300, 650));
      for (var b = 0; b < extra.length + 1; b++) {
        pressKey("\b");
        removeChar(line);
        await sleep(rand(70, 130));
      }
      state.mood = "focus";
    }

    // ----------------------------------------------------------------
    // L'écran affiche une réponse : les lignes arrivent vite, il les lit
    // ----------------------------------------------------------------
    async function printLines(out) {
      for (var i = 0; i < out.length; i++) {
        newLine([{ text: out[i][0], color: COLORS[out[i][1]] }]);
        state.glow = 1;   // l'écran s'illumine un peu
        await sleep(rand(40, 180));
      }
    }

    async function readLines(count) {
      var first = Math.max(0, lines.length - 1 - count);
      for (var i = first; i < lines.length - 1; i++) {
        var y = Number(lines[i].getAttribute("y")) - 3;
        state.gaze = { x: 40, y: y };
        await sleep(rand(120, 220));
        state.gaze = { x: rand(120, 175), y: y };
        await sleep(rand(220, 420));
      }
    }

    // ----------------------------------------------------------------
    // La bulle
    // ----------------------------------------------------------------
    var bubbleTimer;
    function say(text, ms) {
      parts.bubbleText.textContent = text;
      var width = Math.max(70, parts.bubbleText.getComputedTextLength() + 30);
      parts.bubbleBg.setAttribute("width", width);
      parts.bubbleText.setAttribute("x", 312 + width / 2);
      parts.bubble.classList.add("is-on");
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(function () { parts.bubble.classList.remove("is-on"); }, ms || 2400);
    }

    // ----------------------------------------------------------------
    // Le scénario principal (tourne en boucle)
    // ----------------------------------------------------------------
    async function runStep(step) {
      var line = ensurePrompt(step.shell);
      state.mood = "focus";
      state.gaze = state.cursorPos;
      await sleep(rand(500, 1300));                    // il réfléchit à ce qu'il va taper

      await typeCommand(line, step.cmd);
      await sleep(rand(150, 350));
      pressKey("\n");

      if (step.clear) {
        clearScreen();
        newPrompt(step.shell);
        await sleep(rand(400, 800));
        return;
      }

      await sleep(rand(250, 750));                     // le système répond
      await printLines(step.out);

      if (step.password) {                             // le mot de passe ne s'affiche pas
        state.gaze = { x: 256, y: 305 };               // coup d'œil au clavier
        await sleep(rand(300, 600));
        var secret = pick(["Pa$$w0rd!", "Tssr2026", "azerty123"]);
        for (var i = 0; i < secret.length; i++) await typeChar(lastLine(), secret[i], true);
        pressKey("\n");
        await sleep(rand(600, 1200));
        await printLines(step.out2);
      }

      if (step.mood) state.mood = step.mood;
      if (step.say) say(step.say);
      newPrompt(step.shell);
      await readLines((step.out2 || step.out).length);
    }

    async function run() {
      clearScreen();
      newPrompt("bash");
      await sleep(900);
      var queue = [];
      for (;;) {
        if (!queue.length) queue = shuffle(SCENARIOS);
        var steps = queue.shift();
        for (var i = 0; i < steps.length; i++) await runStep(steps[i]);

        // de temps en temps, il fait le ménage
        if (lines.length > 8 && Math.random() < 0.5) {
          await runStep({ shell: lastLine().dataset.prompt || "bash", cmd: "clear", clear: true });
        }
        // pause : il te regarde parfois en souriant
        if (Math.random() < 0.4) {
          blinkNow();
          state.viewerUntil = performance.now() + rand(1200, 2200);
          state.mood = "happy";
        }
        await sleep(rand(1200, 2600));
      }
    }

    // ----------------------------------------------------------------
    // L'animation, image par image
    // ----------------------------------------------------------------
    function scheduleBlink(now) {
      state.blinkStart = now + rand(2000, 6000);
      state.blinkDouble = Math.random() < 0.15;
    }

    function blinkNow() { state.blinkStart = performance.now(); state.blinkDouble = false; }

    // 0 = œil ouvert, 1 = fermé. Un clignement dure environ 170 ms.
    function blinkAmount(now) {
      var t = now - state.blinkStart;
      if (t < 0) return 0;
      var one = function (t) { return t < 0 ? 0 : t < 70 ? t / 70 : t < 170 ? 1 - (t - 70) / 100 : 0; };
      var amount = Math.max(one(t), state.blinkDouble ? one(t - 220) : 0);
      if (t > (state.blinkDouble ? 400 : 180)) scheduleBlink(now);
      return amount;
    }

    function applyMood(name) {
      if (state.appliedMood === name) return;
      var m = MOODS[name];
      parts.mouth.setAttribute("d", m.mouth);
      parts.mouth.setAttribute("fill", m.fill);
      parts.dimple.setAttribute("opacity", m.dimple);
      parts.brows.setAttribute("transform", "translate(0 " + m.brow + ")");
      state.appliedMood = name;
    }

    function frame() {
      // même horloge que pressKey (le paramètre de requestAnimationFrame peut être un peu en retard)
      var now = performance.now();
      // 1. Où regarder ? Ta souris > toi > le terminal
      var target = state.gaze || { x: 110, y: 186 };
      if (state.pointer && now < state.pointer.until) target = state.pointer;
      else if (now < state.viewerUntil) target = { x: 265, y: 150 };
      else if (now - state.lastKey < 300 && state.cursorPos) target = state.cursorPos;

      var wantDx = clamp((target.x - 265) / 150, -1, 1) * 4;
      var wantDy = clamp((target.y - 143) / 90, -1, 1) * 3;
      // les yeux bougent vite (saccades), la tête suit plus lentement
      state.eyes.dx += (wantDx - state.eyes.dx) * 0.3;
      state.eyes.dy += (wantDy - state.eyes.dy) * 0.3;
      state.headX += (wantDx * 0.7 - state.headX) * 0.06;
      state.headRot += (wantDx * 0.6 - state.headRot) * 0.06;
      parts.pupils.setAttribute("transform", "translate(" + state.eyes.dx.toFixed(2) + " " + state.eyes.dy.toFixed(2) + ")");

      // 2. La tête : petit hochement à chaque touche + respiration
      var nod = 0.7 * Math.exp(-Math.max(0, now - state.lastKey) / 120);
      var breath = Math.sin(now / 4000 * 2 * Math.PI) * 0.9;
      parts.body.setAttribute("transform", "translate(0 " + breath.toFixed(2) + ")");
      parts.head.setAttribute("transform",
        "translate(" + state.headX.toFixed(2) + " " + nod.toFixed(2) + ") rotate(" + state.headRot.toFixed(2) + " 265 195)");

      // 3. Humeur et paupières
      var mood = state.moodOverride && now < state.moodOverride.until ? state.moodOverride.name : state.mood;
      applyMood(mood);
      var lid = MOODS[mood].lid;
      lid += (21 - lid) * blinkAmount(now);
      parts.lids.setAttribute("transform", "translate(0 " + lid.toFixed(2) + ")");

      // 4. Lumière de l'écran et curseur
      state.glow *= 0.96;
      parts.glow.setAttribute("opacity", (0.16 + 0.1 * state.glow).toFixed(3));
      parts.faceLight.setAttribute("opacity", (0.75 + 0.25 * state.glow).toFixed(3));
      cursor.classList.toggle("is-blink", now - state.lastKey > 500);

      requestAnimationFrame(frame);
    }

    // ----------------------------------------------------------------
    // Interactions : souris et clic
    // ----------------------------------------------------------------
    function toSvgPoint(event) {
      var pt = svg.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    var hero = svg.closest(".tssr-home-hero") || svg;
    hero.addEventListener("pointermove", function (event) {
      var p = toSvgPoint(event);
      state.pointer = { x: p.x, y: p.y, until: performance.now() + 1500 };
    });
    hero.addEventListener("pointerleave", function () { state.pointer = null; });

    svg.addEventListener("click", function () {
      var now = performance.now();
      state.moodOverride = { name: "surprised", until: now + 350 };
      setTimeout(function () {
        state.moodOverride = { name: "happy", until: performance.now() + 2200 };
        say(pick(GREETINGS));
      }, 350);
      state.viewerUntil = now + 2500;
      state.pointer = null;
    });

    scheduleBlink(performance.now());
    requestAnimationFrame(frame);
    run();
  }

  // Version immobile (réglage « réduire les animations » du système)
  function startStill(svg) {
    svg.querySelector("#bo-lids").classList.remove("bo-blink");
  }

  // ------------------------------------------------------------------
  // Remplace l'<img> par le SVG pour pouvoir l'animer
  // ------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    var img = document.querySelector("img.tssr-home-buddy");
    if (!img || !window.fetch) return;

    fetch(img.currentSrc || img.src)
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.text();
      })
      .then(function (text) {
        var doc = new DOMParser().parseFromString(text, "image/svg+xml");
        if (doc.querySelector("parsererror")) throw new Error("SVG invalide");
        var svg = document.importNode(doc.documentElement, true);
        img.classList.forEach(function (c) { svg.classList.add(c); });
        img.replaceWith(svg);
        if (reduceMotion) startStill(svg);
        else start(svg);
      })
      .catch(function (error) {
        console.warn("bonhomme.js : on garde l'image fixe", error);   // l'<img> reste affichée
      });
  });
})();
