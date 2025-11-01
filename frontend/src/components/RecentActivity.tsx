import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";
import axios, { AxiosError } from "axios";

// ---------------------------
// ✅ Activity Item Type
// ---------------------------
interface ActivityItem {
  id: string;
  type: "order" | "inventory" | "alert" | "analytics";
  title: string;
  description: string;
  time: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

// ---------------------------
// ✅ RecentActivity Component
// ---------------------------
export function RecentActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Base API URL
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  // ---------------------------
  // Fetch activities from backend
  // ---------------------------
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get<ActivityItem[]>(`${BASE_URL}/dashboard/recent-activity`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setActivities(response.data);
        } else {
          setError("No recent activity found.");
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Failed to fetch activities:", axiosError);
        setError("Failed to load recent activity. Backend might be down.");
        // Optional: fallback mock data
        setActivities([
          {
            id: "mock-1",
            type: "order",
            title: "New Order #1024",
            description: "Order received from John Doe",
            time: "2 mins ago",
          },
          {
            id: "mock-2",
            type: "inventory",
            title: "Inventory Low",
            description: "Product A is below threshold",
            time: "1 hour ago",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [BASE_URL]);

  // ---------------------------
  // Navigate on click
  // ---------------------------
  const handleActivityClick = (type: ActivityItem["type"]) => {
    const routeMap: Record<ActivityItem["type"], string> = {
      order: "/orders",
      inventory: "/inventory",
      alert: "/alerts",
      analytics: "/analytics",
    };
    navigate(routeMap[type]);
  };

  // ---------------------------
  // Render correct icon
  // ---------------------------
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="w-4 h-4 text-primary" />;
      case "inventory":
        return <Package className="w-4 h-4 text-secondary" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "analytics":
        return <TrendingUp className="w-4 h-4 text-accent" />;
      default:
        return <div className="w-4 h-4 bg-muted rounded-full" />;
    }
  };

  // ---------------------------
  // Render UI
  // ---------------------------
  return (
    <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading recent activity...</p>
        ) : error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : (
          <div className="space-y-4">
            {activities.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => handleActivityClick(item.type)}
              >
                <Avatar className="w-8 h-8 bg-muted flex items-center justify-center">
                  <AvatarFallback className="bg-transparent">
                    {getActivityIcon(item.type)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    {item.badge && (
                      <Badge variant={item.badge.variant} className="ml-2 text-xs">
                        {item.badge.text}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
