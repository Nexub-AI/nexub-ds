// 12.5: native parity for the 12.4 AI parts: ToolCall, ApprovalCard, DiffView, DiffReview,
// DataList `streaming` and TextField `streaming` / `generated`.
import * as React from 'react';
import { AccessibilityInfo } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { ApprovalCard, DataList, DiffReview, DiffView, NexubNativeProvider, Text, TextField, ToolCall } from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(<Provider>{ui}</Provider>);
const rerender = (ui: React.ReactElement) => screen.rerender(<Provider>{ui}</Provider>);
const hidden = { includeHiddenElements: true };

let announce: jest.SpyInstance;
beforeEach(() => {
  announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
});
afterEach(() => announce.mockRestore());

describe('ToolCall', () => {
  it('is a disclosure named by tool, status and run time; opens to input and output', async () => {
    await wrap(<ToolCall name="search_invoices" status="done" duration={1234} input={{ q: 'acme' }} output="3 found" />);
    const header = screen.getByRole('button', { name: 'search_invoices, Done, 1.2 s' });
    expect(header).toBeCollapsed();
    expect(screen.queryByText('Input')).toBeNull();
    await fireEvent.press(header);
    expect(header).toBeExpanded();
    expect(screen.getByText('Input')).toBeTruthy();
    expect(screen.getByText(/"q": "acme"/)).toBeTruthy();
    expect(screen.getByText('3 found')).toBeTruthy();
  });

  it('a failed call with an error starts open and offers Retry', async () => {
    const onRetry = jest.fn();
    await wrap(<ToolCall name="send" status="failed" error="Timed out" onRetry={onRetry} />);
    expect(screen.getByRole('button', { name: 'send, Failed' })).toBeExpanded();
    expect(screen.getByText('Timed out')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('no Retry without onRetry or outside the failed state; defaultOpen opens it', async () => {
    await wrap(<ToolCall name="send" status="done" defaultOpen onRetry={() => {}} output="ok" />);
    expect(screen.getByRole('button', { name: 'send, Done' })).toBeExpanded();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
  });

  it('announces status changes, not the first render; messages translate', async () => {
    await wrap(<ToolCall name="t" status="running" messages={{ toolCallStatus: { running: 'Läuft', done: 'Fertig', failed: 'Fehler' } }} />);
    expect(announce).not.toHaveBeenCalled();
    await rerender(<ToolCall name="t" status="done" messages={{ toolCallStatus: { running: 'Läuft', done: 'Fertig', failed: 'Fehler' } }} />);
    expect(announce).toHaveBeenCalledWith('Fertig');
  });
});

describe('ApprovalCard', () => {
  it('approve resolves to the outcome, announced, and the buttons go away', async () => {
    const onApprove = jest.fn();
    await wrap(<ApprovalCard title="Send 3 invoices" onApprove={onApprove} onDeny={() => {}} />);
    expect(screen.getByRole('header', { name: 'Send 3 invoices' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Approved')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Deny' })).toBeNull();
    expect(announce).toHaveBeenCalledWith('Approved');
  });

  it('a promise shows the pending state; a rejection returns to the choice', async () => {
    let reject!: () => void;
    const onDeny = jest.fn(() => new Promise<void>((_, r) => (reject = () => r(new Error('no')))));
    await wrap(<ApprovalCard title="Delete" onApprove={() => {}} onDeny={onDeny} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Deny' }));
    expect(screen.getByText('Working…')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled();
    await act(async () => reject());
    expect(screen.queryByText('Working…')).toBeNull();
    expect(screen.getByRole('button', { name: 'Approve' })).toBeEnabled();
  });

  it('edit path: shows args, edits them and approves with changes', async () => {
    const onEdit = jest.fn();
    await wrap(<ApprovalCard title="Refund" args={{ amount: 10 }} onEdit={onEdit} onApprove={() => {}} />);
    expect(screen.getByText('Arguments')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Edit' }));
    const field = screen.getByLabelText('Arguments');
    await fireEvent.changeText(field, '{"amount":5}');
    await fireEvent.press(screen.getByRole('button', { name: 'Approve with changes' }));
    expect(onEdit).toHaveBeenCalledWith('{"amount":5}');
    expect(screen.getByText('Approved with changes')).toBeTruthy();
    expect(screen.getByText('{"amount":5}')).toBeTruthy();
  });

  it('cancel leaves edit mode; no Edit without onEdit; controlled outcome and pending', async () => {
    await wrap(<ApprovalCard title="Refund" args={{ a: 1 }} onEdit={() => {}} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Edit' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('button', { name: 'Approve' })).toBeTruthy();
    await rerender(<ApprovalCard title="Refund" args={{ a: 1 }} />);
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
    await rerender(<ApprovalCard title="Refund" pending />);
    expect(screen.getByText('Working…')).toBeTruthy();
    await rerender(<ApprovalCard title="Refund" outcome="denied" />);
    expect(screen.getByText('Denied')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull();
  });
});

const diff = '@@ -10,2 +10,2 @@\n context\n-old line\n+new line\n';

describe('DiffView', () => {
  it('reads each changed line with its prefix; the gutter is visual only', async () => {
    await wrap(<DiffView file="a.ts" diff={diff} lineNumbers />);
    expect(screen.getByText('a.ts')).toBeTruthy();
    expect(screen.getByLabelText('Added: new line')).toBeTruthy();
    expect(screen.getByLabelText('Removed: old line')).toBeTruthy();
    // old/new numbers from the hunk header: context 10/10, removed 11/–, added –/11
    expect(screen.getAllByText('10')).toHaveLength(2);
    expect(screen.getAllByText('11')).toHaveLength(2);
  });

  it('no line numbers by default; messages translate the prefixes', async () => {
    await wrap(<DiffView diff={diff} messages={{ diffAdded: 'Neu: ' }} />);
    expect(screen.queryByText('10')).toBeNull();
    expect(screen.getByLabelText('Neu: new line')).toBeTruthy();
  });
});

describe('DiffReview', () => {
  const files = [
    { file: 'a.ts', diff },
    { file: 'b.ts', diff: '@@ -1 +1 @@\n+x\n' },
  ];

  it('accepts and rejects per file, with a summary that is announced', async () => {
    const onAccept = jest.fn();
    const onDecisionsChange = jest.fn();
    await wrap(<DiffReview files={files} onAccept={onAccept} onDecisionsChange={onDecisionsChange} />);
    expect(screen.getByText('0 accepted, 0 rejected, 2 to review')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Accept a.ts' }));
    expect(onAccept).toHaveBeenCalledWith(files[0]);
    expect(onDecisionsChange).toHaveBeenLastCalledWith({ 'a.ts': 'accepted' });
    expect(screen.getByRole('button', { name: 'Accept a.ts' })).toBeSelected();
    expect(screen.getByText('1 accepted, 0 rejected, 1 to review')).toBeTruthy();
    expect(announce).toHaveBeenCalledWith('1 accepted, 0 rejected, 1 to review');
    await fireEvent.press(screen.getByRole('button', { name: 'Reject b.ts' }));
    expect(screen.getByText('Rejected')).toBeTruthy();
  });

  it('files are disclosures named with their line counts; they collapse', async () => {
    await wrap(<DiffReview files={files} defaultDecisions={{ 'b.ts': 'rejected' }} />);
    const a = screen.getByRole('button', { name: 'a.ts, 1 added, 1 removed' });
    expect(a).toBeExpanded();
    await fireEvent.press(a);
    expect(a).toBeCollapsed();
    expect(screen.queryByLabelText('Removed: old line')).toBeNull();
    expect(screen.getByText('0 accepted, 1 rejected, 1 to review')).toBeTruthy();
  });
});

describe('DataList streaming', () => {
  const rows = (n: number) => Array.from({ length: n }, (_, i) => ({ id: String(i), name: `Row ${i}` }));
  const list = (n: number, streaming?: boolean) => (
    <DataList data={rows(n)} keyExtractor={(r) => r.id} title={(r) => r.name} empty={<Text>Nothing</Text>} streaming={streaming} />
  );

  it('trails a hidden skeleton row instead of the empty state, then announces the count', async () => {
    jest.useFakeTimers();
    try {
      await wrap(list(0, true));
      expect(screen.queryByText('Nothing')).toBeNull();
      expect(screen.getByTestId('data-list-streaming', hidden)).toBeTruthy();
      expect(screen.queryByTestId('data-list-streaming')).toBeNull();
      await rerender(list(2, true));
      await rerender(list(3, true));
      expect(announce).not.toHaveBeenCalled();
      await act(() => jest.advanceTimersByTime(3000));
      expect(announce).toHaveBeenCalledTimes(1);
      expect(announce).toHaveBeenLastCalledWith('3 rows so far');
      await rerender(list(4, false));
      expect(announce).toHaveBeenLastCalledWith('Done. 4 rows');
      expect(screen.queryByTestId('data-list-streaming', hidden)).toBeNull();
      expect(screen.getByText('Row 3')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('without streaming it renders as before', async () => {
    await wrap(list(0));
    expect(screen.getByText('Nothing')).toBeTruthy();
    expect(announce).not.toHaveBeenCalled();
  });
});

describe('TextField streaming and generated', () => {
  it('streaming: busy, a shimmer, still editable', async () => {
    const onChangeText = jest.fn();
    await wrap(<TextField label="Summary" streaming value="Draft" onChangeText={onChangeText} />);
    const field = screen.getByLabelText('Summary');
    expect(field).toBeBusy();
    expect(field.props.editable).toBe(true);
    expect(screen.getByTestId('field-streaming', hidden)).toBeTruthy();
    await rerender(<TextField label="Summary" value="Draft" onChangeText={onChangeText} />);
    expect(screen.queryByTestId('field-streaming', hidden)).toBeNull();
    expect(screen.getByLabelText('Summary')).not.toBeBusy();
  });

  it('generated: "Suggested" is in the hint; accept and clear settle it', async () => {
    const onAccept = jest.fn();
    const onClear = jest.fn();
    const field = (generated = true) => (
      <TextField label="Title" helperText="Short" generated={generated} onAcceptSuggestion={onAccept} onClearSuggestion={onClear} value="Q3 plan" />
    );
    await wrap(field());
    expect(screen.getByLabelText('Title').props.accessibilityHint).toBe('Short. Suggested');
    await fireEvent.press(screen.getByRole('button', { name: 'Accept suggestion' }));
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Accept suggestion' })).toBeNull();
    expect(screen.getByLabelText('Title').props.accessibilityHint).toBe('Short');
    // A new suggestion shows the mark again.
    await rerender(field(false));
    await rerender(field(true));
    await fireEvent.press(screen.getByRole('button', { name: 'Clear suggestion' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Suggested', hidden)).toBeNull();
  });

  it('typing settles the mark; without generated nothing changes', async () => {
    await wrap(<TextField label="Title" generated defaultValue="Q3" />);
    expect(screen.getByText('Suggested', hidden)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Accept suggestion' })).toBeNull();
    await fireEvent.changeText(screen.getByLabelText('Title'), 'Q4');
    expect(screen.queryByText('Suggested', hidden)).toBeNull();
    await rerender(<TextField label="Plain" helperText="Hint" />);
    expect(screen.getByLabelText('Plain').props.accessibilityHint).toBe('Hint');
  });
});
