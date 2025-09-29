package in.shree.billingSoftware.service.impl;

import in.shree.billingSoftware.entity.UserEntity;
import in.shree.billingSoftware.io.UserRequest;
import in.shree.billingSoftware.io.UserResponse;
import in.shree.billingSoftware.repository.UserRepository;
import in.shree.billingSoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    @Override
    public UserResponse createUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    private UserResponse convertToResponse(UserEntity newUser) {
        return  UserResponse.builder()
                .name(newUser.getName())
                .email(newUser.getEmail())
                .userId(newUser.getUserId())
                .updatedAt(String.valueOf(newUser.getUpdatedAt()))
                .createdAt(String.valueOf(newUser.getCreatedAt()))
                .role(newUser.getRole())
                .build();

    }

    private UserEntity convertToEntity(UserRequest request) {
        return UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole().toUpperCase())
                .name(request.getName())
                .build();
    }

    @Override
    public String getUserRole(String email) {
      UserEntity existingUser = userRepository.findByEmail(email)
              .orElseThrow(() -> new UsernameNotFoundException("User not found for the email: "+ email));
      return existingUser.getRole();
    }

    @Override
    public List<UserResponse> readUsers() {
         return userRepository.findAll()
                 .stream()
                 .map(user->convertToResponse(user))
                 .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        UserEntity existingUser=userRepository.findByUserId(id)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
        userRepository.delete(existingUser);

    }
}
