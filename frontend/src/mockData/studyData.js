export const decks = [
  {
    id: 'intro-to-biology',
    title: 'Intro to Biology',
    subject: 'Biology',
    summaries: [
      'Biology is the study of living organisms and their interactions.',
      'Cells are the basic unit of life; prokaryotic vs eukaryotic.',
      'DNA stores genetic information; genes code for proteins.',
    ],
    flashcards: [
      { q: 'What is the basic unit of life?', a: 'The cell.' },
      { q: 'Where is genetic information stored?', a: 'In DNA.' },
      { q: 'What do genes code for?', a: 'Proteins.' },
    ],
    quiz: [
      {
        id: 1,
        question: 'Which organelle is the powerhouse of the cell?',
        options: ['Ribosome', 'Mitochondrion', 'Nucleus', 'Chloroplast'],
        answer: 1,
        explanation: 'Mitochondria generate ATP via cellular respiration.',
      },
      {
        id: 2,
        question: 'DNA stands for?',
        options: [
          'Deoxyribonucleic Acid',
          'Dinucleic Acid',
          'Deoxynuclear Acid',
          'Ribonucleic Acid',
        ],
        answer: 0,
        explanation: 'DNA = Deoxyribonucleic Acid.',
      },
    ],
  },
]

export const progressData = {
  xpHistory: [200, 260, 310, 380, 420, 480, 520],
  accuracyBySubject: [
    { subject: 'Biology', accuracy: 82 },
    { subject: 'Math', accuracy: 74 },
    { subject: 'History', accuracy: 68 },
  ],
  streak: 12,
}

export const studyGroups = [
  { id: 'bio-101', name: 'Bio 101 Squad', members: 8 },
  { id: 'math-rev', name: 'Daily Math Rev', members: 12 },
]
