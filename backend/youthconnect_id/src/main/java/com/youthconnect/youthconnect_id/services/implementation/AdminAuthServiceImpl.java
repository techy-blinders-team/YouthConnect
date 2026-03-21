package com.youthconnect.youthconnect_id.services.implementation;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.youthconnect.youthconnect_id.dto.AdminLoginRequest;
import com.youthconnect.youthconnect_id.dto.AdminLoginResponse;
import com.youthconnect.youthconnect_id.dto.SkOfficialLoginRequest;
import com.youthconnect.youthconnect_id.dto.SkOfficialLoginResponse;
import com.youthconnect.youthconnect_id.models.Administrator;
import com.youthconnect.youthconnect_id.models.SkOfficialsUser;
import com.youthconnect.youthconnect_id.repositories.AdministratorRepo;
import com.youthconnect.youthconnect_id.repositories.SkOfficialRepo;
import com.youthconnect.youthconnect_id.security.JwtUtil;
import com.youthconnect.youthconnect_id.services.AdminAuthService;

@Service
public class AdminAuthServiceImpl implements AdminAuthService {

    @Autowired
    private SkOfficialRepo skOfficialsRepo;

    @Autowired
    private AdministratorRepo administratorRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public SkOfficialLoginResponse loginSkOfficial(SkOfficialLoginRequest request) {
        Optional<SkOfficialsUser> officialOptional = skOfficialsRepo.findByEmail(request.getEmail());

        if (officialOptional.isEmpty()) {
            return new SkOfficialLoginResponse(false, "Invalid email or password");
        }

        SkOfficialsUser official = officialOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), official.getPasswordHash())) {
            return new SkOfficialLoginResponse(false, "Invalid email or password");
        }

        if (!official.isActive()) {
            return new SkOfficialLoginResponse(false, "Account is inactive. Please contact administrator.");
        }

        String token = jwtUtil.generateToken(
            official.getEmail(),
            official.getAdminId(),
            official.getRole().getRoleId()
        );

        SkOfficialLoginResponse response = new SkOfficialLoginResponse(true, "Login successful");
        response.setToken(token);
        response.setAdminId(official.getAdminId());
        response.setEmail(official.getEmail());
        response.setFirstName(official.getFirstName());
        response.setLastName(official.getLastName());
        response.setRoleId(official.getRole().getRoleId());

        return response;
    }

    @Override
    public AdminLoginResponse loginAdministrator(AdminLoginRequest request) {
        Optional<Administrator> adminOptional = administratorRepo.findByEmail(request.getEmail());

        if (adminOptional.isEmpty()) {
            return new AdminLoginResponse(false, "Invalid email or password");
        }

        Administrator admin = adminOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            return new AdminLoginResponse(false, "Invalid email or password");
        }

        if (!admin.isActive()) {
            return new AdminLoginResponse(false, "Account is inactive.");
        }

        String token = jwtUtil.generateToken(
            admin.getEmail(),
            admin.getAdministratorId(),
            3 
        );

        AdminLoginResponse response = new AdminLoginResponse(true, "Login successful");
        response.setToken(token);
        response.setAdministratorId(admin.getAdministratorId());
        response.setEmail(admin.getEmail());
        response.setUsername(admin.getUsername());

        return response;
    }
}