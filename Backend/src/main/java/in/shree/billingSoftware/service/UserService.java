package in.shree.billingSoftware.service;

import in.shree.billingSoftware.io.UserRequest;
import in.shree.billingSoftware.io.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

    List<UserResponse> readUsers();

    void deleteUser(String id);
}
