package com.youthconnect.youthconnect_id.services.implementation;

import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.youthconnect.youthconnect_id.dto.AdminSkOfficialRequest;
import com.youthconnect.youthconnect_id.dto.AdminUserUpdateRequest;
import com.youthconnect.youthconnect_id.dto.AdminYouthProfileUpdateRequest;
import com.youthconnect.youthconnect_id.models.Role;
import com.youthconnect.youthconnect_id.models.SkOfficialsUser;
import com.youthconnect.youthconnect_id.models.User;
import com.youthconnect.youthconnect_id.models.YouthProfile;
import com.youthconnect.youthconnect_id.repositories.RoleRepo;
import com.youthconnect.youthconnect_id.repositories.SkOfficialRepo;
import com.youthconnect.youthconnect_id.repositories.UserRepo;
import com.youthconnect.youthconnect_id.repositories.YouthProfileRepo;
import com.youthconnect.youthconnect_id.services.AdminManagementService;

@Service
public class AdminManagementServiceImpl implements AdminManagementService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private YouthProfileRepo youthProfileRepo;

    @Autowired
    private SkOfficialRepo skOfficialsRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ── Users ─────────────────────────────────────────────
    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserById(int userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    @Transactional
    public User updateUser(int userId, AdminUserUpdateRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(request.getEmail());
        user.setActive(request.isActive());
        user.setIsApprove(request.isApprove());
        user.setRoleId(request.getRoleId());
        return userRepo.save(user);
    }

    @Override
    public void deleteUser(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepo.delete(user);
    }

    @Override
    @Transactional
    public User approveUser(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsApprove(true);
        return userRepo.save(user);
    }

    @Override
    @Transactional
    public User deactivateUser(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        return userRepo.save(user);
    }

    // ── Youth Profile ─────────────────────────────────────
    @Override
    public List<YouthProfile> getAllYouthProfiles() {
        return youthProfileRepo.findAll();
    }

    @Override
    public YouthProfile getYouthProfileById(int youthId) {
        return youthProfileRepo.findById(youthId)
                .orElseThrow(() -> new RuntimeException("Youth profile not found"));
    }

    @Override
    @Transactional
    public YouthProfile updateYouthProfile(int youthId, AdminYouthProfileUpdateRequest request) {
        YouthProfile profile = youthProfileRepo.findById(youthId)
                .orElseThrow(() -> new RuntimeException("Youth profile not found"));
        profile.setFirstName(request.getFirstName());
        profile.setMiddleName(request.getMiddleName());
        profile.setLastName(request.getLastName());
        profile.setSuffix(request.getSuffix());
        profile.setGender(request.getGender());
        profile.setBirthday(request.getBirthday());
        profile.setContactNumber(request.getContactNumber());
        profile.setCompleteAddress(request.getCompleteAddress());
        profile.setCivilStatus(request.getCivilStatus());
        profile.setUpdatedAt(LocalDateTime.now());
        if (request.getBirthday() != null) {
            profile.setAge(Period.between(request.getBirthday(),
                    LocalDateTime.now().toLocalDate()).getYears());
        }
        return youthProfileRepo.save(profile);
    }

    @Override
    public void deleteYouthProfile(int youthId) {
        YouthProfile profile = youthProfileRepo.findById(youthId)
                .orElseThrow(() -> new RuntimeException("Youth profile not found"));
        youthProfileRepo.delete(profile);
    }

    // ── SK Officials ──────────────────────────────────────
    @Override
    public List<SkOfficialsUser> getAllSkOfficials() {
        return skOfficialsRepo.findAll();
    }

    @Override
    public SkOfficialsUser getSkOfficialById(int adminId) {
        return skOfficialsRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("SK Official not found"));
    }

    @Override
    @Transactional
    public SkOfficialsUser createSkOfficial(AdminSkOfficialRequest request) {
        Role role = roleRepo.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        SkOfficialsUser official = new SkOfficialsUser();
        official.setFirstName(request.getFirstName());
        official.setLastName(request.getLastName());
        official.setEmail(request.getEmail());
        official.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        official.setRole(role);
        official.setActive(request.isActive());
        official.setCreatedAt(LocalDateTime.now());
        return skOfficialsRepo.save(official);
    }

    @Override
    @Transactional
    public SkOfficialsUser updateSkOfficial(int adminId, AdminSkOfficialRequest request) {
        SkOfficialsUser official = skOfficialsRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("SK Official not found"));
        Role role = roleRepo.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        official.setFirstName(request.getFirstName());
        official.setLastName(request.getLastName());
        official.setEmail(request.getEmail());
        official.setRole(role);
        official.setActive(request.isActive());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            official.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        return skOfficialsRepo.save(official);
    }

    @Override
    public void deleteSkOfficial(int adminId) {
        SkOfficialsUser official = skOfficialsRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("SK Official not found"));
        skOfficialsRepo.delete(official);
    }
}