'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

const tableVariants = cva(
  "w-full caption-bottom text-sm border-collapse",
  {
    variants: {
      variant: {
        default: "border-separate border-spacing-0 border border-brand-gray-200",
        premium: "border-separate border-spacing-0 bg-gradient-to-br from-white to-brand-platinum-50 border border-brand-gray-200/50 shadow-lg",
        glassmorphism: "border-separate border-spacing-0 backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl",
        minimal: "border-separate border-spacing-0",
        dark: "border-separate border-spacing-0 bg-gradient-to-br from-brand-gray-900 to-brand-gray-800 border border-brand-gray-700",
        metric: "border-separate border-spacing-0 bg-gradient-to-br from-brand-sapphire-50 to-brand-emerald-50 border border-brand-sapphire-200/30"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const tableHeaderVariants = cva(
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground first:rounded-tl-lg last:rounded-tr-lg border-b transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-gray-50 border-brand-gray-200 text-brand-gray-700",
        premium: "bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 text-white border-transparent font-semibold",
        glassmorphism: "bg-white/40 backdrop-blur-sm border-white/20 text-brand-gray-800 font-semibold",
        minimal: "bg-transparent border-brand-gray-200 text-brand-gray-600",
        dark: "bg-brand-gray-800 border-brand-gray-700 text-brand-gray-300",
        metric: "bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 text-white border-transparent font-bold text-xs uppercase tracking-wider"
      }
    }
  }
);

const tableCellVariants = cva(
  "px-4 py-3 align-middle border-b transition-colors",
  {
    variants: {
      variant: {
        default: "border-brand-gray-200",
        premium: "border-brand-gray-200/50 hover:bg-brand-platinum-50/50",
        glassmorphism: "border-white/10 hover:bg-white/20",
        minimal: "border-brand-gray-200",
        dark: "border-brand-gray-700 hover:bg-brand-gray-800/50",
        metric: "border-brand-sapphire-200/20 hover:bg-brand-sapphire-50/30"
      }
    }
  }
);

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & VariantProps<typeof tableVariants>
>(({ className, variant, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-2xl">
    <table
      ref={ref}
      className={cn(tableVariants({ variant, className }))}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("sticky top-0 z-10", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof tableHeaderVariants>
>(({ className, variant, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(tableHeaderVariants({ variant, className }))}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof tableCellVariants>
>(({ className, variant, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(tableCellVariants({ variant, className }))}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// Specialized Dashboard Metrics Table Component
interface MetricRowData {
  metric: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  target?: string | number;
  status?: 'success' | 'warning' | 'danger';
  icon?: React.ComponentType<{ className?: string }>;
}

interface MetricsTableProps {
  title?: string;
  data: MetricRowData[];
  variant?: VariantProps<typeof tableVariants>['variant'];
  showTrends?: boolean;
  showTargets?: boolean;
}

const MetricsTable: React.FC<MetricsTableProps> = ({
  title,
  data,
  variant = "metric",
  showTrends = true,
  showTargets = false,
}) => {
  const formatChange = (change: number) => {
    const formatted = Math.abs(change).toFixed(1);
    return change > 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-brand-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-brand-gray-400" />;
    }
  };

  const getStatusColor = (status: 'success' | 'warning' | 'danger') => {
    switch (status) {
      case 'success':
        return 'text-brand-green-600 font-semibold';
      case 'warning':
        return 'text-brand-emerald-600 font-semibold';
      case 'danger':
        return 'text-red-600 font-semibold';
      default:
        return 'text-brand-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-serif font-bold text-brand-gray-800">{title}</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-brand-sapphire-200 to-brand-emerald-200" />
        </div>
      )}
      
      <Table variant={variant}>
        <TableHeader>
          <TableRow>
            <TableHead variant={variant} className="w-[40%]">
              Métrica
            </TableHead>
            <TableHead variant={variant} className="w-[20%]">
              Valor Atual
            </TableHead>
            {showTrends && (
              <TableHead variant={variant} className="w-[20%]">
                Tendência
              </TableHead>
            )}
            {showTargets && (
              <TableHead variant={variant} className="w-[20%]">
                Meta
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className="group">
              <TableCell variant={variant} className="font-medium">
                <div className="flex items-center space-x-3">
                  {row.icon && <row.icon className="h-5 w-5 text-brand-sapphire-600" />}
                  <span className="text-brand-gray-800">{row.metric}</span>
                </div>
              </TableCell>
              
              <TableCell variant={variant}>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-bold ${row.status ? getStatusColor(row.status) : 'text-brand-gray-900'}`}>
                    {row.value}
                  </span>
                </div>
              </TableCell>
              
              {showTrends && (
                <TableCell variant={variant}>
                  <div className="flex items-center space-x-2">
                    {row.trend && getTrendIcon(row.trend)}
                    {row.change !== undefined && (
                      <span className={`text-sm font-medium ${
                        row.change > 0 
                          ? 'text-brand-green-600' 
                          : row.change < 0 
                            ? 'text-red-600' 
                            : 'text-brand-gray-500'
                      }`}>
                        {formatChange(row.change)}
                      </span>
                    )}
                  </div>
                </TableCell>
              )}
              
              {showTargets && (
                <TableCell variant={variant}>
                  <span className="text-brand-gray-600 font-medium">
                    {row.target || '-'}
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Sortable Table Hook
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const useSortableData = (items: any[], config: SortConfig | null = null) => {
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

// Sortable Header Component
interface SortableTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortKey: string;
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  variant?: VariantProps<typeof tableHeaderVariants>['variant'];
}

const SortableTableHead: React.FC<SortableTableHeadProps> = ({ 
  children, 
  sortKey, 
  sortConfig, 
  onSort, 
  variant,
  className,
  ...props 
}) => {
  const getSortIcon = () => {
    if (sortConfig?.key !== sortKey) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <TableHead
      variant={variant}
      className={cn("cursor-pointer select-none hover:bg-opacity-80 group", className)}
      onClick={() => onSort(sortKey)}
      {...props}
    >
      <div className="flex items-center justify-between">
        {children}
        <span className="ml-2 group-hover:opacity-100 opacity-60 transition-opacity">
          {getSortIcon()}
        </span>
      </div>
    </TableHead>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  MetricsTable,
  SortableTableHead,
  useSortableData,
  type MetricRowData,
  type MetricsTableProps,
  type SortConfig
};
