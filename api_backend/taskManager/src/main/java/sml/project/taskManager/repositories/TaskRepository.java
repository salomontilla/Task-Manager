package sml.project.taskManager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sml.project.taskManager.models.Task;
import sml.project.taskManager.models.User;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserId(Long id);
}
