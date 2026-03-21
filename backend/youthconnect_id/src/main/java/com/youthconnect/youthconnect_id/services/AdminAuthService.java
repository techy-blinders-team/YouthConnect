package com.youthconnect.youthconnect_id.services;

import com.youthconnect.youthconnect_id.dto.AdminLoginRequest;
import com.youthconnect.youthconnect_id.dto.AdminLoginResponse;
import com.youthconnect.youthconnect_id.dto.SkOfficialLoginRequest;
import com.youthconnect.youthconnect_id.dto.SkOfficialLoginResponse;

public interface AdminAuthService {
    SkOfficialLoginResponse loginSkOfficial(SkOfficialLoginRequest request);
    AdminLoginResponse loginAdministrator(AdminLoginRequest request);
}