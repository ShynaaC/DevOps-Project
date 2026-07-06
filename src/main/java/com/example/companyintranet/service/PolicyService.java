package com.example.companyintranet.service;

import com.example.companyintranet.model.Policy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PolicyService {

    private final List<Policy> policies = new ArrayList<>();

    public PolicyService() {

        policies.add(new Policy(
                1L,
                "Work From Home Policy",
                "Employees may work remotely up to two days per week.",
                "HR",
                "2026-07-01"
        ));

        policies.add(new Policy(
                2L,
                "Leave Policy",
                "Employees are entitled to 24 annual leave days.",
                "HR",
                "2026-06-15"
        ));
    }

    public List<Policy> getAllPolicies() {
        return policies;
    }

    public Policy addPolicy(Policy policy) {
        policies.add(policy);
        return policy;
    }
}