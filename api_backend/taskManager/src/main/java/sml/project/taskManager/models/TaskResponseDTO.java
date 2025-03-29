package sml.project.taskManager.models;

import java.util.Date;

public record TaskResponseDTO(
        Long id,
        String title,
        String description,
        String status,
        Date createdAt,
        Long userId
) {
}
