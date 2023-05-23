export const EVIDENCE_COMMAND = {
  name: 'evidence',
  description: 'Interact with the evidence locker',
  options: [
    {
      name: 'quote',
      description: 'submit a new piece of evidence',
      type: 1,
      options: [
        {
          name: 'quote',
          description: 'the evidence',
          type: 3,
          required: true,
        },
        {
          name: 'culprit',
          description: 'the culprit',
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: 'poll',
      description: 'create a poll with evidence quotes',
      type: 1,
    },
  ],
};
