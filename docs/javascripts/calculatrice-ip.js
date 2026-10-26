/**
 * calculatrice-ip.js
 * ---------------------------------------------------------------------
 * Calculatrice IPv4 interactive (cours 1, module 3).
 *
 * UTILISATION dans une page Markdown :
 *   <div class="tssr-calc" data-ip="192.168.10.77/26"></div>
 *   → le script trouve tous les .tssr-calc de la page et y construit
 *     un champ de saisie + les résultats, recalculés à chaque frappe.
 *
 * L'IDÉE CLÉ : une adresse IPv4 n'est qu'un nombre de 32 bits.
 *   192.168.1.10  =  11000000 10101000 00000001 00001010  =  3 232 235 786
 *   Une fois l'adresse transformée en nombre, le calcul du module 3
 *   (IP ET masque) se fait avec les opérateurs « bit à bit » de JavaScript :
 *     &   ET     (1 seulement si les deux bits valent 1)
 *     |   OU     (1 si au moins un des deux bits vaut 1)
 *     ~   NON    (inverse chaque bit : 0 ↔ 1)
 *     <<  décale les bits vers la gauche
 *   Piège JS : ces opérateurs renvoient un nombre SIGNÉ (négatif si le
 *   1er bit vaut 1). « >>> 0 » le remet en nombre positif de 32 bits.
 * ---------------------------------------------------------------------
 */

window.TSSRCalcIP = (function () {
  // "192.168.1.10" → 3232235786 (les 4 octets mis bout à bout)
  function ipToInt(octets) {
    return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  }

  // 3232235786 → "192.168.1.10" (on découpe le nombre en 4 paquets de 8 bits)
  function intToIp(n) {
    return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  }

  // /26 → 26 bits à 1 suivis de 6 bits à 0 → 255.255.255.192
  function cidrToMask(cidr) {
    if (cidr === 0) return 0; // cas particulier : un décalage de 32 ne fait rien en JS
    return (0xffffffff << (32 - cidr)) >>> 0;
  }

  // Lit "192.168.1.10/24" (ou "192.168.1.10 255.255.255.0") ; renvoie null si invalide
  function parse(text) {
    var m = text.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\s*(?:\/\s*(\d{1,2})|\s+([\d.]+))$/);
    if (!m) return null;

    var octets = m.slice(1, 5).map(Number);
    if (octets.some(function (o) { return o > 255; })) return null;

    var cidr;
    if (m[5] !== undefined) {
      cidr = Number(m[5]);
    } else {
      // Masque écrit en décimal : on compte ses bits à 1 et on vérifie
      // qu'il est bien de la forme 111…000 (sinon ce n'est pas un masque)
      var maskOctets = m[6].split(".").map(Number);
      if (maskOctets.length !== 4 || maskOctets.some(function (o) { return o > 255; })) return null;
      var maskBits = ipToInt(maskOctets).toString(2).padStart(32, "0");
      if (maskBits.indexOf("01") !== -1) return null;
      cidr = maskBits.indexOf("0") === -1 ? 32 : maskBits.indexOf("0");
    }
    if (cidr > 32) return null;

    return { ip: ipToInt(octets), cidr: cidr, firstOctet: octets[0] };
  }

  function classOf(first) {
    if (first === 127) return "Boucle locale (127)";
    if (first === 0) return "Réservée (0)";
    if (first <= 126) return "A";
    if (first <= 191) return "B";
    if (first <= 223) return "C";
    if (first <= 239) return "D (multicast)";
    return "E (expérimental)";
  }

  // Une adresse est dans une plage si (adresse ET masque de la plage) = réseau de la plage
  function inRange(ip, rangeIp, rangeCidr) {
    var mask = cidrToMask(rangeCidr);
    return ((ip & mask) >>> 0) === ((ipToInt(rangeIp) & mask) >>> 0);
  }

  function typeOf(ip) {
    if (inRange(ip, [10, 0, 0, 0], 8)) return "Privée (10.0.0.0/8)";
    if (inRange(ip, [172, 16, 0, 0], 12)) return "Privée (172.16.0.0/12)";
    if (inRange(ip, [192, 168, 0, 0], 16)) return "Privée (192.168.0.0/16)";
    if (inRange(ip, [169, 254, 0, 0], 16)) return "APIPA : pas de réponse DHCP";
    if (inRange(ip, [127, 0, 0, 0], 8)) return "Boucle locale";
    return "Publique";
  }

  // Les 32 bits de l'adresse, partie réseau en bleu et partie hôte en rose
  function binaryHtml(n, cidr) {
    var bits = n.toString(2).padStart(32, "0");
    var html = "";
    for (var i = 0; i < 32; i++) {
      if (i > 0 && i % 8 === 0) html += ".";
      html += '<span class="' + (i < cidr ? "is-net" : "is-host") + '">' + bits[i] + "</span>";
    }
    return html;
  }

  function compute(parsed) {
    var mask = cidrToMask(parsed.cidr);
    var network = (parsed.ip & mask) >>> 0;     // IP ET masque : on garde la partie réseau
    var broadcast = (network | ~mask) >>> 0;    // partie hôte forcée à 1
    var hostBits = 32 - parsed.cidr;

    var hosts, range;
    if (parsed.cidr === 32) {
      hosts = "1 (une seule machine)";
      range = intToIp(network);
    } else if (parsed.cidr === 31) {
      hosts = "2 (cas particulier : liaison point à point)";
      range = intToIp(network) + " → " + intToIp(broadcast);
    } else {
      hosts = (Math.pow(2, hostBits) - 2).toLocaleString("fr-FR") + "  (2" + toSup(hostBits) + " − 2)";
      range = intToIp(network + 1) + " → " + intToIp(broadcast - 1);
    }

    // Le « pas » se lit sur l'octet qui contient le dernier bit à 1 du masque
    // (/26 → 4ᵉ octet, 192 → pas de 64 ; /16 → 2ᵉ octet, 255 → pas de 1)
    var maskOctets = intToIp(mask).split(".").map(Number);
    var cut = Math.floor((parsed.cidr - 1) / 8);
    var step = parsed.cidr === 0 ? "—" :
      (256 - maskOctets[cut]) + " (sur le " + (cut + 1) + (cut === 0 ? "ᵉʳ" : "ᵉ") + " octet)";

    return [
      ["Masque", intToIp(mask) + "  (/" + parsed.cidr + ")"],
      ["Pas", step],
      ["Adresse réseau", intToIp(network)],
      ["Broadcast", intToIp(broadcast)],
      ["Plage d'hôtes", range],
      ["Hôtes utilisables", hosts],
      ["Classe", classOf(parsed.firstOctet)],
      ["Type", typeOf(parsed.ip)],
    ];
  }

  function toSup(n) {
    var sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    return String(n).split("").map(function (d) { return sup[d]; }).join("");
  }

  function render(root, text) {
    var out = root.querySelector(".tssr-calc-out");
    var parsed = parse(text);
    if (!parsed) {
      out.innerHTML = '<p class="tssr-calc-error">Format attendu : <code>192.168.1.10/24</code> ou <code>192.168.1.10 255.255.255.0</code></p>';
      return;
    }

    var rows = compute(parsed).map(function (row) {
      return "<dt>" + row[0] + "</dt><dd>" + row[1] + "</dd>";
    }).join("");

    out.innerHTML =
      '<div class="tssr-calc-bin"><small>En binaire (réseau | hôte)</small><code>' +
      binaryHtml(parsed.ip, parsed.cidr) + "</code></div>" +
      "<dl>" + rows + "</dl>";
  }

  function init(root) {
    root.innerHTML =
      '<label class="tssr-calc-label">🧮 Tape une adresse et son masque' +
      '<input type="text" spellcheck="false" autocomplete="off"></label>' +
      '<div class="tssr-calc-out"></div>';

    var input = root.querySelector("input");
    input.value = root.dataset.ip || "192.168.1.10/24";
    // "input" se déclenche à chaque frappe : le résultat suit en direct
    input.addEventListener("input", function () { render(root, input.value); });
    render(root, input.value);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tssr-calc").forEach(init);
  });

  return { parse: parse, compute: compute };
})();
