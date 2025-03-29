package sml.project.taskManager.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Status status;
    private Date createdAt;
    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Task(TaskDTO task) {
        this.title = task.title();
        this.description = task.description();
        this.status = task.status();
    }

}
