package com.example.kurullo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.kurullo.dto.LoginRequest;
import com.example.kurullo.dto.LoginResponse;
import com.example.kurullo.model.User;
import com.example.kurullo.repository.UserRepository;
import com.example.kurullo.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == User.Status.SUSPENDED)
            throw new RuntimeException("Account suspended");

        if (user.getStatus() == User.Status.DELETED)
            throw new RuntimeException("Account not found");

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
            user.getId(),
            token, // must be String
            user.getRole().name(),
            user.isFirstLogin(),
            user.isProfileCompleted(),
            user.getUsername()
        );
    }

    public void register(String username, String email, String password) {
        if (userRepository.existsByEmail(email))
            throw new RuntimeException("Email already in use");

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public void completeGoogleRegistration(String username, String email, String googleId) {
        if (userRepository.existsByEmail(email))
            throw new RuntimeException("Email already in use");

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setGoogleId(googleId);
        userRepository.save(user);
    }
}