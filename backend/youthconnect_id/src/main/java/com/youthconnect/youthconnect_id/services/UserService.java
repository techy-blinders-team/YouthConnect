package com.youthconnect.youthconnect_id.services;

import com.youthconnect.youthconnect_id.dto.LoginRequest;
import com.youthconnect.youthconnect_id.dto.LoginResponse;
import com.youthconnect.youthconnect_id.dto.RegistrationRequest;
import com.youthconnect.youthconnect_id.dto.RegistrationResponse;

public interface UserService {
    RegistrationResponse registerUser(RegistrationRequest request);
    LoginResponse loginUser(LoginRequest request);
}
