package com.youthconnect.youthconnect_id.services;

import java.util.List;
import java.util.Map;

import com.youthconnect.youthconnect_id.dto.PendingUserResponse;

public interface UserApprovalService {
    List<PendingUserResponse> getPendingUsers();
    boolean approveUser(int userId, int approvedByAdminId);
    boolean rejectUser(int userId, String reason);
    Map<String, Object> getUserById(int userId);
}
