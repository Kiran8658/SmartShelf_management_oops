package com.smartshelf.smartshelf_inventory_system.repository;

import com.smartshelf.smartshelf_inventory_system.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
