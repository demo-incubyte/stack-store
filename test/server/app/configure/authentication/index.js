import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class SessionCookieNameTest {

    @Test
    public void testSessionCookieNameIsNotDefault() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockHttpSession session = new MockHttpSession();
        MockEnvironment environment = new MockEnvironment();
        environment.setProperty("SESSION_SECRET", "test_secret");

        // Set up the session with a custom name
        session.setSessionId("custom_session_id");
        request.setSession(session);

        // Simulate the session middleware
        sessionMiddleware(request, response, environment);

        // Assert that the session cookie name is not the default one
        assertNotEquals("connect.sid", response.getCookie("connect.sid").getName());
    }

    private void sessionMiddleware(MockHttpServletRequest request, MockHttpServletResponse response, MockEnvironment environment) {
        // This is a simplified version of the session middleware logic
        // where we check if the session cookie name is not the default one.
        String sessionSecret = environment.getProperty("SESSION_SECRET");
        if (sessionSecret != null && !sessionSecret.isEmpty()) {
            // Normally, you would set up the session handling here with the secret
            // and make sure the cookie name is not the default 'connect.sid'.
            // For this test, we just need to check the cookie name.
            response.addCookie(new javax.servlet.http.Cookie("custom_session_id", sessionSecret));
        }
    }
}