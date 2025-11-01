import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

interface WeeklySalesChartProps {
  data?: { day: string; sales: number }[]; // Optional prop
}

export function WeeklySalesChart({ data: propData }: WeeklySalesChartProps) {
  const [data, setData] = useState<{ day: string; sales: number }[]>(propData || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propData) {
      // Fetch from backend if propData not provided
      const fetchWeeklySales = async () => {
        setLoading(true);
        try {
          const res = await axios.get<{ day: string; sales: number }[]>(
            "http://localhost:8080/api/dashboard/weekly-sales"
          );
          setData(res.data);
        } catch (error) {
          console.error("Failed to fetch weekly sales:", error);
          // fallback dummy data
          setData([
            { day: "Mon", sales: 2000 },
            { day: "Tue", sales: 3500 },
            { day: "Wed", sales: 4000 },
            { day: "Thu", sales: 3000 },
            { day: "Fri", sales: 6000 },
            { day: "Sat", sales: 4500 },
            { day: "Sun", sales: 5000 },
          ]);
        } finally {
          setLoading(false);
        }
      };
      fetchWeeklySales();
    }
  }, [propData]);

  if (loading) {
    return <div className="p-4 border rounded shadow bg-white text-center">Loading Weekly Sales...</div>;
  }

  return (
    <div className="p-4 border rounded shadow bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Weekly Sales Trend</h3>
        <div className="text-sm text-muted-foreground">Weekly</div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={(value: any) => `₹${value}`} />
          <Bar dataKey="sales" fill="#4f46e5" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
