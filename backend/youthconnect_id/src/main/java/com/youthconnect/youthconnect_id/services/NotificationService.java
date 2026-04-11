package com.youthconnect.youthconnect_id.services;

import java.util.List;

import com.youthconnect.youthconnect_id.dto.NotificationResponse;

public interface NotificationService {
    List<NotificationResponse> getNotificationsByYouthId(int youthId);
}
