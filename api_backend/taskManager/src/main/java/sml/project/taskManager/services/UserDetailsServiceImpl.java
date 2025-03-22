package sml.project.taskManager.services;

import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import sml.project.taskManager.models.DetailsUser;
import sml.project.taskManager.models.User;
import sml.project.taskManager.repositories.UserRepository;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private UserRepository userRepository;

    @Override
    public DetailsUser loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (userRepository.findByUsername(username) == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new DetailsUser(user);
    }
}
