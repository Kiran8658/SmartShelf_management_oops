import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Calendar, BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Props for dynamic data
interface SalesChartProps {
  weeklyData?: { name: string; sales: number; orders: number }[];
  monthlyData?: { name: string; sales: number; orders: number }[];
  categoryData?: { name: string; sales: number }[];
}

// Default dummy data
const defaultWeeklyData = [
  { name: "Mon", sales: 4000, orders: 24 },
  { name: "Tue", sales: 3000, orders: 18 },
  { name: "Wed", sales: 5000, orders: 32 },
  { name: "Thu", sales: 2780, orders: 17 },
  { name: "Fri", sales: 1890, orders: 12 },
  { name: "Sat", sales: 6390, orders: 41 },
  { name: "Sun", sales: 4490, orders: 28 },
];

const defaultMonthlyData = [
  { name: "Week 1", sales: 25000, orders: 156 },
  { name: "Week 2", sales: 32000, orders: 198 },
  { name: "Week 3", sales: 28000, orders: 175 },
  { name: "Week 4", sales: 35000, orders: 220 },
];

const defaultCategoryData = [
  { name: "Groceries", sales: 15000 },
  { name: "Medicines", sales: 12000 },
  { name: "Vegetables", sales: 8000 },
  { name: "Stationery", sales: 4000 },
  { name: "Others", sales: 3000 },
];

export function SalesChart({
  weeklyData = defaultWeeklyData,
  monthlyData = defaultMonthlyData,
  categoryData = defaultCategoryData,
}: SalesChartProps) {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly">("weekly");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // State for backend data
  const [weeklySales, setWeeklySales] = useState(weeklyData);
  const [monthlySales, setMonthlySales] = useState(monthlyData);
  const [categorySales, setCategorySales] = useState(categoryData);

  const currentSalesData = timePeriod === "weekly" ? weeklySales : monthlySales;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Weekly sales
        const weeklyRes = await axios.get(
          "http://localhost:8080/api/dashboard/weekly-sales"
        );
        if (weeklyRes.data) setWeeklySales(weeklyRes.data);

        // Monthly sales
        const monthlyRes = await axios.get(
          "http://localhost:8080/api/dashboard/monthly-sales"
        );
        if (monthlyRes.data) setMonthlySales(monthlyRes.data);

        // Sales by category
        const categoryRes = await axios.get(
          "http://localhost:8080/api/dashboard/sales-category"
        );
        if (categoryRes.data) setCategorySales(categoryRes.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Trend Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {timePeriod === "weekly" ? "Weekly" : "Monthly"} Sales Trend
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timePeriod === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("weekly")}
            >
              <Calendar className="w-4 h-4 mr-1" /> Weekly
            </Button>
            <Button
              variant={timePeriod === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("monthly")}
            >
              <Calendar className="w-4 h-4 mr-1" /> Monthly
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/analytics")}
              className="text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <TrendingUp className="w-4 h-4" /> View Detailed Analytics
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
              className="flex items-center gap-1"
            >
              <BarChart3 className="w-4 h-4" /> {chartType === "line" ? "Bar Chart" : "Line Chart"}
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "line" ? (
              <LineChart data={currentSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value}`} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={currentSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value}`} />
                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sales by Category Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value: any) => `₹${value}`} />
              <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
