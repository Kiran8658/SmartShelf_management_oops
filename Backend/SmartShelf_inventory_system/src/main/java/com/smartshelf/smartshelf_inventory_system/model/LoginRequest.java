package com.smartshelf.smartshelf_inventory_system.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    // getters & setters
    private String email;
    private String password;

    public String getUsername() {
        return null;

    }
}
