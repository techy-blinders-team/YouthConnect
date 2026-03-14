package com.youthconnect.youthconnect_id;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Nakadisable muna to hanggat di pa nacconfigure yung database for ci to
@SpringBootTest
@Disabled("Disabled until Redis and database are configured")
class YouthconnectIdApplicationTests {

	@Test
	void contextLoads() {
	}

}
