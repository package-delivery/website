package com.packagedelivery.website;

import com.packagedelivery.*;
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
		String algorithm = matrix.substring(0, 2);
		matrix = matrix.substring(2);

		if(CsvReader.readString(matrix) == false){
			System.out.println("Error parsing csv file");
		}
		if(algorithm.equals("nn")){
			System.out.println("Nearest Neighbor begin");
			NearestNeighbor nn = new NearestNeighbor(CsvReader.getCityMatrix()[0].getCityName());
			System.out.println("Nearest Neighbor done");
			return nn.getResult().toString();
		}else if(algorithm.equals("bf")) {
			System.out.println("Brute Force begin");
			BruteForce bf = new BruteForce(CsvReader.getCityMatrix()[0].getCityName());
			// TODO: Remove this
			System.out.println("Brute Force done");
			return bf.getResult().toString();
		}else if(algorithm.equals("ni")) {
			NearestInsertion ni = new NearestInsertion(CsvReader.getCityMatrix()[0].getCityName());
			return ni.getResult().toString();
		}else if(algorithm.equals("sa")) {
			SimulatedAnnealing sa = new SimulatedAnnealing(CsvReader.getCityMatrix()[0].getCityName());
		   	return sa.getResult().toString();
		}else{
			return "";
		}
	}

	@PostMapping("/coordinates")
	public String postCoordinates(@RequestBody String coordinates) {
	    // Call ConvexHull function with parameter coordinates
		return coordinates;
	}

	@GetMapping("/test")
	public String getTest() {
		return "Hello";
	}

}
