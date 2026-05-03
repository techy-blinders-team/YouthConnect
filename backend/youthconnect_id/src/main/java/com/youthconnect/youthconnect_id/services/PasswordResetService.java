package com.youthconnect.youthconnect_id.services;

public interface PasswordResetService {
    void initiatePasswordReset(String email, boolean isSkOfficial);
    void resetPassword(String token, String newPassword, boolean isSkOfficial);
    boolean validateResetToken(String token, boolean isSkOfficial);
}
