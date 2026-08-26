/**
 * A Letter from the Founder — Jim Shelvy.
 * Copy transcribed verbatim from /founder-letter.html.
 *
 * Block types:
 *   p     standard paragraph
 *   lead  emphasised standalone line
 *   beat  short stacked lines rendered as a group
 */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'lead'; text: string }
  | { type: 'beat'; lines: string[] };

export const founderLetter: Block[] = [
  { type: 'p', text: 'There are moments in life that force you to ask questions you never expected to ask.' },
  { type: 'beat', lines: ['Who am I?', 'What was all of this for?', 'Did any of it really matter?'] },
  { type: 'p', text: 'People often ask me why I brought NexCore back.' },
  { type: 'beat', lines: ['The truth is…', 'I don’t think I ever really left it behind.'] },
  {
    type: 'p',
    text: 'Years ago, NexCore began as an idea shared by three people who believed business could be more than transactions. We believed it could become a catalyst for stronger communities, meaningful relationships, and lives changed through opportunity.',
  },
  { type: 'lead', text: 'Together, we built something extraordinary.' },
  {
    type: 'p',
    text: 'What started as a coworking space quickly became something much bigger. Businesses were launched. Friendships were formed. Partnerships were created. People discovered confidence they didn’t know they had. We transformed not only a building, but an entire neighborhood.',
  },
  { type: 'lead', text: 'Then COVID changed everything.' },
  {
    type: 'beat',
    lines: [
      'The building closed.',
      'The community we had spent years building scattered.',
      'One by one, my partners moved on until I was the last one standing.',
    ],
  },
  { type: 'p', text: 'At the same time, my own life began to unravel.' },
  {
    type: 'beat',
    lines: [
      'I lost far more than a business.',
      'I lost my marriage.',
      'I lost my home.',
      'I lost the building.',
      'I lost the daily community that had become such a meaningful part of my life.',
    ],
  },
  { type: 'p', text: 'For a long time, I wondered if I had lost myself.' },
  { type: 'p', text: 'Honestly…I didn’t wonder. I had.' },
  {
    type: 'beat',
    lines: ['I had lost my confidence.', 'I had lost my identity.', 'I had lost my belief in myself.'],
  },
  {
    type: 'beat',
    lines: [
      'There were days I questioned everything.',
      'Days I questioned my purpose.',
      'Days I questioned whether I had failed the people who believed in me.',
    ],
  },
  {
    type: 'p',
    text: 'There were businesses that depended on programs we had created. As life became more overwhelming than I could manage alone, I entrusted pieces of that work to others. Some of those programs weren’t cared for the way they deserved to be. Some people were let down. Some blamed me.',
  },
  { type: 'beat', lines: ['And if I’m honest…', 'I blamed myself.'] },
  { type: 'p', text: 'There was a season where I believed maybe the story had simply ended.' },
  { type: 'p', text: 'It became one of the darkest periods of my life.' },
  {
    type: 'beat',
    lines: ['I wasn’t searching for another business.', 'I was searching for a reason to keep believing.'],
  },
  { type: 'p', text: 'But somewhere in the middle of that darkness, something refused to let go.' },
  {
    type: 'beat',
    lines: [
      'It was never about that space.',
      'It was about people.',
      'It was about helping someone discover they were capable of more than they believed.',
      'It was about watching someone walk through the door uncertain of themselves and leave with confidence they didn’t have before.',
      'It was about creating a place where belief becomes contagious.',
    ],
  },
  {
    type: 'p',
    text: 'As I began rebuilding pieces of my own life, something remarkable started happening. Pieces that had been scattered in broken dreams and a shattered heart, began to “fit” together somehow.',
  },
  { type: 'p', text: 'Not because life suddenly became easier…but because purpose became clearer.' },
  { type: 'beat', lines: ['NexCore never left me.', 'Neither did ReVitalize.'] },
  { type: 'p', text: 'I realized something that changed everything.' },
  {
    type: 'beat',
    lines: [
      'None of those organizations had ever been the mission.',
      'They were simply expressions of the same mission.',
    ],
  },
  { type: 'lead', text: 'They all existed for the same reason: To help people discover what they’re capable of.' },
  {
    type: 'p',
    text: 'As our communities struggled, I became even more convinced that they didn’t need more people pointing at problems. They needed people willing to lock arms and become part of the solution.',
  },
  { type: 'beat', lines: ['That conviction never disappeared.', 'It grew.'] },
  {
    type: 'p',
    text: 'Over time I realized those weren’t separate organizations or separate ideas. They were all different expressions of the same calling.',
  },
  {
    type: 'p',
    text: 'The setbacks, the failures, the rebuilding, the uncertainty—they taught me that growth isn’t linear. Sometimes the greatest progress comes after everything you thought defined you has been stripped away.',
  },
  { type: 'beat', lines: ['Those lessons became part of the framework.', 'They became part of me.'] },
  { type: 'beat', lines: ['And through all of it…', 'NexCore never stopped whispering.'] },
  { type: 'beat', lines: ['Not because of a building.', 'Not because of a brand.', 'Because of people.'] },
  { type: 'p', text: 'I realized something I hadn’t fully understood before.' },
  {
    type: 'beat',
    lines: [
      'NexCore was never about offices.',
      'It was never about conference rooms.',
      'It was never even about coworking.',
    ],
  },
  {
    type: 'lead',
    text: 'It was about creating a place where people discover they’re capable of more than they believed.',
  },
  {
    type: 'p',
    text: 'A place where someone believes in you long enough for you to begin believing in yourself.',
  },
  { type: 'p', text: 'As I slowly rebuilt my own life, I started rebuilding pieces of the mission.' },
  { type: 'beat', lines: ['Not because I knew exactly where it would lead.', 'But because I knew it still mattered.'] },
  {
    type: 'beat',
    lines: [
      'There were people who stood beside me through those years.',
      'Some believed.',
      'Some hoped.',
      'Some prayed.',
      'Others quietly told me this would never happen.',
      'That we’d never finish.',
      'That the building would never open.',
    ],
  },
  { type: 'p', text: 'There were days I wondered if they were right.' },
  {
    type: 'beat',
    lines: [
      'But every morning I got up and took one more step.',
      'Not because I knew it would work.',
      'Because I believed it mattered.',
    ],
  },
  {
    type: 'beat',
    lines: [
      'I wasn’t trying to prove anyone wrong.',
      'I was trying to prove to myself that the story wasn’t over.',
      'But I was trying to prove that MY story wasn’t over either.',
    ],
  },
  { type: 'lead', text: 'Then opening night arrived.' },
  {
    type: 'beat',
    lines: [
      'I couldn’t believe we had made it.',
      'Years of setbacks.',
      'Years of rebuilding.',
      'Years of wondering if I’d ever get here.',
    ],
  },
  { type: 'beat', lines: ['Then another thought entered my mind.', 'One I hadn’t expected.'] },
  {
    type: 'beat',
    lines: [
      'What if this was all a mistake?',
      'What if I was wrong?',
      'What if nobody needed NexCore anymore?',
      'What if…',
      'No one comes?',
    ],
  },
  {
    type: 'p',
    text: 'As I got ready for the celebration, I walked into a room overwhelmed with emotion. My son stood beside me. He caught the tears before anyone else ever saw them.',
  },
  {
    type: 'beat',
    lines: [
      'He had lived every chapter with me.',
      'He had watched me lose everything.',
      'He had watched me search for reasons to keep going.',
      'He knew exactly what this moment meant.',
    ],
  },
  { type: 'beat', lines: ['And then…', 'The doors opened.', 'People started arriving.'] },
  {
    type: 'p',
    text: 'And they shared their NexCore journey with me and with others. People began telling stories I had completely forgotten and some I never knew.',
  },
  {
    type: 'p',
    text: 'One person told me they slept on the floor of their office at NexCore because they believed so deeply in building their business. Another told me NexCore was where their company truly began.',
  },
  { type: 'beat', lines: ['And then another.', 'And another.', 'And another.'] },
  {
    type: 'p',
    text: 'Others reminded me of conversations I couldn’t even remember having—conversations that changed the direction of their lives.',
  },
  { type: 'p', text: 'That’s when it finally hit me.' },
  {
    type: 'lead',
    text: 'The impact we make is rarely visible while we’re making it.',
  },
  {
    type: 'p',
    text: 'Sometimes years pass before we understand the significance of simply believing in someone.',
  },
  { type: 'beat', lines: ['That’s why NexCore exists.', 'Not because the world needed another coworking space.', 'The world has plenty of offices.'] },
  {
    type: 'beat',
    lines: [
      'What it doesn’t have enough of are places where people discover purpose.',
      'Places where ideas become businesses.',
      'Where strangers become collaborators.',
      'Where failures become lessons.',
      'Where communities become stronger.',
      'Where someone quietly sitting in the corner finally begins believing in themselves again.',
    ],
  },
  {
    type: 'beat',
    lines: ['Because I know what it feels like to lose that belief.', 'And I know what it feels like to find it again.'],
  },
  {
    type: 'p',
    text: 'Today, NexCore is much bigger than the original vision. Coworking is simply the starting point.',
  },
  {
    type: 'beat',
    lines: [
      'Around it we’re building systems that remove barriers.',
      'Communities that strengthen people.',
      'Events that create opportunity.',
      'Partnerships that serve others.',
      'Programs that develop leaders.',
      'Initiatives that remind us we’re capable of far more together than we ever are alone.',
    ],
  },
  {
    type: 'beat',
    lines: [
      'I believe every person has purpose.',
      'I believe every business has potential.',
      'I believe every community deserves people willing to believe in something bigger than themselves.',
    ],
  },
  { type: 'p', text: 'That’s why I sign every letter the same way.' },
  { type: 'lead', text: 'Believer in the Power of Human Potential.' },
  {
    type: 'beat',
    lines: [
      'Those aren’t words beneath my name.',
      'They’re the reason I got back up.',
      'They’re the reason NexCore came back.',
      'And they’re the reason I’ll never stop building.',
    ],
  },
  {
    type: 'beat',
    lines: [
      'If you’ve found yourself here…',
      'Maybe you’re searching for something too.',
      'Maybe you’re building.',
      'Maybe you’re rebuilding.',
      'Maybe you’re trying to believe again.',
    ],
  },
  { type: 'beat', lines: ['If that’s you…', 'Welcome home.'] },
  { type: 'beat', lines: ['Now…', 'When people ask me why I brought NexCore back…'] },
  { type: 'lead', text: 'My answer has become surprisingly simple. Because we have something we’re supposed to be doing.' },
  {
    type: 'beat',
    lines: [
      'I don’t pretend to know exactly what all of that means.',
      'I don’t know every person we’ll meet.',
      'Every business we’ll help.',
      'Every life that will be changed.',
    ],
  },
  { type: 'beat', lines: ['But I know where it begins.', 'It begins here.', 'At NexCore.', 'At The Starting Point For It All.'] },
  { type: 'beat', lines: ['Maybe…', 'It’s your story that’s just beginning now.'] },
];

export const founderSignoff = {
  closing: 'With gratitude,',
  name: 'Jim Shelvy',
  title: 'Founder, NexCore',
  credo: 'Believer in the Power of Human Potential',
};
