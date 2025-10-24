package com.smartshelf.smartshelf_inventory_system.service;

import com.smartshelf.smartshelf_inventory_system.model.AnalyticsData;
import com.smartshelf.smartshelf_inventory_system.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AnalyticsService {

    private final AnalyticsRepository repo;

    public AnalyticsService(AnalyticsRepository repo) {
        this.repo = repo;
    }

    public List<AnalyticsData> getAllAnalytics() {
        return repo.findAll();
    }

    public AnalyticsData saveAnalytics(AnalyticsData data) {
        return repo.save(data);
    }

    public List<Map<String, Object>> getSalesTrend() {
        List<Object[]> rows = repo.getMonthlySalesTrend();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", row[0]);
            map.put("sales", row[1]);
            result.add(map);
        }
        return result;
    }

    public List<Map<String, Object>> getCategoryDistribution() {
        List<Object[]> rows = repo.getCategoryDistribution();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("value", row[1]);
            result.add(map);
        }
        return result;
    }

    public List<Map<String, Object>> getTopProducts() {
        List<Object[]> rows = repo.getTopProducts();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("sales", row[1]);
            map.put("revenue", row[2]);
            map.put("trend", "up"); // placeholder — could calculate based on history
            result.add(map);
        }
        return result;
    }

    public Map<String, Object> getKPIs() {
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalRevenue", repo.findAll().stream().mapToDouble(a -> a.getRevenue() == null ? 0 : a.getRevenue()).sum());
        kpis.put("totalSales", repo.findAll().stream().mapToInt(a -> a.getQuantitySold() == null ? 0 : a.getQuantitySold()).sum());
        kpis.put("avgRevenuePerProduct", repo.findAll().stream()
                .filter(a -> a.getRevenue() != null)
                .mapToDouble(AnalyticsData::getRevenue)
                .average()
                .orElse(0));
        return kpis;
    }
}
