import { useState, useEffect } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Target,
  Zap,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("90days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [kpis, setKpis] = useState([
    {
      title: "Revenue Growth",
      value: "+12.5%",
      subtitle: "vs last month",
      icon: <Target className="w-8 h-8 text-[#d8272d]" />,
    },
    {
      title: "Order Volume",
      value: "+8.2%",
      subtitle: "180 orders",
      icon: <BarChart3 className="w-8 h-8 text-[#b81e23]" />,
    },
    {
      title: "Customer Satisfaction",
      value: "94%",
      subtitle: "+2% this week",
      icon: <Zap className="w-8 h-8 text-[#ff6b6b]" />,
    },
    {
      title: "Profit Margin",
      value: "28.3%",
      subtitle: "-1.2% vs target",
      icon: <PieChartIcon className="w-8 h-8 text-[#d8272d]" />,
    },
  ]);

  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // ✅ Fetch or Mock Analytics Data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock backend data for now
      const orders = [
        {
          date: "2025-07-12",
          totalAmount: 14500,
          items: [
            { name: "Laptop", quantity: 3, price: 3000 },
            { name: "Keyboard", quantity: 5, price: 400 },
          ],
        },
        {
          date: "2025-08-18",
          totalAmount: 18200,
          items: [
            { name: "Headphones", quantity: 10, price: 500 },
            { name: "Mouse", quantity: 6, price: 350 },
          ],
        },
        {
          date: "2025-09-05",
          totalAmount: 22100,
          items: [
            { name: "Monitor", quantity: 4, price: 5000 },
            { name: "Keyboard", quantity: 8, price: 400 },
          ],
        },
      ];

      const inventory = [
        { category: "Electronics", stock: 340 },
        { category: "Accessories", stock: 240 },
        { category: "Home Appliances", stock: 180 },
        { category: "Office Supplies", stock: 100 },
      ];

      // ---- Compute Revenue and Order Trends ----
      const monthlySales: Record<string, number> = {};
      let totalRevenue = 0;

      orders.forEach((order: any) => {
        const date = new Date(order.date);
        const month = date.toLocaleString("default", { month: "short" });
        const amount = order.totalAmount || 0;
        monthlySales[month] = (monthlySales[month] || 0) + amount;
        totalRevenue += amount;
      });

      const salesTrend = Object.entries(monthlySales).map(([month, sales]) => ({
        month,
        sales,
      }));

      // ---- Category Distribution ----
      const categoryMap: Record<string, number> = {};
      inventory.forEach((item: any) => {
        categoryMap[item.category] =
          (categoryMap[item.category] || 0) + item.stock;
      });

      const categoryDistribution = Object.entries(categoryMap).map(
        ([name, value], index) => ({
          name,
          value,
          color: ["#d8272d", "#b81e23", "#ff6b6b", "#ffa07a"][index % 4],
        })
      );

      // ---- Top Products ----
      const topProducts = orders
        .flatMap((order: any) =>
          order.items.map((i: any) => ({
            name: i.name,
            sales: i.quantity,
            revenue: i.quantity * i.price,
          }))
        )
        .reduce((acc: any[], curr: any) => {
          const existing = acc.find((x) => x.name === curr.name);
          if (existing) {
            existing.sales += curr.sales;
            existing.revenue += curr.revenue;
          } else acc.push(curr);
          return acc;
        }, [])
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
        .map((p, i) => ({
          ...p,
          trend: i % 2 === 0 ? "up" : "down",
        }));

      // ---- KPI Updates ----
      const updatedKPIs = [...kpis];
      updatedKPIs[0].value = `₹${(totalRevenue / 1000).toFixed(1)}k`;
      updatedKPIs[1].subtitle = `${orders.length} orders`;
      updatedKPIs[3].value = `${(Math.random() * 25 + 15).toFixed(1)}%`;

      setKpis(updatedKPIs);
      setSalesData(salesTrend);
      setCategoryData(categoryDistribution);
      setTopProducts(topProducts);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("⚠️ Failed to load analytics. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Analytics Button Functionality
  const handleAddAnalytics = async () => {
    toast({
      title: "✅ Mock Data Added",
      description: "Analytics snapshot refreshed for 3 months of data.",
    });
    fetchAnalyticsData();
  };

  // ✅ Export Analytics Data
  const handleExport = async () => {
    const csv = [
      ["Month", "Sales"],
      ...salesData.map((d) => [d.month, d.sales]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics_report.csv";
    a.click();

    toast({
      title: "📊 Export Successful",
      description: "Analytics report downloaded successfully.",
    });
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1] min-h-screen rounded-xl">
      {error && (
        <div className="p-4 bg-[#fff3f3] border border-[#f1d1d1] rounded-lg text-[#b81e23]">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#b81e23]">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Insights for July–September 2025
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 border-[#d8272d] text-[#b81e23]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="bg-[#d8272d] hover:bg-[#b81e23] text-white font-semibold"
            onClick={handleAddAnalytics}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Data
          </Button>

          <Button
            className="border border-[#d8272d] text-[#d8272d] hover:bg-[#d8272d] hover:text-white font-semibold"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#d8272d]" />
        </div>
      ) : (
        <>
          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {kpis.map((item, i) => (
              <Card
                key={i}
                className="border border-[#f1d1d1] shadow-md hover:shadow-lg transition rounded-2xl bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>
                      <p className="text-2xl font-bold text-[#b81e23]">
                        {item.value}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.subtitle}
                      </p>
                    </div>
                    {item.icon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card className="border border-[#f1d1d1] shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-[#b81e23]">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#d8272d]" />
                  Sales Trend (₹)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3d6d6" />
                      <XAxis dataKey="month" stroke="#b81e23" />
                      <YAxis stroke="#b81e23" />
                      <Tooltip formatter={(v) => [`₹${v}`, "Sales"]} />
                      <Bar dataKey="sales" fill="#d8272d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="border border-[#f1d1d1] shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-[#b81e23]">
                  <PieChartIcon className="w-5 h-5 mr-2 text-[#d8272d]" />
                  Inventory by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {categoryData.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="border border-[#f1d1d1] shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-[#b81e23]">
                <TrendingUp className="w-5 h-5 mr-2 text-[#d8272d]" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div
                    key={p.name}
                    className="flex justify-between items-center p-4 border border-[#f1d1d1] rounded-lg hover:bg-[#fff5f5] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#ffe5e5] flex items-center justify-center text-[#b81e23] font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#b81e23]">{p.name}</h4>
                        <p className="text-sm text-gray-500">
                          {p.sales} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#b81e23]">
                        ₹{p.revenue.toLocaleString()}
                      </p>
                      <div className="flex justify-end items-center">
                        {p.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            p.trend === "up"
                              ? "border-green-500 text-green-600"
                              : "border-red-500 text-red-600"
                          }`}
                        >
                          {p.trend === "up" ? "Growing" : "Declining"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
