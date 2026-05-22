package com.example.kurullo.security;

import com.example.kurullo.model.User;
import com.example.kurullo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String googleId = oauthUser.getAttribute("sub");

        boolean isNew = !userRepository.existsByEmail(email);

        if (isNew) {
            // Redirect to complete registration — don't create user yet
            response.sendRedirect("http://localhost:8081/complete-registration?email=" + email + "&googleId=" + googleId);
            return;
        }

        User user = userRepository.findByEmail(email).orElseThrow();
        String token = jwtUtil.generateToken(email);

        response.sendRedirect("http://localhost:8081/oauth2/success?token=" + token
                + "&role=" + user.getRole()
                + "&isFirstLogin=" + user.isFirstLogin()
                + "&profileCompleted=" + user.isProfileCompleted());
    }
}