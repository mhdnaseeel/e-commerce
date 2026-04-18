package com.ecommerce.project.service;

import com.ecommerce.project.payload.UserDTO;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface UserService {
    UserDTO updateProfile(UserDTO userDTO);
    UserDTO updateProfileImage(MultipartFile image) throws IOException;
}
