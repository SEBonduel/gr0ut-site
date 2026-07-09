# GR0UT — Site vitrine (communauté WoT FR)

Site vitrine des clans **GR0UT · GR0VT · GR0UF**, orienté recrutement, avec
**stats live** des 3 clans (via l'API Wargaming). Statique, hébergé gratuitement
sur **Cloudflare Pages**.

🔗 **En ligne : https://gr0ut.pages.dev**

## Contenu
- Hero + pitch + CTA Discord
- Stats live (membres, batailles Carte Globale, provinces, clans)
- Les 3 clans (emblème, ELO, winrate, membres — en direct)
- Recrutement (critères + process)
- Communauté (Carte Globale, leaderboards, streams)

Données live servies par le Worker `gr0ut-globalmap` :
`https://gr0ut-globalmap.sebastien050599.workers.dev/api/clans`

## ⚙️ À personnaliser
Dans `assets/app.js`, remplace le lien d'invitation Discord :
```js
const DISCORD_INVITE = "https://discord.gg/XXXXXX";
```

## Déploiement
```bash
npx wrangler pages deploy . --project-name=gr0ut
```
(ou connecter ce repo à Cloudflare Pages pour un déploiement auto à chaque push.)

## Structure
- `index.html` — page unique
- `assets/styles.css` — design (thème sombre eSport)
- `assets/app.js` — reveal, compteurs, fond animé, fetch des stats live
