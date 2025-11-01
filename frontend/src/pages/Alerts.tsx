import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  Package,
  TrendingUp,
  Search,
  Settings,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Zap
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "low-stock" | "expiry" | "high-demand" | "system" | "predictive";
  priority: "high" | "medium" | "low";
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    title: "Low Stock Alert",
    description: "Wheat Flour is running low (5 kg remaining)",
    type: "low-stock",
    priority: "high",
    timestamp: "2024-08-19T10:30:00",
    isRead: false,
    actionRequired: true
  },
  {
    id: "2",
    title: "Expiry Warning",
    description: "Paracetamol batch expires in 3 days",
    type: "expiry",
    priority: "medium",
    timestamp: "2024-08-19T09:15:00",
    isRead: false,
    actionRequired: true
  },
  {
    id: "3",
    title: "High Demand Detected",
    description: "Basmati Rice sales increased by 40% this week",
    type: "high-demand",
    priority: "medium",
    timestamp: "2024-08-19T08:00:00",
    isRead: true,
    actionRequired: false
  },
  {
    id: "4",
    title: "Predictive Restocking",
    description: "Tomatoes may run out in 2 days based on current trends",
    type: "predictive",
    priority: "medium",
    timestamp: "2024-08-18T16:45:00",
    isRead: false,
    actionRequired: true
  },
  {
    id: "5",
    title: "System Notification",
    description: "SmartShelf sensors updated successfully",
    type: "system",
    priority: "low",
    timestamp: "2024-08-18T12:00:00",
    isRead: true,
    actionRequired: false
  }
];

const getAlertIcon = (type: string) => {
  const iconClass = "w-5 h-5 text-gray-700";
  switch (type) {
    case "low-stock":
      return <Package className={iconClass} />;
    case "expiry":
      return <Clock className={iconClass} />;
    case "high-demand":
      return <TrendingUp className={iconClass} />;
    case "predictive":
      return <Zap className={iconClass} />;
    case "system":
      return <Settings className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white">High Priority</Badge>;
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Medium Priority</Badge>;
    case "low":
      return <Badge className="bg-green-100 text-green-700 border-green-300">Low Priority</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "low-stock":
      return <Badge className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white">Low Stock</Badge>;
    case "expiry":
      return <Badge className="bg-yellow-100 text-yellow-700">Expiry</Badge>;
    case "high-demand":
      return <Badge className="bg-blue-100 text-blue-700">High Demand</Badge>;
    case "predictive":
      return <Badge className="bg-indigo-100 text-indigo-700">AI Prediction</Badge>;
    case "system":
      return <Badge className="bg-gray-100 text-gray-700">System</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;
    return matchesSearch && matchesType && matchesPriority;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const highPriorityCount = alerts.filter(alert => alert.priority === "high").length;
  const actionRequiredCount = alerts.filter(alert => alert.actionRequired).length;

  const toggleRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRead: !alert.isRead } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const takeAction = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, actionRequired: false, isRead: true } : alert
      )
    );
  };

  return (
    <div className="space-y-6 text-gray-900 min-h-screen bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1] p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Alerts</h1>
          <p className="text-gray-600 mt-2">
            AI-powered notifications and predictive insights for your business.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white hover:shadow-lg">
          <Settings className="w-4 h-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border shadow-sm hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <Bell className="w-8 h-8 text-[#d8272d]" />
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
            <Eye className="w-8 h-8 text-indigo-600" />
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-[#d8272d]" />
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Action Required</p>
              <p className="text-2xl font-bold text-gray-900">{actionRequiredCount}</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-600" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-gray-300"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48 border-gray-300">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="expiry">Expiry</SelectItem>
              <SelectItem value="high-demand">High Demand</SelectItem>
              <SelectItem value="predictive">AI Predictions</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-48 border-gray-300">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Bell className="w-5 h-5 mr-2 text-[#d8272d]" />
            Alerts ({filteredAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-lg ${
                  !alert.isRead ? "bg-[#feeaea] border-[#d8272d]" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        {!alert.isRead && <div className="w-2 h-2 bg-[#d8272d] rounded-full"></div>}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(alert.type)}
                        {getPriorityBadge(alert.priority)}
                        {alert.actionRequired && (
                          <Badge className="bg-yellow-100 text-yellow-700">Action Required</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <div className="flex gap-1">
                      {alert.actionRequired && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] text-white"
                          onClick={() => takeAction(alert.id)}
                        >
                          Take Action
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => toggleRead(alert.id)}>
                        {alert.isRead ? <CheckCircle className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-[#d8272d]" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
