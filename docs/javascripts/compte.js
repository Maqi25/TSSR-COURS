/**
 * compte.js
 * ---------------------------------------------------------------------
 * Compte personnel (e-mail + mot de passe) et sauvegarde en ligne de tes
 * données de révision, avec Supabase (styles : stylesheets/compte.css).
 *
 * CE QUI EST SAUVEGARDÉ (clés du navigateur, voir CLES ci-dessous) :
 *   suivi des TP, profils et meilleurs scores du QCM examen, planning de
 *   révision, pages consultées, couleur du site.
 *
 * PRINCIPE « le navigateur d'abord » :
 *   - les autres scripts continuent d'écrire dans localStorage, comme avant ;
 *   - ce script repère ces écritures et les envoie au compte 1,5 s après ;
 *   - à chaque page ouverte, il récupère ce qui a changé ailleurs (autre
 *     ordinateur, téléphone) ;
 *   - à la connexion, les données du compte remplacent celles du navigateur,
 *     sauf si le compte est encore vide : on y envoie alors celles du navigateur.
 *
 * Aucune bibliothèque externe : on parle directement à l'API de Supabase.
 * Configuration : compte-config.js. Mise en place : supabase/LISEZMOI.md.
 * ---------------------------------------------------------------------
 */
(function () {
  "use strict";

  var CFG = window.TSSR_SUPABASE || {};
  if (!CFG.url || !CFG.anonKey) return;           // comptes désactivés
  var URL_API = CFG.url.replace(/\/+$/, "");

  var CLES = [
    "tssr-suivi-tp",
    "tssr-qcm-examen-profils",
    "tssr-qcm-examen-meilleurs",
    "tssr-planning-revision",
    "tssr-visited-pages",
    "tssr-recent-pages",
    "tssr-theme",
    "tssr-avatar",
  ];
  var AVATAR_KEY = "tssr-avatar";
  var NB_AVATARS = 5;            // images docs/assets/avatars/avatar-1.webp … avatar-5.webp
  var SESSION_KEY = "tssr-compte-session";
  var META_KEY = "tssr-compte-sync";

  // ------------------------------------------------------------------
  // Écoute des écritures dans localStorage
  // ------------------------------------------------------------------
  var orig = {
    set: Storage.prototype.setItem,
    remove: Storage.prototype.removeItem,
    get: Storage.prototype.getItem,
  };
  var applique = false;   // vrai pendant qu'on écrit des données venues du compte

  Storage.prototype.setItem = function (k, v) {
    orig.set.call(this, k, v);
    if (this === window.localStorage && !applique && CLES.indexOf(k) >= 0) modifie(k);
  };
  Storage.prototype.removeItem = function (k) {
    orig.remove.call(this, k);
    if (this === window.localStorage && !applique && CLES.indexOf(k) >= 0) modifie(k);
  };

  function lireJSON(k, defaut) {
    try { return JSON.parse(orig.get.call(localStorage, k)) || defaut; } catch (e) { return defaut; }
  }
  function ecrireJSON(k, v) {
    try { orig.set.call(localStorage, k, JSON.stringify(v)); } catch (e) {}
  }

  // empreinte d'une valeur (pour savoir si elle a changé depuis la dernière synchro)
  function empreinte(s) {
    if (s === null || s === undefined) return "null";
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16) + ":" + s.length;
  }

  // meta = { user: id, cles: { cle: { h: empreinte synchro, at: date serveur, dirty: date modif locale } } }
  function meta() {
    var m = lireJSON(META_KEY, {});
    var s = session();
    if (!s || m.user !== s.user.id) m = { user: s ? s.user.id : null, cles: {} };
    m.cles = m.cles || {};
    return m;
  }
  function sauverMeta(m) { ecrireJSON(META_KEY, m); }

  // ------------------------------------------------------------------
  // Appels à Supabase
  // ------------------------------------------------------------------
  function session() { return lireJSON(SESSION_KEY, null); }
  function sauverSession(s) {
    if (s && !s.expires_at) s.expires_at = Math.floor(Date.now() / 1000) + (s.expires_in || 3600);
    if (s) ecrireJSON(SESSION_KEY, s); else orig.remove.call(localStorage, SESSION_KEY);
  }

  function api(chemin, options) {
    options = options || {};
    // la clé du projet va dans « apikey » ; « Authorization » ne porte que le jeton
    // de l'utilisateur connecté (les clés « sb_publishable_… » n'y sont pas acceptées)
    var headers = { apikey: CFG.anonKey, "Content-Type": "application/json" };
    if (options.jeton) headers.Authorization = "Bearer " + options.jeton;
    if (options.prefer) headers.Prefer = options.prefer;
    return fetch(URL_API + chemin, {
      method: options.method || "GET",
      headers: headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      keepalive: !!options.keepalive,
    }).catch(function (e) {
      throw new Error(traduire(e.message || "Failed to fetch"));
    }).then(function (r) {
      return r.text().then(function (t) {
        var data = null;
        try { data = t ? JSON.parse(t) : null; } catch (e) { data = t; }
        if (!r.ok) {
          var msg = (data && (data.msg || data.error_description || data.message || data.error)) || ("Erreur " + r.status);
          var err = new Error(traduire(msg));
          err.status = r.status;
          throw err;
        }
        return data;
      });
    });
  }

  function traduire(msg) {
    var t = {
      "Invalid login credentials": "E-mail ou mot de passe incorrect.",
      "Email not confirmed": "Confirme d'abord ton adresse : clique sur le lien reçu par e-mail.",
      "User already registered": "Un compte existe déjà avec cet e-mail : connecte-toi.",
      "Signups not allowed for this instance": "La création de nouveaux comptes est fermée.",
    };
    if (t[msg]) return t[msg];
    if (/Failed to fetch|NetworkError|Load failed/i.test(msg)) return "Serveur injoignable : vérifie ta connexion Internet.";
    if (/at least 6 characters|Password should be/i.test(msg)) return "Le mot de passe doit faire au moins 6 caractères.";
    if (/valid email|invalid format/i.test(msg)) return "Cette adresse e-mail n'est pas valide.";
    if (/rate limit|security purposes/i.test(msg)) return "Trop de tentatives : réessaie dans quelques minutes.";
    return msg;
  }

  // jeton valide (renouvelé s'il expire dans moins d'une minute)
  var renouvellement = null;
  function jeton() {
    var s = session();
    if (!s) return Promise.reject(new Error("Non connecté"));
    if (s.expires_at * 1000 > Date.now() + 60000) return Promise.resolve(s.access_token);
    if (!renouvellement) {
      renouvellement = api("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: s.refresh_token } })
        .then(function (n) { sauverSession(n); return n.access_token; })
        .catch(function (e) {
          if (e.status === 400 || e.status === 401) { sauverSession(null); majUI(); }   // session expirée
          throw e;
        })
        .finally(function () { renouvellement = null; });
    }
    return renouvellement;
  }

  function adresseRetour() { return location.href.split("#")[0]; }

  // ------------------------------------------------------------------
  // Synchronisation
  // ------------------------------------------------------------------
  var etatSync = { texte: "", erreur: false };
  var enAttente = {}, minuterie = null;

  function modifie(k) {
    if (!session()) return;
    var m = meta();
    m.cles[k] = m.cles[k] || {};
    m.cles[k].dirty = new Date().toISOString();
    sauverMeta(m);
    enAttente[k] = true;
    clearTimeout(minuterie);
    minuterie = setTimeout(function () { envoyer(Object.keys(enAttente)); }, 1500);
  }

  function envoyer(cles, keepalive) {
    enAttente = {};
    clearTimeout(minuterie);
    var s = session();
    if (!s || !cles.length) return Promise.resolve();
    var maintenant = new Date().toISOString();
    var lignes = cles.map(function (k) {
      return { user_id: s.user.id, key: k, value: orig.get.call(localStorage, k), updated_at: maintenant };
    });
    statut("☁️ Envoi…");
    return jeton().then(function (j) {
      return api("/rest/v1/user_data?on_conflict=user_id,key", {
        method: "POST", jeton: j, body: lignes, keepalive: keepalive,
        prefer: "resolution=merge-duplicates,return=minimal",
      });
    }).then(function () {
      var m = meta();
      lignes.forEach(function (l) { m.cles[l.key] = { h: empreinte(l.value), at: maintenant, dirty: null }; });
      sauverMeta(m);
      statut("☁️ Sauvegardé à " + heure());
    }).catch(function (e) {
      cles.forEach(function (k) { enAttente[k] = true; });   // on réessaiera
      statut("⚠️ Sauvegarde impossible : " + e.message, true);
    });
  }

  // récupère le compte et fusionne ; renvoie true si des données locales ont changé
  function synchroniser() {
    var s = session();
    if (!s) return Promise.resolve(false);
    statut("🔄 Synchronisation…");
    return jeton().then(function (j) {
      return api("/rest/v1/user_data?select=key,value,updated_at", { jeton: j });
    }).then(function (lignes) {
      var serveur = {};
      (lignes || []).forEach(function (l) { serveur[l.key] = l; });
      var m = meta(), aEnvoyer = [], change = false;
      CLES.forEach(function (k) {
        var local = orig.get.call(localStorage, k);
        var mk = m.cles[k] || {};
        var sv = serveur[k];
        if (!sv) { if (local !== null) aEnvoyer.push(k); return; }
        if (sv.value === local) { m.cles[k] = { h: empreinte(local), at: sv.updated_at, dirty: null }; return; }
        var localChange = !!mk.dirty || (mk.h !== undefined && empreinte(local) !== mk.h);
        var serveurChange = !mk.at || new Date(sv.updated_at) > new Date(mk.at);
        var prendreServeur = localChange && serveurChange
          ? new Date(sv.updated_at) >= new Date(mk.dirty || 0)
          : !localChange;
        if (prendreServeur) {
          applique = true;
          if (sv.value === null) orig.remove.call(localStorage, k); else orig.set.call(localStorage, k, sv.value);
          applique = false;
          m.cles[k] = { h: empreinte(sv.value), at: sv.updated_at, dirty: null };
          change = true;
        } else {
          aEnvoyer.push(k);
        }
      });
      sauverMeta(m);
      statut("☁️ Synchronisé à " + heure());
      return (aEnvoyer.length ? envoyer(aEnvoyer) : Promise.resolve()).then(function () { return change; });
    }).catch(function (e) {
      statut("⚠️ Synchronisation impossible : " + e.message, true);
      return false;
    });
  }

  // envoi de secours quand on quitte la page avec une écriture en attente
  addEventListener("pagehide", function () {
    var cles = Object.keys(enAttente);
    if (cles.length) envoyer(cles, true);
  });

  // ------------------------------------------------------------------
  // Connexion, création, déconnexion, mot de passe
  // ------------------------------------------------------------------
  function seConnecter(email, mdp) {
    return api("/auth/v1/token?grant_type=password", { method: "POST", body: { email: email, password: mdp } })
      .then(apresConnexion);
  }

  function creerCompte(email, mdp) {
    return api("/auth/v1/signup?redirect_to=" + encodeURIComponent(adresseRetour()), {
      method: "POST", body: { email: email, password: mdp },
    }).then(function (r) {
      if (r && r.access_token) return apresConnexion(r);
      return "confirmer";   // confirmation par e-mail activée
    });
  }

  function apresConnexion(s) {
    sauverSession(s);
    orig.remove.call(localStorage, META_KEY);     // nouvelle session : le compte fait foi
    return synchroniser().then(function () { location.reload(); });
  }

  function seDeconnecter(effacer) {
    var cles = Object.keys(enAttente);
    var avant = cles.length ? envoyer(cles) : Promise.resolve();
    return avant.then(function () {
      var s = session();
      if (s) api("/auth/v1/logout", { method: "POST", jeton: s.access_token }).catch(function () {});
      sauverSession(null);
      orig.remove.call(localStorage, META_KEY);
      if (effacer) { applique = true; CLES.forEach(function (k) { orig.remove.call(localStorage, k); }); applique = false; }
      location.reload();
    });
  }

  function motDePasseOublie(email) {
    return api("/auth/v1/recover?redirect_to=" + encodeURIComponent(adresseRetour()), {
      method: "POST", body: { email: email },
    });
  }

  function changerMotDePasse(mdp) {
    return jeton().then(function (j) {
      return api("/auth/v1/user", { method: "PUT", jeton: j, body: { password: mdp } });
    });
  }

  // retour d'un lien reçu par e-mail : #access_token=…&type=signup|recovery
  function lienEmail() {
    if (location.hash.indexOf("access_token=") < 0 && location.hash.indexOf("error_description=") < 0) return null;
    var p = {};
    location.hash.slice(1).split("&").forEach(function (kv) {
      var i = kv.indexOf("=");
      if (i > 0) p[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, " "));
    });
    history.replaceState(null, "", location.pathname + location.search);
    if (p.error_description) return { erreur: p.error_description };
    var s = { access_token: p.access_token, refresh_token: p.refresh_token, expires_in: Number(p.expires_in) || 3600 };
    return api("/auth/v1/user", { jeton: s.access_token }).then(function (u) {
      s.user = u;
      sauverSession(s);
      return { type: p.type };
    });
  }

  // ------------------------------------------------------------------
  // Interface : bouton 👤 dans l'en-tête et son panneau
  // ------------------------------------------------------------------
  var ui = {};
  var ICONE_PERSONNE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.5-8 5.5V21h16v-1.5c0-3-3.6-5.5-8-5.5z"/></svg>';

  // ---------- avatar du profil ----------
  function urlSite(chemin) {
    var base = ".";
    try { base = JSON.parse(document.getElementById("__config").textContent).base || "."; } catch (e) { /* défaut */ }
    return base.replace(/\/$/, "") + "/" + chemin;
  }
  function avatarChoisi() {
    var n = parseInt(orig.get.call(localStorage, AVATAR_KEY), 10);
    return n >= 1 && n <= NB_AVATARS ? n : 0;
  }
  function imgAvatar(n, alt) {
    return n ? '<img src="' + urlSite("assets/avatars/avatar-" + n + ".webp") + '" alt="' + (alt || "") + '" width="256" height="256">' : ICONE_PERSONNE;
  }
  function majBouton() {
    if (!ui.visage) return;
    var n = avatarChoisi();
    ui.visage.innerHTML = imgAvatar(n);
    ui.bouton.classList.toggle("a-avatar", !!n);
  }

  // clic sur l'avatar : il rebondit, content, et une bulle 😄 s'envole avec quelques étincelles
  var HUMEURS = ["😄", "😊", "😁", "🤩", "😎"];
  function reagir() {
    var b = ui.bouton;
    b.classList.remove("is-content");
    void b.offsetWidth;                 // relance l'animation même sur des clics rapprochés
    b.classList.add("is-content");
    clearTimeout(b._minuterie);
    b._minuterie = setTimeout(function () { b.classList.remove("is-content"); }, 900);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var bulle = document.createElement("span");
    bulle.className = "tssr-compte-humeur";
    bulle.setAttribute("aria-hidden", "true");
    bulle.textContent = HUMEURS[Math.floor(Math.random() * HUMEURS.length)];
    b.appendChild(bulle);
    for (var i = 0; i < 5; i++) {
      var e = document.createElement("span");
      e.className = "tssr-compte-etincelle";
      e.setAttribute("aria-hidden", "true");
      var angle = (-150 + i * 30) * Math.PI / 180;
      e.style.setProperty("--dx", Math.round(Math.cos(angle) * 26) + "px");
      e.style.setProperty("--dy", Math.round(Math.sin(angle) * 26) + "px");
      b.appendChild(e);
    }
    setTimeout(function () {
      b.querySelectorAll(".tssr-compte-humeur, .tssr-compte-etincelle").forEach(function (n) { n.remove(); });
    }, 1100);
  }

  function heure() { return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }

  function statut(texte, erreur) {
    etatSync = { texte: texte, erreur: !!erreur };
    if (ui.statut) {
      ui.statut.textContent = texte;
      ui.statut.classList.toggle("is-erreur", !!erreur);
    }
  }

  function message(texte, type) {
    if (!ui.message) return;
    ui.message.textContent = texte || "";
    ui.message.className = "tssr-compte-msg" + (type ? " is-" + type : "");
  }

  function ouvrir(oui) {
    // à l'ouverture, on recalcule le panneau : un QCM ou un TP a pu être fait depuis le chargement de la page
    if (oui && !ui.menu.classList.contains("is-open") && session()) vueConnecte();
    ui.menu.classList.toggle("is-open", oui);
    ui.bouton.setAttribute("aria-expanded", String(oui));
  }

  function occupe(form, oui) {
    form.querySelectorAll("button, input").forEach(function (el) { el.disabled = oui; });
  }

  function vueConnexion() {
    ui.corps.innerHTML =
      '<p class="tssr-compte-titre">Mon compte</p>' +
      '<p class="tssr-compte-intro">Connecte-toi pour sauvegarder tes TP, tes QCM et ton planning, et les retrouver sur tous tes appareils.</p>' +
      '<form class="tssr-compte-form">' +
      '<label>E-mail<input type="email" name="email" autocomplete="username" required></label>' +
      '<label>Mot de passe<input type="password" name="mdp" autocomplete="current-password" minlength="6" required></label>' +
      '<div class="tssr-compte-actions">' +
      '<button type="submit" class="md-button md-button--primary" data-action="connexion">Se connecter</button>' +
      '<button type="submit" class="md-button" data-action="creation">Créer un compte</button>' +
      "</div>" +
      '<button type="button" class="tssr-compte-lien" data-action="oubli">Mot de passe oublié ?</button>' +
      "</form>" +
      '<p class="tssr-compte-msg"></p>';
    ui.message = ui.corps.querySelector(".tssr-compte-msg");
    var form = ui.corps.querySelector("form");
    var action = "connexion";
    form.querySelectorAll("[data-action]").forEach(function (b) {
      b.addEventListener("click", function () { action = b.dataset.action; });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.email.value.trim(), mdp = form.mdp.value;
      occupe(form, true);
      message(action === "creation" ? "Création du compte…" : "Connexion…");
      var p = action === "creation" ? creerCompte(email, mdp) : seConnecter(email, mdp);
      p.then(function (r) {
        if (r === "confirmer") {
          message("📧 Compte créé ! Clique sur le lien reçu par e-mail pour le confirmer, puis connecte-toi.", "ok");
          occupe(form, false);
        }
      }).catch(function (err) { message(err.message, "erreur"); occupe(form, false); });
    });
    form.querySelector('[data-action="oubli"]').addEventListener("click", function () {
      var email = form.email.value.trim();
      if (!email) { message("Tape d'abord ton e-mail, puis reclique sur « Mot de passe oublié ? ».", "erreur"); form.email.focus(); return; }
      occupe(form, true);
      motDePasseOublie(email)
        .then(function () { message("📧 Si un compte existe, un lien pour choisir un nouveau mot de passe vient d'être envoyé à " + email + ".", "ok"); })
        .catch(function (err) { message(err.message, "erreur"); })
        .finally(function () { occupe(form, false); });
    });
  }

  // petit bilan de ce qui est sauvegardé : TP refaits et QCM examen du profil actif
  function resumeHTML() {
    var tp = lireJSON("tssr-suivi-tp", {});
    var ids = Object.keys(tp);
    var maitrises = ids.filter(function (id) { return tp[id][0] && tp[id][0].r === "ok"; }).length;
    var base = lireJSON("tssr-qcm-examen-profils", {});
    var profils = base.profils || {};
    var p = profils[base.actif] || profils[Object.keys(profils)[0]];
    var tent = (p && p.tentatives) || [];
    var der = tent.slice(-5).map(function (t) { return t.pct; });
    var moy = der.length ? Math.round(der.reduce(function (a, b) { return a + b; }, 0) / der.length) : null;
    return '<div class="tssr-compte-resume">' +
      "<div><b>🛠️ " + ids.length + "</b><span>TP refait" + (ids.length > 1 ? "s" : "") + " · " + maitrises + " maîtrisé" + (maitrises > 1 ? "s" : "") + "</span></div>" +
      "<div><b>🎯 " + tent.length + "</b><span>QCM passé" + (tent.length > 1 ? "s" : "") +
      (moy !== null ? " · moy. " + moy + " %" : "") + "</span></div>" +
      "</div>";
  }

  function vueConnecte() {
    var s = session();
    ui.corps.innerHTML =
      '<p class="tssr-compte-titre">Mon compte</p>' +
      '<div class="tssr-compte-profil">' +
      '<button type="button" class="tssr-compte-avatar" data-action="avatar" title="Changer d\'avatar">' +
      imgAvatar(avatarChoisi(), "Mon avatar") + '<span aria-hidden="true">✏️</span></button>' +
      '<div><p class="tssr-compte-qui"><strong></strong></p><p class="tssr-compte-statut"></p></div>' +
      "</div>" +
      '<div class="tssr-compte-avatars" hidden><p>Choisis ton avatar</p><div>' +
      (function () {
        var h = "", n = avatarChoisi();
        for (var i = 1; i <= NB_AVATARS; i++) {
          h += '<button type="button" data-avatar="' + i + '" aria-pressed="' + (i === n) + '" aria-label="Avatar ' + i + '">' + imgAvatar(i) + "</button>";
        }
        return h + '<button type="button" data-avatar="0" aria-pressed="' + (n === 0) + '" aria-label="Pas d\'avatar">' + ICONE_PERSONNE + "</button>";
      })() +
      "</div></div>" +
      resumeHTML() +
      '<div class="tssr-compte-actions">' +
      '<button type="button" class="md-button md-button--primary" data-action="sync">🔄 Synchroniser</button>' +
      '<button type="button" class="md-button" data-action="mdp">🔑 Mot de passe</button>' +
      "</div>" +
      '<form class="tssr-compte-form" hidden data-zone="mdp">' +
      '<label>Nouveau mot de passe<input type="password" name="mdp" autocomplete="new-password" minlength="6" required></label>' +
      '<button type="submit" class="md-button md-button--primary">Enregistrer</button>' +
      "</form>" +
      '<label class="tssr-compte-case"><input type="checkbox" data-zone="effacer"> Effacer mes données de ce navigateur (ordinateur partagé)</label>' +
      '<button type="button" class="md-button tssr-compte-sortie" data-action="sortie">Se déconnecter</button>' +
      '<p class="tssr-compte-msg"></p>';
    ui.corps.querySelector(".tssr-compte-qui strong").textContent = (s.user && s.user.email) || "connecté";
    ui.statut = ui.corps.querySelector(".tssr-compte-statut");
    ui.message = ui.corps.querySelector(".tssr-compte-msg");
    statut(etatSync.texte || "☁️ Données sauvegardées sur ton compte", etatSync.erreur);

    var choix = ui.corps.querySelector(".tssr-compte-avatars");
    ui.corps.querySelector('[data-action="avatar"]').addEventListener("click", function () {
      choix.hidden = !choix.hidden;
    });
    choix.querySelectorAll("[data-avatar]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = Number(b.dataset.avatar);
        if (n) localStorage.setItem(AVATAR_KEY, String(n)); else localStorage.removeItem(AVATAR_KEY);   // synchronisé
        majBouton();
        vueConnecte();
      });
    });

    ui.corps.querySelector('[data-action="sync"]').addEventListener("click", function () {
      synchroniser().then(function (change) {
        if (change) location.reload();
      });
    });
    var formMdp = ui.corps.querySelector('[data-zone="mdp"]');
    ui.corps.querySelector('[data-action="mdp"]').addEventListener("click", function () {
      formMdp.hidden = !formMdp.hidden;
      if (!formMdp.hidden) formMdp.mdp.focus();
    });
    formMdp.addEventListener("submit", function (e) {
      e.preventDefault();
      occupe(formMdp, true);
      changerMotDePasse(formMdp.mdp.value)
        .then(function () { message("✅ Mot de passe modifié.", "ok"); formMdp.hidden = true; formMdp.reset(); })
        .catch(function (err) { message(err.message, "erreur"); })
        .finally(function () { occupe(formMdp, false); });
    });
    ui.corps.querySelector('[data-action="sortie"]').addEventListener("click", function () {
      seDeconnecter(ui.corps.querySelector('[data-zone="effacer"]').checked);
    });
  }

  function majUI() {
    if (!ui.corps) return;
    var connecte = !!session();
    ui.bouton.classList.toggle("is-connecte", connecte);
    ui.bouton.title = connecte ? "Mon compte (connecté)" : "Se connecter";
    if (connecte) vueConnecte(); else vueConnexion();
  }

  function installerUI() {
    var header = document.querySelector(".md-header__inner");
    if (!header) return;
    var wrap = document.createElement("div");
    wrap.className = "tssr-compte";
    wrap.innerHTML =
      '<button type="button" class="tssr-compte-btn" aria-expanded="false" aria-label="Mon compte">' +
      '<span class="tssr-compte-visage"></span>' +
      '<span class="tssr-compte-point"></span></button>' +
      '<div class="tssr-compte-menu" role="dialog" aria-label="Mon compte"><div class="tssr-compte-corps"></div></div>';
    ui.bouton = wrap.querySelector(".tssr-compte-btn");
    ui.menu = wrap.querySelector(".tssr-compte-menu");
    ui.corps = wrap.querySelector(".tssr-compte-corps");
    ui.visage = wrap.querySelector(".tssr-compte-visage");
    majBouton();

    ui.bouton.addEventListener("click", function (e) {
      e.stopPropagation();
      if (avatarChoisi()) reagir();
      ouvrir(!ui.menu.classList.contains("is-open"));
    });
    ui.menu.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", function () { ouvrir(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") ouvrir(false); });

    var repere = header.querySelector(".tssr-theme-picker") || header.querySelector('[data-md-component="palette"]') || header.querySelector(".md-search");
    header.insertBefore(wrap, repere);
    majUI();
  }

  function bandeau(texte, bouton, action) {
    var b = document.createElement("div");
    b.className = "tssr-compte-bandeau";
    b.innerHTML = "<span></span>";
    b.firstChild.textContent = texte;
    if (bouton) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "md-button md-button--primary";
      btn.textContent = bouton;
      btn.addEventListener("click", action);
      b.appendChild(btn);
    }
    var x = document.createElement("button");
    x.type = "button";
    x.className = "tssr-compte-fermer";
    x.setAttribute("aria-label", "Fermer");
    x.textContent = "✕";
    x.addEventListener("click", function () { b.remove(); });
    b.appendChild(x);
    document.body.appendChild(b);
  }

  // ------------------------------------------------------------------
  // Démarrage
  // ------------------------------------------------------------------
  function demarrer() {
    installerUI();
    var retour = lienEmail();
    if (retour) {
      Promise.resolve(retour).then(function (r) {
        majUI();
        if (r.erreur) { ouvrir(true); message("⚠️ " + r.erreur, "erreur"); return; }
        if (r.type === "recovery") {
          ouvrir(true);
          ui.corps.querySelector('[data-zone="mdp"]').hidden = false;
          message("Choisis ton nouveau mot de passe ci-dessus.", "ok");
          return;
        }
        orig.remove.call(localStorage, META_KEY);
        synchroniser().then(function () { location.reload(); });
      }).catch(function (e) { ouvrir(true); message("⚠️ " + e.message, "erreur"); });
      return;
    }
    if (session()) {
      synchroniser().then(function (change) {
        if (change) bandeau("🔄 Tes données ont été mises à jour depuis ton compte.", "Recharger la page", function () { location.reload(); });
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
