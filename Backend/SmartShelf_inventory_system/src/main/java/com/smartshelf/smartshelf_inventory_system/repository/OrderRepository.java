package com.smartshelf.smartshelf_inventory_system.repository;

import com.smartshelf.smartshelf_inventory_system.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    Double calculateTotalRevenue();

    // Count orders in the last 7 days
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :sevenDaysAgo")
    Long countLast7Days(LocalDateTime sevenDaysAgo);
}
