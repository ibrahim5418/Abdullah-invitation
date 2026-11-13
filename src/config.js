// ─────────────────────────────────────────────────────────────
//  ALL INVITATION CONTENT LIVES HERE.
//  Edit this file to change names, dates, venues, etc.
// ─────────────────────────────────────────────────────────────

export const invitation = {
  // Letters on the drawn wax seal (only used if the video/image is removed)
  monogram: 'A&S',

  bismillah: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',

  heroIntro: ['We request the honour of', 'your presence at the Nikah of'],
  heroOutro: ['as we begin our journey', 'of love, faith, and togetherness.'],

  // The groom is shown first everywhere on the page.
  groom: {
    name: 'Abdullah',
    relation: 'Son of',
    parents: 'A. R. Mohamed Moinudeen',
  },
  bride: {
    name: 'Sarah',
    relation: 'Daughter of',
    parents: 'T. Ilyas',
  },

  welcome: {
    title: 'With joyful hearts',
    text:
      'We are honoured to welcome you as we begin a new chapter together. Your presence, prayers, and blessings will make this celebration even more meaningful.',
  },

  // Nikah date & time — used by the scratch card and the countdown.
  // +05:30 = India time.
  date: {
    iso: '2026-12-25T18:30:00+05:30',
    display: 'December 25, 2026',
    day: 'Friday',
    time: '6:30 PM',
    short: 'December 25 · Friday',
  },

  scratch: {
    eyebrow: 'A beautiful day awaits',
    title: 'Scratch to reveal',
    cardTitle: 'Scratch to reveal',
    cardSubtitle: 'A date written for two hearts',
    revealedEyebrow: 'Save the date',
    revealedTitle: 'Our forever begins',
    invitedText: "You're invited",
  },

  countdown: {
    eyebrow: "Insha'Allah",
    title: 'Counting down to our Nikah',
  },

  schedule: {
    title: 'The celebration',
    items: [
      { time: '6:30 PM', title: 'Nikah', text: 'Mohideen Jummah Masjid' },
      { time: '8:00 PM', title: 'Valima', text: "At the groom's residence" },
    ],
  },

  venues: {
    eyebrow: 'The venues',
    title: 'Where we will celebrate',
    items: [
      {
        label: 'Nikah',
        time: '6:30 PM',
        name: 'Mohideen Jummah Masjid',
        mapUrl: 'https://maps.app.goo.gl/vt5zX1w9yTryiess6',
      },
      {
        label: 'Valima',
        time: '8:00 PM',
        name: "Groom's Residence",
        mapUrl: 'https://maps.app.goo.gl/5xoqoaSxJTyXEKcg9',
      },
    ],
  },

  presence: {
    title: 'Your presence is our present',
    text:
      'Your love, duas, blessings, and presence are the greatest gifts we could ever ask for. We feel truly grateful to celebrate this special day with you.',
  },

  closing: {
    title: 'We cannot wait to celebrate with you',
    text: 'May Allah place barakah in this union and fill the journey ahead with love, mercy, and peace.',
  },

  // AI-generated media made in Google Flow (see PROMPTS.md).
  media: {
    envelopeImage: '/media/envelope.jpg', // first screen (closed envelope)
    introVideo: '/media/intro.mp4', //       plays when the seal is tapped
    heroImage: '/media/arch-card.jpg', //    empty arch card behind the names
  },
}
