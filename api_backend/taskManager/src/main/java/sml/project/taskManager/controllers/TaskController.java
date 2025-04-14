package sml.project.taskManager.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sml.project.taskManager.models.*;
import sml.project.taskManager.services.TaskService;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity <List<TaskResponseDTO>> getTasks(@AuthenticationPrincipal DetailsUser user) {
        List<Task> tasks = taskService.getTasksByUserId(user.getId());

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<TaskResponseDTO> taskDTOs = tasks.stream().map(task ->
                new TaskResponseDTO(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getStatus().toString(),
                        formatter.format(task.getCreatedAt()),
                        task.getUser().getId()
                )
        ).toList();

        return ResponseEntity.ok(taskDTOs);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody TaskDTO task, @AuthenticationPrincipal DetailsUser user) {
        Task createdTask = taskService.createTask(user.getId(), new Task(task));
        Date creationDate = taskService.getCreationDate(createdTask.getId());
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedDate = formatter.format(creationDate);

        return ResponseEntity.status(201).body(new TaskResponseDTO(createdTask.getId(), createdTask.getTitle(), createdTask.getDescription(),
                createdTask.getStatus().toString(), formattedDate, createdTask.getUser().getId()));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<TaskResponseDTO> updateTask(@RequestBody UpdateTaskDTO task) {
        Task updatedTask = taskService.getTaskById(task.id());
        updatedTask.updateTask(task);
        Date creationDate = taskService.getCreationDate(updatedTask.getId());
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedDate = formatter.format(creationDate);

        return ResponseEntity.status(200).body(new TaskResponseDTO(updatedTask.getId(), updatedTask.getTitle(), updatedTask.getDescription(),
                updatedTask.getStatus().toString(), formattedDate, updatedTask.getUser().getId()));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
