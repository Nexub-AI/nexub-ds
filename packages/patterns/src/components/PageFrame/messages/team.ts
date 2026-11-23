import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: team strings of the page templates. */
export const teamMessages = {
  team: 'Team',
  member: 'Member',
  role: 'Role',
  status: 'Status',
  lastActive: 'Last active',
  you: 'You',
  memberStatus: (s) => ({ active: 'Active', invited: 'Invited', suspended: 'Suspended' })[s],
  roleFor: (name) => `Role for ${name}`,
  removeMember: (name) => `Remove ${name}`,
  removeMemberTitle: (name) => `Remove ${name} from the team?`,
  removeMemberDescription: 'They lose access straight away. You can invite them again later.',
  invitePeople: 'Invite people',
  inviteDescription: 'Everyone you add gets an email with a link to join.',
  emailAddresses: 'Email addresses',
  emailAddressesHint: 'Separate addresses with a comma, a space or Enter.',
  invalidEmail: (email) => `${email} is not a valid email address`,
  emailRequired: 'Add at least one email address',
  sendInvites: 'Send invites',
  pendingInvites: 'Pending invites',
  inviteResend: (email) => `Resend the invite to ${email}`,
  inviteRevoke: (email) => `Revoke the invite to ${email}`,
  inviteResendLabel: 'Resend',
  inviteRevokeLabel: 'Revoke',
  seatsUsed: (used, total) => `${used} of ${total} seats used`,
} satisfies Partial<PageTemplateMessages>;
