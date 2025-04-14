package sml.project.taskManager.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import sml.project.taskManager.models.DetailsUser;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class JwtUtil {
    @Value("${api.security.secret}")
    private static String SECRET_KEY = "123456";

    public String generateToken(DetailsUser user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
            return JWT.create()
                    .withIssuer("Salomontilla")
                    .withSubject(user.getUsername())
                    .withClaim("id", user.getId())
                    .withExpiresAt(generateExpirationTime())
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            throw new RuntimeException(exception);
        }
    }

    public Instant generateExpirationTime() {
        return Instant.now().plus(1, ChronoUnit.HOURS);
    }

    public boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer("Salomontilla")
                    .build();

            verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false;
        }
    }
    public String extractUsername(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer("Salomontilla")
                    .build()
                    .verify(token);

            return decodedJWT.getSubject();

        } catch (JWTVerificationException e) {
            throw new RuntimeException("Token inválido o expirado", e);
        }
    }

}
