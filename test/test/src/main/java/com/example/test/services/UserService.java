package com.example.test.services;
import com.example.test.Dto.LoginDto;
import com.example.test.Dto.RegisterDto;
import com.example.test.models.Posts;
import com.example.test.models.Users;
import com.example.test.respositories.UserRespo;
import com.example.test.util.EmailUtil;
import com.example.test.util.OtpUtil;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRespo userRespo;
    private final PasswordEncoder passwordEncoder;
    private JavaMailSender mailSender;

    @Autowired
    public UserService(UserRespo userRespo, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.userRespo = userRespo;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    public List<Users> getAll() {
        return userRespo.findAll();
    }
    public Optional<Users>getUserId(Long id){
        return userRespo.findById(id);
    }
    @Transactional
    public void deleteUserById(Long id){
        userRespo.deleteById(id);
    }

    @Transactional
    public Users save(Users user) {

        if (userRespo.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists."); // Ném Exception để hủy giao dịch
        }

        //mã hóa password
        if (user.getRole() == null) {
            user.setRole(Users.Role.USER); // Mặc định vai trò USER
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreated_at(LocalDate.now());
        return userRespo.save(user);
    }


    @Transactional
    public ResponseEntity<Users> loginUser(LoginDto loginDto) {
        Optional<Users> userOptional = userRespo.findByUsername(loginDto.getUsername());
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            boolean isPasswordMatch = passwordEncoder.matches(loginDto.getPassword(), user.getPassword());
            if (isPasswordMatch) {
                    return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public Optional<Users> getUserByUsername(String username) {
        return userRespo.findByUsername(username);
    }

    @Transactional
    public Users update(Long id, Users user) {
        // Tìm người dùng trong cơ sở dữ liệu
        Users existingUser = userRespo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
        if (user.getFullname() != null) {
            existingUser.setFullname(user.getFullname());
        }
        if (user.getEmail() != null) {
            existingUser.setEmail(user.getEmail());
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            // Mã hóa mật khẩu mới
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Lưu người dùng vào cơ sở dữ liệu
        return userRespo.save(existingUser);
    }
}
