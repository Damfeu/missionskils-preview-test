export interface Module {
  id: string;
  title: string;
  duration: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  passingScore: number; // pourcentage, ex: 80
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  xp: number;
  emoji: string;
  category: string;
  moduleList: Module[];
  gradient: string;
  quiz?: Quiz;
}

export interface MissionTask {
  id: string;
  title: string;
  description: string;
}

export interface MissionResource {
  fileName: string;
  content?: string; // contenu texte généré côté client (missions test de l'équipe)
  url?: string; // fichier réellement hébergé (missions soumises par une entreprise)
}

export interface Mission {
  id: string;
  company: string;
  companyType: string;
  title: string;
  description: string;
  context: string;
  objective: string;
  tools: string[];
  skills: string[];
  tasks: MissionTask[];
  xp: number;
  deadline: string;
  location: string;
  category: string;
  requiredCourseId: string;
  resource: MissionResource;
}

// Ligne brute renvoyée par Supabase pour une mission soumise par une entreprise
// (table company_missions), une fois approuvée par l'équipe.
export interface CompanyMissionRow {
  id: string;
  company_name: string;
  company_type: string;
  contact_name: string;
  contact_email: string;
  title: string;
  description: string;
  context: string;
  objective: string;
  tools: string[];
  skills: string[];
  location: string;
  deadline: string;
  category: string;
  tasks: { title: string; description: string }[];
  required_course_id: string | null;
  xp: number | null;
  resource_file_url: string | null;
  resource_file_name: string | null;
}

export function companyMissionToMission(row: CompanyMissionRow): Mission {
  const tasks: MissionTask[] = (row.tasks ?? []).map((t, i) => ({
    id: `t${i + 1}`,
    title: t.title,
    description: t.description
  }));
  return {
    id: `company-${row.id}`,
    company: row.company_name,
    companyType: row.company_type || "Entreprise partenaire",
    title: row.title,
    description: row.description,
    context: row.context,
    objective: row.objective,
    tools: row.tools ?? [],
    skills: row.skills ?? [],
    tasks,
    xp: row.xp ?? Math.max(100, tasks.length * 50),
    deadline: row.deadline || "À définir",
    location: row.location || "Togo",
    category: row.category || "Autre",
    requiredCourseId: row.required_course_id ?? "",
    resource: row.resource_file_url
      ? { fileName: row.resource_file_name ?? "ressource", url: row.resource_file_url }
      : { fileName: "aucune-ressource" }
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const COURSES: Course[] = [
  {
    id: "marketing-digital",
    title: "Marketing Digital de Base",
    description: "Maîtrisez les fondamentaux du marketing en ligne : SEO, publicités Facebook, stratégie de contenu.",
    duration: "45 min",
    level: "Débutant",
    xp: 100,
    emoji: "📣",
    category: "Marketing",
    gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    moduleList: [
      {
        id: "m1", title: "Introduction au Marketing Digital", duration: "8 min",
        content: "Le marketing digital regroupe toutes les actions marketing menées sur des supports numériques : moteurs de recherche, réseaux sociaux, email, sites web.\n\nContrairement au marketing traditionnel (affiches, flyers, radio), il permet de cibler précisément une audience, de mesurer les résultats en temps réel et d'ajuster sa stratégie rapidement, souvent avec un petit budget.\n\nPour une PME locale, cela veut dire : toucher des clients au-delà de son quartier, comprendre ce qui fonctionne grâce aux statistiques, et construire une relation durable avec sa clientèle.\n\n💡 À retenir : le marketing digital n'est pas réservé aux grandes entreprises — une boutique de quartier peut l'utiliser avec un simple smartphone."
      },
      {
        id: "m2", title: "SEO et Référencement Naturel", duration: "10 min",
        content: "Le SEO (Search Engine Optimization) consiste à améliorer la visibilité d'un site ou d'une page dans les résultats de recherche Google, sans payer de publicité.\n\nTrois leviers essentiels :\n1. Les mots-clés : utiliser les termes exacts que vos clients tapent dans Google (ex: \"restaurant Lomé livraison\").\n2. Le contenu : des pages claires, utiles, mises à jour régulièrement.\n3. La technique : un site rapide, qui s'affiche bien sur mobile.\n\n💡 À retenir : Google Business Profile (gratuit) est souvent le geste SEO le plus rentable pour une petite entreprise locale."
      },
      {
        id: "m3", title: "Publicités Facebook & Instagram", duration: "10 min",
        content: "Facebook Ads permet de créer des publicités très ciblées : âge, ville, centres d'intérêt, comportement d'achat.\n\nÉtapes clés d'une campagne simple :\n1. Définir un objectif clair (visites, messages, ventes).\n2. Choisir une audience précise plutôt que \"tout le monde\".\n3. Utiliser un visuel accrocheur et un texte court avec un appel à l'action (\"Commandez maintenant\").\n4. Fixer un petit budget test avant d'augmenter.\n\n💡 À retenir : une publicité qui cible 500 personnes pertinentes est plus efficace qu'une publicité vue par 50 000 personnes non concernées."
      },
      {
        id: "m4", title: "Stratégie de Contenu", duration: "9 min",
        content: "Une stratégie de contenu planifie quoi publier, où, et pourquoi, pour attirer et fidéliser une audience.\n\nLa règle simple : 80% de contenu utile ou divertissant (conseils, coulisses, témoignages) et 20% de contenu promotionnel direct (offres, produits).\n\nUn calendrier éditorial (même basique, sur papier ou Google Sheets) évite d'improviser chaque jour et garde une fréquence régulière, ce qui compte plus que la perfection.\n\n💡 À retenir : la régularité bat la perfection — 3 posts simples par semaine valent mieux qu'un post parfait par mois."
      },
      {
        id: "m5", title: "Mesure et Analytics", duration: "8 min",
        content: "Ce qui n'est pas mesuré ne peut pas être amélioré. Les outils gratuits (Facebook Insights, Google Analytics) montrent qui voit vos contenus, qui clique, qui achète.\n\nTrois indicateurs à surveiller en priorité :\n1. La portée (combien de personnes ont vu la publication).\n2. Le taux d'engagement (likes, commentaires, partages).\n3. Le taux de conversion (combien de clics deviennent des ventes ou contacts).\n\n💡 À retenir : regardez vos statistiques chaque semaine, pas chaque jour — cela évite de réagir à des variations normales et sans importance."
      }
    ]
  },
  {
    id: "design-canva",
    title: "Design Graphique avec Canva",
    description: "Créez des visuels professionnels pour les réseaux sociaux, les affiches et les présentations.",
    duration: "60 min",
    level: "Débutant",
    xp: 120,
    emoji: "🖌️",
    category: "Design",
    gradient: "from-purple-500/10 to-pink-500/10 border-purple-500/20",
    moduleList: [
      {
        id: "m1", title: "Interface Canva et outils de base", duration: "8 min",
        content: "Canva est un outil de design en ligne gratuit qui permet de créer des visuels professionnels sans compétences graphiques.\n\nL'interface se compose de trois zones : la barre latérale (modèles, éléments, textes, uploads), le canevas central (votre design) et la barre du haut (taille, téléchargement, partage).\n\nPour démarrer rapidement, partez toujours d'un modèle existant plutôt que d'une page blanche, puis personnalisez-le.\n\n💡 À retenir : le raccourci le plus utile est \"Redimensionner\" — il permet d'adapter un même design à plusieurs formats (Facebook, Instagram, impression) en un clic."
      },
      {
        id: "m2", title: "Typographie et harmonie des couleurs", duration: "10 min",
        content: "Une bonne typographie utilise au maximum 2 polices : une pour les titres, une pour le texte courant. Trop de polices différentes rendent un visuel amateur.\n\nPour les couleurs, la règle des 3 couleurs fonctionne bien : une couleur dominante, une secondaire, une pour les accents (boutons, appels à l'action).\n\nCanva propose des palettes automatiques à partir d'une image (logo par exemple) via l'outil \"Extraire les couleurs\".\n\n💡 À retenir : le contraste entre le texte et le fond doit toujours rester élevé pour une bonne lisibilité, surtout sur mobile."
      },
      {
        id: "m3", title: "Créer des posts pour réseaux sociaux", duration: "12 min",
        content: "Chaque réseau a ses dimensions optimales : carré 1080×1080 px pour Instagram/Facebook, format story 1080×1920 px.\n\nUn bon post social suit une structure simple : un visuel qui attire l'œil en 1 seconde, un message court et lisible, et un logo discret pour la reconnaissance de marque.\n\nCanva propose des modèles prêts à l'emploi pour chaque type de post (promotion, citation, annonce) qu'il suffit d'adapter aux couleurs de l'entreprise.\n\n💡 À retenir : évitez de surcharger un post avec trop de texte — le visuel doit rester lisible même en miniature dans le fil d'actualité."
      },
      {
        id: "m4", title: "Design d'affiches et de flyers", duration: "12 min",
        content: "Une affiche efficace répond en 3 secondes à trois questions : quoi, où/quand, comment me contacter.\n\nLa hiérarchie visuelle est essentielle : le titre principal doit être 3 à 4 fois plus grand que les informations secondaires.\n\nPour l'impression, toujours exporter en PDF haute qualité et vérifier le format (A4, A3) demandé par l'imprimeur.\n\n💡 À retenir : gardez des marges suffisantes autour du texte — les imprimantes coupent parfois quelques millimètres sur les bords."
      },
      {
        id: "m5", title: "Construire une identité visuelle", duration: "10 min",
        content: "Une identité visuelle cohérente donne une image professionnelle : mêmes couleurs, mêmes polices et même style de visuel sur tous les supports.\n\nCanva Brand Kit (disponible en version gratuite limitée) permet d'enregistrer le logo, les couleurs et polices d'une entreprise pour les réutiliser facilement.\n\nLa cohérence visuelle sur plusieurs publications aide les clients à reconnaître une marque même sans voir son nom.\n\n💡 À retenir : mieux vaut un style simple mais répété partout, qu'un style différent à chaque publication."
      },
      {
        id: "m6", title: "Export et formats de fichiers", duration: "8 min",
        content: "Le choix du format d'export dépend de l'usage : PNG pour le web avec fond transparent, JPEG pour les photos et posts classiques, PDF pour l'impression.\n\nCanva permet aussi d'exporter en \"PDF imprimable\" avec les marges de coupe automatiquement ajoutées, utile pour les imprimeurs professionnels.\n\nPensez à toujours vérifier l'aperçu avant de télécharger, surtout la lisibilité du texte et l'absence d'éléments coupés.\n\n💡 À retenir : pour les réseaux sociaux, privilégiez toujours le PNG ou le JPEG en haute qualité — jamais le PDF."
      }
    ]
  },
  {
    id: "reseaux-sociaux",
    title: "Gestion des Réseaux Sociaux",
    description: "Développez et gérez la présence digitale d'une entreprise sur Facebook, Instagram et TikTok.",
    duration: "90 min",
    level: "Intermédiaire",
    xp: 160,
    emoji: "💬",
    category: "Social Media",
    gradient: "from-green-500/10 to-emerald-500/10 border-green-500/20",
    moduleList: [
      {
        id: "m1", title: "Stratégie Social Media", duration: "10 min",
        content: "Avant de publier, il faut répondre à 3 questions : à qui je m'adresse (persona), sur quel(s) réseau(x), et avec quel objectif (notoriété, ventes, fidélisation).\n\nChaque réseau a son propre usage : Facebook pour une audience large et locale, Instagram pour le visuel et les jeunes adultes, TikTok pour la viralité et la génération Z.\n\nUne bonne stratégie choisit 1 à 2 réseaux maîtrisés plutôt que d'être présent partout sans régularité.\n\n💡 À retenir : il vaut mieux être excellent sur un seul réseau que médiocre sur quatre."
      },
      {
        id: "m2", title: "Facebook pour les entreprises", duration: "12 min",
        content: "Une page Facebook Business (différente d'un profil personnel) donne accès aux statistiques, à la publicité et aux boutons d'action (Appeler, Commander).\n\nLes informations essentielles à compléter : catégorie d'activité, adresse, horaires, numéro WhatsApp, et une photo de couverture professionnelle.\n\nFacebook Business Suite permet de programmer des publications à l'avance sur Facebook et Instagram en même temps.\n\n💡 À retenir : une page incomplète (sans horaires ni contact) fait perdre des clients potentiels avant même le premier post."
      },
      {
        id: "m3", title: "Instagram et Reels", duration: "12 min",
        content: "Instagram privilégie le contenu visuel court. Les Reels (vidéos courtes de 15 à 60 secondes) ont aujourd'hui la meilleure portée organique, souvent bien plus que les photos classiques.\n\nUn bon Reel capte l'attention dans les 2 premières secondes, utilise une musique tendance, et inclut du texte à l'écran pour les personnes sans son.\n\nLes Stories permettent un contact plus informel et quotidien (coulisses, sondages, promotions flash).\n\n💡 À retenir : la constance de publication compte plus que la quantité — 3 Reels par semaine bien pensés valent mieux que 10 publiés au hasard."
      },
      {
        id: "m4", title: "TikTok et contenu viral", duration: "10 min",
        content: "TikTok fonctionne sur la découverte : même un compte sans abonnés peut devenir viral si le contenu est bon, grâce à l'algorithme \"Pour toi\".\n\nLes vidéos qui fonctionnent le mieux racontent une histoire simple, montrent un avant/après, ou répondent à une question fréquente de manière divertissante.\n\nSuivre les tendances (sons, formats, défis) tout en les adaptant à son propre secteur augmente fortement les chances de visibilité.\n\n💡 À retenir : la première seconde de la vidéo doit donner une raison de rester — sinon l'utilisateur passe à la suivante."
      },
      {
        id: "m5", title: "Calendrier éditorial", duration: "12 min",
        content: "Un calendrier éditorial planifie à l'avance : quoi publier, quand, sur quel réseau, avec quel objectif.\n\nUn tableau simple (Google Sheets) avec les colonnes Date / Réseau / Type de contenu / Sujet / Statut suffit pour démarrer.\n\nPlanifier 2 à 4 semaines à l'avance permet d'anticiper les événements (fêtes, promotions) et d'éviter les publications de dernière minute.\n\n💡 À retenir : gardez toujours 20% du calendrier flexible pour réagir à l'actualité ou aux tendances du moment."
      },
      {
        id: "m6", title: "Gestion de communauté", duration: "10 min",
        content: "La gestion de communauté consiste à répondre aux commentaires, messages privés et avis, rapidement et avec le bon ton.\n\nUn objectif réaliste pour une PME : répondre aux messages privés en moins de 24h, et à tous les commentaires publics visibles.\n\nFace à un commentaire négatif, il vaut mieux répondre calmement en public puis proposer de poursuivre en message privé, plutôt que d'ignorer ou de supprimer.\n\n💡 À retenir : une marque qui répond bien à une critique donne souvent une meilleure image qu'une marque qui n'a jamais eu de problème."
      },
      {
        id: "m7", title: "Publicités sociales payantes", duration: "12 min",
        content: "La publicité payante permet d'accélérer la visibilité au-delà de son audience organique existante.\n\nPour démarrer petit budget : tester avec 2-3 $ par jour pendant quelques jours sur une seule publicité, avec un objectif précis (trafic, messages, ventes).\n\nComparer ensuite 2 versions d'une même publicité (A/B test) pour savoir quel visuel ou texte fonctionne le mieux avant d'augmenter le budget.\n\n💡 À retenir : ne jamais mettre tout son budget sur une seule publicité non testée."
      },
      {
        id: "m8", title: "Analyse des performances", duration: "12 min",
        content: "Chaque réseau propose ses propres statistiques gratuites (Meta Business Suite, TikTok Analytics) : portée, engagement, clics, nouveaux abonnés.\n\nUn rapport mensuel simple compare le mois en cours au mois précédent sur 3-4 indicateurs clés, pour identifier ce qui progresse ou recule.\n\nL'objectif n'est pas d'accumuler des chiffres, mais de comprendre quel type de contenu fonctionne pour en faire plus.\n\n💡 À retenir : le contenu qui a le mieux fonctionné le mois dernier est souvent la meilleure inspiration pour le mois suivant."
      }
    ]
  },
  {
    id: "analyse-donnees",
    title: "Introduction à l'Analyse de Données",
    description: "Apprenez à collecter, analyser et visualiser des données pour optimiser les décisions d'entreprise.",
    duration: "120 min",
    level: "Intermédiaire",
    xp: 200,
    emoji: "📈",
    category: "Data",
    gradient: "from-orange-500/10 to-amber-500/10 border-orange-500/20",
    moduleList: [
      {
        id: "m1", title: "Introduction à la donnée", duration: "10 min",
        content: "Une donnée est un fait brut (une vente, une date, un prix). L'analyse de données transforme ces faits en informations utiles pour décider.\n\nOn distingue les données quantitatives (chiffres : montants, quantités) et qualitatives (catégories : type de produit, ville).\n\nPour une PME, l'analyse de données ne nécessite pas d'outils complexes : Excel ou Google Sheets suffisent largement pour commencer.\n\n💡 À retenir : la meilleure analyse part toujours d'une question claire (\"quel produit se vend le mieux le weekend ?\"), pas d'un tableau de chiffres au hasard."
      },
      {
        id: "m2", title: "Collecte et sources de données", duration: "12 min",
        content: "Les données d'une PME viennent souvent de plusieurs sources : registres de ventes papier, factures, réseaux sociaux, retours clients.\n\nLa première étape est de centraliser ces données dans un seul fichier structuré, avec des colonnes cohérentes (date, produit, quantité, prix).\n\nIl est important de collecter les données régulièrement (quotidiennement ou hebdomadairement) plutôt que de tout rattraper en fin de mois, ce qui augmente le risque d'erreurs.\n\n💡 À retenir : une donnée non enregistrée au moment de la vente est une donnée perdue pour l'analyse."
      },
      {
        id: "m3", title: "Excel avancé pour l'analyse", duration: "14 min",
        content: "Les fonctions clés à connaître : SOMME (total), MOYENNE, NB.SI (compter selon une condition), RECHERCHEV/RECHERCHEX (retrouver une valeur liée).\n\nLes tableaux croisés dynamiques permettent de résumer rapidement de grandes quantités de données (ex: total des ventes par mois et par produit) sans formule complexe.\n\nLe filtrage et le tri aident à repérer rapidement les valeurs extrêmes (meilleure vente, pire mois) avant une analyse plus poussée.\n\n💡 À retenir : un tableau croisé dynamique bien fait remplace souvent des heures de calcul manuel."
      },
      {
        id: "m4", title: "Nettoyage des données", duration: "12 min",
        content: "Des données mal nettoyées faussent toute l'analyse : \"Coca\", \"coca-cola\" et \"Coca Cola\" doivent être uniformisés en une seule appellation.\n\nÉtapes de nettoyage essentielles : supprimer les doublons, corriger les fautes de frappe, uniformiser les formats de date, vérifier les valeurs impossibles (prix négatif, quantité à zéro suspecte).\n\nCette étape prend souvent plus de temps que l'analyse elle-même, mais elle est indispensable pour des résultats fiables.\n\n💡 À retenir : \"Garbage in, garbage out\" — des données sales produisent toujours des conclusions fausses, même avec de bons outils."
      },
      {
        id: "m5", title: "Statistiques descriptives", duration: "12 min",
        content: "Les statistiques descriptives résument un ensemble de données en quelques chiffres clés : la moyenne, la médiane (valeur du milieu), le minimum et le maximum.\n\nLa moyenne peut être trompeuse si quelques valeurs très hautes ou très basses \"tirent\" le résultat — la médiane est alors plus représentative.\n\nComparer les ventes d'un mois à la moyenne des mois précédents permet de repérer rapidement une tendance anormale (hausse ou baisse).\n\n💡 À retenir : toujours regarder la moyenne ET la médiane ensemble pour éviter les fausses conclusions."
      },
      {
        id: "m6", title: "Visualisation avec graphiques", duration: "12 min",
        content: "Un bon graphique doit répondre à une question en un coup d'œil. Les types les plus utiles : graphique en ligne (évolution dans le temps), en barres (comparaison entre catégories), circulaire (répartition en pourcentage).\n\nÉviter de mettre trop d'informations sur un seul graphique — un message clair par graphique est plus efficace que cinq indicateurs mélangés.\n\nToujours titrer clairement le graphique et indiquer les unités (FCFA, unités vendues, %).\n\n💡 À retenir : si le graphique a besoin d'une longue explication pour être compris, il est probablement mal choisi."
      },
      {
        id: "m7", title: "Tableaux de bord interactifs", duration: "12 min",
        content: "Un tableau de bord regroupe plusieurs indicateurs clés sur une seule page, mis à jour automatiquement quand les données changent.\n\nPour une PME, un tableau de bord simple sur Google Sheets (avec quelques graphiques liés aux données brutes) suffit largement — pas besoin d'outils payants complexes au démarrage.\n\nLes indicateurs à privilégier sont ceux qui aident réellement à décider : ventes du mois, produit le plus vendu, évolution par rapport au mois précédent.\n\n💡 À retenir : un tableau de bord utile a rarement plus de 5-6 indicateurs — trop d'informations noient le message important."
      },
      {
        id: "m8", title: "Interprétation des résultats", duration: "12 min",
        content: "Un chiffre seul ne dit rien sans contexte : \"200 ventes ce mois\" doit être comparé au mois précédent, à la même période l'année dernière, ou à un objectif fixé.\n\nIl faut distinguer corrélation et causalité : deux événements qui varient ensemble ne signifient pas forcément que l'un cause l'autre.\n\nUne bonne interprétation propose toujours une explication plausible et, si possible, une action concrète à tester.\n\n💡 À retenir : une analyse sans recommandation d'action reste un exercice académique, pas un outil de décision."
      },
      {
        id: "m9", title: "Rédaction d'un rapport d'analyse", duration: "12 min",
        content: "Un bon rapport d'analyse suit une structure simple : le contexte, la méthode utilisée, les résultats principaux (avec graphiques), puis les recommandations.\n\nLe langage doit rester accessible : éviter le jargon technique quand le rapport est destiné à un responsable non spécialiste des données.\n\nCommencer par un résumé d'une phrase (\"Les ventes ont augmenté de 15% ce trimestre, portées par le produit X\") aide le lecteur presssé à comprendre l'essentiel immédiatement.\n\n💡 À retenir : un rapport lu et compris en 5 minutes a plus d'impact qu'un rapport détaillé de 20 pages jamais terminé."
      },
      {
        id: "m10", title: "Présentation des insights", duration: "12 min",
        content: "Présenter des données à l'oral demande de simplifier : une idée principale par slide, un graphique clair, peu de texte.\n\nCommencer par la conclusion (\"Voici ce qu'il faut retenir\"), puis expliquer les données qui la soutiennent, plutôt que de dérouler tous les chiffres avant d'arriver au point important.\n\nAnticiper les questions probables (\"pourquoi cette baisse ?\") permet de préparer des réponses ou des données complémentaires.\n\n💡 À retenir : une présentation de données réussie se juge par les décisions qu'elle permet de prendre, pas par le nombre de slides."
      }
    ]
  },
  {
    id: "ecommerce-pme",
    title: "E-Commerce pour PME",
    description: "Lancez et optimisez une boutique en ligne pour accélérer la croissance d'une petite entreprise.",
    duration: "60 min",
    level: "Débutant",
    xp: 100,
    emoji: "🏪",
    category: "Commerce",
    gradient: "from-red-500/10 to-rose-500/10 border-red-500/20",
    moduleList: [
      {
        id: "m1", title: "Principes du commerce en ligne", duration: "10 min",
        content: "Vendre en ligne élimine les contraintes géographiques et horaires d'une boutique physique, mais demande de nouvelles compétences : logistique, paiement en ligne, service client à distance.\n\nLa confiance est l'élément clé : photos de qualité, description honnête, avis clients visibles, et réponse rapide aux questions.\n\nMême une petite entreprise peut démarrer avec un catalogue simple sur WhatsApp Business ou Facebook avant d'investir dans une vraie boutique en ligne.\n\n💡 À retenir : le e-commerce ne remplace pas la confiance humaine, il doit la recréer différemment, en ligne."
      },
      {
        id: "m2", title: "Choisir sa plateforme e-commerce", duration: "12 min",
        content: "Trois options courantes pour démarrer : WhatsApp Business (gratuit, simple, catalogue limité), Facebook/Instagram Shop (gratuit, intégré aux réseaux sociaux), ou une vraie boutique en ligne (Shopify, WooCommerce — plus de fonctionnalités, coût mensuel).\n\nPour une PME qui démarre, il vaut mieux commencer simple (WhatsApp/Facebook) et migrer vers une plateforme complète seulement quand le volume de commandes le justifie.\n\nLe choix dépend aussi du mode de paiement disponible localement (Mobile Money, paiement à la livraison, carte bancaire).\n\n💡 À retenir : la meilleure plateforme est celle que le client utilise déjà — pas forcément la plus sophistiquée."
      },
      {
        id: "m3", title: "Créer des fiches produits efficaces", duration: "14 min",
        content: "Une fiche produit qui convertit contient : un titre clair, plusieurs photos sous différents angles, une description qui répond aux questions fréquentes (taille, matière, utilisation), et un prix visible.\n\nLes photos doivent être prises en lumière naturelle, sur fond neutre, sans flou — cela a souvent plus d'impact que le texte.\n\nAjouter les informations pratiques (délai de livraison, zones desservies, politique de retour) réduit les questions répétitives et rassure l'acheteur.\n\n💡 À retenir : une bonne photo vend plus qu'une longue description — investissez du temps dans les visuels avant le texte."
      },
      {
        id: "m4", title: "Logistique et gestion des livraisons", duration: "12 min",
        content: "La logistique couvre : la gestion du stock (savoir ce qui est disponible), l'emballage, et la livraison au client.\n\nPour une petite structure, un simple tableau de suivi des stocks (Excel/Sheets) évite de vendre un produit déjà épuisé.\n\nCommuniquer clairement les délais et coûts de livraison avant la commande évite les litiges et les avis négatifs après-vente.\n\n💡 À retenir : un client informé d'un délai de livraison plus long dès le départ est presque toujours satisfait ; un client surpris par un retard non annoncé se plaint."
      },
      {
        id: "m5", title: "Marketing pour booster les ventes", duration: "12 min",
        content: "Le marketing e-commerce combine plusieurs leviers : réseaux sociaux pour la découverte, promotions limitées dans le temps pour créer l'urgence, et avis clients pour la confiance.\n\nLes témoignages clients (photos, messages, avis) sont particulièrement efficaces pour rassurer de nouveaux acheteurs qui n'ont jamais commandé sur cette boutique.\n\nRelancer les clients qui ont ajouté un produit sans finaliser leur commande (par message direct) récupère souvent des ventes qui semblaient perdues.\n\n💡 À retenir : un client satisfait qui recommande la boutique reste le meilleur outil marketing, et il est gratuit."
      }
    ]
  },
  {
    id: "wordpress",
    title: "Créer un Site Web avec WordPress",
    description: "Construisez un site professionnel pour une entreprise sans écrire une ligne de code, de l'hébergement à la mise en ligne.",
    duration: "75 min",
    level: "Débutant",
    xp: 120,
    emoji: "🖥️",
    category: "Développement",
    gradient: "from-indigo-500/10 to-blue-500/10 border-indigo-500/20",
    moduleList: [
      {
        id: "m1", title: "Héberger et installer WordPress", duration: "12 min",
        content: "WordPress est un logiciel gratuit qui permet de créer un site sans coder. Il nécessite un hébergement (l'espace où le site \"vit\" en ligne) et un nom de domaine (l'adresse, ex: monentreprise.com).\n\nDe nombreux hébergeurs proposent une installation de WordPress en un clic, sans compétence technique nécessaire.\n\nAvant de choisir un hébergeur, vérifier : le support en français, la vitesse annoncée, et la possibilité de sauvegardes automatiques.\n\n💡 À retenir : le nom de domaine doit être court, facile à retenir et à épeler à voix haute — pensez à un client qui le tape sur son téléphone."
      },
      {
        id: "m2", title: "Choisir et personnaliser un thème", duration: "15 min",
        content: "Un thème définit l'apparence générale du site (couleurs, mise en page, style). Il existe des milliers de thèmes gratuits adaptés à chaque secteur (restaurant, boutique, portfolio).\n\nUn bon thème pour une PME doit être : rapide à charger, compatible mobile (\"responsive\"), et facile à personnaliser sans code.\n\nLa personnalisation se fait généralement via l'éditeur visuel (\"Customizer\") : logo, couleurs, menu, pied de page.\n\n💡 À retenir : mieux vaut un thème simple et rapide qu'un thème très chargé en animations qui ralentit le site."
      },
      {
        id: "m3", title: "Créer des pages et articles", duration: "14 min",
        content: "Une page (statique, ex: \"Accueil\", \"À propos\", \"Contact\") est différente d'un article (contenu daté, ex: actualités, blog).\n\nUn site professionnel minimal contient au moins : Accueil, À propos, Services/Produits, Contact.\n\nChaque page doit avoir un titre clair, des paragraphes courts, et un appel à l'action visible (bouton \"Nous contacter\", \"Commander\").\n\n💡 À retenir : la page \"Contact\" est souvent la plus visitée avant une décision d'achat — elle doit être simple et rapide à trouver."
      },
      {
        id: "m4", title: "Plugins essentiels (contact, SEO, sécurité)", duration: "14 min",
        content: "Les plugins ajoutent des fonctionnalités à WordPress sans coder. Trois catégories essentielles pour démarrer :\n1. Formulaire de contact (ex: Contact Form 7 ou WPForms).\n2. SEO (ex: Yoast SEO) pour optimiser le référencement de chaque page.\n3. Sécurité (ex: Wordfence) pour protéger le site contre les tentatives de piratage.\n\nIl est recommandé de ne pas installer trop de plugins à la fois : chacun peut ralentir le site ou créer des conflits.\n\n💡 À retenir : installez seulement les plugins dont vous avez vraiment besoin, et gardez-les à jour régulièrement."
      },
      {
        id: "m5", title: "Mise en ligne et référencement de base", duration: "10 min",
        content: "Avant la mise en ligne officielle, vérifier : tous les liens fonctionnent, le site s'affiche bien sur mobile, et les informations de contact sont correctes.\n\nCréer un compte Google Search Console (gratuit) permet d'indiquer à Google que le site existe et de suivre son apparition dans les résultats de recherche.\n\nAjouter le site à Google Business Profile renforce la visibilité locale, en complément du site lui-même.\n\n💡 À retenir : un site \"en ligne\" n'est pas automatiquement visible sur Google — l'indexation peut prendre plusieurs jours."
      },
      {
        id: "m6", title: "Maintenance et mises à jour", duration: "10 min",
        content: "WordPress, les thèmes et les plugins doivent être mis à jour régulièrement pour rester sécurisés et compatibles.\n\nUne sauvegarde avant chaque mise à jour importante évite de perdre le site en cas de problème.\n\nPrévoir une vérification mensuelle simple : le site se charge-t-il vite ? Tous les formulaires fonctionnent-ils ? Y a-t-il des mises à jour en attente ?\n\n💡 À retenir : un site jamais mis à jour devient une cible facile pour les attaques informatiques, même s'il semble fonctionner normalement."
      }
    ]
  },
  {
    id: "html-css",
    title: "HTML & CSS — Bases du Web",
    description: "Comprenez comment les sites sont construits et créez vos premières pages web en maîtrisant la structure et le style.",
    duration: "90 min",
    level: "Débutant",
    xp: 140,
    emoji: "💻",
    category: "Développement",
    gradient: "from-teal-500/10 to-cyan-500/10 border-teal-500/20",
    moduleList: [
      {
        id: "m1", title: "Structure d'une page HTML", duration: "14 min",
        content: "HTML (HyperText Markup Language) structure le contenu d'une page web à l'aide de balises : <html>, <head>, <body>.\n\nChaque balise a un rôle précis : <head> contient les informations invisibles (titre de l'onglet, liens vers le style), <body> contient tout ce qui est visible sur la page.\n\nLes balises s'ouvrent et se ferment généralement par paires : <p>Texte</p> pour un paragraphe.\n\n💡 À retenir : une page HTML bien structurée est comme un document Word bien organisé — des titres, des paragraphes, des listes, chacun à sa place."
      },
      {
        id: "m2", title: "Titres, paragraphes et liens", duration: "12 min",
        content: "Les titres utilisent les balises <h1> à <h6>, du plus important (<h1>, un seul par page idéalement) au moins important.\n\nLes paragraphes utilisent <p>, et les liens utilisent <a href=\"...\">texte du lien</a> pour renvoyer vers une autre page ou un autre site.\n\nUne bonne hiérarchie de titres aide à la fois les lecteurs humains et les moteurs de recherche à comprendre l'organisation du contenu.\n\n💡 À retenir : n'utilisez jamais un titre uniquement pour sa taille visuelle — utilisez la bonne balise (h1, h2...) selon l'importance réelle du contenu."
      },
      {
        id: "m3", title: "Mise en forme avec CSS", duration: "14 min",
        content: "CSS (Cascading Style Sheets) définit l'apparence du HTML : couleurs, tailles, espacements, polices.\n\nUne règle CSS cible un élément puis définit ses propriétés : `p { color: blue; font-size: 16px; }` rend tous les paragraphes bleus avec une taille de 16 pixels.\n\nOn peut cibler un élément précis grâce aux classes (`class=\"important\"` en HTML, `.important { }` en CSS), très utiles pour styliser certains éléments différemment des autres.\n\n💡 À retenir : séparer le contenu (HTML) du style (CSS) permet de changer complètement l'apparence d'un site sans toucher au contenu."
      },
      {
        id: "m4", title: "Mise en page avec Flexbox", duration: "16 min",
        content: "Flexbox est un système CSS qui organise facilement des éléments en ligne ou en colonne, avec un alignement et un espacement automatiques.\n\nLa propriété `display: flex` sur un conteneur transforme ses enfants en \"éléments flexibles\" que l'on peut aligner avec `justify-content` (horizontal) et `align-items` (vertical).\n\nFlexbox est particulièrement utile pour centrer des éléments ou créer des rangées de cartes (produits, articles) qui s'adaptent à la taille de l'écran.\n\n💡 À retenir : avant Flexbox, centrer un élément verticalement en CSS était étonnamment compliqué — c'est aujourd'hui une seule ligne de code."
      },
      {
        id: "m5", title: "Design responsive (mobile-first)", duration: "16 min",
        content: "Le design responsive adapte automatiquement l'affichage d'un site selon la taille de l'écran (mobile, tablette, ordinateur).\n\nL'approche \"mobile-first\" consiste à concevoir d'abord pour le petit écran, puis à ajouter des adaptations pour les grands écrans — logique car la majorité du trafic web vient du mobile.\n\nLes \"media queries\" en CSS (`@media (max-width: 600px) { ... }`) permettent d'appliquer des styles différents selon la largeur de l'écran.\n\n💡 À retenir : un site qui n'est pas responsive perd une grande partie de ses visiteurs mobiles, souvent la majorité du trafic réel."
      },
      {
        id: "m6", title: "Formulaires et champs de saisie", duration: "12 min",
        content: "La balise <form> regroupe les champs de saisie (<input>, <textarea>, <select>) qui permettent à un visiteur d'envoyer des informations (contact, inscription).\n\nChaque champ doit avoir un `label` associé pour l'accessibilité et la clarté (l'utilisateur sait ce qu'il doit remplir).\n\nL'attribut `required` sur un champ empêche l'envoi du formulaire si ce champ est vide, une vérification simple côté navigateur.\n\n💡 À retenir : un formulaire trop long avec trop de champs obligatoires fait fuir les visiteurs — ne demandez que l'essentiel."
      },
      {
        id: "m7", title: "Publier son site gratuitement", duration: "6 min",
        content: "Des services gratuits comme GitHub Pages ou Netlify permettent de publier un site HTML/CSS simple en ligne sans payer d'hébergement.\n\nLe principe : déposer ses fichiers HTML/CSS sur la plateforme, qui génère automatiquement une adresse web publique.\n\nCe type d'hébergement gratuit convient très bien pour un site vitrine simple, un portfolio ou une page de test — pour un site plus complexe avec beaucoup de trafic, un hébergement payant devient nécessaire.\n\n💡 À retenir : commencer gratuitement pour tester une idée avant d'investir dans un hébergement payant est une bonne pratique."
      }
    ]
  },
  {
    id: "app-mobile-nocode",
    title: "Créer une App Mobile sans Coder",
    description: "Concevez et publiez une application mobile fonctionnelle pour une PME grâce aux outils No-Code modernes.",
    duration: "80 min",
    level: "Intermédiaire",
    xp: 150,
    emoji: "📲",
    category: "Développement",
    gradient: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    moduleList: [
      {
        id: "m1", title: "Introduction au No-Code et ses outils", duration: "12 min",
        content: "Le No-Code permet de créer des applications fonctionnelles par assemblage visuel (glisser-déposer), sans écrire de code.\n\nDes outils comme Glide, Adalo ou Bubble transforment une simple feuille de données (Google Sheets) en application mobile ou web fonctionnelle.\n\nLe No-Code est idéal pour tester rapidement une idée (MVP) avant d'investir dans un développement sur-mesure plus coûteux.\n\n💡 À retenir : le No-Code n'est pas fait pour toutes les applications, mais il est parfait pour prouver qu'une idée fonctionne avant d'aller plus loin."
      },
      {
        id: "m2", title: "Concevoir l'interface de l'app (Figma)", duration: "16 min",
        content: "Avant de construire l'application, il est utile de dessiner ses écrans principaux sur Figma (outil gratuit de design d'interface).\n\nUn bon écran d'application mobile reste simple : un objectif principal par écran, des boutons suffisamment grands pour être touchés facilement, et une navigation claire.\n\nCommencer par un \"wireframe\" (maquette simple en noir et blanc) avant d'ajouter les couleurs évite de se perdre dans les détails visuels trop tôt.\n\n💡 À retenir : une application testée sur papier ou en maquette simple avant d'être construite évite de nombreuses erreurs coûteuses à corriger plus tard."
      },
      {
        id: "m3", title: "Construire les écrans avec Glide", duration: "18 min",
        content: "Glide transforme une feuille Google Sheets en application mobile : chaque ligne devient un élément affiché, chaque colonne une information.\n\nLes types d'écrans les plus utilisés : liste (catalogue de produits), détail (fiche d'un produit), formulaire (ajout d'une commande).\n\nL'interface de Glide permet de choisir un modèle d'écran, puis de le relier directement aux colonnes correspondantes de la feuille de données.\n\n💡 À retenir : la qualité de l'application dépend directement de la qualité et de l'organisation des données dans la feuille source."
      },
      {
        id: "m4", title: "Logique, boutons et navigation", duration: "16 min",
        content: "Les outils No-Code permettent d'ajouter des actions à un bouton : ouvrir un autre écran, envoyer un message, mettre à jour une donnée.\n\nLa navigation doit toujours permettre à l'utilisateur de revenir en arrière facilement, et de comprendre où il se trouve dans l'application.\n\nDes règles conditionnelles simples (\"si le champ statut = payé, afficher un badge vert\") permettent de rendre l'application plus intelligente sans code.\n\n💡 À retenir : testez chaque bouton après l'avoir créé — une navigation cassée est l'erreur la plus fréquente en No-Code."
      },
      {
        id: "m5", title: "Connecter une base de données (Sheets)", duration: "12 min",
        content: "Google Sheets sert souvent de base de données simple pour les applications No-Code : chaque modification dans la feuille se reflète dans l'application (et parfois inversement).\n\nOrganiser la feuille avec des colonnes bien nommées et cohérentes (pas de fautes de frappe, pas de cellules vides importantes) évite des erreurs d'affichage dans l'application.\n\nPour une application avec plusieurs utilisateurs, prévoir des onglets séparés (produits, commandes, utilisateurs) plutôt que tout mélanger dans une seule feuille.\n\n💡 À retenir : une feuille Google Sheets bien structurée est la fondation de toute application No-Code fiable."
      },
      {
        id: "m6", title: "Tester et publier l'application", duration: "6 min",
        content: "Avant de partager l'application, il faut la tester sur un vrai téléphone : vitesse de chargement, lisibilité des textes, boutons fonctionnels.\n\nLes outils No-Code génèrent généralement un lien de partage ou un QR code, permettant d'installer l'application comme un raccourci sur l'écran d'accueil du téléphone.\n\nRecueillir les retours des premiers utilisateurs test permet de corriger rapidement les points de friction avant une diffusion plus large.\n\n💡 À retenir : une application No-Code publiée n'est jamais figée — elle peut être améliorée en continu à partir des retours réels des utilisateurs."
      }
    ]
  }
];

// Quiz associé à chaque cours — correction automatique, seuil de réussite 80%.
const QUIZZES: Record<string, Quiz> = {
  "marketing-digital": {
    passingScore: 80,
    questions: [
      { id: "q1", question: "Quel est le principal avantage du marketing digital face au marketing traditionnel ?", options: ["Il coûte toujours plus cher", "On peut cibler précisément et mesurer les résultats", "Il ne nécessite aucun contenu", "Il fonctionne uniquement pour les grandes entreprises"], correctIndex: 1 },
      { id: "q2", question: "Que veut dire SEO ?", options: ["Social Engagement Optimization", "Search Engine Optimization (référencement naturel)", "Sales Efficiency Objective", "Site Email Outreach"], correctIndex: 1 },
      { id: "q3", question: "Pour une publicité Facebook efficace, il vaut mieux :", options: ["Cibler tout le monde sans distinction", "Cibler une audience précise et pertinente", "Ne jamais fixer de budget", "Éviter d'utiliser un visuel"], correctIndex: 1 },
      { id: "q4", question: "Dans une stratégie de contenu, quelle répartition est recommandée ?", options: ["100% promotionnel", "80% utile/divertissant, 20% promotionnel", "50/50 sans logique", "0% promotionnel"], correctIndex: 1 },
      { id: "q5", question: "Pourquoi mesurer ses statistiques (analytics) ?", options: ["Pour remplir du temps", "Pour comprendre ce qui fonctionne et ajuster sa stratégie", "Ce n'est jamais utile pour une PME", "Uniquement pour impressionner les clients"], correctIndex: 1 }
    ]
  },
  "design-canva": {
    passingScore: 80,
    questions: [
      { id: "q1", question: "Combien de polices différentes est-il recommandé d'utiliser sur un même visuel ?", options: ["Autant que possible", "Maximum 2", "Au moins 5", "Une seule couleur suffit, la police n'a pas d'importance"], correctIndex: 1 },
      { id: "q2", question: "Quel format est adapté pour un post Instagram carré classique ?", options: ["210×297 px", "1080×1080 px", "50×50 px", "4000×4000 px"], correctIndex: 1 },
      { id: "q3", question: "Une affiche efficace doit répondre rapidement à :", options: ["Uniquement le prix", "Quoi, où/quand, comment contacter", "Rien en particulier", "Uniquement le nom de l'entreprise"], correctIndex: 1 },
      { id: "q4", question: "Le Brand Kit dans Canva sert à :", options: ["Supprimer son compte", "Enregistrer logo, couleurs et polices pour rester cohérent", "Créer des vidéos uniquement", "Imprimer automatiquement les designs"], correctIndex: 1 },
      { id: "q5", question: "Pour l'impression professionnelle, quel format exporter généralement ?", options: ["GIF", "PDF haute qualité", "MP3", "TXT"], correctIndex: 1 }
    ]
  },
  "reseaux-sociaux": {
    passingScore: 80,
    questions: [
      { id: "q1", question: "Avant de publier, il faut d'abord définir :", options: ["Rien, on publie directement", "L'audience, le réseau et l'objectif", "Uniquement la couleur du logo", "Le nombre de likes espéré"], correctIndex: 1 },
      { id: "q2", question: "Sur Instagram, quel format a aujourd'hui la meilleure portée organique ?", options: ["Les Reels (vidéos courtes)", "Les albums photo uniquement", "Les messages privés", "Les stories archivées"], correctIndex: 0 },
      { id: "q3", question: "Face à un commentaire négatif public, la meilleure pratique est :", options: ["L'ignorer complètement", "Répondre calmement en public puis poursuivre en privé", "Supprimer systématiquement", "Répondre avec agressivité"], correctIndex: 1 },
      { id: "q4", question: "Pour tester une publicité payante avec un petit budget, il est conseillé de :", options: ["Mettre tout le budget dès le premier jour", "Tester avec un petit budget puis comparer les résultats", "Ne jamais faire de test", "Choisir une audience aléatoire"], correctIndex: 1 },
      { id: "q5", question: "Un calendrier éditorial sert principalement à :", options: ["Décorer le bureau", "Planifier à l'avance quoi publier et quand", "Remplacer les statistiques", "Rien d'utile"], correctIndex: 1 }
    ]
  },
  "analyse-donnees": {
    passingScore: 80,
    questions: [
      { id: "q1", question: "Quelle est la différence entre une donnée quantitative et qualitative ?", options: ["Aucune différence", "Quantitative = chiffres, qualitative = catégories", "Qualitative est toujours fausse", "Quantitative concerne uniquement les couleurs"], correctIndex: 1 },
      { id: "q2", question: "Pourquoi nettoyer les données avant analyse ?", options: ["Ce n'est jamais nécessaire", "Des données mal uniformisées faussent les résultats", "Cela ralentit toujours le travail sans raison", "Uniquement pour faire joli"], correctIndex: 1 },
      { id: "q3", question: "Que permet un tableau croisé dynamique dans Excel ?", options: ["Supprimer des données", "Résumer rapidement de grandes quantités de données", "Envoyer des emails", "Créer des mots de passe"], correctIndex: 1 },
      { id: "q4", question: "Pourquoi comparer la moyenne ET la médiane ?", options: ["La moyenne peut être trompeuse si des valeurs extrêmes existent", "Ce sont exactement la même chose", "La médiane n'a aucune utilité", "Ce n'est jamais nécessaire"], correctIndex: 0 },
      { id: "q5", question: "Un bon rapport d'analyse doit surtout contenir :", options: ["Uniquement des chiffres bruts sans explication", "Contexte, résultats clés et recommandations d'action", "Le plus de pages possible", "Aucun graphique"], correctIndex: 1 }
    ]
  },
  "ecommerce-pme": {
    passingScore: 80,
    questions: [
      { id: "q1", question: "Quel élément est essentiel pour créer la confiance en e-commerce ?", options: ["Cacher les photos des produits", "Photos de qualité, description honnête et avis clients", "Ne jamais répondre aux questions", "Un prix caché jusqu'à la livraison"], correctIndex: 1 },
      { id: "q2", question: "Pour une PME qui démarre en ligne, quelle option est souvent la plus simple ?", options: ["Développer une plateforme complexe immédiatement", "Commencer avec WhatsApp Business ou Facebook Shop", "Attendre d'avoir un gros budget avant de commencer", "Ignorer les réseaux sociaux"], correctIndex: 1 },
      { id: "q3", question: "Une bonne fiche produit doit inclure :", options: ["Aucune photo", "Titre clair, plusieurs photos, description complète et prix", "Uniquement le nom du produit", "Un texte très long sans photo"], correctIndex: 1 },
      { id: "q4", question: "Pourquoi communiquer clairement les délais de livraison ?", options: ["Cela n'a pas d'importance", "Cela évite les litiges et rassure le client", "Cela ralentit toujours les ventes", "Ce n'est utile que pour les grandes entreprises"], correctIndex: 1 },
      { id: "q5", question: "Quel est un des meilleurs outils marketing pour une boutique en ligne ?", options: ["Les avis et recommandations de clients satisfaits", "Cacher tous les avis clients", "Ignorer les clients existants", "Ne jamais communiquer sur les réseaux sociaux"], correctIndex: 0 }
    ]
  },
  "wordpress": {
    passingScore: 80,
    questions: [
      { id: "q1", question: "Pour créer un site WordPress, on a besoin de :", options: ["Rien du tout", "Un hébergement et un nom de domaine", "Uniquement un compte email", "Un ordinateur puissant obligatoirement"], correctIndex: 1 },
      { id: "q2", question: "Que définit un thème WordPress ?", options: ["Le contenu du site uniquement", "L'apparence générale du site (couleurs, mise en page)", "La sécurité du site", "Rien d'important"], correctIndex: 1 },
      { id: "q3", question: "Quelle est la page la plus visitée avant une décision d'achat ?", options: ["La page Contact", "La page 404", "Le pied de page", "Aucune page en particulier"], correctIndex: 0 },
      { id: "q4", question: "Quels sont les 3 types de plugins essentiels mentionnés ?", options: ["Musique, jeux, vidéos", "Formulaire de contact, SEO, sécurité", "Uniquement des jeux", "Aucun plugin n'est utile"], correctIndex: 1 },
      { id: "q5", question: "Pourquoi mettre à jour régulièrement WordPress et ses plugins ?", options: ["Ce n'est jamais nécessaire", "Pour rester sécurisé et compatible", "Cela rend le site plus lent volontairement", "Uniquement pour changer les couleurs"], correctIndex: 1 }
    ]
  },
  "html-css": {
    passingScore: 80,
    questions: [
      { id: "q1", question: "Que signifie HTML ?", options: ["Un langage de programmation avancé", "Un langage qui structure le contenu d'une page web", "Un logiciel de retouche photo", "Une base de données"], correctIndex: 1 },
      { id: "q2", question: "À quoi sert CSS ?", options: ["Structurer le contenu", "Définir l'apparence (couleurs, tailles, espacements)", "Envoyer des emails", "Créer des bases de données"], correctIndex: 1 },
      { id: "q3", question: "Que permet Flexbox en CSS ?", options: ["Supprimer le HTML", "Organiser facilement des éléments en ligne ou colonne avec alignement", "Envoyer des formulaires", "Rien d'utile"], correctIndex: 1 },
      { id: "q4", question: "Le design 'mobile-first' consiste à :", options: ["Ignorer complètement le mobile", "Concevoir d'abord pour petit écran puis adapter aux grands écrans", "Concevoir uniquement pour ordinateur", "Ne jamais utiliser CSS"], correctIndex: 1 },
      { id: "q5", question: "Que fait l'attribut 'required' sur un champ de formulaire ?", options: ["Rien du tout", "Empêche l'envoi du formulaire si le champ est vide", "Supprime le champ", "Change la couleur du champ"], correctIndex: 1 }
    ]
  },
  "app-mobile-nocode": {
    passingScore: 80,
    questions: [
      { id: "q1", question: "Le No-Code permet de :", options: ["Créer des applications uniquement en écrivant du code complexe", "Créer des applications par assemblage visuel, sans coder", "Remplacer totalement les développeurs dans tous les cas", "Fonctionner uniquement sur ordinateur"], correctIndex: 1 },
      { id: "q2", question: "Pourquoi dessiner les écrans sur Figma avant de construire l'app ?", options: ["Ce n'est jamais utile", "Cela évite des erreurs coûteuses à corriger plus tard", "Cela remplace complètement le développement", "Figma sert uniquement à la comptabilité"], correctIndex: 1 },
      { id: "q3", question: "Dans Glide, une feuille Google Sheets sert de :", options: ["Simple décoration", "Base de données qui alimente l'application", "Système de paiement", "Aucune utilité"], correctIndex: 1 },
      { id: "q4", question: "Pourquoi tester chaque bouton après l'avoir créé en No-Code ?", options: ["Ce n'est pas nécessaire", "Une navigation cassée est l'erreur la plus fréquente", "Les boutons ne peuvent jamais avoir de problème", "Cela ralentit toujours le projet sans raison"], correctIndex: 1 },
      { id: "q5", question: "Avant de partager une application, il est important de :", options: ["Ne jamais la tester", "La tester sur un vrai téléphone", "La publier immédiatement sans vérification", "Supprimer toutes les données"], correctIndex: 1 }
    ]
  }
};

COURSES.forEach(course => {
  course.quiz = QUIZZES[course.id];
});

export const MISSIONS: Mission[] = [
  {
    id: "mission-boutique-mode",
    company: "Boutique Mode Trend",
    companyType: "Commerce de détail",
    title: "Créer une page Facebook professionnelle",
    description: "La boutique a besoin d'une présence Facebook attractive avec du contenu de qualité pour attirer une nouvelle clientèle digitale.",
    context: "Boutique Mode Trend est une boutique de vêtements basée à Lomé qui vend principalement en magasin. La propriétaire souhaite toucher une clientèle digitale et booster ses ventes grâce aux réseaux sociaux, mais elle n'a aucune expérience en ligne.",
    objective: "Créer et configurer une page Facebook professionnelle complète avec du contenu initial pour attirer les premiers abonnés et donner une image sérieuse à la boutique.",
    tools: ["Facebook Business Suite", "Canva (gratuit)", "Téléphone pour les photos"],
    skills: ["Marketing Digital", "Réseaux Sociaux", "Création de contenu"],
    requiredCourseId: "marketing-digital",
    tasks: [
      { id: "t1", title: "Créer la page avec nom, logo et catégorie", description: "Ouvrir Facebook Business, créer la page avec le nom exact de la boutique, uploader le logo et sélectionner la bonne catégorie (Vêtements/Boutique)." },
      { id: "t2", title: "Rédiger la bio et les informations de contact", description: "Écrire une description attrayante (max 255 caractères), ajouter l'adresse complète, les horaires d'ouverture et le numéro WhatsApp." },
      { id: "t3", title: "Créer une photo de couverture sur Canva", description: "Utiliser Canva pour concevoir une couverture aux dimensions Facebook (820×312 px) mettant en valeur les produits phares de la boutique." },
      { id: "t4", title: "Publier 3 premiers posts de présentation", description: "Rédiger et publier : (1) post de présentation de la boutique, (2) mise en avant de 3 produits vedettes, (3) offre de bienvenue avec code promo." }
    ],
    xp: 200,
    deadline: "7 jours",
    location: "Lomé, Togo",
    category: "Marketing",
    resource: {
      fileName: "brief-boutique-mode-trend.txt",
      content: "MISSION TEST — Boutique Mode Trend\n\nContexte : boutique de vêtements à Lomé, vente principalement en magasin, aucune présence digitale.\n\nBesoin : une page Facebook professionnelle complète et prête à attirer les premiers clients en ligne.\n\nÉléments fournis par l'entreprise (simulés pour le test MVP) :\n- Nom : Boutique Mode Trend\n- Adresse : Rue du Commerce, Lomé\n- Horaires : Lundi-Samedi, 9h-19h\n- WhatsApp de contact : à indiquer sur la page\n- 3 produits phares à mettre en avant : robes d'été, ensembles bureau, accessoires\n\nLivrable attendu : lien vers la page Facebook créée, ou captures d'écran des 4 tâches réalisées."
    }
  },
  {
    id: "mission-restaurant",
    company: "Restaurant Le Baobab",
    companyType: "Restauration",
    title: "Concevoir une affiche promotionnelle",
    description: "Créer une affiche pour les menus du weekend et les promotions spéciales du restaurant.",
    context: "Restaurant Le Baobab est un restaurant traditionnel togolais à Kpalimé. Le gérant veut attirer plus de clients le weekend grâce à une affiche imprimée et publiée sur WhatsApp et Facebook. Il n'a pas de budget pour un graphiste professionnel.",
    objective: "Concevoir une affiche promotionnelle professionnelle pour les menus du weekend, adaptée à l'impression A3 et au partage sur les réseaux sociaux.",
    tools: ["Canva (gratuit)", "WhatsApp", "Imprimante locale"],
    skills: ["Design Graphique", "Canva", "Branding"],
    requiredCourseId: "design-canva",
    tasks: [
      { id: "t1", title: "Collecter les informations du restaurant", description: "Récupérer auprès du gérant : le menu du weekend, les prix, les promotions, le logo ou le nom stylisé, et les couleurs de la charte graphique." },
      { id: "t2", title: "Choisir un modèle Canva adapté", description: "Explorer les templates Canva pour 'restaurant flyer' ou 'menu promotion', sélectionner un modèle professionnel et coloré qui reflète l'ambiance togolaise." },
      { id: "t3", title: "Créer et personnaliser le design", description: "Intégrer toutes les informations collectées, ajuster les couleurs, les polices et les images pour un rendu attrayant et lisible." },
      { id: "t4", title: "Adapter pour impression et réseaux sociaux", description: "Exporter en format A3 (PDF haute résolution) pour l'impression et en format carré 1080×1080 px pour le partage sur Facebook et WhatsApp." },
      { id: "t5", title: "Livrer les fichiers finaux au gérant", description: "Envoyer les deux fichiers (PDF imprimable + JPEG réseaux sociaux) par WhatsApp ou email, avec un message d'explication sur leur utilisation." }
    ],
    xp: 250,
    deadline: "5 jours",
    location: "Kpalimé, Togo",
    category: "Design",
    resource: {
      fileName: "brief-restaurant-le-baobab.txt",
      content: "MISSION TEST — Restaurant Le Baobab\n\nContexte : restaurant traditionnel togolais à Kpalimé, souhaite plus de clients le weekend.\n\nMenu weekend (simulé pour le test) :\n- Fufu + sauce arachide — 2000 FCFA\n- Riz sauce tomate + poulet braisé — 2500 FCFA\n- Attiéké + poisson grillé — 2000 FCFA\n- Promotion : -10% pour toute commande avant 12h le samedi\n\nCouleurs suggérées : vert, orange, marron (ambiance chaleureuse et locale).\n\nLivrable attendu : fichier PDF (format A3) + image carrée (1080×1080) prêts à partager, ou lien Canva vers le design final."
    }
  },
  {
    id: "mission-pharmacie",
    company: "Pharmacie Centrale Plus",
    companyType: "Santé",
    title: "Analyser les ventes mensuelles",
    description: "Compiler et analyser les données de ventes du dernier trimestre pour identifier les tendances et optimiser les stocks.",
    context: "Pharmacie Centrale Plus est une pharmacie à Sokodé qui gère ses ventes manuellement sur des registres papier. Le responsable souhaite comprendre quels produits se vendent le mieux selon les mois pour mieux anticiper les commandes.",
    objective: "Créer un tableau de bord Excel propre à partir des données de ventes brutes et présenter un rapport clair avec les 3 insights clés pour aider à la décision.",
    tools: ["Microsoft Excel ou Google Sheets", "Google Slides ou PowerPoint"],
    skills: ["Analyse de Données", "Excel", "Reporting"],
    requiredCourseId: "analyse-donnees",
    tasks: [
      { id: "t1", title: "Collecter et numériser les données de ventes", description: "Récupérer les registres de ventes des 3 derniers mois et les saisir dans un tableau Excel structuré (date, produit, quantité, prix unitaire, total)." },
      { id: "t2", title: "Nettoyer et organiser les données", description: "Vérifier les erreurs de saisie, supprimer les doublons, uniformiser les noms de produits et calculer les totaux mensuels." },
      { id: "t3", title: "Créer les graphiques de tendances", description: "Générer 3 graphiques : évolution des ventes par mois, top 10 produits les plus vendus, et répartition des ventes par catégorie." },
      { id: "t4", title: "Identifier les 3 insights clés", description: "Analyser les graphiques et rédiger 3 observations concrètes avec des recommandations d'action (ex: 'Le produit X se vend 3x plus en saison des pluies')." },
      { id: "t5", title: "Rédiger et présenter le rapport final", description: "Créer une présentation de 5 slides maximum avec les graphiques et les recommandations, à présenter oralement au responsable." }
    ],
    xp: 300,
    deadline: "10 jours",
    location: "Sokodé, Togo",
    category: "Data",
    resource: {
      fileName: "donnees-pharmacie-centrale-plus.txt",
      content: "MISSION TEST — Pharmacie Centrale Plus\n\nDonnées de ventes simulées (3 derniers mois), à réorganiser dans un tableau Excel :\n\nJuillet : Paracétamol 120 unités, Amoxicilline 60 unités, Vitamine C 90 unités\nAoût : Paracétamol 150 unités, Amoxicilline 55 unités, Vitamine C 140 unités\nSeptembre : Paracétamol 130 unités, Amoxicilline 80 unités, Vitamine C 200 unités\n\nPrix unitaires indicatifs : Paracétamol 500 FCFA, Amoxicilline 1500 FCFA, Vitamine C 800 FCFA.\n\nLivrable attendu : fichier Excel/Sheets avec tableau + 3 graphiques, et courte présentation (max 5 slides) avec 3 insights clés."
    }
  },
  {
    id: "mission-salon",
    company: "Salon Beauté Élégance",
    companyType: "Beauté & Bien-être",
    title: "Optimiser le profil Instagram",
    description: "Restructurer le profil Instagram avec une bio optimisée, des highlights et un planning de publications pour les 30 prochains jours.",
    context: "Salon Beauté Élégance est un salon de coiffure et de soins à Atakpamé. La gérante a déjà un compte Instagram avec quelques photos, mais le profil est incomplet et les publications sont irrégulières. Elle perd des clients potentiels.",
    objective: "Transformer le profil Instagram existant en vitrine professionnelle attractive avec une bio optimisée, des highlights organisés et un planning éditorial de 30 jours prêt à l'emploi.",
    tools: ["Instagram", "Canva (highlights covers)", "Google Sheets (calendrier)"],
    skills: ["Instagram", "Réseaux Sociaux", "Photographie"],
    requiredCourseId: "reseaux-sociaux",
    tasks: [
      { id: "t1", title: "Auditer le profil et identifier les manques", description: "Analyser le profil actuel : photo de profil, bio, highlights, dernières publications. Lister les 5 points à améliorer en priorité." },
      { id: "t2", title: "Rédiger la nouvelle bio optimisée", description: "Écrire une bio de max 150 caractères avec : ce que propose le salon, un emoji pertinent, la localisation et un call-to-action (ex: 'Réservez sur WhatsApp 👇')." },
      { id: "t3", title: "Créer les highlights et leurs couvertures", description: "Créer 4 highlights thématiques (Coiffures, Soins, Tarifs, Avis clients) avec des couvertures Canva cohérentes aux couleurs du salon." },
      { id: "t4", title: "Préparer le calendrier de 30 publications", description: "Créer un tableau Google Sheets avec 30 jours de publications planifiées : date, type de post (photo/reel/story), sujet, légende suggérée et hashtags recommandés." }
    ],
    xp: 200,
    deadline: "3 jours",
    location: "Atakpamé, Togo",
    category: "Social Media",
    resource: {
      fileName: "brief-salon-beaute-elegance.txt",
      content: "MISSION TEST — Salon Beauté Élégance\n\nContexte : salon de coiffure et soins à Atakpamé, profil Instagram existant mais incomplet et irrégulier.\n\nServices proposés (simulés) : coiffure femme, tresses, soins du visage, manucure/pédicure.\n\nCouleurs de la charte : rose poudré et doré.\n\nContact à mettre en avant : réservation via WhatsApp.\n\nLivrable attendu : texte de la nouvelle bio, aperçu des 4 highlights (captures ou liens Canva), et lien vers le calendrier de 30 publications (Google Sheets)."
    }
  }
];

export const BADGES: Badge[] = [
  { id: "first-step", title: "Premier Pas", description: "Profil créé avec succès", emoji: "🚀" },
  { id: "active-learner", title: "Apprenant Actif", description: "Premier cours complété", emoji: "📚" },
  { id: "quiz-master", title: "Quiz Master", description: "Premier questionnaire réussi", emoji: "🧠" },
  { id: "digital-marketer", title: "Digital Marketer", description: "Cours Marketing Digital complété", emoji: "📣" },
  { id: "creative", title: "Créatif", description: "Cours Design Graphique complété", emoji: "🖌️" },
  { id: "data-analyst", title: "Data Analyst", description: "Cours Analyse de Données complété", emoji: "📈" },
  { id: "web-builder", title: "Web Builder", description: "Cours WordPress ou HTML/CSS complété", emoji: "🖥️" },
  { id: "app-maker", title: "App Maker", description: "Cours App Mobile No-Code complété", emoji: "📲" },
  { id: "missionnaire", title: "Missionné", description: "Première mission acceptée", emoji: "🎯" },
  { id: "xp-100", title: "100 XP", description: "100 points d'expérience gagnés", emoji: "⭐" },
  { id: "xp-500", title: "Étoile Montante", description: "500 points d'expérience gagnés", emoji: "🌟" }
];

export function getModuleXp(course: Course, moduleIndex: number): number {
  const base = Math.floor(course.xp / course.moduleList.length);
  if (moduleIndex === course.moduleList.length - 1) {
    return course.xp - base * (course.moduleList.length - 1);
  }
  return base;
}

export function getTaskXp(mission: Mission, taskIndex: number): number {
  const base = Math.floor(mission.xp / mission.tasks.length);
  if (taskIndex === mission.tasks.length - 1) {
    return mission.xp - base * (mission.tasks.length - 1);
  }
  return base;
}
