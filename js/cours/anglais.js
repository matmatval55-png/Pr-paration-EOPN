// Course sheets — English (written in English, with French hints).
import { ICAO } from '../anglais/index.js';

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const FICHES_ANGLAIS = [
  {
    id: 'tenses',
    title: 'Tenses: the essentials',
    train: '#/train/en.grammar',
    html: `
      <table class="tbl" style="text-align:left">
        <tr><th>Tense</th><th>Use</th><th>Example</th></tr>
        <tr><td>Present simple</td><td>habits, facts</td><td>I <b>train</b> every morning.</td></tr>
        <tr><td>Present continuous</td><td>now, temporary</td><td>She <b>is flying</b> right now.</td></tr>
        <tr><td>Present perfect</td><td>past → now, experience, no finished time</td><td>I <b>have lived</b> here since 2020. Have you ever <b>flown</b>?</td></tr>
        <tr><td>Present perfect continuous</td><td>duration up to now</td><td>I <b>have been revising</b> for two hours.</td></tr>
        <tr><td>Past simple</td><td>finished action, finished time</td><td>We <b>landed</b> at 6 p.m. yesterday.</td></tr>
        <tr><td>Past continuous</td><td>action in progress in the past</td><td>I <b>was taxiing</b> when the tower called.</td></tr>
        <tr><td>Past perfect</td><td>before another past action</td><td>The plane <b>had left</b> when we arrived.</td></tr>
        <tr><td>Future (will)</td><td>decision now, prediction</td><td>I<b>’ll call</b> you back.</td></tr>
        <tr><td>Be going to</td><td>plan, evidence</td><td>I<b>’m going to</b> apply. Look, it’s going to rain.</td></tr>
      </table>
      <h3>Key time markers</h3>
      <ul><li><b>Since</b> + starting point (since 2020) / <b>for</b> + duration (for 3 years) → present perfect.</li><li><b>Ago, last, yesterday, in 2019</b> → past simple (never present perfect).</li><li><b>Already, yet, just, ever, never</b> → usually present perfect.</li></ul>
      <p class="tip">FR trap: « J’habite ici depuis 3 ans » = <b>I have lived</b> here for 3 years (not “I live”).</p>`,
  },
  {
    id: 'conditionals',
    title: 'Conditionals, wishes and inversion',
    train: '#/train/en.grammar',
    html: `
      <table class="tbl" style="text-align:left">
        <tr><th>Type</th><th>Structure</th><th>Example</th></tr>
        <tr><td>0 — general truth</td><td>If + present, present</td><td>If you heat ice, it melts.</td></tr>
        <tr><td>1 — real future</td><td>If + present, will + verb</td><td>If it rains, we will cancel.</td></tr>
        <tr><td>2 — imaginary present</td><td>If + past, would + verb</td><td>If I were a pilot, I would fly every day.</td></tr>
        <tr><td>3 — imaginary past</td><td>If + past perfect, would have + p.p.</td><td>If he had trained, he would have passed.</td></tr>
      </table>
      <ul><li><b>Unless</b> = if… not. <b>Provided / as long as</b> = à condition que. <b>In case</b> = au cas où.</li><li>Never <b>will</b> or <b>would</b> directly after <b>if</b>.</li></ul>
      <h3>Wish / regrets</h3>
      <ul><li>I wish I <b>had</b> more time (present). I wish I <b>had studied</b> more (past).</li><li>You <b>should have told</b> me (criticism about the past). He <b>can’t have seen</b> it / he <b>must have seen</b> it (deduction).</li><li>It’s (high) time we <b>left</b>. I’d rather you <b>didn’t</b> do that.</li></ul>
      <h3>Inversion (formal, C1)</h3>
      <p>After a negative or restrictive adverb at the start of the sentence, use the question word order: <b>Never have I seen</b>… <b>Not only did she pass</b>… <b>Hardly had we landed when</b>… <b>No sooner had</b>… <b>than</b>… <b>Had I known</b>, I would have…</p>`,
  },
  {
    id: 'passive-reported',
    title: 'Passive voice, reported speech, gerund vs infinitive',
    train: '#/train/en.grammar',
    html: `
      <h3>Passive voice</h3>
      <p><b>be</b> (at the right tense) + <b>past participle</b>. The runway <b>is inspected</b> / <b>was inspected</b> / <b>has been inspected</b> / <b>will be inspected</b> / <b>must be inspected</b>.</p>
      <p>Used when the doer is unknown or unimportant, very common in technical and military English.</p>
      <h3>Reported speech</h3>
      <ul><li>Tenses usually move back: “I am tired” → He said he <b>was</b> tired. “I have finished” → she said she <b>had finished</b>. “I will come” → he said he <b>would</b> come.</li><li><b>Say</b> something (to someone) / <b>tell</b> someone something.</li><li>Questions: “Where is the hangar?” → He asked <b>where the hangar was</b> (no inversion).</li></ul>
      <h3>Gerund (-ing) or infinitive (to)?</h3>
      <ul><li>+ <b>-ing</b>: enjoy, avoid, finish, suggest, mind, consider, keep, look forward to, be used to, after prepositions (before leaving, despite being).</li><li>+ <b>to</b>: want, decide, hope, plan, manage, refuse, expect, would like.</li><li>Change of meaning: <b>stop smoking</b> (arrêter de fumer) vs <b>stop to smoke</b> (s’arrêter pour fumer); <b>remember doing</b> (se souvenir d’avoir fait) vs <b>remember to do</b> (penser à faire).</li><li><b>Used to</b> + verb = past habit; <b>be used to</b> + -ing = être habitué à.</li></ul>`,
  },
  {
    id: 'vocab',
    title: 'False friends, phrasal verbs, linking words',
    train: '#/train/en.vocab',
    html: `
      <h3>False friends (faux-amis)</h3>
      <table class="tbl" style="text-align:left">
        <tr><th>English</th><th>means</th><th>not</th></tr>
        <tr><td>actually</td><td>en fait</td><td>actuellement (= currently)</td></tr>
        <tr><td>eventually</td><td>finalement</td><td>éventuellement (= possibly)</td></tr>
        <tr><td>sensible</td><td>raisonnable</td><td>sensible (= sensitive)</td></tr>
        <tr><td>to attend</td><td>assister à</td><td>attendre (= to wait)</td></tr>
        <tr><td>to resume</td><td>reprendre</td><td>résumer (= to sum up)</td></tr>
        <tr><td>library</td><td>bibliothèque</td><td>librairie (= bookshop)</td></tr>
        <tr><td>demanding</td><td>exigeant</td><td>demander (= to ask)</td></tr>
        <tr><td>to realise</td><td>se rendre compte</td><td>réaliser (= to carry out)</td></tr>
      </table>
      <h3>Phrasal verbs to know</h3>
      <p>give up (abandonner) · put off (reporter) · call off (annuler) · carry out (effectuer) · come up with (trouver une idée) · turn down (refuser) · run out of (être à court de) · cope with (faire face à) · bring forward (avancer une date) · take off (décoller) · look forward to (avoir hâte de) · find out (découvrir) · set up (mettre en place) · point out (souligner).</p>
      <h3>Linking words (useful for reading)</h3>
      <ul><li>Contrast: however, yet, although, whereas, despite, on the other hand.</li><li>Cause / consequence: because of, due to, therefore, thus, as a result.</li><li>Addition: moreover, furthermore, in addition, besides.</li></ul>
      <p class="tip">Learn words in context with the <a href="#/flashcards">flashcards</a>: 10 minutes a day is enough.</p>`,
  },
  {
    id: 'icao',
    title: 'ICAO alphabet and radiotelephony',
    train: '#/train/en.phraseo',
    html: `
      <h3>Spelling alphabet</h3>
      <div class="table-wrap"><table class="tbl">${[0, 1, 2, 3, 4, 5, 6, 7, 8]
        .map((r) => `<tr>${[0, 1, 2].map((c) => { const i = r * 3 + c; return i < 26 ? `<td><b>${ABC[i]}</b></td><td>${ICAO[i]}</td>` : '<td></td><td></td>'; }).join('')}</tr>`)
        .join('')}</table></div>
      <p>Digits: 0 ZE-RO, 1 WUN, 2 TOO, 3 <b>TREE</b>, 4 FOW-ER, 5 <b>FIFE</b>, 6 SIX, 7 SEV-EN, 8 AIT, 9 <b>NIN-ER</b>. Numbers are read digit by digit (heading 270 = “two seven zero”), except flight levels in hundreds (FL 100 = “flight level one hundred”).</p>
      <h3>Standard words</h3>
      <ul><li><b>Roger</b>: message received · <b>Wilco</b>: will comply · <b>Affirm</b>: yes · <b>Negative</b>: no</li><li><b>Say again</b>: repeat · <b>Standby</b>: wait · <b>Unable</b>: I cannot comply · <b>Disregard</b>: ignore · <b>Read back</b>: repeat it back to me</li><li><b>Cleared</b>: authorised · <b>Approved</b>: permission granted · <b>Expedite</b>: hurry</li></ul>
      <h3>Clearances</h3>
      <ul><li><b>Line up and wait</b>: enter the runway and wait (NOT a take-off clearance).</li><li><b>Hold short of runway 27</b>: stop before the runway.</li><li><b>Go around</b>: abort the approach and climb.</li><li><b>Contact</b> (call on the new frequency) vs <b>monitor</b> (listen only).</li></ul>
      <h3>Emergency</h3>
      <p><b>MAYDAY ×3</b> = distress (grave, imminent danger) · <b>PAN-PAN ×3</b> = urgency. Squawk <b>7700</b> emergency, <b>7600</b> radio failure, <b>7500</b> unlawful interference.</p>
      <h3>Pressure settings</h3>
      <p><b>QNH</b> → altitude above sea level · <b>QFE</b> → height above the airfield · <b>1013 hPa</b> → flight levels. Wind “240/15” comes <b>from</b> 240° at 15 kt.</p>`,
  },
  {
    id: 'strategy',
    title: 'Test strategy: 150 questions in 55 minutes',
    train: '#/exam/en-chambery',
    html: `
      <p>The official English test (“test de Chambéry”) is a multiple-choice <b>reading</b> test: 150 questions in 55 minutes — about <b>22 seconds per question</b>.</p>
      <h3>During the test</h3>
      <ol><li><b>Grammar and vocabulary</b> questions should take 10–15 s: read the sentence, spot the clue (since, yesterday, if…), answer, move on.</li><li>Save time for <b>reading</b> questions, which need more time.</li><li><b>Never leave a question unanswered</b> if wrong answers aren’t penalised (check the instructions on the day).</li><li>If you hesitate for more than 30 s, choose the most likely answer and move on.</li></ol>
      <h3>Reading comprehension</h3>
      <ul><li>Read the <b>question first</b>, then scan the text for keywords.</li><li>The right answer often <b>paraphrases</b> the text (different words, same idea); answers that copy exact words from the text are sometimes traps.</li><li>For “main idea” questions, read the first and last sentences of the text.</li><li>For vocabulary in context, replace the word with each option and check the sentence still makes sense.</li></ul>
      <h3>Going from B2 to C1</h3>
      <ul><li>Read 15 minutes a day in English: defence and aviation news, articles on flying.</li><li>Listen to podcasts or videos about aviation (English subtitles if needed).</li><li>Keep a vocabulary notebook and review it with flashcards.</li><li>Practise the full mock test in real conditions once a month.</li></ul>`,
  },
];
