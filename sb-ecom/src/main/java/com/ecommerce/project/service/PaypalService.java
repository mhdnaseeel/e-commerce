package com.ecommerce.project.service;

import com.paypal.http.HttpResponse;
import com.paypal.orders.Order;

import java.io.IOException;

public interface PaypalService {
    HttpResponse<Order> createOrder(Double amount) throws IOException;
    HttpResponse<Order> captureOrder(String orderId) throws IOException;
}
