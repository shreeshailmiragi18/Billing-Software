package in.shree.billingSoftware.controller;


import in.shree.billingSoftware.io.AuthRequest;
import in.shree.billingSoftware.io.AuthResponse;
import in.shree.billingSoftware.service.UserService;
import in.shree.billingSoftware.service.impl.AppUserDetailsService;
import in.shree.billingSoftware.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RequiredArgsConstructor
@RestController

public class AuthController  {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) throws Exception {
          authenticate(request.getEmail(), request.getPassword());
          final UserDetails userDetails = appUserDetailsService.loadUserByUsername(request.getEmail());
           final String jwtToken = jwtUtil.generateToken(userDetails);
            String role= userService.getUserRole(request.getEmail());
           return new AuthResponse(request.getEmail(),jwtToken,role );

    }

    private void authenticate(String email,String password) throws Exception{
        try{
             authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        }catch(DisabledException e){
              throw new  Exception("User disables");
        }catch(BadCredentialsException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Incorrect Email or Password");
        }
    }

@PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String, String> request){
    return passwordEncoder.encode(request.get("password"));
}
}
