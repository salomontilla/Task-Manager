package sml.project.taskManager.models;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;

    public User(UserRegisterDTO userRegisterDTO) {
        this.username = userRegisterDTO.username();
        this.email = userRegisterDTO.email();
        this.password = userRegisterDTO.password();
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Task> tasks;

    public User(String username, String email, String hashedPassword) {
        this.username = username;
        this.email = email;
        this.password = hashedPassword;
    }
}
