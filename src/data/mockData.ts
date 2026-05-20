export interface Module {
  id: string;
  title: string;
  duration: string;
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
}

export interface MissionTask {
  id: string;
  title: string;
  description: string;
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
      { id: "m1", title: "Introduction au Marketing Digital", duration: "8 min" },
      { id: "m2", title: "SEO et Référencement Naturel", duration: "10 min" },
      { id: "m3", title: "Publicités Facebook & Instagram", duration: "10 min" },
      { id: "m4", title: "Stratégie de Contenu", duration: "9 min" },
      { id: "m5", title: "Mesure et Analytics", duration: "8 min" }
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
      { id: "m1", title: "Interface Canva et outils de base", duration: "8 min" },
      { id: "m2", title: "Typographie et harmonie des couleurs", duration: "10 min" },
      { id: "m3", title: "Créer des posts pour réseaux sociaux", duration: "12 min" },
      { id: "m4", title: "Design d'affiches et de flyers", duration: "12 min" },
      { id: "m5", title: "Construire une identité visuelle", duration: "10 min" },
      { id: "m6", title: "Export et formats de fichiers", duration: "8 min" }
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
      { id: "m1", title: "Stratégie Social Media", duration: "10 min" },
      { id: "m2", title: "Facebook pour les entreprises", duration: "12 min" },
      { id: "m3", title: "Instagram et Reels", duration: "12 min" },
      { id: "m4", title: "TikTok et contenu viral", duration: "10 min" },
      { id: "m5", title: "Calendrier éditorial", duration: "12 min" },
      { id: "m6", title: "Gestion de communauté", duration: "10 min" },
      { id: "m7", title: "Publicités sociales payantes", duration: "12 min" },
      { id: "m8", title: "Analyse des performances", duration: "12 min" }
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
      { id: "m1", title: "Introduction à la donnée", duration: "10 min" },
      { id: "m2", title: "Collecte et sources de données", duration: "12 min" },
      { id: "m3", title: "Excel avancé pour l'analyse", duration: "14 min" },
      { id: "m4", title: "Nettoyage des données", duration: "12 min" },
      { id: "m5", title: "Statistiques descriptives", duration: "12 min" },
      { id: "m6", title: "Visualisation avec graphiques", duration: "12 min" },
      { id: "m7", title: "Tableaux de bord interactifs", duration: "12 min" },
      { id: "m8", title: "Interprétation des résultats", duration: "12 min" },
      { id: "m9", title: "Rédaction d'un rapport d'analyse", duration: "12 min" },
      { id: "m10", title: "Présentation des insights", duration: "12 min" }
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
      { id: "m1", title: "Principes du commerce en ligne", duration: "10 min" },
      { id: "m2", title: "Choisir sa plateforme e-commerce", duration: "12 min" },
      { id: "m3", title: "Créer des fiches produits efficaces", duration: "14 min" },
      { id: "m4", title: "Logistique et gestion des livraisons", duration: "12 min" },
      { id: "m5", title: "Marketing pour booster les ventes", duration: "12 min" }
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
      { id: "m1", title: "Héberger et installer WordPress", duration: "12 min" },
      { id: "m2", title: "Choisir et personnaliser un thème", duration: "15 min" },
      { id: "m3", title: "Créer des pages et articles", duration: "14 min" },
      { id: "m4", title: "Plugins essentiels (contact, SEO, sécurité)", duration: "14 min" },
      { id: "m5", title: "Mise en ligne et référencement de base", duration: "10 min" },
      { id: "m6", title: "Maintenance et mises à jour", duration: "10 min" }
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
      { id: "m1", title: "Structure d'une page HTML", duration: "14 min" },
      { id: "m2", title: "Titres, paragraphes et liens", duration: "12 min" },
      { id: "m3", title: "Mise en forme avec CSS", duration: "14 min" },
      { id: "m4", title: "Mise en page avec Flexbox", duration: "16 min" },
      { id: "m5", title: "Design responsive (mobile-first)", duration: "16 min" },
      { id: "m6", title: "Formulaires et champs de saisie", duration: "12 min" },
      { id: "m7", title: "Publier son site gratuitement", duration: "6 min" }
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
      { id: "m1", title: "Introduction au No-Code et ses outils", duration: "12 min" },
      { id: "m2", title: "Concevoir l'interface de l'app (Figma)", duration: "16 min" },
      { id: "m3", title: "Construire les écrans avec Glide", duration: "18 min" },
      { id: "m4", title: "Logique, boutons et navigation", duration: "16 min" },
      { id: "m5", title: "Connecter une base de données (Sheets)", duration: "12 min" },
      { id: "m6", title: "Tester et publier l'application", duration: "6 min" }
    ]
  }
];

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
    tasks: [
      { id: "t1", title: "Créer la page avec nom, logo et catégorie", description: "Ouvrir Facebook Business, créer la page avec le nom exact de la boutique, uploader le logo et sélectionner la bonne catégorie (Vêtements/Boutique)." },
      { id: "t2", title: "Rédiger la bio et les informations de contact", description: "Écrire une description attrayante (max 255 caractères), ajouter l'adresse complète, les horaires d'ouverture et le numéro WhatsApp." },
      { id: "t3", title: "Créer une photo de couverture sur Canva", description: "Utiliser Canva pour concevoir une couverture aux dimensions Facebook (820×312 px) mettant en valeur les produits phares de la boutique." },
      { id: "t4", title: "Publier 3 premiers posts de présentation", description: "Rédiger et publier : (1) post de présentation de la boutique, (2) mise en avant de 3 produits vedettes, (3) offre de bienvenue avec code promo." }
    ],
    xp: 200,
    deadline: "7 jours",
    location: "Lomé, Togo",
    category: "Marketing"
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
    category: "Design"
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
    category: "Data"
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
    tasks: [
      { id: "t1", title: "Auditer le profil et identifier les manques", description: "Analyser le profil actuel : photo de profil, bio, highlights, dernières publications. Lister les 5 points à améliorer en priorité." },
      { id: "t2", title: "Rédiger la nouvelle bio optimisée", description: "Écrire une bio de max 150 caractères avec : ce que propose le salon, un emoji pertinent, la localisation et un call-to-action (ex: 'Réservez sur WhatsApp 👇')." },
      { id: "t3", title: "Créer les highlights et leurs couvertures", description: "Créer 4 highlights thématiques (Coiffures, Soins, Tarifs, Avis clients) avec des couvertures Canva cohérentes aux couleurs du salon." },
      { id: "t4", title: "Préparer le calendrier de 30 publications", description: "Créer un tableau Google Sheets avec 30 jours de publications planifiées : date, type de post (photo/reel/story), sujet, légende suggérée et hashtags recommandés." }
    ],
    xp: 200,
    deadline: "3 jours",
    location: "Atakpamé, Togo",
    category: "Social Media"
  }
];

export const BADGES: Badge[] = [
  { id: "first-step", title: "Premier Pas", description: "Profil créé avec succès", emoji: "🚀" },
  { id: "active-learner", title: "Apprenant Actif", description: "Premier cours complété", emoji: "📚" },
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
