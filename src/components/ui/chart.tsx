'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Helper function to get color from CSS variables
const getColor = (varName: string): string => {
  if (typeof window === 'undefined') return '#006dff'; // SSR fallback
  const root = document.documentElement;
  const color = getComputedStyle(root).getPropertyValue(varName).trim();
  return color || '#006dff'; // Fallback if not found
};

// Color palettes for DPO2U brand - Reading from centralized colors.css
const brandColors = {
  get primary() { return getColor('--chart-primary'); },
  get secondary() { return getColor('--chart-secondary'); },
  get accent() { return getColor('--chart-accent'); },
  get success() { return getColor('--chart-success'); },
  get warning() { return getColor('--chart-warning'); },
  get error() { return getColor('--chart-error'); },
  get gradient() {
    return [
      getColor('--chart-color-1'),
      getColor('--chart-color-2'),
      getColor('--chart-color-3'),
      getColor('--chart-color-4'),
      getColor('--chart-color-5')
    ];
  },
  get light() {
    return [
      getColor('--color-sapphire-100'),
      getColor('--color-emerald-100'),
      getColor('--color-purple-100'),
      getColor('--color-emerald-50'),
      getColor('--color-ocean-100')
    ];
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-brand-gray-200 rounded-xl p-4 shadow-2xl">
        <p className="font-semibold text-brand-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-brand-gray-600">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Line Chart Component
interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  gradient?: boolean;
}

export const DPOLineChart: React.FC<LineChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  color = brandColors.primary,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  gradient = true
}) => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
          />
          {gradient && (
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Area Chart Component
interface AreaChartProps extends LineChartProps {
  fillOpacity?: number;
}

export const DPOAreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  color = brandColors.primary,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  fillOpacity = 0.3
}) => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={fillOpacity} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend />}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Bar Chart Component
interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  radius?: number;
}

export const DPOBarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  color = brandColors.primary,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  radius = 8
}) => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend />}
          <Bar dataKey={dataKey} fill={color} radius={[radius, radius, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Pie Chart Component
interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  height?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
}

export const DPOPieChart: React.FC<PieChartProps> = ({
  data,
  dataKey,
  nameKey,
  height = 300,
  showTooltip = true,
  showLegend = true,
  colors = brandColors.gradient,
  innerRadius = 0,
  outerRadius = 80
}) => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Donut Chart Component
export const DPODonutChart: React.FC<PieChartProps> = (props) => {
  return (
    <DPOPieChart
      {...props}
      innerRadius={60}
      outerRadius={100}
    />
  );
};

// Radar Chart Component
interface RadarChartProps {
  data: any[];
  categories: string[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  color?: string;
}

export const DPORadarChart: React.FC<RadarChartProps> = ({
  data,
  categories,
  height = 300,
  showGrid = true,
  showTooltip = true,
  color = brandColors.primary
}) => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          {showGrid && <PolarGrid />}
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: getColor('--chart-text') }} />
          <PolarRadiusAxis tick={{ fontSize: 10, fill: getColor('--chart-text') }} />
          <Radar
            name="Value"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Compliance Dashboard Chart
interface ComplianceData {
  month: string;
  compliance: number;
  incidents: number;
  resolved: number;
}

interface ComplianceDashboardProps {
  data: ComplianceData[];
  height?: number;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  data,
  height = 400
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-brand-platinum-50 rounded-2xl p-6 border border-brand-gray-200/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold text-brand-gray-800">
          Compliance Overview
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-brand-sapphire-500" />
            <span className="text-brand-gray-600">Compliance Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-brand-gray-600">Incidents</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-brand-emerald-500" />
            <span className="text-brand-gray-600">Resolved</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={getColor('--chart-grid')} opacity={0.5} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: getColor('--chart-text'), fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: getColor('--chart-text'), fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="compliance"
            stroke={brandColors.primary}
            strokeWidth={3}
            dot={{ fill: brandColors.primary, strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="incidents"
            stroke={getColor('--color-error')}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: getColor('--color-error'), strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke={brandColors.secondary}
            strokeWidth={2}
            dot={{ fill: brandColors.secondary, strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Chart Container with Title and Description
interface ChartContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-brand-gray-200/50 shadow-sm ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-brand-gray-800 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-brand-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export {
  brandColors,
  CustomTooltip
};