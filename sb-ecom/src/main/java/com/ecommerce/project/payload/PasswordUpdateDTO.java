package com.ecommerce.project.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordUpdateDTO {
    
    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 6, message = "New password must be at least 6 characters")
    private String newPassword;
}
