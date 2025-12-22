import React, { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    // Mock Data (Replace with real API calls if fetching 'all' orders)
    const salesData = [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 2000 },
        { name: 'Apr', sales: 2780 },
        { name: 'May', sales: 1890 },
        { name: 'Jun', sales: 2390 },
        { name: 'Jul', sales: 3490 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 400 },
        { name: 'Clothing', value: 300 },
        { name: 'Books', value: 300 },
        { name: 'Home', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'Total Sales', value: '₹1,24,000', color: 'bg-blue-500' },
                        { title: 'Total Orders', value: '1,432', color: 'bg-green-500' },
                        { title: 'Active Users', value: '890', color: 'bg-purple-500' },
                        { title: 'Pending Orders', value: '12', color: 'bg-orange-500' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                        >
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 mr-4`}>
                                    <div className={`w-6 h-6 ${stat.color} rounded-full`} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Sales Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <h2 className="text-xl font-semibold mb-6">Sales Overview</h2>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#6B7280' }} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" tick={{ fill: '#6B7280' }} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#2874f0"
                                        strokeWidth={3}
                                        dot={{ fill: '#2874f0', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Category Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <h2 className="text-xl font-semibold mb-6">Orders by Category</h2>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
