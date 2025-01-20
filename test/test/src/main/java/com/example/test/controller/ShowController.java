package com.example.test.controller;
import com.example.test.models.Users;
import com.example.test.respositories.UserRespo;
import com.example.test.services.PostService;
import com.example.test.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3001") // Cho phép frontend truy cập
@RequestMapping("/api")
@AllArgsConstructor
public class ShowController {
    @Autowired
    private PostService postService;
    private UserService userService;
    private UserRespo userRespo;

    @Autowired
    private JavaMailSender mailSender;


    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        Optional<Users> user = userService.getUserId(id);
        if (user.isPresent()) {
           userService.deleteUserById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/users")
    public ResponseEntity<Users> getUseByUserName(@RequestParam String username) {
        Optional<Users> user = userService.getUserByUsername(username);
//        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        }

    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Users> getUseByUserName( @PathVariable(required = false) Long id) {
        Optional<Users> users = userService.getUserId(id);
            return new ResponseEntity<>(users.get(), HttpStatus.OK);
    }
    @PutMapping("/user/{id}")
    public ResponseEntity<Users> UpdateUsers(@PathVariable Long id, @RequestBody Users user) {
        try {
            Users updatedUser = userService.update(id, user);
            return ResponseEntity.ok(updatedUser); // 200 OK với người dùng đã cập nhật
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404 nếu người dùng không tồn tại
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 500 cho lỗi khác
        }
    }


    private void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }
    @PostMapping("/forgot-password")
    public String sendResetPasswordEmail(@RequestParam String email) {
        Optional<Users> userOptional = userRespo.findByEmail(email);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();

            // Tạo reset token
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);

            // Đặt thời gian hết hạn token (5 phút từ thời điểm hiện tại)
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(5));
            userRespo.save(user);

            // Gửi email
            sendEmail(user.getEmail(), "Reset Password", "Token để đặt lại mật khẩu: " + token);

            return "Email đặt lại mật khẩu đã được gửi!";
        } else {
            throw new RuntimeException("Email không tồn tại!");
        }
    }


    // Xử lý reset password

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<Users> userOptional = userRespo.findByResetToken(token);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();

            if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                user.setResetToken(null);
                user.setResetTokenExpiry(null);
                userRespo.save(user);

                throw new RuntimeException("Token đã hết hạn và đã bị xóa!");            }

            // Mã hóa mật khẩu trước khi lưu
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = passwordEncoder.encode(newPassword); // Mã hóa mật khẩu

            // Cập nhật mật khẩu đã mã hóa
            user.setPassword(encodedPassword);
            user.setResetToken(null); // Xóa token sau khi sử dụng
            user.setResetToken(null); // Xóa token sau khi sử dụng
            userRespo.save(user);

            return "Mật khẩu đã được đặt lại thành công!";
        } else {
            throw new RuntimeException("Token không hợp lệ!");
        }
    }



}



