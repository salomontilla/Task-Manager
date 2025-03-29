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

    public List<Task> getTasksByUser(User user){
        return taskRepository.findByUser(user);
    }

    public Task createTask(Long id, Task task) {
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
}
