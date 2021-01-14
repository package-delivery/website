package com.packagedelivery.website;

import com.packagedelivery.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.objenesis.instantiator.basic.NewInstanceInstantiator;
import org.springframework.web.bind.annotation.*;


@SpringBootApplication
@RestController
public class WebsiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebsiteApplication.class, args);
	}

	@PostMapping("/matrix")
	public String postMatrix(@RequestBody String matrix) {
		String algorithm = matrix.substring(0, 2);
		matrix = matrix.substring(2);

		if(CsvReader.readString(matrix) == false){
			System.out.println("Error parsing csv file");
		}
		if(algorithm.equals("nn")){
			NearestNeighbor nn = new NearestNeighbor(CsvReader.getCityMatrix()[0].getCityName());
			return nn.getResult().toString();
		}else if(algorithm.equals("bf")) {
			BetterBruteForce bf = new BetterBruteForce(CsvReader.getCityMatrix()[0].getCityName());
			return bf.getResult().toString();
		}else if(algorithm.equals("ni")) {
			NearestInsertion ni = new NearestInsertion(CsvReader.getCityMatrix()[0].getCityName());
			return ni.getResult().toString();
		}else{
			return "";
		}
	}

	@GetMapping("/test")
	public String getTest() {
		return "Hello";
	}

}
