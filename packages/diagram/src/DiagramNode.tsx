import * as React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { DiagramContext } from './context.js';
import type { DiagramFlowNode, DiagramNodeTone } from './types.js';
import { cx } from './cx.js';

const toneClasses: Record<DiagramNodeTone, { card: string; chip: string; dot: string }> = {
  default: { card: '', chip: 'bg-surface-container-high text-on-surface-variant', dot: '' },
  good: { card: 'border-s-4 border-s-success', chip: 'bg-success-container text-on-success-container', dot: 'bg-success' },
  warning: { card: 'border-s-4 border-s-warning', chip: 'bg-warning-container text-on-warning-container', dot: 'bg-warning' },
  danger: { card: 'border-s-4 border-s-error', chip: 'bg-error-container text-on-error-container', dot: 'bg-error' },
};

const sides = [Position.Top, Position.Right, Position.Bottom, Position.Left];

/**
 * The Nexub card node: a title, an optional description and icon, and a status tone.
 * Register it as `type: 'nexub'` (DiagramCanvas does). Its handles sit on the sides the
 * layout sets (`targetPosition` / `sourcePosition`), left and right by default, with a
 * 24px hit area.
 *
 * @alpha
 */
export const DiagramNode = React.memo(function DiagramNode({ id, data, sourcePosition, targetPosition, isConnectable }: NodeProps<DiagramFlowNode>) {
  const { readOnly, labels, openConnect, layout } = React.useContext(DiagramContext);
  const connectable = isConnectable && !readOnly;
  const tone = data.tone ?? 'default';
  const t = toneClasses[tone] ?? toneClasses.default;
  const title = data.title ?? id;
  return (
    <div
      data-tone={tone}
      className={cx(
        'nx-diagram-node relative flex w-60 items-start gap-3 rounded-shape-container border border-outline-variant bg-surface-container-low px-4 py-3 text-start text-on-surface',
        t.card,
      )}
    >
      {layout === 'mind-map' ? (
        // Mind maps: a handle on every side; DiagramCanvas points each edge at the facing pair.
        sides.map((side) => (
          <React.Fragment key={side}>
            <Handle type="target" id={`t-${side}`} position={side} isConnectable={connectable} className="nx-diagram-handle" />
            <Handle type="source" id={`s-${side}`} position={side} isConnectable={connectable} className="nx-diagram-handle" />
          </React.Fragment>
        ))
      ) : (
        <>
          <Handle type="target" position={targetPosition ?? Position.Left} isConnectable={connectable} className="nx-diagram-handle" />
          <Handle type="source" position={sourcePosition ?? Position.Right} isConnectable={connectable} className="nx-diagram-handle" />
        </>
      )}
      {data.icon ? (
        <span aria-hidden="true" className={cx('flex size-8 shrink-0 items-center justify-center rounded-shape-control', t.chip)}>
          {data.icon}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="truncate text-title-sm">{title}</span>
          {tone !== 'default' ? (
            <>
              <span aria-hidden="true" className={cx('size-2 shrink-0 rounded-full', t.dot)} />
              <span className="sr-only">{labels.tones[tone]}</span>
            </>
          ) : null}
        </span>
        {data.description ? <span className="line-clamp-2 text-body-sm text-on-surface-variant">{data.description}</span> : null}
      </span>
      {openConnect && connectable ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={labels.connectTo(title)}
          title={labels.connectTo(title)}
          className="nx-diagram-connect nodrag nopan absolute -bottom-3 end-3 flex size-6 items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface-variant"
          onClick={(e) => {
            e.stopPropagation();
            openConnect(id);
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M8 3v10M3 8h10" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});
