package sml.project.taskManager.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sml.project.taskManager.models.Task;
import sml.project.taskManager.models.User;
import sml.project.taskManager.repositories.TaskRepository;
import sml.project.taskManager.repositories.UserRepository;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Task createTask(Long id, Task task) {
        task.setCreatedAt(new Date());
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        task.setUser(user);
        return taskRepository.save(task);
    }

    public Date getCreationDate(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return task.getCreatedAt();
    }

    public List<Task> getTasksByUserId(Long id) {
        return taskRepository.findByUserId(id);
    }

    public Task updateTask(Long id, Task task) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setStatus(task.getStatus());
        return taskRepository.save(existingTask);
    }
}
