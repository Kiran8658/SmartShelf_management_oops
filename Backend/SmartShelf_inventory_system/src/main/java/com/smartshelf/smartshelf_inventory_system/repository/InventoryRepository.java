package com.smartshelf.smartshelf_inventory_system.repository;

import com.smartshelf.smartshelf_inventory_system.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // Fetch top 5 low-stock items for dashboard recent activity
    List<Inventory> findTop5ByQuantityLessThanOrderByQuantityAsc(int quantityThreshold);

    // Optional: fetch items expiring soon (future feature)
    List<Inventory> findTop5ByExpiryDateBetweenOrderByExpiryDateAsc(Date start, Date end);

    List<Inventory> findTop5ByQuantityLessThanEqualOrderByQuantityAsc(int i);
}
