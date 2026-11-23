// 11.8: native catch-up I (fields): ComboboxField, MultiSelect web gaps, FileUpload, usePrompt.
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import {
  Button,
  ComboboxField,
  FileUpload,
  MultiSelect,
  NexubNativeProvider,
  usePrompt,
  type ComboboxOption,
  type PickedFile,
  type PromptOptions,
} from '../index';

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
const lists = () => screen.container.queryAll((n) => n.props.accessibilityRole === 'list');

/** A promise you settle from the test. */
function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const people: ComboboxOption[] = [
  { value: 'ana', label: 'Ana Lopez', description: 'Design' },
  { value: 'ben', label: 'Ben Okafor', keywords: ['finance'] },
  { value: 'chen', label: 'Chen Wei', group: 'Contractors' },
];

describe('ComboboxField', () => {
  it('is a button with the label and value; filters locally; picks and closes', async () => {
    const onValueChange = jest.fn();
    await wrap(<ComboboxField label="Assignee" options={people} onValueChange={onValueChange} />);
    const field = screen.getByRole('button', { name: 'Assignee, Select…' });
    expect(field.props.accessibilityState).toMatchObject({ expanded: false });
    await fireEvent.press(field);
    expect(lists()).toHaveLength(1);
    await fireEvent.changeText(screen.getByLabelText('Search'), 'finance');
    expect(screen.queryByRole('radio', { name: 'Ana Lopez, Design' })).toBeNull();
    await fireEvent.press(screen.getByRole('radio', { name: 'Ben Okafor' }));
    expect(onValueChange).toHaveBeenCalledWith('ben');
    expect(screen.getByRole('button', { name: 'Assignee, Ben Okafor' })).toBeTruthy();
  });

  it('marks the picked row, offers a none option and shows emptyText', async () => {
    const onValueChange = jest.fn();
    await wrap(<ComboboxField label="Manager" options={people} defaultValue="chen" noneOption="No manager" emptyText="Nobody" onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Manager, Chen Wei' }));
    expect(screen.getByRole('radio', { name: 'Chen Wei' }).props.accessibilityState).toMatchObject({ checked: true });
    expect(screen.getByText('Contractors')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Search'), 'zzz');
    expect(screen.getByText('Nobody')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Search'), '');
    await fireEvent.press(screen.getByRole('radio', { name: 'No manager' }));
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('async search: a loading row, then only the newest answer, even when an older one lands last', async () => {
    const calls: { q: string; d: ReturnType<typeof deferred<ComboboxOption[]>> }[] = [];
    const onSearch = jest.fn((q: string) => {
      const d = deferred<ComboboxOption[]>();
      calls.push({ q, d });
      return d.promise;
    });
    await wrap(<ComboboxField label="Assignee" options={[]} onSearch={onSearch} searchDebounce={0} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Assignee, Select…' }));
    expect(screen.getByLabelText('Loading…')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Search'), 'a');
    await fireEvent.changeText(screen.getByLabelText('Search'), 'ab');
    expect(calls.map((c) => c.q)).toEqual(['', 'a', 'ab']);
    await act(async () => calls[2]!.d.resolve([{ value: 'abby', label: 'Abby' }]));
    await act(async () => calls[1]!.d.resolve([{ value: 'alan', label: 'Alan' }]));
    await act(async () => calls[0]!.d.resolve([{ value: 'zed', label: 'Zed' }]));
    expect(screen.getByRole('radio', { name: 'Abby' })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'Alan' })).toBeNull();
    expect(screen.queryByLabelText('Loading…')).toBeNull();
    // The picked result keeps its label after the sheet closes and results are dropped.
    await fireEvent.press(screen.getByRole('radio', { name: 'Abby' }));
    expect(screen.getByRole('button', { name: 'Assignee, Abby' })).toBeTruthy();
  });

  it('async search: an error row with a retry', async () => {
    const onSearch = jest.fn<Promise<ComboboxOption[]>, [string]>().mockRejectedValueOnce(new Error('500')).mockResolvedValueOnce([{ value: 'ok', label: 'Okay' }]);
    await wrap(<ComboboxField label="Assignee" options={[]} onSearch={onSearch} searchDebounce={0} />);
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Assignee, Select…' }));
    });
    expect(screen.getByText('Search failed. Try again.')).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    });
    expect(screen.getByRole('radio', { name: 'Okay' })).toBeTruthy();
  });

  it('async search: debounces keystrokes', async () => {
    jest.useFakeTimers();
    try {
      const onSearch = jest.fn(() => Promise.resolve([] as ComboboxOption[]));
      await wrap(<ComboboxField label="Assignee" options={[]} onSearch={onSearch} searchDebounce={300} />);
      await fireEvent.press(screen.getByRole('button', { name: 'Assignee, Select…' }));
      expect(onSearch).toHaveBeenLastCalledWith('');
      await fireEvent.changeText(screen.getByLabelText('Search'), 'a');
      await fireEvent.changeText(screen.getByLabelText('Search'), 'ab');
      expect(onSearch).toHaveBeenCalledTimes(1);
      await act(async () => {
        jest.advanceTimersByTime(300);
      });
      expect(onSearch).toHaveBeenCalledTimes(2);
      expect(onSearch).toHaveBeenLastCalledWith('ab');
    } finally {
      jest.useRealTimers();
    }
  });

  it('readOnly shows the value but does not open', async () => {
    await wrap(<ComboboxField label="Assignee" options={people} value="ana" readOnly />);
    await fireEvent.press(screen.getByRole('button', { name: 'Assignee, Ana Lopez' }));
    expect(lists()).toHaveLength(0);
  });
});

const labels = [
  { value: 'bug', label: 'Bug' },
  { value: 'design', label: 'Design' },
  { value: 'docs', label: 'Docs' },
  { value: 'perf', label: 'Performance' },
];

describe('MultiSelect (11.8 web props)', () => {
  it('maxVisibleChips: chips then a +N chip, matching the accessible name', async () => {
    await wrap(<MultiSelect label="Labels" options={labels} defaultValue={['bug', 'design', 'docs', 'perf']} maxVisibleChips={1} />);
    expect(screen.getByRole('button', { name: 'Labels, Bug, +3 more' })).toBeTruthy();
    expect(screen.getByText('+3 more')).toBeTruthy();
  });

  it('onCreate: a Create row for text that matches no option', async () => {
    const onCreate = jest.fn();
    await wrap(<MultiSelect label="Labels" options={labels} onCreate={onCreate} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Labels, ' }));
    await fireEvent.changeText(screen.getByLabelText('Search'), 'bug');
    expect(screen.queryByRole('button', { name: 'Create “bug”' })).toBeNull();
    await fireEvent.changeText(screen.getByLabelText('Search'), ' Infra ');
    await fireEvent.press(screen.getByRole('button', { name: 'Create “Infra”' }));
    expect(onCreate).toHaveBeenCalledWith('Infra');
  });

  it('onSearch: newest answer wins; picked values keep their labels', async () => {
    const pending: Record<string, ReturnType<typeof deferred<{ value: string; label: string }[]>>> = {};
    const onSearch = (q: string) => (pending[q] = deferred()).promise;
    const onValueChange = jest.fn();
    await wrap(<MultiSelect label="People" options={[]} onSearch={onSearch} searchDebounce={0} onValueChange={onValueChange} emptyText="Nobody" />);
    await fireEvent.press(screen.getByRole('button', { name: 'People, ' }));
    await fireEvent.changeText(screen.getByLabelText('Search'), 'a');
    await fireEvent.changeText(screen.getByLabelText('Search'), 'an');
    await act(async () => pending['an']!.resolve([{ value: 'ana', label: 'Ana' }]));
    await act(async () => pending['a']!.resolve([{ value: 'al', label: 'Al' }]));
    await act(async () => pending['']!.resolve([]));
    expect(screen.queryByRole('checkbox', { name: 'Al' })).toBeNull();
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Ana' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['ana']);
  });

  it('inputValue / onInputChange: controlled search text, no built-in filtering', async () => {
    const onInputChange = jest.fn();
    await wrap(<MultiSelect label="Labels" options={labels} inputValue="zzz" onInputChange={onInputChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Labels, ' }));
    expect(screen.getByLabelText('Search').props.value).toBe('zzz');
    expect(screen.getByRole('checkbox', { name: 'Bug' })).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Search'), 'q');
    expect(onInputChange).toHaveBeenCalledWith('q');
  });

  it('loading shows the loading row; emptyText when nothing matches', async () => {
    const { rerender } = await wrap(<MultiSelect label="Labels" options={labels} loading searchable />);
    await fireEvent.press(screen.getByRole('button', { name: 'Labels, ' }));
    expect(screen.getByLabelText('Loading…')).toBeTruthy();
    expect(screen.queryByRole('checkbox', { name: 'Bug' })).toBeNull();
    await rerender(
      <Provider>
        <MultiSelect label="Labels" options={labels} searchable emptyText="No labels" />
      </Provider>,
    );
    await fireEvent.changeText(screen.getByLabelText('Search'), 'zzz');
    expect(screen.getByText('No labels')).toBeTruthy();
  });

  it('readOnly does not open the sheet', async () => {
    await wrap(<MultiSelect label="Labels" options={labels} value={['bug']} readOnly size="md" />);
    await fireEvent.press(screen.getByRole('button', { name: 'Labels, Bug' }));
    expect(screen.queryByRole('checkbox')).toBeNull();
  });
});

const file = (name: string, size: number, type = 'image/jpeg'): PickedFile => ({ uri: `file:///${name}`, name, size, type });

describe('FileUpload', () => {
  it('transform runs before maxSize; transform errors and size errors show per file', async () => {
    const onFilesChange = jest.fn();
    const onReject = jest.fn();
    const pickFiles = jest.fn(async () => [file('big.jpg', 9000), file('huge.jpg', 9000), file('broken.jpg', 10), file('notes.txt', 10, 'text/plain')]);
    const transform = jest.fn(async (f: PickedFile) => {
      if (f.name === 'broken.jpg') throw new Error('Could not read broken.jpg');
      return f.name === 'big.jpg' ? { ...f, size: 900 } : f;
    });
    await wrap(<FileUpload pickFiles={pickFiles} multiple accept={['image/*']} maxSize={1024} transform={transform} onFilesChange={onFilesChange} onReject={onReject} />);
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Upload files' }));
    });
    expect(pickFiles).toHaveBeenCalledWith({ multiple: true, accept: ['image/*'] });
    expect(onFilesChange).toHaveBeenCalledWith([expect.objectContaining({ name: 'big.jpg', size: 900 })]);
    expect(onReject.mock.calls[0][0].map((r: { reason: string }) => r.reason)).toEqual(['size', 'custom', 'type']);
    expect(screen.getByText('huge.jpg is larger than 1 kB')).toBeTruthy();
    expect(screen.getByText('Could not read broken.jpg')).toBeTruthy();
    expect(screen.getByText('notes.txt isn’t an accepted file type')).toBeTruthy();
    // Removing a rejected row dismisses its error; removing a file updates the list.
    await fireEvent.press(screen.getByRole('button', { name: 'Remove huge.jpg' }));
    expect(screen.queryByText('huge.jpg is larger than 1 kB')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Remove big.jpg' }));
    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });

  it('maxFiles turns extra files away; single mode keeps the first pick; camera capture adds a photo', async () => {
    const onFilesChange = jest.fn();
    const pickFiles = jest.fn(async () => [file('a.jpg', 1), file('b.jpg', 1)]);
    const capture = jest.fn(async () => file('photo.jpg', 1));
    await wrap(<FileUpload pickFiles={pickFiles} capture={capture} captureLabel="Take photo" maxFiles={2} onFilesChange={onFilesChange} />);
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Upload files' }));
    });
    expect(onFilesChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'a.jpg' })]);
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Take photo' }));
    });
    expect(onFilesChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'a.jpg' }), expect.objectContaining({ name: 'photo.jpg' })]);
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Take photo' }));
    });
    expect(onFilesChange).toHaveBeenCalledTimes(2);
    expect(screen.getByText('You can add up to 2 files')).toBeTruthy();
  });

  it('a cancelled picker changes nothing; readOnly hides the buttons', async () => {
    const onFilesChange = jest.fn();
    const { rerender } = await wrap(<FileUpload pickFiles={async () => null} onFilesChange={onFilesChange} />);
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Upload files' }));
    });
    expect(onFilesChange).not.toHaveBeenCalled();
    await rerender(
      <Provider>
        <FileUpload pickFiles={async () => null} readOnly files={[file('kept.pdf', 10, 'application/pdf')]} />
      </Provider>,
    );
    expect(screen.queryByRole('button', { name: 'Upload files' })).toBeNull();
    expect(screen.getByText('kept.pdf')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Remove kept.pdf' })).toBeNull();
  });
});

describe('usePrompt', () => {
  function Host({ options, onAnswer }: { options: PromptOptions; onAnswer: (v: string | null) => void }) {
    const [prompt, element] = usePrompt();
    return (
      <>
        <Button onPress={async () => onAnswer(await prompt(options))}>Ask</Button>
        {element}
      </>
    );
  }

  it('resolves to the trimmed answer', async () => {
    const onAnswer = jest.fn();
    await wrap(<Host options={{ title: 'Reject claim', label: 'Reason' }} onAnswer={onAnswer} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Ask' }));
    expect(screen.getByRole('header', { name: 'Reject claim' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('This field is required.')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Reason'), '  Duplicate  ');
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
    });
    expect(onAnswer).toHaveBeenCalledWith('Duplicate');
  });

  it('resolves to null when cancelled', async () => {
    const onAnswer = jest.fn();
    await wrap(<Host options={{ title: 'Rename', label: 'Name', defaultValue: 'Old', cancelLabel: 'Never mind' }} onAnswer={onAnswer} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Ask' }));
    expect(screen.getByLabelText('Name').props.value).toBe('Old');
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Never mind' }));
    });
    expect(onAnswer).toHaveBeenCalledWith(null);
  });

  it('validate and a failing onSubmit keep it open with the message', async () => {
    const onAnswer = jest.fn();
    const onSubmit = jest.fn().mockRejectedValueOnce(new Error('Server said no')).mockResolvedValueOnce(undefined);
    await wrap(
      <Host
        options={{ title: 'Code', label: 'Code', confirmLabel: 'Apply', validate: (v) => (v.length !== 4 ? 'Four digits' : null), onSubmit }}
        onAnswer={onAnswer}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Ask' }));
    await fireEvent.changeText(screen.getByLabelText('Code'), '12');
    await fireEvent.press(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByText('Four digits')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Code'), '1234');
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Apply' }));
    });
    expect(screen.getByText('Server said no')).toBeTruthy();
    expect(onAnswer).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Apply' }));
    });
    expect(onSubmit).toHaveBeenLastCalledWith('1234');
    expect(onAnswer).toHaveBeenCalledWith('1234');
  });
});
