package com.ecommerce.project.controller;

import com.ecommerce.project.service.PaypalService;
import com.paypal.http.HttpResponse;
import com.paypal.orders.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
public class PaypalController {

    @Autowired
    private PaypalService paypalService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            Double amount = Double.parseDouble(data.get("amount").toString());
            HttpResponse<Order> response = paypalService.createOrder(amount);
            return new ResponseEntity<>(response.result(), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/capture-order")
    public ResponseEntity<?> captureOrder(@RequestBody Map<String, String> data) {
        try {
            String orderId = data.get("orderId");
            HttpResponse<Order> response = paypalService.captureOrder(orderId);
            return new ResponseEntity<>(response.result(), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
