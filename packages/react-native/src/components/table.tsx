import * as React from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';
import { Text, type TextProps } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';

// ─── Table ───────────────────────────────────────────────────────────────────
// Compound like web: Table.Root > Header / Body / Footer > Row > Head / Cell.
// React Native has no table layout, so every column has a set width (`columns`
// on Root) and the last one takes the space that is left.

// Root renders its children once per part: the sticky first column, the
// scrolling rest (or `all` when nothing is sticky), then the captions.
type Part = 'all' | 'first' | 'rest' | 'caption';
type Section = 'header' | 'body' | 'footer';

interface TableContext {
  part: Part;
  sticky: boolean;
  compact: boolean;
  striped: boolean;
  dividerAfter: number | undefined;
  widths: readonly (number | undefined)[];
  headers: readonly string[];
  setHeaders: (labels: string[]) => void;
}

const Ctx = React.createContext<TableContext | null>(null);
const SectionCtx = React.createContext<Section>('body');
const RowCtx = React.createContext<{ index: number; last: boolean }>({ index: 0, last: false });
const ColumnCtx = React.createContext<{ index: number; grow: boolean }>({ index: 0, grow: false });

function useTable() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('Table parts must be inside <Table.Root>.');
  return ctx;
}

/** The text inside a node, for the row's screen-reader label. */
function textOf(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).filter(Boolean).join(' ');
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return '';
}
const cellText = (cell: React.ReactNode) =>
  (React.isValidElement<{ accessibilityLabel?: string }>(cell) && cell.props.accessibilityLabel) || textOf(cell);

const SEP = '\u0001';

export interface TableRootProps extends ViewProps {
  /**
   * Column widths in points, by column index. Unset columns are 128 wide; the
   * last column also grows to fill the table. Head has no `width` prop: the
   * cells below it could not follow it without measuring.
   */
  columns?: readonly (number | undefined)[];
  /** Keeps the first column in place while the others scroll sideways. Rows become one line high. */
  stickyFirstColumn?: boolean;
  /** Row height and cell padding. @default 'comfortable' */
  density?: 'comfortable' | 'compact';
  /** Tints every other body row. */
  striped?: boolean;
  /** Draws a heavier line under the body row at this index (the cut in a ranked list). */
  dividerAfter?: number;
}

function Root({
  columns = [],
  stickyFirstColumn = false,
  density = 'comfortable',
  striped = false,
  dividerAfter,
  children,
  style,
  ...rest
}: TableRootProps) {
  const { roles, tokens } = useTheme();
  const [headers, setHeadersState] = React.useState<string[]>([]);
  const setHeaders = React.useCallback(
    (labels: string[]) => setHeadersState((prev) => (prev.join(SEP) === labels.join(SEP) ? prev : labels)),
    [],
  );
  const base = { sticky: stickyFirstColumn, compact: density === 'compact', striped, dividerAfter, widths: columns, headers, setHeaders };
  const pass = (part: Part) => <Ctx.Provider value={{ ...base, part }}>{children}</Ctx.Provider>;
  const scroller = (part: Part) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ minWidth: '100%' }}
    >
      <View style={{ flex: 1 }}>{pass(part)}</View>
    </ScrollView>
  );
  return (
    <View style={style} {...rest}>
      {stickyFirstColumn ? (
        <View style={{ flexDirection: 'row' }}>
          <View
            testID="table-sticky-column"
            style={{ borderEndWidth: tokens.spacing.px, borderEndColor: roles['outline-variant'] }}
          >
            {pass('first')}
          </View>
          {scroller('rest')}
        </View>
      ) : (
        scroller('all')
      )}
      {pass('caption')}
    </View>
  );
}

function section(name: Section) {
  function TableSection({ children, style, ...rest }: ViewProps) {
    const { roles, tokens } = useTheme();
    const { part } = useTable();
    if (part === 'caption') return null;
    const rows = React.Children.toArray(children);
    return (
      <SectionCtx.Provider value={name}>
        <View
          style={[
            name === 'footer' && {
              borderTopWidth: tokens.spacing.px,
              borderTopColor: roles['outline-variant'],
              backgroundColor: roles['surface-container-low'],
            },
            style,
          ]}
          {...rest}
        >
          {rows.map((row, index) => (
            <RowCtx.Provider key={index} value={{ index, last: index === rows.length - 1 }}>
              {row}
            </RowCtx.Provider>
          ))}
        </View>
      </SectionCtx.Provider>
    );
  }
  return TableSection;
}

const Header = section('header');
const Body = section('body');
const Footer = section('footer');

/**
 * One row. Screen readers read it as one element: "Team: Rovers, Played: 12".
 * Pass `accessible={false}` when the row holds controls that need their own focus.
 */
function Row({ children, style, accessible = true, accessibilityLabel, ...rest }: ViewProps) {
  const { roles, tokens } = useTheme();
  const { part, sticky, compact, striped, dividerAfter, headers, setHeaders } = useTable();
  const name = React.useContext(SectionCtx);
  const { index, last } = React.useContext(RowCtx);
  const cells = React.Children.toArray(children);
  const labels = cells.map(cellText);
  const key = labels.join(SEP);
  React.useEffect(() => {
    if (name === 'header') setHeaders(key.split(SEP));
  }, [name, key, setHeaders]);

  const label =
    accessibilityLabel ??
    (name === 'header'
      ? labels
      : labels.map((text, i) => (headers[i] ? `${headers[i]}: ${text}` : text))
    )
      .filter(Boolean)
      .join(', ');
  // With a sticky column the row is drawn in two pieces: the first one speaks for both.
  const hidden = accessible && part === 'rest';
  const height = compact
    ? name === 'header' ? tokens.size.control.sm : tokens.spacing[9]
    : name === 'header' ? tokens.size.control.md : tokens.size.control.lg;
  const cut = name === 'body' && dividerAfter === index;
  const from = part === 'rest' ? 1 : 0;
  const shown = part === 'first' ? cells.slice(0, 1) : cells.slice(from);
  return (
    <View
      accessible={accessible && !hidden}
      accessibilityRole={accessible && name === 'header' ? 'header' : undefined}
      accessibilityLabel={accessible ? label : undefined}
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? 'no-hide-descendants' : 'auto'}
      style={[
        {
          flexDirection: 'row',
          // Fixed when sticky, so the two pieces of a row stay the same height.
          ...(sticky ? { height } : { minHeight: height }),
          borderBottomWidth: cut ? tokens.spacing['0-5'] : name !== 'header' && last ? 0 : tokens.spacing.px,
          borderBottomColor: roles[cut ? 'outline' : 'outline-variant'],
        },
        striped && name === 'body' && index % 2 === 1 && { backgroundColor: roles['surface-container-low'] },
        style,
      ]}
      {...rest}
    >
      {shown.map((cell, i) => (
        <ColumnCtx.Provider
          key={i}
          value={{ index: from + i, grow: part !== 'first' && from + i === cells.length - 1 }}
        >
          {cell}
        </ColumnCtx.Provider>
      ))}
    </View>
  );
}

export interface TableCellProps extends ViewProps {
  /** End-aligned, for numbers (figures are tabular in every cell). */
  numeric?: boolean;
}

function cell(variant: NonNullable<TextProps['variant']>, color: NonNullable<TextProps['color']>) {
  function TableCell({ numeric, children, style, ...rest }: TableCellProps) {
    const { tokens } = useTheme();
    const { sticky, compact, widths } = useTable();
    const { index, grow } = React.useContext(ColumnCtx);
    const footer = React.useContext(SectionCtx) === 'footer';
    return (
      <View
        style={[
          {
            width: widths[index] ?? tokens.spacing[32],
            flexGrow: grow ? 1 : 0,
            paddingHorizontal: tokens.spacing[compact ? 2 : 4],
            paddingVertical: sticky ? 0 : tokens.spacing[compact ? 1 : 2],
            justifyContent: 'center',
            alignItems: numeric ? 'flex-end' : 'flex-start',
          },
          style,
        ]}
        {...rest}
      >
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text variant={footer ? 'label-lg' : variant} color={color} tabular numberOfLines={sticky ? 1 : undefined}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    );
  }
  return TableCell;
}

const Head = cell('label-md', 'on-surface-muted');
const Cell = cell('body-sm', 'on-surface');

/** A line under the table that names it. */
function Caption({ style, ...rest }: TextProps) {
  const { tokens } = useTheme();
  if (useTable().part !== 'caption') return null;
  return <Text variant="body-sm" color="on-surface-muted" style={[{ marginTop: tokens.spacing[4] }, style]} {...rest} />;
}

export const Table = { Root, Header, Body, Footer, Row, Head, Cell, Caption };
export type TableSectionProps = ViewProps;
export type TableRowProps = ViewProps;
export type TableCaptionProps = TextProps;
