package com.smartshelf.smartshelf_inventory_system.controller;

import com.smartshelf.smartshelf_inventory_system.model.Inventory;
import com.smartshelf.smartshelf_inventory_system.repository.InventoryRepository;
import com.smartshelf.smartshelf_inventory_system.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
// ✅ Fix typo: "loaclhost" → "http://localhost:8080" (match your frontend port)
@CrossOrigin(origins = "http://localhost:8080")
public class DashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        Double totalRevenue = orderRepository.calculateTotalRevenue();
        Long totalOrders = orderRepository.count();
        Long totalItems = inventoryRepository.count();

        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0);
        stats.put("revenueChange", 12.5);
        stats.put("totalOrders", totalOrders);
        stats.put("ordersChange", 8.2);
        stats.put("inventoryItems", totalItems);
        stats.put("inventoryChange", -2.1);
        stats.put("newAlerts", 3);

        return stats;
    }

    @GetMapping("/recent-activity")
    public List<Map<String, Object>> getRecentActivity() {
        List<Map<String, Object>> activities = new ArrayList<>();

        // Low stock alerts
        List<Inventory> lowStockItems = inventoryRepository.findTop5ByQuantityLessThanOrderByQuantityAsc(10);
        for (Inventory item : lowStockItems) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", "inv-" + item.getId());
            activity.put("type", "alert");
            activity.put("title", "Low Stock: " + item.getName());
            activity.put("description", "Only " + item.getQuantity() + " " + item.getUnit() + " remaining");
            activity.put("time", "Just now");
            activity.put("badge", Map.of("text", "Critical", "variant", "destructive"));
            activities.add(activity);
        }

        // Expiring items
        Calendar cal = Calendar.getInstance();
        Date now = cal.getTime();
        cal.add(Calendar.DAY_OF_MONTH, 30);
        Date in30Days = cal.getTime();

        List<Inventory> expiringItems = inventoryRepository.findTop5ByExpiryDateBetweenOrderByExpiryDateAsc(now, in30Days);
        for (Inventory item : expiringItems) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", "exp-" + item.getId());
            activity.put("type", "alert");
            activity.put("title", "Expiring Soon: " + item.getName());
            activity.put("description", "Expires on: " + item.getExpiryDate());
            activity.put("time", "Soon");
            activity.put("badge", Map.of("text", "Warning", "variant", "secondary"));
            activities.add(activity);
        }

        // Sample order activity
        Map<String, Object> orderActivity = new HashMap<>();
        orderActivity.put("id", "order-1001");
        orderActivity.put("type", "order");
        orderActivity.put("title", "New Order #ORD-1001");
        orderActivity.put("description", "Customer purchased 3 items worth ₹450");
        orderActivity.put("time", "5 minutes ago");
        orderActivity.put("badge", Map.of("text", "Completed", "variant", "default"));
        activities.add(orderActivity);

        return activities;
    }
}
