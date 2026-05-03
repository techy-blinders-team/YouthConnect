package com.youthconnect.youthconnect_id.services.implementation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.youthconnect.youthconnect_id.dto.PendingUserResponse;
import com.youthconnect.youthconnect_id.models.User;
import com.youthconnect.youthconnect_id.models.YouthProfile;
import com.youthconnect.youthconnect_id.repositories.UserRepo;
import com.youthconnect.youthconnect_id.repositories.YouthProfileRepo;
import com.youthconnect.youthconnect_id.services.EmailService;
import com.youthconnect.youthconnect_id.services.UserApprovalService;

@Service
public class UserApprovalServiceImpl implements UserApprovalService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private YouthProfileRepo youthProfileRepo;

    @Autowired
    private EmailService emailService;

    @Override
    public List<PendingUserResponse> getPendingUsers() {
        List<User> pendingUsers = userRepo.findByStatusOrderByCreatedAtDesc(User.STATUS_PENDING);
        List<PendingUserResponse> responses = new ArrayList<>();

        for (User user : pendingUsers) {
            PendingUserResponse response = new PendingUserResponse();
            response.setUserId(user.getUserId());
            response.setYouthId(user.getYouthId());
            response.setEmail(user.getEmail());
            response.setStatus(user.getStatus());
            response.setCreatedAt(user.getCreatedAt());

            // Get youth profile details
            Optional<YouthProfile> profileOpt = youthProfileRepo.findById(user.getYouthId());
            if (profileOpt.isPresent()) {
                YouthProfile profile = profileOpt.get();
                response.setFirstName(profile.getFirstName());
                response.setLastName(profile.getLastName());
                response.setContactNumber(profile.getContactNumber());
            }

            responses.add(response);
        }

        return responses;
    }

    @Override
    public boolean approveUser(int userId, int approvedByAdminId) {
        System.out.println("🟢 SERVICE: approveUser() called for userId=" + userId);
        
        Optional<User> userOpt = userRepo.findById(userId);
        
        if (userOpt.isEmpty()) {
            System.out.println("🔴 SERVICE: User not found");
            return false;
        }

        User user = userOpt.get();
        System.out.println("🟢 SERVICE: Found user: " + user.getEmail());
        
        // Get youth profile for name
        Optional<YouthProfile> profileOpt = youthProfileRepo.findById(user.getYouthId());
        String firstName = "User";
        if (profileOpt.isPresent()) {
            firstName = profileOpt.get().getFirstName();
        }
        System.out.println("🟢 SERVICE: Youth name: " + firstName);
        
        // Update user status in a transaction
        boolean updated = updateUserStatus(user, approvedByAdminId);
        
        if (!updated) {
            return false;
        }
        
        // Send approval email AFTER transaction commits
        System.out.println("=== Attempting to send approval email ===");
        System.out.println("To: " + user.getEmail());
        System.out.println("Name: " + firstName);
        
        try {
            emailService.sendApprovalEmail(user.getEmail(), firstName);
            System.out.println("✅ Approval email sent successfully");
        } catch (Exception e) {
            System.err.println("❌ Failed to send approval email: " + e.getMessage());
            e.printStackTrace();
        }

        return true;
    }
    
    @Transactional
    private boolean updateUserStatus(User user, int approvedByAdminId) {
        try {
            // Update user status
            user.setStatus(User.STATUS_APPROVED);
            user.setActive(true);
            user.setApprovedBy(approvedByAdminId);
            user.setApprovedAt(LocalDateTime.now());
            userRepo.save(user);
            System.out.println("🟢 SERVICE: User status updated in database");
            return true;
        } catch (Exception e) {
            System.err.println("🔴 SERVICE: Failed to update user status: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean rejectUser(int userId, String reason) {
        System.out.println("🔴 SERVICE: rejectUser() called for userId=" + userId);
        
        Optional<User> userOpt = userRepo.findById(userId);
        
        if (userOpt.isEmpty()) {
            System.out.println("🔴 SERVICE: User not found");
            return false;
        }

        User user = userOpt.get();
        System.out.println("🔴 SERVICE: Found user: " + user.getEmail());
        
        // Get youth profile for name
        Optional<YouthProfile> profileOpt = youthProfileRepo.findById(user.getYouthId());
        String firstName = "User";
        if (profileOpt.isPresent()) {
            firstName = profileOpt.get().getFirstName();
        }
        System.out.println("🔴 SERVICE: Youth name: " + firstName);
        System.out.println("🔴 SERVICE: Rejection reason: " + reason);
        
        // Update user status in a transaction
        boolean updated = updateUserStatusRejected(user, reason);
        
        if (!updated) {
            return false;
        }
        
        // Send rejection email AFTER transaction commits
        System.out.println("=== Attempting to send rejection email ===");
        System.out.println("To: " + user.getEmail());
        System.out.println("Name: " + firstName);
        System.out.println("Reason: " + reason);
        
        try {
            emailService.sendRejectionEmail(user.getEmail(), firstName, reason);
            System.out.println("✅ Rejection email sent successfully");
        } catch (Exception e) {
            System.err.println("❌ Failed to send rejection email: " + e.getMessage());
            e.printStackTrace();
        }

        return true;
    }

    @Override
    public Map<String, Object> getUserById(int userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        Map<String, Object> userMap = new java.util.HashMap<>();
        userMap.put("userId", user.getUserId());
        userMap.put("youthId", user.getYouthId());
        userMap.put("email", user.getEmail());
        userMap.put("roleId", user.getRoleId());
        userMap.put("isActive", user.isActive());
        userMap.put("status", user.getStatus());
        userMap.put("createdAt", user.getCreatedAt().toString());
        
        return userMap;
    }
    
    @Transactional
    private boolean updateUserStatusRejected(User user, String reason) {
        try {
            // Update user status
            user.setStatus(User.STATUS_REJECTED);
            user.setActive(false);
            user.setRejectionReason(reason);
            userRepo.save(user);
            System.out.println("🔴 SERVICE: User status updated to rejected in database");
            return true;
        } catch (Exception e) {
            System.err.println("🔴 SERVICE: Failed to update user status: " + e.getMessage());
            return false;
        }
    }
}
