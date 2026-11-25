/**
 * compte-config.js
 * ---------------------------------------------------------------------
 * Connexion du site à ton projet Supabase (voir supabase/LISEZMOI.md).
 *
 * Les deux valeurs se trouvent dans Supabase :
 *   Project Settings → API (ou Data API) → Project URL et clé « anon / public ».
 *
 * Ces valeurs sont faites pour être publiques : la clé « anon » ne donne
 * accès qu'à ce que les règles de sécurité (RLS) autorisent, c'est-à-dire
 * à ses propres données une fois connecté. Ne mets JAMAIS ici la clé
 * « service_role » (secrète).
 *
 * Laisse les deux valeurs vides pour désactiver les comptes : le site
 * fonctionne alors comme avant, avec les données dans le navigateur.
 * ---------------------------------------------------------------------
 */
window.TSSR_SUPABASE = {
  url: "",      // ex. "https://abcdefghijkl.supabase.co"
  anonKey: "",  // ex. "eyJhbGciOi..." ou "sb_publishable_..."
};
