package sml.project.taskManager.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;
import sml.project.taskManager.models.User;
import sml.project.taskManager.models.UserRegisterDTO;
import sml.project.taskManager.models.UserResponseDTO;
import sml.project.taskManager.repositories.UserRepository;

import java.net.URI;
@RestController()
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity registerUser(@RequestBody UserRegisterDTO userDto, UriComponentsBuilder uriBuilder) {

        if (userRepository.existsByUsername(userDto.username())) {
            return ResponseEntity.badRequest().body("This username is already in use.");
        }
        if (userRepository.existsByEmail(userDto.email())) {
            return ResponseEntity.badRequest().body("This email is already in use.");
        }
        String hashedPassword = passwordEncoder.encode(userDto.password());
        User newUser = new User(userDto.username(), userDto.email(), hashedPassword);
        userRepository.save(newUser);
        UserResponseDTO userResponse = new UserResponseDTO(newUser.getId(), newUser.getUsername(), newUser.getEmail());
        URI url = uriBuilder.path("/user/{id}").buildAndExpand(newUser.getId()).toUri();
        return ResponseEntity.created(url).body(userResponse);
    }
}
