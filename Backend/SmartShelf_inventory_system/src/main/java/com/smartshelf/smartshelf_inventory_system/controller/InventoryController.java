package com.smartshelf.smartshelf_inventory_system.controller;

import com.smartshelf.smartshelf_inventory_system.model.Inventory;
import com.smartshelf.smartshelf_inventory_system.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081"}) // ✅ Support multiple frontend ports if needed
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    // ✅ GET all inventory items (frontend expects plain JSON array)
    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // ✅ GET single item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ POST - Add new inventory item
    @PostMapping
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory inventory) {
        Inventory savedItem = inventoryRepository.save(inventory);
        return ResponseEntity.ok(savedItem);
    }

    // ✅ PUT - Update existing inventory item
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory inventoryDetails) {
        Optional<Inventory> optionalItem = inventoryRepository.findById(id);

        if (optionalItem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Inventory inventory = optionalItem.get();
        inventory.setName(inventoryDetails.getName());
        inventory.setCategory(inventoryDetails.getCategory());
        inventory.setQuantity(inventoryDetails.getQuantity());
        inventory.setUnit(inventoryDetails.getUnit());
        inventory.setPrice(inventoryDetails.getPrice());
        inventory.setExpiryDate(inventoryDetails.getExpiryDate());
        inventory.setStatus(inventoryDetails.getStatus());

        Inventory updatedItem = inventoryRepository.save(inventory);
        return ResponseEntity.ok(updatedItem);
    }

    // ✅ DELETE - Delete inventory item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        if (!inventoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        inventoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
