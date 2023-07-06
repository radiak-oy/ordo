import { useMemo } from 'react';
import { MdClose } from 'react-icons/md';

interface Option {
  id: string;
  name: string;
  href?: string;
}

interface SelectorProps {
  title: string;
  addTitle: string;
  noneTitle: string;
  max?: number;
  selectedIds: string[];
  options: Option[];
  onChange: (selectedIds: string[]) => void;
}

export default function Selector({
  title,
  addTitle,
  noneTitle,
  max,
  selectedIds,
  options,
  onChange,
}: SelectorProps) {
  const optionsDistinct = useMemo(
    () => options.filter((o) => !selectedIds.some((id) => id === o.id)),
    [options, selectedIds]
  );

  function select(id: string) {
    const option = options.find((o) => o.id === id);
    if (!option) throw new Error();

    if (selectedIds.length === max) throw new Error('Max options selected');
    const newIds = [...selectedIds, option.id];

    onChange(newIds);
  }

  const selectedOptions = useMemo(
    () => options.filter((o) => selectedIds.some((id) => id == o.id)),
    [options, selectedIds]
  );

  return (
    <div className="flex">
      <div className="mr-4 flex flex-col items-start">
        <span>{title}</span>
        <div className="mb-1 flex flex-col">
          {selectedIds.length === 0 && <span>{noneTitle}</span>}
          {selectedOptions.map((o) => (
            <div
              key={o.id}
              className="mb-1 p-2 flex justify-between rounded border border-secondary-300"
            >
              <a
                href={o.href}
                className={`mr-4 ${
                  o.href ? 'hover:underline underline-offset-4' : ''
                }`}
              >
                {o.name}
              </a>
              <button
                type="button"
                className="text-secondary-700 hover:text-secondary-800"
                onClick={() => {
                  const newIds = selectedIds.filter(
                    (selectedId) => selectedId !== o.id
                  );
                  onChange(newIds);
                }}
              >
                <MdClose />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start">
        <span>{addTitle}</span>
        <div className="mb-2 flex items-center">
          <select
            className="mr-2 p-1 rounded border border-secondary-300 bg-secondary-50"
            value={''}
            onChange={(e) => select(e.target.value)}
            disabled={
              optionsDistinct.length === 0 || selectedIds.length === max
            }
          >
            <option disabled value={''}>
              Valitse
            </option>
            {optionsDistinct.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
