package com.ecommerce.project.service;

import com.ecommerce.project.payload.StripePaymentDto;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerSearchResult;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerSearchParams;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class StripeServiceImpl implements StripeService {

    @Value("${stripe.secret.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init(){
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentIntent paymentIntent(StripePaymentDto stripePaymentDto) throws StripeException {
        System.out.println("Step 1: Searching for customer with email: " + stripePaymentDto.getEmail());
        Customer customer;
        // Retrieve and check if customer exist
        CustomerSearchParams searchParams =
                CustomerSearchParams.builder()
                        .setQuery("email:'" + stripePaymentDto.getEmail() + "'")
                        .build();
        
        CustomerSearchResult customers = Customer.search(searchParams);
        System.out.println("Step 2: Customer search completed. Found: " + customers.getData().size());

        if (customers.getData().isEmpty()) {
            System.out.println("Step 3a: Creating new customer...");
            // Create new customer
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(stripePaymentDto.getEmail())
                    .setName(stripePaymentDto.getName())
                    .setAddress(
                            CustomerCreateParams.Address.builder()
                                    .setLine1(stripePaymentDto.getAddress().getStreet())
                                    .setCity(stripePaymentDto.getAddress().getCity())
                                    .setState(stripePaymentDto.getAddress().getState())
                                    .setPostalCode(stripePaymentDto.getAddress().getPincode())
                                    .setCountry(stripePaymentDto.getAddress().getCountry())
                                    .build()
                    )
                    .build();

            customer = Customer.create(customerParams);
            System.out.println("Step 4a: Customer created with ID: " + customer.getId());
        } else {
            System.out.println("Step 3b: Using existing customer...");
            // Fetch the customer that exist
            customer = customers.getData().get(0);
            System.out.println("Step 4b: Found customer ID: " + customer.getId());
        }

        System.out.println("Step 5: Creating PaymentIntent...");
        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(stripePaymentDto.getAmount())
                        .setCurrency(stripePaymentDto.getCurrency())
                        .setCustomer(customer.getId())
                        .setDescription(stripePaymentDto.getDescription())
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);
            System.out.println("Step 6: PaymentIntent created successfully with ID: " + intent.getId());
            return intent;
        } catch (StripeException e) {
            System.err.println("CRITICAL: Stripe PaymentIntent creation failed!");
            System.err.println("Error Message: " + e.getMessage());
            System.err.println("Stripe Code: " + e.getCode());
            throw e;
        }
    }
}
