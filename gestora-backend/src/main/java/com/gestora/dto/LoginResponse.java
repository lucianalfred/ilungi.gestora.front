package com.gestora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.gestora.model.User;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UserDTO user;

    public static LoginResponse of(String token, User user) {
        return LoginResponse.builder()
            .token(token)
            .user(UserDTO.of(user))
            .build();
    }
}
