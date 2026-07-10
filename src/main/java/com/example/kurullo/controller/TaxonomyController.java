package com.example.kurullo.controller;

import com.example.kurullo.model.BirdFamily;
import com.example.kurullo.model.BirdOrder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class TaxonomyController {

    @GetMapping("/bird-orders")
    public List<String> getOrders() {
        return Arrays.stream(BirdOrder.values())
                .map(BirdOrder::getDisplayName)
                .collect(Collectors.toList());
    }

    @GetMapping("/bird-families")
    public List<Map<String, String>> getFamilies() {
        return Arrays.stream(BirdFamily.values())
                .map(f -> Map.of("family", f.getDisplayName(), "category", f.getCategory()))
                .collect(Collectors.toList());
    }
}