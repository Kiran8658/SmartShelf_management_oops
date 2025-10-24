package com.smartshelf.smartshelf_inventory_system.controller;

import com.smartshelf.smartshelf_inventory_system.model.AuditLog;
import com.smartshelf.smartshelf_inventory_system.service.AuditLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/audit")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }
    @GetMapping("/all")
    public List<AuditLog> getAllLogs() {
        return auditLogService.getAllLogs();
    }
    @PostMapping("/log")
    public AuditLog createLog(@RequestBody AuditLog log) {
        return auditLogService.saveLog(
                log.getTableName(),
                log.getRecordId(),
                log.getAction(),
                log.getUserId(),
                log.getOldValues(),
                log.getNewValues(),
                log.getPerformedBy()
        );
    }
}
