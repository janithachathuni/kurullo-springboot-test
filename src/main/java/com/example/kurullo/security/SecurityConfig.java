package com.example.kurullo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(java.util.List.of(
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175",
                        "https://kurullo-birdblog.vercel.app",

                    "https://kurullo-springboot-test-z8xe-psi.vercel.app"
                ));
                config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(java.util.List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/").permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/api/auth/**", "/oauth2/**", "/login/oauth2/**").permitAll()
            .requestMatchers("/api/profile/**").permitAll()
            .requestMatchers("/api/notifications/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/birds/**", "/api/bird-orders/**", "/api/bird-families/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/birds/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/birds/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/birds/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/posts").hasRole("BIRDER")
            .requestMatchers(HttpMethod.DELETE, "/api/posts/**").authenticated()
            // .requestMatchers(HttpMethod.GET, "/api/posts/*/comments").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/posts/*/comments").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/posts/*/comments/*").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/posts/*/comments/*/like").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/posts/*/like").authenticated()
            .anyRequest().authenticated()
        )
            .exceptionHandling(ex -> ex
                .defaultAuthenticationEntryPointFor(
                    (request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"),
                    request -> request.getRequestURI().startsWith("/api")
                )
            )
            .oauth2Login(oauth -> oauth
                .successHandler(oAuth2LoginSuccessHandler)
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}