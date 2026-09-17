/**
 * Données du voyage de Manon,Mexique & Nicaragua
 * 3 septembre – 15 octobre 2026 (43 jours)
 *
 * ?jour=2026-10-01 dans l'URL force la date du jour.
 *
 * Les messages marqués [À REMPLIR] sont des textes de remplissage.
 */

export type Encre = "noir" | "rouge" | "ocre" | "vert"

export type Humeur = "soleil" | "nuage" | "pluie" | "orage" | "arc-en-ciel"

export interface Etape {
  id: number
  lieu: string
  datesAffichees: string
  unlock: string // "ouvert" ou date ISO
  pays: "mx" | "ni" | "vol" | "ch"
  illustration: string
  encre: Encre
  message: string
  coords: [number, number] // [lng, lat]
  funFact: string
  image: string // chemin vers l'image par défaut
}

export interface Porte {
  id: number
  situation: string
  texte: string
}

export interface JournalEntry {
  id: string
  date: string // ISO date YYYY-MM-DD
  etapeId: number
  texte: string
  humeur: Humeur | null
  photos: string[] // base64 data URLs
  createdAt: string
  updatedAt: string
  synced: boolean
}

export const COULEURS_ENCRE: Record<Encre, string> = {
  noir: "#1A1512",
  rouge: "#D6301F",
  ocre: "#E8A712",
  vert: "#1E7A4C",
}

export const HUMEUR_ICONS: Record<Humeur, string> = {
  soleil: "☀️",
  nuage: "☁️",
  pluie: "🌧️",
  orage: "⛈️",
  "arc-en-ciel": "🌈",
}

export const VOYAGE: Etape[] = [
  {
    id: 0,
    lieu: "Avant de partir",
    datesAffichees: "2 septembre",
    unlock: "ouvert",
    pays: "mx",
    illustration: "malle de voyage",
    encre: "noir",
    message:
      "Demain tu montes dans un avion et dans six semaines tu reviens. Entre les deux, il va se passer exactement ce que tu n'imagines pas encore. C'est un peu le principe lol. Profite de chaque seconde chou, même celles où tu stresses dans l'aéroport parce que t'as l'impression d'avoir oublié un truc. T'as rien oublié. Et si t'as oublié, tu trouveras sur place (j'espère t'as pas oublié mon pull..). Je suis fier de toi, Manon l'aventurière",
    coords: [6.6323, 46.5197], // Lausanne (départ)
    funFact: "Le Mexique compte plus de 200 000 espèces animales, c'est le 4e pays le plus biodiversifié au monde.",
    image: "/img/etape-00.jpg",
  },
  {
    id: 1,
    lieu: "Monterrey",
    datesAffichees: "3 au 8 septembre",
    unlock: "2026-09-03",
    pays: "mx",
    illustration: "cactus",
    encre: "rouge",
    message:
      "Tu y es. Le décalage horaire va te donner l'impression d'être très intelligente à 5h du matin et complètement foncdé à 15h. C'est normal, ça passe au bout de trois jours. Mange un truc, bois de l'eau, et laisse ton corps comprendre où il est. Monterrey c'est intense, c'est bruyant, c'est pas du tout la Suisse. Tant mieux. T'es pas venue pour retrouver la Suisse. Envoie-moi une photo de ce que tu manges, j'veux voir, tout voir !!! hashtag gourmand",
    coords: [-100.3161, 25.6866],
    funFact: "Monterrey est surnommée « la Sultane du Nord » et produit 80% de la bière mexicaine.",
    image: "/img/etape-01.jpg",
  },
  {
    id: 2,
    lieu: "Oaxaca",
    datesAffichees: "8 au 12 septembre",
    unlock: "2026-09-08",
    pays: "mx",
    illustration: "épi de maïs",
    encre: "ocre",
    message:
      "Oaxaca, c'est là que le Mexique commence à ressembler à ce que tu imaginais avant de venir. Les couleurs, les marchés, les gens qui te disent güera toutes les trente secondes. Goûte à tout, même les trucs que t'arrives pas à identifier (enfin tombe juste pas malade ça serait dommage avec ton petit ventre tout fragile). Et si tu tombes sur du mezcal, vas-y doucement. Ou pas. Mais tu pourras pas dire que je t'ai pas prévenue bb.",
    coords: [-96.7266, 17.0732],
    funFact: "Oaxaca est le berceau du mezcal, il existe plus de 30 variétés d'agave rien que dans cet état.",
    image: "/img/etape-02.jpg",
  },
  {
    id: 3,
    lieu: "Puerto Escondido",
    datesAffichees: "12 au 17 septembre",
    unlock: "2026-09-12",
    pays: "mx",
    illustration: "vague",
    encre: "rouge",
    message:
      "Tu es au bord du Pacifique et le son des vagues couvre à peu près tout, y compris les pensées inutiles. C'est fait pour ça. Pose-toi sur le sable, regarde l'horizon, et dis-toi que t'es à des milliers de kilomètres de tout ce qui te prend la tête d'habitude. Ici il va commencer à faire froid et gris ça gaz jtj. Toi, profite du soleil pour deux par pitié.",
    coords: [-97.0722, 15.8720],
    funFact: "Playa Zicatela est considérée comme le « Pipeline mexicain », les vagues atteignent 8 mètres.",
    image: "/img/etape-03.jpg",
  },
  {
    id: 4,
    lieu: "Mexico",
    datesAffichees: "17 au 24 septembre",
    unlock: "2026-09-17",
    pays: "mx",
    illustration: "serpent à plumes",
    encre: "ocre",
    message:
      "Une semaine dans la plus grande ville du continent. Tu vas te perdre, tu vas te retrouver, et tu vas manger les meilleurs tacos de ta vie à un endroit dont tu ne retiendras pas le nom (aussi te faire engueuler par Alex parce que tu as passé trop de temps à négocier ces magnets). Mexico ça a l'air trop ouf. Vingt millions de gens qui vivent ensemble sur un ancien lac et à 2000m d'altitude damn. Tu me raconteras !! Je suis trop curieux de Mexico City ça a toujours été une ville qui m'a fait vibrer je ne sais pas pourquoi haha",
    coords: [-99.1332, 19.4326],
    funFact: "Mexico s'enfonce de 10 cm par an parce qu'elle est construite sur un ancien lac aztèque.",
    image: "/img/etape-04.jpg",
  },
  {
    id: 5,
    lieu: "Vol pour Managua",
    datesAffichees: "24 septembre",
    unlock: "2026-09-24",
    pays: "vol",
    illustration: "oiseau en vol",
    encre: "rouge",
    message:
      "Tu changes de pays. Le Mexique c'est fini, le Nicaragua commence. Tout va être différent : plus petit, plus lent, plus vert. T'as déjà trois semaines dans les pattes, tu commences à savoir comment ça marche toi les voyages (tu me feras cours). Tu parles espagnol là ou toujours pas ?",
    coords: [-86.2504, 12.1364], // Managua (arrivée)
    funFact: "Le vol Mexico → Managua survole le Guatemala, le Salvador et le Honduras en 3 heures.",
    image: "/img/etape-05.jpg",
  },
  {
    id: 6,
    lieu: "Managua",
    datesAffichees: "24 au 27 septembre",
    unlock: "2026-09-25",
    pays: "ni",
    illustration: "palmier",
    encre: "vert",
    message:
      "Tu es chez des gens que tu ne connaissais pas il y a trois semaines et qui vont te traiter comme si tu faisais partie de la famille depuis toujours (j'espère sinon je débarque). Repose-toi chou, mais quand même attention au serpent, aux mygales, au jaguar et aux grenouilles multicolores parce que la jungle n'est vraiment pas loin là wow",
    coords: [-86.2504, 12.1364],
    funFact: "Managua est la seule capitale d'Amérique centrale sans vrai centre-ville, il a été détruit par un séisme en 1972.",
    image: "/img/etape-06.jpg",
  },
  {
    id: 7,
    lieu: "Ometepe",
    datesAffichees: "28 sept. au 2 oct.",
    unlock: "2026-09-28",
    pays: "ni",
    illustration: "volcan",
    encre: "ocre",
    message:
      "Une île avec deux volcans dans un lac. C'est tellement improbable que j'ai pas cru Wikipédia hahahaha. Mais tu y es, et j'espère que tu regardes autour de toi en te disant que c'est complètement dingue. Avec les volcans qui ont l'air tellement cliché qu'on dirait un dessin (je kiff découvrir tes destinations au fur et à mesure d'écrire ces petits textes hahaha)",
    coords: [-85.5478, 11.4849],
    funFact: "L'île d'Ometepe forme un 8 : deux volcans reliés par un isthme au milieu du plus grand lac d'Amérique centrale.",
    image: "/img/etape-07.jpg",
  },
  {
    id: 8,
    lieu: "San Juan del Sur",
    datesAffichees: "2 au 5 octobre",
    unlock: "2026-10-02",
    pays: "ni",
    illustration: "bateau de pêche",
    encre: "vert",
    message:
      "Bb c'est la dernière destination que tu découvres et tu vas surfer !!!!! Je veux des photos et surtout des vidéos de toi qui surf par pitié !!! Tu vas slider sur les vagues man ! Et ça casse",
    coords: [-85.8710, 11.2529],
    funFact: "San Juan del Sur était un port de la ruée vers l'or, les chercheurs traversaient le Nicaragua pour éviter le tour par le Cap Horn.",
    image: "/img/etape-08.jpg",
  },
  {
    id: 9,
    lieu: "Retour à Managua",
    datesAffichees: "5 octobre",
    unlock: "2026-10-05",
    pays: "ni",
    illustration: "hamac",
    encre: "ocre",
    message:
      "Tu es revenue à Managua pour la deuxième fois, et cette fois tu restes. Neuf jours, c'est long wsh mais tu pourras te remettre de toutes tes émotions et de ce que j'ai vu c'est vraiment une belle ville mais tu feras quand même attention à ne pas aller contre le pouvoir en place (même si je doute qu'une envie révolutionnaire te traverse l'esprit)",
    coords: [-86.2504, 12.1364],
    funFact: "Le gallo pinto (riz + haricots rouges) se mange au petit-déjeuner, au déjeuner et au dîner, et personne ne s'en lasse.",
    image: "/img/etape-09.jpg",
  },
  {
    id: 10,
    lieu: "Le vol du retour",
    datesAffichees: "14 et 15 octobre",
    unlock: "2026-10-14",
    pays: "ch",
    illustration: "hirondelle",
    encre: "vert",
    message:
      "Tu rentres. Quarante-trois jours, deux pays, et probablement autant d'histoires que tu vas mettre six mois à raconter en détail !! Hâte du debrief et du diapo de photos que tu vas faire ehehe. Bienvenue chou. Tu m'as manqué mon amour",
    coords: [6.6323, 46.5197], // Retour Lausanne
    funFact: "Les hirondelles parcourent jusqu'à 10 000 km pour rentrer chez elles, toi c'est environ 9 500.",
    image: "/img/etape-10.jpg",
  },
]

// Bounds pour les vues carte
export const BOUNDS = {
  mexique: [
    [-104, 14] as [number, number], // SW
    [-93, 27] as [number, number],  // NE
  ],
  nicaragua: [
    [-87.5, 10.5] as [number, number], // SW
    [-84.5, 13.5] as [number, number], // NE
  ],
}

export const PORTES: Porte[] = [
  {
    id: 1,
    situation: "Quand tu viens d'atterrir",
    texte: "Tu as les jambes lourdes, les oreilles bouchées, et tu te demandes où est ta valise. C'est normal, c'est le début. Tout va devenir familier plus vite que tu ne crois, hola mexico ! D'ici deux jours tu te déplaceras comme si t'avais toujours vécu là. En attendant : mange, bois de l'eau, et laisse-toi le temps d'arriver tranquillement bb.",
  },
  {
    id: 2,
    situation: "Quand le décalage horaire te réveille à 4h",
    texte: "Il est 4h chez toi mais 11h dans ta tête, ou l'inverse, tu ne sais plus. Profite du silence, ça doit être rare là-bas. Ici il est midi et je pense à toi. Rendors-toi, ou si tu peux pas, mets-toi sur le balcon et regarde le ciel, écris moi mais tu sais déjà ce que je vais te dire : \"Rendors toi bb faut que tu profites demain !!\". Concernant les étoiles (estrella en espagnol je crois) ce ne sont pas les mêmes étoiles qu'à Lausanne, enfin je crois.",
  },
  {
    id: 3,
    situation: "Quand tu as le mal du pays",
    texte: "C'est pas que tu veux rentrer, c'est que tu veux que la maison soit plus près. C'est différent. Ça passe, et en général ça passe après un bon repas ou un appel avec la Laurence haha. La maison sera toujours là, rien n'a changé, tout t'attend. Simba va bien ce gourmand, le contée est toujours aussi fruité, et moi je suis là. Prends un bon truc à manger et appelle quelqu'un si t'en as besoin. Même moi, même à 3h du mat' (soit 11h en Suisse !).",
  },
  {
    id: 4,
    situation: "Quand c'est le plus beau jour du voyage",
    texte: "Tu le sais parce que tu n'as pas regardé ton téléphone depuis quatre heures alors que t'as la 4G ! Note mentalement ce que tu vois là, parce que c'est ça que tu raconteras et nous rabâcheras dans dix ans. Grave tout : les odeurs, les bruits, la lumière. Prends des photos car tu as la chance de pouvoir en faire, mais surtout kiff parce que c'est trop important.",
  },
  {
    id: 5,
    situation: "Quand tu doutes de quelque chose",
    texte: "Tu as le droit de douter, de te sentir triste en voyage comme tu as le droit de douter chez toi en Franche-Comté. La seule différence, c'est que le paysage est plus beau, les gens sont chaleureux et la nourriture est spicy. Ça n'aide pas forcément, mais quand même un peu. Manon, t'es pas méchante quand tu doutes. C'est humain. C'est même courageux. Pose le truc qui te prend la tête, sors marcher, et laisse la réponse venir toute seule. Partage-la comme tu sais si bien le faire, et tout roulera comme sur des roulettes. Parce que tu sais ce que tu vaux, et le bien que tu peux faire autour de toi.",
  },
  {
    id: 6,
    situation: "Quand tu en as marre de ta grosse valise",
    texte: "Il pèse trop, il te fait mal au dos, il est chiant à tirer et tu te demandes pourquoi tu as pris autant de trucs. Pose-le cinq minutes, assieds-toi dessus, et regarde autour de toi. Et ça va mieux parce que ce dont t'as vraiment besoin, c'est pas dans le sac mais c'est plutôt l'expérience de dingue que t'es en train de vivre et à quel point tu es chanceuse de pouvoir prendre ces 5 min entourée de ces mexicanos.",
  },
  {
    id: 7,
    situation: "Quand tu veux juste entendre parler de la maison",
    texte: "Ici il fait gris et il commence vraiment à faire super froid (RIP l'été), point positif Simba va toujours aussi bien !! La vie continue exactement comme tu l'as laissée et le manque que tu me laisses grandit aussi tellement tu me manques Manon. Mise à part ça rien n'a changé, tout t'attend. La Coop est toujours aussi chère. Le LS a encore perdu et Rojhat a commencé à chercher sérieusement un appart bb. Voilà, t'as raté exactement rien d'extraordinaire.. enfin heheh.. bref continue de vivre des trucs extraordinaires pour nous deux et mange des tacos bien goûtus, y'en a pas ici :/.",
  },
  {
    id: 8,
    situation: "Quand c'est bientôt fini",
    texte: "Il reste quelques jours et tu commences à compter. C'est normal, c'est comme ça que les belles choses se passent : on les voit mieux quand on sait qu'elles s'arrêtent. Profite de chaque heure qu'il reste. Fais les trucs que t'as repoussés. Dis oui à tout (dans la limite du raisonnable lol). Et surtout, commence pas déjà à être triste que ça finit, c'est un sentiment désagréable et la fin d'une si belle aventure qui en quelque sorte marque le coup entre Manon l'étudiante et Manon l'adulte qui bosse (même s'il te reste un semestre mais chill tu vas dead ça). Et pis bon moi je suis hyper content parce que je vais enfin pouvoir te resserrer dans mes bras (jsuis tellement refait hahaha).",
  },
  {
    id: 9,
    situation: "N'ouvre celle-là que si ça va vraiment pas.",
    texte: "Je suis là. Pas là physiquement, mais là quand même. Appelle-moi, écris-moi, envoie-moi un point d'interrogation à 3h du matin, je comprendrai. Tu n'as pas besoin de gérer toute seule parce que je suis là Manon. Peu importe ce que c'est, peu importe l'heure, peu importe si tu trouves pas les mots. Je suis là, Manon, et je le serai toujours.\n\nJe t'aime plus que la raison le souhaite et malgré tout ce qui peut t'arriver tu as toujours eu les armes pour t'en sortir et te battre pour ce qui est juste à tes yeux. Tu as le cœur tendre et c'est ce qui fait que les gens t'aiment autant. C'est ce qui fait que moi je suis tombé amoureux de toi. Ça te coûte, je sais. Mais ce soir, là, maintenant, je veux que tu te rappelles un truc : t'es pas seule. T'as jamais été seule. Même quand t'as l'impression que le monde est trop grand et toi trop petite, moi je te vois. Je te vois entière.\n\nAlors pleure si t'as besoin, et après relève-toi comme tu l'as toujours fait. Parce que t'es Manon, et Manon elle lâche rien.\n\nJe t'aime, Manova <3",
  },
]
