package com.ecommerce.project.security;

import com.ecommerce.project.model.*;
import com.ecommerce.project.repositories.AddressRepository;
import com.ecommerce.project.repositories.CategoryRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.RoleRepository;
import com.ecommerce.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ecommerce.project.security.jwt.AuthEntryPointJwt;
import com.ecommerce.project.security.jwt.AuthTokenFilter;
import com.ecommerce.project.security.services.UserDetailsServiceImpl;

import java.util.Set;

@Configuration
@EnableWebSecurity
// @EnableMethodSecurity
public class WebSecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/seller/**").hasAnyRole("ADMIN", "SELLER")
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/order/stripe-client-secret").permitAll()
                        .requestMatchers("/api/paypal/**").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        http.headers(headers -> headers.frameOptions(
                frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    @Value("${frontend.url}")
    private String frontEndUrl;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedOrigin("http://localhost:3000");
        // Add production frontend URL (strip trailing slash for exact origin match)
        String cleanUrl = frontEndUrl.endsWith("/")
                ? frontEndUrl.substring(0, frontEndUrl.length() - 1)
                : frontEndUrl;
        if (!cleanUrl.contains("localhost")) {
            configuration.addAllowedOrigin(cleanUrl);
        }
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.addExposedHeader("Set-Cookie");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web -> web.ignoring().requestMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**"));
    }

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            AddressRepository addressRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Retrieve or create roles
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseGet(() -> {
                        Role newUserRole = new Role(AppRole.ROLE_USER);
                        return roleRepository.save(newUserRole);
                    });

            Role sellerRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER)
                    .orElseGet(() -> {
                        Role newSellerRole = new Role(AppRole.ROLE_SELLER);
                        return roleRepository.save(newSellerRole);
                    });

            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> {
                        Role newAdminRole = new Role(AppRole.ROLE_ADMIN);
                        return roleRepository.save(newAdminRole);
                    });

            Set<Role> userRoles = Set.of(userRole);
            Set<Role> sellerRoles = Set.of(sellerRole);
            Set<Role> adminRoles = Set.of(userRole, sellerRole, adminRole);

            // Added categories
            Category electronics = categoryRepository.findByCategoryName("Electronics")
                    .orElseGet(() -> {
                        Category cat = new Category();
                        cat.setCategoryName("Electronics");
                        return categoryRepository.save(cat);
                    });

            // Added categories
            Category fashion = categoryRepository.findByCategoryName("Fashion")
                    .orElseGet(() -> {
                        Category cat = new Category();
                        cat.setCategoryName("Fashion");
                        return categoryRepository.save(cat);
                    });

            Category footwear = categoryRepository.findByCategoryName("Footwear")
                    .orElseGet(() -> {
                        Category cat = new Category();
                        cat.setCategoryName("Footwear");
                        return categoryRepository.save(cat);
                    });

            Category books = categoryRepository.findByCategoryName("Books")
                    .orElseGet(() -> {
                        Category cat = new Category();
                        cat.setCategoryName("Books");
                        return categoryRepository.save(cat);
                    });

            // Create users if not already present
            if (!userRepository.existsByUserNameIgnoreCase("user1")) {
                User user1 = new User("user1", "user1@example.com", passwordEncoder.encode("password1"));
                userRepository.save(user1);
            }

            if (!userRepository.existsByUserNameIgnoreCase("seller1")) {
                User seller1 = new User("seller1", "seller1@example.com", passwordEncoder.encode("password2"));
                userRepository.save(seller1);
            }

            if (!userRepository.existsByUserNameIgnoreCase("admin")) {
                User admin = new User("admin", "admin@example.com", passwordEncoder.encode("admin123"));
                admin.setRoles(adminRoles);
                userRepository.save(admin);

                // Add address for admin
                Address address = new Address("123 Tech Lane", "Innovation Park", "Silicon Valley", "California", "USA",
                        "94025");
                address.setUser(admin);
                addressRepository.save(address);
            }
            // Seed Products if empty
            User seller = userRepository.findByUserNameIgnoreCase("seller1").orElse(null);

            if (seller != null) {
                // Previous products (check if exist or just add new)
                if (productRepository.findByProductName("Canvas Shoes").isEmpty()) {
                    Product shoes = new Product();
                    shoes.setProductName("Canvas Shoes");
                    shoes.setDescription("Comfortable everyday canvas shoes");
                    shoes.setQuantity(20);
                    shoes.setPrice(45.0);
                    shoes.setSpecialPrice(39.0);
                    shoes.setCategory(footwear);
                    shoes.setUser(seller);
                    shoes.setImage("shoes.jpg");
                    productRepository.save(shoes);
                }

                if (productRepository.findByProductName("Java Programming").isEmpty()) {
                    Product book = new Product();
                    book.setProductName("Java Programming");
                    book.setDescription("Complete guide to Java development");
                    book.setQuantity(30);
                    book.setPrice(55.0);
                    book.setSpecialPrice(49.0);
                    book.setCategory(books);
                    book.setUser(seller);
                    book.setImage("book.jpg");
                    productRepository.save(book);
                }

                if (productRepository.findByProductName("Gaming Keyboard").isEmpty()) {
                    Product keyboard = new Product();
                    keyboard.setProductName("Gaming Keyboard");
                    keyboard.setDescription("Mechanical RGB gaming keyboard");
                    keyboard.setQuantity(15);
                    keyboard.setPrice(89.0);
                    keyboard.setSpecialPrice(75.0);
                    keyboard.setCategory(electronics);
                    keyboard.setUser(seller);
                    keyboard.setImage("keyboard.jpg");
                    productRepository.save(keyboard);
                }

                if (productRepository.findByProductName("Smart Watch").isEmpty()) {
                    Product watch = new Product();
                    watch.setProductName("Smart Watch");
                    watch.setDescription("Multifunctional smart watch with heart rate monitor");
                    watch.setQuantity(25);
                    watch.setPrice(199.0);
                    watch.setSpecialPrice(159.0);
                    watch.setCategory(electronics);
                    watch.setUser(seller);
                    watch.setImage("watch.jpg");
                    productRepository.save(watch);
                }

                // Ensure all products have the correct high-quality photos
                productRepository.findByProductName("Smart Phone").ifPresent(p -> {
                    if (p.getImage().equals("default.png") || p.getImage().isEmpty()) {
                        p.setImage("smartphone.jpg");
                        productRepository.save(p);
                    }
                });
                productRepository.findByProductName("Laptop Pro").ifPresent(p -> {
                    if (p.getImage().equals("default.png") || p.getImage().isEmpty()) {
                        p.setImage("laptop.jpg");
                        productRepository.save(p);
                    }
                });
                productRepository.findByProductName("Cool T-Shirt").ifPresent(p -> {
                    if (p.getImage().equals("default.png") || p.getImage().isEmpty()) {
                        p.setImage("tshirt.jpg");
                        productRepository.save(p);
                    }
                });
                productRepository.findByProductName("Canvas Shoes").ifPresent(p -> {
                    if (p.getImage().equals("default.png") || p.getImage().isEmpty()) {
                        p.setImage("shoes.jpg");
                        productRepository.save(p);
                    }
                });
                productRepository.findByProductName("Java Programming").ifPresent(p -> {
                    if (p.getImage().equals("default.png") || p.getImage().isEmpty()) {
                        p.setImage("book.jpg");
                        productRepository.save(p);
                    }
                });
                productRepository.findByProductName("Gaming Keyboard").ifPresent(p -> {
                    if (p.getImage().equals("default.png") || p.getImage().isEmpty()) {
                        p.setImage("keyboard.jpg");
                        productRepository.save(p);
                    }
                });
                productRepository.findByProductName("Smart Watch").ifPresent(p -> {
                    if (p.getImage().equals("default.png") || p.getImage().isEmpty()) {
                        p.setImage("watch.jpg");
                        productRepository.save(p);
                    }
                });
            }
        };
    }

}