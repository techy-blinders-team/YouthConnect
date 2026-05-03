package com.youthconnect.youthconnect_id.services.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.youthconnect.youthconnect_id.models.User;
import com.youthconnect.youthconnect_id.repositories.SkOfficialRepo;
import com.youthconnect.youthconnect_id.services.EmailService;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SkOfficialRepo skOfficialRepo;

    @Value("${app.base.url}")
    private String baseUrl;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    @Override
    public void sendApprovalEmail(String to, String firstName) {
        try {
            System.out.println("📧 Building approval email...");
            System.out.println("From: " + fromEmail);
            System.out.println("To: " + to);
            System.out.println("Subject: YouthConnect - Account Approved ✅");
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "YouthConnect - Barangay 183");
            helper.setTo(to);
            helper.setSubject("YouthConnect - Account Approved ✅");
            helper.setText(buildApprovalEmailTemplate(firstName, baseUrl), true);

            System.out.println("📤 Sending approval email via SMTP...");
            mailSender.send(message);
            System.out.println("✅ Approval email sent successfully!");
        } catch (Exception e) {
            // Log error but don't fail the approval process
            System.err.println("❌ Failed to send approval email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void sendRejectionEmail(String to, String firstName, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "YouthConnect - Barangay 183");
            helper.setTo(to);
            helper.setSubject("YouthConnect - Account Application Update");
            helper.setText(buildRejectionEmailTemplate(firstName, reason), true);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send rejection email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void notifySkOfficialsNewUser(User user, String youthName) {
        try {
            List<String> skEmails = skOfficialRepo.findAllActiveEmails();
            
            if (skEmails.isEmpty()) {
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "YouthConnect - Barangay 183");
            helper.setTo(skEmails.toArray(new String[0]));
            helper.setSubject("YouthConnect - New User Pending Approval");
            helper.setText(buildNewUserNotificationTemplate(youthName, user.getEmail(), 
                user.getCreatedAt().toString(), baseUrl), true);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send notification to SK officials: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void sendRegistrationConfirmationEmail(String to, String firstName) {
        try {
            System.out.println("📧 Building registration confirmation email...");
            System.out.println("From: " + fromEmail);
            System.out.println("To: " + to);
            System.out.println("Subject: YouthConnect - Account Registration Successful!");
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "YouthConnect - Barangay 183");
            helper.setTo(to);
            helper.setSubject("YouthConnect - Account Registration Successful!");
            helper.setText(buildRegistrationConfirmationTemplate(firstName), true);

            System.out.println("📤 Sending email via SMTP...");
            mailSender.send(message);
            System.out.println("✅ Email sent successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to send registration confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildApprovalEmailTemplate(String firstName, String loginUrl) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Account Approved!</h1>
                    </div>
                    <div class="content">
                        <p>Hi <strong>%s</strong>,</p>
                        <p>Great news! Your YouthConnect account has been approved by SK officials of Barangay 183.</p>
                        <p>You can now login and access all features of the platform including:</p>
                        <ul>
                            <li>View and register for events</li>
                            <li>Submit concerns and track their status</li>
                            <li>Receive notifications and updates</li>
                            <li>Access youth programs and services</li>
                        </ul>
                        <center>
                            <a href="%s/login" class="button">Login Now</a>
                        </center>
                        <p>Welcome to YouthConnect! We're excited to have you as part of our community.</p>
                    </div>
                    <div class="footer">
                        <p>YouthConnect - Sangguniang Kabataan, Barangay 183</p>
                    </div>
                </div>
            </body>
            </html>
        """.formatted(firstName, loginUrl);
    }

    private String buildRejectionEmailTemplate(String firstName, String reason) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .reason-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Account Application Update</h1>
                    </div>
                    <div class="content">
                        <p>Hi <strong>%s</strong>,</p>
                        <p>Thank you for your interest in YouthConnect. Unfortunately, your account application was not approved at this time.</p>
                        <div class="reason-box">
                            <strong>Reason:</strong> %s
                        </div>
                        <p>If you believe this is a mistake or have questions about this decision, please contact the SK officials at Barangay 183.</p>
                        <p>You may also visit the Barangay 183 office during office hours for assistance.</p>
                    </div>
                    <div class="footer">
                        <p>YouthConnect - Sangguniang Kabataan, Barangay 183</p>
                    </div>
                </div>
            </body>
            </html>
        """.formatted(firstName, reason != null && !reason.isBlank() ? reason : "Not specified");
    }

    private String buildNewUserNotificationTemplate(String youthName, String email, 
            String registeredDate, String adminUrl) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .info-box { background-color: white; border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📋 New User Pending Approval</h1>
                    </div>
                    <div class="content">
                        <p>A new user has registered on YouthConnect and is waiting for approval:</p>
                        <div class="info-box">
                            <p><strong>Name:</strong> %s</p>
                            <p><strong>Email:</strong> %s</p>
                            <p><strong>Registered:</strong> %s</p>
                        </div>
                        <p>Please review the user's profile and approve or reject their application.</p>
                        <center>
                            <a href="%s/admin/user-management" class="button">Review User</a>
                        </center>
                    </div>
                    <div class="footer">
                        <p>YouthConnect Admin Panel</p>
                    </div>
                </div>
            </body>
            </html>
        """.formatted(youthName, email, registeredDate, adminUrl);
    }

    private String buildRegistrationConfirmationTemplate(String firstName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .info-box { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Account Registration Successful!</h1>
                    </div>
                    <div class="content">
                        <p>Hi <strong>%s</strong>,</p>
                        <p>Thank you for registering with YouthConnect!</p>
                        <div class="info-box">
                            <p><strong>✅ Your account has been created successfully.</strong></p>
                            <p>Your account will now be reviewed and approved by the administrator or SK officials.</p>
                            <p>You will receive an email notification once your account is approved.</p>
                        </div>
                        <p>This process typically takes 1-2 business days. Once approved, you'll be able to:</p>
                        <ul>
                            <li>View and register for events</li>
                            <li>Submit concerns and track their status</li>
                            <li>Receive notifications and updates</li>
                            <li>Access youth programs and services</li>
                        </ul>
                        <p>Thank you for joining YouthConnect!</p>
                    </div>
                    <div class="footer">
                        <p>YouthConnect - Sangguniang Kabataan, Barangay 183</p>
                    </div>
                </div>
            </body>
            </html>
        """.formatted(firstName);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String firstName, String resetToken, boolean isSkOfficial) {
        try {
            System.out.println("🔐 Building password reset email...");
            System.out.println("From: " + fromEmail);
            System.out.println("To: " + toEmail);
            System.out.println("Subject: YouthConnect - Password Reset Request");
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "YouthConnect - Barangay 183");
            helper.setTo(toEmail);
            helper.setSubject("YouthConnect - Password Reset Request 🔐");
            helper.setText(buildPasswordResetEmailTemplate(firstName, resetToken, isSkOfficial), true);

            System.out.println("📤 Sending password reset email via SMTP...");
            mailSender.send(message);
            System.out.println("✅ Password reset email sent successfully!");

        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildPasswordResetEmailTemplate(String firstName, String resetToken, boolean isSkOfficial) {
        String resetUrl = baseUrl + (isSkOfficial ? "/sk-official/reset-password" : "/reset-password") + "?token=" + resetToken;
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .warning-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    .token-box { background-color: #f5f5f5; border: 1px dashed #999; padding: 15px; margin: 20px 0; font-family: monospace; word-break: break-all; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hi <strong>%s</strong>,</p>
                        <p>We received a request to reset your password for your YouthConnect account.</p>
                        <p>Click the button below to reset your password:</p>
                        <center>
                            <a href="%s" class="button">Reset Password</a>
                        </center>
                        <p>Or copy and paste this link into your browser:</p>
                        <div class="token-box">%s</div>
                        <div class="warning-box">
                            <p><strong>⚠️ Important:</strong></p>
                            <ul>
                                <li>This link will expire in <strong>1 hour</strong></li>
                                <li>If you didn't request this, please ignore this email</li>
                                <li>Your password won't change until you create a new one</li>
                            </ul>
                        </div>
                        <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
                    </div>
                    <div class="footer">
                        <p>YouthConnect - Sangguniang Kabataan, Barangay 183</p>
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        """.formatted(firstName, resetUrl, resetUrl);
    }
}
