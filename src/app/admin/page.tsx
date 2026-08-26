"use client";

import { useEffect, useState } from "react";
import { Users, Music, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboard() {
  const [totalSanggar, setTotalSanggar] = useState<number>(0);
  const [totalPemusik, setTotalPemusik] = useState<number>(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { count: countSanggar } = await supabase.from('sanggar').select('*', { count: 'exact', head: true });
        const { count: countPemusik } = await supabase.from('pemusik').select('*', { count: 'exact', head: true });
        
        setTotalSanggar(countSanggar || 0);
        setTotalPemusik(countPemusik || 0);

        const { data: recentSanggar } = await supabase
          .from('sanggar')
          .select('id, namaSanggar, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
          
        const { data: recentPemusik } = await supabase
          .from('pemusik')
          .select('id, nama, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        const formattedSanggar = (recentSanggar || []).map(item => ({
          id: `s-${item.id}`,
          name: item.namaSanggar,
          type: 'Sanggar',
          action: t('newRegistration'),
          status: 'Aktif',
          date: new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          rawDate: item.created_at
        }));

        const formattedPemusik = (recentPemusik || []).map(item => ({
          id: `p-${item.id}`,
          name: item.nama,
          type: 'Seniman Musik',
          action: t('newRegistration'),
          status: 'Aktif',
          date: new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          rawDate: item.created_at
        }));

        const combined = [...formattedSanggar, ...formattedPemusik]
          .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
          .slice(0, 5);

        setRecentActivities(combined);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { name: t('adminStatTotalSanggar'), value: isLoading ? "..." : totalSanggar.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { name: t('adminStatTotalMusik'), value: isLoading ? "..." : totalPemusik.toString(), icon: Music, color: "text-purple-600", bg: "bg-purple-100" },
    { name: t('adminStatPending'), value: "0", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" },
    { name: t('adminStatVerified'), value: "0", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  const chartData = [
    { name: 'Jan', Sanggar: 4, 'Seniman Musik': 2 },
    { name: 'Feb', Sanggar: 7, 'Seniman Musik': 5 },
    { name: 'Mar', Sanggar: 5, 'Seniman Musik': 8 },
    { name: 'Apr', Sanggar: 10, 'Seniman Musik': 6 },
    { name: 'Mei', Sanggar: 15, 'Seniman Musik': 12 },
    { name: 'Jun', Sanggar: 12, 'Seniman Musik': 18 },
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('adminTitleOverview')}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('adminDescOverview')}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6">{t('adminChartTitle')}</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSanggar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPemusik" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Area type="monotone" dataKey="Sanggar" stroke="#f97316" fillOpacity={1} fill="url(#colorSanggar)" />
              <Area type="monotone" dataKey="Seniman Musik" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPemusik)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900">{t('adminRecentActivityTitle')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colEntityName')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colType')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colActivity')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colStatus')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colTime')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{activity.type}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{activity.action}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
                      activity.status === 'Aktif' || activity.status === 'Disetujui' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 
                      activity.status === 'Menunggu' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' :
                      'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                    {activity.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
