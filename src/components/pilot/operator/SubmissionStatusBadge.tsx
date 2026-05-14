import { Badge } from '@/components/ui/badge';
import type { AttestationAttempt, Verdict } from '@/lib/pilot/mcp-client';
import { cn } from '@/lib/utils';

interface Props {
  readonly attempt: AttestationAttempt;
}

const VERDICT_COLORS: Record<Verdict, string> = {
  PASS: 'bg-dpo2u-verdigris/15 text-dpo2u-verdigris border-dpo2u-verdigris/30',
  FAIL: 'bg-dpo2u-terracotta/15 text-dpo2u-terracotta border-dpo2u-terracotta/30',
  REVIEW: 'bg-dpo2u-gold/15 text-dpo2u-gold border-dpo2u-gold/30',
};

const STATUS_COLORS = {
  PENDING: 'bg-dpo2u-ink/10 text-dpo2u-ink/70 border-dpo2u-ink/20',
  COMPLETED: 'bg-dpo2u-verdigris/15 text-dpo2u-verdigris border-dpo2u-verdigris/30',
  FAILED: 'bg-dpo2u-terracotta/15 text-dpo2u-terracotta border-dpo2u-terracotta/30',
};

export function SubmissionStatusBadge({ attempt }: Props) {
  if (attempt.status === 'COMPLETED' && attempt.result) {
    return (
      <Badge
        variant="outline"
        className={cn('font-mono text-[10px] tracking-wider', VERDICT_COLORS[attempt.result.verdict])}
      >
        {attempt.result.verdict}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={cn('font-mono text-[10px] tracking-wider', STATUS_COLORS[attempt.status])}
    >
      {attempt.status === 'PENDING' ? 'PENDENTE' : attempt.status === 'FAILED' ? 'FALHOU' : attempt.status}
    </Badge>
  );
}
