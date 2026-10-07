// Additional English content: 5 reading texts, 20 grammar and 20 vocabulary questions.
const TEXTS = [
  {
    title: 'On alert',
    text: `Somewhere in France, at any hour of the day or night, a pair of fighter pilots is waiting. They are on quick reaction alert: if an unidentified aircraft enters French airspace and does not answer radio calls, they may be ordered to take off within minutes. Most alerts turn out to be harmless — a light aircraft with a broken radio, an airliner that has forgotten to change frequency. Even so, every scramble is treated as real. The pilots join the aircraft, identify it visually, and try to establish contact using standard signals such as rocking their wings. Only on the orders of the highest authorities could force ever be used. For the crews, the hardest part is often not the flying but the waiting: staying focused and ready during long, quiet shifts.`,
    qs: [
      { q: 'What is the purpose of quick reaction alert?', a: 'To respond quickly to aircraft that may threaten the airspace', d: ['To train new pilots at night', 'To transport officials', 'To test new aircraft'], e: 'Fighters are ready to take off “within minutes” if an unidentified aircraft enters the airspace.' },
      { q: 'According to the text, most alerts are caused by:', a: 'harmless situations such as radio problems', d: ['enemy fighters', 'terrorist attacks', 'military exercises'], e: '“Most alerts turn out to be harmless — a light aircraft with a broken radio…”' },
      { q: 'What does “scramble” mean here?', a: 'an emergency take-off of fighters', d: ['a type of breakfast', 'a radio failure', 'a training flight'], e: 'In military aviation, <b>to scramble</b> = décoller en alerte.' },
      { q: 'How do the pilots try to communicate with a silent aircraft?', a: 'With standard visual signals such as rocking their wings', d: ['By sending an email', 'By firing warning shots immediately', 'By landing next to it'], e: '“…try to establish contact using standard signals such as rocking their wings.”' },
      { q: 'What is often the hardest part for the crews?', a: 'Staying focused during long periods of waiting', d: ['Flying at night', 'Talking to the press', 'Refuelling the aircraft'], e: 'Last sentence: “the hardest part is often not the flying but the waiting”.' },
    ],
  },
  {
    title: 'Volcanic ash',
    text: `In April 2010, the eruption of the Icelandic volcano Eyjafjallajökull closed much of European airspace for several days. Millions of passengers were stranded. The reason was simple but serious: volcanic ash contains tiny particles of glass and rock. When it enters a jet engine, the extreme heat can melt these particles, which then stick to the turbine and may cause the engine to lose power. Ash can also scratch windshields, block sensors and damage the airframe. Since then, authorities have developed more precise tools to measure ash concentration, allowing airlines to fly around dangerous areas instead of closing entire regions. The episode showed how a natural event far away can disrupt modern transport systems and economies.`,
    qs: [
      { q: 'What happened in April 2010?', a: 'A volcanic eruption closed much of European airspace', d: ['A storm destroyed airports', 'Pilots went on strike', 'A new engine was tested'], e: 'First sentence of the text.' },
      { q: '“Stranded” most likely means:', a: 'unable to leave a place', d: ['very happy', 'injured', 'arrested'], e: '<b>Stranded</b> = bloqué (sans pouvoir partir).' },
      { q: 'Why is ash dangerous for jet engines?', a: 'Its particles can melt and stick to the turbine', d: ['It makes the fuel freeze', 'It is radioactive', 'It increases the engine’s weight'], e: '“…the extreme heat can melt these particles, which then stick to the turbine…”' },
      { q: 'What has changed since 2010?', a: 'Better measurement allows aircraft to avoid only the dangerous areas', d: ['Aircraft can now fly through any ash cloud', 'All flights over Iceland are banned', 'Volcanoes are monitored by fighter jets'], e: '“…allowing airlines to fly around dangerous areas instead of closing entire regions.”' },
      { q: 'What general idea does the last sentence express?', a: 'A distant natural event can disrupt modern systems', d: ['Volcanoes are becoming more frequent', 'Airlines are responsible for the crisis', 'Europe has too many airports'], e: '“…a natural event far away can disrupt modern transport systems and economies.”' },
    ],
  },
  {
    title: 'Pioneers',
    text: `In 1910, Raymonde de Laroche became the first woman in the world to hold a pilot’s licence. At the time, many people believed that flying was far too dangerous for women — and, frankly, for anyone. Over the following decades, female aviators kept proving them wrong, setting records for altitude, speed and distance. Yet access to military flying remained closed to women in most countries until the late twentieth century. Today, women fly fighters, transport aircraft and helicopters in many air forces, including France’s. Selection criteria are the same for everyone, and the challenges of training are identical. As one instructor put it, “The aircraft doesn’t know who is flying it. It only knows whether the flying is good.”`,
    qs: [
      { q: 'What did Raymonde de Laroche achieve in 1910?', a: 'She became the first woman to hold a pilot’s licence', d: ['She crossed the Atlantic', 'She became a fighter pilot', 'She designed an aircraft'], e: 'First sentence of the text.' },
      { q: 'What did many people believe at the time?', a: 'That flying was too dangerous', d: ['That women were better pilots', 'That aircraft would never fly', 'That licences were useless'], e: '“…many people believed that flying was far too dangerous for women — and, frankly, for anyone.”' },
      { q: '“Kept proving them wrong” means that female aviators:', a: 'repeatedly showed that those beliefs were false', d: ['stopped flying', 'agreed with them', 'made many mistakes'], e: '<b>Keep + -ing</b> = continuer à ; <b>prove someone wrong</b> = démontrer que quelqu’un a tort.' },
      { q: 'According to the text, selection criteria today are:', a: 'the same for men and women', d: ['easier for women', 'harder for women', 'not mentioned'], e: '“Selection criteria are the same for everyone.”' },
      { q: 'What does the instructor’s quote mean?', a: 'Only the quality of the flying matters', d: ['Aircraft are intelligent', 'Instructors prefer male pilots', 'Pilots should not talk to their aircraft'], e: '“It only knows whether the flying is good.”' },
    ],
  },
  {
    title: 'Search and rescue',
    text: `The call came at 2 a.m.: a fishing boat was taking on water forty nautical miles off the coast, in heavy seas. Within thirty minutes, a rescue helicopter was airborne. The crew — two pilots, a winch operator and a rescue swimmer — had to fly through rain and strong gusts, relying on their instruments and night-vision goggles. Above the boat, the pilots held a steady hover while the winch operator guided the swimmer down onto the moving deck. Each of the four fishermen was lifted to safety in turn. On the way back, fuel was the main concern: the crew had planned the mission carefully, and they landed with the reserve they had calculated before take-off. For the team, the success came from training, teamwork and clear communication.`,
    qs: [
      { q: 'Why was the helicopter sent?', a: 'A fishing boat was in danger of sinking', d: ['A plane had crashed', 'A swimmer was lost on the beach', 'For a training exercise'], e: '“…a fishing boat was taking on water…” (= prenait l’eau).' },
      { q: 'What did the pilots have to do above the boat?', a: 'Keep the helicopter in a stable hover', d: ['Land on the deck', 'Drop supplies only', 'Fly in circles'], e: '“…the pilots held a steady hover…” <i>Hover</i> = vol stationnaire.' },
      { q: 'Who went down onto the boat?', a: 'The rescue swimmer', d: ['The pilots', 'The winch operator', 'A fisherman'], e: 'The winch operator “guided the swimmer down onto the moving deck”.' },
      { q: 'What was the main concern on the way back?', a: 'Fuel', d: ['The weather radar', 'The fishermen’s injuries', 'Radio contact'], e: '“On the way back, fuel was the main concern.”' },
      { q: 'What does the crew think made the mission a success?', a: 'Training, teamwork and clear communication', d: ['Luck and good weather', 'A powerful new helicopter', 'The help of another boat'], e: 'Last sentence of the text.' },
    ],
  },
  {
    title: 'Training the mind',
    text: `Top athletes have long used mental rehearsal: before a race, they picture every movement in detail. Pilots do something similar, often called “chair flying”. Sitting in a quiet room, the student imagines the whole flight, from the checklist to the landing, touching imaginary switches and saying radio calls out loud. Research suggests that this kind of visualisation activates many of the same brain areas as the real action, which helps to build automatic responses. It is cheap, can be done anywhere and is particularly useful for emergency procedures, which cannot be practised often in a real aircraft. Instructors warn, however, that it only works if the procedures being rehearsed are correct: practising a mistake makes the mistake automatic too.`,
    qs: [
      { q: 'What is “chair flying”?', a: 'Mentally rehearsing a flight while sitting down', d: ['Flying a very small aircraft', 'Learning to fly in a simulator', 'Sleeping during long flights'], e: 'The student “imagines the whole flight… touching imaginary switches”.' },
      { q: 'Why can visualisation be effective, according to research?', a: 'It activates brain areas similar to those used in the real action', d: ['It replaces real flying completely', 'It reduces the cost of fuel', 'It makes pilots stronger'], e: '“…activates many of the same brain areas as the real action…”' },
      { q: 'Why is it especially useful for emergency procedures?', a: 'Because they cannot often be practised in a real aircraft', d: ['Because emergencies are frequent', 'Because they are easy', 'Because instructors refuse to teach them'], e: '“…emergency procedures, which cannot be practised often in a real aircraft.”' },
      { q: 'What warning do instructors give?', a: 'Rehearsing a wrong procedure makes the error automatic', d: ['Visualisation is dangerous', 'It should only be done in the cockpit', 'It takes too much time'], e: '“…practising a mistake makes the mistake automatic too.”' },
      { q: 'Which application to your own preparation is closest to the text?', a: 'Imagining the test day and each test step by step', d: ['Avoiding any preparation the day before', 'Only reading the rules once', 'Watching films about pilots'], e: 'The same technique works for the selection: visualise the tests, the interview and your answers.' },
    ],
  },
];

export const READING_EXTRA = TEXTS.flatMap((t) => t.qs.map((q) => ({ ...q, t: 90, ctx: `<b>${t.title}</b><br>${t.text}` })));

export const GRAMMAR_EXTRA = [
  { l: 1, q: 'She doesn’t like ___ early.', a: 'getting up', d: ['get up', 'to getting up', 'got up'], e: '<b>Like</b> + -ing (or to + verb) for habits/tastes. “To getting” is impossible.' },
  { l: 1, q: 'There ___ two aircraft on the apron.', a: 'are', d: ['is', 'be', 'has'], e: '<b>Aircraft</b> is the same in the singular and plural: two aircraft → <b>there are</b>.' },
  { l: 1, q: 'I’m not as tall ___ my brother.', a: 'as', d: ['than', 'that', 'like'], e: 'Comparison of equality: <b>as … as</b> (not as … as).' },
  { l: 1, q: 'What time ___ the briefing start?', a: 'does', d: ['do', 'is', 'has'], e: 'Present simple question with he/she/it: <b>does</b> + base verb.' },
  { l: 1, q: 'It’s the ___ day of my life!', a: 'best', d: ['better', 'most good', 'goodest'], e: 'Superlative of good: good → better → <b>the best</b>.' },
  { l: 1, q: 'We ___ the exam yet.', a: 'haven’t taken', d: ['didn’t take', 'don’t take', 'hadn’t take'], e: '<b>Yet</b> in a negative sentence → present perfect: haven’t taken.' },
  { l: 1, q: 'He ___ a book when the phone rang.', a: 'was reading', d: ['read', 'is reading', 'has read'], e: 'Past continuous for an action in progress interrupted by another (past simple).' },
  { l: 2, q: 'You ___ bring your passport; an ID card is enough.', a: 'don’t have to', d: ['mustn’t', 'can’t', 'shouldn’t to'], e: '<b>Don’t have to</b> = it’s not necessary. <b>Mustn’t</b> = it’s forbidden.' },
  { l: 2, q: 'The test was ___ difficult that nobody finished.', a: 'so', d: ['such', 'too', 'very'], e: '<b>So</b> + adjective + that ; <b>such</b> + (a) + noun + that (such a difficult test).' },
  { l: 2, q: 'I’d like you ___ the report by Friday.', a: 'to finish', d: ['finish', 'finishing', 'that you finish'], e: '<b>Would like / want + someone + to + verb</b>.' },
  { l: 2, q: 'He apologised ___ late.', a: 'for being', d: ['to be', 'for be', 'of being'], e: '<b>Apologise for + -ing</b>.' },
  { l: 2, q: 'They made us ___ the procedure again.', a: 'repeat', d: ['to repeat', 'repeating', 'repeated'], e: '<b>Make someone do</b> (no “to”). But in the passive: we were made <b>to</b> repeat.' },
  { l: 2, q: 'This is the base ___ I did my training.', a: 'where', d: ['which', 'who', 'what'], e: '<b>Where</b> for a place (= in which).' },
  { l: 2, q: 'If you ___ any problems, call the duty officer.', a: 'have', d: ['will have', 'would have', 'had had'], e: 'First conditional: <b>if + present</b>, imperative or will.' },
  { l: 3, q: 'Little ___ that the test would be so hard.', a: 'did I know', d: ['I knew', 'I did know', 'knew I'], e: 'Negative adverb <b>Little</b> at the start → inversion with auxiliary: did I know.' },
  { l: 3, q: 'Were it not for his calm, the crew ___ panicked.', a: 'would have', d: ['will have', 'had', 'would'], e: '<b>Were it not for</b> = if it hadn’t been for (formal inverted conditional) → would have + past participle.' },
  { l: 3, q: 'By the time you read this, I ___ for Tours.', a: 'will have left', d: ['will leave', 'have left', 'leave'], e: 'Future perfect: an action completed before a future moment.' },
  { l: 3, q: 'She is said ___ the best pilot of her year.', a: 'to be', d: ['being', 'that she is', 'be'], e: 'Impersonal passive: <b>be said / be thought / be believed + to + verb</b>.' },
  { l: 3, q: 'I object ___ treated like a beginner.', a: 'to being', d: ['to be', 'being', 'for being'], e: '<b>Object to + -ing</b> (to is a preposition): object to being treated.' },
  { l: 3, q: 'Only after the debrief ___ his mistake.', a: 'did he realise', d: ['he realised', 'he did realise', 'realised he'], e: '<b>Only after / only when</b> at the start → inversion in the main clause.' },
];

export const VOCAB_EXTRA = [
  { l: 1, q: '“To achieve” a goal means to:', a: 'reach it successfully', d: ['abandon it', 'finish a building', 'arrive late'], e: '<b>Achieve</b> = atteindre, accomplir. Noun: achievement.' },
  { l: 1, q: '“A deadline” is:', a: 'the latest time by which something must be done', d: ['a dead telephone line', 'a dangerous zone', 'a finish line in a race'], e: '<b>Deadline</b> = date limite.' },
  { l: 1, q: '“To apply for” a job means to:', a: 'formally ask to be considered for it', d: ['to use it', 'to refuse it', 'to start it'], e: '<b>Apply for</b> = postuler, candidater. Application = candidature.' },
  { l: 1, q: '“To find out” means:', a: 'to discover information', d: ['to lose something', 'to go outside', 'to invent'], e: 'Phrasal verb <b>find out</b> = découvrir, apprendre.' },
  { l: 1, q: '“Tired” and “exhausted” differ in:', a: 'intensity (exhausted is much stronger)', d: ['meaning (they are opposites)', 'nothing at all', 'register (exhausted is slang)'], e: '<b>Exhausted</b> = épuisé, stronger than tired.' },
  { l: 1, q: '“Currently” means:', a: 'at present / now', d: ['quickly', 'in the past', 'correctly'], e: '<b>Currently</b> = actuellement (careful: actually = en fait).' },
  { l: 1, q: 'Choose the correct collocation: to ___ a mistake', a: 'make', d: ['do', 'take', 'have'], e: 'We <b>make</b> a mistake (faire une erreur).' },
  { l: 2, q: '“To set up” a new unit means to:', a: 'create or establish it', d: ['close it', 'visit it', 'move it upstairs'], e: '<b>Set up</b> = créer, mettre en place.' },
  { l: 2, q: '“To point out” means:', a: 'to draw attention to something', d: ['to aim a weapon', 'to leave a room', 'to give points'], e: '<b>Point out</b> = souligner, faire remarquer.' },
  { l: 2, q: '“Assessment” is closest to:', a: 'evaluation', d: ['assistance', 'assumption', 'agreement'], e: '<b>Assessment</b> = évaluation. Assessor = évaluateur.' },
  { l: 2, q: '“Willing” means:', a: 'ready and happy to do something', d: ['forced to do something', 'strong-willed', 'able to'], e: '<b>Be willing to</b> = être prêt à, disposé à.' },
  { l: 2, q: '“Furthermore” is used to:', a: 'add an argument', d: ['express contrast', 'give a conclusion', 'express time'], e: '<b>Furthermore / moreover</b> = de plus.' },
  { l: 2, q: '“Whereas” expresses:', a: 'contrast', d: ['cause', 'time', 'purpose'], e: '<b>Whereas</b> = alors que (opposition).' },
  { l: 2, q: '“A shortcoming” is:', a: 'a weakness or fault', d: ['a quick arrival', 'a short flight', 'a type of coat'], e: '<b>Shortcoming</b> = défaut, lacune.' },
  { l: 3, q: '“Resilience” is the ability to:', a: 'recover quickly from difficulties', d: ['resist changes forever', 'remember details', 'resign from a job'], e: '<b>Resilience</b> = résilience — a key quality in military selection.' },
  { l: 3, q: '“To undermine” someone’s confidence means to:', a: 'gradually weaken it', d: ['to strengthen it', 'to dig a tunnel', 'to underline it'], e: '<b>Undermine</b> = saper, affaiblir.' },
  { l: 3, q: '“Pivotal” means:', a: 'of crucial importance', d: ['able to rotate', 'secondary', 'outdated'], e: '<b>Pivotal</b> = crucial, décisif.' },
  { l: 3, q: '“To comply with” the rules means to:', a: 'obey them', d: ['to complain about them', 'to complete them', 'to compare them'], e: '<b>Comply with</b> = se conformer à (cf. Wilco = will comply).' },
  { l: 3, q: '“Feasible” means:', a: 'possible to do', d: ['easy to feel', 'already done', 'forbidden'], e: '<b>Feasible</b> = faisable, réalisable.' },
  { l: 3, q: '“To be keen on” something means to:', a: 'be very interested in it', d: ['to be afraid of it', 'to be bored with it', 'to keep it'], e: '<b>Be keen on / keen to</b> = être passionné par, avoir très envie de.' },
];
