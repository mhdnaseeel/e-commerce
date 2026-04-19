package com.ecommerce.project.service;

import com.ecommerce.project.payload.UserDTO;
import com.ecommerce.project.payload.UserResponse;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface UserService {
    UserDTO updateProfile(UserDTO userDTO);
    UserDTO updateProfileImage(MultipartFile image) throws IOException;
    String updatePassword(com.ecommerce.project.payload.PasswordUpdateDTO passwordUpdateDTO);
    String requestDeactivation();
    UserResponse getDeactivationRequests(org.springframework.data.domain.Pageable pageable);
    String deactivateUser(Long userId, boolean approve);
}
