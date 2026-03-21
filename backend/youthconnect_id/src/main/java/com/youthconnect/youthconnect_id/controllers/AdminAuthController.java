package com.youthconnect.youthconnect_id.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youthconnect.youthconnect_id.dto.AdminLoginRequest;
import com.youthconnect.youthconnect_id.dto.AdminLoginResponse;
import com.youthconnect.youthconnect_id.dto.SkOfficialLoginRequest;
import com.youthconnect.youthconnect_id.dto.SkOfficialLoginResponse;
import com.youthconnect.youthconnect_id.services.AdminAuthService;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    @PostMapping("/sk-official/login")
    public ResponseEntity<SkOfficialLoginResponse> skOfficialLogin(
            @RequestBody SkOfficialLoginRequest request) {
        try {
            SkOfficialLoginResponse response = adminAuthService.loginSkOfficial(request);
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SkOfficialLoginResponse(false, "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/administrator/login")
    public ResponseEntity<AdminLoginResponse> administratorLogin(
            @RequestBody AdminLoginRequest request) {
        try {
            AdminLoginResponse response = adminAuthService.loginAdministrator(request);
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AdminLoginResponse(false, "Login failed: " + e.getMessage()));
        }
    }
}