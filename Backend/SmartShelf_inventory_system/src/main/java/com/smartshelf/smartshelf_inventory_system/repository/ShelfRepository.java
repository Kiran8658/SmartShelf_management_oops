package com.smartshelf.smartshelf_inventory_system.repository;

import com.smartshelf.smartshelf_inventory_system.model.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShelfRepository extends JpaRepository<Shelf, Long> {
}
