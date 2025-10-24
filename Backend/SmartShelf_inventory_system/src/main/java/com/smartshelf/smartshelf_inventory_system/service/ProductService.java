package com.smartshelf.smartshelf_inventory_system.service;

import com.smartshelf.smartshelf_inventory_system.model.Product;
import com.smartshelf.smartshelf_inventory_system.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    // Constructor Injection (recommended)
    public ProductService(ProductRepository productRepository) {

        this.productRepository = productRepository;
    }
    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    // Save or update product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    // Delete product by ID
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
