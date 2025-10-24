package com.smartshelf.smartshelf_inventory_system.service;

import com.smartshelf.smartshelf_inventory_system.model.AuditLog;
import com.smartshelf.smartshelf_inventory_system.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Save a new audit log
    public AuditLog saveLog(String tableName, Long recordId, String action, Long userId,
                            String oldValues, String newValues, String performedBy) {
        AuditLog log = new AuditLog();
        log.setTableName(tableName);
        log.setRecordId(recordId);
        log.setAction(action);
        log.setUserId(userId);
        log.setOldValues(oldValues);
        log.setNewValues(newValues);
        log.setTimestamp(LocalDateTime.now());
        log.setPerformedBy(performedBy);

        return auditLogRepository.save(log);
    }

    // Get all logs
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    // Get logs by user
    public List<AuditLog> getLogsByUser(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }

    // Get logs by table and record
    public List<AuditLog> getLogsByTableAndRecord(String tableName, Long recordId) {
        return auditLogRepository.findByTableNameAndRecordId(tableName, recordId);
    }
}
