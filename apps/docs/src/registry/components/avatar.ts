import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'avatar',
    title: 'Avatar',
    description: 'Displays a user\'s profile picture with initials fallback.',
    category: 'Avatar',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'src', type: 'string', required: false, description: 'URL of the profile image.' },
    { name: 'name', type: 'string', required: false, description: 'Full name used to generate initials when no image is provided.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Controls avatar dimensions.' },
    { name: 'badge', type: 'boolean', required: false, description: 'Shows a status badge on the avatar.' },
    { name: 'badgeColor', type: 'string', required: false, description: 'Colour of the status badge.' },
    { name: 'fallback', type: 'ReactNode', required: false, description: 'Custom fallback rendered when the image fails to load and no name is provided.' },
    { name: 'AgentAvatar icon', type: 'ReactNode', required: false, description: 'AgentAvatar (12.2, beta): the app glyph inside the tile, e.g. an `@nexub/icons` icon. Default: a bot.' },
    { name: 'AgentAvatar src', type: 'string', required: false, description: 'AgentAvatar: an image for the tile instead of `icon` (e.g. an `@nexub/brand` app tile). Falls back to `icon` if it fails.' },
    { name: 'AgentAvatar name', type: 'string', required: false, description: 'AgentAvatar: who the agent is ("Payhub agent"). Read as "Payhub agent, AI agent" (`messages.aiAgent`).' },
    { name: 'AgentAvatar size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'AgentAvatar: the same size scale as Avatar.' },
    { name: 'AgentAvatar category', type: 'CategoryColor', required: false, description: 'AgentAvatar: a category colour for the tile. Default: the brand tile look, a primary glyph on a surface tile.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Sizes',
    },
    {
      title: 'With image',
    },
    {
      title: 'With badge',
    },
    {
      title: 'Agent avatar',
      description:
        'AgentAvatar (12.2, beta) is for AI agents, so an agent never looks like a colleague: a rounded-square app tile, like the `@nexub/brand` tiles, with a sparkle in the bottom inline-end corner. Same sizes as Avatar. Screen readers hear "Payhub agent, AI agent".',
    },
  ],
  a11y: {
    roles: ['img (when named)'],
    screenReader: [
      'Avatar reads its `name`, plus the `status` ("Ada Lovelace, Away"). Without a name it is decorative and hidden.',
      'AgentAvatar is always `role="img"` and its name says it is an AI agent ("Payhub agent, AI agent", from `messages.aiAgent`). The glyph and the sparkle are hidden.',
    ],
  },
};

export default entry;
