import { ProjectFigure } from './ProjectFigure';
import type {
  ProjectCaseVisual,
  ProjectFlowGroup,
  ProjectFlowStep,
  ProjectFlowVisual,
  ProjectTableVisual,
} from '../../types';

export function CaseVisualRenderer({ visual }: { visual: ProjectCaseVisual }) {
  switch (visual.type) {
    case 'image':
      return (
        <ProjectFigure
          image={{
            src: visual.src,
            alt: visual.alt,
            caption: visual.caption,
          }}
        />
      );
    case 'flow':
      return <FlowVisualView visual={visual} />;
    case 'table':
      return <TableVisualView visual={visual} />;
  }
}

function FlowVisualView({ visual }: { visual: ProjectFlowVisual }) {
  const groups = Array.isArray(visual.payload?.groups) ? visual.payload.groups : [];

  if (!groups.length) {
    return null;
  }

  return (
    <figure>
      {visual.title ? (
        <h5 className="text-xl font-semibold tracking-tight text-slate-900">
          {visual.title}
        </h5>
      ) : null}

      <div className={visual.title ? 'mt-6 space-y-8' : 'space-y-8'}>
        {groups.map((group, groupIndex) => (
          <FlowGroupView
            key={group.key || `${group.label}-${groupIndex}`}
            group={group}
          />
        ))}
      </div>

      {visual.caption ? (
        <figcaption className="mt-4 text-xs leading-relaxed text-slate-500">
          {visual.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function FlowGroupView({ group }: { group: ProjectFlowGroup }) {
  const steps = Array.isArray(group.steps) ? group.steps : [];
  const labelClass = group.tone === 'danger'
    ? 'text-orange-700'
    : group.tone === 'success'
      ? 'text-emerald-700'
      : 'text-slate-900';

  if (!steps.length) {
    return null;
  }

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <strong className={`text-sm font-semibold ${labelClass}`}>{group.label}</strong>
        {group.description ? (
          <span className="text-xs text-slate-500">{group.description}</span>
        ) : null}
      </div>

      <div role="list">
        {steps.map((step, index) => (
          <FlowStepView
            key={`${group.key}-${index}-${step.title}`}
            step={step}
            showArrow={index < steps.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function FlowStepView({
  step,
  showArrow,
}: {
  step: ProjectFlowStep;
  showArrow: boolean;
}) {
  let emphasisClass = 'border-slate-200 bg-white';
  if (step.emphasis === 'danger') {
    emphasisClass = 'border-orange-400 bg-orange-50';
  } else if (step.emphasis === 'success') {
    emphasisClass = 'border-emerald-500 bg-emerald-50';
  }

  return (
    <div role="listitem">
      <div
        className={`flex min-h-16 flex-col items-center justify-center border px-4 py-3 text-center ${emphasisClass}`}
      >
        {step.label ? <span className="text-xs text-slate-500">{step.label}</span> : null}
        <strong className="mt-1 whitespace-pre-line text-sm font-semibold text-slate-900">
          {step.title}
        </strong>
      </div>

      {showArrow ? (
        <div aria-hidden="true" className="py-1 text-center text-lg leading-none text-blue-500">
          ↓
        </div>
      ) : null}
    </div>
  );
}

function TableVisualView({ visual }: { visual: ProjectTableVisual }) {
  const columns = Array.isArray(visual.payload?.columns) ? visual.payload.columns : [];
  const rows = Array.isArray(visual.payload?.rows) ? visual.payload.rows : [];

  if (!columns.length) {
    return null;
  }

  return (
    <figure>
      {visual.title ? (
        <h5 className="text-xl font-semibold tracking-tight text-slate-900">
          {visual.title}
        </h5>
      ) : null}

      <div className={`${visual.title ? 'mt-4 ' : ''}overflow-x-auto`}>
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-300">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-3 py-2.5 font-semibold text-slate-900"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 last:border-0">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-3 text-slate-600">
                    {row[column.key] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visual.caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-slate-500">
          {visual.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
