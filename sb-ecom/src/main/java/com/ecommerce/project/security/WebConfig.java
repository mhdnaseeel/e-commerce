package com.ecommerce.project.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    String frontEndUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Remove trailing slash from frontEndUrl if present, as CORS origin matching is exact
        String cleanFrontEndUrl = frontEndUrl.endsWith("/")
                ? frontEndUrl.substring(0, frontEndUrl.length() - 1)
                : frontEndUrl;
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173", cleanFrontEndUrl)
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Set-Cookie")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String path = Paths.get("images").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/images/**")
                .addResourceLocations(path, "classpath:/static/images/");
    }
}
