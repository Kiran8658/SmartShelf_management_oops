package com.smartshelf.smartshelf_inventory_system.controller;

import com.smartshelf.smartshelf_inventory_system.model.AnalyticsData;
import com.smartshelf.smartshelf_inventory_system.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    // ✅ GET all analytics data
    @GetMapping
    public List<AnalyticsData> getAllAnalytics() {
        return service.getAllAnalytics();
    }

    // ✅ POST new analytics record
    @PostMapping
    public AnalyticsData addAnalytics(@RequestBody AnalyticsData data) {
        return service.saveAnalytics(data);
    }

    // ✅ Dashboard endpoints (used by frontend)
    @GetMapping("/sales-trend")
    public List<Map<String, Object>> getSalesTrend() {
        return service.getSalesTrend();
    }

    @GetMapping("/category-distribution")
    public List<Map<String, Object>> getCategoryDistribution() {
        return service.getCategoryDistribution();
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopProducts() {
        return service.getTopProducts();
    }

    @GetMapping("/kpis")
    public Map<String, Object> getKPIs() {
        return service.getKPIs();
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("salesTrend", service.getSalesTrend());
        dashboard.put("categoryDistribution", service.getCategoryDistribution());
        dashboard.put("topProducts", service.getTopProducts());
        dashboard.put("kpis", service.getKPIs());
        return dashboard;
    }
}
