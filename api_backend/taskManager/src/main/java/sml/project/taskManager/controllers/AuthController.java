package sml.project.taskManager.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    //Este método se encarga de autenticar al usuario
    @PostMapping("/register")
    public String registerUser() {
        return "Register user";
    }
    @PostMapping("/login")
    public String loginUser() {
        return "Login user";
    }
}