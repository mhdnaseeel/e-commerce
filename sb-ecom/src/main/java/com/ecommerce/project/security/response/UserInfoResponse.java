package com.ecommerce.project.security.response;

import java.util.List;

public class UserInfoResponse {
    private Long id;
    private String jwtToken;
    private String username;
    private String email;
    private String avatar;
    private String fullName;
    private String phoneNumber;
    private boolean marketingEmails;
    private boolean orderUpdateEmails;
    private boolean promotionalEmails;
    private boolean deactivationRequested;
    private boolean enabled;
    private List<String> roles;

    public UserInfoResponse(Long id, String username, List<String> roles, String email, String jwtToken, String avatar, String fullName, String phoneNumber, boolean marketingEmails, boolean orderUpdateEmails, boolean promotionalEmails, boolean deactivationRequested, boolean enabled) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.email = email;
        this.jwtToken = jwtToken;
        this.avatar = avatar;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.marketingEmails = marketingEmails;
        this.orderUpdateEmails = orderUpdateEmails;
        this.promotionalEmails = promotionalEmails;
        this.deactivationRequested = deactivationRequested;
        this.enabled = enabled;
    }

    public UserInfoResponse(Long id, String username, List<String> roles) {
        this.id = id;
        this.username = username;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isMarketingEmails() {
        return marketingEmails;
    }

    public void setMarketingEmails(boolean marketingEmails) {
        this.marketingEmails = marketingEmails;
    }

    public boolean isOrderUpdateEmails() {
        return orderUpdateEmails;
    }

    public void setOrderUpdateEmails(boolean orderUpdateEmails) {
        this.orderUpdateEmails = orderUpdateEmails;
    }

    public boolean isPromotionalEmails() {
        return promotionalEmails;
    }

    public void setPromotionalEmails(boolean promotionalEmails) {
        this.promotionalEmails = promotionalEmails;
    }

    public boolean isDeactivationRequested() {
        return deactivationRequested;
    }

    public void setDeactivationRequested(boolean deactivationRequested) {
        this.deactivationRequested = deactivationRequested;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}


