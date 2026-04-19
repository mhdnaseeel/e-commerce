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
        loggedInUser.setMarketingEmails(userDTO.isMarketingEmails());
        loggedInUser.setOrderUpdateEmails(userDTO.isOrderUpdateEmails());
        loggedInUser.setPromotionalEmails(userDTO.isPromotionalEmails());
        
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

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }

    @Override
    public String updatePassword(com.ecommerce.project.payload.PasswordUpdateDTO passwordUpdateDTO) {
        User loggedInUser = authUtil.loggedInUser();
        
        if (!passwordEncoder.matches(passwordUpdateDTO.getCurrentPassword(), loggedInUser.getPassword())) {
            throw new com.ecommerce.project.exceptions.APIException("Current password does not match");
        }
        
        loggedInUser.setPassword(passwordEncoder.encode(passwordUpdateDTO.getNewPassword()));
        userRepository.save(loggedInUser);
        
        return "Password changed successfully";
    }

    @Override
    public String requestDeactivation() {
        User user = authUtil.loggedInUser();
        user.setDeactivationRequested(true);
        userRepository.save(user);
        return "Deactivation request submitted successfully. Waiting for admin approval.";
    }

    @Override
    public com.ecommerce.project.payload.UserResponse getDeactivationRequests(org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<User> usersPage = userRepository.findByDeactivationRequestedTrue(pageable);
        java.util.List<com.ecommerce.project.payload.UserDTO> userDTOs = usersPage.getContent().stream()
                .map(user -> modelMapper.map(user, com.ecommerce.project.payload.UserDTO.class))
                .collect(java.util.stream.Collectors.toList());
        
        com.ecommerce.project.payload.UserResponse response = new com.ecommerce.project.payload.UserResponse();
        response.setContent(userDTOs);
        response.setPageNumber(usersPage.getNumber());
        response.setPageSize(usersPage.getSize());
        response.setTotalElements(usersPage.getTotalElements());
        response.setTotalPages(usersPage.getTotalPages());
        response.setLastPage(usersPage.isLast());
        
        return response;
    }

    @Override
    public String deactivateUser(Long userId, boolean approve) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        
        if (approve) {
            user.setEnabled(false);
            user.setDeactivationRequested(false);
            userRepository.save(user);
            return "User account deactivated successfully.";
        } else {
            user.setDeactivationRequested(false);
            userRepository.save(user);
            return "Deactivation request rejected.";
        }
    }
}
