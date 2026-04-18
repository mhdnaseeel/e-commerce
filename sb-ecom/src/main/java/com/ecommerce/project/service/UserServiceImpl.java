package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.UserDTO;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AuthUtil authUtil;

    @Value("${project.image}")
    private String path;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    @Override
    public UserDTO updateProfile(UserDTO userDTO) {
        User loggedInUser = authUtil.loggedInUser();
        
        // Ensure email uniqueness if changed
        if (!loggedInUser.getEmail().equals(userDTO.getEmail()) && userRepository.existsByEmailIgnoreCase(userDTO.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }

        loggedInUser.setUserName(userDTO.getUsername());
        loggedInUser.setEmail(userDTO.getEmail());
        loggedInUser.setFullName(userDTO.getFullName());
        loggedInUser.setPhoneNumber(userDTO.getPhoneNumber());
        
        User updatedUser = userRepository.save(loggedInUser);
        
        UserDTO updatedDTO = modelMapper.map(updatedUser, UserDTO.class);
        if (updatedUser.getAvatar() != null) {
            updatedDTO.setAvatar(constructImageUrl(updatedUser.getAvatar()));
        }
        return updatedDTO;
    }

    @Override
    public UserDTO updateProfileImage(MultipartFile image) throws IOException {
        User loggedInUser = authUtil.loggedInUser();
        
        String fileName = fileService.uploadImage(path, image);
        loggedInUser.setAvatar(fileName);
        
        User updatedUser = userRepository.save(loggedInUser);
        
        UserDTO updatedDTO = modelMapper.map(updatedUser, UserDTO.class);
        updatedDTO.setAvatar(constructImageUrl(updatedUser.getAvatar()));
        return updatedDTO;
    }

    private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }
}
