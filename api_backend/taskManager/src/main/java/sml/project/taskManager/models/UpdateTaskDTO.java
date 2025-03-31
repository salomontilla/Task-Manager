package sml.project.taskManager.models;

public record UpdateTaskDTO (
        Long id,
        String title,
        String description,
        String status
) {
}
