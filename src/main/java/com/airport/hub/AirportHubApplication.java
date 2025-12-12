package com.airport.hub;

import com.airport.hub.model.User;
import com.airport.hub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class AirportHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(AirportHubApplication.class, args);
    }

    @Bean
    public CommandLineRunner createDefaultAdmin(UserRepository userRepository) {
        return args -> {
            String adminEmail = "admin@airport-hub.com";
            String adminPassword = "Admin@123";

            if (!userRepository.existsByEmail(adminEmail)) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setFullName("Super Admin");
                admin.setPassword(encoder.encode(adminPassword));
                admin.setRole("ADMIN");

                userRepository.save(admin);
            }
        };
    }
}
