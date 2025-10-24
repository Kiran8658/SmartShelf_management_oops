package com.smartshelf.smartshelf_inventory_system.repository;

import com.smartshelf.smartshelf_inventory_system.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // You can add custom query methods if needed, for example:
    // List<Product> findByCategory(String category);
}
