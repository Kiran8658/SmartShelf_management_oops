package com.smartshelf.smartshelf_inventory_system.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "analytics_data")
public class AnalyticsData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metricName;       // e.g. "sales", "category:Grocery"
    private Double value;            // value for that metric
    private String category;         // e.g. "Groceries", "Electronics"
    private String productName;      // e.g. "Basmati Rice"
    private Double revenue;          // sales revenue
    private Integer quantitySold;    // number of units sold

    private LocalDate reportDate;    // e.g. 2025-10-22

    public AnalyticsData() {}

    public AnalyticsData(String metricName, Double value, String category, String productName,
                         Double revenue, Integer quantitySold, LocalDate reportDate) {
        this.metricName = metricName;
        this.value = value;
        this.category = category;
        this.productName = productName;
        this.revenue = revenue;
        this.quantitySold = quantitySold;
        this.reportDate = reportDate;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }

    public Integer getQuantitySold() { return quantitySold; }
    public void setQuantitySold(Integer quantitySold) { this.quantitySold = quantitySold; }

    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }
}
