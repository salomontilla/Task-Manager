package sml.project.taskManager.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.util.UriComponentsBuilder;
import sml.project.taskManager.models.*;
import sml.project.taskManager.repositories.UserRepository;
import sml.project.taskManager.security.JwtUtil;

import java.net.URI;

import static org.springframework.web.servlet.function.ServerResponse.created;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtUtil jwtService;


    @PostMapping("/login")
    public ResponseEntity loginUser(@RequestBody UserDTO userDto) {
        try{
        Authentication auth = new UsernamePasswordAuthenticationToken(userDto.username(), userDto.password());
        Authentication authUser = authManager.authenticate(auth);
        String token = jwtService.generateToken((DetailsUser) authUser.getPrincipal());
        return ResponseEntity.ok(new JwtDto(token));
        }catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        }
    }
}