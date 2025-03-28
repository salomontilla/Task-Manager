package sml.project.taskManager.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import sml.project.taskManager.models.DetailsUser;
import sml.project.taskManager.models.JwtDto;
import sml.project.taskManager.models.User;
import sml.project.taskManager.models.UserDTO;
import sml.project.taskManager.security.JwtUtil;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtUtil jwtService;

    @PostMapping("/register")
    public String registerUser() {
        return "Register user";
    }
    @PostMapping("/login")
    public ResponseEntity<JwtDto> loginUser(@RequestBody UserDTO userDto) {
        Authentication auth = new UsernamePasswordAuthenticationToken(userDto.username(), userDto.password());
        Authentication authUser = authManager.authenticate(auth);
        String token = jwtService.generateToken((DetailsUser) authUser.getPrincipal());
        return ResponseEntity.ok(new JwtDto(token));
    }
}