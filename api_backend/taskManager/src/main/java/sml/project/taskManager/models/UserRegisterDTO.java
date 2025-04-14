package sml.project.taskManager.models;

public record UserRegisterDTO(
        Long id,
        String username,
        String email,
        String password
) {
}
