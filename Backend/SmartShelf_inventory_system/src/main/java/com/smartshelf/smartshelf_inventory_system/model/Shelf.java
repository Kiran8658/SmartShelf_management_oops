package com.smartshelf.smartshelf_inventory_system.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shelves")
public class Shelf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false, unique = true)
    private String label;

    // ✅ One-to-Many relationship with Inventory
    @OneToMany(mappedBy = "shelf", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Inventory> inventoryItems = new ArrayList<>();

    // ---------- Constructors ----------
    public Shelf() {}

    public Shelf(String location, String label) {
        this.location = location;
        this.label = label;
    }

    // ---------- Getters & Setters ----------
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Inventory> getInventoryItems() {
        return inventoryItems;
    }

    public void setInventoryItems(List<Inventory> inventoryItems) {
        this.inventoryItems = inventoryItems;
    }

    // ---------- Helper Methods ----------
    public void addInventoryItem(Inventory item) {
        inventoryItems.add(item);
        item.setShelf(this); // maintains bidirectional consistency
    }

    public void removeInventoryItem(Inventory item) {
        inventoryItems.remove(item);
        item.setShelf(null); // remove relationship
    }

    @Override
    public String toString() {
        return "Shelf{" +
                "id=" + id +
                ", location='" + location + '\'' +
                ", label='" + label + '\'' +
                ", inventoryCount=" + (inventoryItems != null ? inventoryItems.size() : 0) +
                '}';
    }
}
