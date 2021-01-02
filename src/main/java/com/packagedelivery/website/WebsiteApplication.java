package com.packagedelivery.website;

import com.packagedelivery.CsvReader;
import com.packagedelivery.NearestNeighbor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

@SpringBootApplication
@RestController
public class WebsiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebsiteApplication.class, args);
	}

	@PostMapping("/matrix")
	public String postMatrix(@RequestBody String matrix) {
		// TODO: Creating a file everytime is not optimal
		// Create CSV-File with adjazenzmatrix
		try {
			File file = new File("src/main/resources/matrix.csv");
			file.createNewFile();
			FileWriter writer = new FileWriter("src/main/resources/matrix.csv");
			writer.write(matrix);
			writer.close();
		} catch (IOException e) {
			System.out.println("Error opening or creating the file");
			e.printStackTrace();
		}

		if(CsvReader.readCsvFile("matrix.csv") == false){
			System.out.println("Error parsing csv file");
		}
		// TODO: create algorithm chooser
		NearestNeighbor nn = new NearestNeighbor(CsvReader.getCityMatrix()[0].getCityName());
		// TODO: return in a better format
		return nn.getResult().toString();
	}

	@GetMapping("/test")
	public String getTest() {
		return "Hello";
	}

}
