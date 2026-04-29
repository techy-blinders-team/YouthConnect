package com.youthconnect.youthconnect_id.services.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.youthconnect.youthconnect_id.dto.NotificationResponse;
import com.youthconnect.youthconnect_id.models.ConcernUpdate;
import com.youthconnect.youthconnect_id.repositories.ConcernRepo;
import com.youthconnect.youthconnect_id.repositories.ConcernUpdateRepo;
import com.youthconnect.youthconnect_id.repositories.SkOfficialRepo;
import com.youthconnect.youthconnect_id.services.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private ConcernUpdateRepo concernUpdateRepo;

    @Autowired
    private ConcernRepo concernRepo;

    @Autowired
    private SkOfficialRepo skOfficialRepo;

    @Override
    public List<NotificationResponse> getNotificationsByYouthId(int youthId) {
        List<ConcernUpdate> updates = concernUpdateRepo.findByYouthId(youthId);
        
        return updates.stream()
                .sorted((u1, u2) -> u2.getCreatedAt().compareTo(u1.getCreatedAt())) // Latest first
                .map(update -> {
            NotificationResponse response = new NotificationResponse();
            response.setUpdateId(update.getUpdateId());
            response.setConcernId(update.getConcernId());
            response.setUpdateText(update.getUpdateText());
            response.setCreatedAt(update.getCreatedAt());
            
            // Get concern title
            concernRepo.findById(update.getConcernId()).ifPresent(concern -> {
                response.setConcernTitle(concern.getTitle());
            });
            
            // Get admin name
            if (update.getUpdatedByAdminId() != null) {
                skOfficialRepo.findById(update.getUpdatedByAdminId()).ifPresent(admin -> {
                    String adminName = admin.getFirstName() + " " + admin.getLastName();
                    response.setUpdatedByAdminName(adminName);
                });
            }
            
            return response;
        }).collect(Collectors.toList());
    }
}

