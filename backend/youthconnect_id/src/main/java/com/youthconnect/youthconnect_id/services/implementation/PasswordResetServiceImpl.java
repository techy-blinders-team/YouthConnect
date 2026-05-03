package com.youthconnect.youthconnect_id.services.implementation;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.youthconnect.youthconnect_id.models.SkOfficialsUser;
import com.youthconnect.youthconnect_id.models.User;
import com.youthconnect.youthconnect_id.repositories.SkOfficialRepo;
import com.youthconnect.youthconnect_id.repositories.UserRepo;
import com.youthconnect.youthconnect_id.repositories.YouthProfileRepo;
import com.youthconnect.youthconnect_id.services.EmailService;
import com.youthconnect.youthconnect_id.services.PasswordResetService;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SkOfficialRepo skOfficialRepo;

    @Autowired
    private YouthProfileRepo youthProfileRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void initiatePasswordReset(String email, boolean isSkOfficial) {
        System.out.println("🔐 Initiating password reset for: " + email + " (SK Official: " + isSkOfficial + ")");

        if (isSkOfficial) {
            Optional<SkOfficialsUser> userOpt = skOfficialRepo.findByEmail(email);
            if (userOpt.isEmpty()) {
                System.out.println("⚠️ SK Official not found with email: " + email);
                System.out.println("⚠️ Email will NOT be sent - user does not exist in database");
                // Don't reveal if email exists or not for security
                return;
            }

            SkOfficialsUser user = userOpt.get();
            System.out.println("✅ SK Official found: " + user.getFirstName() + " " + user.getLastName() + " (ID: " + user.getAdminId() + ")");
            
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour
            skOfficialRepo.save(user);

            System.out.println("✅ Reset token generated and saved: " + resetToken);
            System.out.println("📧 Attempting to send email to: " + email);
            emailService.sendPasswordResetEmail(email, user.getFirstName(), resetToken, true);
            System.out.println("✅ Email service call completed");

        } else {
            Optional<User> userOpt = userRepo.findByEmail(email);
            if (userOpt.isEmpty()) {
                System.out.println("⚠️ Youth user not found with email: " + email);
                // Don't reveal if email exists or not for security
                return;
            }

            User user = userOpt.get();
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour
            userRepo.save(user);

            System.out.println("✅ Reset token generated for youth user ID: " + user.getUserId());
            
            // Get youth profile to get first name
            String firstName = "User"; // Default
            try {
                var youthProfile = youthProfileRepo.findById(user.getYouthId());
                if (youthProfile.isPresent()) {
                    firstName = youthProfile.get().getFirstName();
                }
            } catch (Exception e) {
                System.err.println("⚠️ Could not fetch youth profile: " + e.getMessage());
            }

            emailService.sendPasswordResetEmail(email, firstName, resetToken, false);
        }
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword, boolean isSkOfficial) {
        System.out.println("🔐 Resetting password with token (SK Official: " + isSkOfficial + ")");

        if (isSkOfficial) {
            Optional<SkOfficialsUser> userOpt = skOfficialRepo.findByResetToken(token);
            if (userOpt.isEmpty()) {
                throw new RuntimeException("Invalid or expired reset token");
            }

            SkOfficialsUser user = userOpt.get();
            
            // Check if token is expired
            if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Reset token has expired");
            }

            // Update password
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            skOfficialRepo.save(user);

            System.out.println("✅ Password reset successful for SK Official: " + user.getFirstName());

        } else {
            Optional<User> userOpt = userRepo.findByResetToken(token);
            if (userOpt.isEmpty()) {
                throw new RuntimeException("Invalid or expired reset token");
            }

            User user = userOpt.get();
            
            // Check if token is expired
            if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Reset token has expired");
            }

            // Update password
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepo.save(user);

            System.out.println("✅ Password reset successful for youth user ID: " + user.getUserId());
        }
    }

    @Override
    public boolean validateResetToken(String token, boolean isSkOfficial) {
        if (isSkOfficial) {
            Optional<SkOfficialsUser> userOpt = skOfficialRepo.findByResetToken(token);
            if (userOpt.isEmpty()) {
                return false;
            }
            SkOfficialsUser user = userOpt.get();
            return user.getResetTokenExpiry() != null && user.getResetTokenExpiry().isAfter(LocalDateTime.now());
        } else {
            Optional<User> userOpt = userRepo.findByResetToken(token);
            if (userOpt.isEmpty()) {
                return false;
            }
            User user = userOpt.get();
            return user.getResetTokenExpiry() != null && user.getResetTokenExpiry().isAfter(LocalDateTime.now());
        }
    }
}
