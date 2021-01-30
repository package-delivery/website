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
	    String visualization = matrix.substring(0, 1);
	    matrix = matrix.substring(1);
		String algorithm = matrix.substring(0, 2);
		matrix = matrix.substring(2);
		if(!algorithm.equals("ch") && CsvReader.readString(matrix) == false){
			System.out.println("Error parsing csv file");
		}
		if(algorithm.equals("nn")){
			// TODO: Add visualization
			if(visualization.equals("1")){
				NearestNeighbor nn = new NearestNeighbor(CsvReader.getCityMatrix()[0].getCityName());
				return nn.getResult().toString();
			}else{
				NearestNeighbor nn = new NearestNeighbor(CsvReader.getCityMatrix()[0].getCityName());
				return nn.getResult().toString();
			}
		}else if(algorithm.equals("bf")) {
			// TODO: Add visualization
			if(visualization.equals("1")){
				BruteForce bf = new BruteForce(CsvReader.getCityMatrix()[0].getCityName());
				return bf.getResult().toString();
			}else{
				BruteForce bf = new BruteForce(CsvReader.getCityMatrix()[0].getCityName());
				return bf.getResult().toString();
			}
		}else if(algorithm.equals("ni")) {
			if(visualization.equals("1")){
				NearestInsertion ni = new NearestInsertion(CsvReader.getCityMatrix()[0].getCityName(), true);
				return ni.getResult().toString() + ni.getVisualization();
			}else{
				NearestInsertion ni = new NearestInsertion(CsvReader.getCityMatrix()[0].getCityName());
				return ni.getResult().toString();
			}
		}else if(algorithm.equals("sa")) {
			if(visualization.equals("1")){
				SimulatedAnnealing sa = new SimulatedAnnealing(CsvReader.getCityMatrix()[0].getCityName(), true);
				return sa.getResult().toString() + sa.getVisualization();
			}else{
				SimulatedAnnealing sa = new SimulatedAnnealing(CsvReader.getCityMatrix()[0].getCityName());
				return sa.getResult().toString();
			}
		}else if(algorithm.equals("ch")){
			if(visualization.equals("1")){
				ConvexHull ch = new ConvexHull(matrix, true);
				return ch.getResult().toString() + ch.getVisualization();
			}else{
				ConvexHull ch = new ConvexHull(matrix);
				return ch.getResult().toString();
			}
		}else{
			return "";
		}
	}

	@GetMapping("/test")
	public String getTest() {
		return "Hello";
	}

}
