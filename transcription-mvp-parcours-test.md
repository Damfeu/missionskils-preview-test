# Rendre le MVP testable : transcription et consignes d'implémentation

> **Source** : message vocal WhatsApp du 21 septembre 2026 (5 min 41).
> **Objet** : proposition pour rendre le MVP réellement testable afin de valider les trois hypothèses du projet.
> **Note** : la transcription a été générée automatiquement puis nettoyée. Les passages entre `[crochets]` sont incertains et doivent être confirmés avant implémentation.

---

## 1. Contexte et objectif

Dans son état actuel, le MVP ne permet pas de tester réellement le parcours utilisateur. Par exemple, quand un utilisateur clique sur un cours, aucun contenu n'apparaît.

L'objectif est de rendre testable, **de bout en bout et avec un minimum de développement**, le parcours complet :

**inscription → parcours / cours → évaluation → mission → dépôt du travail**

Il s'agit ensuite de le faire tester par **au moins 5 utilisateurs réels** dans le temps restant, soit environ **7 semaines** à compter du 20-21 septembre 2026.

---

## 2. Les trois hypothèses à valider

| # | Hypothèse | Ce qu'on doit pouvoir observer |
|---|-----------|--------------------------------|
| H1 | L'utilisateur arrive à s'inscrire et à choisir son profil | Inscription réussie et profil sélectionné |
| H2 | L'utilisateur choisit un parcours, suit un cours et réussit l'évaluation | Cours consulté, questionnaire soumis, résultat obtenu |
| H3 | L'utilisateur accepte une mission, la réalise et dépose son travail | Mission acceptée, livrable déposé |

---

## 3. Fonctionnalités à implémenter (périmètre MVP)

### 3.1 Inscription et profil (H1)

- Vérifier que l'inscription fonctionne de bout en bout.
- Permettre le choix du profil à l'inscription ou juste après.

### 3.2 Parcours et cours (H2)

- L'utilisateur choisit un parcours.
- Chaque parcours contient **au moins un cours** portant sur **une compétence clé** (exemple évoqué : Community manangment , gestion de projet, marketing digital).
- **Pas besoin de produire nos propres cours pour le MVP.** Le contenu d'un cours peut être :
  - une **vidéo YouTube** intégrée ou en lien,
  - ou un **PDF court** (même 2 pages) consultable ou téléchargeable au clic.
- Le clic sur un cours doit **toujours** afficher un contenu. Aucun cours vide ne doit rester accessible.

### 3.3 Évaluation : questions-réponses (H2)

- Chaque cours est suivi d'un **questionnaire** (QCM / questions-réponses).
- Deux modes de correction possibles, à trancher :
  - **Automatique** : les réponses sont corrigées par le programme et le résultat s'affiche immédiatement.
  - **Manuelle** : les réponses sont transmises à un administrateur, qui les corrige et renvoie le résultat **sous 2 heures**.
- **Seuil de réussite** configurable (exemple évoqué : **80 %** de bonnes réponses).
- L'utilisateur voit clairement s'il a **réussi ou échoué**.
- Seule la réussite débloque l'étape Mission.

### 3.4 Mission (H3)

- Après réussite de l'évaluation, on **propose une mission** à l'utilisateur.
- Contrainte : il n'y a pas encore d'entreprise partenaire pour fournir des missions. **Solution MVP : l'équipe crée elle-même des missions test.** Une mission comprend :
  - un intitulé et une description du besoin,
  - des consignes / un test à réaliser,
  - éventuellement un **fichier joint** à télécharger (`[données / pièce jointe ?]`, à confirmer).
- L'utilisateur peut **accepter** la mission.
- Il **télécharge** les ressources, réalise la mission, puis **dépose son travail** (upload du livrable) sur la plateforme.
- L'équipe peut consulter les livrables déposés et le résultat de chaque mission.

### 3.5 Suivi des tests

- Pouvoir constater, pour chaque utilisateur testeur, les étapes franchies : inscription → profil → parcours → cours → évaluation (réussite / échec) → mission acceptée → livrable déposé.
- Objectif : **au moins 5 testeurs** allant jusqu'au bout, pour disposer de données concrètes permettant de valider (ou invalider) les hypothèses.

---

## 4. Points à clarifier avant ou pendant l'implémentation

1. Quelle compétence clé servira de premier cours (`[Excel ?]`) ?
2. Correction du questionnaire : automatique ou manuelle (sous 2 h) ?
3. Seuil de réussite : 80 % confirmé ?
4. Contenu exact de la mission test et nature du fichier joint.
5. Où en est l'implémentation actuelle du MVP ? Il faut faire l'état des lieux.
6. Date de la prochaine réunion pour faire le point et avoir des retours rapides.

---

## 5. Transcription nettoyée du message vocal

> Répétitions et hésitations retirées ; mots mal reconnus corrigés quand le sens était évident.

Oui, bonsoir, je suis là. Finalement, je n'ai pas pu me libérer 20 minutes. Oui, bien, tu avais oublié. Bien sûr.

Bon, ce que je voulais dire : la dernière fois, quand je travaillais sur le MVP, j'ai vu qu'au niveau où il se trouve actuellement, ça ne nous permet pas de tester véritablement les choses. Donc j'ai pensé à une chose simple.

Tu as vu, tu as lu les trois hypothèses. La dernière fois, tu as décliné les trois hypothèses. Quand tu les vois, tu te dis : OK, il faut valider premièrement si la personne arrive à s'inscrire et à choisir son profil. Si ça se passe bien, il faut ensuite que la personne choisisse un parcours et suive un cours.

Or, dans le MVP, il n'y a pas de cours à suivre : quand elle clique, il n'y a rien. Donc je me suis dit : même si on ne prépare pas nos propres cours, comme c'est un MVP, on peut chercher un contenu, soit une vidéo YouTube, soit une compétence clé. Par exemple une compétence sur [Excel ?], peut-être… j'ai oublié ce que j'avais en tête, je te reviens là-dessus. On cherche une compétence clé et on met soit une vidéo, soit un PDF, même de deux pages, que la personne lit quand elle clique.

Après, il y a les questions-réponses, l'évaluation. Soit on les intègre au programme pour que tu reçoives directement les réponses, soit tu les traites personnellement : quand la personne répond, dans les deux heures tu peux lui dire si elle a réussi ou pas. Par exemple, si elle a répondu correctement à 80 % du questionnaire, elle a réussi, selon le seuil que tu fixes.

Si elle a réussi, troisième étape : on lui propose une mission. Le problème, c'est peut-être du côté de l'entreprise qui propose la mission. Ce qu'on peut faire, c'est proposer nous-mêmes une mission : on a besoin de [telle donnée / telle tâche], on met un [intitulé ?], on met un test, on explique ce dont on a besoin et on met [le fichier / la data ?].

Si la personne accepte la mission, elle la fait, elle télécharge, puis elle dépose son travail sur la plateforme. On voit ainsi qu'elle a fait la mission, on a le résultat, et ainsi de suite. Même si on arrive à trouver cinq personnes, vu le temps qu'on a, je crois qu'on pourra véritablement avoir [des données / un MVP] avec lequel prouver les choses, avancer et valider.

Je ne sais pas si tu vois. On nous a demandé de pouvoir faire ça, c'est un peu ça.

Donc dis-moi où tu en es actuellement, ce que tu en penses, comment on peut le faire, et quand on peut se revoir pour en parler, avoir les retours rapidement et avancer. Aujourd'hui nous sommes le 20 (ou le 21), il nous reste 7 semaines [avant la fin de l'incubation ?]. Il faut mettre un peu plus d'efforts pour finir, et on verra.

Merci.
