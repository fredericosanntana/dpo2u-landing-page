import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIndexerStore, selectDistinctUseCases } from '@/lib/pilot/indexer-store';

interface Props {
  readonly value: string | undefined;
  readonly onChange: (value: string | undefined) => void;
}

const ALL = '__ALL__';

export function UseCaseFilter({ value, onChange }: Props) {
  const events = useIndexerStore((s) => s.events);
  const useCases = selectDistinctUseCases({ events } as any);

  return (
    <Select
      value={value ?? ALL}
      onValueChange={(v) => onChange(v === ALL ? undefined : v)}
    >
      <SelectTrigger className="w-44 sm:w-56">
        <SelectValue placeholder="Filtrar por use case" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Todos os use cases</SelectItem>
        {useCases.map((uc) => (
          <SelectItem key={uc} value={uc} className="font-mono text-sm">
            {uc}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
