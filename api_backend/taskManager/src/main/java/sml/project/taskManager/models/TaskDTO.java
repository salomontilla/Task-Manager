package sml.project.taskManager.models;

import java.util.Date;

public record TaskDTO(
        String title,
        String description,
        String status
) {
}
