package sml.project.taskManager.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sml.project.taskManager.models.*;
import sml.project.taskManager.services.TaskService;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity <List<Task>> getTasks(User user) {
        var tasks = taskService.getTasksByUser(user);
        if (tasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody TaskDTO task, @AuthenticationPrincipal DetailsUser user) {
        Task createdTask = taskService.createTask(user.getUser().getId(), new Task(task));
        Date creationDate = taskService.getCreationDate(createdTask.getId());

        return ResponseEntity.status(201).body(new TaskResponseDTO(createdTask.getId(), createdTask.getTitle(), createdTask.getDescription(),
                createdTask.getStatus().toString(), creationDate, createdTask.getUser().getId()));
    }
}
