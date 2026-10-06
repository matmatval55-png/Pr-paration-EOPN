// Raisonnement verbal (une des 6 épreuves du TAMI-C) : synonymes, antonymes, analogies, intrus.
import { registerBank } from '../core/bank.js';

const toItems = (arr) => arr.map(([q, a, d, e, l = 1]) => ({ q, a, d, e, l }));

const VERBAL = toItems([
  ['Synonyme de <b>RAPIDE</b> :', 'prompt', ['lent', 'lourd', 'calme'], '<b>Prompt</b> = qui agit vite.'],
  ['Synonyme de <b>AUDACIEUX</b> :', 'hardi', ['timide', 'prudent', 'paresseux'], '<b>Hardi</b> = qui ose.'],
  ['Synonyme de <b>RIGOUREUX</b> :', 'méticuleux', ['négligent', 'approximatif', 'désordonné'], '<b>Méticuleux</b> = qui fait les choses avec un soin minutieux.'],
  ['Synonyme de <b>ÉPHÉMÈRE</b> :', 'passager', ['éternel', 'durable', 'solide'], '<b>Passager</b> : qui dure peu.'],
  ['Synonyme de <b>PERSPICACE</b> :', 'clairvoyant', ['naïf', 'distrait', 'maladroit'], 'Qui comprend vite et voit ce qui échappe aux autres.', 2],
  ['Synonyme de <b>ENTRAVER</b> :', 'gêner', ['faciliter', 'encourager', 'libérer'], '<b>Gêner</b> : mettre des obstacles.', 2],
  ['Synonyme de <b>PROBANT</b> :', 'convaincant', ['douteux', 'faible', 'probable'], 'Qui prouve. Ne pas confondre avec « probable ».', 2],
  ['Synonyme de <b>INÉLUCTABLE</b> :', 'inévitable', ['incertain', 'improbable', 'évitable'], '<b>Inévitable</b> : qu’on ne peut empêcher.', 3],
  ['Synonyme de <b>PUSILLANIME</b> :', 'craintif', ['courageux', 'généreux', 'immense'], '<b>Craintif</b> : qui manque de courage.', 3],
  ['Synonyme de <b>ACQUIESCER</b> :', 'approuver', ['refuser', 'acquérir', 'questionner'], '<b>Approuver</b> : dire oui, donner son accord.', 3],
  ['Contraire de <b>ABONDANT</b> :', 'rare', ['nombreux', 'riche', 'copieux'], 'Abondant ≠ <b>rare</b>.'],
  ['Contraire de <b>DÉCOLLER</b> :', 'atterrir', ['voler', 'grimper', 'planer'], 'Décoller ≠ <b>atterrir</b>.'],
  ['Contraire de <b>OPTIMISTE</b> :', 'pessimiste', ['joyeux', 'confiant', 'réaliste'], 'L’optimiste voit le bon côté des choses, le <b>pessimiste</b> le mauvais.'],
  ['Contraire de <b>LOQUACE</b> :', 'taciturne', ['bavard', 'éloquent', 'volubile'], 'Loquace = qui parle beaucoup ; <b>taciturne</b> = qui parle peu.', 2],
  ['Contraire de <b>PRODIGUE</b> :', 'avare', ['généreux', 'dépensier', 'prodigieux'], 'Prodigue = qui dépense sans compter.', 2],
  ['Contraire de <b>ÉPHÉMÈRE</b> :', 'pérenne', ['bref', 'fugace', 'momentané'], '<b>Pérenne</b> = durable.', 2],
  ['Contraire de <b>EXHAUSTIF</b> :', 'partiel', ['complet', 'épuisant', 'total'], 'Exhaustif = qui traite tout.', 3],
  ['Contraire de <b>ZÉLÉ</b> :', 'nonchalant', ['dévoué', 'appliqué', 'ardent'], 'Zélé = plein d’ardeur ; nonchalant = sans ardeur.', 3],
  ['PILOTE est à AVION ce que CAPITAINE est à :', 'navire', ['grade', 'armée', 'mer'], 'Celui qui commande / conduit → le véhicule.'],
  ['MAIN est à GANT ce que PIED est à :', 'chaussure', ['jambe', 'orteil', 'marche'], 'Partie du corps → ce qui la couvre.'],
  ['OISEAU est à NID ce que ABEILLE est à :', 'ruche', ['miel', 'fleur', 'essaim'], 'Animal → son habitat.'],
  ['ÉTÉ est à HIVER ce que JOUR est à :', 'nuit', ['soleil', 'lune', 'midi'], 'Rapport d’opposition : été ↔ hiver, jour ↔ nuit.'],
  ['ALTIMÈTRE est à ALTITUDE ce que THERMOMÈTRE est à :', 'température', ['chaleur', 'degré', 'fièvre'], 'Instrument → grandeur mesurée.', 2],
  ['AUTEUR est à LIVRE ce que COMPOSITEUR est à :', 'symphonie', ['orchestre', 'piano', 'concert'], 'Créateur → œuvre.', 2],
  ['LENT est à LENTEUR ce que AUDACIEUX est à :', 'audace', ['audacieusement', 'audacieuse', 'oser'], 'Adjectif → nom correspondant.', 2],
  ['ESCADRILLE est à AVION ce que MEUTE est à :', 'chien', ['loup-garou', 'chasse', 'troupeau'], 'Groupe → élément du groupe (meute de chiens ou de loups).', 2],
  ['PRÉVENIR est à GUÉRIR ce que ANTICIPER est à :', 'réagir', ['prévoir', 'attendre', 'oublier'], 'Agir avant ↔ agir après.', 3],
  ['PROLIXE est à CONCIS ce que CONFUS est à :', 'clair', ['long', 'bavard', 'obscur'], 'Rapport de contraires : prolixe ↔ concis, confus ↔ clair.', 3],
  ['Trouve l’intrus :', 'tulipe', ['chêne', 'sapin', 'bouleau'], 'Les autres sont des arbres.'],
  ['Trouve l’intrus :', 'hélicoptère', ['planeur', 'avion', 'ULM'], 'L’hélicoptère est le seul aéronef à voilure tournante.'],
  ['Trouve l’intrus :', 'kilogramme', ['mètre', 'kilomètre', 'mille nautique'], 'Les autres mesurent des longueurs.'],
  ['Trouve l’intrus :', 'colonel', ['sergent', 'adjudant', 'major'], 'Les autres sont des grades de sous-officiers.', 2],
  ['Trouve l’intrus :', 'stratus', ['Rafale', 'Mirage', 'Alphajet'], 'Les autres sont des avions ; le stratus est un nuage.'],
  ['Trouve l’intrus :', 'transparent', ['opaque', 'obscur', 'sombre'], 'Les autres évoquent l’absence de lumière/de transparence.', 2],
  ['Trouve l’intrus :', 'loquace', ['taciturne', 'silencieux', 'muet'], 'Loquace = bavard, les autres = qui parle peu.', 3],
  ['Que signifie « <b>une attitude ambivalente</b> » ?', 'qui présente deux aspects opposés', ['très ambitieuse', 'hésitante entre trois choix', 'agressive'], 'Préfixe ambi- = les deux (comme ambidextre).', 2],
  ['Quel mot est correctement orthographié ?', 'aéronautique', ['aréonautique', 'aéronotique', 'aéronautic'], '<b>Aéronautique</b> : aéro- (air) + nautique.'],
  ['Quel mot est correctement orthographié ?', 'occurrence', ['occurence', 'ocurrence', 'occurrance'], '<b>Occurrence</b> : deux c, deux r.', 2],
  ['Complète : « Il a fait preuve d’un grand ___ face au danger. »', 'sang-froid', ['sans-froid', 'cent-froid', 'sens-froid'], 'Le <b>sang-froid</b> (avec trait d’union).', 2],
  ['Le mot « <b>inopiné</b> » signifie :', 'imprévu', ['inutile', 'opiniâtre', 'inconnu'], 'Qui arrive sans qu’on s’y attende.', 3],
]);

registerBank({ id: 'psy.verbal', module: 'psycho', group: 'Raisonnement verbal', title: 'Raisonnement verbal', desc: 'Synonymes, contraires, analogies, intrus, vocabulaire.', items: VERBAL, timeLimit: 20 });
