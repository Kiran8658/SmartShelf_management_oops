package com.smartshelf.smartshelf_inventory_system.repository;

import com.smartshelf.smartshelf_inventory_system.model.AnalyticsData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<AnalyticsData, Long> {

    // Sales trend grouped by month
    @Query("SELECT FUNCTION('MONTH', a.reportDate), SUM(a.revenue) " +
            "FROM AnalyticsData a GROUP BY FUNCTION('MONTH', a.reportDate) ORDER BY FUNCTION('MONTH', a.reportDate)")
    List<Object[]> getMonthlySalesTrend();

    // Category distribution
    @Query("SELECT a.category, SUM(a.revenue) FROM AnalyticsData a GROUP BY a.category")
    List<Object[]> getCategoryDistribution();

    // Top products by sales
    @Query("SELECT a.productName, SUM(a.quantitySold), SUM(a.revenue) " +
            "FROM AnalyticsData a GROUP BY a.productName ORDER BY SUM(a.revenue) DESC")
    List<Object[]> getTopProducts();
}
