package com.packagedelivery.website;

import com.packagedelivery.CsvReader;
import com.packagedelivery.NearestNeighbor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;


@SpringBootApplication
@RestController
public class WebsiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebsiteApplication.class, args);
	}

	@PostMapping("/matrix")
	public String postMatrix(@RequestBody String matrix) {
		if(CsvReader.readString(matrix) == false){
			System.out.println("Error parsing csv file");
		}
		// TODO: create algorithm chooser
		NearestNeighbor nn = new NearestNeighbor(CsvReader.getCityMatrix()[0].getCityName());
		return nn.getResult().toString();
	}

	@GetMapping("/test")
	public String getTest() {
		return "Hello";
	}

}
