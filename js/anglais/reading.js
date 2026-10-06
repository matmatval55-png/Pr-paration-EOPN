// Reading comprehension: 7 original texts, 5 questions each (35 questions).
const TEXTS = [
  {
    title: 'Fatigue in the cockpit',
    text: `Fatigue is one of the most underestimated threats in aviation. Unlike a mechanical failure, it gives no warning light: a tired pilot often feels perfectly able to fly. Studies show that being awake for around 18 hours can impair performance roughly as much as a moderate level of alcohol. Reaction times slow down, attention narrows and pilots may miss information that is right in front of them. For this reason, air forces and airlines set strict limits on duty periods and require minimum rest between missions. However, rules alone are not enough. Crews are trained to recognise the early signs of fatigue in themselves and in others, and to speak up when they are not fit to fly. A short, planned nap before a night mission is now considered a professional tool rather than a sign of weakness.`,
    qs: [
      { q: 'What is the main idea of the text?', a: 'Fatigue is a serious but hidden danger that must be actively managed.', d: ['Pilots should never fly at night.', 'Alcohol is more dangerous than fatigue.', 'Mechanical failures are the main cause of accidents.'], e: 'The text explains why fatigue is dangerous (“underestimated threat”, “no warning light”) and how it is managed (rules, training, naps).' },
      { q: 'Why does the author compare fatigue to a mechanical failure?', a: 'Because, unlike a failure, fatigue gives no clear warning.', d: ['Because both are caused by poor maintenance.', 'Because both happen only at night.', 'Because fatigue is less dangerous.'], e: '“Unlike a mechanical failure, it gives <b>no warning light</b>.”' },
      { q: 'According to the text, being awake for about 18 hours:', a: 'can affect performance about as much as a moderate level of alcohol', d: ['has no measurable effect', 'is forbidden for all pilots', 'improves concentration'], e: '“…can impair performance roughly as much as a moderate level of alcohol.” <i>Impair</i> = altérer, dégrader.' },
      { q: 'In the text, “to speak up” means:', a: 'to say clearly what you think, even if it is uncomfortable', d: ['to speak louder on the radio', 'to complain about the salary', 'to stop talking'], e: '<b>To speak up</b> = prendre la parole, oser dire. It is a key idea of crew resource management.' },
      { q: 'How is a planned nap now considered?', a: 'As a professional tool', d: ['As a sign of weakness', 'As forbidden before missions', 'As useless'], e: '“…is now considered a <b>professional tool</b> rather than a sign of weakness.”' },
    ],
  },
  {
    title: 'Drones and the future of air power',
    text: `Over the past twenty years, remotely piloted aircraft have moved from the margins to the centre of military aviation. Medium-altitude long-endurance drones can stay airborne for more than twenty hours, providing commanders with a continuous picture of the battlefield. Smaller drones, sometimes bought off the shelf and modified, have changed the way ground forces fight. Yet drones have not made pilots obsolete. Most air forces now talk about “teaming”: a crewed fighter could control several unmanned “loyal wingmen” that scout ahead, jam enemy radars or carry extra weapons. In such a system, the human remains responsible for the most important decisions, especially the use of force. The challenge for the next generation of aircrew will therefore be less about flying alone and more about managing information and directing a team of machines.`,
    qs: [
      { q: 'According to the text, drones have:', a: 'become central to military aviation', d: ['been abandoned by most air forces', 'replaced all fighter pilots', 'only been used for civilian purposes'], e: '“…have moved from the margins <b>to the centre</b> of military aviation.”' },
      { q: 'What can medium-altitude long-endurance drones do?', a: 'Stay in the air for more than twenty hours', d: ['Fly faster than any fighter', 'Carry passengers', 'Operate only at night'], e: '“…can stay airborne for more than twenty hours.” <i>Airborne</i> = en vol.' },
      { q: '“Off the shelf” most likely means:', a: 'commercially available, not specially designed', d: ['broken', 'very expensive', 'stored in a hangar'], e: '<b>Off-the-shelf</b> = du commerce, disponible tel quel.' },
      { q: 'In the “teaming” concept, who makes the most important decisions?', a: 'The human crew', d: ['The drones themselves', 'Ground forces only', 'Nobody: it is automatic'], e: '“…the human remains responsible for the most important decisions, especially the use of force.”' },
      { q: 'What does the author suggest about future aircrew?', a: 'They will need strong skills in managing information and teams', d: ['They will no longer need training', 'They will fly only drones from home', 'They will mainly repair drones'], e: 'Last sentence: “…more about managing information and directing a team of machines.”' },
    ],
  },
  {
    title: 'Thunderstorms',
    text: `Every pilot learns early that thunderstorms must be respected. A mature cumulonimbus can rise above 40,000 feet and contains violent up- and downdrafts, heavy rain, hail, lightning and severe icing. Near the ground, the most dangerous phenomenon is often the microburst: a powerful column of descending air that spreads out when it hits the surface. An aircraft flying through it on approach first meets a headwind, which increases its airspeed, and then a strong tailwind and downdraft, which make it lose speed and height at the worst possible moment. Modern weather radar and ground-based wind-shear warning systems have greatly reduced accidents, but the basic rule has not changed: avoid storms by a wide margin, and if in doubt, delay the approach or divert to another airfield.`,
    qs: [
      { q: 'What is a microburst?', a: 'A strong column of descending air that spreads out near the ground', d: ['A small lightning strike', 'A short period of heavy rain', 'A type of cloud above 40,000 ft'], e: '“…a powerful column of <b>descending air</b> that spreads out when it hits the surface.”' },
      { q: 'When an aircraft enters a microburst on approach, it first experiences:', a: 'an increase in airspeed due to a headwind', d: ['an immediate loss of height', 'severe icing', 'a tailwind'], e: 'It “first meets a <b>headwind, which increases its airspeed</b>”, then a tailwind and downdraft.' },
      { q: 'Why is the second phase of a microburst so dangerous?', a: 'Because the aircraft loses speed and height close to the ground', d: ['Because the radio stops working', 'Because the engines stop', 'Because visibility is perfect'], e: '“…make it lose speed and height at the worst possible moment.”' },
      { q: 'What has reduced the number of accidents?', a: 'Weather radar and wind-shear warning systems', d: ['Flying faster through storms', 'Bigger aircraft', 'Fewer flights at night'], e: '“Modern weather radar and ground-based wind-shear warning systems have greatly reduced accidents.”' },
      { q: 'What does “divert” mean in the last sentence?', a: 'to go to a different airfield than planned', d: ['to entertain passengers', 'to divide the crew', 'to land faster'], e: '<b>Divert</b> = se dérouter (vers un terrain de dégagement).' },
    ],
  },
  {
    title: 'Crew Resource Management',
    text: `In the 1970s, investigators studying major accidents noticed a worrying pattern: in many cases the aircraft was in perfect working order and the crew was technically competent, yet the accident happened anyway. Poor communication, unclear leadership and a reluctance to challenge the captain were often to blame. This led to the development of Crew Resource Management, or CRM. CRM teaches crews to use all available resources — people, information and equipment — to make good decisions. Junior crew members are encouraged to voice concerns in a clear and respectful way, while captains learn to listen and to create an atmosphere in which mistakes can be reported. Today CRM principles have spread far beyond aviation, to operating theatres, nuclear plants and fire services.`,
    qs: [
      { q: 'What surprising pattern did investigators notice?', a: 'Accidents happened even when the aircraft and the skills were fine', d: ['Most accidents were caused by engine failures', 'Captains were always responsible', 'Accidents only happened in bad weather'], e: '“…the aircraft was in perfect working order and the crew was technically competent, yet the accident happened anyway.”' },
      { q: '“A reluctance to challenge the captain” means:', a: 'crew members hesitated to question the captain', d: ['crew members refused to fly', 'captains were too young', 'the captain challenged the crew to a competition'], e: '<b>Reluctance</b> = réticence ; <b>to challenge</b> = remettre en question.' },
      { q: 'According to CRM, what should junior crew members do?', a: 'Express their concerns clearly and respectfully', d: ['Stay silent to respect hierarchy', 'Take control of the aircraft', 'Report the captain to the police'], e: '“Junior crew members are encouraged to <b>voice concerns</b> in a clear and respectful way.”' },
      { q: 'What is expected from captains?', a: 'To listen and make it easy to report mistakes', d: ['To make all decisions alone', 'To punish every mistake', 'To avoid talking to the crew'], e: '“…captains learn to listen and to create an atmosphere in which mistakes can be reported.”' },
      { q: 'The last sentence shows that CRM:', a: 'is now used in other high-risk professions', d: ['has been abandoned', 'only works in aviation', 'was invented by doctors'], e: 'CRM “has spread far beyond aviation, to operating theatres, nuclear plants and fire services”.' },
    ],
  },
  {
    title: 'Notice to cadets',
    text: `NOTICE — All first-year cadets. Due to runway resurfacing works, flying activities will be suspended from Monday 12 to Friday 16 May inclusive. During this period, ground school will follow the timetable displayed in Building C. Simulator sessions will continue as normal; however, cadets whose sessions were planned before 8:00 must now report at 8:30, as the simulator building will open later than usual. The physical training test originally scheduled for Wednesday 14 has been brought forward to Tuesday 13 at 14:00. Cadets who are unable to attend for medical reasons must inform the training office by Friday 9 May at the latest and provide a medical certificate. Flying will resume on Monday 19 May. Questions should be addressed to the duty officer.`,
    qs: [
      { q: 'Why are flying activities suspended?', a: 'Because the runway is being resurfaced', d: ['Because of bad weather', 'Because of a medical inspection', 'Because the simulator is broken'], e: '“Due to <b>runway resurfacing works</b>…”' },
      { q: 'What happens to simulator sessions planned at 7:30?', a: 'Cadets must report at 8:30 instead', d: ['They are cancelled', 'They move to Building C', 'They take place at 7:00'], e: 'Sessions planned before 8:00 → “must now report at 8:30”.' },
      { q: 'When is the physical training test now?', a: 'Tuesday 13 May at 14:00', d: ['Wednesday 14 May', 'Monday 19 May', 'Friday 16 May at 14:00'], e: '“…has been <b>brought forward</b> to Tuesday 13 at 14:00.” <i>Bring forward</i> = avancer (une date).' },
      { q: 'What must a cadet with a medical problem do?', a: 'Inform the training office by 9 May and give a certificate', d: ['Simply not attend', 'Call the duty officer on the day', 'Take the test the following week'], e: '“…must inform the training office by Friday 9 May at the latest and provide a medical certificate.”' },
      { q: 'When will flying start again?', a: 'Monday 19 May', d: ['Friday 16 May', 'Tuesday 13 May', 'It is not specified'], e: '“Flying will resume on Monday 19 May.” <i>Resume</i> = reprendre (faux-ami : pas « résumer »).' },
    ],
  },
  {
    title: 'Space debris',
    text: `Since the launch of Sputnik in 1957, humanity has placed thousands of satellites in orbit. Many are no longer working, and collisions or explosions have produced a growing cloud of debris. Even a fragment the size of a coin, travelling at several kilometres per second, carries enough energy to destroy a satellite. Experts fear a chain reaction, sometimes called the Kessler syndrome, in which each collision creates more fragments and more collisions, until some orbits become unusable. Because modern armies depend on satellites for communication, navigation and observation, space has become a strategic domain. Several countries, including France, have created space commands to monitor objects in orbit and to protect their national satellites.`,
    qs: [
      { q: 'Why can a very small fragment be dangerous?', a: 'Because its very high speed gives it a lot of energy', d: ['Because it is radioactive', 'Because it is heavy', 'Because it attracts other satellites'], e: 'Kinetic energy depends on the <b>square of the speed</b>: at several km/s, even a coin-sized object is destructive.' },
      { q: 'What is the Kessler syndrome?', a: 'A chain reaction of collisions creating more and more debris', d: ['A disease affecting astronauts', 'The first satellite launch', 'A type of rocket engine'], e: '“…each collision creates more fragments and more collisions.”' },
      { q: 'Why has space become a strategic domain for armies?', a: 'Because they depend on satellites for key functions', d: ['Because wars now take place on the Moon', 'Because satellites are cheap', 'Because debris can be sold'], e: 'Armies “depend on satellites for communication, navigation and observation”.' },
      { q: 'What do space commands do, according to the text?', a: 'Monitor objects in orbit and protect national satellites', d: ['Launch tourists into space', 'Destroy all old satellites', 'Build the International Space Station'], e: 'Last sentence of the text.' },
      { q: '“Unusable” means:', a: 'impossible to use', d: ['unusual', 'used too much', 'very useful'], e: '<b>Un-</b> (negative) + <b>usable</b> (utilisable) = inutilisable.' },
    ],
  },
  {
    title: 'Selection day',
    text: `When Léa arrived at the selection centre, she was convinced that the hardest part would be the maths test. She had prepared for months, working through exercises every evening after her lectures. In the end, the arithmetic problems went better than expected. What surprised her most was the group exercise. Six candidates who had never met were asked to plan a rescue operation in forty minutes with incomplete information. Some candidates tried to impose their ideas immediately; others said nothing at all. Léa made sure everyone had spoken before suggesting a plan, and she kept an eye on the clock. Later, an officer explained that the assessors were not looking for the “right” answer but for the way candidates listened, organised and adapted.`,
    qs: [
      { q: 'What did Léa expect to be the most difficult test?', a: 'The maths test', d: ['The group exercise', 'The interview', 'The physical test'], e: '“…she was convinced that the hardest part would be the maths test.”' },
      { q: 'What was the group asked to do?', a: 'Plan a rescue operation with incomplete information', d: ['Solve maths problems together', 'Fly a simulator', 'Write an essay'], e: '“…plan a rescue operation in forty minutes with incomplete information.”' },
      { q: 'How did Léa behave during the group exercise?', a: 'She listened to everyone, then proposed a plan and managed time', d: ['She imposed her idea immediately', 'She stayed silent', 'She left the room'], e: '“Léa made sure everyone had spoken before suggesting a plan, and she kept an eye on the clock.”' },
      { q: '“To keep an eye on the clock” means:', a: 'to watch the time carefully', d: ['to repair the clock', 'to look away', 'to be late'], e: 'Idiom: <b>keep an eye on</b> = surveiller.' },
      { q: 'What were the assessors looking for?', a: 'How candidates listened, organised and adapted', d: ['The correct solution', 'The fastest candidate', 'The most talkative candidate'], e: '“…not looking for the ‘right’ answer but for the way candidates listened, organised and adapted.”' },
    ],
  },
];

export const READING = TEXTS.flatMap((t) =>
  t.qs.map((q) => ({
    ...q,
    t: 90,
    ctx: `<b>${t.title}</b><br>${t.text}`,
  })),
);
