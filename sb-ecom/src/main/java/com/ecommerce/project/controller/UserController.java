package com.ecommerce.project.controller;

import com.ecommerce.project.payload.UserDTO;
import com.ecommerce.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateProfile(userDTO);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<UserDTO> updateProfileImage(@RequestParam("image") MultipartFile image) throws IOException {
        UserDTO updatedUser = userService.updateProfileImage(image);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }
}
