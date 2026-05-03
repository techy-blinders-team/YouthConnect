package com.youthconnect.youthconnect_id.services;

import com.youthconnect.youthconnect_id.models.User;

public interface EmailService {
    void sendApprovalEmail(String to, String firstName);
    void sendRejectionEmail(String to, String firstName, String reason);
    void notifySkOfficialsNewUser(User user, String youthName);
    void sendRegistrationConfirmationEmail(String to, String firstName);
}
