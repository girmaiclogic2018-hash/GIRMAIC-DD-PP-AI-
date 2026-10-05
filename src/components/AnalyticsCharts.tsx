import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const interactionTrendsData = [
  { day: 'Mon', queries: 140, voice: 45, phone: 20 },
  { day: 'Tue', queries: 210, voice: 60, phone: 35 },
  { day: 'Wed', queries: 280, voice: 85, phone: 40 },
  { day: 'Thu', queries: 250, voice: 70, phone: 30 },
  { day: 'Fri', queries: 320, voice: 95, phone: 50 },
  { day: 'Sat', queries: 190, voice: 50, phone: 15 },
  { day: 'Sun', queries: 160, voice: 40, phone: 10 },
];

const policyQueryFrequencyData = [
  { topic: 'PP Bylaws', count: 420 },
  { topic: 'Dire Dawa Dev', count: 380 },
  { topic: 'Customs Clearance', count: 310 },
  { topic: 'Youth MSE', count: 240 },
  { topic: 'FDRE Proclamations', count: 190 },
];

const activeUsersData = [
  { week: 'Week 1', users: 850 },
  { week: 'Week 2', users: 1120 },
  { week: 'Week 3', users: 1450 },
  { week: 'Week 4', users: 1890 },
];

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Interaction Trends */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>User Interaction Trends (Weekly)</span>
          <span className="text-[10px] text-emerald-400 font-mono">Text · Voice · Phone</span>
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={interactionTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="queries" name="Text Qs" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="voice" name="Voice Sessions" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="phone" name="Phone Calls" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Policy Query Frequency */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Frequency of Policy Queries</span>
          <span className="text-[10px] text-amber-400 font-mono">Top Topics</span>
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={policyQueryFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="topic" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="count" name="Query Count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Users Over Time */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 lg:col-span-2">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Active Citizens & Officers Over Time</span>
          <span className="text-[10px] text-cyan-400 font-mono">Monthly Growth</span>
        </h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeUsersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
              <Area type="monotone" dataKey="users" name="Active Users" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
